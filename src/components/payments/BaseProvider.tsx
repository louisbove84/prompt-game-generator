'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { useState, useEffect } from 'react';

// Create a query client
const queryClient = new QueryClient();

// WalletConnect Project ID - Get from https://cloud.walletconnect.com
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

// Metadata for wallet connections
const metadata = {
  name: 'GameForge Hub',
  description: 'AI-powered game generator on Base',
  url: 'https://launch.beuxbunk.com',
  icons: ['https://www.beuxbunk.com/images/gameForgeLoading.jpg']
};

// Configure wagmi with Base as primary chain (client-side only)
let config: any = null;

if (typeof window !== 'undefined') {
  try {
    config = createConfig({
      chains: [base, baseSepolia],
      connectors: [
        coinbaseWallet({
          appName: metadata.name,
          appLogoUrl: metadata.icons[0],
        }),
        ...(projectId && projectId !== 'YOUR_PROJECT_ID' ? [
          walletConnect({
            projectId,
            metadata,
            showQrModal: true, // Show QR on desktop, deep link on mobile
          })
        ] : []),
      ],
      transports: {
        [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
        [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
      },
      ssr: true,
    });
  } catch (error) {
    console.warn('Failed to create wallet config:', error);
    // Fallback config without WalletConnect
    config = createConfig({
      chains: [base, baseSepolia],
      connectors: [
        coinbaseWallet({
          appName: metadata.name,
          appLogoUrl: metadata.icons[0],
        }),
      ],
      transports: {
        [base.id]: http(process.env.NEXT_PUBLIC_BASE_RPC_URL),
        [baseSepolia.id]: http(process.env.NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL),
      },
      ssr: true,
    });
  }
}

interface BaseProviderProps {
  children: React.ReactNode;
}

export function BaseProvider({ children }: BaseProviderProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render providers until client-side
  if (!isClient || !config) {
    return <div>{children}</div>;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
