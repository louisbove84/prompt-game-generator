'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { coinbaseWallet } from 'wagmi/connectors';
import { base } from 'wagmi/chains';
import { useState, useEffect } from 'react';

// Create connector outside component to avoid recreation
const coinbaseConnector = coinbaseWallet({
  appName: 'AI Game Generator',
  appLogoUrl: 'https://www.beuxbunk.com/images/gameForgeLoading.jpg',
});

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount();
  const { connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      
      // On mobile, use deep link to Coinbase Wallet app
      if (isMobile) {
        const dappUrl = window.location.href;
        const wcUri = `https://go.cb-w.com/dapp?cb_url=${encodeURIComponent(dappUrl)}`;
        window.location.href = wcUri;
      } else {
        // On desktop, use normal wagmi connection
        await connect({ 
          connector: coinbaseConnector,
          chainId: base.id // Force Base network
        });
      }
    } catch (err) {
      console.error('Connection failed:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchToBase = async () => {
    try {
      await switchChain({ chainId: base.id });
    } catch (err) {
      console.error('Failed to switch to Base:', err);
    }
  };

  if (isConnected && address) {
    const isOnBase = chainId === base.id;
    
    return (
      <div className="flex flex-col items-center space-y-3">
        <div className="text-white text-center">
          <div className="text-sm text-gray-300">Connected as:</div>
          <div className="font-mono text-sm">
            {`${address.slice(0, 6)}...${address.slice(-4)}`}
          </div>
          <div className={`text-xs mt-1 ${isOnBase ? 'text-green-400' : 'text-yellow-400'}`}>
            Network: {isOnBase ? 'Base ✅' : 'Wrong Network ⚠️'}
          </div>
        </div>
        
        {!isOnBase && (
          <button
            onClick={handleSwitchToBase}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
          >
            Switch to Base Network
          </button>
        )}
        
        <button
          onClick={() => disconnect()}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
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
        {isConnecting 
          ? 'Opening Wallet...' 
          : isMobile 
            ? 'Open Coinbase Wallet App' 
            : 'Connect Coinbase Wallet'}
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
