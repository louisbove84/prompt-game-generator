# 🧪 Local Testing Guide

## Overview
This guide covers testing the NFT minting functionality locally before deployment.

## Prerequisites
- Node.js 18+ installed
- Wallet with Base network support (Coinbase Wallet, MetaMask)
- Environment variables configured (see `.env.local`)

## Quick Start

### 1. Start Development Server
```bash
npm run dev
```
Server will run on `http://localhost:3000` (or next available port)

### 2. Test Wallet Connection
- Open browser to `http://localhost:3000`
- Click "Connect Coinbase Wallet" or "Connect MetaMask"
- Verify wallet connection shows your address

### 3. Test Game Generation
- Enter a simple prompt: `"A space shooter game where you collect stars"`
- Click "Pay $0.20 USDC to Unlock Generation"
- Complete payment flow
- Watch game generation process

### 4. Test NFT Minting
- Play the generated game
- Screenshot should be captured automatically
- NFT should be minted to Base network
- Check provided links (BaseScan, OpenSea)

## Environment Variables Required

```bash
# Grok AI API
NEXT_PUBLIC_GROK_API_KEY=your-grok-api-key

# Base Network
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-onchainkit-key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# NFT Contract
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xa6FCA1dEc2646e770cf4d87F7b7Cc6B5F3eA7375

# Pinata IPFS
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key

# NFT Minter
NFT_MINTER_PRIVATE_KEY=your-minter-private-key
```

## Testing Checklist

- [ ] Wallet connects successfully
- [ ] Game generation works
- [ ] Screenshot capture works
- [ ] IPFS upload succeeds
- [ ] NFT minting succeeds
- [ ] BaseScan link works
- [ ] OpenSea link works (may take time to index)

## Troubleshooting

### Wallet Connection Issues
- Ensure wallet is on Base network
- Check browser console for errors
- Try different wallet (Coinbase vs MetaMask)

### Screenshot Capture Issues
- Check browser console for html2canvas errors
- Try different game types
- Verify canvas elements are present

### NFT Minting Issues
- Check environment variables
- Verify contract address is correct
- Check Base network connection
- Review API route logs

## Files for Local Testing

- `src/components/payments/WalletConnect.tsx` - Wallet connection UI
- `src/app/page.tsx` - Main application page
- `src/app/frame/page.tsx` - Frame page for Farcaster
- `src/services/nft.ts` - NFT minting service
- `src/app/api/nft/mint/route.ts` - NFT minting API
- `.env.local` - Local environment variables
