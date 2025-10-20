#!/bin/bash

echo "🚀 Starting Local NFT Testing Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Check if Hardhat node is already running
echo -e "${BLUE}📡 Checking if Hardhat node is running...${NC}"
if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
    echo -e "${GREEN}✅ Hardhat node already running on port 8545${NC}"
else
    echo -e "${YELLOW}⚠️  Hardhat node not running. Starting it now...${NC}"
    cd deployment
    npx hardhat node > ../hardhat-node.log 2>&1 &
    HARDHAT_PID=$!
    echo $HARDHAT_PID > ../hardhat-node.pid
    cd ..
    echo -e "${GREEN}✅ Hardhat node started (PID: $HARDHAT_PID)${NC}"
    sleep 3
fi

echo ""

# Step 2: Deploy contract to local network
echo -e "${BLUE}📦 Deploying GameNFT contract to local network...${NC}"
cd deployment
npx hardhat run scripts/deploy.js --network localhost
cd ..

echo ""

# Step 3: Show local testing configuration
echo -e "${GREEN}🎯 Local Testing Configuration:${NC}"
echo -e "   ${BLUE}📍 Contract:${NC} 0x5FbDB2315678afecb367f032d93F642f64180aa3"
echo -e "   ${BLUE}🌐 RPC URL:${NC} http://localhost:8545"
echo -e "   ${BLUE}🔗 Chain ID:${NC} 31337"
echo -e "   ${BLUE}👤 Test Account:${NC} 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
echo -e "   ${BLUE}🔑 Private Key:${NC} 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
echo ""

# Step 4: Instructions
echo -e "${GREEN}🎮 Next Steps:${NC}"
echo -e "   1. Configure MetaMask:"
echo -e "      - Network: ${YELLOW}Hardhat Local${NC}"
echo -e "      - RPC URL: ${YELLOW}http://localhost:8545${NC}"
echo -e "      - Chain ID: ${YELLOW}31337${NC}"
echo -e "      - Import account with private key above"
echo ""
echo -e "   2. Start development server:"
echo -e "      ${YELLOW}npm run dev${NC}"
echo ""
echo -e "   3. Open browser to: ${YELLOW}http://localhost:3000${NC}"
echo ""
echo -e "   4. Test NFT minting:"
echo -e "      - Connect wallet"
echo -e "      - Generate a game"
echo -e "      - Pay fake USDC (uses fake ETH)"
echo -e "      - Watch NFT mint! 🎉"
echo ""

# Step 5: Show how to stop
echo -e "${BLUE}🛑 To stop Hardhat node later:${NC}"
echo -e "   ${YELLOW}./scripts/stop-local-testing.sh${NC}"
echo ""

echo -e "${GREEN}✨ Local testing environment ready!${NC}"
