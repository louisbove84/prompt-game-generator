# NFT Feature Setup Guide

## Overview

This guide will help you set up the automatic NFT minting feature for your AI Game Generator. After users pay to create a game, the first screenshot will automatically be minted as an NFT on the Base network and sent to their wallet.

## Architecture

The NFT system consists of:

1. **Smart Contract**: ERC721 contract on Base network (`contracts/GameNFT.sol`)
2. **IPFS Storage**: Pinata for storing images and metadata
3. **Screenshot Capture**: html2canvas for capturing game screenshots
4. **Minting Service**: Server-side API that mints NFTs using a private key

## Prerequisites

- Node.js and npm installed
- A wallet with some ETH on Base network (for contract deployment and gas fees)
- Pinata account for IPFS storage

## Step-by-Step Setup

### 1. Install Dependencies ✅

Already done! The following packages have been installed:
- `html2canvas` - Screenshot capture
- `pinata` - IPFS uploads
- `@thirdweb-dev/sdk` - NFT utilities
- `ethers@^5` - Blockchain interactions

### 2. Deploy the NFT Smart Contract

#### Option A: Deploy via Remix (Recommended for beginners)

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file called `GameNFT.sol`
3. Copy the contents from `contracts/GameNFT.sol` into it
4. In Remix, go to the "Solidity Compiler" tab
5. Install OpenZeppelin (click the plugin manager, install "@openzeppelin/contracts")
6. Compile the contract (Compiler version: ^0.8.20)
7. Go to "Deploy & Run Transactions" tab
8. Select "Injected Provider - MetaMask" as the environment
9. Connect your MetaMask wallet and **switch to Base Mainnet**
   - Network: Base
   - RPC URL: https://mainnet.base.org
   - Chain ID: 8453
   - Currency: ETH
10. Click "Deploy" and confirm the transaction
11. **Save the deployed contract address!**

#### Option B: Deploy via thirdweb (Fastest)

