/**
 * Server-side API route for game generation
 * This avoids CORS issues by making the Grok API call from the server
 */

import { NextRequest, NextResponse } from 'next/server';
import { GAME_TEMPLATE, GAME_GENERATION_SYSTEM_PROMPT } from '@/templates/frameGameTemplate';
import { BROWSER_GAME_TEMPLATE, BROWSER_GAME_SYSTEM_PROMPT } from '@/templates/browserGameTemplate';

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

export async function POST(request: NextRequest) {
  console.log('🎮 [API Route] Game generation request received');
  
  try {
    const { userPrompt, temperature = 0.7, gameType = 'browser' } = await request.json();
    
    // Select template based on game type
    const isBrowserGame = gameType === 'browser';
    const template = isBrowserGame ? BROWSER_GAME_TEMPLATE : GAME_TEMPLATE;
    const systemPrompt = isBrowserGame ? BROWSER_GAME_SYSTEM_PROMPT : GAME_GENERATION_SYSTEM_PROMPT;
    
    console.log(`🎯 [API Route] Generating ${isBrowserGame ? 'BROWSER' : 'FRAME'} game`);
    
    if (!userPrompt) {
      return NextResponse.json(
        { success: false, error: 'User prompt is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GROK_API_KEY;
    
    if (!apiKey) {
      console.error('❌ [API Route] No API key configured');
      return NextResponse.json(
        { success: false, error: 'Grok API key is not configured' },
        { status: 500 }
      );
    }

    console.log('✓ [API Route] API key found');
    console.log('📝 [API Route] User prompt:', userPrompt);
    console.log('🌐 [API Route] Calling Grok API...');

    const response = await fetch(GROK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'grok-3',
        stream: false,
        temperature,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a ${isBrowserGame ? 'sophisticated full-screen browser' : 'lightweight mobile-friendly'} game based on this description:

"${userPrompt}"

Use this template as a guide:

${template}

Remember to:
1. Return ONLY the complete .tsx file content
2. Include all necessary imports
3. Make it fully functional and playable
4. Follow React best practices
5. Use TypeScript with proper typing
6. Support both mobile and desktop
7. Include proper game loop and rendering
8. Make it fun and polished!

Generate the complete game component now:`
          }
        ]
      })
    });

    console.log('📡 [API Route] Response received, status:', response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [API Route] API error:', response.status, errorData);
      return NextResponse.json(
        { 
          success: false, 
          error: `Grok API error: ${response.status} ${response.statusText}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✓ [API Route] Response OK');
    console.log('📊 [API Route] Tokens used:', data.usage?.total_tokens || 'unknown');
    
    if (!data.choices || data.choices.length === 0) {
      console.error('❌ [API Route] No choices in response');
      return NextResponse.json(
        { success: false, error: 'No response from Grok AI' },
        { status: 500 }
      );
    }

    const gameCode = data.choices[0].message.content;
    console.log('📦 [API Route] Game code received, length:', gameCode?.length || 0, 'chars');
    
    if (!gameCode || !gameCode.includes('React')) {
      console.error('❌ [API Route] Invalid game code');
      return NextResponse.json(
        { success: false, error: 'Invalid game code generated' },
        { status: 500 }
      );
    }

    // Clean the code (remove markdown)
    let cleanedCode = gameCode.replace(/```tsx?\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Ensure 'use client' directive
    if (!cleanedCode.startsWith("'use client'") && !cleanedCode.startsWith('"use client"')) {
      cleanedCode = "'use client';\n\n" + cleanedCode;
    }

    console.log('✅ [API Route] Game generation successful!');
    
    return NextResponse.json({
      success: true,
      gameCode: cleanedCode,
      tokensUsed: data.usage?.total_tokens || 0
    });

  } catch (error) {
    console.error('❌ [API Route] FAILED:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
}

