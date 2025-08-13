'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    // Redirect to the frame page for now
    window.location.href = '/frame';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">AI Game Generator</h1>
        <p className="text-gray-300 mb-8">Redirecting to games...</p>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
      </div>
    </div>
  );
}
