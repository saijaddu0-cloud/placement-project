import React from 'react';

const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) => {
  const colorMap = {
    indigo: 'from-indigo-600/20 to-purple-600/10 text-indigo-400 border-indigo-500/30',
    emerald: 'from-emerald-600/20 to-teal-600/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-600/20 to-orange-600/10 text-amber-400 border-amber-500/30',
    purple: 'from-purple-600/20 to-pink-600/10 text-purple-400 border-purple-500/30',
    blue: 'from-blue-600/20 to-cyan-600/10 text-blue-400 border-blue-500/30',
    rose: 'from-rose-600/20 to-pink-600/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div className={`p-5 rounded-2xl glass-card border bg-gradient-to-br ${colorMap[color] || colorMap.indigo} flex flex-col justify-between shadow-lg`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/10">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold font-display text-white tracking-tight">{value}</h3>
        {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
      </div>

      {trend && (
        <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium">Trend Indicator</span>
          <span className="font-bold text-emerald-400">{trend}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
