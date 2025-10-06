'use client';

import React, { useEffect, useState } from 'react';

interface DynamicGameLoaderProps {
  gameCode: string;
  onError?: (error: string) => void;
  onBack?: () => void;
}

/**
 * Dynamic Game Loader
 * 
 * Loads and runs AI-generated game code dynamically
 * WARNING: This uses eval() which can be dangerous in production
 * Only use with trusted, validated code
 */
const DynamicGameLoader: React.FC<DynamicGameLoaderProps> = ({ 
  gameCode, 
  onError,
  onBack 
}) => {
  const [GameComponent, setGameComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGame = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Transform the code to be executable
        // Remove 'use client' directive as it's not needed in runtime
        let executableCode = gameCode.replace(/['"]use client['"];?\s*/g, '');
        
        // Remove the export default statement and capture the component name
        const exportMatch = executableCode.match(/export default (\w+);?/);
        if (!exportMatch) {
          throw new Error('Could not find default export in game code');
        }
        const componentName = exportMatch[1];
        executableCode = executableCode.replace(/export default \w+;?/, '');
        
        // Create a function that returns the component
        const componentFactory = new Function(
          'React',
          'useState',
          'useEffect',
          'useRef',
          'useCallback',
          `
          ${executableCode}
          return ${componentName};
          `
        );

        // Execute the function with React hooks
        const Component = componentFactory(
          React,
          React.useState,
          React.useEffect,
          React.useRef,
          React.useCallback
        );

        setGameComponent(() => Component);
        setIsLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
        console.error('Game loading error:', err);
        setError(errorMessage);
        setIsLoading(false);
        onError?.(errorMessage);
      }
    };

    loadGame();
  }, [gameCode, onError]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-mono">Loading your game...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-red-900/50 border-2 border-red-500 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Error Loading Game</h2>
          <p className="text-red-200 mb-4">{error}</p>
          {onBack && (
            <button
              onClick={onBack}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!GameComponent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <p className="text-white text-xl font-mono">No game loaded</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-4 left-4 z-50 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
        >
          ← Back to Generator
        </button>
      )}
      <GameComponent />
    </div>
  );
};

export default DynamicGameLoader;

