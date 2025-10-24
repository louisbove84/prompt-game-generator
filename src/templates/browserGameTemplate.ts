/**
 * Browser Game Template for Full-Screen Sophisticated Games
 * 
 * This template is optimized for full browser experience with:
 * - Full viewport usage
 * - Advanced graphics and effects
 * - Complex game mechanics
 * - Desktop-focused controls (keyboard + mouse)
 * - Can use React, Three.js, Phaser, or pure Canvas
 */

export const BROWSER_GAME_TEMPLATE = `
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * BROWSER GAME TEMPLATE - Full Screen Experience
 * 
 * Features:
 * 1. Full viewport utilization (100vw x 100vh)
 * 2. Advanced graphics and animations
 * 3. Complex game mechanics
 * 4. Desktop-optimized controls (keyboard + mouse)
 * 5. Can use advanced APIs (WebGL, Web Audio, etc.)
 * 6. High-quality graphics and effects
 * 
 * Technologies Available:
 * - React hooks for state management
 * - Canvas 2D API for rendering
 * - Can use external libraries if needed (mention in description)
 * - Full browser APIs available
 */

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX?: number;
  velocityY?: number;
  // Add custom properties
}

interface GameState {
  // Define your complex game state
}

const BrowserGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const keysPressed = useRef<Set<string>>(new Set());
  const mousePos = useRef({ x: 0, y: 0 });
  
  // Full viewport dimensions
  const [gameWidth, setGameWidth] = useState(0);
  const [gameHeight, setGameHeight] = useState(0);
  
  // Game state
  const [gameState, setGameState] = useState<'playing' | 'gameOver' | 'paused' | 'won'>('playing');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Game objects (use refs for performance)
  const gameObjectsRef = useRef<any>({
    // Initialize your game objects
    // Can be more complex: particles, enemies, projectiles, power-ups, etc.
  });

  // 1. Initialize full-screen dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setGameWidth(window.innerWidth);
      setGameHeight(window.innerHeight);
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // 2. Initialize high-DPI canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gameWidth === 0 || gameHeight === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = gameWidth * dpr;
    canvas.height = gameHeight * dpr;
    ctx.scale(dpr, dpr);
    
    canvas.style.width = gameWidth + 'px';
    canvas.style.height = gameHeight + 'px';
  }, [gameWidth, gameHeight]);

  // 3. Keyboard controls (works on both mobile and desktop)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for game keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
      keysPressed.current.add(e.key.toLowerCase());
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
  }, []);

  // 4. Mouse controls (works on both mobile and desktop)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleClick = (e: MouseEvent) => {
      if (gameState !== 'playing') return;
      
      // Handle click actions (shooting, placing, etc.)
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      // Add click logic here
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [gameState]);

  // 5. Touch controls (works on both mobile and desktop with touch)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // Handle touch input
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    // Handle touch movement
    e.preventDefault();
  };

  // 5. Game loop using requestAnimationFrame (smooth 60fps)
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let lastTime = performance.now();
    
    const gameLoop = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
      lastTime = currentTime;
      
      const objects = gameObjectsRef.current;
      const keys = keysPressed.current;
      const mouse = mousePos.current;
      
      // UPDATE: Update game logic
      // - Process keyboard input (WASD + Arrow keys + Space)
      // - Process mouse position/clicks
      // - Update physics and collisions
      // - Update score and level
      // - Spawn enemies, power-ups, etc.
      
      // Example: Check for movement keys
      if (keys.has('arrowleft') || keys.has('a')) {
        // Move left
      }
      if (keys.has('arrowright') || keys.has('d')) {
        // Move right
      }
      if (keys.has('arrowup') || keys.has('w')) {
        // Move up or jump
      }
      if (keys.has('arrowdown') || keys.has('s')) {
        // Move down
      }
      if (keys.has(' ')) {
        // Action (shoot, interact, etc.)
      }
      
      // DRAW: Clear and render
      ctx.fillStyle = '#0a0a2e';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      
      // Draw game objects with advanced effects
      // - Use ctx.shadowBlur for glow effects
      // - Use gradients for backgrounds
      // - Use ctx.globalAlpha for transparency
      // - Draw particles, trails, explosions
      
      // Example: Draw background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, gameHeight);
      gradient.addColorStop(0, '#0a0a2e');
      gradient.addColorStop(1, '#1a1a4e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      
      // Check game over/win conditions
      // if (playerDead) setGameState('gameOver');
      // if (levelComplete) setGameState('won');
      
      rafRef.current = requestAnimationFrame(gameLoop);
    };

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [gameState, gameWidth, gameHeight]);

  // 6. Pause game (ESC key)
  useEffect(() => {
    const handlePause = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
      }
    };
    
    window.addEventListener('keydown', handlePause);
    return () => window.removeEventListener('keydown', handlePause);
  }, []);

  // 7. Reset game
  const resetGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    gameObjectsRef.current = {
      // Re-initialize game objects
    };
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-black">
      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 pointer-events-none">
        <div className="flex justify-between items-center text-white font-mono">
          <div className="text-2xl font-bold">
            SCORE: {score}
          </div>
          <div className="text-2xl font-bold">
            LEVEL: {level}
          </div>
        </div>
      </div>

      {/* Game Canvas - Full Screen */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-crosshair"
        style={{
          display: 'block',
          imageRendering: 'crisp-edges',
          touchAction: 'none',
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      />

      {/* Pause Overlay */}
      {gameState === 'paused' && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-white font-mono mb-8">PAUSED</h2>
            <p className="text-white text-xl mb-4">Press ESC to resume</p>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === 'gameOver' && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-red-500 font-mono mb-8">GAME OVER</h2>
            <p className="text-white text-3xl mb-8">Final Score: {score}</p>
            <button
              onClick={resetGame}
              className="bg-red-600 hover:bg-red-700 text-white font-mono font-bold px-8 py-4 rounded-lg text-xl transition-all transform hover:scale-105"
            >
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Victory Overlay */}
      {gameState === 'won' && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20">
          <div className="text-center">
            <h2 className="text-6xl font-bold text-green-500 font-mono mb-8">VICTORY!</h2>
            <p className="text-white text-3xl mb-8">Score: {score}</p>
            <button
              onClick={resetGame}
              className="bg-green-600 hover:bg-green-700 text-white font-mono font-bold px-8 py-4 rounded-lg text-xl transition-all transform hover:scale-105"
            >
              NEXT LEVEL
            </button>
          </div>
        </div>
      )}

      {/* Controls HUD */}
      <div className="absolute bottom-4 right-4 z-10 bg-black/50 p-4 rounded-lg text-white font-mono text-sm pointer-events-none">
        <div>WASD / Arrows: Move</div>
        <div>Space: Action</div>
        <div>ESC: Pause</div>
      </div>
    </div>
  );
};

export default BrowserGame;
`;

