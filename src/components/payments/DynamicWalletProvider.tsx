'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import the BaseProvider to avoid SSR issues
const BaseProvider = dynamic(() => import('./BaseProvider').then(mod => ({ default: mod.BaseProvider })), {
  ssr: false,
  loading: () => <div>Loading wallet providers...</div>
});

interface DynamicWalletProviderProps {
  children: React.ReactNode;
}

export function DynamicWalletProvider({ children }: DynamicWalletProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render wallet providers until client-side
  if (!isClient) {
    return <div>{children}</div>;
  }

  return (
    <BaseProvider>
      {children}
    </BaseProvider>
  );
}
