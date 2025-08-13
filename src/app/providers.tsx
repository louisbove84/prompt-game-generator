'use client';

import React from 'react';
import { MiniKitProvider } from '@farcaster/miniapp-sdk';
import { base } from 'viem/chains';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'snake',
          name: 'AI Game Generator',
          logo: 'https://prompt-game-generator.vercel.app/games/itsFine-200x200.jpg',
        },
      }}
    >
      {children}
    </MiniKitProvider>
  );
}
