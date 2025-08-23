import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/WalletAuthContext';
import { apiClient } from '../utils/api';
import SimpleConnectionStatus from '../components/SimpleConnectionStatus';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [currentDraw, setCurrentDraw] = useState<any>(null);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [drawResponse, statsResponse] = await Promise.all([
        apiClient.getCurrentDraw(),
        apiClient.getStatistics()
      ]);

      if (drawResponse.success) {
        setCurrentDraw(drawResponse.data);
      }

      if (statsResponse.success) {
        setStatistics(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };

  const formatTimeRemaining = (drawDate: string) => {
    const now = new Date();
    const draw = new Date(drawDate);
    const ms = draw.getTime() - now.getTime();
    
    if (ms <= 0) return 'Draw closed';
    
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Win Big with
              </span>
              <br />
              <span className="text-white">LotteryApp</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your chance to win life-changing prizes! Purchase tickets, check results, 
              and join thousands of winners in our secure lottery platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
                >
                  🎲 Go to Dashboard
                </Link>
              ) : (
                <>
                  <div className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg text-center">
                    🔗 Connect Wallet to Get Started
                  </div>
                  <Link
                    to="/results"
                    className="px-8 py-4 bg-gray-700 text-white rounded-lg font-semibold text-lg hover:bg-gray-600 transition-colors"
                  >
                    View Results
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Current Draw Section */}
      {currentDraw && (
        <div className="bg-gray-900 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Current Draw</h2>
              <p className="text-gray-400">Don't miss your chance to win!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Prize Pool</p>
                <p className="text-4xl font-bold text-yellow-400">
                  ${currentDraw.total_prize?.toLocaleString() || '0'}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Time Remaining</p>
                <p className="text-2xl font-bold text-green-400">
                  {formatTimeRemaining(currentDraw.draw_date)}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-gray-400 text-sm mb-2">Ticket Price</p>
                <p className="text-2xl font-bold text-blue-400">$5.00</p>
              </div>
            </div>

            <div className="text-center mt-8">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  🎫 Buy Tickets Now
                </Link>
              ) : (
                <div className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold">
                  🔗 Connect Wallet to Play
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Connection Status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SimpleConnectionStatus />
      </div>

      {/* Statistics Section */}
      {statistics && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Lottery Stats</h2>
            <p className="text-gray-400">See how our community is winning</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-blue-400 mb-2">
                {statistics.totalDraws}
              </p>
              <p className="text-gray-300">Total Draws</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-green-400 mb-2">
                {statistics.totalTicketsSold?.toLocaleString()}
              </p>
              <p className="text-gray-300">Tickets Sold</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6 text-center">
              <p className="text-2xl font-bold text-yellow-400 mb-2">
                ${statistics.totalPrizesAwarded?.toLocaleString()}
              </p>
              <p className="text-gray-300">Prizes Awarded</p>
            </div>
          </div>
        </div>
      )}

      {/* How to Play Section */}
      <div className="bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">How to Play</h2>
            <p className="text-gray-400">It's simple and secure</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Connect Wallet</h3>
              <p className="text-gray-400">Connect your Pera Wallet in seconds</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Pick Numbers</h3>
              <p className="text-gray-400">Choose 6 numbers from 1-50</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Buy Ticket</h3>
              <p className="text-gray-400">Secure payment, instant confirmation</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Win Prizes</h3>
              <p className="text-gray-400">Check results and claim your winnings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-400">
            <p>&copy; 2024 LotteryApp. All rights reserved.</p>
            <p className="mt-2 text-sm">Play responsibly. Must be 18+ to participate.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
