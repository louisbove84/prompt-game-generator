# 🎮 Prompt Game Generator

An AI-powered game generator that creates playable games from text prompts and mints them as NFTs on the Base network.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp env.example .env.local
# Add your API keys to .env.local
```

### 3. Run Locally
```bash
npm run dev
# Open http://localhost:3000
```

## 🎯 Features

- **AI Game Generation**: Create games from text prompts using Grok AI
- **Dual Platform Support**: 
  - Browser games (full-screen, advanced graphics)
  - Frame games (mobile-optimized for Farcaster)
- **NFT Minting**: Automatic NFT creation on Base network
- **Payment Integration**: USDC payments via Coinbase Wallet
- **IPFS Storage**: Decentralized image and metadata storage

## 🛠️ Setup Guide

### Environment Variables

Create `.env.local` with these variables:

```bash
# AI Configuration
NEXT_PUBLIC_GROK_API_KEY=your-grok-api-key

# Base Network
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-api-key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-walletconnect-project-id

# NFT Contract
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=your-contract-address
NFT_MINTER_PRIVATE_KEY=your-private-key

# IPFS Storage
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key

# Contract Verification
BASESCAN_API_KEY=your-basescan-api-key
```

### NFT Contract Deployment

#### Option 1: Hardhat (Recommended)
```bash
# Configure deployment
cp env.example .env
# Add DEPLOYER_PRIVATE_KEY to .env

# Deploy to Base mainnet
npx hardhat run scripts/deploy.js --network base

# Or use interactive script
./deploy.sh
```

#### Option 2: Remix IDE
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create `GameNFT.sol` and paste contract code
3. Compile with Solidity ^0.8.20
4. Deploy to Base network (Chain ID: 8453)

### IPFS Setup (Pinata)
1. Create account at [pinata.cloud](https://pinata.cloud)
2. Generate API keys
3. Add to environment variables

## 🎮 Game Development

### Adding New Games

#### Browser Games (Full-Screen)
```typescript
// src/components/browser-games/YourGame.tsx
export const YourGame = () => {
  // Full viewport game with advanced graphics
  // Keyboard + mouse controls
  // HUD overlay
};
```

#### Frame Games (Mobile)
```typescript
// src/components/frame-games/YourGame.tsx
export const YourGame = () => {
  // Small screen (320-420px)
  // Touch controls only
  // Simple graphics
};
```

### Game Templates

- **Browser Template**: `src/templates/browserGameTemplate.ts`
- **Frame Template**: `src/templates/frameGameTemplate.ts`

## 🚀 Deployment

### Vercel Deployment
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Smart Contract Deployment
```bash
# Deploy to Base mainnet
npx hardhat run scripts/deploy.js --network base

# Verify contract
npx hardhat run scripts/verify.js --network base
```

## 📁 Project Structure

```
prompt-game-generator/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── api/               # API routes
│   │   └── frame/             # Farcaster Frame version
│   ├── components/
│   │   ├── browser-games/     # Full-screen games
│   │   ├── frame-games/       # Mobile games
│   │   └── payments/          # Payment components
│   ├── services/              # Business logic
│   └── templates/              # Game templates
├── contracts/                  # Smart contracts
├── deployment/                 # Hardhat deployment
├── docs/                      # Documentation
└── public/                    # Static assets
```

## 🔧 Development

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
```bash
# Test browser games
npm run test:browser

# Test frame games
npm run test:frame
```

## 📚 Documentation

- **[Game Architecture](docs/GAME_ARCHITECTURE.md)** - Frame vs Browser games
- **[Hardhat Deployment](docs/HARDHAT_DEPLOYMENT.md)** - Smart contract deployment
- **[NFT Setup](docs/NFT_SETUP_README.md)** - NFT minting configuration
- **[Environment Setup](docs/ENV_SETUP_README.md)** - Environment variables
- **[Local Development](docs/LOCAL_DEVELOPMENT_GUIDE.md)** - Development setup

## 🎯 Key Concepts

### Frame vs Browser Games
- **Frame games**: Simple, lightweight games for Farcaster
- **Browser games**: Sophisticated games for web browsers
- **Shared code**: Utilities used by both platforms

### Payment Flow
1. User connects wallet
2. Pays $0.20 USDC on Base network
3. AI generates game code
4. Game renders and plays
5. Screenshot captured automatically
6. NFT minted to user's wallet

### NFT Minting
- Automatic screenshot capture using html2canvas
- IPFS storage for images and metadata
- Base network deployment
- OpenSea integration

## 🐛 Troubleshooting

### Common Issues
- **Payment stalling**: Check wallet balance and network connection
- **Build errors**: Ensure all environment variables are set
- **NFT minting fails**: Verify contract address and minter wallet funding

### Debug Tools
- Payment modal shows real-time status
- Browser console for detailed error messages
- Network tab for API call debugging

## 💰 Costs

- **USDC Payment**: $0.20 per game
- **Gas Fees**: ~$2-5 USD in ETH for NFT minting
- **Total**: ~$2-5 USD per NFT

## 🎉 Ready to Deploy!

Your NFT minting system is production-ready! Follow the setup guide above to get started.

---

**Last Updated**: 2025-01-20  
**Status**: ✅ Production Ready

