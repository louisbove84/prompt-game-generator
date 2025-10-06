/**
 * Grok AI API Integration
 * Service for generating games using Grok AI
 */

import { GAME_TEMPLATE, GAME_GENERATION_SYSTEM_PROMPT } from '../templates/gameTemplate';

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
  // Check if API key is configured
  if (!GROK_API_KEY) {
    return {
      success: false,
      error: 'Grok API key is not configured. Please add NEXT_PUBLIC_GROK_API_KEY to your environment variables.'
    };
  }

  try {
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
        messages: [
          {
            role: 'system',
            content: GAME_GENERATION_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Create a game based on this description:

"${request.userPrompt}"

Use this template as a guide:

${GAME_TEMPLATE}

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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Grok API error: ${response.status} ${response.statusText}. ${JSON.stringify(errorData)}`
      );
    }

    const data = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error('No response from Grok AI');
    }

    const gameCode = data.choices[0].message.content;
    
    // Validate that we got code back
    if (!gameCode || !gameCode.includes('React')) {
      throw new Error('Invalid game code generated');
    }

    return {
      success: true,
      gameCode: cleanGameCode(gameCode),
      tokensUsed: data.usage?.total_tokens || 0
    };
  } catch (error) {
    console.error('Game generation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Clean the generated code (remove markdown, extra whitespace, etc.)
 */
function cleanGameCode(code: string): string {
  // Remove markdown code blocks if present
  let cleaned = code.replace(/```tsx?\n?/g, '').replace(/```\n?/g, '');
  
  // Remove any leading/trailing whitespace
  cleaned = cleaned.trim();
  
  // Ensure it starts with 'use client' if not present
  if (!cleaned.startsWith("'use client'") && !cleaned.startsWith('"use client"')) {
    cleaned = "'use client';\n\n" + cleaned;
  }
  
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

