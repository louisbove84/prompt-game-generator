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
      
      <!-- Background -->
      <rect width="1200" height="630" fill="url(#bg)"/>
      
      <!-- Main container -->
      <rect x="50" y="50" width="1100" height="530" rx="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
      
      <!-- Title -->
      <text x="600" y="150" text-anchor="middle" fill="#ffffff" font-family="Arial, sans-serif" font-size="48" font-weight="bold" filter="url(#glow)">
        🎮 AI Game Generator
      </text>
      
      <!-- Subtitle -->
      <text x="600" y="200" text-anchor="middle" fill="#a0a0a0" font-family="Arial, sans-serif" font-size="24">
        Create Custom Games with AI
      </text>
      
      <!-- Features -->
      <g transform="translate(200, 280)">
        <circle cx="0" cy="0" r="8" fill="#4ade80"/>
        <text x="30" y="5" fill="#ffffff" font-family="Arial, sans-serif" font-size="20">Pay $0.20 USDC to generate custom games</text>
      </g>
      
      <g transform="translate(200, 320)">
        <circle cx="0" cy="0" r="8" fill="#60a5fa"/>
        <text x="30" y="5" fill="#ffffff" font-family="Arial, sans-serif" font-size="20">Play free demo games instantly</text>
      </g>
      
      <g transform="translate(200, 360)">
        <circle cx="0" cy="0" r="8" fill="#f472b6"/>
        <text x="30" y="5" fill="#ffffff" font-family="Arial, sans-serif" font-size="20">Built on Base network for fast, cheap transactions</text>
      </g>
      
      <!-- Game icons -->
      <g transform="translate(800, 300)">
        <rect x="-30" y="-30" width="60" height="60" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
        <text x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="24">🎯</text>
      </g>
      
      <g transform="translate(900, 300)">
        <rect x="-30" y="-30" width="60" height="60" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)"/>
        <text x="0" y="5" text-anchor="middle" fill="#ffffff" font-size="24">🚀</text>
      </g>
      
      <!-- Bottom text -->
      <text x="600" y="500" text-anchor="middle" fill="#666666" font-family="Arial, sans-serif" font-size="18">
        Powered by AI • Built with Next.js • Deployed on Vercel
      </text>
    </svg>
  `;

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}