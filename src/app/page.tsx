'use client';

import { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount } from 'wagmi';
import { WalletConnect, PaymentModal } from '../components/payments';
import { DemoGames, DynamicGameLoader } from '../components/games';

export default function Home() {
  const { isConnected } = useAccount();
  const [gamePrompt, setGamePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedGame, setGeneratedGame] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);

  // Debug log for payment status
  useEffect(() => {
    console.log('💰 Payment Status:', hasPaid ? 'PAID ✅' : 'NOT PAID ❌');
  }, [hasPaid]);

  useEffect(() => {
    // Call sdk.actions.ready() after the app is fully loaded and ready to display
    (async () => {
      try {
        await sdk.actions.ready();
        console.log('SDK ready() called successfully');
      } catch (error) {
        console.error('SDK initialization error:', error);
      }
    })();
  }, []);

  const handleGenerateGame = async () => {
    if (!gamePrompt.trim()) {
      console.warn('⚠️ [Main] Empty prompt, aborting');
      return;
    }

    // Check if user has paid
    if (!hasPaid) {
      setShowPaymentModal(true);
      return;
    }
    
    console.log('🚀 [Main] Starting game generation...');
    console.log('📝 [Main] Prompt:', gamePrompt);
    
    setIsGenerating(true);
    setError(null);
    setGenerationStatus('🔍 Analyzing your prompt...');
    
    try {
      console.log('⏱️ [Main] Calling generateGame API...');
      const startTime = Date.now();
      
      // Simulate progress updates
      setTimeout(() => setGenerationStatus('🤖 Asking Grok AI to generate your game...'), 500);
      setTimeout(() => setGenerationStatus('⚙️ Grok is thinking and coding...'), 2000);
      setTimeout(() => setGenerationStatus('🎨 Designing game mechanics...'), 5000);
      setTimeout(() => setGenerationStatus('🎮 Building game components...'), 8000);
      setTimeout(() => setGenerationStatus('✨ Finalizing your game...'), 12000);
      
      // Call our API route (server-side) instead of Grok directly to avoid CORS
      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt: gamePrompt,
          temperature: 0.7,
        }),
      });
      
      const result = await response.json();
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      console.log(`⏱️ [Main] API call completed in ${duration}s`);
      
      if (result.success && result.gameCode) {
        console.log('✅ [Main] Game generated successfully!');
        console.log('📊 [Main] Tokens used:', result.tokensUsed);
        console.log('📦 [Main] Code size:', result.gameCode.length, 'chars');
        setGenerationStatus('✅ Game generated! Loading...');
        setTimeout(() => setGeneratedGame(result.gameCode), 500);
      } else {
        console.error('❌ [Main] Generation failed:', result.error);
        setError(result.error || 'Failed to generate game');
        setGenerationStatus('');
      }
    } catch (err) {
      console.error('❌ [Main] Exception caught:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
      setGenerationStatus('');
    } finally {
      setIsGenerating(false);
      console.log('🏁 [Main] Generation process completed');
    }
  };

  const handleBackToGenerator = () => {
    setGeneratedGame(null);
    setError(null);
    setHasPaid(false); // Reset payment requirement
  };

  const handlePaymentSuccess = () => {
    setHasPaid(true);
    setShowPaymentModal(false);
    // Payment successful - user can now click generate button
  };

  const playExistingGame = (gameType: 'runner' | 'spaceinvaders') => {
    window.location.href = `/frame?game=${gameType}`;
  };

  // If game is generated, show it
  if (generatedGame) {
    return (
      <DynamicGameLoader 
        gameCode={generatedGame}
        onBack={handleBackToGenerator}
      />
    );
  }

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
                <p className="text-blue-200 text-sm animate-pulse">{generationStatus}</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Demo Games Section */}
        <DemoGames onPlayGame={playExistingGame} />

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
    </div>
  );
}