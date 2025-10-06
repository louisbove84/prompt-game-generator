'use client';

import React from 'react';
import { BaseProvider } from '../components/BaseProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <BaseProvider>
      {children}
    </BaseProvider>
  );
}
