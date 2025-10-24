/**
 * Grok AI API Integration
 * Service for generating games using Grok AI
 */

import { UNIFIED_GAME_TEMPLATE, UNIFIED_SYSTEM_PROMPT } from '../templates/unifiedGameTemplate';

const GROK_API_URL = 'https://api.x.ai/v1/chat/completions';
const GROK_API_KEY = process.env.NEXT_PUBLIC_GROK_API_KEY;

export interface GameGenerationRequest {
  userPrompt: string;
  temperature?: number;
}

export interface GameGenerationResponse {
  success: boolean;
  gameCode?: string;
  error?: string;
  tokensUsed?: number;
}

/**
 * Generate a game using Grok AI
 */
export async function generateGame(
  request: GameGenerationRequest
): Promise<GameGenerationResponse> {
  console.log('🎮 [Game Generation] Starting...');
  console.log('📝 [Game Generation] User prompt:', request.userPrompt);
  
  // Check if API key is configured
  if (!GROK_API_KEY) {
    console.error('❌ [Game Generation] API key not configured');
    return {
      success: false,
      error: 'Grok API key is not configured. Please add NEXT_PUBLIC_GROK_API_KEY to your environment variables.'
    };
  }

  console.log('✓ [Game Generation] API key found');
  
  const MAX_RETRIES = 2;
  let lastGeneratedCode = '';
  
  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      console.log(`🌐 [Game Generation] Attempt ${attempt}/${MAX_RETRIES + 1}: Calling Grok API...`);
      
      // Build messages - add correction prompt if this is a retry
      const messages: any[] = [
        {
          role: 'system',
          content: UNIFIED_SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: `Create a game based on this description:

"${request.userPrompt}"

Use this template as a guide:

${UNIFIED_GAME_TEMPLATE}

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
      ];
      
      // If retry, add correction instructions
      if (attempt > 1 && lastGeneratedCode) {
        messages.push({
          role: 'assistant',
          content: lastGeneratedCode
        });
        messages.push({
          role: 'user',
          content: `🚨 CRITICAL ERROR: Your code contains FORBIDDEN JSX elements!

You violated the JSX rules by using <h1>, <h2>, <span>, <p>, or other forbidden tags.

✅ ALLOWED JSX (ONLY):
- <div> for layout wrappers
- <canvas> for game rendering
- <button> for restart button

❌ FORBIDDEN JSX (causes errors):
- NO <h1>, <h2>, <h3>, <h4>, <h5>, <h6> tags
- NO <span>, <p>, <img> tags
- NO ANY other HTML elements

📌 HOW TO FIX:
- Remove ALL <h1> game titles - draw text on canvas using ctx.fillText() instead
- Remove ALL <span>, <p> text elements - use canvas ctx.fillText()
- Keep ONLY <div>, <canvas>, <button> in the return statement

Please regenerate the COMPLETE game code following these rules EXACTLY.`
        });
        console.log('⚠️ [Game Generation] Sending correction request for forbidden JSX...');
      }

      const response = await fetch(GROK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'grok-4-latest',
          stream: false,
          temperature: request.temperature || 0.7,
          messages
        })
      });

      console.log('📡 [Game Generation] Response received, status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ [Game Generation] API error:', response.status, errorData);
        throw new Error(
          `Grok API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
        );
      }

      console.log('✓ [Game Generation] Response OK, parsing data...');
      const data = await response.json();
      
      console.log('📊 [Game Generation] Tokens used:', data.usage?.total_tokens || 'unknown');
      
      if (!data.choices || data.choices.length === 0) {
        console.error('❌ [Game Generation] No choices in response');
        throw new Error('No response from Grok AI');
      }

      const gameCode = data.choices[0].message.content;
      lastGeneratedCode = gameCode;
      console.log('📦 [Game Generation] Game code received, length:', gameCode?.length || 0, 'chars');
      
      // JSX is now supported! Babel will transform it in the loader
      console.log('✅ [Game Generation] Code received - JSX will be transformed by Babel');
    
    // Validate that we got code back
    if (!gameCode || !gameCode.includes('React')) {
      console.error('❌ [Game Generation] Invalid game code - missing React');
      throw new Error('Invalid game code generated');
    }

    console.log('✓ [Game Generation] Code validation passed');
    console.log('🧹 [Game Generation] Cleaning code...');
    
    const cleanedCode = cleanGameCode(gameCode);
    console.log('✓ [Game Generation] Code cleaned, final length:', cleanedCode.length, 'chars');
    
    // Save code to window for debugging
    if (typeof window !== 'undefined') {
      (window as any).lastGeneratedCode = cleanedCode;
      console.log('💾 [Game Generation] Code saved to window.lastGeneratedCode');
      console.log('💾 [Game Generation] To download, run: downloadGeneratedCode()');
      
      // Create download function
      (window as any).downloadGeneratedCode = () => {
        const blob = new Blob([cleanedCode], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-game.txt';
        a.click();
        URL.revokeObjectURL(url);
        console.log('✅ Downloaded generated-game.txt');
      };
    }
    
    // Log cleaned code in chunks for debugging
    console.log('📄 [Game Generation] === CLEANED CODE START ===');
    console.log(cleanedCode.substring(0, 1000));
    console.log('📄 [Game Generation] === CLEANED CODE (more) ===');
    console.log(cleanedCode.substring(1000, 2000));
    console.log('📄 [Game Generation] === CLEANED CODE END ===');

    const validation = validateGameCode(cleanedCode);
    console.log('🔍 [Game Generation] Validation result:', validation.valid ? '✓ PASS' : '❌ FAIL');
    if (!validation.valid) {
      console.warn('⚠️ [Game Generation] Validation errors:', validation.errors);
    }

    console.log('✅ [Game Generation] SUCCESS! Game ready to load');
    
      return {
        success: true,
        gameCode: cleanedCode,
        tokensUsed: data.usage?.total_tokens || 0
      };
    } catch (error) {
      console.error(`❌ [Game Generation] Attempt ${attempt} FAILED:`, error);
      if (attempt > MAX_RETRIES) {
        console.error('❌ [Game Generation] All retries exhausted');
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
      }
      console.log(`🔄 [Game Generation] Retrying...`);
    }
  }
  
  // Should never reach here, but just in case
  return {
    success: false,
    error: 'Failed to generate game after maximum retries'
  };
}

