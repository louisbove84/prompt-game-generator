#!/bin/bash

# GameNFT Contract Deployment Script
# This script deploys the GameNFT contract to Base network using Hardhat

echo "🚀 GameNFT Contract Deployment Script"
echo "====================================="

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy env.example to .env and configure your settings:"
    echo "cp env.example .env"
    exit 1
fi

# Check if DEPLOYER_PRIVATE_KEY is set
if ! grep -q "DEPLOYER_PRIVATE_KEY=" .env || grep -q "DEPLOYER_PRIVATE_KEY=your-deployer-private-key-here" .env; then
    echo "❌ Error: DEPLOYER_PRIVATE_KEY not configured in .env"
    echo "Please add your deployment wallet private key to .env"
    exit 1
fi

echo "✅ Environment configuration found"

# Ask user which network to deploy to
echo ""
echo "Which network would you like to deploy to?"
echo "1) Base Mainnet (Production)"
echo "2) Base Sepolia Testnet (Testing)"
read -p "Enter your choice (1 or 2): " network_choice

case $network_choice in
    1)
        NETWORK="base"
        echo "🌐 Deploying to Base Mainnet..."
        ;;
    2)
        NETWORK="baseSepolia"
        echo "🌐 Deploying to Base Sepolia Testnet..."
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "⚠️  IMPORTANT: Make sure your deployment wallet has ETH for gas fees!"
echo "   Recommended: 0.01-0.05 ETH"
echo ""
read -p "Do you want to continue? (y/N): " confirm

if [[ ! $confirm =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

echo ""
echo "🔨 Starting deployment..."

# Deploy the contract using the deployment directory
cd deployment

if npm run deploy:$NETWORK; then
    echo ""
    echo "✅ Deployment completed successfully!"
    echo ""
    echo "📝 Next steps:"
    echo "1. Copy the contract address from the output above"
    echo "2. Add it to your .env file:"
    echo "   NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x..."
    echo "3. Set NFT_MINTER_PRIVATE_KEY (same as deployer for simplicity)"
    echo "4. (Optional) Verify the contract:"
    echo "   cd deployment && npm run verify"
    echo ""
    echo "🎉 Ready to mint NFTs!"
else
    echo ""
    echo "❌ Deployment failed!"
    echo "Please check the error messages above and try again."
    exit 1
fi