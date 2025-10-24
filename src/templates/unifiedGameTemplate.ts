/**
 * 🎮 UNIFIED RESPONSIVE GAME TEMPLATE
 * 
 * This is the ONLY template for AI-generated games.
 * Works seamlessly on both mobile and desktop.
 * Automatically adapts controls, layout, and features based on device.
 */

export const UNIFIED_GAME_TEMPLATE = `
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameOver' | 'won'>('playing');
  const [score, setScore] = useState(0);
  const [gameWidth, setGameWidth] = useState(800);
  const [gameHeight, setGameHeight] = useState(600);
  const [isMobile, setIsMobile] = useState(false);
  const [controlMode, setControlMode] = useState<'keyboard' | 'mouse'>('keyboard');
  
  // Refs for game state (no setState in game loop!)
  const gameObjectsRef = useRef<any>({
    // Define your game objects here
    // Example: { player: { x: 0, y: 0 }, enemies: [], bullets: [] }
  });
  const scoreRef = useRef(0);
  const keysPressed = useRef<Set<string>>(new Set());
  const mousePos = useRef({ x: 0, y: 0 });
  const controlModeRef = useRef<'keyboard' | 'mouse'>('keyboard');

  // Sync control mode state with ref for game loop
  useEffect(() => {
    controlModeRef.current = controlMode;
  }, [controlMode]);

  // 1. Device detection and responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      // Comprehensive mobile detection
      const mobile = window.innerWidth <= 768 || 
        'ontouchstart' in window ||
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      setIsMobile(mobile);
      
      if (mobile) {
        // Full-screen on mobile
        setGameWidth(window.innerWidth);
        setGameHeight(window.innerHeight);
      } else {
        // Windowed on desktop (responsive size)
        const width = Math.min(1200, window.innerWidth - 100);
        const height = Math.min(800, window.innerHeight - 100);
        setGameWidth(width);
        setGameHeight(height);
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 2. Canvas setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas resolution
    const dpr = window.devicePixelRatio || 1;
    canvas.width = gameWidth * dpr;
    canvas.height = gameHeight * dpr;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }
    
    canvas.style.width = gameWidth + 'px';
    canvas.style.height = gameHeight + 'px';
  }, [gameWidth, gameHeight]);

  // 3. Initialize game objects
  useEffect(() => {
    // Initialize your game objects here
    gameObjectsRef.current = {
      // Example: player at 20% from bottom (80% from top)
      // player: { x: gameWidth / 2, y: gameHeight * 0.8, width: 20, height: 20 }
    };
  }, [gameWidth, gameHeight]);

  // 4. Auto-shooting for mobile devices
  useEffect(() => {
    if (gameState !== 'playing') return;

    const isMobileDevice = isMobile || 
      window.innerWidth <= 768 || 
      'ontouchstart' in window || 
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (!isMobileDevice) return;

    console.log('🎮 Auto-shooting enabled for mobile');
    
    const autoShoot = setInterval(() => {
      // Auto-shoot logic for mobile
      // Example: Add bullets to gameObjectsRef.current
    }, 250);

    return () => clearInterval(autoShoot);
  }, [gameState, isMobile]);

  // 5. Keyboard controls (respects control mode for movement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd', 'Escape'].includes(e.key)) {
        e.preventDefault();
      }

      // Only add movement keys if in keyboard mode (spacebar always works)
      if (controlMode === 'keyboard' || e.key === ' ' || e.key === 'Escape') {
        keysPressed.current.add(e.key.toLowerCase());
      }
      
      // Pause on ESC
      if (e.key === 'Escape') {
        setGameState('paused');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, controlMode]);

  // 6. Mouse controls (desktop, respects control mode for movement)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || gameState !== 'playing') return;
      
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      
      // Only move player with mouse if in mouse mode
      // The game loop should check controlModeRef.current === 'mouse' before using mousePos
    };

    const handleClick = (e: MouseEvent) => {
      if (gameState !== 'playing') return;
      
      // Mouse click should trigger same actions as spacebar (shooting, jumping, etc.)
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // EXAMPLE: Shoot on click (same as spacebar)
      // gameObjectsRef.current.bullets.push({
      //   x: gameObjectsRef.current.player.x + gameObjectsRef.current.player.width / 2,
      //   y: gameObjectsRef.current.player.y,
      //   width: 2,
      //   height: 10
      // });
      
      // Or place object at click position, trigger action, etc.
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [gameState]);

  // 7. Touch controls (mobile) - MUST IMPLEMENT FOR MOBILE PLAYABILITY
  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // CRITICAL: Move player to touch position
    // This is REQUIRED for mobile games to be playable
    const objects = gameObjectsRef.current;
    if (objects.player) {
      // Center player on touch X position
      objects.player.x = Math.max(
        0, 
        Math.min(gameWidth - objects.player.width, touchX - objects.player.width / 2)
      );
      
      // Optional: Also update Y position for 2D movement games
      // objects.player.y = Math.max(0, Math.min(gameHeight - objects.player.height, touchY - objects.player.height / 2));
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    // Call handleTouchMove to immediately move player to touch position
    handleTouchMove(e);
  };

  // 8. Game loop (60 FPS)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const gameLoop = setInterval(() => {
      const objects = gameObjectsRef.current;
      
      // UPDATE: Game logic here (modify objects directly in ref)
      // IMPORTANT: Check controlModeRef.current to determine which input to use
      // 
      // KEYBOARD MODE (controlModeRef.current === 'keyboard'):
      //   - Process keyboard input from keysPressed.current
      //   - if (keysPressed.current.has('arrowleft')) { objects.player.x -= speed; }
      //   - if (keysPressed.current.has('arrowright')) { objects.player.x += speed; }
      //
      // MOUSE MODE (controlModeRef.current === 'mouse'):
      //   - Use mousePos.current for player movement
      //   - objects.player.x = mousePos.current.x - objects.player.width / 2;
      //
      // - Move objects
      // - Check collisions
      // - Update score in scoreRef.current
      
      // DRAW: Clear and redraw everything
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      
      // Draw your game objects using ctx methods
      // IMPORTANT: Draw player and game objects FIRST
      // Example: ctx.fillRect(objects.player.x, objects.player.y, 20, 20);
      
      // CRITICAL: Draw thumb indicator SECOND (after player) so it appears BEHIND/BELOW
      // Position: Below player on screen for thumb placement guide
      // Z-Index: Drawn after player but semi-transparent so player is still visible
      if (isMobile && 'ontouchstart' in window && objects.player) {
        const circleX = objects.player.x + objects.player.width / 2;
        const circleY = objects.player.y + objects.player.height + 50; // Below player (positive offset)
        
        // Draw semi-transparent circle where thumb should be placed
        ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
        ctx.beginPath();
        ctx.arc(circleX, circleY, 30, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw dashed circle border
        ctx.strokeStyle = 'rgba(74, 144, 226, 0.4)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash
        
        // Draw hand emoji in center of circle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('👆', circleX, circleY + 6);
      }
      
      // Draw UI overlays (always on top)
      // Draw score
      ctx.fillStyle = '#ffffff';
      ctx.font = isMobile ? '16px monospace' : '20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(\`Score: \${scoreRef.current}\`, 10, 30);
      
      // Draw AUTO SHOOT indicator on mobile (always on top)
      if (isMobile && 'ontouchstart' in window) {
        ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AUTO SHOOT ENABLED', gameWidth / 2, 20);
      }
      
      // Sync score with React state periodically
      if (scoreRef.current !== score) {
        setScore(scoreRef.current);
      }
      
      // Check game over conditions
      // if (gameOver) {
      //   setGameState('gameOver');
      // }
    }, 1000 / 60);

    return () => clearInterval(gameLoop);
  }, [gameState, gameWidth, gameHeight, isMobile, score]);

  // 9. Reset game
  const resetGame = () => {
    scoreRef.current = 0;
    setScore(0);
    setGameState('playing');
    
    // Reset game objects
    gameObjectsRef.current = {
      // Reset to initial state
    };
  };

  // 10. Resume from pause
  const resumeGame = () => {
    setGameState('playing');
  };

  return (
    <div className={\`\${isMobile ? 'fixed inset-0' : 'min-h-screen'} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center\`}>
      {/* Header (desktop only) */}
      {!isMobile && (
        <div className="text-white text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">Your Generated Game</h1>
          <p className="text-gray-300">
            {controlMode === 'keyboard' ? 'Arrow Keys / WASD to move' : 'Move mouse to aim'} • Space OR Click to shoot • ESC to pause
          </p>
          
          {/* Control Mode Toggle */}
          <div className="mt-3 flex items-center justify-center gap-2">
            <span className="text-gray-400 text-xs">Control Mode:</span>
            <button
              onClick={() => setControlMode('keyboard')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-all \${
                controlMode === 'keyboard' 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
              }\`}
            >
              ⌨️ Keyboard
            </button>
            <button
              onClick={() => setControlMode('mouse')}
              className={\`px-4 py-2 rounded-lg text-sm font-bold transition-all \${
                controlMode === 'mouse' 
                  ? 'bg-purple-600 text-white hover:bg-purple-700' 
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
              }\`}
            >
              🖱️ Mouse
            </button>
          </div>
        </div>
      )}

      {/* Game Canvas */}
      <div className={\`relative \${isMobile ? 'w-full h-full' : ''}\`}>
        <canvas
          ref={canvasRef}
          className={isMobile ? 'w-full h-full' : 'border-2 border-purple-500 rounded-lg shadow-2xl'}
          style={{
            display: 'block',
            imageRendering: 'pixelated',
            touchAction: 'none',
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        />

        {/* Pause Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-4">PAUSED</h2>
              <button
                onClick={resumeGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl"
              >
                Resume
              </button>
            </div>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameOver' && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-5xl font-bold mb-4 text-red-500">GAME OVER</h2>
              <p className="text-3xl mb-6">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl"
              >
                Play Again
              </button>
            </div>
          </div>
        )}

        {/* Victory Overlay */}
        {gameState === 'won' && (
          <div className="absolute inset-0 bg-black/90 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-5xl font-bold mb-4 text-green-500">🎉 YOU WIN! 🎉</h2>
              <p className="text-3xl mb-6">Final Score: {score}</p>
              <button
                onClick={resetGame}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg text-xl"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Controls Hint */}
      {isMobile && gameState === 'playing' && (
        <div className="absolute bottom-4 left-0 right-0 text-center text-white/70 text-sm">
          Touch to move • Auto-shooting enabled
        </div>
      )}
    </div>
  );
};

export default Game;
`;

