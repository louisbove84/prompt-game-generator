'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the BaseProvider with no SSR
const BaseProvider = dynamic(() => import('./BaseProvider').then(mod => ({ default: mod.BaseProvider })), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading wallet providers...</p>
    </div>
  </div>
});

interface SafeWalletProviderProps {
  children: React.ReactNode;
}

export function SafeWalletProvider({ children }: SafeWalletProviderProps) {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // If there's an error, render children without wallet providers
  if (hasError) {
    console.warn('Wallet provider failed to load, rendering without wallet functionality');
    return <div>{children}</div>;
  }

  // Don't render wallet providers until client-side
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <div onError={() => setHasError(true)}>
      <BaseProvider>
        {children}
      </BaseProvider>
    </div>
  );
}
