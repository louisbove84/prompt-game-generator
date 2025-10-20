# 🎮 Game Architecture - Frame vs Browser

## Overview
This document explains the separation between Frame games (Farcaster) and Browser games (Web), ensuring they don't interfere with each other while maintaining code reusability.

## 📁 Directory Structure

```
src/
├── components/
│   ├── frame-games/          # 🎯 Simple games for Farcaster Frame
│   │   ├── index.ts
│   │   ├── SpaceInvadersGame.tsx
│   │   ├── ThisIsFineGame.tsx
│   │   └── DynamicGameLoader.tsx
│   │
│   ├── browser-games/        # 🚀 Sophisticated games for Browser
│   │   ├── index.ts
│   │   └── [future advanced games]
│   │
│   └── games/                # 📦 Shared/Legacy games
│       ├── DemoGames.tsx
│       ├── DynamicGameLoader.tsx
│       └── [shared components]
│
├── app/
│   ├── frame/                # Farcaster Frame version
│   │   └── page.tsx          → imports from frame-games/
│   │
│   └── page.tsx              # Browser version
│       └──                   → imports from browser-games/
```

## 🎯 Frame Games (`src/components/frame-games/`)

### Purpose
Lightweight, simple games optimized for Farcaster Frame environment.

### Characteristics
- ✅ **Lightweight** - Minimal bundle size
- ✅ **Simple graphics** - Works in iframe/frame
- ✅ **Fast loading** - Quick initialization
- ✅ **Mobile-friendly** - Touch controls
- ✅ **Low resource** - Works on all devices

### Current Games
1. **Space Invaders** - Classic arcade shooter
2. **This Is Fine** - Endless runner
3. **Dynamic Game Loader** - AI-generated games

### Usage
```typescript
// In /src/app/frame/page.tsx
import { 
  SpaceInvadersGame, 
  ThisIsFineGame, 
  DynamicGameLoader 
} from '../../components/frame-games';
```

### When to Add Games Here
- Simple mechanics
- 2D graphics
- No heavy dependencies
- Works well in frames
- Mobile-optimized

## 🚀 Browser Games (`src/components/browser-games/`)

### Purpose
Sophisticated, feature-rich games optimized for full browser experience.

### Characteristics
- ✅ **Advanced features** - Complex mechanics
- ✅ **Better graphics** - Advanced rendering
- ✅ **Larger games** - More content
- ✅ **Desktop-optimized** - Mouse/keyboard controls
- ✅ **Modern APIs** - WebGL, Web Audio, etc.

### Future Games (Examples)
1. **Advanced RPG** - Complex story-driven game
2. **Multiplayer 3D** - Real-time multiplayer
3. **Physics Simulator** - Advanced physics engine
4. **Strategy Game** - Complex AI and mechanics

### Usage
```typescript
// In /src/app/page.tsx
import { 
  DemoGames, 
  DynamicGameLoader 
} from '../components/browser-games';

// Future imports:
// import { AdvancedRPG, Multiplayer3DGame } from '../components/browser-games';
```

### When to Add Games Here
- Complex mechanics
- 3D graphics
- Heavy dependencies
- Desktop-focused
- Advanced features

## 📦 Shared/Legacy Games (`src/components/games/`)

### Purpose
Shared components and legacy games used by both versions.

### Current Contents
- `DemoGames.tsx` - Game selection component
- `DynamicGameLoader.tsx` - AI game loader
- Other shared utilities

### When to Add Here
- Shared components used by both
- Utility functions
- Common interfaces
- Legacy games (maintain for compatibility)

## 🔀 Import Paths

### Frame Version
```typescript
// File: /src/app/frame/page.tsx
import { SpaceInvadersGame, ThisIsFineGame, DynamicGameLoader } 
  from '../../components/frame-games';
```

### Browser Version
```typescript
// File: /src/app/page.tsx
import { DemoGames, DynamicGameLoader } 
  from '../components/browser-games';
```

### Shared Components
```typescript
// From anywhere
import { SomeSharedComponent } 
  from '../components/games';
```

## 🎨 Design Principles

### Separation of Concerns
1. **Frame games** - Optimized for Farcaster
2. **Browser games** - Optimized for web
3. **Shared code** - DRY principle

