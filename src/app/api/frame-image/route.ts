import { NextResponse } from 'next/server';

export async function GET() {
  // Create a meme-themed SVG image for the frame
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#FF6B6B;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#4ECDC4;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#45B7D1;stop-opacity:1" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Meme sparkles background -->
      <g fill="#FFD93D" opacity="0.9">
        ${Array.from({ length: 50 }, () => {
          const x = Math.random() * 1200;
          const y = Math.random() * 630;
          const size = Math.random() * 3 + 1;
          return `<polygon points="${x},${y-size} ${x+size},${y} ${x},${y+size} ${x-size},${y}" fill="#FFD93D"/>`;
        }).join('')}
      </g>
      
      <!-- Main title -->
      <text x="600" y="180" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="64" font-weight="bold" fill="#FFFFFF" stroke="#000" stroke-width="3" filter="url(#glow)">
        MEME GAMES HUB
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="240" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="28" fill="#FFFFFF" stroke="#000" stroke-width="2">
        Choose Your Chaos! 🎮
      </text>
      
      <!-- Game Options with meme styling -->
      <g transform="translate(200, 320)">
        <!-- Space Invaders section -->
        <rect x="0" y="0" width="200" height="100" rx="15" fill="#FF6B6B" stroke="#FFFFFF" stroke-width="4"/>
        <text x="100" y="35" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="20" fill="#FFFFFF" font-weight="bold">
          🚀 SPACE
        </text>
        <text x="100" y="60" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="20" fill="#FFFFFF" font-weight="bold">
          INVADERS
        </text>
        <text x="100" y="85" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="14" fill="#FFFF99">
          pew pew pew!
        </text>
      </g>
      
      <g transform="translate(800, 320)">
        <!-- This Is Fine section -->
        <rect x="0" y="0" width="200" height="100" rx="15" fill="#32CD32" stroke="#FFFFFF" stroke-width="4"/>
        <text x="100" y="35" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="20" fill="#FFFFFF" font-weight="bold">
          🔥 THIS IS
        </text>
        <text x="100" y="60" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="20" fill="#FFFFFF" font-weight="bold">
          FINE
        </text>
        <text x="100" y="85" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="14" fill="#FFFF99">
          everything's ok!
        </text>
      </g>
      
      <!-- Meme characters preview -->
      <g transform="translate(300, 480)">
        <!-- Space Invader (pixelated alien) -->
        <rect x="0" y="0" width="8" height="8" fill="#00FF00"/>
        <rect x="8" y="0" width="8" height="8" fill="#00FF00"/>
        <rect x="16" y="0" width="8" height="8" fill="#00FF00"/>
        <rect x="24" y="0" width="8" height="8" fill="#00FF00"/>
        <rect x="32" y="0" width="8" height="8" fill="#00FF00"/>
        <rect x="0" y="8" width="8" height="8" fill="#00FF00"/>
        <rect x="32" y="8" width="8" height="8" fill="#00FF00"/>
        <rect x="8" y="16" width="8" height="8" fill="#00FF00"/>
        <rect x="16" y="16" width="8" height="8" fill="#00FF00"/>
        <rect x="24" y="16" width="8" height="8" fill="#00FF00"/>
      </g>
      
      <g transform="translate(700, 480)">
        <!-- This Is Fine dog (simplified) -->
        <circle cx="20" cy="15" r="12" fill="#8B4513"/>
        <rect x="10" y="25" width="20" height="20" fill="#8B4513"/>
        <rect x="15" y="5" width="10" height="8" fill="#A0522D"/>
        <circle cx="15" cy="12" r="2" fill="#000"/>
        <circle cx="25" cy="12" r="2" fill="#000"/>
        <!-- Fire around dog -->
        <polygon points="5,40 10,30 15,40" fill="#FF4500"/>
        <polygon points="35,40 40,30 45,40" fill="#FF4500"/>
        <polygon points="0,35 5,25 10,35" fill="#FF6347"/>
      </g>
      
      <!-- Frame indicator -->
      <rect x="20" y="20" width="220" height="60" rx="15" fill="rgba(255, 107, 107, 0.3)" stroke="#FF6B6B" stroke-width="3"/>
      <text x="130" y="45" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="18" fill="#FFFFFF" font-weight="bold" stroke="#000" stroke-width="1">
        🎮 Farcaster Frame
      </text>
      <text x="130" y="65" text-anchor="middle" font-family="Comic Sans MS, cursive" font-size="14" fill="#FFFF99">
        Much wow, such games!
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}