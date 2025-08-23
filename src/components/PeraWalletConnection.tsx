import React from 'react';
import { useAlgorandWallet } from '../hooks/useAlgorandWallet';

const PeraWalletConnection: React.FC = () => {
  const { 
    account, 
    isConnecting, 
    error, 
    connect, 
    disconnect,
    refreshBalance 
  } = useAlgorandWallet();

  if (error) {
    return (
      <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <span>❌ Wallet Error: {error}</span>
          <button
            onClick={connect}
            className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (account?.isConnected) {
    return (
      <div className="bg-green-900 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div>
              <div className="font-semibold">
                🔗 Pera Wallet Connected
              </div>
              <div className="text-sm text-green-300">
                Address: {account.address.slice(0, 8)}...{account.address.slice(-8)}
              </div>
              <div className="text-sm text-green-300">
                Balance: {account.balance.toFixed(2)} ALGO
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={refreshBalance}
              className="bg-green-700 hover:bg-green-600 px-3 py-1 rounded text-sm"
            >
              Refresh
            </button>
            <button
              onClick={disconnect}
              className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-900 border border-blue-700 text-blue-200 px-4 py-3 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
          <div>
            <div className="font-semibold">
              🔗 Connect Pera Wallet
            </div>
            <div className="text-sm text-blue-300">
              Connect your Algorand wallet to participate in the lottery
            </div>
          </div>
        </div>
        <button
          onClick={connect}
          disabled={isConnecting}
          className="bg-blue-700 hover:bg-blue-600 disabled:opacity-50 px-4 py-2 rounded font-semibold"
        >
          {isConnecting ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            'Connect Wallet'
          )}
        </button>
      </div>
    </div>
  );
};

export default PeraWalletConnection;
