/**
 * Local NFT Service for Testing
 * This service mints NFTs on the local Hardhat network for development/testing
 */

import { uploadImageToIPFS, uploadMetadataToIPFS, NFTMetadata } from './ipfs';

export interface NFTMintResult {
  success: boolean;
  transactionHash?: string;
  tokenId?: string;
  contractAddress?: string;
  explorerUrl?: string;
  openseaUrl?: string;
  error?: string;
}

/**
 * Complete NFT minting flow for local development
 */
export async function mintGameNFTLocal(
  screenshot: Blob,
  recipientAddress: string,
  gamePrompt: string
): Promise<NFTMintResult> {
  try {
    console.log('🎨 [Local NFT Service] Starting local NFT minting flow...');
    console.log('👤 [Local NFT Service] Recipient:', recipientAddress);
    console.log('📝 [Local NFT Service] Game prompt:', gamePrompt);

    // Step 1: Upload screenshot to IPFS
    console.log('📤 [Local NFT Service] Step 1: Uploading screenshot to IPFS...');
    const timestamp = Date.now();
    const imageFilename = `game-screenshot-${timestamp}.png`;
    const imageIpfsUri = await uploadImageToIPFS(screenshot, imageFilename);
    console.log('✅ [Local NFT Service] Screenshot uploaded:', imageIpfsUri);

    // Step 2: Create and upload metadata to IPFS
    console.log('📤 [Local NFT Service] Step 2: Creating and uploading metadata...');
    const metadata: NFTMetadata = {
      name: `AI Game Genesis #${timestamp} (Local)`,
      description: `An AI-generated arcade game: "${gamePrompt}". This NFT represents the first screenshot captured from a custom game created by AI. (Local Development)`,
      image: imageIpfsUri,
      attributes: [
        {
          trait_type: 'Generation Type',
          value: 'AI Generated',
        },
        {
          trait_type: 'Game Prompt',
          value: gamePrompt.substring(0, 100) + (gamePrompt.length > 100 ? '...' : ''),
        },
        {
          trait_type: 'Network',
          value: 'Local Hardhat',
        },
        {
          trait_type: 'Environment',
          value: 'Development',
        },
        {
          trait_type: 'Timestamp',
          value: new Date(timestamp).toISOString(),
        },
      ],
    };

    const metadataUri = await uploadMetadataToIPFS(metadata);
    console.log('✅ [Local NFT Service] Metadata uploaded:', metadataUri);

    // Step 3: Mint the NFT on local network
    console.log('⛓️ [Local NFT Service] Step 3: Minting NFT on local Hardhat network...');
    const response = await fetch('/api/nft/mint-local', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipientAddress,
        metadataUri,
        gamePrompt,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to mint NFT');
    }

    const result = await response.json();
    console.log('✅ [Local NFT Service] NFT minted successfully!');
    console.log('🔗 [Local NFT Service] Transaction:', result.transactionHash);
    console.log('🎯 [Local NFT Service] Token ID:', result.tokenId);

    return {
      success: true,
      transactionHash: result.transactionHash,
      tokenId: result.tokenId,
      contractAddress: result.contractAddress,
      explorerUrl: result.explorerUrl,
      openseaUrl: result.openseaUrl,
    };

  } catch (error) {
    console.error('❌ [Local NFT Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Check if local NFT contract is configured
 */
export function isLocalNFTEnabled(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS &&
    process.env.NEXT_PUBLIC_BASE_RPC_URL?.includes('localhost')
  );
}
