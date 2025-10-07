'use client';

import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi';
import { base } from 'wagmi/chains';
import { useState, useEffect } from 'react';

export function WalletConnect() {
  const { address, isConnected, chainId } = useAccount();
  const { connectors, connect, error, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const [showModal, setShowModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Debug: Log connectors
  useEffect(() => {
    console.log('Available connectors:', connectors.map(c => ({ 
      name: c.name, 
      id: c.id, 
      ready: c.ready 
    })));
  }, [connectors]);

  const handleConnectClick = () => {
    setShowModal(true);
  };

  const handleConnect = async (connector: any) => {
    try {
      setIsConnecting(true);
      console.log('🔌 Attempting to connect with:', connector.name, connector.id);
      console.log('Connector ready?', connector.ready);
      console.log('Chain ID:', base.id);
      
      const result = await connect({ 
        connector,
        chainId: base.id
      });
      
      console.log('✅ Connection result:', result);
      setShowModal(false);
    } catch (err: any) {
      console.error('❌ Connection failed:', err);
      console.error('Error details:', {
        message: err.message,
        code: err.code,
        details: err.details
      });
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

  // Get Coinbase Wallet connector
  const coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet');

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
    <>
      {/* Single Connect Button */}
      <div className="flex flex-col items-center space-y-2">
        <button
          onClick={handleConnectClick}
          disabled={isPending}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors font-medium"
        >
          Connect Wallet
        </button>
        <div className="text-center">
          <p className="text-green-400 text-xs mb-1">
            🔒 Secure Connection
          </p>
          <p className="text-gray-400 text-xs">
            Your wallet is safe - no transactions without your approval
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div 
            className="bg-gray-900 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-3">
              {coinbaseConnector ? (
                <>
                  <button
                    onClick={() => handleConnect(coinbaseConnector)}
                    disabled={isConnecting || !coinbaseConnector.ready}
                    className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors font-medium flex items-center justify-center space-x-3"
                  >
                    <span className="text-2xl">🔵</span>
                    <span>{isConnecting ? 'Connecting...' : 'Coinbase Wallet'}</span>
                  </button>
                  {!coinbaseConnector.ready && (
                    <div className="text-xs text-yellow-400 text-center">
                      Wallet not detected - make sure Coinbase Wallet is installed
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No wallets available. Connectors: {connectors.length}
                  <br />
                  <span className="text-xs">
                    {connectors.map(c => c.name).join(', ') || 'None'}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-4 text-center text-xs text-gray-500">
              Connect your wallet to create games with USDC payments
            </div>

            {error && (
              <div className="mt-4 text-red-400 text-sm text-center">
                {error.message}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
