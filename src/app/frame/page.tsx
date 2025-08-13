'use client';

import React, { useState, useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import GameSelectionScreen from '@/components/GameSelectionScreen';
import SpaceInvadersGame from '@/components/SpaceInvadersGame';
import ThisIsFineGame from '@/components/ThisIsFineGame';

const GameRouter = () => {
  const [gameType, setGameType] = useState<'selection' | 'spaceinvaders' | 'runner'>('selection');

  useEffect(() => {
    // Initialize SDK and call ready() once at the app level
    const initializeSDK = async () => {
      try {
        console.log('Initializing Farcaster SDK and calling ready()');
        if (typeof sdk !== 'undefined' && typeof sdk.actions.ready === 'function') {
          await sdk.actions.ready();
          console.log('SDK ready() called successfully');
        } else {
          console.error('SDK or sdk.actions.ready is not available');
        }
      } catch (error) {
        console.error('SDK initialization error:', error);
      }
    };

    initializeSDK();

    // Check URL parameters to determine which game to show
    const urlParams = new URLSearchParams(window.location.search);
    const game = urlParams.get('game');
    
    if (game === 'runner') {
      setGameType('runner');
    } else if (game === 'spaceinvaders') {
      setGameType('spaceinvaders');
    } else {
      // No game parameter - show selection screen
      setGameType('selection');
    }
  }, []); // Run once on mount

  if (gameType === 'selection') {
    return <GameSelectionScreen onSelectGame={setGameType} />;
  }

  if (gameType === 'runner') {
    return <ThisIsFineGame />;
  }

  if (gameType === 'spaceinvaders') {
    return <SpaceInvadersGame />;
  }

  return null;
};

export default GameRouter;

// Required for Farcaster Mini Apps - forces dynamic rendering
export const dynamic = 'force-dynamic';