export const BROWSER_GAME_SYSTEM_PROMPT = `You are an expert game developer creating sophisticated browser games with full-screen capabilities.

Your task is to generate a complete, polished browser game that uses THE ENTIRE VIEWPORT.

CRITICAL REQUIREMENTS - BROWSER GAMES:

1. **Full-Screen Experience**:
   ✅ Use 100vw x 100vh (full browser viewport)
   ✅ Responsive to window resize
   ✅ High-quality graphics and effects
   ✅ Advanced game mechanics
   
2. **Unified Controls** (works on both mobile and desktop):
   ✅ Keyboard: WASD + Arrow Keys + Space
   ✅ Mouse: Movement tracking + Click actions
   ✅ Touch: Tap and drag for mobile/touch devices
   ✅ ESC key for pause
   ✅ All control methods work together seamlessly
   
3. **Advanced Features** (Use these!):
   ✅ Gradients and shadows for visual effects
   ✅ Particles and visual effects
   ✅ Multiple levels or difficulty progression
   ✅ Sound effects (optional, can use Web Audio API)
   ✅ Smooth animations using requestAnimationFrame
   ✅ HUD (Heads-Up Display) for score, level, health, etc.
   
4. **Graphics Quality**:
   ✅ Use canvas 2D context with advanced features
   ✅ Implement visual effects (glow, shadows, gradients)
   ✅ Smooth animations (60 FPS)
   ✅ Polish and attention to detail
   
5. **Game Loop**:
   ✅ Use requestAnimationFrame (not setInterval)
   ✅ Delta time for smooth movement
   ✅ Proper performance optimization
   
6. **UI Elements**:
   ✅ Full-screen game canvas
   ✅ Score/stats overlay (HUD)
   ✅ Pause screen (ESC key)
   ✅ Game over screen
   ✅ Victory screen
   ✅ Controls guide

7. **Game Types That Work Well**:
   ✅ Top-down shooters
   ✅ Space games with full viewport
   ✅ Strategy/tower defense
   ✅ Platformers with large levels
   ✅ Bullet hell games
   ✅ Racing games
   ✅ Puzzle games with complex mechanics
   
STYLING:
- Full viewport: w-screen h-screen
- Dark, immersive backgrounds
- Neon/glow effects for a modern look
- Professional HUD overlays
- Smooth transitions and animations

CONTROLS (Unified - works on both mobile and desktop):
- WASD + Arrow Keys for movement
- Space for primary action
- Mouse movement for aiming/tracking (desktop)
- Mouse click for secondary action (desktop)
- Touch for tap and drag (mobile/touch devices)
- ESC for pause/menu
- All control methods work together seamlessly

PERFORMANCE:
- Target 60 FPS consistently
- Use refs for game state (no setState in game loop)
- requestAnimationFrame for smooth animation
- Optimize drawing and calculations
- Clean up event listeners properly

CODE QUALITY:
- TypeScript with proper typing
- Clean, well-commented code
- Professional game architecture
- Proper state management
- Error handling

Return ONLY the complete .tsx file content. No markdown, no explanations.
Make it sophisticated, polished, and fun!`;

export const BROWSER_EXAMPLE_PROMPTS = [
  "A space shooter where you pilot a ship across the entire screen, dodging asteroids and shooting enemies with mouse aim",
  "A tower defense game where you place towers across a full-screen battlefield to stop waves of enemies",
  "A top-down zombie survival game where you navigate a large map and shoot zombies that come from all directions",
  "A racing game viewed from above where you drive through a winding track that fills the entire screen",
  "A real-time strategy game where you command units across a battlefield with mouse controls",
  "A bullet hell game with complex patterns filling the entire screen",
  "A platformer with large levels that scroll as you move through them",
  "A puzzle game with a large grid that uses the full screen for complex mechanics"
];

