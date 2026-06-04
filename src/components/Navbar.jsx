import React, { useEffect, useState } from 'react';
import { fetchBackendHealth } from '../api';

export default function Navbar() {
  const [healthStatus, setHealthStatus] = useState({ status: 'checking', label: 'Checking Backend...' });

  const checkHealth = async () => {
    try {
      const data = await fetchBackendHealth();
      if (data.status === 'healthy') {
        setHealthStatus({ status: 'healthy', label: 'Backend Healthy' });
      } else {
        setHealthStatus({ status: 'degraded', label: 'Models Offline' });
      }
    } catch (err) {
      setHealthStatus({ status: 'offline', label: 'Backend Offline' });
    }
  };

  useEffect(() => {
    checkHealth();
    // Poll health status every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-white via-gray-100 to-gray-400 bg-clip-text text-transparent">
              TrustCart AI
            </h1>
            <p className="text-xs text-sky-400 font-medium tracking-wider hidden sm:block uppercase">
              Return Risk & Product Trust Scoring
            </p>
          </div>
        </div>

        {/* Live Backend Connection Badge */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {healthStatus.status === 'healthy' && (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </>
            )}
            {healthStatus.status === 'degraded' && (
              <>
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </>
            )}
            {healthStatus.status === 'offline' && (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            )}
            {healthStatus.status === 'checking' && (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-500 animate-pulse"></span>
            )}
          </span>
          <span className={`text-xs font-semibold uppercase tracking-wider ${
            healthStatus.status === 'healthy' ? 'text-emerald-400' :
            healthStatus.status === 'degraded' ? 'text-amber-400' :
            healthStatus.status === 'offline' ? 'text-rose-400' : 'text-gray-400'
          }`}>
            {healthStatus.label}
          </span>
        </div>

      </div>
    </header>
  );
}
