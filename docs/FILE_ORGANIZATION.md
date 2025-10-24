# 📁 File Organization Guide

## Directory Structure

### 🏠 Root Level
```
prompt-game-generator/
├── src/                   # Source code (production)
├── public/                # Static assets
├── docs/                  # Documentation
├── deployment/            # Smart contract deployment
├── package.json           # Dependencies
├── next.config.js         # Next.js config
├── vercel.json           # Vercel config
└── .env.local            # Environment variables
```

### 📁 Source Code (`src/`)
**Purpose**: Main application code for production
**Usage**: Both local testing and production deployment

```
src/
├── app/                   # Next.js App Router
│   ├── api/              # API routes (serverless functions)
│   │   ├── generate-game/    # Game generation API
│   │   ├── ipfs/            # IPFS upload APIs
│   │   └── nft/             # NFT minting APIs
│   ├── frame/            # Farcaster frame page
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main application page
├── components/           # React components
│   ├── games/           # Game-related components
│   │   ├── DynamicGameLoader.tsx  # Game loader
│   │   ├── SpaceInvadersGame.tsx # Space invaders
│   │   └── ThisIsFineGame.tsx    # Runner game
│   └── payments/         # Payment components
│       ├── WalletConnect.tsx     # Wallet connection
│       ├── PaymentModal.tsx     # Payment modal
│       └── SimpleWalletProvider.tsx # Wallet provider
├── services/             # Business logic
│   ├── grokAPI.ts       # Grok AI integration
│   ├── ipfs.ts         # IPFS service
│   └── nft.ts          # NFT service
└── constants/           # Configuration
    └── site.ts         # Site constants
```

### 📁 Deployment (`deployment/`)
**Purpose**: Smart contract deployment and testing
**Usage**: Deploy contracts to Base network

```
deployment/
├── contracts/            # Smart contracts
│   └── GameNFT.sol      # ERC721 NFT contract
├── scripts/             # Deployment scripts
│   ├── deploy-to-base.js    # Deploy to Base
│   ├── mint-to-base.js      # Mint on Base
│   ├── verify.js            # Contract verification
│   └── test-full-ipfs-nft.js # Full test
├── hardhat.config.js    # Hardhat configuration
├── package.json         # Hardhat dependencies
└── deployment-info.json # Deployment results
```

### 📁 Documentation (`docs/`)
**Purpose**: Project documentation and guides
**Usage**: Reference for development and deployment

```
docs/
├── local-testing/       # Local development
│   └── LOCAL_TESTING_GUIDE.md
├── deployment/          # Deployment guides
│   └── DEPLOYMENT_GUIDE.md
├── production/          # Production overview
│   └── PRODUCTION_OVERVIEW.md
└── [other guides]      # Various documentation
```

## File Categories

### 🟢 Production Files
**Used in**: Both local testing and production deployment
- `src/` - All source code
- `public/` - Static assets
- `package.json` - Dependencies
- `next.config.js` - Next.js config
- `vercel.json` - Vercel config
- `.env.local` - Environment variables

### 🟡 Deployment Files
**Used in**: Smart contract deployment only
- `deployment/` - Entire directory
- `deployment/contracts/GameNFT.sol` - NFT contract
- `deployment/scripts/` - Deployment scripts
- `deployment/hardhat.config.js` - Hardhat config

### 🔵 Documentation Files
**Used in**: Reference and guides
- `docs/` - All documentation
- `README.md` - Project overview
- `env.example` - Environment template

### 🟠 Local Testing Files
**Used in**: Local development only
- `src/components/payments/WalletConnect.tsx` - Wallet UI
- `src/app/page.tsx` - Main page with wallet connection
- `src/app/frame/page.tsx` - Frame page with wallet connection

## Environment Files

### `.env.local` (Local Development)
```bash
# Grok AI API
NEXT_PUBLIC_GROK_API_KEY=your-key

# Base Network
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org

# NFT Contract
NEXT_PUBLIC_NFT_CONTRACT_ADDRESS=0xa6FCA1dEc2646e770cf4d87F7b7Cc6B5F3eA7375

# Pinata IPFS
PINATA_API_KEY=your-key
PINATA_SECRET_KEY=your-key

# NFT Minter
NFT_MINTER_PRIVATE_KEY=your-key
```

### `env.example` (Template)
```bash
# Copy to .env.local and fill in your values
NEXT_PUBLIC_GROK_API_KEY=your-grok-api-key-here
# ... (see env.example for full template)
```

## Development Workflow

### 🧪 Local Testing
1. Copy `env.example` to `.env.local`
2. Fill in environment variables
3. Run `npm run dev`
4. Test wallet connection
5. Test game generation
6. Test NFT minting

### 🚀 Deployment
1. Deploy smart contract: `cd deployment && npm run deploy:base`
2. Update contract address in `.env.local`
3. Deploy frontend: `vercel --prod`
4. Test production deployment

### 📝 Documentation
- Update guides in `docs/` as needed
- Keep `FILE_ORGANIZATION.md` current
- Document any new files or changes

## Key Files by Function

### Wallet Connection
- `src/components/payments/WalletConnect.tsx` - UI component
- `src/components/payments/SimpleWalletProvider.tsx` - Provider
- `src/app/providers.tsx` - App wrapper

### Game Generation
- `src/app/api/generate-game/route.ts` - API endpoint
- `src/services/grokAPI.ts` - Grok integration
- `src/components/games/DynamicGameLoader.tsx` - Game loader

### NFT Minting
- `src/app/api/nft/mint/route.ts` - Minting API
- `src/services/nft.ts` - NFT service
- `src/services/ipfs.ts` - IPFS service
- `deployment/contracts/GameNFT.sol` - Smart contract

### Screenshot Capture
- `src/components/games/DynamicGameLoader.tsx` - Capture logic
- `src/app/page.tsx` - Integration

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor Vercel deployment status
- Check Base network status
- Verify Pinata service status

### File Cleanup
- Remove unused components
- Clean up old documentation
- Archive old deployment scripts
- Update environment variables as needed