export const UNIFIED_SYSTEM_PROMPT = `You are a game development AI that creates playable games using React, TypeScript, and HTML5 Canvas.

CRITICAL INSTRUCTIONS:

1. **UNIFIED RESPONSIVE DESIGN**:
   ✅ Single codebase works on both mobile and desktop
   ✅ Full-screen on mobile (window.innerWidth, window.innerHeight)
   ✅ Windowed on desktop (max 1200x800, responsive)
   ✅ Detect mobile: screen width, touch capability, user agent
   ✅ All UI must be responsive and touch-friendly

2. **ADAPTIVE CONTROLS** (CRITICAL - CONTROL MODE TOGGLE):
   ✅ **Control Mode State & Ref**: Add controlMode state AND controlModeRef
   ✅ **Sync State to Ref**: Use useEffect to sync controlMode to controlModeRef.current
   ✅ **Toggle Buttons**: Two buttons to switch between keyboard and mouse mode
   ✅ **Game Loop Check**: In game loop, check controlModeRef.current to determine input
   ✅ **Keyboard Mode**: Use keysPressed.current ONLY when controlModeRef.current === 'keyboard'
   ✅ **Mouse Mode**: Use mousePos.current ONLY when controlModeRef.current === 'mouse'
   ✅ **Shooting**: Spacebar AND mouse clicks work in BOTH modes
   ✅ **Touch**: Tap and drag (mobile)
   ✅ **Auto-shooting**: Enabled on mobile devices (every 250ms)
   ✅ **ESC key**: Pause game (works in both modes)
   ✅ **No Conflicts**: Controls don't interfere with each other

3. **CANVAS RENDERING** (CRITICAL):
   ✅ ALL game graphics MUST render to <canvas>
   ✅ NO custom JSX components for game objects
   ✅ Use ctx.fillRect(), ctx.arc(), ctx.drawImage(), etc.
   ✅ Game overlays (pause, game over) CAN be JSX
   ✅ Use 2D context only (ctx.fillStyle, ctx.strokeStyle, etc.)

4. **MOBILE-FIRST FEATURES** (CRITICAL - WORKING CODE PROVIDED):
   ✅ **Touch Controls**: MUST implement handleTouchMove to update player position
   ✅ **Working Code Provided**: Use the touch handler code exactly as shown
   ✅ Auto-shooting on mobile (no tap to shoot required)
   ✅ **Thumb Indicator BELOW Player**: circleY = player.y + player.height + 50 (below on screen)
   ✅ **DRAWING ORDER**: Player FIRST, then thumb indicator (semi-transparent)
   ✅ **Z-Index Control**: Clear → Player → Thumb circle (transparent) → UI text
   ✅ **Working Indicator Code**: Complete thumb indicator implementation provided
   ✅ **Visual Guide**: Circle shows where to place thumb, below player on screen
   ✅ Touch-optimized UI elements
   ✅ Full-screen experience on mobile
   ✅ Show "AUTO SHOOT ENABLED" indicator at top of screen

5. **GAME STATE MANAGEMENT**:
   ✅ Use refs for game objects (gameObjectsRef.current)
   ✅ **Player Position**: Start player at y = gameHeight * 0.8 (20% from bottom)
   ✅ This keeps player icon visible above thumb indicator on mobile
   ✅ NO setState in game loop (causes lag)
   ✅ Update score periodically from ref to state
   ✅ Game states: 'playing', 'paused', 'gameOver', 'won'
   ✅ Include reset functionality

6. **PERFORMANCE**:
   ✅ 60 FPS game loop using setInterval
   ✅ All game logic in game loop interval
   ✅ Use refs for high-frequency updates
   ✅ Optimize for mobile devices

7. **STYLING**:
   ✅ Dark theme: gradient from slate-900 via purple-900
   ✅ Retro/pixel art style preferred
   ✅ Monospace fonts (Courier New)
   ✅ Responsive layouts with Tailwind CSS
   ✅ Mobile: full-screen, Desktop: centered with borders

8. **CODE QUALITY**:
   ✅ Clean, readable TypeScript code
   ✅ Proper cleanup of event listeners
   ✅ Type-safe interfaces
   ✅ Comments explaining game logic
   ✅ No external dependencies

EXAMPLE GAMES TO EMULATE:
- Space Invaders: Shooting, enemies, movement
- Flappy Bird: Jumping, obstacles, scrolling
- Snake: Grid movement, growth, collision
- Breakout: Ball physics, brick destruction
- Pac-Man: Maze navigation, collectibles

RESPONSE FORMAT:
- Return ONLY the complete .tsx component code
- Start with 'use client';
- Include all necessary imports
- Must be a complete, runnable component
- No explanations, just code

Remember: One codebase, works everywhere, adapts automatically!
`;

