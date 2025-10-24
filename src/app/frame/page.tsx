'use client';

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount } from 'wagmi';
import { SpaceInvadersGame, ThisIsFineGame, DynamicGameLoader } from '../../components/frame-games';
import { WalletConnect, PaymentModal } from '../../components/payments';
import { mintGameNFT } from '../../services/nft';
import { NFTSelector } from '../../components/nft';
import { NFTData } from '../../services/nftLoader';

export default function FramePage() {
  const { isConnected, address } = useAccount();
  const [gamePrompt, setGamePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gameType, setGameType] = useState<'none' | 'spaceinvaders' | 'runner'>('none');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [isMintingNFT, setIsMintingNFT] = useState(false);
  const [nftMinted, setNftMinted] = useState(false);
  const [nftResult, setNftResult] = useState<any>(null);
  const [currentGamePrompt, setCurrentGamePrompt] = useState<string>('');
  const [currentGameCode, setCurrentGameCode] = useState<string>('');
  const [showNFTSelector, setShowNFTSelector] = useState(false);
  const [loadedFromNFT, setLoadedFromNFT] = useState(false);

  useEffect(() => {
    // Call sdk.actions.ready() after the app is fully loaded
    (async () => {
      try {
        await sdk.actions.ready();
        console.log('SDK ready() called successfully on frame page');
      } catch (error) {
        console.error('SDK initialization error:', error);
      }
    })();

    // Check URL parameters to determine which game to show
    const urlParams = new URLSearchParams(window.location.search);
    const game = urlParams.get('game');
    
    if (game === 'runner') {
      setGameType('runner');
    } else if (game === 'spaceinvaders') {
      setGameType('spaceinvaders');
    }
  }, []);

  const handleGenerateGame = async () => {
    if (!gamePrompt.trim()) return;

    // Check if user has paid
    if (!hasPaid) {
      setShowPaymentModal(true);
      return;
    }

    // Save the prompt for NFT minting later
    setCurrentGamePrompt(gamePrompt);
    
    setIsGenerating(true);
    setError(null);
    setNftMinted(false);
    setGenerationStatus('🔍 Analyzing your prompt...');
    
    try {
      setTimeout(() => setGenerationStatus('🤖 Asking Grok AI to generate your game...'), 500);
      setTimeout(() => setGenerationStatus('⚙️ Grok is thinking and coding...'), 2000);
      setTimeout(() => setGenerationStatus('🎨 Designing game mechanics...'), 5000);
      setTimeout(() => setGenerationStatus('🎮 Building game components...'), 8000);
      setTimeout(() => setGenerationStatus('✨ Finalizing your game...'), 12000);

      // Call API route instead of direct Grok API
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt: gamePrompt,
          temperature: 0.7,
          gameType: 'frame', // Request frame-optimized game
        }),
      });
      
      const result = await response.json();
      
      if (result.success && result.gameCode) {
        setGenerationStatus('✅ Game generated! Loading...');
        setCurrentGameCode(result.gameCode); // Save game code for NFT
        setTimeout(() => setGeneratedGame(result.gameCode), 500);
      } else {
        setError(result.error || 'Failed to generate game');
        setGenerationStatus('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setGenerationStatus('');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBackToGenerator = () => {
    setGeneratedGame(null);
    setGameType('none');
    setError(null);
    setHasPaid(false); // Reset payment requirement
    setNftMinted(false);
    setNftResult(null);
    setCurrentGamePrompt('');
    setCurrentGameCode('');
    setLoadedFromNFT(false);
  };

  const handleNFTSelected = (nft: NFTData) => {
    console.log('🎮 [Frame] NFT selected:', nft.name);
    console.log('📝 [Frame] Game prompt:', nft.gamePrompt);
    console.log('💾 [Frame] Game code length:', nft.gameCode?.length || 0);
    
    if (nft.gameCode) {
      setCurrentGameCode(nft.gameCode);
      setCurrentGamePrompt(nft.gamePrompt || 'Loaded from NFT');
      setGeneratedGame(nft.gameCode);
      setLoadedFromNFT(true);
      setShowNFTSelector(false);
      setHasPaid(true); // Mark as paid since it's from an existing NFT
    } else {
      alert('This NFT does not contain game code.');
    }
  };

  const handleScreenshotCaptured = async (screenshot: Blob) => {
    console.log('📸 [Frame] handleScreenshotCaptured called!');
    console.log('👛 [Frame] Wallet address:', address || 'NOT CONNECTED');
    console.log('📊 [Frame] Screenshot size:', (screenshot.size / 1024).toFixed(2), 'KB');
    console.log('💰 [Frame] Has paid:', hasPaid);
    console.log('🎨 [Frame] NFT already minted:', nftMinted);
    console.log('🔄 [Frame] Loaded from NFT:', loadedFromNFT);
    
    // Don't mint NFT if this game was loaded from an existing NFT
    if (loadedFromNFT) {
      console.log('ℹ️ [Frame NFT] Game loaded from existing NFT, skipping mint');
      return;
    }
    
    if (!address) {
      console.error('❌ [Frame NFT] No wallet address found - wallet not connected!');
      alert('⚠️ Please connect your wallet to mint an NFT');
      return;
    }

    if (nftMinted || isMintingNFT) {
      console.log('ℹ️ [Frame NFT] NFT already minted or minting in progress');
      return;
    }

    console.log('📸 [Frame] Screenshot captured, starting NFT mint...');
    setIsMintingNFT(true);

    try {
      const result = await mintGameNFT(screenshot, address, currentGamePrompt, currentGameCode);
      
      if (result.success) {
        console.log('✅ [Frame] NFT minted successfully!');
        setNftMinted(true);
        setNftResult(result);
        
        // Show success notification
        const tokenInfo = result.tokenId ? `\nToken ID: ${result.tokenId}` : '';
        const message = `🎉 NFT Minted Successfully!\n\nYour game screenshot has been minted as an NFT and sent to your wallet!${tokenInfo}\n\nTransaction: ${result.transactionHash}\n\nView on BaseScan: ${result.nftViewUrl}\n\nNote: It may take a few minutes for OpenSea to index your NFT.`;
        alert(message);
      } else {
        console.error('❌ [Frame] NFT minting failed:', result.error);
        // Don't show error to user, just log it - they already got their game
      }
    } catch (error) {
      console.error('❌ [Frame] Exception during NFT mint:', error);
    } finally {
      setIsMintingNFT(false);
    }
  };

  const handlePaymentSuccess = () => {
    setHasPaid(true);
    setShowPaymentModal(false);
  };

  const playExistingGame = (game: 'runner' | 'spaceinvaders') => {
    setGameType(game);
  };

  // Show generated game if available
  if (generatedGame) {
    return (
      <div className="relative">
        {isMintingNFT && (
          <div className="fixed top-4 right-4 z-50 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Minting your NFT...</span>
          </div>
        )}
        {nftMinted && nftResult && (
          <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-start space-x-2">
              <span className="text-2xl">🎉</span>
              <div className="flex-1">
                <div className="font-bold mb-1">NFT Minted!</div>
                <div className="text-sm space-y-1">
                  <div>
                    <a 
                      href={nftResult.nftViewUrl || nftResult.explorerUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-green-200 font-medium"
                    >
                      View on BaseScan →
                    </a>
                  </div>
                  {nftResult.openseaUrl && nftResult.tokenId && (
                    <div>
                      <a 
                        href={nftResult.openseaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="underline hover:text-green-200"
                      >
                        View on OpenSea →
                      </a>
                      <span className="text-xs block text-green-100">
                        (may take a few minutes to index)
                      </span>
                    </div>
                  )}
                  {nftResult.tokenId && (
                    <div className="text-xs text-green-100">
                      Token ID: {nftResult.tokenId}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <DynamicGameLoader 
          gameCode={generatedGame} 
          onBack={handleBackToGenerator}
          captureScreenshot={hasPaid && !nftMinted}
          onScreenshotCaptured={handleScreenshotCaptured}
          onError={(err) => {
            setError(err);
            setGeneratedGame(null);
          }}
          isMintingNFT={isMintingNFT}
          onMintingStateChange={setIsMintingNFT}
        />
      </div>
    );
  }

  // Show game if a game type is selected
  if (gameType === 'runner') {
    return <ThisIsFineGame />;
  }

  if (gameType === 'spaceinvaders') {
    return <SpaceInvadersGame />;
  }

  // Default: Show prompt interface (same as main page)
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Wallet Connection */}
        <div className="flex justify-center mb-6">
          <WalletConnect />
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">🎮</h1>
          <h2 className="text-5xl font-bold text-white mb-4">AI Game Generator</h2>
          <p className="text-blue-200 text-xl">Create custom games from your imagination!</p>
        </div>

        {/* Game Prompt Section */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-12 border border-white/20">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            ✨ Describe Your Dream Game
          </h3>
          
          <div className="space-y-4">
            <textarea
              value={gamePrompt}
              onChange={(e) => setGamePrompt(e.target.value)}
              placeholder="Example: A space adventure where you dodge asteroids while collecting power-ups, with retro pixel graphics and electronic music..."
              className="w-full h-32 p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              maxLength={500}
            />
            
            <div className="flex justify-between items-center text-sm text-gray-300">
              <span>Be creative! Describe gameplay, visuals, theme, etc.</span>
              <span>{gamePrompt.length}/500</span>
            </div>
            
            <button
              onClick={handleGenerateGame}
              disabled={!gamePrompt.trim() || isGenerating}
              className="w-full py-4 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-pink-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Generating Your Game...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>🚀</span>
                  <span>{hasPaid ? 'Generate Game' : 'Pay $0.20 USDC to Unlock Generation'}</span>
                </div>
              )}
            </button>
            
            {generationStatus && (
              <div className="mt-4 p-4 bg-blue-900/50 border border-blue-500 rounded-lg">
                <p className="text-blue-200 text-sm text-center">{generationStatus}</p>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Load NFT Games Section */}
        {isConnected && (
          <div className="text-center mb-12">
            <button
              onClick={() => setShowNFTSelector(true)}
              className="bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 border border-white/20 shadow-lg"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">🎨</span>
                <div>
                  <div className="text-lg">Load Your Game NFTs</div>
                  <div className="text-sm text-purple-100">Play games you've created before</div>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Existing Games Section */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">
            🎯 Or Try These Existing Games
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* This Is Fine Game */}
            <button
              onClick={() => playExistingGame('runner')}
              className="group bg-gradient-to-br from-orange-500 to-red-600 p-6 rounded-2xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              <div className="text-4xl mb-3">🔥</div>
              <h4 className="text-xl font-bold text-white mb-2">This Is Fine</h4>
              <p className="text-orange-100 text-sm">
                Navigate through chaos while everything burns around you!
              </p>
            </button>

            {/* Space Invaders Game */}
            <button
              onClick={() => playExistingGame('spaceinvaders')}
              className="group bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-2xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 border border-white/20"
            >
              <div className="text-4xl mb-3">🚀</div>
              <h4 className="text-xl font-bold text-white mb-2">Space Invaders</h4>
              <p className="text-cyan-100 text-sm">
                Classic arcade action - defend Earth from alien invasion!
              </p>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p className="text-sm">Powered by AI • Built with Next.js • Deployed on Vercel</p>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      {/* NFT Selector Modal */}
      <NFTSelector
        isOpen={showNFTSelector}
        onClose={() => setShowNFTSelector(false)}
        onNFTSelected={handleNFTSelected}
      />
    </div>
  );
}

// Required for Farcaster Mini Apps - forces dynamic rendering
export const dynamic = 'force-dynamic';