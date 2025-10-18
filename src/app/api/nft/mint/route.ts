import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

// Configure fetch for serverless environment
if (typeof global.fetch === 'undefined') {
  // @ts-ignore
  global.fetch = fetch;
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

    // Connect to Base network - use StaticJsonRpcProvider to avoid network detection
    // Add custom connection info for Vercel serverless
    const connectionInfo = {
      url: rpcUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const provider = new ethers.providers.StaticJsonRpcProvider(
      connectionInfo,
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

    // Parse the event to get token ID
    const event = receipt.events?.find((e: any) => e.event === 'GameNFTMinted');
    const tokenId = event?.args?.tokenId?.toString();

    return NextResponse.json({
      success: true,
      transactionHash: receipt.transactionHash,
      tokenId: tokenId,
      contractAddress: contractAddress,
      recipientAddress: recipientAddress,
      blockNumber: receipt.blockNumber,
      explorerUrl: `https://basescan.org/tx/${receipt.transactionHash}`,
      openseaUrl: `https://opensea.io/assets/base/${contractAddress}/${tokenId}`,
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