1. Go to [thirdweb.com/explore](https://thirdweb.com/explore)
2. Click "Deploy Contract"
3. Upload `contracts/GameNFT.sol`
4. Select "Base" network
5. Deploy and copy the contract address

#### Option C: Deploy via Hardhat (Advanced)

```bash
npm install --save-dev hardhat @nomiclabs/hardhat-ethers
npx hardhat init
# Add deployment script to scripts/deploy.js
npx hardhat run scripts/deploy.js --network base
```

### 3. Set Up Pinata (IPFS Storage)

1. Go to [pinata.cloud](https://pinata.cloud) and create a free account
2. Navigate to API Keys section
3. Click "New Key"
4. Give it admin access (for pinning files and JSON)
5. Name it "AI Game Generator"
6. **Save both the API Key and Secret Key!**

### 4. Configure Environment Variables

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Fill in the following variables in your `.env` file:

   ```bash
   # NFT Contract (from Step 2)
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...YourContractAddressHere

   # Minter Private Key (wallet that deployed the contract)
   # IMPORTANT: This wallet needs ETH on Base for gas fees
   NFT_MINTER_PRIVATE_KEY=your-private-key-here

   # Pinata API Keys (from Step 3)
   PINATA_API_KEY=your-pinata-api-key-here
   PINATA_SECRET_KEY=your-pinata-secret-key-here
   ```

   **⚠️ SECURITY WARNING:**
   - NEVER commit your `.env` file to git!
   - NEVER share your private key!
   - Make sure `.env` is in your `.gitignore`

### 5. Fund the Minter Wallet

The wallet whose private key you used in `NFT_MINTER_PRIVATE_KEY` needs ETH on Base network to pay for gas fees when minting NFTs.

1. Send some ETH to the minter wallet address (on Base network)
2. Recommended: Start with 0.01 ETH (~$30 worth)
3. Each NFT mint costs approximately 0.001-0.003 ETH in gas

**How to get ETH on Base:**
- Bridge from Ethereum mainnet using [bridge.base.org](https://bridge.base.org)
- Buy directly on Base using Coinbase or other exchanges

### 6. Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Connect your wallet to the app
3. Pay $0.20 USDC to generate a game
4. Wait for the game to generate and load
5. After ~2 seconds, you should see:
   - "Minting your NFT..." notification
   - Then "NFT Minted!" with OpenSea link
6. Check your wallet - you should have a new NFT!

### 7. Verify Everything Works

Check these logs in the browser console:
- `📸 [Screenshot] Capturing game screenshot...`
- `✅ [Screenshot] Screenshot captured successfully!`
- `🎨 [NFT Service] Starting NFT minting flow...`
- `📤 [NFT Service] Step 1: Uploading screenshot to IPFS...`
- `✅ [NFT Service] Screenshot uploaded`
- `📤 [NFT Service] Step 2: Creating and uploading metadata...`
- `✅ [NFT Service] Metadata uploaded`
- `⛓️ [NFT Service] Step 3: Minting NFT on Base network...`
- `✅ [NFT Service] NFT minted successfully!`

Check these logs in the server console:
- `⏳ [NFT Mint] Transaction sent: 0x...`
- `✅ [NFT Mint] Transaction confirmed!`

## How It Works

1. **User pays** $0.20 USDC via the PaymentModal
2. **Game generates** using Grok AI
3. **Game loads** in the DynamicGameLoader component
4. **Screenshot captures** automatically after 2 seconds
5. **Image uploads** to IPFS via Pinata
6. **Metadata creates** with game prompt and attributes
7. **Metadata uploads** to IPFS
8. **NFT mints** on Base network using the minter wallet
9. **NFT transfers** to the user's wallet address
10. **User receives** notification with OpenSea link

## Troubleshooting

### "NFT contract not deployed"
- Make sure you've deployed the contract (Step 2)
- Verify `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS` is set in `.env`
- Restart your dev server after changing `.env`

### "Minter private key not configured"
- Add `NFT_MINTER_PRIVATE_KEY` to `.env`
- Make sure it's the private key of the wallet that deployed the contract
- Restart your dev server

### "Failed to upload to Pinata"
- Check your Pinata API keys are correct
- Make sure your Pinata account is active
- Verify the API key has pinning permissions

### "Insufficient funds for gas"
- Send more ETH to the minter wallet on Base network
- Check balance: [basescan.org](https://basescan.org)

### Screenshot not capturing
- Check browser console for errors
- Make sure the game has fully loaded
- Try increasing the delay in DynamicGameLoader.tsx (line 132)

### NFT not appearing in wallet
- Check the transaction on [BaseScan](https://basescan.org)
- It may take a few minutes to show up in MetaMask
- Try viewing in OpenSea (link provided in the alert)
- NFTs may not show immediately in all wallets - use the OpenSea link

## Costs

- **Contract Deployment**: ~0.005 ETH (~$15) - one-time cost
- **NFT Minting per game**: ~0.002 ETH (~$6) in gas fees
- **IPFS Storage**: Free tier on Pinata (1GB storage, 10GB bandwidth/month)

## Contract Details

- **Contract Name**: AI Game Genesis
- **Symbol**: AIGAME
- **Standard**: ERC721 with URI Storage
- **Network**: Base (Chain ID: 8453)
- **Contract**: `contracts/GameNFT.sol`

## Security Best Practices

1. **Never commit** `.env` to git
2. **Use a dedicated wallet** for minting (not your main wallet)
3. **Keep private keys secure** - consider using a secret management service in production
4. **Monitor gas costs** - set up alerts if minting costs spike
5. **Rate limit** the NFT minting endpoint in production
6. **Verify contracts** on BaseScan for transparency

## Production Deployment

For production (e.g., Vercel):

1. Add environment variables in your hosting platform's settings
2. Use secret management (e.g., Vercel Secret, AWS Secrets Manager)
3. Consider using a multi-sig wallet or contract wallet for minting
4. Set up monitoring and alerts for failed mints
5. Implement rate limiting to prevent abuse

## Support & Resources

- **Base Documentation**: [docs.base.org](https://docs.base.org)
- **Pinata Docs**: [docs.pinata.cloud](https://docs.pinata.cloud)
- **OpenZeppelin Contracts**: [docs.openzeppelin.com](https://docs.openzeppelin.com)
- **BaseScan Explorer**: [basescan.org](https://basescan.org)

## Future Enhancements

Potential improvements:
- Add rarity attributes based on game complexity
- Allow users to mint additional screenshots
- Create a gallery of all minted game NFTs
- Add royalties for secondary sales
- Create a leaderboard of most popular games
- Allow NFT holders to replay their games

---

**Need Help?** Check the logs in both browser console and server console for detailed error messages.

