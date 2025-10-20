# 🎮 Quick Game Development Guide

## TL;DR

- **Frame games** (Farcaster) → `src/components/frame-games/`
- **Browser games** (Web) → `src/components/browser-games/`
- **Shared code** → `src/components/games/`

## Adding a New Game

### For Farcaster Frame (Simple Game)
```bash
# 1. Create the game
touch src/components/frame-games/MyGame.tsx

# 2. Export it
echo "export { default as MyGame } from './MyGame';" >> src/components/frame-games/index.ts

# 3. Use it in frame/page.tsx
# import { MyGame } from '../../components/frame-games';
```

### For Browser (Advanced Game)
```bash
# 1. Create the game
touch src/components/browser-games/MyAdvancedGame.tsx

# 2. Export it
echo "export { default as MyAdvancedGame } from './MyAdvancedGame';" >> src/components/browser-games/index.ts

# 3. Use it in page.tsx
# import { MyAdvancedGame } from '../components/browser-games';
```

## When to Use Each

| Choose Frame Games When... | Choose Browser Games When... |
|---|---|
| Building for Farcaster | Building for web browser |
| Simple mechanics | Complex mechanics |
| Mobile-focused | Desktop-focused |
| Lightweight | Feature-rich |
| 2D canvas | 3D graphics |
| Quick load time critical | Advanced features needed |

## File Structure Cheat Sheet

```
src/components/
  frame-games/      ← Farcaster (simple)
  browser-games/    ← Browser (advanced)
  games/            ← Shared utilities
```

## Import Paths

```typescript
// Frame page (/src/app/frame/page.tsx)
from '../../components/frame-games'

// Browser page (/src/app/page.tsx)
from '../components/browser-games'

// Shared from anywhere
from '../components/games'
```

## Testing

```bash
# Frame version
http://localhost:3000/frame

# Browser version
http://localhost:3000
```

---
See [GAME_ARCHITECTURE.md](./GAME_ARCHITECTURE.md) for complete details.

