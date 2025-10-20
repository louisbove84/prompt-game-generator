#!/bin/bash

echo "🛑 Stopping Local Testing Environment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

# Stop Hardhat node
if [ -f hardhat-node.pid ]; then
    PID=$(cat hardhat-node.pid)
    if ps -p $PID > /dev/null; then
        kill $PID
        echo -e "${GREEN}✅ Stopped Hardhat node (PID: $PID)${NC}"
    else
        echo -e "${RED}⚠️  Hardhat node not running${NC}"
    fi
    rm hardhat-node.pid
else
    # Try to find and kill hardhat node by port
    if lsof -Pi :8545 -sTCP:LISTEN -t >/dev/null ; then
        PID=$(lsof -Pi :8545 -sTCP:LISTEN -t)
        kill $PID
        echo -e "${GREEN}✅ Stopped Hardhat node (PID: $PID)${NC}"
    else
        echo -e "${RED}⚠️  No Hardhat node found on port 8545${NC}"
    fi
fi

# Clean up log file
if [ -f hardhat-node.log ]; then
    rm hardhat-node.log
    echo -e "${GREEN}✅ Cleaned up log file${NC}"
fi

echo -e "${GREEN}✨ Local testing environment stopped!${NC}"
