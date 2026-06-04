import React from 'react';

export default function ResultCard({ result }) {
  if (!result) {
    return (
      <div className="glass p-8 rounded-3xl border border-gray-800 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center text-gray-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-white tracking-wide">Awaiting Inputs</h3>
        <p className="text-sm text-gray-400 max-w-xs mt-2 leading-relaxed">
          Fill out the product information form and click "Calculate Return Risk" to view your scoring metrics.
        </p>
      </div>
    );
  }

  const { return_probability, risk_level, return_reason, trust_score, recommendation } = result;

  // Format probability as percentage
  const probPercentage = (return_probability * 100).toFixed(1);

  // Map risk level to colors
  const riskConfig = {
    High: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
      badge: 'bg-rose-500 text-white',
      glow: 'shadow-rose-500/20'
    },
    Medium: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      badge: 'bg-amber-500 text-white',
      glow: 'shadow-amber-500/20'
    },
    Low: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badge: 'bg-emerald-500 text-white',
      glow: 'shadow-emerald-500/20'
    }
  };

  const currentRisk = riskConfig[risk_level] || riskConfig.Low;

  // Map trust score to styling
  let trustColor = 'text-emerald-400';
  let trustStroke = 'stroke-emerald-500';
  let trustGlow = 'from-emerald-500/20 to-teal-500/5';
  
  if (trust_score < 40) {
    trustColor = 'text-rose-400';
    trustStroke = 'stroke-rose-500';
    trustGlow = 'from-rose-500/20 to-red-500/5';
  } else if (trust_score < 70) {
    trustColor = 'text-amber-400';
    trustStroke = 'stroke-amber-500';
    trustGlow = 'from-amber-500/20 to-yellow-500/5';
  }

  // Circular gauge config
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (trust_score / 100) * circumference;

  return (
    <div className="glass p-6 rounded-3xl border border-gray-800 shadow-xl space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-white tracking-wide">
          Risk & Trust Analysis
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Real-time predictions calculated from ML pipeline
        </p>
      </div>

      {/* Main score layout: Trust Score (Circular Gauge) & Risk Level Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        
        {/* Trust Score circular gauge */}
        <div className={`p-6 rounded-2xl bg-gradient-to-br ${trustGlow} border border-gray-800/80 flex flex-col items-center justify-center`}>
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-gray-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                className={`transition-all duration-1000 ease-out ${trustStroke}`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute text-center">
              <span className={`text-3xl font-extrabold tracking-tighter ${trustColor}`}>
                {trust_score.toFixed(0)}
              </span>
              <span className="text-xs text-gray-500 block font-semibold uppercase tracking-wider">Score</span>
            </div>
          </div>
          <span className="text-sm font-bold text-white mt-4 tracking-wide">
            Product Trust Score
          </span>
        </div>

        {/* Risk Level badge */}
        <div className={`p-6 rounded-2xl border ${currentRisk.bg} flex flex-col justify-between h-full min-h-[176px]`}>
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Return Risk Category
            </span>
            <h3 className="text-3xl font-extrabold tracking-tight mt-1">
              {risk_level} Risk
            </h3>
          </div>
          
          <div className="mt-4 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gray-950/60 border border-gray-850">
              Score: {probPercentage}%
            </span>
            <span className="text-xs text-gray-400 font-medium">
              probability index
            </span>
          </div>
        </div>

      </div>

      {/* Return Probability Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
          <span>RETURN PROBABILITY</span>
          <span className="font-mono text-white font-bold">{probPercentage}%</span>
        </div>
        <div className="w-full h-3 rounded-full bg-gray-900 border border-gray-800 overflow-hidden p-0.5">
          <div 
            className="h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-1000 ease-out"
            style={{ width: `${probPercentage}%` }}
          />
        </div>
      </div>

      {/* Return Reason Card */}
      <div className="p-4 rounded-xl bg-gray-900/50 border border-gray-800 flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-gray-950 border border-gray-800 text-sky-400 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Detected Complaint / Return Reason
          </span>
          <h4 className="text-md font-bold text-white mt-0.5">
            {return_reason}
          </h4>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">
            Derived from review NLP vector analysis.
          </p>
        </div>
      </div>

      {/* Action Recommendation */}
      <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-500/10 flex items-start gap-4">
        <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <div>
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">
            Refund Reduction Action Plan
          </span>
          <p className="text-sm font-semibold text-white mt-1 leading-relaxed">
            {recommendation}
          </p>
        </div>
      </div>

    </div>
  );
}
