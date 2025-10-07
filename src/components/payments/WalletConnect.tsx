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
  const [showConnectors, setShowConnectors] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor;
      const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(mobile);
    };
    checkMobile();
  }, []);

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(true);
      await connect({ 
        connector,
        chainId: base.id // Force Base network
      });
      setShowConnectors(false);
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
      {!showConnectors ? (
        <button
          onClick={() => setShowConnectors(true)}
          disabled={isConnecting || isPending}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
        >
          {isMobile ? 'Connect Wallet' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="flex flex-col space-y-2 w-full max-w-sm">
          <p className="text-white text-sm text-center mb-2">
            {isMobile ? 'Choose your wallet:' : 'Connect with:'}
          </p>
          {connectors.map((connector) => (
            <button
              key={connector.id}
              onClick={() => handleConnect(connector)}
              disabled={isConnecting || isPending}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <span>
                {connector.name === 'WalletConnect' 
                  ? isMobile 
                    ? '📱 Choose Wallet' 
                    : '🔗 WalletConnect'
                  : `🔵 ${connector.name}`}
              </span>
            </button>
          ))}
          <button
            onClick={() => setShowConnectors(false)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      )}
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
