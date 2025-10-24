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
      // Example: player: { x: gameWidth / 2, y: gameHeight - 50, width: 20, height: 20 }
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
      if (controlMode === 'mouse') {
        // EXAMPLE: Move player to mouse position
        // gameObjectsRef.current.player.x = mousePos.current.x;
      }
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

  // 7. Touch controls (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // Handle touch input
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    e.preventDefault();
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // Handle touch movement
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
      // - Process keyboard input from keysPressed.current
      // - Move objects
      // - Check collisions
      // - Update score in scoreRef.current
      
      // DRAW: Clear and redraw everything
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      
      // Draw your game objects using ctx methods
      // Example: ctx.fillRect(objects.player.x, objects.player.y, 20, 20);
      
      // Draw mobile control indicators
      if (isMobile && 'ontouchstart' in window) {
        // Draw touch indicator at top of screen (not covered by thumb)
        ctx.fillStyle = 'rgba(34, 197, 94, 0.9)';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('AUTO SHOOT ENABLED', gameWidth / 2, 20);
        
        // Optional: Draw indicator above player if you have player object
        // const circleX = objects.player.x + objects.player.width / 2;
        // const circleY = objects.player.y - 50; // Above player
        // ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
        // ctx.beginPath();
        // ctx.arc(circleX, circleY, 30, 0, 2 * Math.PI);
        // ctx.fill();
        // ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        // ctx.font = '20px monospace';
        // ctx.fillText('👆', circleX, circleY + 6);
      }
      
      // Draw score
      ctx.fillStyle = '#ffffff';
      ctx.font = isMobile ? '16px monospace' : '20px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(\`Score: \${scoreRef.current}\`, 10, 30);
      
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
   ✅ **Control Mode State**: Add controlMode state ('keyboard' | 'mouse')
   ✅ **Toggle Buttons**: Two buttons to switch between keyboard and mouse mode
   ✅ **Keyboard Mode**: Arrow keys/WASD move player, mouse movement disabled
   ✅ **Mouse Mode**: Mouse moves player, arrow keys disabled for movement
   ✅ **Shooting**: Spacebar AND mouse clicks work in BOTH modes
   ✅ **Touch**: Tap and drag (mobile)
   ✅ **Auto-shooting**: Enabled on mobile devices (every 250ms)
   ✅ **ESC key**: Pause game (works in both modes)
   ✅ **No Conflicts**: Controls don't interfere with each other
   ✅ User explicitly chooses their preferred input method

3. **CANVAS RENDERING** (CRITICAL):
   ✅ ALL game graphics MUST render to <canvas>
   ✅ NO custom JSX components for game objects
   ✅ Use ctx.fillRect(), ctx.arc(), ctx.drawImage(), etc.
   ✅ Game overlays (pause, game over) CAN be JSX
   ✅ Use 2D context only (ctx.fillStyle, ctx.strokeStyle, etc.)

4. **MOBILE-FIRST FEATURES**:
   ✅ Auto-shooting on mobile (no tap to shoot required)
   ✅ Visual indicators for mobile controls
   ✅ Touch-optimized UI elements
   ✅ Full-screen experience on mobile
   ✅ Show "AUTO SHOOT" indicator on mobile

5. **GAME STATE MANAGEMENT**:
   ✅ Use refs for game objects (gameObjectsRef.current)
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

