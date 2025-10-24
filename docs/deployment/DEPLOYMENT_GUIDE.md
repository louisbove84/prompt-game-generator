# 🚀 Deployment Guide

## Overview
This guide covers deploying the NFT minting application to production.

## Deployment Structure

### Production Files
- `src/` - All source code
- `public/` - Static assets
- `package.json` - Production dependencies
- `next.config.js` - Next.js configuration
- `vercel.json` - Vercel deployment config

### Deployment-Specific Files
- `deployment/` - Smart contract deployment
  - `contracts/GameNFT.sol` - NFT contract
  - `scripts/deploy-to-base.js` - Base deployment
  - `scripts/mint-to-base.js` - Base minting
  - `scripts/verify.js` - Contract verification

## Environment Variables for Production

```bash
# Required for Vercel deployment
NEXT_PUBLIC_GROK_API_KEY=your-grok-api-key
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xa6FCA1dEc2646e770cf4d87F7b7Cc6B5F3eA7375
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
NFT_MINTER_PRIVATE_KEY=your-minter-private-key
```

## Deployment Steps

### 1. Deploy Smart Contract
```bash
cd deployment
npm install
npm run deploy:base
```

### 2. Deploy Frontend
```bash
# Via Vercel CLI
vercel --prod

# Via GitHub (automatic)
git push origin main
```

### 3. Verify Deployment
- Check Vercel dashboard for deployment status
- Test wallet connection
- Test game generation
- Test NFT minting

## Production Considerations

### Wallet Providers
- Uses `SimpleWalletProvider` for production
- Supports Coinbase Wallet and MetaMask
- No WalletConnect dependencies (removed for stability)

### API Routes
- `/api/generate-game` - Game generation
- `/api/ipfs/upload-image` - Image upload
- `/api/ipfs/upload-metadata` - Metadata upload
- `/api/nft/mint` - NFT minting

### Error Handling
- Comprehensive error logging
- Graceful fallbacks for failed operations
- User-friendly error messages

## Monitoring

### Key Metrics
- Wallet connection success rate
- Game generation success rate
- Screenshot capture success rate
- NFT minting success rate
- IPFS upload success rate

### Logs to Monitor
- Vercel function logs
- Base network transaction logs
- Pinata upload logs
- Browser console errors

## Files for Deployment

### Core Application
- `src/app/` - Next.js app router
- `src/components/` - React components
- `src/services/` - Business logic
- `src/constants/` - Configuration

### Smart Contracts
- `deployment/contracts/GameNFT.sol` - NFT contract
- `deployment/scripts/` - Deployment scripts
- `deployment/hardhat.config.js` - Hardhat config

### Configuration
- `package.json` - Dependencies
- `next.config.js` - Next.js config
- `vercel.json` - Vercel config
- `tailwind.config.js` - Styling config
