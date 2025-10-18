# NFT Feature - Quick Start Guide

## 🚀 Get Started in 5 Steps

### 1️⃣ Deploy NFT Contract

**Using Hardhat (Recommended):**
1. Add `DEPLOYER_PRIVATE_KEY` to `.env`
2. Send 0.01 ETH to deployer wallet on Base
3. Run: `npx hardhat run scripts/deploy.js --network base`
4. Copy contract address ✅

**Using Remix (Alternative):**
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create `GameNFT.sol` and paste code from `contracts/GameNFT.sol`
3. Compile with Solidity ^0.8.20
4. Deploy to Base network (Chain ID: 8453)
5. Save contract address ✅

### 2️⃣ Get Pinata API Keys

1. Go to [pinata.cloud](https://pinata.cloud)
2. Create account → API Keys → New Key
3. Save API Key and Secret ✅

### 3️⃣ Configure Environment

```bash
# Copy example
cp env.example .env

# Add these to .env:
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...YourContractAddress
NFT_MINTER_PRIVATE_KEY=your-private-key
PINATA_API_KEY=your-pinata-key
PINATA_SECRET_KEY=your-pinata-secret
```

### 4️⃣ Fund Minter Wallet

Send 0.01 ETH to your minter wallet on Base network for gas fees.

### 5️⃣ Test It!

```bash
npm run dev
# → Pay $0.20 USDC → Generate game → NFT mints automatically! 🎉
```

## 🔍 Verify It Works

Look for these console logs:
- ✅ `📸 [Screenshot] Capturing game screenshot...`
- ✅ `🎨 [NFT Service] Starting NFT minting flow...`
- ✅ `✅ [NFT Service] NFT minted successfully!`

## 💰 Costs

- Deploy contract: ~$15 (one-time)
- Mint each NFT: ~$6 in gas
- IPFS storage: Free (Pinata)

## ⚠️ Troubleshooting

| Issue | Fix |
|-------|-----|
| "Contract not deployed" | Set `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` in `.env` |
| "Private key not configured" | Set `NFT_MINTER_PRIVATE_KEY` in `.env` |
| "Insufficient funds" | Send ETH to minter wallet on Base |
| "Pinata error" | Check API keys in `.env` |

## 📚 Full Documentation

See `NFT_SETUP_README.md` for complete details.

## 🎯 How It Works

```
Payment → Game Generation → Screenshot → Upload to IPFS → Mint NFT → Send to User
```

That's it! 🚀

