'use client';

import React, { useState, useEffect } from 'react';

interface GameSelectionScreenProps {
  onSelectGame: (game: 'spaceinvaders' | 'runner') => void;
}

const GameSelectionScreen: React.FC<GameSelectionScreenProps> = ({ onSelectGame }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile (no SDK initialization here)
    const updateDimensions = () => {
      const mobile = window.innerWidth <= 768 || 'ontouchstart' in window;
      setIsMobile(mobile);
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 ${isMobile ? 'p-4' : 'p-8'} flex items-center justify-center`}>
      <div className="text-center max-w-md">
        <h1 className="text-3xl lg:text-5xl font-bold text-white mb-6 font-mono">
          MEME GAMES HUB
        </h1>
        <p className="text-lg text-blue-300 mb-12 font-mono">
          Choose Your Chaos! 🎮
        </p>
        
        <div className="flex flex-col gap-6">
          <button
            onClick={() => onSelectGame('spaceinvaders')}
            className="bg-red-500 text-white px-8 py-6 rounded-lg font-mono font-bold text-xl hover:bg-red-600 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            🚀 SPACE INVADERS
          </button>
          
          <button
            onClick={() => onSelectGame('runner')}
            className="bg-green-500 text-white px-8 py-6 rounded-lg font-mono font-bold text-xl hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            🔥 THIS IS FINE
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mt-8 font-mono">
          Classic arcade action vs. endless runner survival
        </p>
      </div>
    </div>
  );
};

export default GameSelectionScreen;