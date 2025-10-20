import { NextResponse } from 'next/server';

/**
 * Simple Test Endpoint
 * Basic endpoint to test if API routes are working
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API routes are working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    contractAddress: process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS,
    hasAlchemyKey: !!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  });
}
