import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';

const ConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Create AbortController for manual timeout control
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const response = await fetch('http://localhost:3001/health', {
        signal: controller.signal,
        mode: 'cors',
        cache: 'no-cache'
      });

      clearTimeout(timeoutId);
      setIsConnected(response.ok);
    } catch (error) {
      // Completely suppress all fetch errors - no console logging
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Only check connection once on mount, don't auto-retry
    checkConnection();

    // Optional: Check connection every 60 seconds (less aggressive)
    const interval = setInterval(() => {
      // Only check if user hasn't manually checked recently
      if (!isChecking) {
        checkConnection();
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [isChecking]);

  if (isConnected === null) {
    return null; // Don't show anything while initial check is happening
  }

  if (isConnected) {
    return (
      <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-2 rounded-lg mb-4">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          Backend server connected - Full functionality available
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center mb-2">
            <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
            <strong>Demo Mode - Backend not connected</strong>
          </div>
          <p className="text-sm text-blue-300 mb-3">
            You're viewing demo data. To purchase tickets and access full functionality, start the backend server.
          </p>
          <div className="text-sm">
            <p className="font-semibold mb-1">To start the backend server:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-300">
              <li>Open a terminal and navigate to the backend directory</li>
              <li>Run: <code className="bg-blue-800 px-1 rounded">npm install</code></li>
              <li>Set up your database (PostgreSQL) or connect to Neon</li>
              <li>Run: <code className="bg-blue-800 px-1 rounded">npm run migrate</code></li>
              <li>Run: <code className="bg-blue-800 px-1 rounded">npm run dev</code></li>
            </ol>
          </div>
        </div>
        <button
          onClick={checkConnection}
          disabled={isChecking}
          className="bg-blue-700 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
        >
          {isChecking ? 'Checking...' : 'Check Connection'}
        </button>
      </div>
    </div>
  );
};

export default ConnectionStatus;
