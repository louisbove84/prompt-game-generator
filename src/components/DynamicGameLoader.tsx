'use client';

import React, { useEffect, useState } from 'react';
import * as Babel from '@babel/standalone';

interface DynamicGameLoaderProps {
  gameCode: string;
  onError?: (error: string) => void;
  onBack?: () => void;
}

/**
 * Dynamic Game Loader with Babel JSX Transformation
 * 
 * Loads and runs AI-generated game code dynamically
 * Uses Babel to transform JSX to executable JavaScript
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
        console.log('🎯 [Game Loader] Starting to load game...');
        console.log('📏 [Game Loader] Code length:', gameCode.length, 'chars');
        
        setIsLoading(true);
        setError(null);

        // Step 1: Remove 'use client' directive
        console.log('🧹 [Game Loader] Removing "use client" directive...');
        let code = gameCode.replace(/['"]use client['"];?\s*/g, '');
        
        // Step 2: Remove imports (we provide React directly)
        console.log('🧹 [Game Loader] Removing import statements...');
        code = code.replace(/import\s+.*?from\s+['"].*?['"];?\s*/g, '');
        
        // Step 3: Find and remove export default statement
        console.log('🔍 [Game Loader] Finding component export...');
        const exportMatch = code.match(/export default (\w+);?/);
        if (!exportMatch) {
          console.error('❌ [Game Loader] No default export found');
          throw new Error('Could not find default export in game code');
        }
        const componentName = exportMatch[1];
        console.log('✓ [Game Loader] Component name:', componentName);
        
        code = code.replace(/export default \w+;?/, '');
        
        // Step 4: Transform JSX + TypeScript with Babel
        console.log('🔄 [Game Loader] Transforming JSX + TypeScript with Babel...');
        const transformed = Babel.transform(code, {
          presets: [
            ['typescript', { allExtensions: true, isTSX: true }],
            'react'
          ],
          filename: 'game.tsx',
        });
        
        if (!transformed.code) {
          throw new Error('Babel transformation failed');
        }
        
        console.log('✓ [Game Loader] JSX transformed successfully!');
        console.log('📝 [Game Loader] Transformed code preview (first 500 chars):');
        console.log(transformed.code.substring(0, 500));
        
        // Step 5: Create a function that returns the component
        console.log('⚙️ [Game Loader] Creating component factory...');
        const componentFactory = new Function(
          'React',
          'useState',
          'useEffect',
          'useRef',
          'useCallback',
          `
          ${transformed.code}
          return ${componentName};
          `
        );

        console.log('🏭 [Game Loader] Executing component factory...');
        // Execute the function with React hooks
        const Component = componentFactory(
          React,
          React.useState,
          React.useEffect,
          React.useRef,
          React.useCallback
        );

        console.log('✅ [Game Loader] Component created successfully!');
        setGameComponent(() => Component);
        setIsLoading(false);
        console.log('🎮 [Game Loader] Game ready to render!');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load game';
        console.error('❌ [Game Loader] FAILED:', err);
        console.error('❌ [Game Loader] Error message:', errorMessage);
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

