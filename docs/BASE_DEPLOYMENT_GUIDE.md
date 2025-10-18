# 🚀 Base Network Deployment Guide

## Overview

This guide walks you through deploying your NFT contract to the real Base network and minting NFTs with real ETH.

## Prerequisites

1. **ETH on Base network** for gas fees (~0.01-0.05 ETH recommended)
2. **Private key** of the wallet you want to use for deployment
3. **BaseScan API key** (optional, for contract verification)

## Step 1: Configure Environment

Add your deployment configuration to `.env`:

```bash
# Base Network Deployment
DEPLOYER_PRIVATE_KEY=your-deployer-private-key-here
BASESCAN_API_KEY=your-basescan-api-key-here

# NFT Contract (will be set after deployment)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...YourContractAddress
NFT_MINTER_PRIVATE_KEY=your-deployer-private-key-here
```

## Step 2: Deploy to Base Network

Deploy your contract to Base mainnet:

```bash
cd deployment
npm run deploy:base
```

This will:
- Deploy the GameNFT contract to Base
- Save deployment info to `base-deployment-info.json`
- Show you the contract address and next steps

## Step 3: Test NFT Minting

Mint a test NFT to the real Base network:

```bash
cd deployment
npm run mint:base
```

This will:
- Read your `gameForge.jpg` image
- Create realistic NFT metadata
- Mint the NFT on Base network
- Save results to `base-mint-result.json`

## Step 4: Verify Contract (Optional)

Verify your contract on BaseScan for transparency:

```bash
cd deployment
npm run verify
```

## Expected Output

### Deployment
```
🚀 Deploying GameNFT to Base Network
====================================
📦 Deploying GameNFT contract to Base...
⏳ Waiting for deployment confirmation...
✅ GameNFT deployed successfully to Base!
📍 Contract Address: 0x...YourContractAddress
🔗 Network: base
📋 Deployment Transaction: 0x...
⛽ Gas Used: 30000000
💰 Gas Price: 1.875 gwei
👤 Contract Owner: 0x...YourAddress
🎯 Current Token ID: 0

🎉 Deployment to Base Complete!
```

### Minting
```
🎮 Mint NFT to Base Network
===========================
📍 Contract Address: 0x...YourContractAddress
👤 Deployer (Owner): 0x...YourAddress
🖼️ Image path: .../gameForge.jpg
📁 Image size: 156196 bytes

🎨 Creating NFT on Base network...
📝 Game Prompt: A space adventure game with retro pixel graphics
👤 Recipient: 0x...YourAddress
📋 Transaction sent: 0x...
⏳ Waiting for confirmation on Base network...
📦 Transaction confirmed on Base!
   Block: 12345678
   Gas Used: 24440
   Status: ✅ Success
   Gas Price: 0.001 gwei

🎉 NFT Minted Successfully on Base!
🔗 BaseScan: https://basescan.org/tx/0x...
```

## Costs

| Operation | ETH Cost | USD Cost (approx) |
|-----------|----------|-------------------|
| Contract Deployment | ~0.005 | ~$15 |
| NFT Minting | ~0.002 | ~$6 |
| Contract Verification | ~0.001 | ~$3 |

## Next Steps

1. **Update your app** with the new contract address
2. **Configure production** environment variables
3. **Test the full flow** with real payments
4. **Set up monitoring** for production

## Files Created

- `base-deployment-info.json` - Deployment details
- `base-mint-result.json` - Minting results
- Contract artifacts in `artifacts/` directory

## Troubleshooting

### "Insufficient funds"
- Send more ETH to your deployment wallet on Base
- Check balance on [BaseScan](https://basescan.org)

### "Network connection failed"
- Verify your RPC URL in `hardhat.config.js`
- Try using a different Base RPC endpoint

### "Contract verification failed"
- Make sure your BaseScan API key is correct
- Try manual verification command

## Security Notes

- **Keep private keys secure** - never commit to git
- **Use a dedicated wallet** for deployment
- **Test on Base Sepolia** first if you want
- **Monitor gas prices** before deployment

---

**Ready to deploy?** Run `npm run deploy:base` to deploy to Base network! 🚀
