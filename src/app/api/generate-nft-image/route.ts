import { NextRequest, NextResponse } from 'next/server';

/**
 * Grok Image Generation API Route
 * Generates a custom NFT image by combining:
 * - GameForge branding
 * - Game screenshot
 * - User's game prompt
 */

const GROK_API_URL = 'https://api.x.ai/v1/images/generations';
const GROK_API_KEY = process.env.NEXT_PUBLIC_GROK_API_KEY;

export async function POST(request: NextRequest) {
  console.log('🎨 [Image Generation] API route called');
  
  try {
    const { gamePrompt, screenshotDataUrl } = await request.json();
    
    if (!gamePrompt || !screenshotDataUrl) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: gamePrompt and screenshotDataUrl' },
        { status: 400 }
      );
    }

    if (!GROK_API_KEY) {
      console.error('❌ [Image Generation] API key not configured');
      console.error('❌ [Image Generation] Environment check:', {
        hasKey: !!process.env.NEXT_PUBLIC_GROK_API_KEY,
        keyLength: process.env.NEXT_PUBLIC_GROK_API_KEY?.length || 0,
        keyPrefix: process.env.NEXT_PUBLIC_GROK_API_KEY?.substring(0, 10) || 'undefined'
      });
      return NextResponse.json(
        { success: false, error: 'Grok API key is not configured' },
        { status: 500 }
      );
    }

    console.log('📝 [Image Generation] Game prompt:', gamePrompt.substring(0, 100) + '...');
    console.log('🖼️ [Image Generation] Screenshot size:', screenshotDataUrl.length, 'bytes');

    // Create a detailed prompt for image generation
    const imagePrompt = `Create a vibrant, eye-catching NFT artwork for a video game with these specifications:

GAME DESCRIPTION: "${gamePrompt}"

DESIGN REQUIREMENTS:
1. Include the text "GAMEFORGE" prominently at the top in a futuristic, glowing font
2. Feature the game screenshot as the central element, framed with a holographic border
3. Add subtle particle effects, neon glows, and digital artifacts around the edges
4. Use a dark space/cyber theme with purple, blue, and pink gradients
5. Include small text at the bottom: "AI-Generated Arcade Game"
6. Style: Retro-futuristic, cyberpunk aesthetic with arcade vibes
7. Make it look like premium game box art or a collectible NFT

The overall feel should be: premium, collectible, vibrant, and game-focused.
Resolution: 1200x1200px, high quality, suitable for NFT display.`;

    console.log('🚀 [Image Generation] Calling Grok image API...');
    console.log('📝 [Image Generation] Full prompt:', imagePrompt);

    // Call Grok's image generation API
    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-2-image', // Grok's image generation model
        prompt: imagePrompt,
        n: 1, // Generate 1 image
        response_format: 'url', // Get image URL
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ [Image Generation] Grok API error:', response.status, errorText);
      console.error('❌ [Image Generation] Request was:', {
        url: GROK_API_URL,
        model: 'grok-2-image',
        promptLength: imagePrompt.length,
        headers: {
          'Authorization': 'Bearer [REDACTED]',
          'Content-Type': 'application/json',
        }
      });
      return NextResponse.json(
        { 
          success: false, 
          error: `Grok API error: ${response.status} - ${errorText}` 
        },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log('✅ [Image Generation] Grok API response received');
    console.log('📊 [Image Generation] Response structure:', JSON.stringify(result, null, 2));

    // Extract image URL from response
    if (!result.data || !result.data[0] || !result.data[0].url) {
      console.error('❌ [Image Generation] Invalid response format:', JSON.stringify(result, null, 2));
      console.error('❌ [Image Generation] Expected: { data: [{ url: "..." }] }');
      return NextResponse.json(
        { success: false, error: 'Invalid response from Grok API - missing image URL' },
        { status: 500 }
      );
    }

    const imageUrl = result.data[0].url;
    console.log('✅ [Image Generation] Image generated successfully');
    console.log('🔗 [Image Generation] Image URL:', imageUrl);

    // Download the image and convert to base64 for IPFS upload
    console.log('⬇️ [Image Generation] Downloading generated image...');
    console.log('🔗 [Image Generation] Image URL:', imageUrl);
    
    const imageResponse = await fetch(imageUrl);
    console.log('📥 [Image Generation] Image fetch response:', {
      status: imageResponse.status,
      ok: imageResponse.ok,
      headers: Object.fromEntries(imageResponse.headers.entries())
    });
    
    if (!imageResponse.ok) {
      console.error('❌ [Image Generation] Failed to download image:', imageResponse.status);
      return NextResponse.json(
        { success: false, error: `Failed to download generated image: ${imageResponse.status}` },
        { status: imageResponse.status }
      );
    }
    
    const imageBlob = await imageResponse.blob();
    console.log('📊 [Image Generation] Image blob:', {
      size: imageBlob.size,
      type: imageBlob.type
    });
    
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    const imageBase64 = imageBuffer.toString('base64');
    console.log('📊 [Image Generation] Base64 length:', imageBase64.length);

    console.log('✅ [Image Generation] Image downloaded and converted');
    console.log('📊 [Image Generation] Image size:', (imageBuffer.length / 1024).toFixed(2), 'KB');

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      imageBase64: `data:${imageBlob.type};base64,${imageBase64}`,
      size: imageBuffer.length,
    });

  } catch (error) {
    console.error('❌ [Image Generation] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

