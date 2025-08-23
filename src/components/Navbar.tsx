import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/WalletAuthContext';

const Navbar: React.FC = () => {
  const { account, connect, disconnect, isConnecting, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleWalletAction = async () => {
    if (isAuthenticated) {
      disconnect();
      navigate('/');
    } else {
      await connect();
    }
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎲</span>
            <span className="text-xl font-bold text-white">AlgoLottery</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              to="/results"
              className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
            >
              Results
            </Link>
            
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                  >
                    Admin
                  </Link>
                )}
              </>
            )}
            
            {/* Wallet Connection */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-xs text-gray-400">Connected</div>
                    <div className="text-sm text-green-400 font-medium">
                      {account?.address.slice(0, 6)}...{account?.address.slice(-4)}
                    </div>
                    <div className="text-xs text-blue-400">
                      {account?.balance.toFixed(2)} ALGO
                    </div>
                  </div>
                  <button
                    onClick={handleWalletAction}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleWalletAction}
                  disabled={isConnecting}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                >
                  {isConnecting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Connecting...</span>
                    </div>
                  ) : (
                    '🔗 Connect Wallet'
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
              >
                Home
              </Link>
              <Link
                to="/results"
                onClick={closeMobileMenu}
                className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
              >
                Results
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={closeMobileMenu}
                    className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                  >
                    Dashboard
                  </Link>
                  
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={closeMobileMenu}
                      className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                    >
                      Admin
                    </Link>
                  )}
                </>
              )}
              
              {/* Mobile Wallet Connection */}
              <div className="border-t border-gray-700 pt-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-gray-300 text-sm">
                        {account?.address.slice(0, 8)}...{account?.address.slice(-8)}
                      </p>
                      <p className="text-blue-400 text-xs">
                        {account?.balance.toFixed(2)} ALGO
                      </p>
                    </div>
                    <button
                      onClick={handleWalletAction}
                      className="block w-full text-left text-red-400 hover:text-red-300 px-3 py-2 text-base font-medium"
                    >
                      Disconnect Wallet
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleWalletAction}
                    disabled={isConnecting}
                    className="block w-full text-left bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-3 py-2 text-base font-medium rounded mx-3"
                  >
                    {isConnecting ? 'Connecting...' : '🔗 Connect Wallet'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
