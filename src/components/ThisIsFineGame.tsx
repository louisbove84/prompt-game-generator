'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';

// "This Is Fine" Room Defense - Protect the dog from chaos
type HazardType = 'fire' | 'smoke' | 'debris' | 'water';
type DefenseType = 'extinguisher' | 'fan' | 'umbrella';

interface Hazard {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  hp: number;
  maxHp: number;
  type: HazardType;
  age: number;
  stunned: boolean;
}

interface Defense {
  id: number;
  x: number;
  y: number;
  range: number;
  cooldown: number;
  maxCooldown: number;
  type: DefenseType;
  active: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface Dog {
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  calmness: number; // 0-100, affects defense effectiveness
  hatWobble: number;
}

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

const ThisIsFineGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const bgImgRef = useRef<HTMLImageElement | null>(null);

  // Game dimensions
  const [gameWidth, setGameWidth] = useState(420);
  const [gameHeight, setGameHeight] = useState(560);
  const [isMobile, setIsMobile] = useState(false);

  // Game state
  const [score, setScore] = useState(100); // Start with $100
  const [level, setLevel] = useState(1);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'gameOver'>('start');
  
  // Game objects
  const hazardsRef = useRef<Hazard[]>([]);
  const defensesRef = useRef<Defense[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const dogRef = useRef<Dog>({
    x: 0, y: 0, health: 100, maxHealth: 100, calmness: 100, hatWobble: 0
  });
  
  // Game mechanics
  const chaosLevelRef = useRef<number>(0); // 0-100, increases over time
  const dogCalmCooldownRef = useRef<number>(0); // cooldown for "This is fine" ability
  const spawnTimerRef = useRef<number>(0);
  const idCounterRef = useRef<number>(1);

  // Initialize canvas and load assets
  useEffect(() => {
    const update = () => {
      const mobile = window.innerWidth <= 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
      const w = mobile ? window.innerWidth : 420;
      const h = mobile ? window.innerHeight : 560;
      setGameWidth(w);
      setGameHeight(h);
      
      // Position dog in center-bottom
      dogRef.current.x = w / 2;
      dogRef.current.y = h - 120;
      
      // Load background image
      if (!bgImgRef.current) {
        const img = new Image();
        img.src = '/games/itsFine-3x2.jpg';
        img.onload = () => (bgImgRef.current = img);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(gameWidth * dpr);
    canvas.height = Math.floor(gameHeight * dpr);
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, [gameWidth, gameHeight]);

  // Start new game
  const startGame = useCallback(() => {
    hazardsRef.current = [];
    defensesRef.current = [];
    particlesRef.current = [];
    chaosLevelRef.current = 0;
    dogCalmCooldownRef.current = 0;
    spawnTimerRef.current = 0;
    idCounterRef.current = 1;
    setScore(100); // Start with $100 to buy initial defenses
    setLevel(1);
    dogRef.current = {
      x: gameWidth / 2,
      y: gameHeight - 120,
      health: 100,
      maxHealth: 100,
      calmness: 100,
      hatWobble: 0
    };
    setGameState('playing');
  }, [gameWidth, gameHeight]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    lastTsRef.current = performance.now();
    
    const step = (ts: number) => {
      const dt = Math.min(0.033, (ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      // Update timers
      dogCalmCooldownRef.current = Math.max(0, dogCalmCooldownRef.current - dt * 1000);
      spawnTimerRef.current -= dt;
      
      // Increase chaos over time
      chaosLevelRef.current = Math.min(100, chaosLevelRef.current + dt * 2);
      
      // Update dog's hat wobble
      dogRef.current.hatWobble = Math.sin(ts * 0.003) * 2;

      // Spawn hazards based on chaos level
      if (spawnTimerRef.current <= 0) {
        const spawnRate = 1.5 - (chaosLevelRef.current / 100) * 1.2; // faster spawning as chaos increases
        spawnTimerRef.current = spawnRate;
        
        // Spawn from edges
        const side = Math.floor(Math.random() * 4);
        let x = 0, y = 0, vx = 0, vy = 0;
        
        switch (side) {
          case 0: // top
            x = Math.random() * gameWidth;
            y = -20;
            vx = (Math.random() - 0.5) * 30;
            vy = 20 + Math.random() * 40;
            break;
          case 1: // right
            x = gameWidth + 20;
            y = Math.random() * gameHeight;
            vx = -(20 + Math.random() * 40);
            vy = (Math.random() - 0.5) * 30;
            break;
          case 2: // bottom
            x = Math.random() * gameWidth;
            y = gameHeight + 20;
            vx = (Math.random() - 0.5) * 30;
            vy = -(20 + Math.random() * 40);
            break;
          case 3: // left
            x = -20;
            y = Math.random() * gameHeight;
            vx = 20 + Math.random() * 40;
            vy = (Math.random() - 0.5) * 30;
            break;
        }
        
        const hazardTypes: HazardType[] = ['fire', 'smoke', 'debris', 'water'];
        const type = hazardTypes[Math.floor(Math.random() * hazardTypes.length)];
        
        hazardsRef.current.push({
          id: idCounterRef.current++,
          x, y, vx, vy,
          size: 15 + Math.random() * 10,
          hp: type === 'debris' ? 30 : 20,
          maxHp: type === 'debris' ? 30 : 20,
          type,
          age: 0,
          stunned: false
        });
      }

      // Update hazards
      hazardsRef.current = hazardsRef.current
        .map(h => ({
          ...h,
          x: h.x + h.vx * dt,
          y: h.y + h.vy * dt,
          age: h.age + dt,
          stunned: false // reset stun state
        }))
        .filter(h => {
          // Remove hazards that are too old or off-screen
          if (h.age > 15 || h.x < -50 || h.x > gameWidth + 50 || h.y < -50 || h.y > gameHeight + 50) {
            return false;
          }
          
          // Check collision with dog
          const dogDist = Math.hypot(h.x - dogRef.current.x, h.y - dogRef.current.y);
          if (dogDist < h.size + 25) {
            // Damage dog based on hazard type
            let damage = 0;
            switch (h.type) {
              case 'fire': damage = 15; break;
              case 'smoke': damage = 5; break;
              case 'debris': damage = 25; break;
              case 'water': damage = 10; break;
            }
            dogRef.current.health = Math.max(0, dogRef.current.health - damage);
            dogRef.current.calmness = Math.max(0, dogRef.current.calmness - damage * 0.8);
            
            if (dogRef.current.health <= 0) {
              setGameState('gameOver');
            }
            
            // Create impact particles
            for (let i = 0; i < 8; i++) {
              particlesRef.current.push({
                x: h.x,
                y: h.y,
                vx: (Math.random() - 0.5) * 120,
                vy: (Math.random() - 0.5) * 120,
                life: 0,
                maxLife: 0.8,
                color: h.type === 'fire' ? '#ff4500' : h.type === 'water' ? '#4169e1' : '#8b4513',
                size: 3 + Math.random() * 4
              });
            }
            
            return false; // remove hazard
          }
          return true;
        });

      // Update defenses
      defensesRef.current = defensesRef.current.map(d => {
        const newD = { ...d, cooldown: Math.max(0, d.cooldown - dt * 1000), active: false };
        
        if (newD.cooldown <= 0) {
          // Find hazards in range
          const inRange = hazardsRef.current.filter(h => 
            Math.hypot(h.x - d.x, h.y - d.y) <= d.range
          );
          
          if (inRange.length > 0) {
            newD.active = true;
            newD.cooldown = newD.maxCooldown;
            
            // Apply defense effects
            inRange.forEach(h => {
              switch (d.type) {
                case 'extinguisher':
                  if (h.type === 'fire') {
                    h.hp -= 40 * dt; // extinguish fire quickly
                  } else {
                    h.hp -= 15 * dt; // slow other hazards
                  }
                  break;
                case 'fan':
                  if (h.type === 'smoke') {
                    h.hp -= 50 * dt; // blow away smoke
                  } else {
                    // Push hazards away
                    const angle = Math.atan2(h.y - d.y, h.x - d.x);
                    h.vx += Math.cos(angle) * 80 * dt;
                    h.vy += Math.sin(angle) * 80 * dt;
                  }
                  break;
                case 'umbrella':
                  if (h.type === 'water') {
                    h.hp -= 60 * dt; // block water
                  } else if (h.type === 'debris') {
                    h.hp -= 30 * dt; // deflect debris
                  }
                  break;
              }
            });
          }
        }
        
        return newD;
      });

      // Remove destroyed hazards and award points
      const aliveHazards: Hazard[] = [];
      hazardsRef.current.forEach(h => {
        if (h.hp <= 0) {
          setScore(s => s + 10);
          // Create destruction particles
          for (let i = 0; i < 5; i++) {
            particlesRef.current.push({
              x: h.x,
              y: h.y,
              vx: (Math.random() - 0.5) * 80,
              vy: (Math.random() - 0.5) * 80,
              life: 0,
              maxLife: 1.2,
              color: '#ffff00',
              size: 2 + Math.random() * 3
            });
          }
        } else {
          aliveHazards.push(h);
        }
      });
      hazardsRef.current = aliveHazards;

      // Update particles
      particlesRef.current = particlesRef.current
        .map(p => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          life: p.life + dt
        }))
        .filter(p => p.life < p.maxLife);

      // Slowly restore dog's calmness
      dogRef.current.calmness = Math.min(100, dogRef.current.calmness + dt * 5);

      // Level progression
      if (score > level * 200) {
        setLevel(l => l + 1);
        chaosLevelRef.current = Math.min(100, chaosLevelRef.current + 10);
      }

      // Render
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (canvas && ctx) draw(ctx);

      rafRef.current = requestAnimationFrame(step);
    };
    
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [gameState, gameWidth, gameHeight, level, score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === 'start' || gameState === 'gameOver') {
        if (e.key === 'Enter' || e.key === ' ') {
          startGame();
        }
        return;
      }
      
      if (gameState !== 'playing') return;

      // Arrow keys and number keys to buy defenses
      if (e.key === '1' || e.key === 'ArrowLeft') {
        // Extinguisher
        if (score >= 30) {
          setScore(s => s - 30);
          defensesRef.current.push({
            id: idCounterRef.current++,
            x: Math.random() * (gameWidth - 100) + 50,
            y: Math.random() * (gameHeight - 200) + 100,
            range: 60,
            cooldown: 0,
            maxCooldown: 2000,
            type: 'extinguisher',
            active: false
          });
        }
      } else if (e.key === '2' || e.key === 'ArrowUp') {
        // Fan
        if (score >= 25) {
          setScore(s => s - 25);
          defensesRef.current.push({
            id: idCounterRef.current++,
            x: Math.random() * (gameWidth - 100) + 50,
            y: Math.random() * (gameHeight - 200) + 100,
            range: 80,
            cooldown: 0,
            maxCooldown: 1500,
            type: 'fan',
            active: false
          });
        }
      } else if (e.key === '3' || e.key === 'ArrowRight') {
        // Umbrella
        if (score >= 35) {
          setScore(s => s - 35);
          defensesRef.current.push({
            id: idCounterRef.current++,
            x: Math.random() * (gameWidth - 100) + 50,
            y: Math.random() * (gameHeight - 200) + 100,
            range: 60,
            cooldown: 0,
            maxCooldown: 3000,
            type: 'umbrella',
            active: false
          });
        }
      } else if (e.key === ' ' || e.key === 'ArrowDown' || e.key === 'f' || e.key === 'F') {
        // "This is fine" ability
        if (dogCalmCooldownRef.current <= 0) {
          hazardsRef.current.forEach(h => {
            h.stunned = true;
            h.vx *= 0.1;
            h.vy *= 0.1;
          });
          dogCalmCooldownRef.current = 8000;
          dogRef.current.calmness = Math.min(100, dogRef.current.calmness + 20);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, score, gameWidth, gameHeight, startGame]);

  // Draw scene
  const draw = (ctx: CanvasRenderingContext2D) => {
    // Background - room on fire
    const bg = ctx.createLinearGradient(0, 0, 0, gameHeight);
    bg.addColorStop(0, '#2d1b1b');
    bg.addColorStop(0.7, '#4a2c2c');
    bg.addColorStop(1, '#1a0f0f');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Draw meme image faintly in background
    if (bgImgRef.current) {
      const img = bgImgRef.current;
      const aspect = img.width / img.height;
      const targetW = gameWidth * 0.8;
      const targetH = targetW / aspect;
      const x = (gameWidth - targetW) / 2;
      const y = (gameHeight - targetH) / 2;
      ctx.globalAlpha = 0.12;
      ctx.drawImage(img, x, y, targetW, targetH);
      ctx.globalAlpha = 1;
    }

    // Room elements - table, walls, furniture silhouettes
    ctx.fillStyle = 'rgba(139, 69, 19, 0.3)';
    ctx.fillRect(gameWidth * 0.1, gameHeight - 60, gameWidth * 0.8, 8); // table edge
    
    // Window frames (left and right)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 50, 40, 80);
    ctx.strokeRect(gameWidth - 60, 50, 40, 80);

    // Chaos level indicator (background fire intensity)
    const chaosAlpha = chaosLevelRef.current / 100 * 0.4;
    ctx.fillStyle = `rgba(255, 69, 0, ${chaosAlpha})`;
    ctx.fillRect(0, 0, gameWidth, gameHeight);

    // Draw particles (fire, smoke, debris effects)
    particlesRef.current.forEach(p => {
      const alpha = 1 - (p.life / p.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1;

    // Draw hazards
    hazardsRef.current.forEach(h => {
      switch (h.type) {
        case 'fire':
          // Animated flame
          const flicker = Math.sin(h.age * 8) * 0.3 + 1;
          const grad = ctx.createRadialGradient(h.x, h.y, 0, h.x, h.y, h.size * flicker);
          grad.addColorStop(0, '#ffff00');
          grad.addColorStop(0.5, '#ff4500');
          grad.addColorStop(1, '#8b0000');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(h.x, h.y, h.size * flicker, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'smoke':
          // Pulsing smoke cloud
          const pulse = Math.sin(h.age * 4) * 0.2 + 0.8;
          ctx.fillStyle = `rgba(105, 105, 105, ${pulse * 0.7})`;
          ctx.beginPath();
          ctx.arc(h.x, h.y, h.size * pulse, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'debris':
          // Rotating debris
          ctx.save();
          ctx.translate(h.x, h.y);
          ctx.rotate(h.age * 3);
          ctx.fillStyle = '#654321';
          ctx.fillRect(-h.size/2, -h.size/2, h.size, h.size);
          ctx.strokeStyle = '#8b4513';
          ctx.lineWidth = 2;
          ctx.strokeRect(-h.size/2, -h.size/2, h.size, h.size);
          ctx.restore();
          break;
        case 'water':
          // Water droplet
          ctx.fillStyle = '#4169e1';
          ctx.beginPath();
          ctx.arc(h.x, h.y - h.size * 0.3, h.size * 0.7, 0, Math.PI * 2);
          ctx.arc(h.x, h.y + h.size * 0.3, h.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
          break;
      }
      
      // HP bar for hazards
      if (h.hp < h.maxHp) {
        const barWidth = h.size * 1.5;
        ctx.fillStyle = '#333';
        ctx.fillRect(h.x - barWidth/2, h.y - h.size - 8, barWidth, 3);
        ctx.fillStyle = '#ff0000';
        const hpWidth = (h.hp / h.maxHp) * barWidth;
        ctx.fillRect(h.x - barWidth/2, h.y - h.size - 8, hpWidth, 3);
      }
    });

    // Draw defenses
    defensesRef.current.forEach(d => {
      const activeGlow = d.active ? 0.8 : 0.3;
      
      switch (d.type) {
        case 'extinguisher':
          ctx.fillStyle = '#dc143c';
          ctx.fillRect(d.x - 8, d.y - 12, 16, 24);
          ctx.fillStyle = '#000';
          ctx.fillRect(d.x + 4, d.y - 8, 4, 8);
          if (d.active) {
            // Spray effect
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 3;
            for (let i = 0; i < 5; i++) {
              const angle = (i - 2) * 0.2;
              const len = d.range;
              ctx.beginPath();
              ctx.moveTo(d.x, d.y);
              ctx.lineTo(d.x + Math.cos(angle) * len, d.y + Math.sin(angle) * len);
              ctx.stroke();
            }
          }
          break;
        case 'fan':
          ctx.fillStyle = '#708090';
          ctx.beginPath();
          ctx.arc(d.x, d.y, 12, 0, Math.PI * 2);
          ctx.fill();
          // Fan blades
          ctx.strokeStyle = d.active ? '#fff' : '#ddd';
          ctx.lineWidth = 2;
          for (let i = 0; i < 4; i++) {
            const angle = (Date.now() * 0.01 + i * Math.PI / 2) % (Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(d.x, d.y);
            ctx.lineTo(d.x + Math.cos(angle) * 10, d.y + Math.sin(angle) * 10);
            ctx.stroke();
          }
          break;
        case 'umbrella':
          ctx.fillStyle = '#000080';
          ctx.beginPath();
          ctx.arc(d.x, d.y - 5, 15, 0, Math.PI, false);
          ctx.fill();
          ctx.strokeStyle = '#8b4513';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y - 5);
          ctx.lineTo(d.x, d.y + 15);
          ctx.stroke();
          break;
      }
      
      // Range indicator when active
      if (d.active) {
        ctx.strokeStyle = `rgba(0, 255, 0, ${activeGlow})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.range, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Draw the dog (This Is Fine dog)
    const dog = dogRef.current;
    
    // Dog shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(dog.x, dog.y + 25, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog body
    ctx.fillStyle = '#d2691e';
    ctx.fillRect(dog.x - 15, dog.y - 5, 30, 25);
    
    // Dog head
    ctx.beginPath();
    ctx.arc(dog.x, dog.y - 15, 18, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(dog.x - 6, dog.y - 18, 4, 0, Math.PI * 2);
    ctx.arc(dog.x + 6, dog.y - 18, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(dog.x - 6, dog.y - 18, 2, 0, Math.PI * 2);
    ctx.arc(dog.x + 6, dog.y - 18, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog nose
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(dog.x, dog.y - 12, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Dog hat (wobbles)
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(dog.x - 12 + dog.hatWobble, dog.y - 35, 24, 8);
    ctx.fillRect(dog.x - 8 + dog.hatWobble, dog.y - 30, 16, 6);
    
    // Dog legs
    ctx.fillStyle = '#d2691e';
    ctx.fillRect(dog.x - 12, dog.y + 15, 6, 10);
    ctx.fillRect(dog.x + 6, dog.y + 15, 6, 10);
    
    // Health bar
    const healthBarWidth = 80;
    ctx.fillStyle = '#333';
    ctx.fillRect(dog.x - healthBarWidth/2, dog.y - 50, healthBarWidth, 6);
    ctx.fillStyle = dog.health > 30 ? '#4caf50' : '#f44336';
    const healthWidth = (dog.health / dog.maxHealth) * healthBarWidth;
    ctx.fillRect(dog.x - healthBarWidth/2, dog.y - 50, healthWidth, 6);
    
    // Calmness indicator (coffee cup icon)
    const calmnessAlpha = dog.calmness / 100;
    ctx.globalAlpha = calmnessAlpha;
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(dog.x + 25, dog.y - 45, 12, 8);
    ctx.fillStyle = '#4b2c20';
    ctx.fillRect(dog.x + 27, dog.y - 43, 8, 4);
    ctx.globalAlpha = 1;

    // "This is fine" button (top right)
    const buttonX = gameWidth - 60;
    const buttonY = 30;
    const canUseCalm = dogCalmCooldownRef.current <= 0;
    const buttonRadius = isMobile ? 30 : 25;
    
    // Button background
    ctx.fillStyle = canUseCalm ? 'rgba(255, 215, 0, 0.8)' : 'rgba(128, 128, 128, 0.5)';
    ctx.beginPath();
    ctx.arc(buttonX, buttonY, buttonRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Button border
    ctx.strokeStyle = canUseCalm ? '#ffd700' : '#666';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(buttonX, buttonY, buttonRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Arrow key indicator (desktop)
    if (!isMobile && canUseCalm) {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('↓', buttonX, buttonY - 12);
    }
    
    // Button text
    ctx.fillStyle = canUseCalm ? '#000' : '#666';
    ctx.font = isMobile ? '10px "Courier New"' : '12px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('THIS IS', buttonX, buttonY + (isMobile ? -2 : 2));
    ctx.fillText('FINE', buttonX, buttonY + (isMobile ? 10 : 12));
    ctx.textAlign = 'start';

    // Defense selection UI (bottom)
    const defenseTypes: DefenseType[] = ['extinguisher', 'fan', 'umbrella'];
    const costs = { extinguisher: 30, fan: 25, umbrella: 35 };
    const arrows = ['←', '↑', '→'];
    const spacing = gameWidth / 4;
    
    defenseTypes.forEach((type, i) => {
      const x = spacing * (i + 1);
      const y = gameHeight - 40;
      const cost = costs[type];
      const canAfford = score >= cost;
      
      // Larger touch area for mobile
      const radius = isMobile ? 30 : 25;
      
      // Button background
      ctx.fillStyle = canAfford ? 'rgba(0, 255, 0, 0.4)' : 'rgba(255, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Button border
      ctx.strokeStyle = canAfford ? '#00ff00' : '#ff0000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.stroke();
      
      // Arrow key indicator (desktop)
      if (!isMobile) {
        ctx.fillStyle = canAfford ? '#fff' : '#999';
        ctx.font = 'bold 16px "Courier New"';
        ctx.textAlign = 'center';
        ctx.fillText(arrows[i], x, y - 8);
      }
      
      // Defense name and cost
      ctx.fillStyle = canAfford ? '#fff' : '#999';
      ctx.font = isMobile ? '12px "Courier New"' : '10px "Courier New"';
      ctx.textAlign = 'center';
      
      switch (type) {
        case 'extinguisher':
          ctx.fillText('EXT', x, y + (isMobile ? -2 : 2));
          ctx.fillText(`$${cost}`, x, y + (isMobile ? 12 : 15));
          break;
        case 'fan':
          ctx.fillText('FAN', x, y + (isMobile ? -2 : 2));
          ctx.fillText(`$${cost}`, x, y + (isMobile ? 12 : 15));
          break;
        case 'umbrella':
          ctx.fillText('UMB', x, y + (isMobile ? -2 : 2));
          ctx.fillText(`$${cost}`, x, y + (isMobile ? 12 : 15));
          break;
      }
    });
    ctx.textAlign = 'start';

    // HUD
    ctx.fillStyle = '#fff';
    ctx.font = '16px "Courier New"';
    ctx.fillText(`Score: ${score}`, 10, 25);
    ctx.fillText(`Level: ${level}`, 10, 45);
    ctx.fillText(`Chaos: ${Math.floor(chaosLevelRef.current)}%`, 10, 65);

    // Game state overlays
    if (gameState === 'start') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      
      ctx.fillStyle = '#ffcc66';
      ctx.font = '24px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('THIS IS FINE', gameWidth / 2, gameHeight / 2 - 60);
      ctx.fillText('ROOM DEFENSE', gameWidth / 2, gameHeight / 2 - 30);
      
      ctx.fillStyle = '#fff';
      ctx.font = '14px "Courier New"';
      ctx.fillText('Protect the dog from chaos!', gameWidth / 2, gameHeight / 2);
      ctx.fillText('Start with $100 to buy defenses', gameWidth / 2, gameHeight / 2 + 20);
      ctx.fillText('← Extinguisher ↑ Fan → Umbrella', gameWidth / 2, gameHeight / 2 + 40);
      ctx.fillText('SPACE/↓ = "THIS IS FINE" ability', gameWidth / 2, gameHeight / 2 + 60);
      ctx.fillText('Press ENTER or tap to start', gameWidth / 2, gameHeight / 2 + 90);
      ctx.textAlign = 'start';
    } else if (gameState === 'gameOver') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, gameWidth, gameHeight);
      
      ctx.fillStyle = '#ff6b6b';
      ctx.font = '28px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('THIS IS NOT FINE!', gameWidth / 2, gameHeight / 2 - 20);
      
      ctx.fillStyle = '#fff';
      ctx.font = '18px "Courier New"';
      ctx.fillText(`Final Score: ${score}`, gameWidth / 2, gameHeight / 2 + 10);
      ctx.fillText(`Survived ${level} levels`, gameWidth / 2, gameHeight / 2 + 35);
      ctx.fillText('Tap to restart', gameWidth / 2, gameHeight / 2 + 60);
      ctx.textAlign = 'start';
    }
  };

  // Input handling
  const handleInput = useCallback((clientX: number, clientY: number) => {
    if (gameState === 'start' || gameState === 'gameOver') {
      startGame();
      return;
    }
    
    if (gameState !== 'playing') return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // "This is fine" button
    const buttonX = gameWidth - 60;
    const buttonY = 30;
    const buttonRadius = isMobile ? 30 : 25;
    if (Math.hypot(x - buttonX, y - buttonY) <= buttonRadius) {
      if (dogCalmCooldownRef.current <= 0) {
        // Calm all hazards temporarily
        hazardsRef.current.forEach(h => {
          h.stunned = true;
          h.vx *= 0.1;
          h.vy *= 0.1;
        });
        dogCalmCooldownRef.current = 8000; // 8 second cooldown
        dogRef.current.calmness = Math.min(100, dogRef.current.calmness + 20);
      }
      return;
    }

    // Defense selection (bottom UI)
    const defenseTypes: DefenseType[] = ['extinguisher', 'fan', 'umbrella'];
    const costs = { extinguisher: 30, fan: 25, umbrella: 35 };
    const spacing = gameWidth / 4;
    
    for (let i = 0; i < defenseTypes.length; i++) {
      const buttonX = spacing * (i + 1);
      const buttonY = gameHeight - 40;
      const touchRadius = isMobile ? 30 : 25; // Larger touch area for mobile
      
      if (Math.hypot(x - buttonX, y - buttonY) <= touchRadius) {
        const type = defenseTypes[i];
        const cost = costs[type];
        
        if (score >= cost) {
          setScore(s => s - cost);
          defensesRef.current.push({
            id: idCounterRef.current++,
            x: Math.random() * (gameWidth - 100) + 50,
            y: Math.random() * (gameHeight - 200) + 100,
            range: type === 'fan' ? 80 : 60,
            cooldown: 0,
            maxCooldown: type === 'extinguisher' ? 2000 : type === 'fan' ? 1500 : 3000,
            type,
            active: false
          });
        }
        return;
      }
    }
  }, [gameState, gameWidth, gameHeight, score, startGame]);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${isMobile ? 'p-0' : 'p-4'}`}>
      {!isMobile && (
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white font-mono">THIS IS FINE — ROOM DEFENSE</h1>
        </div>
      )}
      <div className={`flex justify-center ${isMobile ? 'h-screen' : 'mb-4'}`}>
        <div className="relative w-full h-full">
          <canvas
            ref={canvasRef}
            className={isMobile ? '' : 'border-2 border-orange-500 rounded-lg'}
            style={{
              backgroundColor: '#2d1b1b',
              width: `${gameWidth}px`,
              height: `${gameHeight}px`,
              touchAction: 'manipulation',
              imageRendering: 'auto',
            }}
            onTouchStart={e => {
              const t = e.touches[0];
              handleInput(t.clientX, t.clientY);
            }}
            onMouseDown={e => handleInput(e.clientX, e.clientY)}
          />
        </div>
      </div>
    </div>
  );
};

export default ThisIsFineGame;