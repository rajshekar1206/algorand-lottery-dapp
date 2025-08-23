import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/WalletAuthContext';
import { apiClient } from '../utils/api';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'draws' | 'users'>('dashboard');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [draws, setDraws] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadAdminData();
  }, [activeTab]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      if (activeTab === 'dashboard') {
        const response = await apiClient.getAdminDashboard();
        if (response.success) {
          setDashboardData(response.data);
        }
      } else if (activeTab === 'draws') {
        const response = await apiClient.getAdminDashboard(); // This includes draws
        if (response.success) {
          setDraws(response.data.recentDraws || []);
        }
      } else if (activeTab === 'users') {
        const response = await apiClient.getAllUsers();
        if (response.success) {
          setUsers(response.data || []);
        }
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      setMessage({ type: 'error', text: 'Failed to load admin data' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConductDraw = async (drawId: string) => {
    try {
      const response = await apiClient.conductDraw(drawId);
      if (response.success) {
        setMessage({ type: 'success', text: 'Draw conducted successfully!' });
        loadAdminData(); // Reload data
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to conduct draw' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to conduct draw' });
    }
  };

  const handleScheduleNextDraw = async () => {
    try {
      const response = await apiClient.scheduleNextDraw();
      if (response.success) {
        setMessage({ type: 'success', text: 'Next draw scheduled successfully!' });
        loadAdminData(); // Reload data
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to schedule draw' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to schedule draw' });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
            <p className="mt-2 text-gray-400">
              Manage lottery draws, users, and system settings
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {['dashboard', 'draws', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.type === 'success' 
              ? 'bg-green-900 border border-green-700 text-green-200' 
              : 'bg-red-900 border border-red-700 text-red-200'
          }`}>
            {message.text}
            <button
              onClick={() => setMessage(null)}
              className="float-right text-xl"
            >
              ��
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && dashboardData && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-blue-400">{dashboardData.totalUsers}</p>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Active Users</h3>
                    <p className="text-3xl font-bold text-green-400">{dashboardData.activeUsers}</p>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Total Draws</h3>
                    <p className="text-3xl font-bold text-purple-400">{dashboardData.totalDraws}</p>
                  </div>
                  
                  <div className="bg-gray-900 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Current Revenue</h3>
                    <p className="text-3xl font-bold text-yellow-400">
                      ${((dashboardData.currentDraw?.ticketsSold || 0) * 5).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Current Draw */}
                {dashboardData.currentDraw && (
                  <div className="bg-gray-900 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-xl font-bold text-white">Current Draw</h2>
                      <button
                        onClick={handleScheduleNextDraw}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Schedule Next Draw
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-gray-400 text-sm">Draw Date</p>
                        <p className="text-white font-semibold">
                          {formatDate(dashboardData.currentDraw.draw_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Prize Pool</p>
                        <p className="text-yellow-400 font-bold text-xl">
                          ${dashboardData.currentDraw.total_prize?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Tickets Sold</p>
                        <p className="text-green-400 font-bold text-xl">
                          {dashboardData.currentDraw.ticketsSold || 0}
                        </p>
                      </div>
                    </div>

                    {dashboardData.currentDraw.status === 'scheduled' && (
                      <div className="mt-4">
                        <button
                          onClick={() => handleConductDraw(dashboardData.currentDraw.id)}
                          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                        >
                          Conduct Draw Now
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Draws Tab */}
            {activeTab === 'draws' && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">Recent Draws</h2>
                <div className="space-y-4">
                  {draws.map((draw) => (
                    <div key={draw.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white font-semibold">
                            {formatDate(draw.draw_date)}
                          </p>
                          <p className="text-gray-400 text-sm">
                            Prize: ${draw.total_prize?.toLocaleString()} | 
                            Tickets: {draw.tickets_sold}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          draw.status === 'completed' ? 'bg-green-900 text-green-200' : 'bg-blue-900 text-blue-200'
                        }`}>
                          {draw.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-6">User Management</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="pb-3 text-gray-300">Name</th>
                        <th className="pb-3 text-gray-300">Email</th>
                        <th className="pb-3 text-gray-300">Role</th>
                        <th className="pb-3 text-gray-300">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800">
                          <td className="py-3 text-white">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="py-3 text-gray-300">{user.email}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.role === 'admin' 
                                ? 'bg-red-900 text-red-200' 
                                : 'bg-blue-900 text-blue-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="py-3 text-gray-400">
                            {formatDate(user.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
