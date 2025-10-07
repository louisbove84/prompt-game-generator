'use client';

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { coinbaseWallet, walletConnect } from 'wagmi/connectors';
import { OnchainKitProvider } from '@coinbase/onchainkit';

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

// Configure wagmi with Base as primary chain
const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    walletConnect({
      projectId,
      metadata,
      showQrModal: true, // Show QR on desktop, deep link on mobile
    }),
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

interface BaseProviderProps {
  children: React.ReactNode;
}

export function BaseProvider({ children }: BaseProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={process.env.NEXT_PUBLIC_BASE_API_KEY}
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
