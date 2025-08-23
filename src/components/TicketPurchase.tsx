import React, { useState } from 'react';
import { apiClient } from '../utils/api';

interface TicketPurchaseProps {
  currentDraw: any;
  onTicketPurchased: () => void;
}

const TicketPurchase: React.FC<TicketPurchaseProps> = ({ 
  currentDraw, 
  onTicketPurchased 
}) => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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

  const handlePurchase = async () => {
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

      const response = await apiClient.purchaseTicket(currentDraw.id, selectedNumbers);
      
      if (response.success) {
        setMessage({ type: 'success', text: 'Ticket purchased successfully!' });
        setSelectedNumbers([]);
        onTicketPurchased();
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to purchase ticket' });
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
      <h2 className="text-2xl font-bold text-white mb-4">Buy Lottery Ticket</h2>
      
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
            Quick Pick
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
            <span className="text-2xl font-bold text-green-400">$5.00</span>
          </div>
        </div>

        <button
          onClick={handlePurchase}
          disabled={selectedNumbers.length !== 6 || isSubmitting}
          className="w-full py-3 px-4 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Purchase Ticket'
          )}
        </button>
      </div>
    </div>
  );
};

export default TicketPurchase;
