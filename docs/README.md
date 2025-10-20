# 📚 Documentation Index

Welcome to the GameForge documentation! This index will help you find what you need.

## 🎮 Game Development

### **[Game Architecture](./GAME_ARCHITECTURE.md)** ⭐ **START HERE**
Complete guide to Frame vs Browser game separation.
- Frame games (Farcaster) - Simple, lightweight
- Browser games (Web) - Advanced, sophisticated
- Shared components and utilities

### **[Quick Game Guide](./QUICK_GAME_GUIDE.md)** 
Quick reference for adding new games.

## 🚀 Deployment & Setup

### **[NFT Setup](./NFT_SETUP_README.md)**
Complete NFT minting setup guide.

### **[Environment Variables](./ENV_SETUP_README.md)**
How to configure environment variables.

### **[Vercel Deployment](./VERCEL_DEPLOYMENT.md)**
Deploy to Vercel guide.

### **[Final Deployment Guide](./FINAL_DEPLOYMENT_GUIDE.md)**
Step-by-step deployment checklist.

## 🔧 Development

### **[Local Development](./LOCAL_DEVELOPMENT_GUIDE.md)**
Set up local development environment.

### **[Hardhat Setup](./HARDHAT_DEPLOYMENT.md)**
Smart contract deployment with Hardhat.

### **[AI Game Generation](./AI_GAME_GENERATION_README.md)**
How AI game generation works.

## 🌐 Platform Integration

### **[Farcaster Configuration](./FARCASTER_CONFIG_README.md)**
Farcaster Mini App setup.

### **[Base Network](./BASE_DEPLOYMENT_GUIDE.md)**
Deploy NFTs to Base network.

## 📋 Quick Links

| What do you want to do? | See this guide |
|---|---|
| **Add a new game** | [Quick Game Guide](./QUICK_GAME_GUIDE.md) |
| **Understand architecture** | [Game Architecture](./GAME_ARCHITECTURE.md) |
| **Deploy to production** | [Vercel Deployment](./VERCEL_DEPLOYMENT.md) |
| **Set up NFT minting** | [NFT Setup](./NFT_SETUP_README.md) |
| **Run locally** | [Local Development](./LOCAL_DEVELOPMENT_GUIDE.md) |
| **Deploy smart contract** | [Hardhat Deployment](./HARDHAT_DEPLOYMENT.md) |

## 📁 Project Structure

```
prompt-game-generator/
├── src/
│   ├── components/
│   │   ├── frame-games/      🎯 Farcaster Frame games
│   │   ├── browser-games/    🚀 Browser-only games
│   │   ├── games/            📦 Shared/legacy games
│   │   └── payments/         💳 Payment components
│   ├── app/
│   │   ├── frame/            Farcaster Frame version
│   │   ├── page.tsx          Browser version
│   │   └── api/              API routes
│   └── services/             Business logic
├── deployment/               Smart contract deployment
├── docs/                     📚 This documentation
└── public/                   Static assets
```

## 🎯 Key Concepts

### Frame vs Browser Games
- **Frame games** = Simple, lightweight games for Farcaster
- **Browser games** = Sophisticated games for web browsers
- **Shared code** = Utilities used by both

### See [Game Architecture](./GAME_ARCHITECTURE.md) for details.

## 🆘 Getting Help

1. Check the relevant guide above
2. See [Game Architecture](./GAME_ARCHITECTURE.md) for architecture questions
3. See [Quick Game Guide](./QUICK_GAME_GUIDE.md) for quick answers

---

**Last Updated**: 2025-01-20
