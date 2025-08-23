import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/WalletAuthContext';
import TicketPurchase from '../components/TicketPurchase';
import AlgorandTicketPurchase from '../components/AlgorandTicketPurchase';
import MyTickets from '../components/MyTickets';
import CurrentDraw from '../components/CurrentDraw';
import { apiClient } from '../utils/api';

const Dashboard: React.FC = () => {
  const { user, account } = useAuth();
  const [activeTab, setActiveTab] = useState<'buy' | 'tickets' | 'results'>('buy');
  const [currentDraw, setCurrentDraw] = useState<any>(null);
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const [drawResponse, ticketsResponse] = await Promise.all([
        apiClient.getCurrentDraw(),
        apiClient.getMyTickets()
      ]);

      if (drawResponse.success) {
        setCurrentDraw(drawResponse.data);
      }

      if (ticketsResponse.success) {
        setTickets(ticketsResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketPurchased = () => {
    loadDashboardData(); // Reload data after ticket purchase
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
            <h1 className="text-3xl font-bold text-white">
              Welcome, {account?.address.slice(0, 8)}...{account?.address.slice(-4)}!
            </h1>
            <p className="mt-2 text-gray-400">
              Manage your lottery tickets and check results
            </p>
            <p className="mt-1 text-blue-400">
              Balance: {account?.balance.toFixed(2)} ALGO
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('buy')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'buy'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Buy Tickets
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tickets'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              My Tickets ({tickets.length})
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'results'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              Results
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'buy' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AlgorandTicketPurchase
                currentDraw={currentDraw}
                onTicketPurchased={handleTicketPurchased}
              />
            </div>
            <div>
              <CurrentDraw draw={currentDraw} />
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <MyTickets tickets={tickets} onRefresh={loadDashboardData} />
        )}

        {activeTab === 'results' && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-300 mb-4">
              Results Coming Soon
            </h3>
            <p className="text-gray-400">
              Check back here to see lottery results and winners.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
