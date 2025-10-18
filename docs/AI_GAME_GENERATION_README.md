# AI Game Generation System

## Overview
This system allows users to generate custom games using AI (Grok) based on text prompts. The generated games run directly in the browser using React, Canvas, and TypeScript.

## System Components

### 1. Game Template (`src/templates/gameTemplate.ts`)
- **Purpose**: Provides a standardized structure for AI-generated games
- **Based on**: SpaceInvadersGame.tsx and ThisIsFineGame.tsx
- **Features**:
  - Canvas-based rendering
  - Responsive design (mobile + desktop)
  - Touch and keyboard controls
  - Game state management
  - Score tracking
  - Reset functionality

### 2. Grok API Service (`src/services/grokAPI.ts`)
- **Purpose**: Interfaces with Grok AI to generate game code
- **API Endpoint**: `https://api.x.ai/v1/chat/completions`
- **Model**: `grok-4-latest`
- **Functions**:
  - `generateGame()`: Sends prompt to Grok and receives generated code
  - `validateGameCode()`: Validates generated code for required elements
  - `saveGeneratedGame()`: Saves games to localStorage
  - `getGeneratedGames()`: Retrieves saved games
  - `deleteGeneratedGame()`: Removes saved games

### 3. Dynamic Game Loader (`src/components/DynamicGameLoader.tsx`)
- **Purpose**: Loads and executes AI-generated game code at runtime
- **Features**:
  - Dynamic code execution using Function constructor
  - Error handling and recovery
  - Loading states
  - Back navigation

### 4. Updated UI Components
- **Main Page** (`src/app/page.tsx`):
  - Game generation interface
  - Error display
  - Generated game display
- **Frame Page** (`src/app/frame/page.tsx`):
  - Same features for Farcaster integration

## How It Works

### User Flow
1. User enters a game description (e.g., "A flappy bird clone")
2. Click "Generate Game" button
3. System sends prompt + template to Grok AI
4. Grok generates complete .tsx component
5. DynamicGameLoader loads and executes the code
6. User plays the generated game
7. Can go back to generate another game

### Technical Flow
```
User Prompt
    ↓
grokAPI.generateGame()
    ↓
Grok AI (with system prompt + template)
    ↓
Generated .tsx Code
    ↓
DynamicGameLoader
    ↓
Function Constructor (safe execution)
    ↓
Rendered Game Component
```

## API Configuration

### Grok API Key
Now uses environment variables (secured):
```typescript
const GROK_API_KEY = process.env.NEXT_PUBLIC_GROK_API_KEY;
```

**Setup**:
1. Add to Vercel: Settings → Environment Variables → `NEXT_PUBLIC_GROK_API_KEY`
2. For local dev, add to `.env.local`: `NEXT_PUBLIC_GROK_API_KEY=your_key_here`
3. See `VERCEL_SETUP_TEMPLATE.md` and `ENV_SETUP_README.md` for details

## Game Template Requirements

All generated games must include:
- ✅ React functional component with TypeScript
- ✅ Canvas-based rendering (2D context)
- ✅ Responsive dimensions (mobile + desktop)
- ✅ Game states: 'playing', 'gameOver', 'won'
- ✅ Score tracking
- ✅ Keyboard controls (Arrow keys, Space)
- ✅ Touch controls (tap, drag)
- ✅ Reset/restart functionality
- ✅ Proper cleanup of event listeners
- ✅ 60 FPS game loop

## Example Prompts

```
- "A flappy bird clone where you tap to make a bird fly through pipes"
- "A breakout/brick breaker game with paddle and ball physics"
- "A snake game that gets longer as it eats food"
- "A platformer where you jump on platforms to reach the top"
- "A racing game where you dodge cars coming at you"
- "A puzzle game where you match colors in a grid"
- "An endless runner where you avoid obstacles"
```

## Security Considerations

### Dynamic Code Execution
- Uses `Function` constructor (safer than `eval`)
- Only executes generated game code, not arbitrary code
- Validates code before execution
- Error boundaries prevent crashes

### API Key Security
- ⚠️ **IMPORTANT**: Current API key is exposed in client-side code
- **Production Solution**: Move API calls to server-side route handler
- Create `/api/generate-game` endpoint
- Keep API key in server environment variables
- Client calls API route, not Grok directly

## Future Enhancements

### Short Term
1. Move API key to environment variables
2. Add loading progress indicators
3. Implement game save/load from localStorage
4. Add game preview/thumbnail generation

### Medium Term
1. Server-side API route for Grok calls
2. Rate limiting for API calls
3. Game library/gallery of generated games
4. Share generated games with others
5. Edit/modify generated code in browser

### Long Term
1. Multi-player game generation
2. Asset generation (sprites, sounds)
3. Game monetization integration (Base)
4. Community voting on best games
5. Game templates library for different genres

## Troubleshooting

### "Failed to load game"
- Check browser console for errors
- Verify generated code has all required elements
- Ensure code is valid TypeScript/React

### "Generation failed"
- Check Grok API key is valid
- Verify API endpoint is accessible
- Check network connectivity
- Review prompt clarity (be specific)

### "Game runs but doesn't work"
- Grok may have generated incomplete code
- Try regenerating with more specific prompt
- Check browser console for runtime errors

## File Structure
```
src/
├── templates/
│   └── gameTemplate.ts          # Game template + system prompt
├── services/
│   └── grokAPI.ts               # Grok AI integration
├── components/
│   ├── DynamicGameLoader.tsx    # Dynamic game loader
│   ├── WalletConnect.tsx        # Wallet connection
│   └── BaseProvider.tsx         # Web3 provider
└── app/
    ├── page.tsx                 # Main page with generation
    └── frame/
        └── page.tsx             # Farcaster frame version
```

## Testing

### Manual Testing
1. Enter a simple prompt: "A game where you click circles"
2. Click "Generate Game"
3. Wait for generation (may take 10-30 seconds)
4. Play the generated game
5. Click "Back" to return to generator

### Test Prompts
- Simple: "A clicking game"
- Medium: "A platformer with jumping"
- Complex: "A tower defense game with multiple enemy types"

## Support

For issues or questions:
1. Check browser console for errors
2. Review this README
3. Check Grok API status
4. Verify API key is valid

## License

Same as main project.

