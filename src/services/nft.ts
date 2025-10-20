/**
 * NFT Service
 * Coordinates the full NFT minting flow:
 * 1. Generate custom NFT image using Grok AI (combines GameForge branding + screenshot + prompt)
 * 2. Upload generated image to IPFS
 * 3. Create and upload metadata to IPFS
 * 4. Mint NFT on Base network
 */

import { uploadImageToIPFS, uploadMetadataToIPFS, NFTMetadata } from './ipfs';

/**
 * Helper: Convert Blob to Data URL
 */
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Helper: Convert Data URL to Blob
 */
async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const response = await fetch(dataUrl);
  return response.blob();
}

export interface NFTMintResult {
  success: boolean;
  transactionHash?: string;
  tokenId?: string;
  contractAddress?: string;
  explorerUrl?: string;
  nftViewUrl?: string; // BaseScan NFT view
  openseaUrl?: string; // OpenSea (may take time to index)
  error?: string;
}

/**
 * Complete NFT minting flow
 */
export async function mintGameNFT(
  screenshot: Blob,
  recipientAddress: string,
  gamePrompt: string,
  gameCode?: string
): Promise<NFTMintResult> {
  try {
    console.log('🎨 [NFT Service] Starting NFT minting flow...');
    console.log('👤 [NFT Service] Recipient:', recipientAddress);
    console.log('📝 [NFT Service] Game prompt:', gamePrompt);

    // Step 1: Generate custom NFT image using Grok AI
    console.log('🎨 [NFT Service] Step 1: Generating custom NFT image with Grok AI...');
    const screenshotDataUrl = await blobToDataUrl(screenshot);
    
    const imageGenResponse = await fetch('/api/generate-nft-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        gamePrompt,
        screenshotDataUrl,
      }),
    });

    const imageGenResult = await imageGenResponse.json();
    
    if (!imageGenResult.success) {
      console.warn('⚠️ [NFT Service] Image generation failed, using original screenshot');
      console.warn('⚠️ [NFT Service] Error:', imageGenResult.error);
      // Fall back to original screenshot
    }

    // Use generated image if available, otherwise fall back to screenshot
    const imageToUpload = imageGenResult.success 
      ? await dataUrlToBlob(imageGenResult.imageBase64)
      : screenshot;
    
    if (imageGenResult.success) {
      console.log('✅ [NFT Service] Custom NFT image generated successfully!');
    }

    // Step 2: Upload image to IPFS
    console.log('📤 [NFT Service] Step 2: Uploading NFT image to IPFS...');
    const timestamp = Date.now();
    const imageFilename = `game-nft-${timestamp}.png`;
    const imageIpfsUri = await uploadImageToIPFS(imageToUpload, imageFilename);
    console.log('✅ [NFT Service] NFT image uploaded:', imageIpfsUri);

    // Step 3: Create and upload metadata to IPFS
    console.log('📤 [NFT Service] Step 3: Creating and uploading metadata...');
    
    // Create a short, catchy name from the game prompt
    const generateGameName = (prompt: string): string => {
      // Extract key words from the prompt (nouns, adjectives)
      const words = prompt
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => word.length > 3 && !['game', 'with', 'that', 'where', 'when', 'what', 'this', 'from'].includes(word));
      
      // Take first 2-3 meaningful words and capitalize them
      const nameWords = words.slice(0, 3).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      );
      
      // If we got good words, use them, otherwise use a generic name
      if (nameWords.length >= 2) {
        return `${nameWords.join(' ')} - AI Game`;
      } else if (nameWords.length === 1) {
        return `${nameWords[0]} Adventure - AI Game`;
      } else {
        return `AI Generated Game #${timestamp}`;
      }
    };

    const gameName = generateGameName(gamePrompt);
    
    const metadata: NFTMetadata = {
      name: gameName,
      description: `An AI-generated arcade game: "${gamePrompt}". This NFT captures the first moment of a unique game created by artificial intelligence.`,
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
          trait_type: 'Created Date',
          value: new Date(timestamp).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        },
        // Include game code for future replay functionality
        ...(gameCode ? [{
          trait_type: 'Game Code',
          value: gameCode,
        }] : []),
      ],
    };

    const metadataUri = await uploadMetadataToIPFS(metadata);
    console.log('✅ [NFT Service] Metadata uploaded:', metadataUri);

    // Step 4: Mint the NFT
    console.log('⛓️ [NFT Service] Step 4: Minting NFT on Base network...');
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
      nftViewUrl: result.nftViewUrl,
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

