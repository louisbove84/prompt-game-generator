# AI Game Generator

Intelligent game generation platform that creates custom games from user prompts using modern web technologies and AI.

![AI Game Generator](https://www.beuxbunk.com/images/gameForge.jpg)

## 🎮 Live Demo

**Play the games**: [https://www.beuxbunk.com/frame](https://www.beuxbunk.com/frame)

## 🚀 Features

- **AI Game Generation** - Create custom games from text prompts using Grok AI
- **NFT Minting** - Automatically mint the first game screenshot as an NFT on Base network
- **Space Invaders** - Classic arcade shooter with modern controls and smooth animations
- **This Is Fine Runner** - Endless runner game with meme-inspired graphics and progressive difficulty
- **Crypto Payments** - Pay $0.20 USDC on Base network to generate custom games
- **IPFS Storage** - Game screenshots stored permanently on IPFS via Pinata
- **Responsive Design** - Optimized for both desktop and mobile gameplay
- **Smooth Animations** - Powered by Framer Motion for fluid game interactions
- **Modern UI** - Clean, intuitive interface built with Tailwind CSS

## 🛠 Tech Stack

- **Next.js 15** - React framework with server-side rendering and optimization
- **React 19** - Latest React features for modern component development
- **TypeScript** - Type-safe JavaScript for better development experience
- **Framer Motion** - Animation library for smooth game mechanics
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Grok AI** - AI model for generating game code from text prompts
- **wagmi + viem** - Modern Web3 libraries for blockchain interactions
- **Base Network** - Layer 2 blockchain for fast, cheap NFT minting
- **Pinata** - IPFS pinning service for decentralized storage
- **OpenZeppelin** - Secure ERC721 smart contract implementation

## 🎯 How It Works

### AI Game Generation Flow
1. **Connect Wallet** - Connect your Web3 wallet (MetaMask, etc.)
2. **Describe Game** - Write a text prompt describing your dream game
3. **Pay USDC** - Pay $0.20 USDC on Base network
4. **AI Generates** - Grok AI creates a complete playable game
5. **Auto-Mint NFT** - First screenshot automatically mints as NFT
6. **Play & Own** - Play your game and keep the NFT forever!

### Pre-Built Games

#### Space Invaders
- Player movement with keyboard controls
- Projectile physics and collision detection
- Progressive difficulty and scoring system
- Responsive controls for mobile devices

#### This Is Fine Runner
- Endless scrolling gameplay
- Obstacle generation and collision detection
- Progressive speed increase
- AI-powered game generation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- (Optional) Base network ETH for NFT feature

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/louisbove84/meme-games-hub.git
   cd meme-games-hub
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   cp env.example .env
   # Edit .env with your API keys
   ```

4. (Optional) Set up NFT feature
   - See [NFT_QUICK_START.md](NFT_QUICK_START.md) for 5-minute setup
   - See [HARDHAT_DEPLOYMENT.md](HARDHAT_DEPLOYMENT.md) for Hardhat deployment
   - See [NFT_SETUP_README.md](NFT_SETUP_README.md) for detailed guide

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
meme-games-hub/
├── src/
│   ├── components/
│   │   ├── GameSelectionScreen.tsx
│   │   ├── SpaceInvadersGame.tsx
│   │   └── ThisIsFineGame.tsx
│   ├── app/
│   │   ├── frame/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── api/
│   └── styles/
├── public/
│   └── images/
└── README.md
```

## 🎨 Game Development Highlights

- **Performance Optimization**: Games run smoothly at 60fps
- **Component Architecture**: Modular, reusable game components
- **State Management**: Efficient game state handling
- **Mobile Responsive**: Touch controls and responsive layouts
- **Modern Web APIs**: Canvas API for game rendering

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Game Controls

**Space Invaders:**
- Arrow keys or WASD for movement
- Spacebar to shoot
- Touch controls on mobile

**This Is Fine Runner:**
- Spacebar or tap to jump
- Automatic forward movement

## 📸 Screenshots

### Space Invaders
![Space Invaders Game](./screenshots/space-invaders.png)

### This Is Fine Runner  
![This Is Fine Runner](./screenshots/runner-game.png)

## 🚀 Deployment

The game is deployed on Vercel and integrated with the main portfolio site.

- **Live Demo**: [beuxbunk.com/frame](https://www.beuxbunk.com/frame)
- **Portfolio**: [beuxbunk.com](https://www.beuxbunk.com)

## 👨‍💻 Developer

**GameForge Team**
- Portfolio: [beuxbunk.com](https://www.beuxbunk.com)
- GitHub: [github.com/louisbove84](https://github.com/louisbove84)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/louisbove84/meme-games-hub/issues).

---

**Note**: This is a portfolio project demonstrating modern web development practices with React, Next.js, and game development concepts.
