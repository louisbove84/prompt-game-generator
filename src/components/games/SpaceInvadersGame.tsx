'use client';

import React, { useState, useEffect, useRef } from 'react';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  direction?: number;
}

interface GameObjects {
  player: GameObject;
  bullets: GameObject[];
  enemies: GameObject[];
  enemyBullets: GameObject[];
}

const SpaceInvadersGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState('playing');
  const [score, setScore] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [gameObjects, setGameObjects] = useState<GameObjects>({
    player: { x: 150, y: 280, width: 20, height: 20 },
    bullets: [],
    enemies: [],
    enemyBullets: [],
  });
  const [gameWidth, setGameWidth] = useState(320);
  const [gameHeight, setGameHeight] = useState(320);

  // Initialize the game when component mounts
  useEffect(() => {
    console.log('Space Invaders game initialized');
    
    // Detect if we're on mobile and set dimensions (no SDK initialization here)
    const updateDimensions = () => {
      const mobile = window.innerWidth <= 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
      setGameWidth(mobile ? window.innerWidth : 320);
      setGameHeight(mobile ? window.innerHeight : 320);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize canvas and game objects when dimensions change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size based on device
    const dpr = window.devicePixelRatio || 1;
    
    // Set actual canvas size (internal resolution)
    canvas.width = gameWidth * dpr;
    canvas.height = gameHeight * dpr;
    
    // Scale the drawing context to match device pixel ratio
    ctx.scale(dpr, dpr);
    
    // Set CSS size
    canvas.style.width = gameWidth + 'px';
    canvas.style.height = gameHeight + 'px';
    
    // Update player position
    setGameObjects(prev => ({
      ...prev,
      player: { 
        x: gameWidth / 2 - 10, 
        y: gameHeight - 120, // Moved higher to make room for controls
        width: 20, 
        height: 20 
      }
    }));
    
    // Initialize enemies, centered
    const enemyWidth = 20;
    const enemyHeight = 15;
    const colGap = 15;
    const rowGap = 30;
    const numCols = 8;
    const numRows = 3;
    const enemiesSpan = (numCols - 1) * (enemyWidth + colGap) + enemyWidth;
    const leftMargin = (gameWidth - enemiesSpan) / 2;
    
    const enemies: GameObject[] = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        enemies.push({
          x: col * (enemyWidth + colGap) + leftMargin,
          y: row * (enemyHeight + rowGap) + 50,
          width: enemyWidth,
          height: enemyHeight,
          direction: 1,
        });
      }
    }
    
    setGameObjects(prev => ({ ...prev, enemies }));
  }, [gameWidth, gameHeight]);

  // Auto-shooting for mobile
  useEffect(() => {
    if (gameState !== 'playing' || !isMobile) return;

    const autoShoot = setInterval(() => {
      setGameObjects(prev => ({
        ...prev,
        bullets: [
          ...prev.bullets,
          {
            x: prev.player.x + prev.player.width / 2 - 1,
            y: prev.player.y,
            width: 2,
            height: 8,
          },
        ],
      }));
    }, 300); // Auto-shoot every 300ms on mobile

    return () => clearInterval(autoShoot);
  }, [gameState, isMobile]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameLoop = setInterval(() => {
      setGameObjects(prev => {
        // Move enemies
        const enemies = prev.enemies.map((enemy: GameObject) => ({
          ...enemy,
          x: enemy.x + (enemy.direction || 1) * 0.5,
        }));

        // Change direction when hitting edges
        const enemyWidth = 20; // Consistent with init
        if (enemies.some((e: GameObject) => e.x <= 0 || e.x >= gameWidth - enemyWidth)) {
          enemies.forEach((enemy: GameObject) => {
            enemy.direction = (enemy.direction || 1) * -1;
            enemy.y += 10;
          });
        }

        // Check if enemies reached bottom
        if (enemies.some((e: GameObject) => e.y + e.height >= prev.player.y)) {
          setGameState('gameOver');
          return prev;
        }

        // Move bullets
        const bullets = prev.bullets.map((bullet: GameObject) => ({
          ...bullet,
          y: bullet.y - 3,
        })).filter((bullet: GameObject) => bullet.y > 0);

        // Move enemy bullets
        const enemyBullets = prev.enemyBullets.map((bullet: GameObject) => ({
          ...bullet,
          y: bullet.y + 2,
        })).filter((bullet: GameObject) => bullet.y < gameHeight);

        // Enemy shooting logic
        const newEnemyBullets = [...enemyBullets];
        if (Math.random() < 0.02 && enemies.length > 0) { // 2% chance per frame
          const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
          newEnemyBullets.push({
            x: randomEnemy.x + randomEnemy.width / 2 - 2,
            y: randomEnemy.y + randomEnemy.height,
            width: 4,
            height: 8,
          });
        }

        // Check collisions
        const newBullets = bullets.filter((bullet: GameObject) => {
          const hitEnemy = enemies.find((enemy: GameObject) => 
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          );
          
          if (hitEnemy) {
            setScore(prev => prev + 10);
            return false;
          }
          return true;
        });

        // Remove hit enemies
        const newEnemies = enemies.filter((enemy: GameObject) => {
          return !bullets.some((bullet: GameObject) => 
            bullet.x < enemy.x + enemy.width &&
            bullet.x + bullet.width > enemy.x &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y + bullet.height > enemy.y
          );
        });

        // Check if player is hit
        const playerHit = newEnemyBullets.some((bullet: GameObject) => 
          bullet.x < prev.player.x + prev.player.width &&
          bullet.x + bullet.width > prev.player.x &&
          bullet.y < prev.player.y + prev.player.height &&
          bullet.y + bullet.height > prev.player.y
        );

        if (playerHit) {
          setGameState('gameOver');
        }

        // Check win condition
        if (newEnemies.length === 0) {
          setGameState('won');
        }

        return {
          ...prev,
          bullets: newBullets,
          enemies: newEnemies,
          enemyBullets: newEnemyBullets,
        };
      });
    }, 50);

    return () => clearInterval(gameLoop);
  }, [gameState, gameWidth, gameHeight]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      // Prevent default behavior for game controls
      if (e.key === ' ' || e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }

      setGameObjects(prev => {
        switch (e.key) {
          case 'ArrowLeft':
            return {
              ...prev,
              player: {
                ...prev.player,
                x: Math.max(0, prev.player.x - 10),
              },
            };
          case 'ArrowRight':
            return {
              ...prev,
              player: {
                ...prev.player,
                x: Math.min(gameWidth - prev.player.width, prev.player.x + 10),
              },
            };
          case ' ':
            // Only allow manual shooting on desktop
            if (!isMobile) {
              return {
                ...prev,
                bullets: [
                  ...prev.bullets,
                  {
                    x: prev.player.x + prev.player.width / 2 - 1,
                    y: prev.player.y,
                    width: 2,
                    height: 8,
                  },
                ],
              };
            }
            return prev;
          default:
            return prev;
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, isMobile, gameWidth]);

  // Mobile touch controls
  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== 'playing') return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left; // Logical CSS pixels, no * dpr

    // Move player to touch position (constrained to canvas width)
    setGameObjects(prev => ({
      ...prev,
      player: {
        ...prev.player,
        x: Math.max(0, Math.min(gameWidth - prev.player.width, touchX - prev.player.width / 2)),
      },
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    handleTouchMove(e);
  };

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#0a0a2e';
    ctx.fillRect(0, 0, gameWidth, gameHeight);
    
    // Draw touch indicator below player (mobile only)
    if (isMobile) {
      // Draw semi-transparent circle below ship
      const circleX = gameObjects.player.x + gameObjects.player.width / 2;
      const circleY = gameObjects.player.y + gameObjects.player.height + 30; // Reduced offset
      
      ctx.fillStyle = 'rgba(74, 144, 226, 0.2)';
      ctx.beginPath();
      ctx.arc(circleX, circleY, 30, 0, 2 * Math.PI); // Reduced radius
      ctx.fill();
      
      // Draw dashed circle border
      ctx.strokeStyle = 'rgba(74, 144, 226, 0.4)';
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash
      
      // Draw small hand icon in the center of circle
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = '20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('👆', circleX, circleY + 6);
    }
    
    // Draw player (simple ship shape)
    ctx.fillStyle = '#4a90e2';
    ctx.beginPath();
    ctx.moveTo(gameObjects.player.x + gameObjects.player.width / 2, gameObjects.player.y);
    ctx.lineTo(gameObjects.player.x, gameObjects.player.y + gameObjects.player.height);
    ctx.lineTo(gameObjects.player.x + gameObjects.player.width, gameObjects.player.y + gameObjects.player.height);
    ctx.closePath();
    ctx.fill();
    
    // Draw enemies (simple invader shape)
    ctx.fillStyle = '#ff6b6b';
    gameObjects.enemies.forEach((enemy: GameObject) => {
      const w = enemy.width;
      const h = enemy.height;
      const x = enemy.x;
      const y = enemy.y;
      // Body
      ctx.fillRect(x + w * 0.1, y + h * 0.2, w * 0.8, h * 0.4);
      ctx.fillRect(x + w * 0.3, y, w * 0.4, h * 0.2);
      // Legs
      ctx.fillRect(x, y + h * 0.6, w * 0.2, h * 0.4);
      ctx.fillRect(x + w * 0.8, y + h * 0.6, w * 0.2, h * 0.4);
      // Arms
      ctx.fillRect(x + w * 0.2, y + h * 0.6, w * 0.2, h * 0.2);
      ctx.fillRect(x + w * 0.6, y + h * 0.6, w * 0.2, h * 0.2);
    });
    
    // Draw bullets
    ctx.fillStyle = '#ffffff';
    gameObjects.bullets.forEach((bullet: GameObject) => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
    // Draw enemy bullets
    ctx.fillStyle = '#ff6b6b';
    gameObjects.enemyBullets.forEach((bullet: GameObject) => {
      ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });
    
    // Draw score (centered at top)
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Courier New"';
    const scoreText = `SCORE: ${score}`;
    ctx.fillText(scoreText, gameWidth / 2 - ctx.measureText(scoreText).width / 2, 30);
    
    // Draw game over screen
    if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      ctx.fillStyle = '#ff6b6b';
      ctx.font = '24px "Courier New"';
      const gameOverText = 'GAME OVER';
      ctx.fillText(gameOverText, gameWidth / 2 - ctx.measureText(gameOverText).width / 2, gameHeight / 2 - 20);
      ctx.font = '16px "Courier New"';
      const finalScoreText = `FINAL SCORE: ${score}`;
      ctx.fillText(finalScoreText, gameWidth / 2 - ctx.measureText(finalScoreText).width / 2, gameHeight / 2 + 10);
    }
    
    if (gameState === 'won') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      ctx.fillStyle = '#4a90e2';
      ctx.font = '24px "Courier New"';
      const wonText = 'MISSION COMPLETE!';
      ctx.fillText(wonText, gameWidth / 2 - ctx.measureText(wonText).width / 2, gameHeight / 2 - 20);
      ctx.font = '16px "Courier New"';
      const scoreTextWon = `SCORE: ${score}`;
      ctx.fillText(scoreTextWon, gameWidth / 2 - ctx.measureText(scoreTextWon).width / 2, gameHeight / 2 + 10);
    }
  }, [gameObjects, score, gameState, gameWidth, gameHeight, isMobile]);

  const resetGame = () => {
    setGameState('playing');
    setScore(0);
    
    // Reinitialize enemies
    const enemyWidth = 20;
    const enemyHeight = 15;
    const colGap = 15;
    const rowGap = 30;
    const numCols = 8;
    const numRows = 3;
    const enemiesSpan = (numCols - 1) * (enemyWidth + colGap) + enemyWidth;
    const leftMargin = (gameWidth - enemiesSpan) / 2;
    
    const enemies: GameObject[] = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        enemies.push({
          x: col * (enemyWidth + colGap) + leftMargin,
          y: row * (enemyHeight + rowGap) + 50,
          width: enemyWidth,
          height: enemyHeight,
          direction: 1,
        });
      }
    }
    
    setGameObjects({
      player: { x: gameWidth / 2 - 10, y: gameHeight - 120, width: 20, height: 20 },
      bullets: [],
      enemies: enemies,
      enemyBullets: [],
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${isMobile ? 'p-0' : 'p-4'}`}>
      {/* Game Title */}
      {!isMobile && (
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white font-mono">SPACE INVADERS</h1>
        </div>
      )}

      {/* Game Canvas */}
      <div className={`flex justify-center ${isMobile ? 'h-screen' : 'mb-4'}`}>
        <div className="relative w-full h-full">
          <canvas
            ref={canvasRef}
            className={isMobile ? '' : 'border-2 border-blue-500 rounded-lg'}
            style={{
              backgroundColor: '#0a0a2e',
              width: `${gameWidth}px`,
              height: `${gameHeight}px`,
              touchAction: 'none', // Prevent scrolling on touch
              imageRendering: 'pixelated', // Keep crisp pixels for retro feel
            }}
            onTouchStart={isMobile ? handleTouchStart : undefined}
            onTouchMove={isMobile ? handleTouchMove : undefined}
          />
          
          {(gameState === 'gameOver' || gameState === 'won') && (
            <button
              onClick={resetGame}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 translate-y-20 bg-red-500 text-white font-mono font-bold px-4 py-2 rounded hover:bg-red-600 transition-all duration-300"
            >
              RESTART
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpaceInvadersGame;