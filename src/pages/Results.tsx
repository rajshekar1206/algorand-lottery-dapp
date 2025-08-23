import React, { useState, useEffect } from 'react';
import { apiClient } from '../utils/api';
import SimpleConnectionStatus from '../components/SimpleConnectionStatus';

const Results: React.FC = () => {
  const [draws, setDraws] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResultsData();
  }, []);

  const loadResultsData = async () => {
    try {
      setIsLoading(true);
      const [drawsResponse, statsResponse] = await Promise.all([
        apiClient.getRecentDraws(20),
        apiClient.getStatistics()
      ]);

      if (drawsResponse.success) {
        setDraws(drawsResponse.data || []);
      }

      if (statsResponse.success) {
        setStatistics(statsResponse.data);
      }
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-white">Lottery Results</h1>
            <p className="mt-2 text-gray-400">
              View recent draws and winning numbers
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status */}
        <SimpleConnectionStatus />

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Total Draws</h3>
              <p className="text-3xl font-bold text-blue-400">{statistics.totalDraws}</p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Tickets Sold</h3>
              <p className="text-3xl font-bold text-green-400">
                {statistics.totalTicketsSold?.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Prizes Awarded</h3>
              <p className="text-3xl font-bold text-yellow-400">
                ${statistics.totalPrizesAwarded?.toLocaleString()}
              </p>
            </div>
            
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Jackpot Odds</h3>
              <p className="text-lg font-bold text-purple-400">
                {statistics.odds?.jackpot}
              </p>
            </div>
          </div>
        )}

        {/* Odds Information */}
        {statistics?.odds && (
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Winning Odds</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-yellow-400 font-bold text-lg">Jackpot (6 matches)</p>
                <p className="text-gray-300">{statistics.odds.jackpot}</p>
              </div>
              <div className="text-center">
                <p className="text-orange-400 font-bold text-lg">Second (5 matches)</p>
                <p className="text-gray-300">{statistics.odds.second}</p>
              </div>
              <div className="text-center">
                <p className="text-blue-400 font-bold text-lg">Third (4 matches)</p>
                <p className="text-gray-300">{statistics.odds.third}</p>
              </div>
              <div className="text-center">
                <p className="text-green-400 font-bold text-lg">Fourth (3 matches)</p>
                <p className="text-gray-300">{statistics.odds.fourth}</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Draws */}
        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Draws</h2>
          
          {draws.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No draws available yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {draws.map((draw) => (
                <div key={draw.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Draw #{draw.id.slice(0, 8)}
                      </h3>
                      <p className="text-gray-400">
                        {formatDate(draw.draw_date)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        draw.status === 'completed'
                          ? 'bg-green-900 text-green-200'
                          : draw.status === 'active'
                          ? 'bg-blue-900 text-blue-200'
                          : 'bg-gray-700 text-gray-300'
                      }`}>
                        {draw.status.charAt(0).toUpperCase() + draw.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Prize Pool</p>
                      <p className="text-2xl font-bold text-yellow-400">
                        ${draw.total_prize?.toLocaleString() || '0'}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Tickets Sold</p>
                      <p className="text-xl font-semibold text-blue-400">
                        {draw.tickets_sold?.toLocaleString() || '0'}
                      </p>
                    </div>
                  </div>

                  {draw.winning_numbers && draw.status === 'completed' && (
                    <div className="mt-6">
                      <p className="text-gray-400 text-sm mb-3">Winning Numbers</p>
                      <div className="flex space-x-3">
                        {draw.winning_numbers.map((number: number, index: number) => (
                          <span
                            key={index}
                            className="w-12 h-12 bg-yellow-600 text-white rounded-full flex items-center justify-center text-lg font-bold"
                          >
                            {number}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {draw.status !== 'completed' && (
                    <div className="mt-6">
                      <p className="text-gray-500 italic">
                        {draw.status === 'scheduled' 
                          ? 'Draw not yet conducted' 
                          : 'Draw in progress...'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Results;
