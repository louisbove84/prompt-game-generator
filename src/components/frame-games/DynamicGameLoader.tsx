'use client';

import React, { useEffect, useState, useRef } from 'react';
import * as Babel from '@babel/standalone';

interface DynamicGameLoaderProps {
  gameCode: string;
  onError?: (error: string) => void;
  onBack?: () => void;
  onScreenshotCaptured?: (screenshot: Blob) => void;
  captureScreenshot?: boolean; // Whether to capture screenshot after game loads
  isMintingNFT?: boolean; // External minting state to sync with
  onMintingStateChange?: (isMinting: boolean) => void; // Callback to update external minting state
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
  onBack,
  onScreenshotCaptured,
  captureScreenshot = false,
  isMintingNFT: externalIsMintingNFT = false,
  onMintingStateChange
}) => {
  const [GameComponent, setGameComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [screenshotTaken, setScreenshotTaken] = useState(false);
  const [isMintingNFT, setIsMintingNFT] = useState(false);

  // Navigation warning to prevent NFT loss during minting
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (externalIsMintingNFT) {
        e.preventDefault();
        e.returnValue = 'NFT is being minted. Are you sure you want to leave?';
        return 'NFT is being minted. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [externalIsMintingNFT]);

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

  // Capture screenshot after game is loaded and rendered
  useEffect(() => {
    console.log('🎬 [Screenshot] useEffect triggered');
    console.log('🎮 [Screenshot] GameComponent:', !!GameComponent);
    console.log('📷 [Screenshot] captureScreenshot prop:', captureScreenshot);
    console.log('✅ [Screenshot] screenshotTaken:', screenshotTaken);
    console.log('📦 [Screenshot] gameContainerRef.current:', !!gameContainerRef.current);
    
    if (!GameComponent || !captureScreenshot || screenshotTaken || !gameContainerRef.current) {
      console.log('⏭️ [Screenshot] Skipping screenshot capture');
      return;
    }

    const captureGameScreenshot = async () => {
      try {
        console.log('⏳ [Screenshot] Waiting 2 seconds for game to render...');
        // Wait a bit for the game to render fully
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('📸 [Screenshot] Starting screenshot capture...');
        
        const html2canvas = (await import('html2canvas')).default;
        const container = gameContainerRef.current;
        
        if (!container) {
          console.error('❌ [Screenshot] Game container not found');
          return;
        }

        // Try multiple strategies to find the game element
        let targetElement: HTMLElement | HTMLCanvasElement | null = null;
        
        // Strategy 1: Look for canvas element (most common for games)
        targetElement = container.querySelector('canvas');
        if (targetElement) {
          console.log('✅ [Screenshot] Found canvas element');
        }
        
        // Strategy 2: Look for the largest non-button div
        if (!targetElement) {
          console.log('🔍 [Screenshot] No canvas found, looking for game div...');
          const allDivs = Array.from(container.querySelectorAll('div')) as HTMLElement[];
          const gameDivs = allDivs.filter(div => {
            // Exclude divs that are or contain buttons
            const hasButton = div.querySelector('button') !== null;
            const isSmall = div.offsetHeight < 200 || div.offsetWidth < 200;
            return !hasButton && !isSmall;
          });
          
          if (gameDivs.length > 0) {
            targetElement = gameDivs.reduce((largest, current) => 
              (current.offsetHeight * current.offsetWidth) > (largest.offsetHeight * largest.offsetWidth) 
                ? current : largest
            );
            console.log('✅ [Screenshot] Found game div');
          }
        }

        // Strategy 3: Use the entire container, but we'll filter out buttons
        if (!targetElement) {
          console.log('⚠️ [Screenshot] No specific game element found, using container');
          targetElement = container;
        }

        console.log('📸 [Screenshot] Target element:', {
          tag: targetElement.tagName,
          width: targetElement instanceof HTMLElement ? targetElement.offsetWidth : 0,
          height: targetElement instanceof HTMLElement ? targetElement.offsetHeight : 0,
          className: targetElement.className || 'none'
        });

        // If we found a canvas element, try direct capture first
        if (targetElement instanceof HTMLCanvasElement) {
          console.log('🎯 [Screenshot] Found canvas - trying direct capture first...');
          try {
            await new Promise<void>((resolve, reject) => {
              targetElement.toBlob((blob) => {
                if (blob) {
                  console.log('✅ [Screenshot] Direct canvas capture succeeded!');
                  console.log('📊 [Screenshot] Blob size:', (blob.size / 1024).toFixed(2), 'KB');
                  setIsMintingNFT(true);
                  onMintingStateChange?.(true);
                  onScreenshotCaptured?.(blob);
                  setScreenshotTaken(true);
                  resolve();
                } else {
                  reject(new Error('Canvas toBlob returned null'));
                }
              }, 'image/png');
            });
            return; // Success! Exit early
          } catch (canvasErr) {
            console.warn('⚠️ [Screenshot] Direct canvas capture failed, trying html2canvas...', canvasErr);
          }
        }
        
        console.log('🎨 [Screenshot] Starting html2canvas rendering...');
        
        const canvas = await html2canvas(targetElement, {
          backgroundColor: '#000000',
          scale: 2, // Higher resolution
          logging: true, // Enable logging to see what's happening
          useCORS: true,
          allowTaint: true,
          ignoreElements: (element) => {
            // Ignore back button and other UI elements
            if (element.tagName === 'BUTTON') return true;
            if (element.className && typeof element.className === 'string' && element.className.includes('back')) return true;
            if (element.textContent && element.textContent.includes('Back to')) return true;
            return false;
          },
        });

        console.log('✅ [Screenshot] html2canvas completed! Canvas size:', canvas.width, 'x', canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            console.log('✅ [Screenshot] Screenshot captured successfully!');
            console.log('📊 [Screenshot] Blob size:', (blob.size / 1024).toFixed(2), 'KB');
            console.log('📞 [Screenshot] Calling onScreenshotCaptured callback...');
            setIsMintingNFT(true);
            onMintingStateChange?.(true);
            onScreenshotCaptured?.(blob);
            setScreenshotTaken(true);
          } else {
            console.error('❌ [Screenshot] Failed to convert canvas to blob');
            alert('⚠️ Screenshot capture failed: Could not convert to blob');
          }
        }, 'image/png');

      } catch (err) {
        console.error('❌ [Screenshot] html2canvas failed:', err);
        console.error('❌ [Screenshot] Error details:', {
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : 'No stack trace',
          type: typeof err,
          stringified: JSON.stringify(err, null, 2)
        });
        
        // Try fallback 1: Direct canvas capture (if game uses canvas)
        const container = gameContainerRef.current;
        const gameCanvas = container?.querySelector('canvas');
        
        if (gameCanvas instanceof HTMLCanvasElement) {
          console.log('🔄 [Screenshot] Trying direct canvas capture...');
          try {
            gameCanvas.toBlob((blob) => {
              if (blob) {
                console.log('✅ [Screenshot] Direct canvas capture succeeded!');
                console.log('📊 [Screenshot] Blob size:', (blob.size / 1024).toFixed(2), 'KB');
                setIsMintingNFT(true);
                onMintingStateChange?.(true);
                onScreenshotCaptured?.(blob);
                setScreenshotTaken(true);
              } else {
                throw new Error('Canvas toBlob returned null');
              }
            }, 'image/png');
            return; // Exit if direct capture succeeds
          } catch (canvasErr) {
            console.error('❌ [Screenshot] Direct canvas capture failed:', canvasErr);
          }
        }
        
        // Try fallback 2: html2canvas with simpler options
        console.log('🔄 [Screenshot] Trying html2canvas with simpler options...');
        try {
          const html2canvas = (await import('html2canvas')).default;
          
          if (container) {
            // Much simpler options - just capture everything
            const canvas = await html2canvas(container, {
              backgroundColor: '#000000',
              scale: 1, // Lower resolution to avoid issues
              logging: true,
              allowTaint: false, // Stricter mode
              useCORS: false, // Disable CORS
            });
            
            console.log('✅ [Screenshot] Fallback html2canvas succeeded!');
            
            canvas.toBlob((blob) => {
              if (blob) {
                console.log('✅ [Screenshot] Fallback blob created:', (blob.size / 1024).toFixed(2), 'KB');
                setIsMintingNFT(true);
                onMintingStateChange?.(true);
                onScreenshotCaptured?.(blob);
                setScreenshotTaken(true);
              }
            }, 'image/png');
          }
        } catch (fallbackErr) {
          console.error('❌ [Screenshot] All fallback methods failed:', fallbackErr);
          alert(`⚠️ Screenshot capture failed completely.\n\nError: ${err instanceof Error ? err.message : 'Unknown error'}\n\nPlease check the browser console for details.`);
        }
      }
    };

    captureGameScreenshot();
  }, [GameComponent, captureScreenshot, screenshotTaken, onScreenshotCaptured]);

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
    <div className="relative" ref={gameContainerRef}>
      {onBack && (
        <button
          onClick={onBack}
          className="absolute bottom-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
        >
          ← Back to Generator
        </button>
      )}
      <GameComponent />
    </div>
  );
};

export default DynamicGameLoader;

