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
    name: 'Meme Games Hub',
    version: '1',
    iconUrl: 'https://www.beuxbunk.com/games/itsFine-200x200.jpg',
    homeUrl: CONTACT_INFO.website,
    imageUrl: 'https://www.beuxbunk.com/games/itsFine-3x2.jpg',
    buttonTitle: 'Play Meme Games',
    splashImageUrl: 'https://www.beuxbunk.com/games/itsFine-200x200.jpg',
    splashBackgroundColor: '#FF6B6B',
    webhookUrl: `${CONTACT_INFO.website}/api/webhook`,
    subtitle: 'Choose Your Meme',
    description: 'Two iconic meme games: Space Invaders and This Is Fine Runner. Choose your chaos and play classic games with meme twists!',
    screenshotUrls: [
      'https://www.beuxbunk.com/images/screenshot1.svg',
      'https://www.beuxbunk.com/images/screenshot2.svg'
    ],
    primaryCategory: 'games',
    heroImageUrl: 'https://www.beuxbunk.com/games/itsFine-3x2.jpg',
    tagline: 'memes',
    ogImageUrl: 'https://www.beuxbunk.com/games/itsFine-3x2.jpg'
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
