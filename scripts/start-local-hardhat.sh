#!/bin/bash

# Start Local Hardhat Network for NFT Testing
# This script starts a local Hardhat network that your app can connect to

echo "🚀 Starting Local Hardhat Network for NFT Testing"
echo "================================================="

# Check if we're in the right directory
if [ ! -d "deployment" ]; then
    echo "❌ Error: deployment directory not found!"
    echo "Please run this script from the project root directory."
    exit 1
fi

echo "📁 Found deployment directory"

# Start Hardhat node in the background
echo "🔧 Starting Hardhat node..."
cd deployment

# Kill any existing Hardhat node
pkill -f "hardhat node" 2>/dev/null || true

# Start Hardhat node in background
npx hardhat node > ../hardhat-node.log 2>&1 &
HARDHAT_PID=$!

# Wait a moment for the node to start
sleep 3

# Check if the node is running
if ps -p $HARDHAT_PID > /dev/null; then
    echo "✅ Hardhat node started successfully!"
    echo "📍 PID: $HARDHAT_PID"
    echo "🌐 RPC URL: http://localhost:8545"
    echo "📋 Chain ID: 31337"
    echo ""
    echo "📝 Default accounts with 10000 ETH each:"
    echo "   Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    echo "   Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    echo "   Account #2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
    echo ""
    echo "🎯 Contract deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3"
    echo ""
    echo "📋 Next steps:"
    echo "1. Copy env.local.example to .env"
    echo "2. Start your Next.js app: npm run dev"
    echo "3. Test NFT minting locally!"
    echo ""
    echo "🛑 To stop the Hardhat node, run:"
    echo "   kill $HARDHAT_PID"
    echo "   or: pkill -f nett"
    
    # Save PID to file for easy cleanup
    echo $HARDHAT_PID > ../hardhat-node.pid
    
else
    echo "❌ Failed to start Hardhat node"
    echo "Check hardhat-node.log for details"
    exit 1
fi
