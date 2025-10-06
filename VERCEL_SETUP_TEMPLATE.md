# Vercel Environment Variables Setup

This guide shows you how to securely configure your API keys in Vercel instead of hardcoding them.

## Required Environment Variables

### 1. Grok AI API Key (Required for Game Generation)
- **Variable Name**: `NEXT_PUBLIC_GROK_API_KEY`
- **Value**: `xai-your-grok-api-key-here`
- **Description**: API key for Grok AI to generate games
- **Get it from**: https://console.x.ai/

### 2. Base OnchainKit API Key (Required for Wallet Connection)
- **Variable Name**: `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
- **Value**: `your-base-api-key-here`
- **Description**: API key for Base network integration
- **Get it from**: https://docs.base.org/

### 3. Base RPC URLs (Optional)
- **Variable Name**: `NEXT_PUBLIC_BASE_RPC_URL`
- **Value**: `https://mainnet.base.org`
- **Description**: RPC endpoint for Base Mainnet

- **Variable Name**: `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`
- **Value**: `https://sepolia.base.org`
- **Description**: RPC endpoint for Base Sepolia testnet

## Setup Instructions

### Option 1: Vercel Dashboard (Recommended)

1. **Go to your Vercel project**
   - Visit: https://vercel.com/dashboard
   - Select your `prompt-game-generator` project

2. **Navigate to Settings**
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

3. **Add Each Variable**
   For each variable above:
   - Click "Add New" button
   - Enter the **Variable Name** (e.g., `NEXT_PUBLIC_GROK_API_KEY`)
   - Enter the **Value** (your API key)
   - Select environments:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on the latest deployment
   - Click "Redeploy"
   - This ensures the new environment variables are loaded

### Option 2: Vercel CLI

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Add environment variables
vercel env add NEXT_PUBLIC_GROK_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development (all)

vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY
# Paste your API key when prompted
# Select: Production, Preview, Development (all)

# Pull environment variables to local .env.local
vercel env pull .env.local

# Redeploy
vercel --prod
```

## Local Development Setup

1. **Copy the example file**
   ```bash
   cp env.example .env.local
   ```

2. **Edit `.env.local`**
   ```bash
   # Open in your editor
   nano .env.local
   # or
   code .env.local
   ```

3. **Add your actual API keys**
   ```
   NEXT_PUBLIC_GROK_API_KEY=xai-your-actual-key-here
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-actual-key-here
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
   ```

4. **Restart your dev server**
   ```bash
   npm run dev
   ```

## Verify Setup

### Check in Browser Console
When the app loads, it should show:
```javascript
// In the Network tab, check the request to Grok API
// The Authorization header should contain your API key
```

### Check Build
```bash
npm run build
```
Should complete without errors.

### Test Game Generation
1. Open the app
2. Enter a game prompt
3. Click "Generate Game"
4. Should successfully generate a game

If you see: "Grok API key is not configured", the environment variable is not loaded.

## Security Notes

### ⚠️ About NEXT_PUBLIC_ Prefix

Variables with `NEXT_PUBLIC_` prefix are **exposed to the browser**. This means:
- ✅ Can be used in client-side code
- ⚠️ Visible in browser DevTools
- ⚠️ Visible in page source

For production apps, consider:
1. **Server-side API route** (More secure):
   - Create `/api/generate-game` route
   - Keep API key server-side only (no `NEXT_PUBLIC_` prefix)
   - Client calls your API, not Grok directly
   
2. **Rate limiting**:
   - Implement rate limiting to prevent abuse
   - Track usage per user/IP
   
3. **API key rotation**:
   - Rotate keys periodically
   - Monitor usage on Grok dashboard

## Troubleshooting

### Error: "API key is not configured"
- Check variable name is exactly: `NEXT_PUBLIC_GROK_API_KEY`
- Verify it's added in Vercel dashboard
- Redeploy after adding variables
- For local dev, check `.env.local` exists and has the key

### Error: "Network error"
- Check Grok API status
- Verify API key is valid
- Check firewall/network settings

### Environment variable not updating
- Redeploy in Vercel
- For local: Restart dev server
- Clear browser cache
- Check you're not mixing production/preview/development environments

## Additional Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Grok API Documentation](https://docs.x.ai/)
- [Base Documentation](https://docs.base.org/)

## Quick Reference

```bash
# View all environment variables
vercel env ls

# Remove an environment variable
vercel env rm NEXT_PUBLIC_GROK_API_KEY

# Pull latest environment variables
vercel env pull

# Deploy with environment variables
vercel --prod
```

---

**Note**: This is a template file. Copy it to `VERCEL_SETUP.md` and add your actual API keys there. The `VERCEL_SETUP.md` file is gitignored to keep your keys secure.

