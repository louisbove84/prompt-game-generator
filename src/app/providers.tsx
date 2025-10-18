'use client';

import React from 'react';
import { SimpleWalletProvider } from '../components/payments';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SimpleWalletProvider>
      {children}
    </SimpleWalletProvider>
  );
}
