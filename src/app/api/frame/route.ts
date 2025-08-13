import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { untrustedData } = body;
    
    // Get the button index that was clicked
    const buttonIndex = untrustedData?.buttonIndex || 1;
    
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    // Different responses based on button clicked
    if (buttonIndex === 1) {
      // Space Invaders button
      return NextResponse.json({
        image: `${baseUrl}/api/frame-image`,
        buttons: [
          {
            label: '🚀 Play Space Invaders',
            action: 'link',
            target: `${baseUrl}/frame?game=spaceinvaders`,
          },
        ],
        postUrl: `${baseUrl}/api/frame`,
      });
    } else if (buttonIndex === 2) {
      // This Is Fine button
      return NextResponse.json({
        image: `${baseUrl}/api/frame-image`,
        buttons: [
          {
            label: '🔥 Play This Is Fine',
            action: 'link',
            target: `${baseUrl}/frame?game=runner`,
          },
        ],
        postUrl: `${baseUrl}/api/frame`,
      });
    } else {
      // Default response - game selection
      return NextResponse.json({
        image: `${baseUrl}/api/frame-image`,
        buttons: [
          {
            label: '🚀 Space Invaders',
            action: 'post',
          },
          {
            label: '🔥 This Is Fine',
            action: 'post',
          },
        ],
        postUrl: `${baseUrl}/api/frame`,
      });
    }
  } catch (error) {
    console.error('Frame API error:', error);
    
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    return NextResponse.json({
      image: `${baseUrl}/api/frame-image`,
      buttons: [
        {
          label: '🚀 Space Invaders',
          action: 'post',
        },
        {
          label: '🔥 This Is Fine',
          action: 'post',
        },
      ],
      postUrl: `${baseUrl}/api/frame`,
    });
  }
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  return NextResponse.json({
    image: `${baseUrl}/api/frame-image`,
    buttons: [
      {
        label: '🚀 Space Invaders',
        action: 'post',
      },
      {
        label: '🔥 This Is Fine',
        action: 'post',
      },
    ],
    postUrl: `${baseUrl}/api/frame`,
  });
}