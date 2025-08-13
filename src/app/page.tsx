'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to the frame page after a brief delay to show the splash
    const timer = setTimeout(() => {
      window.location.href = '/frame';
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">🎮</h1>
          <h2 className="text-4xl font-bold text-white mb-4">AI Game Generator</h2>
          <p className="text-blue-200 mb-4">Create custom games from your prompts!</p>
          <p className="text-gray-400 text-sm">Auto-deployed: {new Date().toLocaleString()}</p>
        </div>
        
        <div className="flex justify-center items-center space-x-2 mb-8">
          <div className="animate-bounce">🎯</div>
          <p className="text-gray-300">Loading games...</p>
          <div className="animate-bounce animation-delay-200">🎲</div>
        </div>
        
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
      </div>
    </div>
  );
}
