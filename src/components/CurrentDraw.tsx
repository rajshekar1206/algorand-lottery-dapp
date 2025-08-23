import React from 'react';

interface CurrentDrawProps {
  draw: any;
}

const CurrentDraw: React.FC<CurrentDrawProps> = ({ draw }) => {
  if (!draw) {
    return (
      <div className="bg-gray-900 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4">Current Draw</h3>
        <div className="text-center py-8">
          <p className="text-gray-400">No active draw</p>
        </div>
      </div>
    );
  }

  const drawDate = new Date(draw.draw_date);
  const now = new Date();
  const timeRemaining = drawDate.getTime() - now.getTime();
  
  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return 'Draw closed';
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white mb-4">Current Draw</h3>
      
      <div className="space-y-4">
        <div>
          <p className="text-gray-400 text-sm">Draw Date</p>
          <p className="text-white font-semibold">
            {drawDate.toLocaleDateString()} at {drawDate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Time Remaining</p>
          <p className={`font-semibold text-lg ${
            timeRemaining > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatTimeRemaining(timeRemaining)}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Prize Pool</p>
          <p className="text-yellow-400 font-bold text-2xl">
            ${draw.total_prize?.toLocaleString() || '0'}
          </p>
        </div>

        <div>
          <p className="text-gray-400 text-sm">Status</p>
          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            draw.status === 'scheduled' 
              ? 'bg-blue-900 text-blue-200'
              : draw.status === 'active'
              ? 'bg-green-900 text-green-200'
              : 'bg-gray-700 text-gray-300'
          }`}>
            {draw.status.charAt(0).toUpperCase() + draw.status.slice(1)}
          </span>
        </div>

        {draw.status === 'completed' && draw.winning_numbers && (
          <div>
            <p className="text-gray-400 text-sm mb-2">Winning Numbers</p>
            <div className="flex space-x-2">
              {draw.winning_numbers.map((number: number, index: number) => (
                <span
                  key={index}
                  className="w-10 h-10 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold"
                >
                  {number}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-700 pt-4">
          <h4 className="text-white font-semibold mb-2">How to Play</h4>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Select 6 numbers from 1-50</li>
            <li>• Each ticket costs $5.00</li>
            <li>• Match 3+ numbers to win prizes</li>
            <li>• Jackpot for matching all 6!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CurrentDraw;
