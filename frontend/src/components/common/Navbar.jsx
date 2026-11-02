import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { Bell, LogOut, User as UserIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      api.get('/notifications/')
        .then(res => setNotifications(res.data.results || res.data || []))
        .catch(err => console.log(err));
    }
  }, [user]);

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">System Admin</span>;
      case 'OFFICER':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">TPO Officer</span>;
      case 'COMPANY':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">Recruiter</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">Student</span>;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 px-6 py-3.5 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg text-white tracking-tight leading-none flex items-center gap-2">
            Campus Placement Portal <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono">v2.0 AI</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">AI-Powered Placement & Skill Readiness Engine</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-all relative border border-slate-700/50"
          >
            <Bell className="w-5 h-5" />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-pink-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl glass-panel p-4 shadow-2xl z-50 border border-slate-700">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="font-semibold text-sm text-white">Notifications</h3>
                <span className="text-xs text-indigo-400 font-medium">{notifications.length} Unread</span>
              </div>
              <div className="max-h-64 overflow-y-auto mt-2 space-y-2">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4 text-center">No notifications right now.</p>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/40 text-xs">
                      <p className="font-semibold text-slate-200">{n.title}</p>
                      <p className="text-slate-400 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <ThemeToggle />

        {/* User Role Badge & Profile */}
        {user && (
          <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-white flex items-center justify-end gap-1.5">
                {user.first_name || user.username}
                {getRoleBadge(user.role)}
              </p>
              <p className="text-[11px] text-slate-400">{user.email}</p>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-all border border-rose-500/20"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
