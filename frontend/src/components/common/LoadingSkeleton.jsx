import React from 'react';

const LoadingSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-4 w-full animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-24 rounded-2xl bg-slate-800/50 border border-slate-700/30 p-4 flex flex-col justify-between">
          <div className="h-4 bg-slate-700/60 rounded w-1/3"></div>
          <div className="h-3 bg-slate-700/40 rounded w-2/3"></div>
          <div className="h-3 bg-slate-700/30 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;