### Independence
- ✅ Frame changes don't affect browser
- ✅ Browser changes don't affect frame
- ✅ Each can evolve independently

### Code Reusability
- ✅ Shared utilities in `/games`
- ✅ Common interfaces
- ✅ Reusable components

## 🚀 Adding New Games

### Adding a Frame Game

1. **Create the game file**
```bash
touch src/components/frame-games/NewSimpleGame.tsx
```

2. **Export in index.ts**
```typescript
// src/components/frame-games/index.ts
export { default as NewSimpleGame } from './NewSimpleGame';
```

3. **Use in frame page**
```typescript
// src/app/frame/page.tsx
import { NewSimpleGame } from '../../components/frame-games';
```

### Adding a Browser Game

1. **Create the game file**
```bash
touch src/components/browser-games/AdvancedRPG.tsx
```

2. **Export in index.ts**
```typescript
// src/components/browser-games/index.ts
export { default as AdvancedRPG } from './AdvancedRPG';
```

3. **Use in browser page**
```typescript
// src/app/page.tsx
import { AdvancedRPG } from '../components/browser-games';
```

### Adding a Shared Component

1. **Create in shared games folder**
```bash
touch src/components/games/SharedUtility.tsx
```

2. **Export in index.ts**
```typescript
// src/components/games/index.ts
export { default as SharedUtility } from './SharedUtility';
```

3. **Use from anywhere**
```typescript
import { SharedUtility } from '../../components/games';
```

## 📊 Decision Matrix

| Feature | Frame Games | Browser Games | Shared |
|---------|-------------|---------------|--------|
| Simple mechanics | ✅ | ❌ | - |
| Complex mechanics | ❌ | ✅ | - |
| 2D graphics | ✅ | ✅ | - |
| 3D graphics | ❌ | ✅ | - |
| Mobile-first | ✅ | ❌ | - |
| Desktop-first | ❌ | ✅ | - |
| Lightweight | ✅ | ❌ | - |
| Feature-rich | ❌ | ✅ | - |
| Utilities | - | - | ✅ |
| Common logic | - | - | ✅ |

## 🔧 Maintenance

### Regular Tasks
1. **Review dependencies** - Ensure no cross-contamination
2. **Update imports** - Keep paths correct
3. **Document changes** - Update this file
4. **Test isolation** - Verify independence

### Migration Strategy
If you need to move a game:
1. Copy the file to new location
2. Update imports
3. Test thoroughly
4. Remove old file
5. Update documentation

## 📝 Examples

### Example: Frame Game
```typescript
// src/components/frame-games/SimpleShooter.tsx
export default function SimpleShooter() {
  // Lightweight, simple game logic
  // Optimized for mobile
  // Works in frames
  return <canvas>...</canvas>;
}
```

### Example: Browser Game
```typescript
// src/components/browser-games/AdvancedRPG.tsx
import * as THREE from 'three'; // Heavy dependency OK

export default function AdvancedRPG() {
  // Complex game logic
  // Advanced graphics
  // Desktop-optimized
  return <div>...</div>;
}
```

### Example: Shared Component
```typescript
// src/components/games/GameUtils.ts
export const calculateScore = (points: number) => {
  // Shared logic used by both
  return points * 100;
};
```

## 🎯 Best Practices

### DO ✅
- Keep frame games simple and lightweight
- Make browser games feature-rich
- Share common utilities
- Document dependencies
- Test both versions independently

### DON'T ❌
- Mix frame and browser game code
- Import heavy dependencies in frame games
- Duplicate shared utilities
- Break the separation of concerns
- Forget to update documentation

## 🚦 Testing

### Frame Games
```bash
# Test in Farcaster frame
npm run dev
# Navigate to http://localhost:3000/frame
```

### Browser Games
```bash
# Test in full browser
npm run dev
# Navigate to http://localhost:3000
```

### Both Versions
```bash
# Test independence
# Change a frame game → Browser should be unaffected
# Change a browser game → Frame should be unaffected
```

## 📚 Additional Resources

- [Farcaster Frame Docs](https://docs.farcaster.xyz)
- [React Game Development](https://reactgamedev.com)
- [Web Game Best Practices](https://web.dev/games)

---

**Last Updated**: 2025-01-20
**Maintainer**: Development Team

