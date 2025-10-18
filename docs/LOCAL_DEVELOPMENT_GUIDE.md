# 🧪 Local NFT Development Guide

## Overview

This guide helps you test the NFT minting feature locally using Hardhat's built-in network. **No real ETH or payments required!**

## 🚀 Quick Start

### 1️⃣ Start Local Hardhat Network
```bash
./scripts/start-local-hardhat.sh
```

### 2️⃣ Configure Local Environment
```bash
cp env.local.example .env
# Edit .env with your API keys (Grok AI, Pinata)
```

### 3️⃣ Start Your App
```bash
npm run dev
```

### 4️⃣ Test NFT Minting
1. Connect wallet (use MetaMask with local network)
2. Pay $0.20 USDC (fake payment on local network)
3. Generate a game
4. NFT mints automatically! 🎉

## 📋 Prerequisites

- **Node.js** installed
- **MetaMask** (for wallet connection)
- **Grok AI API key** (for game generation)
- **Pinata API keys** (for IPFS storage)

## 🔧 Detailed Setup

### Step 1: Start Local Hardhat Network

The Hardhat network is already configured with:
- **Contract deployed**: `0x5FbDB2315678afecb367f032d93F642f64180aa3`
- **RPC URL**: `http://localhost:8545`
- **Chain ID**: `31337`
- **Default accounts** with 10,000 ETH each

```bash
./scripts/start-local-hardhat.sh
```

This will:
- Start Hardhat node in background
- Deploy the GameNFT contract
- Show you the contract address and default accounts

### Step 2: Configure MetaMask

Add the local Hardhat network to MetaMask:

1. **Open MetaMask** → Settings → Networks → Add Network
2. **Network Name**: Hardhat Local
3. **RPC URL**: `http://localhost:8545`
4. **Chain ID**: `31337`
5. **Currency Symbol**: `ETH`

### Step 3: Import Test Account

Import the default Hardhat account to MetaMask:

1. **Private Key**: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
2. **Address**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
3. **Balance**: 10,000 ETH

### Step 4: Configure Environment

Copy the local environment template:
```bash
cp env.local.example .env
```

Edit `.env` with your API keys:
```bash
# Required for game generation
NEXT_PUBLIC_GROK_API_KEY=your-grok-api-key

# Required for IPFS storage
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key

# Local contract (already set)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NFT_MINTER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

### Step 5: Start Your App

```bash
npm run dev
```

## 🎮 Testing the NFT Flow

### 1. Connect Wallet
- Open your app at `http://localhost:3000`
- Click "Connect Wallet"
- Select the imported Hardhat account

### 2. Generate a Game
- Enter a game prompt (e.g., "A space shooter with asteroids")
- Click "Pay $0.20 USDC to Unlock Generation"
- Confirm the fake payment transaction

### 3. Wait for NFT Minting
- Game generates using Grok AI
- Game loads in browser
- Screenshot captures automatically
- NFT mints to your wallet! 🎉

## 🔍 What Happens Locally

```
1. User pays fake USDC → Local transaction ✅
2. AI generates game → Grok API call ✅
3. Game loads → Screenshot captured ✅
4. Image uploaded → Pinata IPFS ✅
5. Metadata created → Pinata IPFS ✅
6. NFT minted → Local Hardhat network ✅
7. User receives NFT → In MetaMask ✅
```

## 🛠️ Troubleshooting

### "Contract not deployed"
- Make sure Hardhat node is running: `./scripts/start-local-hardhat.sh`
- Check if contract is deployed: `0x5FbDB2315678afecb367f032d93F642f64180aa3`

### "Insufficient funds"
- Import the default Hardhat account to MetaMask
- You should have 10,000 ETH

### "Network connection failed"
- Make sure Hardhat node is running on port 8545
- Check MetaMask network configuration

### "IPFS upload failed"
- Verify Pinata API keys in `.env`
- Check your Pinata account is active

### "Game generation failed"
- Verify Grok AI API key in `.env`
- Check your Grok API quota

## 📊 Local Testing Benefits

✅ **No real ETH required** - Use fake ETH from Hardhat
✅ **No real payments** - Fake USDC transactions
✅ **Fast testing** - Local network is instant
✅ **Free to test** - No gas fees or API costs
✅ **Full functionality** - Test complete NFT flow
✅ **Easy debugging** - All logs visible locally

## 🔧 Development Commands

```bash
# Start local Hardhat network
./scripts/start-local-hardhat.sh

# Stop Hardhat network
pkill -f "hardhat node"

# Test NFT minting directly
cd deployment
npx hardhat run scripts/test-local-mint.js --network hardhat

# Check Hardhat node logs
tail -f hardhat-node.log

# Clean up
rm -f hardhat-node.log hardhat-node.pid
```

## 📁 Local Files Created

- `hardhat-node.log` - Hardhat node logs
- `hardhat-node.pid` - Process ID for cleanup
- `deployment/deployment-info.json` - Contract deployment info
- `deployment/artifacts/` - Compiled contract artifacts

## 🎯 Next Steps After Local Testing

Once local testing works:

1. **Deploy to Base testnet** (Sepolia) for more realistic testing
2. **Deploy to Base mainnet** for production
3. **Set up monitoring** and alerts
4. **Configure production** environment variables

## 💡 Tips for Local Development

1. **Keep Hardhat node running** while developing
2. **Use the same account** for consistent testing
3. **Check logs** in browser console and server console
4. **Test with different** game prompts
5. **Verify NFTs** in MetaMask after minting

## 🎉 Success Indicators

You'll know it's working when you see:

- ✅ "✅ [Local NFT Service] NFT minted successfully!"
- ✅ NFT appears in MetaMask
- ✅ Transaction hash in console
- ✅ Success notification in UI

---

**Ready to test locally?** Run `./scripts/start-local-hardhat.sh` and start testing! 🚀
