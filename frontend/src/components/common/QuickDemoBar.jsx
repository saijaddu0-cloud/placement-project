import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, UserCheck, Building2, GraduationCap, Zap } from 'lucide-react';

const QuickDemoBar = ({ onSelectRole }) => {
  const { quickDemoLogin, loading } = useAuth();

  const handleQuickLogin = async (role) => {
    const res = await quickDemoLogin(role);
    if (res.success && onSelectRole) {
      onSelectRole(role);
    }
  };

  return (
    <div className="w-full bg-slate-950/80 border-b border-indigo-500/20 backdrop-blur-md px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-2 text-indigo-400 font-semibold uppercase tracking-wider">
        <Zap className="w-4 h-4 text-amber-400 animate-bounce" />
        <span>1-Click Demo Quick Switcher:</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          disabled={loading}
          onClick={() => handleQuickLogin('ADMIN')}
          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5 transition-all font-medium"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Admin</span>
        </button>

        <button
          disabled={loading}
          onClick={() => handleQuickLogin('OFFICER')}
          className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 transition-all font-medium"
        >
          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Placement Officer</span>
        </button>

        <button
          disabled={loading}
          onClick={() => handleQuickLogin('COMPANY')}
          className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 border border-purple-500/30 flex items-center gap-1.5 transition-all font-medium"
        >
          <Building2 className="w-3.5 h-3.5 text-purple-400" />
          <span>Company HR</span>
        </button>

        <button
          disabled={loading}
          onClick={() => handleQuickLogin('STUDENT')}
          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 flex items-center gap-1.5 transition-all font-medium"
        >
          <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
          <span>Student</span>
        </button>
      </div>
    </div>
  );
};

export default QuickDemoBar;
