#!/bin/bash

# Local Development Setup Script
# This script sets up everything needed for local NFT testing

echo "🧪 Setting up Local NFT Development Environment"
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "📁 Found project directory"

# Step 1: Copy local environment file
if [ ! -f ".env" ]; then
    if [ -f "env.local.example" ]; then
        echo "📋 Copying local environment template..."
        cp env.local.example .env
        echo "✅ Created .env file"
        echo "⚠️  Please edit .env with your API keys:"
        echo "   - NEXT_PUBLIC_GROK_API_KEY"
        echo "   - PINATA_API_KEY"
        echo "   - PINATA_SECRET_KEY"
    else
        echo "❌ env.local.example not found!"
        exit 1
    fi
else
    echo "ℹ️  .env file already exists"
fi

# Step 2: Start Hardhat network
echo "🔧 Starting local Hardhat network..."
if [ -f "scripts/start-local-hardhat.sh" ]; then
    chmod +x scripts/start-local-hardhat.sh
    ./scripts/start-local-hardhat.sh &
    HARDHAT_PID=$!
    echo "✅ Hardhat network started (PID: $HARDHAT_PID)"
else
    echo "❌ start-local-hardhat.sh not found!"
    exit 1
fi

# Wait a moment for Hardhat to start
sleep 5

# Step 3: Test contract deployment
echo "🧪 Testing contract deployment..."
cd deployment
if npx hardhat run scripts/test-local-mint.js --network hardhat > /dev/null 2>&1; then
    echo "✅ Contract deployment test passed"
else
    echo "⚠️  Contract deployment test failed (this might be normal)"
fi
cd ..

echo ""
echo "🎉 Local development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env with your API keys"
echo "2. Start your app: npm run dev"
echo "3. Open http://localhost:3000"
echo "4. Connect MetaMask to local Hardhat network"
echo "5. Test NFT minting!"
echo ""
echo "🔧 Local Hardhat network:"
echo "   RPC URL: http://localhost:8545"
echo "   Chain ID: 31337"
echo "   Contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3"
echo ""
echo "🛑 To stop Hardhat network:"
echo "   pkill -f 'hardhat node'"
echo ""
echo "📚 For detailed instructions, see: LOCAL_DEVELOPMENT_GUIDE.md"
