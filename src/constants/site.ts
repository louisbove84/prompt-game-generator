// Game Generator Site Configuration
const WEBSITE_URL = 'https://launch.beuxbunk.com';

export const CONTACT_INFO = {
  // Personal Information
  name: 'GameForge',
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
    hero: 'https://www.beuxbunk.com/images/gameForge.jpg',
    icon: 'https://www.beuxbunk.com/images/gameForgeLoading.jpg',
    screenshots: [
      'https://www.beuxbunk.com/images/gameForge.jpg',
      'https://www.beuxbunk.com/images/gameForgeLoading.jpg'
    ]
  }
} as const;

// Farcaster Mini App Configuration
// NOTE: The PRIMARY source of truth is public/.well-known/farcaster.json
// This config is for reference and embedding in meta tags
export const FARCSTER_CONFIG = {
  // Manifest config - should match public/.well-known/farcaster.json
  manifest: {
    name: 'GameForge Hub',
    version: '3', // Update in public/.well-known/farcaster.json to change
    iconUrl: CONTACT_INFO.images.icon,
    homeUrl: `${CONTACT_INFO.website}/frame`,
    imageUrl: CONTACT_INFO.images.hero,
    buttonTitle: 'Game Forge: Use LLMs to Create Arcade Games',
    splashImageUrl: CONTACT_INFO.images.icon,
    splashBackgroundColor: '#1a1a2e',
    webhookUrl: `${CONTACT_INFO.website}/api/webhook`,
    subtitle: 'Create Games with AI',
    description: 'AI-powered game generator. Pay $0.20 USDC to create custom arcade games or play free demos. Built on Base network.',
    screenshotUrls: CONTACT_INFO.images.screenshots,
    primaryCategory: 'games',
    heroImageUrl: CONTACT_INFO.images.hero,
    tagline: 'ai-games',
    ogImageUrl: CONTACT_INFO.images.hero
  },
  // Embed config for fc:miniapp meta tag
  embed: {
    version: '1',
    imageUrl: CONTACT_INFO.images.hero,
    button: {
      title: '🎮 Create AI Games',
      action: {
        type: 'launch_miniapp',
        url: `${CONTACT_INFO.website}/frame`,
        name: 'GameForge Hub',
        splashImageUrl: CONTACT_INFO.images.icon,
        splashBackgroundColor: '#1a1a2e'
      }
    }
  }
} as const;
