import React, { useState, useEffect } from 'react';
import StatCard from '../components/StatCard';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import { 
  predictReturnAndTrust, 
  fetchDashboardSummary, 
  fetchPredictionHistory 
} from '../api';

export default function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  
  // Database states
  const [summary, setSummary] = useState({
    total_predictions: 0,
    high_risk_count: 0,
    average_trust_score: 0.0,
    most_common_return_reason: 'None'
  });
  const [history, setHistory] = useState([]);

  // Fetch prediction stats and history from SQL database
  const loadDashboardData = async () => {
    try {
      const summaryData = await fetchDashboardSummary();
      const historyData = await fetchPredictionHistory();
      setSummary(summaryData);
      setHistory(historyData);
    } catch (err) {
      console.error("Dashboard DB fetch error:", err);
      // We don't block the UI if the database is offline; we log and let predict fall back gracefully.
    }
  };

  // Run on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const handlePredictSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await predictReturnAndTrust(formData);
      setPredictionResult(data);
      // Automatically refresh history log and summary stats
      await loadDashboardData();
    } catch (err) {
      console.error("Dashboard submit error:", err);
      setError(err.message || "An unexpected error occurred while communicating with the server.");
      setPredictionResult(null);
    } finally {
      setLoading(false);
    }
  };

  // Dynamic calculations for stat card styling based on DB values
  const trustTheme = summary.average_trust_score >= 70 
    ? 'emerald' 
    : summary.average_trust_score >= 40 ? 'amber' : 'rose';

  const riskTheme = summary.high_risk_count > 0 ? 'rose' : 'emerald';

  const reasonTheme = summary.most_common_return_reason === 'No Issue' 
    ? 'emerald' 
    : (summary.most_common_return_reason === 'None' ? 'sky' : 'indigo');

  return (
    <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      
      {/* Introduction Banner */}
      <div className="relative overflow-hidden p-8 rounded-3xl bg-gradient-to-r from-sky-900/40 via-indigo-950/40 to-slate-950 border border-gray-800 shadow-xl">
        <div className="absolute -right-24 -bottom-24 w-72 h-72 bg-sky-500/10 rounded-full blur-3xl glow-effect"></div>
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-sky-500/10 text-sky-400 border border-sky-500/20 animate-pulse">
            Database Integrated
          </span>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-3">
            TrustCart AI Dashboard
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed mt-2">
            Minimize refund rates and secure product reputation. Enter customer transaction profiles and textual feedback parameters below to invoke neural predictions for return likelihood, trust factors, and operational improvement tips. All requests are persisted to your PostgreSQL database.
          </p>
        </div>
      </div>

      {/* Grid of 4 Stat Cards showing Live DB aggregation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <StatCard
          title="Total Predictions"
          value={summary.total_predictions ? `${summary.total_predictions} requests` : '0 requests'}
          trendColor="sky"
          description="Total items predicted and stored in PostgreSQL."
          icon={
            <svg xmlns="http://www.w3.org/2555/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
          }
        />

        <StatCard
          title="Average Trust Score"
          value={summary.average_trust_score ? `${summary.average_trust_score.toFixed(1)}%` : '--'}
          trendColor={trustTheme}
          description="Average score across all database transactions."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          }
        />

        <StatCard
          title="High Risk Predictions"
          value={summary.high_risk_count ? `${summary.high_risk_count} cases` : '0 cases'}
          trendColor={riskTheme}
          description="High risk indicators logged in database."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />

        <StatCard
          title="Top Return Reason"
          value={summary.most_common_return_reason}
          trendColor={reasonTheme}
          description="Top detected customer review complaint."
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          }
        />

      </div>

      {/* Error Alert Display */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-start gap-3 shadow-lg animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-bold text-sm">Prediction Service Error</h4>
            <p className="text-xs text-rose-400 mt-0.5 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Main Form & Results Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: span 7 */}
        <div className="lg:col-span-7">
          <PredictionForm onSubmit={handlePredictSubmit} loading={loading} />
        </div>

        {/* Right Output Card: span 5 */}
        <div className="lg:col-span-5 h-full">
          <ResultCard result={predictionResult} />
        </div>

      </div>

      {/* History logs grid at bottom */}
      <div className="glass p-6 rounded-3xl border border-gray-800 shadow-xl space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            Historical Predictions History
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Persisted records retrieved from PostgreSQL database
          </p>
        </div>
        
        {history.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-500">
            No prediction logs found in database. The pipeline is ready to store transaction records.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 uppercase tracking-widest font-bold">
                  <th className="py-3 px-4">Date/Time</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Order Value</th>
                  <th className="py-3 px-4">Risk Level</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4">Trust Score</th>
                  <th className="py-3 px-4">Action Plan Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {history.map((item) => {
                  const dateStr = new Date(item.created_at).toLocaleString();
                  return (
                    <tr key={item.id} className="hover:bg-gray-900/30 transition">
                      <td className="py-3 px-4 text-gray-500 font-mono">{dateStr}</td>
                      <td className="py-3 px-4 font-semibold text-gray-200">{item.product_category}</td>
                      <td className="py-3 px-4 font-mono text-gray-300">${item.order_value.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.risk_level === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                          item.risk_level === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {item.risk_level}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-gray-900 border border-gray-800 text-gray-300 font-semibold">
                          {item.return_reason}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-sky-400">{item.trust_score.toFixed(0)}%</td>
                      <td className="py-3 px-4 text-gray-400 max-w-xs truncate" title={item.recommendation}>
                        {item.recommendation}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </main>
  );
}
