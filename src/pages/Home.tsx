// src/pages/Home.tsx
import React from "react";
import { useWallet } from "../hooks/useWallet";

const Home: React.FC = () => {
  const { account } = useWallet();

  return (
    <div className="text-center mt-20">
      <h2 className="text-3xl font-bold mb-4">Welcome to AlgoRaffle!</h2>
      <p className="text-gray-300 mb-6">Buy a ticket and get a chance to win big! 🔥</p>
      {account ? (
        <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded">
          Buy Ticket 🎟️
        </button>
      ) : (
        <p className="text-red-500">Please connect your wallet to participate.</p>
      )}
    </div>
  );
};

export default Home;
