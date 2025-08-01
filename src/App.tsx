// src/App.tsx
import React from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Navbar />
      <Home />
    </div>
  );
};

export default App;
