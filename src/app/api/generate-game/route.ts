/**
 * Server-side API route for game generation
 * This avoids CORS issues by making the Grok API call from the server
 */

import { NextRequest, NextResponse } from 'next/server';
import { UNIFIED_GAME_TEMPLATE, UNIFIED_SYSTEM_PROMPT } from '@/templates/unifiedGameTemplate';

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';

// Increase timeout for game generation (Vercel allows up to 300s on Pro, 60s on Hobby)
export const maxDuration = 60; // Maximum for Hobby plan

export async function POST(request: NextRequest) {
  console.log('🎮 [API Route] Game generation request received');
  
  try {
    const { userPrompt, temperature = 0.7 } = await request.json();
    
    // Use unified template for all games
    const template = UNIFIED_GAME_TEMPLATE;
    const systemPrompt = UNIFIED_SYSTEM_PROMPT;
    
    console.log('🎯 [API Route] Generating UNIFIED responsive game');
    
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

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000); // 55s timeout (5s buffer)

    try {
      const response = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
        model: 'grok-3-mini', // Fast, affordable, 131k context
        stream: false,
        temperature,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: `Create a simple, fun game: "${userPrompt}"

TEMPLATE:
${template}

REQUIREMENTS:
- Return ONLY complete .tsx file
- Use the template structure exactly
- Keep game mechanics SIMPLE
- Focus on core gameplay
- Make it work and playable

Generate now:`
          }
        ]
      })
    });

    clearTimeout(timeout); // Clear timeout if request completes
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

    } catch (fetchError) {
      clearTimeout(timeout);
      
      // Handle abort/timeout specifically
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        console.error('⏱️ [API Route] Request timeout');
        return NextResponse.json(
          { 
            success: false, 
            error: 'Game generation timed out. Please try a simpler prompt or try again.' 
          },
          { status: 504 }
        );
      }
      
      throw fetchError; // Re-throw to outer catch
    }

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

