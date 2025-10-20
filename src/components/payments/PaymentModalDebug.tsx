'use client';

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseUnits } from 'viem';

interface PaymentModalDebugProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentModalDebug({ isOpen, onClose, onPaymentSuccess }: PaymentModalDebugProps) {
  const { address, isConnected, chainId } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [usdcBalance, setUsdcBalance] = useState<string>('0');
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Debug info updates
  useEffect(() => {
    setDebugInfo({
      isConnected,
      address,
      chainId,
      chainIdHex: chainId ? `0x${chainId.toString(16)}` : 'N/A',
      isBase: chainId === 8453, // Base mainnet
      isPending,
      isConfirming,
      isSuccess,
      hash,
      error: error?.message
    });
  }, [isConnected, address, chainId, isPending, isConfirming, isSuccess, hash, error]);

  // Check USDC balance
  useEffect(() => {
    if (address && isConnected) {
      checkUSDCBalance();
    }
  }, [address, isConnected]);

  const checkUSDCBalance = async () => {
    try {
      // This would need to be implemented with proper contract calls
      // For now, just show placeholder
      setUsdcBalance('Checking...');
    } catch (err) {
      setUsdcBalance('Error');
    }
  };

  const handlePayment = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    if (chainId !== 8453) {
      alert('Please switch to Base network first');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('🚀 Starting payment...', {
        address,
        chainId,
        amount: '0.20 USDC'
      });

      // Send 0.20 USDC (assuming 6 decimals) to a specific address
      await writeContract({
        address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC on Base
        abi: [
          {
            name: 'transfer',
            type: 'function',
            stateMutability: 'nonpayable',
            inputs: [
              { name: 'to', type: 'address' },
              { name: 'amount', type: 'uint256' }
            ],
            outputs: [{ name: '', type: 'bool' }]
          }
        ],
        functionName: 'transfer',
        args: [
          '0x24595fadb36D3C4ddb27c00fEE5d3fDAD4093341', // Your recipient address
          parseUnits('0.20', 6) // 0.20 USDC (6 decimals)
        ],
      });

      console.log('✅ Payment transaction submitted');
    } catch (err) {
      console.error('❌ Payment failed:', err);
      alert(`Payment failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsProcessing(false);
    }
  };

  // Handle successful payment
  if (isSuccess && isProcessing) {
    setIsProcessing(false);
    onPaymentSuccess();
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Payment Required (Debug Mode)</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Section */}
          <div>
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🎮</div>
              <p className="text-gray-300 mb-4">
                Create your custom AI-generated game for just $0.20 USDC
              </p>
              <div className="bg-blue-900 bg-opacity-30 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-300">
                  💡 <strong>Free Demo Games Available!</strong><br/>
                  Try our pre-made games without payment
                </p>
              </div>
            </div>

            {!isConnected ? (
              <div className="text-center">
                <p className="text-red-400 mb-4">Please connect your wallet first</p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Amount:</span>
                    <span className="text-white font-bold">$0.20 USDC</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Network:</span>
                    <span className={chainId === 8453 ? "text-green-400" : "text-red-400"}>
                      {chainId === 8453 ? "Base ✅" : "Wrong Network ❌"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Your Balance:</span>
                    <span className="text-white font-bold">{usdcBalance} USDC</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isPending || isConfirming || isProcessing || chainId !== 8453}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {isPending ? 'Confirming...' : 
                   isConfirming ? 'Processing...' : 
                   isProcessing ? 'Completing...' : 
                   chainId !== 8453 ? 'Switch to Base Network' :
                   'Pay $0.20 USDC'}
                </button>

                {error && (
                  <div className="text-red-400 text-sm text-center p-3 bg-red-900 bg-opacity-30 rounded">
                    <strong>Payment failed:</strong><br/>
                    {error.message}
                  </div>
                )}

                {hash && (
                  <div className="text-blue-400 text-sm text-center p-3 bg-blue-900 bg-opacity-30 rounded">
                    <strong>Transaction submitted:</strong><br/>
                    <a 
                      href={`https://basescan.org/tx/${hash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline"
                    >
                      View on BaseScan
                    </a>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Debug Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">🔧 Debug Information</h3>
            <div className="bg-gray-800 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Connected:</span>
                <span className={isConnected ? "text-green-400" : "text-red-400"}>
                  {isConnected ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Address:</span>
                <span className="text-white font-mono text-xs">
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Chain ID:</span>
                <span className="text-white">{debugInfo.chainIdHex}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Base Network:</span>
                <span className={debugInfo.isBase ? "text-green-400" : "text-red-400"}>
                  {debugInfo.isBase ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction Status:</span>
                <span className="text-white">
                  {isPending ? "Pending" : isConfirming ? "Confirming" : isSuccess ? "Success" : "Ready"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">USDC Balance:</span>
                <span className="text-white">{usdcBalance}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-900 bg-opacity-30 rounded-lg">
              <h4 className="text-yellow-400 font-bold mb-2">💡 Common Issues:</h4>
              <ul className="text-yellow-300 text-xs space-y-1">
                <li>• Make sure you're on Base Network (Chain ID: 8453)</li>
                <li>• You need USDC on Base (not ETH or other tokens)</li>
                <li>• Check your wallet for pending transactions</li>
                <li>• Ensure you have ETH for gas fees</li>
                <li>• Try refreshing the page if stuck</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
