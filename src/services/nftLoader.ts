/**
 * NFT Loader Service
 * Handles loading NFTs from a wallet and extracting game code
 */

export interface NFTData {
  tokenId: string;
  contractAddress: string;
  name: string;
  description: string;
  image: string;
  gameCode?: string;
  gamePrompt?: string;
  metadataUri: string;
}

export interface NFTLoaderResult {
  success: boolean;
  nfts?: NFTData[];
  error?: string;
}

/**
 * Load NFTs from a wallet address
 */
export async function loadNFTsFromWallet(walletAddress: string): Promise<NFTLoaderResult> {
  try {
    console.log('🔍 [NFT Loader] Loading NFTs for wallet:', walletAddress);
    
    // Get the contract address from environment
    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    if (!contractAddress) {
      return { success: false, error: 'NFT contract address not configured' };
    }

    // Use Alchemy API to get NFTs (free tier supports Base)
    const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    if (!alchemyApiKey) {
      console.warn('⚠️ [NFT Loader] No Alchemy API key, using direct contract calls');
      return await loadNFTsDirect(contractAddress, walletAddress);
    }

    // Use Alchemy API for better performance
    const response = await fetch(
      `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}/getNFTsForOwner?owner=${walletAddress}&contractAddresses[]=${contractAddress}&withMetadata=true`
    );

    if (!response.ok) {
      console.error('❌ [NFT Loader] Alchemy API error:', response.status);
      return await loadNFTsDirect(contractAddress, walletAddress);
    }

    const data = await response.json();
    console.log('📊 [NFT Loader] Alchemy response:', data);

    if (!data.ownedNfts || data.ownedNfts.length === 0) {
      return { success: true, nfts: [] };
    }

    const nfts: NFTData[] = [];
    for (const nft of data.ownedNfts) {
      try {
        const metadata = await loadNFTMetadata(nft.tokenUri?.raw || nft.tokenUri?.gateway);
        if (metadata) {
          nfts.push({
            tokenId: nft.tokenId,
            contractAddress: nft.contract.address,
            name: metadata.name || `Game NFT #${nft.tokenId}`,
            description: metadata.description || '',
            image: metadata.image || '',
            gameCode: metadata.attributes?.find((attr: any) => attr.trait_type === 'Game Code')?.value,
            gamePrompt: metadata.attributes?.find((attr: any) => attr.trait_type === 'Game Prompt')?.value,
            metadataUri: nft.tokenUri?.raw || nft.tokenUri?.gateway || '',
          });
        }
      } catch (err) {
        console.warn('⚠️ [NFT Loader] Failed to load metadata for token', nft.tokenId, err);
      }
    }

    console.log('✅ [NFT Loader] Loaded', nfts.length, 'NFTs');
    return { success: true, nfts };
  } catch (error) {
    console.error('❌ [NFT Loader] Error loading NFTs:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Load NFTs directly from contract (fallback method)
 */
async function loadNFTsDirect(contractAddress: string, walletAddress: string): Promise<NFTLoaderResult> {
  try {
    console.log('🔍 [NFT Loader] Using direct contract calls...');
    
    // This would require ethers.js and direct contract calls
    // For now, return empty array as fallback
    console.warn('⚠️ [NFT Loader] Direct contract calls not implemented yet');
    return { success: true, nfts: [] };
  } catch (error) {
    console.error('❌ [NFT Loader] Direct loading failed:', error);
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Load metadata from IPFS URI
 */
async function loadNFTMetadata(metadataUri?: string): Promise<any> {
  if (!metadataUri) {
    return null;
  }

  try {
    console.log('📄 [NFT Loader] Loading metadata from:', metadataUri);
    
    // Handle both IPFS and HTTP URIs
    let url = metadataUri;
    if (metadataUri.startsWith('ipfs://')) {
      url = metadataUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    const response = await fetch(url);
    if (!response.ok) {
      console.error('❌ [NFT Loader] Failed to fetch metadata:', response.status);
      return null;
    }

    const metadata = await response.json();
    console.log('✅ [NFT Loader] Metadata loaded successfully');
    return metadata;
  } catch (error) {
    console.error('❌ [NFT Loader] Error loading metadata:', error);
    return null;
  }
}

/**
 * Load a specific NFT by token ID
 */
export async function loadSpecificNFT(tokenId: string): Promise<{ success: boolean; nft?: NFTData; error?: string }> {
  try {
    console.log('🔍 [NFT Loader] Loading specific NFT:', tokenId);
    
    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    if (!contractAddress) {
      return { success: false, error: 'NFT contract address not configured' };
    }

    // For now, we'll need the wallet address to search through NFTs
    // In a real implementation, we'd call the contract's tokenURI method directly
    return { success: false, error: 'Specific NFT loading requires wallet address' };
  } catch (error) {
    console.error('❌ [NFT Loader] Error loading specific NFT:', error);
    return { success: false, error: (error as Error).message };
  }
}
