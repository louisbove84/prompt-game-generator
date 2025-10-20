# 🧪 Local Testing - Quick Start

## 🚀 One Command Setup

```bash
./scripts/start-local-testing.sh
```

This will:
1. ✅ Start Hardhat node on port 8545
2. ✅ Deploy NFT contract to local network
3. ✅ Show you all the configuration details
4. ✅ Give you step-by-step instructions

## 🎮 Testing Flow

### **Step 1: Run the setup script**
```bash
./scripts/start-local-testing.sh
```

### **Step 2: Configure MetaMask**
- **Network Name**: Hardhat Local
- **RPC URL**: `http://localhost:8545`
- **Chain ID**: `31337`
- **Import Account**:
  - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
  - Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
  - Balance: 10,000 ETH (fake)

### **Step 3: Start development server**
```bash
npm run dev
```

### **Step 4: Test NFT Minting**
1. Open `http://localhost:3000` (or whatever port it shows)
2. Connect wallet (MetaMask with Hardhat Local network)
3. Enter a game prompt: `"A space shooter game where you collect stars"`
4. Click "Pay $0.20 USDC to Unlock Generation"
5. Confirm fake payment (uses fake ETH)
6. Watch the magic:
   - Game generates with Grok AI ✅
   - Screenshot captures automatically ✅
   - Uploads to IPFS via Pinata ✅
   - NFT mints to your wallet ✅

## 🛑 Stop Testing

```bash
./scripts/stop-local-testing.sh
```

## ✅ Benefits of Local Testing

- **No real ETH required** - Uses fake ETH from Hardhat
- **No real payments** - Fake USDC transactions
- **Fast testing** - Local network is instant
- **Free to test** - No gas fees
- **Full functionality** - Complete NFT flow works
- **Easy debugging** - All logs visible locally

## 📋 What You Need

### **Required (for full testing)**
- Grok AI API key (for game generation)
- Pinata API keys (for IPFS storage)
- MetaMask installed

### **Not Required**
- Real ETH ❌
- Real Base network ❌
- Real payments ❌

## 🔧 Environment Variables

Make sure your `.env.local` has:
```bash
# AI Game Generation
NEXT_PUBLIC_GROK_API_KEY=your-grok-api-key

# IPFS Storage
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key

# Local Testing (set automatically by script)
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NFT_MINTER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

## 🎯 Success Indicators

You'll know it's working when you see:

### **In Terminal:**
- ✅ Hardhat node started
- ✅ Contract deployed
- ✅ Development server running

### **In Browser Console:**
- ✅ `📸 [Screenshot] Capturing game screenshot...`
- ✅ `🎨 [NFT Service] Starting NFT minting flow...`
- ✅ `✅ [NFT Service] NFT minted successfully!`

### **In MetaMask:**
- ✅ NFT appears in your wallet
- ✅ Transaction history shows the mint

## 🐛 Troubleshooting

### "Port 8545 already in use"
```bash
./scripts/stop-local-testing.sh
./scripts/start-local-testing.sh
```

### "Contract not deployed"
- Make sure Hardhat node is running
- Check that the script completed successfully
- Try restarting: `./scripts/start-local-testing.sh`

### "Wallet connection failed"
- Make sure MetaMask is configured for Hardhat Local network
- Check Chain ID is `31337`
- Verify RPC URL is `http://localhost:8545`

### "Screenshot capture failed"
- Check browser console for detailed errors
- Make sure the game loaded properly
- Try with a simpler game prompt

### "IPFS upload failed"
- Verify Pinata API keys in `.env.local`
- Check your Pinata account is active
- Try testing Pinata connection separately

## 📚 More Documentation

- **Full Setup Guide**: `docs/LOCAL_DEVELOPMENT_GUIDE.md`
- **NFT Quick Start**: `docs/NFT_QUICK_START.md`
- **Environment Setup**: `docs/ENV_SETUP_README.md`

---

**Ready to test?** Run `./scripts/start-local-testing.sh` and start testing! 🚀
