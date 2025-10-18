import { NextRequest, NextResponse } from 'next/server';

const PINATA_API_URL = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json();

    if (!metadata) {
      return NextResponse.json(
        { success: false, message: 'No metadata provided' },
        { status: 400 }
      );
    }

    const pinataApiKey = process.env.PINATA_API_KEY;
    const pinataSecretKey = process.env.PINATA_SECRET_KEY;

    if (!pinataApiKey || !pinataSecretKey) {
      return NextResponse.json(
        { success: false, message: 'Pinata credentials not configured' },
        { status: 500 }
      );
    }

    const pinataResponse = await fetch(PINATA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': pinataApiKey,
        'pinata_secret_api_key': pinataSecretKey,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: {
          name: metadata.name || 'AI Game NFT Metadata',
        },
      }),
    });

    if (!pinataResponse.ok) {
      const errorData = await pinataResponse.json();
      console.error('Pinata error:', errorData);
      return NextResponse.json(
        { success: false, message: 'Failed to upload metadata to Pinata' },
        { status: pinataResponse.status }
      );
    }

    const data = await pinataResponse.json();
    console.log('✅ Metadata uploaded to IPFS:', data.IpfsHash);

    return NextResponse.json({
      success: true,
      IpfsHash: data.IpfsHash,
      ipfsUrl: `ipfs://${data.IpfsHash}`,
      gatewayUrl: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    });

  } catch (error) {
    console.error('❌ Metadata upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

