import { NextResponse } from 'next/server';
import { loadNFTsFromWallet } from '../../../services/nftLoader';

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
    
    const result = await loadNFTsFromWallet(walletAddress);
    
    console.log('🧪 [NFT Loading Test] Result:', result);
    
    return NextResponse.json({
      success: true,
      testResult: result,
      debug: {
        walletAddress,
        contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
        hasAlchemyKey: !!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
        alchemyKeyLength: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY?.length || 0,
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
