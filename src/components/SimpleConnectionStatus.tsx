import React, { useState, useEffect } from 'react';

const SimpleConnectionStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/health', {
          signal: AbortSignal.timeout(2000)
        });
        setIsConnected(response.ok);
      } catch (error) {
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  if (isConnected) {
    return (
      <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
              <strong>🎉 Backend Connected!</strong>
            </div>
            <p className="text-sm text-green-300 mb-3">
              Your AlgoLottery dApp is fully functional. Connect your Pera Wallet to start playing!
            </p>
          </div>
          <div className="text-center">
            <div className="text-xs text-green-400 mb-1">Backend Status</div>
            <div className="px-3 py-1 bg-green-800 rounded text-xs">
              ✅ Connected
            </div>
          </div>
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
            You're viewing demo data. To purchase tickets with ALGO and access full functionality, start the backend server.
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
        <div className="text-center">
          <div className="text-xs text-blue-400 mb-1">Backend Status</div>
          <div className="px-3 py-1 bg-blue-800 rounded text-xs">
            Not Connected
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleConnectionStatus;
