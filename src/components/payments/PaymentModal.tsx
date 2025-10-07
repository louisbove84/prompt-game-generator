'use client';

import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onPaymentSuccess }: PaymentModalProps) {
  const { address, isConnected } = useAccount();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const handlePayment = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Send 0.20 USDC (assuming 6 decimals) to a specific address
      // You'll need to replace this with your actual USDC contract address and recipient address
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
          '0xD2E7839C926A9A34987E3A862681Ca52fe63c4e6', // Your recipient address
          parseEther('0.20') // 0.20 USDC (6 decimals)
        ],
      });
    } catch (err) {
      console.error('Payment failed:', err);
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
      <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Payment Required</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
        
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
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Network:</span>
                <span className="text-blue-400">Base</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              disabled={isPending || isConfirming || isProcessing}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              {isPending ? 'Confirming...' : 
               isConfirming ? 'Processing...' : 
               isProcessing ? 'Completing...' : 
               'Pay $0.20 USDC'}
            </button>

            {error && (
              <div className="text-red-400 text-sm text-center">
                Payment failed: {error.message}
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
    </div>
  );
}
