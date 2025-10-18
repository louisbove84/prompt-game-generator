/**
 * NFT Service
 * Coordinates the full NFT minting flow:
 * 1. Capture game screenshot
 * 2. Upload image to IPFS
 * 3. Create and upload metadata to IPFS
 * 4. Mint NFT on Base network
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
 * Complete NFT minting flow
 */
export async function mintGameNFT(
  screenshot: Blob,
  recipientAddress: string,
  gamePrompt: string
): Promise<NFTMintResult> {
  try {
    console.log('🎨 [NFT Service] Starting NFT minting flow...');
    console.log('👤 [NFT Service] Recipient:', recipientAddress);
    console.log('📝 [NFT Service] Game prompt:', gamePrompt);

    // Step 1: Upload screenshot to IPFS
    console.log('📤 [NFT Service] Step 1: Uploading screenshot to IPFS...');
    const timestamp = Date.now();
    const imageFilename = `game-screenshot-${timestamp}.png`;
    const imageIpfsUri = await uploadImageToIPFS(screenshot, imageFilename);
    console.log('✅ [NFT Service] Screenshot uploaded:', imageIpfsUri);

    // Step 2: Create and upload metadata to IPFS
    console.log('📤 [NFT Service] Step 2: Creating and uploading metadata...');
    const metadata: NFTMetadata = {
      name: `AI Game Genesis #${timestamp}`,
      description: `An AI-generated arcade game: "${gamePrompt}". This NFT represents the first screenshot captured from a custom game created by AI.`,
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
          value: 'Base',
        },
        {
          trait_type: 'Timestamp',
          value: new Date(timestamp).toISOString(),
        },
      ],
    };

    const metadataUri = await uploadMetadataToIPFS(metadata);
    console.log('✅ [NFT Service] Metadata uploaded:', metadataUri);

    // Step 3: Mint the NFT
    console.log('⛓️ [NFT Service] Step 3: Minting NFT on Base network...');
    const response = await fetch('/api/nft/mint', {
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
    console.log('✅ [NFT Service] NFT minted successfully!');
    console.log('🔗 [NFT Service] Transaction:', result.transactionHash);
    console.log('🎯 [NFT Service] Token ID:', result.tokenId);

    return {
      success: true,
      transactionHash: result.transactionHash,
      tokenId: result.tokenId,
      contractAddress: result.contractAddress,
      explorerUrl: result.explorerUrl,
      openseaUrl: result.openseaUrl,
    };

  } catch (error) {
    console.error('❌ [NFT Service] Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Check if NFT contract is configured
 */
export function isNFTEnabled(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS &&
    process.env.PINATA_API_KEY &&
    process.env.PINATA_SECRET_KEY
  );
}

