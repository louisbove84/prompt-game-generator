'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { loadNFTsFromWallet, NFTData } from '../services/nftLoader';

interface NFTSelectorProps {
  isOpen: boolean;
  onNFTSelected: (nft: NFTData) => void;
  onClose: () => void;
}

const NFTSelector: React.FC<NFTSelectorProps> = ({ isOpen, onNFTSelected, onClose }) => {
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address) {
      loadNFTs();
    }
  }, [isConnected, address]);

  const loadNFTs = async () => {
    if (!address) return;

    setLoading(true);
    setError(null);

    try {
      const result = await loadNFTsFromWallet(address);
      if (result.success && result.nfts) {
        // Filter NFTs that have game code
        const gameNFTs = result.nfts.filter(nft => nft.gameCode);
        setNfts(gameNFTs);
        console.log('🎮 [NFT Selector] Found', gameNFTs.length, 'game NFTs');
      } else {
        setError(result.error || 'Failed to load NFTs');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleNFTSelect = (nft: NFTData) => {
    console.log('🎯 [NFT Selector] Selected NFT:', nft.name, 'Token ID:', nft.tokenId);
    onNFTSelected(nft);
  };

  if (!isOpen) {
    return null;
  }

  if (!isConnected) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Connect Wallet</h2>
          <p className="text-gray-600 mb-4">Please connect your wallet to load your game NFTs.</p>
          <button
            onClick={onClose}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-hidden mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Game NFTs</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading your NFTs...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">Error loading NFTs:</p>
            <p>{error}</p>
            <button
              onClick={loadNFTs}
              className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && nfts.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎮</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No Game NFTs Found</h3>
            <p className="text-gray-600 mb-4">
              You don't have any game NFTs yet. Generate a game to create your first NFT!
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        )}

        {!loading && !error && nfts.length > 0 && (
          <div className="overflow-y-auto max-h-96">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nfts.map((nft) => (
                <div
                  key={nft.tokenId}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleNFTSelect(nft)}
                >
                  <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    {nft.image ? (
                      <img
                        src={nft.image}
                        alt={nft.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-4xl">🎮</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1">{nft.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {nft.description}
                  </p>
                  {nft.gamePrompt && (
                    <p className="text-xs text-blue-600 mb-2">
                      <strong>Prompt:</strong> {nft.gamePrompt.substring(0, 50)}...
                    </p>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Token #{nft.tokenId}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNFTSelect(nft);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                    >
                      Play Game
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            Only NFTs with game code are shown. Generate games to create playable NFTs!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NFTSelector;
