'use client';

import React from 'react';
import { SafeWalletProvider } from '../components/payments';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SafeWalletProvider>
      {children}
    </SafeWalletProvider>
  );
}
