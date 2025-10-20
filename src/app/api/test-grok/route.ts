import { NextResponse } from 'next/server';

/**
 * Test Grok API Configuration
 * Simple endpoint to test if Grok API key is working
 */
export async function GET() {
  try {
    const GROK_API_KEY = process.env.NEXT_PUBLIC_GROK_API_KEY;
    
    console.log('🧪 [Grok Test] Testing Grok API configuration...');
    
    if (!GROK_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'Grok API key not configured',
        details: {
          hasKey: false,
          environment: process.env.NODE_ENV,
        }
      });
    }

    // Test a simple image generation request
    const testResponse = await fetch('https://api.x.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-2-image',
        prompt: 'A simple test image of a red circle',
        n: 1,
        response_format: 'url',
      }),
    });

    const result = await testResponse.json();
    
    console.log('🧪 [Grok Test] API response:', {
      status: testResponse.status,
      success: testResponse.ok,
      result: result
    });

    return NextResponse.json({
      success: testResponse.ok,
      status: testResponse.status,
      apiKeyConfigured: true,
      apiKeyLength: GROK_API_KEY.length,
      apiKeyPrefix: GROK_API_KEY.substring(0, 10),
      response: result,
      error: testResponse.ok ? null : result
    });

  } catch (error) {
    console.error('🧪 [Grok Test] Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: {
        hasKey: !!process.env.NEXT_PUBLIC_GROK_API_KEY,
        keyLength: process.env.NEXT_PUBLIC_GROK_API_KEY?.length || 0,
      }
    });
  }
}
