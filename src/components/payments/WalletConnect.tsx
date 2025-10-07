'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { useState, useEffect } from 'react';

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if on mobile
    const checkMobile = () => {
      const mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || 
                     window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(true);
      await connect({ 
        connector,
        chainId: base.id // Force Base network
      });
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
    <div className="flex flex-col items-center space-y-3 w-full max-w-md">
      <div className="text-white text-center mb-2">
        <p className="text-lg font-semibold">Connect Wallet</p>
        <p className="text-xs text-gray-400 mt-1">
          {isMobile ? 'Select your mobile wallet' : 'Choose your wallet to continue'}
        </p>
      </div>

      {connectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => handleConnect(connector)}
          disabled={isConnecting || isPending || !connector.ready}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
        >
          <span>
            {isConnecting ? 'Connecting...' : 
             connector.name === 'Coinbase Wallet' ? '🔵 Coinbase Wallet' :
             connector.name === 'WalletConnect' ? '📱 WalletConnect' :
             connector.name === 'Injected' ? '🦊 Browser Wallet' :
             connector.name}
          </span>
        </button>
      ))}

      <div className="text-center mt-4">
        <p className="text-green-400 text-xs mb-1">
          🔒 Secure Connection
        </p>
        <p className="text-gray-400 text-xs">
          Your wallet is safe - no transactions without your approval
        </p>
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center mt-2">
          Connection failed: {error.message}
        </div>
      )}
    </div>
  );
}
