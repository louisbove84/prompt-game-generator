# WalletConnect Setup Guide

## Overview
WalletConnect has been integrated to enable proper mobile wallet selection in Farcaster frames and mobile browsers. This allows users to choose from any installed crypto wallet on their mobile device (MetaMask, Trust Wallet, Rainbow, Coinbase Wallet, etc.).

## Quick Setup

### 1. Get Your WalletConnect Project ID

1. Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up or log in with your GitHub account
3. Create a new project
4. Name it "GameForge Hub" or similar
5. Copy your **Project ID**

### 2. Add to Environment Variables

**Local Development** (`.env.local`):
```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-actual-project-id-here
```

**Vercel Production**:
1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add:
   - **Key**: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - **Value**: Your Project ID from WalletConnect
   - **Environment**: Production, Preview, Development

### 3. Deploy

Once the environment variable is set in Vercel, the next deployment will have full WalletConnect support.

## How It Works

### Mobile Experience
1. User opens app in Farcaster or mobile browser
2. Clicks "Connect Wallet"
3. Sees list of connection options:
   - **📱 Choose Wallet** (WalletConnect) - Opens wallet selection
   - **🔵 Coinbase Wallet** - Direct Coinbase Wallet connection
4. If "Choose Wallet" is selected:
   - On mobile: Deep links to show installed wallets
   - User selects their preferred wallet (MetaMask, Trust, etc.)
   - Approves connection in the wallet app
   - Returns to GameForge with wallet connected

### Desktop Experience
1. User clicks "Connect Wallet"
2. Sees connection options:
   - **🔗 WalletConnect** - Shows QR code for mobile wallet
   - **🔵 Coinbase Wallet** - Browser extension connection
3. Can scan QR with mobile wallet or use browser extension

## Features

- ✅ **Multiple Wallet Support**: Users can choose any WalletConnect-compatible wallet
- ✅ **Mobile-First**: Optimized for mobile wallet selection
- ✅ **Base Network**: Automatically connects to Base network
- ✅ **Network Switching**: Prompts users to switch if on wrong network
- ✅ **Secure**: Uses industry-standard WalletConnect protocol
- ✅ **No Timeouts**: Proper mobile deep linking prevents connection timeouts

## Troubleshooting

### "Connection timeout" on mobile
- **Solution**: Ensure `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set in Vercel
- Verify the Project ID is valid at cloud.walletconnect.com

### Wallet doesn't appear in list
- WalletConnect shows only installed, compatible wallets
- User needs to have the wallet app installed on their device
- Wallet must support WalletConnect v2

### Still opens browser instead of wallet app
- This can happen if the WalletConnect Project ID is missing
- Check that the environment variable is deployed to Vercel
- Try clearing browser cache and reconnecting

## Additional Resources

- [WalletConnect Docs](https://docs.walletconnect.com/)
- [Wagmi Documentation](https://wagmi.sh/)
- [Base Network Docs](https://docs.base.org/)

## Cost

WalletConnect Cloud is **FREE** for up to:
- 1 million monthly requests
- 10,000 monthly active users

This should be more than sufficient for your app!

