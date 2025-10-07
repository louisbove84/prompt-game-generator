'use client';

import React from 'react';
import { BaseProvider } from '../components/payments';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BaseProvider>
      {children}
    </BaseProvider>
  );
}
