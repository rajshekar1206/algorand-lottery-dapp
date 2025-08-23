import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletAuthProvider } from './contexts/WalletAuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results';
import Admin from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import DemoModeBanner from './components/DemoModeBanner';
import OfflineIndicator from './components/OfflineIndicator';

const App: React.FC = () => {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    // Check if backend is available
    const checkBackend = async () => {
      try {
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch('http://localhost:3001/health', {
          signal: controller.signal,
          method: 'GET'
        });

        clearTimeout(timeoutId);
        const isConnected = response.ok;
        setIsBackendConnected(isConnected);
        setIsDemoMode(!isConnected);
      } catch (error) {
        // Silently handle connection errors
        setIsBackendConnected(false);
        setIsDemoMode(true);
      }
    };

    checkBackend();

    // Check every 30 seconds
    const interval = setInterval(checkBackend, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ErrorBoundary>
      <WalletAuthProvider>
        <Router>
          <div className="bg-gray-950 text-white min-h-screen">
            <OfflineIndicator />
            <DemoModeBanner isVisible={isDemoMode || isBackendConnected} isBackendConnected={isBackendConnected} />
            <Navbar />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<Results />} />

              {/* Protected routes - require wallet connection */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* Admin only routes */}
              <Route path="/admin" element={
                <ProtectedRoute adminOnly>
                  <Admin />
                </ProtectedRoute>
              } />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </WalletAuthProvider>
    </ErrorBoundary>
  );
};

export default App;
