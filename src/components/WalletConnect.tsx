'use client';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { useState } from 'react';

// Create connector outside component to avoid recreation
const coinbaseConnector = coinbaseWallet({
  appName: 'AI Game Generator',
  appLogoUrl: 'https://www.beuxbunk.com/images/gameForgeLoading.jpg',
});

export function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      await connect({ connector: coinbaseConnector });
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isConnected && address) {
    return (
      <div className="flex items-center space-x-4">
        <div className="text-white">
          <div className="text-sm text-gray-300">Connected as:</div>
          <div className="font-mono text-sm">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <button
        onClick={handleConnect}
        disabled={isConnecting || isPending}
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
      >
        {isConnecting ? 'Connecting...' : 'Connect Coinbase Wallet'}
      </button>
      <div className="text-center">
        <p className="text-green-400 text-xs mb-1">
          🔒 Secure Connection
        </p>
        <p className="text-gray-400 text-xs">
          Your wallet is safe - no transactions without your approval
        </p>
      </div>
      {error && (
        <div className="text-red-400 text-sm text-center">
          Connection failed: {error.message}
        </div>
      )}
    </div>
  );
}
