#!/usr/bin/env node

// Script to generate .well-known/farcaster.json from constants
const fs = require('fs');
const path = require('path');

// Import the constants (we'll need to transpile this or use a different approach)
// For now, let's create the JSON directly with the current deployment URL
const CONTACT_INFO = {
  website: 'https://launch.beuxbunk.com'
};

const FARCSTER_CONFIG = {
  miniapp: {
    name: 'GameForge Hub',
    version: '1',
    iconUrl: 'https://www.beuxbunk.com/images/gameForgeLoading.jpg',
    homeUrl: CONTACT_INFO.website,
    imageUrl: 'https://www.beuxbunk.com/images/gameForge.jpg',
    buttonTitle: 'Game Forge: Use LLMs to Create Arcade Games',
    splashImageUrl: 'https://www.beuxbunk.com/images/gameForgeLoading.jpg',
    splashBackgroundColor: '#FF6B6B',
    webhookUrl: `${CONTACT_INFO.website}/api/webhook`,
    subtitle: 'AI Game Generator',
    description: 'Create custom games from your imagination with AI. Generate unique gaming experiences tailored to your vision!',
    screenshotUrls: [
      'https://www.beuxbunk.com/images/gameForge.jpg',
      'https://www.beuxbunk.com/images/gameForgeLoading.jpg'
    ],
    primaryCategory: 'games',
    heroImageUrl: 'https://www.beuxbunk.com/images/gameForge.jpg',
    tagline: 'ai-games',
    ogImageUrl: 'https://www.beuxbunk.com/images/gameForge.jpg'
  },
  accountAssociation: {
    header: "eyJmaWQiOjg4NjUwMywidHlwZSI6ImF1dGgiLCJrZXkiOiIweEQyRTc4MzlDOTI2QTlBMzQ5ODdFM0E4NjI2ODFDYTUyZmU2M2M0ZTYifQ",
    payload: "eyJkb21haW4iOiJ3d3cuYmV1eGJ1bmsuY29tIn0",
    signature: "hPjYZZSZd+erQ2cMXwJZs6c6O8WnNTcka4LxeLIkfnxlJsp/MvHXIRn6I58YFB6aL+YJ0W0KU4tQucWJT1CkYBs="
  }
};

// Write the JSON file with correct property name
const output = {
  miniapp: FARCSTER_CONFIG.miniapp,
  accountAssociation: FARCSTER_CONFIG.accountAssociation
};
const outputPath = path.join(__dirname, '..', 'public', '.well-known', 'farcaster.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log('Generated .well-known/farcaster.json');
