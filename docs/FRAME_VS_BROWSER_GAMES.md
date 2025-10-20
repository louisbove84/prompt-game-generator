# 🎮 Frame vs Browser Games - Complete Guide

## Overview

We've completely separated Frame (Farcaster) and Browser game generation to provide optimized experiences for each platform.

## 🎯 Key Differences

| Feature | Frame Games | Browser Games |
|---------|-------------|---------------|
| **Screen Size** | Small (320-420px) | Full viewport (100vw x 100vh) |
| **Controls** | Touch only | Keyboard + Mouse |
| **Performance** | Lightweight | Advanced features |
| **Graphics** | Simple 2D | Advanced effects, gradients |
| **Platform** | Mobile/Farcaster | Desktop browsers |
| **Complexity** | Simple mechanics | Sophisticated gameplay |

## 📁 Architecture

### Templates
```
src/templates/
├── frameGameTemplate.ts      # Small, touch-based games
└── browserGameTemplate.ts    # Full-screen, keyboard+mouse games
```

### Game Components
```
src/components/
├── frame-games/              # Simple Farcaster games
│   ├── SpaceInvadersGame.tsx
│   ├── ThisIsFineGame.tsx
│   └── DynamicGameLoader.tsx
└── browser-games/            # Sophisticated browser games
    └── index.ts              # Future advanced games
```

### Pages
```
src/app/
├── page.tsx                  # Browser version (gameType: 'browser')
└── frame/page.tsx            # Frame version (gameType: 'frame')
```

## 🚀 How It Works

### 1. Request Flow

**Browser Version:**
```typescript
// src/app/page.tsx
fetch('/api/generate-game', {
  body: JSON.stringify({
    userPrompt: "Your game idea...",
    gameType: 'browser'  // ← Requests full-screen game
  })
})
```

**Frame Version:**
```typescript
// src/app/frame/page.tsx
fetch('/api/generate-game', {
  body: JSON.stringify({
    userPrompt: "Your game idea...",
    gameType: 'frame'  // ← Requests mobile-friendly game
  })
})
```

### 2. API Processing

```typescript
// src/app/api/generate-game/route.ts
const isBrowserGame = gameType === 'browser';
const template = isBrowserGame ? BROWSER_GAME_TEMPLATE : GAME_TEMPLATE;
const systemPrompt = isBrowserGame ? BROWSER_GAME_SYSTEM_PROMPT : GAME_GENERATION_SYSTEM_PROMPT;

// Sends appropriate template to Grok AI
```

### 3. Game Generation

The API calls Grok AI with platform-specific instructions:

**For Browser:**
- Full viewport (100vw x 100vh)
- Keyboard controls (WASD + Arrows + Space)
- Mouse controls (movement + click)
- Advanced graphics (gradients, shadows, particles)
- Complex game mechanics
- HUD overlay with score/stats
- Pause functionality (ESC key)

**For Frame:**
- Small screen (320-420px)
- Touch controls only
- Simple graphics
- Lightweight mechanics
- Mobile-optimized
- Fast loading

## 📊 Browser Game Features

### Full-Screen Layout
```typescript
return (
  <div className="relative w-screen h-screen overflow-hidden">
    {/* HUD Overlay */}
    <div className="absolute top-0 left-0 right-0 z-10 p-4">
      <div className="flex justify-between">
        <div>SCORE: {score}</div>
        <div>LEVEL: {level}</div>
      </div>
    </div>

    {/* Full-screen canvas */}
    <canvas ref={canvasRef} className="w-full h-full" />

    {/* Game Over/Pause overlays */}
  </div>
);
```

### Advanced Controls
```typescript
// Keyboard (WASD + Arrows + Space)
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    keysPressed.current.add(e.key.toLowerCase());
  };
  // ...
}, []);

// Mouse (movement + click)
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };
  };
  const handleClick = (e: MouseEvent) => {
    // Shoot, place, interact
  };
  // ...
}, []);
```

### Performance Optimization
```typescript
// requestAnimationFrame for smooth 60fps
const gameLoop = (currentTime: number) => {
  const deltaTime = (currentTime - lastTime) / 1000;
  
  // Update game state
  // Draw everything
  
  rafRef.current = requestAnimationFrame(gameLoop);
};
```

## 🎨 Visual Differences

### Frame Game (Mobile)
```
┌─────────────┐
│ GAME TITLE  │
├─────────────┤
│             │
│   320x320   │
│   Canvas    │
│             │
├─────────────┤
│   Score: 0  │
└─────────────┘
```