/**
 * Clean the generated code (remove markdown, ensure proper format)
 * NOTE: TypeScript and JSX are now handled by Babel in the loader
 */
function cleanGameCode(code: string): string {
  console.log('🧹 [Cleaner] Starting code cleanup...');
  
  // Remove markdown code blocks if present
  let cleaned = code.replace(/```tsx?\n?/g, '').replace(/```\n?/g, '');
  console.log('✓ [Cleaner] Markdown removed');
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  // Ensure it starts with 'use client' if not present
  if (!cleaned.startsWith("'use client'") && !cleaned.startsWith('"use client"')) {
    cleaned = "'use client';\n\n" + cleaned;
  }
  
  console.log('✓ [Cleaner] Cleanup complete - code length:', cleaned.length);
  console.log('ℹ️ [Cleaner] TypeScript & JSX will be transformed by Babel in the loader');
  return cleaned;
}

/**
 * Validate generated game code
 */
export function validateGameCode(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for required elements
  if (!code.includes('React')) {
    errors.push('Missing React import');
  }
  
  if (!code.includes('export default')) {
    errors.push('Missing default export');
  }
  
  if (!code.includes('canvas')) {
    errors.push('Missing canvas element');
  }
  
  if (!code.includes('useRef') || !code.includes('canvasRef')) {
    errors.push('Missing canvas ref');
  }
  
  if (!code.includes('gameState')) {
    errors.push('Missing game state management');
  }
  
  // Check for common syntax errors
  const openBraces = (code.match(/{/g) || []).length;
  const closeBraces = (code.match(/}/g) || []).length;
  if (openBraces !== closeBraces) {
    errors.push('Mismatched braces');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Save generated game to localStorage for testing
 */
export function saveGeneratedGame(gameName: string, code: string): void {
  const games = getGeneratedGames();
  games[gameName] = {
    code,
    createdAt: new Date().toISOString(),
    name: gameName
  };
  localStorage.setItem('generatedGames', JSON.stringify(games));
}

/**
 * Get all generated games from localStorage
 */
export function getGeneratedGames(): Record<string, { code: string; createdAt: string; name: string }> {
  const stored = localStorage.getItem('generatedGames');
  return stored ? JSON.parse(stored) : {};
}

/**
 * Delete a generated game
 */
export function deleteGeneratedGame(gameName: string): void {
  const games = getGeneratedGames();
  delete games[gameName];
  localStorage.setItem('generatedGames', JSON.stringify(games));
}

