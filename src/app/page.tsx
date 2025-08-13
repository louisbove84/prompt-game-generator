'use client';

import { useState } from 'react';

export default function Home() {
  const [gamePrompt, setGamePrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateGame = async () => {
    if (!gamePrompt.trim()) return;
    
    setIsGenerating(true);
    // TODO: Implement AI game generation logic
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Coming soon! Your prompt: "${gamePrompt}"`);
    }, 2000);
  };

  const playExistingGame = (gameType: 'runner' | 'spaceinvaders') => {
    window.location.href = `/frame?game=${gameType}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
                  <span>Generate Game</span>
                </div>
              )}
            </button>
          </div>
        </div>

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
    </div>
  );
}
