import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="min-h-screen bg-[#080b11] text-gray-100 flex flex-col">
      {/* Dynamic Header with live status check */}
      <Navbar />
      
      {/* Core Page Layout */}
      <div className="flex-grow">
        <Dashboard />
      </div>
      
      {/* Clean Bottom Footer */}
      <footer className="py-6 border-t border-gray-900 text-center text-xs text-gray-500 mt-12 bg-gray-950/20">
        <div className="max-w-7xl mx-auto px-6">
          <p>© 2026 TrustCart AI — Return Risk & Product Trust Scoring Pipeline</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
