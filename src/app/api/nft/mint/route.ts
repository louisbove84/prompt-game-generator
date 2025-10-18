import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Custom JSON-RPC provider that works in Vercel Edge runtime
class VercelJsonRpcProvider extends ethers.providers.StaticJsonRpcProvider {
  async send(method: string, params: Array<any>): Promise<any> {
    const request = {
      method: method,
      params: params,
      id: this._nextId++,
      jsonrpc: '2.0'
    };

    const response = await fetch(this.connection.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const result = await response.json();

    if (result.error) {
      const error: any = new Error(result.error.message);
      error.code = result.error.code;
      error.data = result.error.data;
      throw error;
    }

    return result.result;
  }
}

// ABI for the mintGameNFT function
const GAME_NFT_ABI = [
  {
    "inputs": [
      { "name": "to", "type": "address" },
      { "name": "uri", "type": "string" }
    ],
    "name": "mintGameNFT",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export async function POST(request: NextRequest) {
  try {
    const { recipientAddress, metadataUri, gamePrompt } = await request.json();

    if (!recipientAddress || !metadataUri) {
      return NextResponse.json(
        { success: false, message: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Validate Ethereum address
    if (!ethers.utils.isAddress(recipientAddress)) {
      return NextResponse.json(
        { success: false, message: 'Invalid recipient address' },
        { status: 400 }
      );
    }

    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    const privateKey = process.env.NFT_MINTER_PRIVATE_KEY;
    const rpcUrl = process.env.NEXT_PUBLIC_BASE_RPC_URL || 'https://mainnet.base.org';

    if (!contractAddress) {
      return NextResponse.json(
        { success: false, message: 'NFT contract not deployed. Please deploy the contract first.' },
        { status: 500 }
      );
    }

    if (!privateKey) {
      return NextResponse.json(
        { success: false, message: 'Minter private key not configured' },
        { status: 500 }
      );
    }

    console.log('🎨 [NFT Mint] Starting NFT mint process...');
    console.log('📝 [NFT Mint] Recipient:', recipientAddress);
    console.log('🔗 [NFT Mint] Metadata URI:', metadataUri);
    console.log('🔗 [NFT Mint] RPC URL:', rpcUrl);

    // Connect to Base network using custom Vercel-compatible provider
    const provider = new VercelJsonRpcProvider(
      rpcUrl,
      {
        name: 'base',
        chainId: 8453,
      }
    );

    const wallet = new ethers.Wallet(privateKey, provider);
    console.log('👛 [NFT Mint] Wallet address:', wallet.address);
    
    // Verify we can get the block number (quick connection test)
    try {
      const blockNumber = await provider.getBlockNumber();
      console.log('🌐 [NFT Mint] Connected to Base network, current block:', blockNumber);
    } catch (connectionError) {
      console.error('❌ [NFT Mint] Connection test failed:', connectionError);
      throw new Error('Failed to connect to Base network. RPC endpoint may be unavailable.');
    }
    
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, GAME_NFT_ABI, wallet);

    // Estimate gas
    const gasEstimate = await contract.estimateGas.mintGameNFT(recipientAddress, metadataUri);
    console.log('⛽ [NFT Mint] Estimated gas:', gasEstimate.toString());

    // Mint the NFT
    const tx = await contract.mintGameNFT(recipientAddress, metadataUri, {
      gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer
    });

    console.log('⏳ [NFT Mint] Transaction sent:', tx.hash);
    console.log('⏳ [NFT Mint] Waiting for confirmation...');

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    console.log('✅ [NFT Mint] Transaction confirmed!');
    console.log('📦 [NFT Mint] Block:', receipt.blockNumber);
    console.log('📝 [NFT Mint] Receipt events:', JSON.stringify(receipt.events, null, 2));

    // Parse the event to get token ID - try multiple methods
    let tokenId: string | undefined;
    
    // Method 1: Look for GameNFTMinted event
    const event = receipt.events?.find((e: any) => e.event === 'GameNFTMinted');
    if (event?.args?.tokenId) {
      tokenId = event.args.tokenId.toString();
      console.log('✅ [NFT Mint] Token ID from GameNFTMinted event:', tokenId);
    }
    
    // Method 2: Look for Transfer event (ERC721 standard)
    if (!tokenId) {
      const transferEvent = receipt.events?.find((e: any) => e.event === 'Transfer');
      if (transferEvent?.args?.tokenId) {
        tokenId = transferEvent.args.tokenId.toString();
        console.log('✅ [NFT Mint] Token ID from Transfer event:', tokenId);
      }
    }
    
    // Method 3: Parse logs manually
    if (!tokenId && receipt.logs && receipt.logs.length > 0) {
      console.log('🔍 [NFT Mint] Parsing logs manually...');
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          console.log('📋 [NFT Mint] Parsed log:', parsed.name, parsed.args);
          if (parsed.name === 'Transfer' || parsed.name === 'GameNFTMinted') {
            if (parsed.args.tokenId) {
              tokenId = parsed.args.tokenId.toString();
              console.log('✅ [NFT Mint] Token ID from parsed log:', tokenId);
              break;
            }
          }
        } catch (e) {
          // Skip logs that don't match our contract
        }
      }
    }
    
    if (!tokenId) {
      console.warn('⚠️ [NFT Mint] Could not extract token ID from receipt');
    }

    // OpenSea URLs for Base network
    // Note: It may take a few minutes for OpenSea to index new NFTs
    const openseaUrl = tokenId ? `https://opensea.io/assets/base/${contractAddress}/${tokenId}` : undefined;
    const nftViewUrl = tokenId ? `https://basescan.org/nft/${contractAddress}/${tokenId}` : `https://basescan.org/tx/${receipt.transactionHash}`;

    return NextResponse.json({
      success: true,
      transactionHash: receipt.transactionHash,
      tokenId: tokenId,
      contractAddress: contractAddress,
      recipientAddress: recipientAddress,
      blockNumber: receipt.blockNumber,
      explorerUrl: `https://basescan.org/tx/${receipt.transactionHash}`,
      nftViewUrl: nftViewUrl, // BaseScan NFT view (works immediately)
      openseaUrl: openseaUrl, // OpenSea (may take time to index)
    });

  } catch (error) {
    console.error('❌ [NFT Mint] Error:', error);
    
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        message: `Failed to mint NFT: ${errorMessage}` 
      },
      { status: 500 }
    );
  }
}

