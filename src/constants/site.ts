// Game Generator Site Configuration
const WEBSITE_URL = 'https://launch.beuxbunk.com';

export const CONTACT_INFO = {
  // Personal Information
  name: 'Louis Bové',
  title: 'AI Game Generator',
  
  // Contact Details  
  email: 'louisbove84@gmail.com',
  
  // Website Information
  website: WEBSITE_URL,
  
  // Professional Summary
  bio: {
    short: 'AI-powered game generation platform that creates custom games from user prompts.',
    skills: 'Interactive gameplay with modern web technologies and AI-driven content creation.'
  },
  
  // Image paths (hosted on main website)
  images: {
    hero: 'https://www.beuxbunk.com/games/itsFine-3x2.jpg',
    icon: 'https://www.beuxbunk.com/games/itsFine-200x200.jpg',
    screenshots: [
      'https://www.beuxbunk.com/images/screenshot1.svg',
      'https://www.beuxbunk.com/images/screenshot2.svg'
    ]
  }
} as const;

// Farcaster Mini App Configuration - Single source of truth
export const FARCSTER_CONFIG = {
  // Manifest config for .well-known/farcaster.json
  manifest: {
    name: 'Meme Games Hub',
    version: '1',
    iconUrl: CONTACT_INFO.images.icon,
    homeUrl: CONTACT_INFO.website,
    imageUrl: CONTACT_INFO.images.hero,
    buttonTitle: 'Play Meme Games',
    splashImageUrl: CONTACT_INFO.images.icon,
    splashBackgroundColor: '#FF6B6B',
    webhookUrl: `${CONTACT_INFO.website}/api/webhook`,
    subtitle: 'Choose Your Meme',
    description: 'Two iconic meme games: Space Invaders and This Is Fine Runner. Choose your chaos and play classic games with meme twists!',
    screenshotUrls: CONTACT_INFO.images.screenshots,
    primaryCategory: 'games',
    heroImageUrl: CONTACT_INFO.images.hero,
    tagline: 'memes',
    ogImageUrl: CONTACT_INFO.images.hero
  },
  // Embed config for fc:miniapp meta tag
  embed: {
    version: '1',
    imageUrl: CONTACT_INFO.images.hero,
    button: {
      title: '🎮 Play Meme Games',
      action: {
        type: 'launch_miniapp',
        url: `${CONTACT_INFO.website}/frame`,
        name: 'Meme Games Hub',
        splashImageUrl: CONTACT_INFO.images.icon,
        splashBackgroundColor: '#FF6B6B'
      }
    }
  }
} as const;
