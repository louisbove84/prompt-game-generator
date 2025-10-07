# Farcaster Configuration - Single Source of Truth

## Overview
To avoid maintaining duplicate configuration in multiple files, we use a **single source of truth** approach for Farcaster Mini App configuration.

## 📍 Single Source of Truth
**File**: `public/.well-known/farcaster.json`

This is the ONLY file you need to edit to update:
- Version number
- App name
- Button titles
- Descriptions
- URLs
- Images

## Why This File?
1. **Required by Farcaster**: This file MUST exist at `.well-known/farcaster.json` for Farcaster to recognize your Mini App
2. **Static JSON**: Can be easily read by both Node.js scripts and TypeScript
3. **No Duplication**: One place to update everything

## How to Update

### To Change Version (Force Farcaster Cache Refresh)
```json
{
  "miniapp": {
    "version": "3"  // ← Change this number
  }
}
```

### To Change Button Text
```json
{
  "miniapp": {
    "buttonTitle": "Your New Button Text"  // ← Max 32 characters
  }
}
```

### To Change Description
```json
{
  "miniapp": {
    "description": "Your new description"
  }
}
```

## Other Files (Reference Only)

### `src/constants/site.ts`
- Used for meta tags and TypeScript type safety
- Should match `farcaster.json` but is NOT the source of truth
- Has a comment indicating to update the JSON file

### `scripts/` folder
- No longer needed! The JSON file is manually edited
- Script was removed to simplify the workflow

## Workflow

1. **Edit**: `public/.well-known/farcaster.json`
2. **Commit & Push**: Git will pick up the changes
3. **Deploy**: Vercel automatically deploys
4. **Farcaster Refreshes**: Usually within minutes (version bump forces it)

## Important Notes

- ✅ **DO**: Edit `public/.well-known/farcaster.json` directly
- ❌ **DON'T**: Try to "generate" the JSON from TypeScript
- ✅ **DO**: Increment version number to force Farcaster cache refresh
- ❌ **DON'T**: Expect changes to show immediately (Farcaster caches)

## Validation

Simply check the JSON file is valid:
```bash
cat public/.well-known/farcaster.json | jq .
```

Or use any JSON validator online.

## Example: Updating Version

```bash
# 1. Edit the JSON file
nano public/.well-known/farcaster.json

# Change "version": "3" to "version": "4"

# 2. Commit
git add public/.well-known/farcaster.json
git commit -m "chore: bump Farcaster version to v4"

# 3. Push
git push origin main

# 4. Done! Vercel deploys automatically
```

## Troubleshooting

### Changes not showing in Farcaster?
- Increment the version number (forces cache refresh)
- Wait 5-10 minutes for Farcaster to refresh
- Check Farcaster validator: https://farcaster.xyz/~/developers/mini-apps/embed

### Getting validation errors?
- Check JSON syntax is valid (use `jq` or online validator)
- Ensure button title is ≤ 32 characters
- Verify all URLs start with `https://`
- Test at: https://farcaster.xyz/~/developers/mini-apps/embed

### TypeScript constants out of sync?
- This is OK! The JSON file is the source of truth
- TypeScript constants are just for reference
- Farcaster reads the JSON file directly

