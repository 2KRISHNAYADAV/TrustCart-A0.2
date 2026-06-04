import React from 'react';

export default function StatCard({ title, value, icon, description, trendColor = 'sky' }) {
  // Map color tokens to Tailwind classes for borders and background glows
  const themeClasses = {
    sky: 'border-sky-500/20 hover:border-sky-500/50 shadow-sky-500/5 hover:shadow-sky-500/10 text-sky-400 bg-sky-500/10',
    amber: 'border-amber-500/20 hover:border-amber-500/50 shadow-amber-500/5 hover:shadow-amber-500/10 text-amber-400 bg-amber-500/10',
    rose: 'border-rose-500/20 hover:border-rose-500/50 shadow-rose-500/5 hover:shadow-rose-500/10 text-rose-400 bg-rose-500/10',
    emerald: 'border-emerald-500/20 hover:border-emerald-500/50 shadow-emerald-500/5 hover:shadow-emerald-500/10 text-emerald-400 bg-emerald-500/10',
    indigo: 'border-indigo-500/20 hover:border-indigo-500/50 shadow-indigo-500/5 hover:shadow-indigo-500/10 text-indigo-400 bg-indigo-500/10',
  };

  const selectedTheme = themeClasses[trendColor] || themeClasses.sky;

  return (
    <div className={`glass glass-hover p-6 rounded-2xl border flex flex-col justify-between h-full shadow-lg ${selectedTheme}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
            {title}
          </p>
          <h3 className="text-2xl font-bold tracking-tight text-white mt-2 break-words">
            {value || '--'}
          </h3>
        </div>
        
        {icon && (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gray-900 border border-gray-800 shadow-md">
            {icon}
          </div>
        )}
      </div>

      {description && (
        <div className="mt-4 pt-3 border-t border-gray-800/60">
          <p className="text-xs text-gray-400 font-medium leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </div>
  );
}
