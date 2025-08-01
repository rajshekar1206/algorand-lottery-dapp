// src/components/Navbar.tsx
import React from "react";
import { useWallet } from "../hooks/useWallet";

const Navbar: React.FC = () => {
  const { account, connect, disconnect } = useWallet();

  return (
    <nav className="flex justify-between items-center bg-gray-900 text-white px-6 py-4 shadow-md">
      <h1 className="text-xl font-bold">🎲 AlgoRaffle</h1>
      <div>
        {account ? (
          <button
            onClick={disconnect}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded"
          >
            Disconnect ({account.slice(0, 6)}...{account.slice(-4)})
          </button>
        ) : (
          <button
            onClick={connect}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
