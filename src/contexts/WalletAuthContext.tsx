import React, { createContext, useContext, ReactNode } from 'react';
import { useAlgorandWallet } from '../hooks/useAlgorandWallet';

interface WalletAuthContextType {
  account: {
    address: string;
    balance: number;
    isConnected: boolean;
  } | null;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
  refreshBalance: () => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean; // For demo purposes, consider first connected wallet as admin
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null;
}

const WalletAuthContext = createContext<WalletAuthContextType | undefined>(undefined);

export const useAuth = (): WalletAuthContextType => {
  const context = useContext(WalletAuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a WalletAuthProvider');
  }
  return context;
};

interface WalletAuthProviderProps {
  children: ReactNode;
}

export const WalletAuthProvider: React.FC<WalletAuthProviderProps> = ({ children }) => {
  const { 
    account, 
    isConnecting, 
    error, 
    connect, 
    disconnect, 
    refreshBalance 
  } = useAlgorandWallet();

  // Create a user object based on wallet connection
  const user = account?.isConnected ? {
    id: account.address,
    email: `${account.address.slice(0, 8)}@wallet.algo`,
    firstName: account.address.slice(0, 8),
    lastName: 'Wallet',
    role: 'user' // All wallet users are regular users for now
  } : null;

  // For demo purposes, consider admin if wallet address starts with specific pattern
  // In production, you'd check this against a database or smart contract
  const isAdmin = account?.isConnected && 
    (account.address.toLowerCase().includes('admin') || 
     account.address.slice(-4) === '0000'); // Example admin check

  const value: WalletAuthContextType = {
    account,
    isConnecting,
    error,
    connect,
    disconnect,
    refreshBalance,
    isAuthenticated: !!account?.isConnected,
    isAdmin,
    user
  };

  return (
    <WalletAuthContext.Provider value={value}>
      {children}
    </WalletAuthContext.Provider>
  );
};
