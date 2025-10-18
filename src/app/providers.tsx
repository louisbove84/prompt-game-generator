'use client';

import React from 'react';
import { DynamicWalletProvider } from '../components/payments';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DynamicWalletProvider>
      {children}
    </DynamicWalletProvider>
  );
}
