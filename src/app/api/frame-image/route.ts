import { NextResponse } from 'next/server';

export async function GET() {
  // Create a game creation themed SVG image for the frame
  const svg = `
    <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1a1a2e;stop-opacity:1" />
          <stop offset="50%" style="stop-color:#16213e;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f3460;stop-opacity:1" />
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
      
      <!-- AI sparkles background -->
      <g fill="#00D4FF" opacity="0.8">
        ${Array.from({ length: 30 }, () => {
          const x = Math.random() * 1200;
          const y = Math.random() * 630;
          const size = Math.random() * 4 + 2;
          return `<circle cx="${x}" cy="${y}" r="${size}" fill="#00D4FF"/>`;
        }).join('')}
      </g>
      
      <!-- Main title -->
      <text x="600" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="#FFFFFF" stroke="#00D4FF" stroke-width="3" filter="url(#glow)">
        GAMEFORGE HUB
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#00D4FF" stroke="#000" stroke-width="2">
        Create Your Games with AI! 🤖
      </text>
      
      <!-- Game Creation Options -->
      <g transform="translate(200, 320)">
        <!-- AI Game Generator section -->
        <rect x="0" y="0" width="200" height="100" rx="15" fill="#00D4FF" stroke="#FFFFFF" stroke-width="4"/>
        <text x="100" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#FFFFFF" font-weight="bold">
          🤖 AI GAME
        </text>
        <text x="100" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#FFFFFF" font-weight="bold">
          GENERATOR
        </text>
        <text x="100" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#E6F7FF">
          Create with AI!
        </text>
      </g>
      
      <g transform="translate(800, 320)">
        <!-- Custom Games section -->
        <rect x="0" y="0" width="200" height="100" rx="15" fill="#4ECDC4" stroke="#FFFFFF" stroke-width="4"/>
        <text x="100" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#FFFFFF" font-weight="bold">
          🎮 CUSTOM
        </text>
        <text x="100" y="60" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#FFFFFF" font-weight="bold">
          GAMES
        </text>
        <text x="100" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#E6F7FF">
          Your vision!
        </text>
      </g>
      
      <!-- Game creation preview -->
      <g transform="translate(300, 480)">
        <!-- AI Brain/Neural Network -->
        <circle cx="20" cy="20" r="15" fill="#00D4FF" opacity="0.8"/>
        <circle cx="40" cy="15" r="8" fill="#4ECDC4" opacity="0.6"/>
        <circle cx="50" cy="25" r="6" fill="#00D4FF" opacity="0.4"/>
        <circle cx="35" cy="35" r="10" fill="#4ECDC4" opacity="0.7"/>
        <!-- Connection lines -->
        <line x1="20" y1="20" x2="40" y2="15" stroke="#00D4FF" stroke-width="2" opacity="0.6"/>
        <line x1="40" y1="15" x2="50" y2="25" stroke="#4ECDC4" stroke-width="2" opacity="0.6"/>
        <line x1="20" y1="20" x2="35" y2="35" stroke="#00D4FF" stroke-width="2" opacity="0.6"/>
      </g>
      
      <g transform="translate(700, 480)">
        <!-- Game controller -->
        <rect x="10" y="15" width="40" height="20" rx="10" fill="#333" stroke="#00D4FF" stroke-width="2"/>
        <circle cx="20" cy="25" r="3" fill="#00D4FF"/>
        <circle cx="40" cy="25" r="3" fill="#00D4FF"/>
        <rect x="25" y="20" width="10" height="10" rx="2" fill="#4ECDC4"/>
        <!-- Game elements -->
        <rect x="60" y="10" width="8" height="8" fill="#00FF00"/>
        <rect x="70" y="15" width="8" height="8" fill="#FF6B6B"/>
        <rect x="80" y="12" width="8" height="8" fill="#FFD700"/>
      </g>
      
      <!-- Frame indicator -->
      <rect x="20" y="20" width="280" height="60" rx="15" fill="rgba(0, 212, 255, 0.3)" stroke="#00D4FF" stroke-width="3"/>
      <text x="160" y="45" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" fill="#FFFFFF" font-weight="bold" stroke="#000" stroke-width="1">
        🎮 Farcaster Frame
      </text>
      <text x="160" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#E6F7FF">
        Create amazing games with AI!
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