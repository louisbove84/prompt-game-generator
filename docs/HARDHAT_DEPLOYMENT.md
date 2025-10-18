# Hardhat Deployment Guide

## 🚀 Deploy NFT Contract to Base Network

This guide walks you through deploying the GameNFT contract using Hardhat to the Base network.

## Prerequisites

1. **Node.js** installed
2. **ETH on Base** for gas fees (~0.01 ETH recommended)
3. **Wallet private key** for deployment
4. **BaseScan API key** (optional, for verification)

## Step 1: Install Dependencies

The Hardhat setup is already configured in a separate `deployment/` directory. Dependencies are automatically installed when you run the deployment script.

If you need to install manually:
```bash
cd deployment
npm install
```

## Step 2: Configure Environment

1. Copy the example environment file:
   ```bash
   cp env.example .env
   ```

2. Add your deployment private key to `.env`:
   ```bash
   # Private key of wallet that will deploy the contract
   DEPLOYER_PRIVATE_KEY=your-deployer-private-key-here
   
   # Optional: BaseScan API key for contract verification
   BASESCAN_API_KEY=your-basescan-api-key-here
   ```

**⚠️ Security Warning:**
- Never commit your `.env` file to git!
- Keep your private key secure
- Use a dedicated wallet for deployment

## Step 3: Fund Your Deployment Wallet

Send ETH to your deployment wallet on Base network:

1. **Get Base ETH**:
   - Bridge from Ethereum: [bridge.base.org](https://bridge.base.org)
   - Buy directly on Base using exchanges

2. **Recommended amount**: 0.01-0.05 ETH (~$30-150)
   - Contract deployment: ~0.005 ETH
   - Buffer for verification and testing

## Step 4: Deploy the Contract

### Deploy to Base Mainnet
```bash
cd deployment
npm run deploy
```

### Deploy to Base Sepolia Testnet (for testing)
```bash
cd deployment
npm run deploy:testnet
```

### Using the Interactive Script (Easiest)
```bash
./deploy.sh
```

## Step 5: Verify the Contract (Optional)

After deployment, verify the contract on BaseScan:

```bash
cd deployment
npm run verify
```

Or manually:
```bash
cd deployment
npx hardhat verify --network base CONTRACT_ADDRESS
```

## Step 6: Update Your App Configuration

1. **Copy the contract address** from the deployment output
2. **Add to your `.env` file**:
   ```bash
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x...YourContractAddressHere
   ```
3. **Set the minter private key** (same as deployer for simplicity):
   ```bash
   NFT_MINTER_PRIVATE_KEY=your-deployer-private-key-here
   ```

## Deployment Output Example

```
🚀 Starting GameNFT contract deployment...
📦 Deploying GameNFT contract...
⏳ Waiting for deployment confirmation...
✅ GameNFT deployed successfully!
📍 Contract Address: 0x1234567890abcdef...
🔗 Network: base
📋 Deployment Transaction: 0xabcdef1234567890...
⛽ Gas Used: 1234567
💰 Gas Price: 0.001 gwei
👤 Contract Owner: 0xYourAddress...
🎯 Current Token ID: 0

🎉 Deployment Complete!
📝 Next Steps:
1. Copy the contract address above
2. Add it to your .env file:
   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x1234567890abcdef...
3. (Optional) Verify the contract:
   npx hardhat verify --network base 0x1234567890abcdef...
4. Check on BaseScan:
   https://basescan.org/address/0x1234567890abcdef...
```

## Network Configuration

The Hardhat config supports:

- **Base Mainnet** (Chain ID: 8453)
- **Base Sepolia Testnet** (Chain ID: 84532)
- **Local Hardhat** (for testing)

## Troubleshooting

### "Insufficient funds"
- Send more ETH to your deployment wallet
- Check balance on [BaseScan](https://basescan.org)

### "Invalid private key"
- Make sure your private key starts with `0x`
- Don't include quotes around the private key

### "Network connection failed"
- Check your RPC URL in `hardhat.config.js`
- Try using a different Base RPC endpoint

### "Contract verification failed"
- Make sure your BaseScan API key is correct
- Try manual verification command
- Check if contract is already verified

## Files Created

After deployment, these files are created:
- `deployment-info.json` - Deployment details
- `artifacts/` - Compiled contract artifacts
- `cache/` - Hardhat cache

## Next Steps

1. **Test the contract** by minting an NFT
2. **Set up your app** with the contract address
3. **Configure Pinata** for IPFS storage
4. **Test the full flow** end-to-end

## Commands Reference

```bash
# Deploy to Base mainnet
npx hardhat run scripts/deploy.js --network base

# Deploy to Base Sepolia testnet
npx hardhat run scripts/deploy.js --network baseSepolia

# Verify contract
npx hardhat run scripts/verify.js --network base

# Manual verification
npx hardhat verify --network base CONTRACT_ADDRESS

# Compile contracts
npx hardhat compile

# Run tests (if any)
npx hardhat test

# Clean artifacts
npx hardhat clean
```

## Security Best Practices

1. **Use a dedicated wallet** for deployment
2. **Keep private keys secure** - use environment variables
3. **Test on testnet first** before mainnet deployment
4. **Verify contracts** for transparency
5. **Monitor gas prices** before deployment
6. **Keep deployment records** for audit trails

## Cost Estimation

| Operation | Cost (ETH) | Cost (USD) |
|-----------|------------|------------|
| Contract Deployment | ~0.005 | ~$15 |
| Contract Verification | ~0.001 | ~$3 |
| First NFT Mint | ~0.002 | ~$6 |

## Support

If you encounter issues:
1. Check the [Base documentation](https://docs.base.org)
2. Verify your network configuration
3. Check gas prices on [BaseScan](https://basescan.org)
4. Ensure sufficient ETH balance

---

**Ready to deploy?** Run:
```bash
npx hardhat run scripts/deploy.js --network base
```
