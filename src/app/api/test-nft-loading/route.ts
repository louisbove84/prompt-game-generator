import { NextResponse } from 'next/server';

/**
 * Test NFT Loading
 * Manual endpoint to test NFT loading for a specific wallet
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get('wallet');
    
    if (!walletAddress) {
      return NextResponse.json({
        success: false,
        error: 'Wallet address parameter required. Use: /api/test-nft-loading?wallet=0x...'
      });
    }

    console.log('🧪 [NFT Loading Test] Testing NFT loading for wallet:', walletAddress);
    
    // Get the contract address from environment
    const contractAddress = process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS;
    const alchemyApiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    
    if (!contractAddress) {
      return NextResponse.json({
        success: false,
        error: 'NFT contract address not configured'
      });
    }

    if (!alchemyApiKey) {
      return NextResponse.json({
        success: false,
        error: 'Alchemy API key not configured'
      });
    }

    // Test Alchemy API call
    const alchemyUrl = `https://base-mainnet.g.alchemy.com/nft/v3/${alchemyApiKey}/getNFTsForOwner?owner=${walletAddress}&contractAddresses[]=${contractAddress}&withMetadata=true`;
    
    console.log('🧪 [NFT Loading Test] Calling Alchemy API...');
    const response = await fetch(alchemyUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({
        success: false,
        error: `Alchemy API error: ${response.status} - ${errorText}`,
        debug: {
          walletAddress,
          contractAddress,
          alchemyUrl: alchemyUrl.substring(0, 100) + '...',
          status: response.status,
        }
      });
    }

    const data = await response.json();
    
    return NextResponse.json({
      success: true,
      message: 'Alchemy API call successful',
      debug: {
        walletAddress,
        contractAddress,
        alchemyKeyLength: alchemyApiKey.length,
        nftCount: data.ownedNfts?.length || 0,
        alchemyResponse: data,
      }
    });

  } catch (error) {
    console.error('🧪 [NFT Loading Test] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      debug: {
        contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
        hasAlchemyKey: !!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
      }
    });
  }
}
