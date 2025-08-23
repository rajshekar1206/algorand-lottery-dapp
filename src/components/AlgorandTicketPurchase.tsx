import React, { useState } from 'react';
import { useAlgorandWallet } from '../hooks/useAlgorandWallet';
import { apiClient } from '../utils/api';

interface AlgorandTicketPurchaseProps {
  currentDraw: any;
  onTicketPurchased: () => void;
}

const AlgorandTicketPurchase: React.FC<AlgorandTicketPurchaseProps> = ({ 
  currentDraw, 
  onTicketPurchased 
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { account, createLotteryTransaction, signAndSendTransaction } = useAlgorandWallet();

  const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

  const handleNumberSelect = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };

  const handleQuickPick = async () => {
    try {
      const response = await apiClient.generateQuickPick();
      if (response.success && response.data) {
        setSelectedNumbers(response.data.numbers);
        setMessage({ type: 'success', text: 'Quick pick numbers generated!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to generate quick pick numbers' });
    }
  };

  const handleAlgorandPurchase = async () => {
    if (!account?.isConnected) {
      setMessage({ type: 'error', text: 'Please connect your Pera Wallet first' });
      return;
    }

    if (!currentDraw) {
      setMessage({ type: 'error', text: 'No active draw available' });
      return;
    }

    if (selectedNumbers.length !== 6) {
      setMessage({ type: 'error', text: 'Please select exactly 6 numbers' });
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage(null);

      // First, purchase the ticket via our API
      const ticketResponse = await apiClient.purchaseTicket(currentDraw.id, selectedNumbers);
      
      if (ticketResponse.success) {
        // For now, just show success - in a real implementation you would:
        // 1. Create Algorand transaction for payment
        // 2. Sign and send the transaction
        // 3. Verify payment on-chain
        // 4. Update ticket status
        
        setMessage({ 
          type: 'success', 
          text: `🎉 Ticket purchased successfully! Numbers: ${selectedNumbers.join(', ')}`
        });
        setSelectedNumbers([]);
        onTicketPurchased();
      } else {
        setMessage({ type: 'error', text: ticketResponse.error || 'Failed to purchase ticket' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to purchase ticket. Please ensure the backend server is running.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
    setMessage(null);
  };

  if (!currentDraw) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Buy Lottery Ticket</h2>
        <div className="text-center py-8">
          <p className="text-gray-400 text-lg">No active draw available</p>
          <p className="text-gray-500 text-sm mt-2">
            Please check back later when a new draw is scheduled.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">
        🎲 Buy Algorand Lottery Ticket
      </h2>
      
      {/* Wallet Status */}
      {!account?.isConnected && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 p-3 rounded mb-4">
          <p className="text-sm">
            ⚠️ Connect your Pera Wallet above to purchase tickets with ALGO
          </p>
        </div>
      )}
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.type === 'success' 
            ? 'bg-green-900 border border-green-700 text-green-200' 
            : 'bg-red-900 border border-red-700 text-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Select 6 Numbers (1-50)
          </h3>
          <div className="text-sm text-gray-400">
            Selected: {selectedNumbers.length}/6
          </div>
        </div>

        <div className="grid grid-cols-10 gap-2 mb-4">
          {numbers.map((number) => (
            <button
              key={number}
              onClick={() => handleNumberSelect(number)}
              disabled={!selectedNumbers.includes(number) && selectedNumbers.length >= 6}
              className={`
                w-8 h-8 rounded text-sm font-medium transition-all
                ${selectedNumbers.includes(number)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }
                ${!selectedNumbers.includes(number) && selectedNumbers.length >= 6
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
                }
              `}
            >
              {number}
            </button>
          ))}
        </div>

        <div className="flex space-x-3 mb-6">
          <button
            onClick={handleQuickPick}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
          >
            🎲 Quick Pick
          </button>
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>

        {selectedNumbers.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Your Numbers:</h4>
            <div className="flex space-x-2">
              {selectedNumbers.sort((a, b) => a - b).map((number, index) => (
                <span
                  key={number}
                  className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium"
                >
                  {number}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Ticket Price:</span>
            <span className="text-2xl font-bold text-green-400">
              5.00 ALGO
            </span>
          </div>
          {account?.isConnected && (
            <div className="flex justify-between items-center mt-2 text-sm">
              <span className="text-gray-400">Your Balance:</span>
              <span className="text-blue-400">
                {account.balance.toFixed(2)} ALGO
              </span>
            </div>
          )}
        </div>

        <button
          onClick={handleAlgorandPurchase}
          disabled={selectedNumbers.length !== 6 || isSubmitting || !account?.isConnected}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing Transaction...
            </div>
          ) : !account?.isConnected ? (
            '🔗 Connect Pera Wallet to Purchase'
          ) : (
            '🎫 Purchase Ticket with ALGO'
          )}
        </button>
      </div>
    </div>
  );
};

export default AlgorandTicketPurchase;