### Browser Game (Desktop)
```
┌──────────────────────────────────────────┐
│ SCORE: 1000        LEVEL: 5        HP: ██│ HUD
├──────────────────────────────────────────┤
│                                          │
│                                          │
│                                          │
│         Full Viewport Canvas             │
│         (1920x1080 or more)              │
│                                          │
│                                          │
│                                          │
├──────────────────────────────────────────┤
│ Controls: WASD/Arrows, Space, Click    │ Footer
└──────────────────────────────────────────┘
```

## 🧪 Testing

### Test Browser Game Generation

1. **Start the dev server:**
```bash
npm run dev
```

2. **Open browser:**
```
http://localhost:3002
```

3. **Enter a prompt:**
```
A space shooter where you pilot a ship across the entire screen.
Use WASD to move and click to shoot lasers. Asteroids come from
the top and you need to destroy them. Full screen with dark space
background and neon effects.
```

4. **Expected result:**
- Full-screen game
- Keyboard controls (WASD/Arrows)
- Mouse controls (click to shoot)
- HUD with score
- Pause with ESC
- Professional visuals

### Test Frame Game Generation

1. **Open frame page:**
```
http://localhost:3002/frame
```

2. **Enter a prompt:**
```
A simple flappy bird clone where you tap to make the bird fly
through pipes. Retro pixel graphics.
```

3. **Expected result:**
- Small screen (320px)
- Touch controls
- Simple graphics
- Mobile-optimized

## 📝 Example Prompts

### Browser Game Prompts
```
✅ "A top-down zombie shooter where you use WASD to move and mouse
   to aim and shoot. Zombies come from all sides."

✅ "A tower defense game where you click to place towers on a grid.
   Enemies walk along a path and you must stop them."

✅ "A racing game viewed from above where you use arrow keys to
   steer through a winding track at high speed."

✅ "A bullet hell space shooter with complex enemy patterns filling
   the entire screen. Use WASD to dodge and Space to shoot."
```

### Frame Game Prompts
```
✅ "A simple endless runner where you tap to jump over obstacles."

✅ "A flappy bird clone with touch controls."

✅ "A brick breaker game where you tap to launch the ball."

✅ "A simple snake game that gets longer as it eats food."
```

## 🔧 Manual Testing with curl

Test the API directly:

```bash
# Browser game
curl -X POST http://localhost:3002/api/generate-game \
  -H "Content-Type: application/json" \
  -d '{
    "userPrompt": "A space shooter game",
    "temperature": 0.7,
    "gameType": "browser"
  }'

# Frame game
curl -X POST http://localhost:3002/api/generate-game \
  -H "Content-Type: application/json" \
  -d '{
    "userPrompt": "A simple flappy bird clone",
    "temperature": 0.7,
    "gameType": "frame"
  }'
```

## 📊 API Response

```json
{
  "success": true,
  "gameCode": "'use client';\n\nimport React, ...",
  "tokensUsed": 2500
}
```

## 🎯 Best Practices

### For Browser Games:
- ✅ Use full viewport
- ✅ Add HUD overlay
- ✅ Implement pause (ESC)
- ✅ Add visual effects
- ✅ Use keyboard + mouse
- ✅ Include game over screen
- ✅ Show controls guide
- ✅ Optimize for 60fps

### For Frame Games:
- ✅ Keep it simple
- ✅ Touch controls only
- ✅ Small file size
- ✅ Fast loading
- ✅ Mobile-friendly
- ✅ Clear visuals
- ✅ Responsive design

## 🐛 Troubleshooting

### Browser game shows small canvas
- Check that `gameWidth/gameHeight` use `window.innerWidth/innerHeight`
- Verify canvas has `w-full h-full` classes
- Check parent div has `w-screen h-screen`

### Controls not working
- Check keyboard event listeners are attached to `window`
- Verify `keysPressed` ref is being used
- Check for `preventDefault()` on game keys

### Poor performance
- Use `requestAnimationFrame` not `setInterval`
- Keep game logic in refs, not state
- Minimize `setState` calls during game loop
- Use delta time for frame-independent movement

## 📚 Related Documentation

- [Game Architecture](./GAME_ARCHITECTURE.md) - Component organization
- [Quick Game Guide](./QUICK_GAME_GUIDE.md) - Adding new games
- [AI Game Generation](./AI_GAME_GENERATION_README.md) - How AI works

---

**Last Updated**: 2025-01-20
**Status**: ✅ Ready for testing

