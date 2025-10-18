# GameNFT Smart Contract

## Overview
This ERC721 contract mints NFTs for AI-generated game screenshots on the Base network.

## Deployment Instructions

### Option 1: Deploy via thirdweb (Easiest)
1. Go to [thirdweb.com/explore](https://thirdweb.com/explore)
2. Click "Deploy Contract"
3. Upload `GameNFT.sol`
4. Select "Base" network
5. Deploy and copy the contract address
6. Add the contract address to your `.env` file as `NEXT_PUBLIC_NFT_CONTRACT_ADDRESS`

### Option 2: Deploy via Remix (Manual)
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create a new file `GameNFT.sol` and paste the contract code
3. Install OpenZeppelin contracts in Remix:
   - Click on the "File Explorer" plugin
   - Go to "npm" section
   - Add `@openzeppelin/contracts@5.0.0`
4. Compile the contract (Solidity ^0.8.20)
5. Deploy:
   - Switch to "Deploy & Run Transactions" tab
   - Select "Injected Provider - MetaMask"
   - Connect your wallet and switch to Base network
   - Click "Deploy"
   - Copy the deployed contract address

### Option 3: Deploy via Hardhat (Advanced)
```bash
npm install --save-dev hardhat @openzeppelin/contracts
npx hardhat init
# Follow prompts, then add deployment script
npx hardhat run scripts/deploy.js --network base
```

## After Deployment
1. Copy your contract address
2. Add to `.env`:
   ```
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xYourContractAddress
   NFT_MINTER_PRIVATE_KEY=your-private-key-here
   ```
3. Make sure the deployer address (owner) is the same as the private key used for minting
4. Keep your private key safe and never commit it to git!

## Contract Features
- **Name**: AI Game Genesis
- **Symbol**: AIGAME
- **Standard**: ERC721 with URI Storage
- **Owner-only minting**: Only the contract owner can mint NFTs
- **Metadata**: Each NFT points to IPFS metadata containing the game screenshot

## Base Network Details
- **Mainnet**: https://mainnet.base.org
- **Chain ID**: 8453
- **Block Explorer**: https://basescan.org
- **Testnet (Sepolia)**: https://sepolia.base.org
- **Testnet Chain ID**: 84532
- **Testnet Explorer**: https://sepolia.basescan.org

## Verify Contract (Optional)
After deployment, verify on BaseScan for transparency:
```bash
npx hardhat verify --network base YOUR_CONTRACT_ADDRESS
```

