# Environment Variables Setup

## Quick Start

### For Your Own Use (Local Development)
You have two options to keep your API keys secure locally:

**Option 1: Use VERCEL_SETUP.md (Recommended - Already has your keys)**
- `VERCEL_SETUP.md` - Contains your actual API keys (gitignored ✅)
- This file is already set up with your keys
- Use this for reference when setting up Vercel or local dev

**Option 2: Use .env.local**
```bash
# Copy the example
cp env.example .env.local

# Edit and add your actual keys
nano .env.local
```

### For Git Repository (What Gets Committed)
These files are safe to commit and are templates for others:
- `env.example` - Template without real keys ✅
- `VERCEL_SETUP_TEMPLATE.md` - Template instructions without real keys ✅
- `ENV_SETUP_README.md` - This file (instructions) ✅

## File Overview

| File | Contains Real Keys? | Git Status | Purpose |
|------|---------------------|------------|---------|
| `VERCEL_SETUP.md` | ✅ YES | 🚫 Gitignored | Your personal reference with real keys |
| `VERCEL_SETUP_TEMPLATE.md` | ❌ No | ✅ Committed | Template for others/documentation |
| `.env.local` | ✅ YES | 🚫 Gitignored | Local development environment variables |
| `env.example` | ❌ No | ✅ Committed | Template for .env.local |

## How It Works

```
You (Local Development)
├── VERCEL_SETUP.md (your keys) 🔒
├── .env.local (your keys) 🔒
└── Use these for development

Git Repository
├── VERCEL_SETUP_TEMPLATE.md (no keys) ✅
├── env.example (no keys) ✅
└── Safe to commit and share

Vercel Deployment
└── Environment Variables (dashboard) 🔒
    Add your keys via Vercel dashboard
```

## Setup Steps

### 1. Local Development
Your `VERCEL_SETUP.md` already has your keys. To use them locally:

```bash
# Create .env.local from the template
cp env.example .env.local

# Edit and add your actual keys (copy from VERCEL_SETUP.md)
code .env.local
```

Add your actual API key values (get them from your VERCEL_SETUP.md file):
```
NEXT_PUBLIC_GROK_API_KEY=your-actual-grok-key-here
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your-actual-base-key-here
```

### 2. Vercel Deployment
Use the instructions in your `VERCEL_SETUP.md` to add environment variables to Vercel dashboard.

### 3. Verify Git Won't Commit Your Keys
```bash
# These should show as ignored:
git status

# Should NOT list:
# - VERCEL_SETUP.md
# - .env.local
```

## Security Checklist

- ✅ `VERCEL_SETUP.md` is gitignored
- ✅ `.env.local` is gitignored
- ✅ `VERCEL_SETUP_TEMPLATE.md` has placeholder keys only
- ✅ `env.example` has placeholder keys only
- ✅ Real keys only in local files (gitignored) or Vercel dashboard
- ✅ Code uses `process.env.NEXT_PUBLIC_GROK_API_KEY` (not hardcoded)

## If You Accidentally Commit Keys

If you accidentally commit your keys:

1. **Immediately rotate the API keys**
   - Grok: https://console.x.ai/
   - Base: https://docs.base.org/

2. **Remove from git history**
   ```bash
   # Remove the file from history
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch VERCEL_SETUP.md" \
     --prune-empty --tag-name-filter cat -- --all
   
   # Force push
   git push origin --force --all
   ```

3. **Update all deployments**
   - Update keys in Vercel dashboard
   - Update your local `.env.local`
   - Update your local `VERCEL_SETUP.md`

## Tips

1. **Never commit files with real keys**
   - Always check `git status` before committing
   - Use `git diff` to review changes

2. **Keep VERCEL_SETUP.md for reference**
   - It's your personal documentation
   - Handy for setting up new environments
   - Already gitignored, so it's safe

3. **Template files are for sharing**
   - Others can clone your repo safely
   - They'll use the templates to set up their own keys

4. **Vercel is the source of truth for production**
   - Production always uses Vercel dashboard values
   - Local `.env.local` is only for development

## Questions?

- **Q: Can I delete VERCEL_SETUP.md?**
  - A: No! Keep it for your reference. It's gitignored anyway.

- **Q: Should I commit VERCEL_SETUP_TEMPLATE.md?**
  - A: Yes! It's safe and helps others set up the project.

- **Q: What if I clone this repo on another machine?**
  - A: Copy your `VERCEL_SETUP.md` manually or create new `.env.local` from your keys.

- **Q: How do I share this project with someone?**
  - A: Just push to git normally. They'll use the template files to add their own keys.

