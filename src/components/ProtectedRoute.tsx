import React from 'react';
import { useAuth } from '../contexts/WalletAuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin, isConnecting } = useAuth();

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Wallet Required</h2>
          <p className="text-gray-300 mb-6">
            Please connect your Pera Wallet to access this page.
          </p>
          <div className="text-4xl mb-4">🔗</div>
          <p className="text-gray-400 text-sm">
            Click "Connect Wallet" in the navigation bar above.
          </p>
        </div>
      </div>
    );
  }

  if (adminOnly && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="max-w-md w-full bg-gray-900 rounded-lg p-8 border border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Admin Access Required</h2>
          <p className="text-gray-300 mb-6">
            This page requires admin privileges.
          </p>
          <div className="text-4xl mb-4">🔒</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
