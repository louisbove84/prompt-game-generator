import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

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

    // Local Hardhat network configuration
    const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // Hardhat account #0
    const rpcUrl = "http://localhost:8545";

    console.log('🎨 [Local NFT Mint] Starting local NFT mint process...');
    console.log('📝 [Local NFT Mint] Recipient:', recipientAddress);
    console.log('🔗 [Local NFT Mint] Metadata URI:', metadataUri);

    // Connect to local Hardhat network
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    // Create contract instance
    const contract = new ethers.Contract(contractAddress, GAME_NFT_ABI, wallet);

    // Mint the NFT
    const tx = await contract.mintGameNFT(recipientAddress, metadataUri);

    console.log('⏳ [Local NFT Mint] Transaction sent:', tx.hash);
    console.log('⏳ [Local NFT Mint] Waiting for confirmation...');

    // Wait for transaction confirmation
    const receipt = await tx.wait();
    
    console.log('✅ [Local NFT Mint] Transaction confirmed!');
    console.log('📦 [Local NFT Mint] Block:', receipt.blockNumber);

    // For local testing, we'll assume token ID is 1 (first mint)
    const tokenId = "1";

    return NextResponse.json({
      success: true,
      transactionHash: receipt.transactionHash,
      tokenId: tokenId,
      contractAddress: contractAddress,
      recipientAddress: recipientAddress,
      blockNumber: receipt.blockNumber,
      explorerUrl: `http://localhost:8545/tx/${receipt.transactionHash}`,
      openseaUrl: `Local NFT - Token ID: ${tokenId}`,
    });

  } catch (error) {
    console.error('❌ [Local NFT Mint] Error:', error);
    
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
