// App.tsx
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Tailwind CSS is Working!
        </h1>
        <p className="text-gray-700">
          If you see this styled text, Tailwind CSS is configured correctly.
        </p>
      </div>
    </div>
  );
};

export default App;