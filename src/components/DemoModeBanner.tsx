import React from 'react';

interface DemoModeBannerProps {
  isVisible: boolean;
  isBackendConnected?: boolean;
}

const DemoModeBanner: React.FC<DemoModeBannerProps> = ({ isVisible, isBackendConnected }) => {
  if (!isVisible) return null;

  if (isBackendConnected) {
    return (
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 text-center text-sm">
        <div className="flex items-center justify-center space-x-2">
          <span>🎲</span>
          <span>
            <strong>AlgoLottery dApp:</strong> Fully functional!
            <span className="ml-1">Connect your Pera Wallet to start playing the lottery.</span>
          </span>
          <span>🎲</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 text-center text-sm">
      <div className="flex items-center justify-center space-x-2">
        <span className="animate-pulse">🎭</span>
        <span>
          <strong>Demo Mode:</strong> You're viewing sample data.
          <span className="ml-1">Start the backend server for full functionality.</span>
        </span>
        <span className="animate-pulse">🎭</span>
      </div>
    </div>
  );
};

export default DemoModeBanner;
