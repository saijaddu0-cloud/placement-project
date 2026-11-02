import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import QuickDemoBar from '../components/common/QuickDemoBar';
import Toast from '../components/common/Toast';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setToast({ message: 'Please fill in both username and password.', type: 'warning' });
      return;
    }

    const res = await login(username, password);
    if (res.success) {
      navigate('/dashboard');
    } else {
      setToast({ message: res.error, type: 'error' });
    }
  };

  const handleQuickDemoSelect = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between relative overflow-hidden">
      {/* 1-Click Quick Demo Bar */}
      <QuickDemoBar onSelectRole={handleQuickDemoSelect} />

      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* Decorative Gradient Orbs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 glass-panel rounded-3xl overflow-hidden shadow-2xl border border-slate-800">

          {/* Left Panel: Branding & Features */}
          <div className="p-8 bg-gradient-to-br from-indigo-950/80 via-slate-900 to-purple-950/80 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="font-display font-bold text-xl text-white">Campus Placement</h1>
              </div>

              <div className="mt-8 space-y-4">
                <h2 className="text-2xl font-extrabold font-display text-white leading-tight">
                  AI-Powered Campus Recruitment & Skill Readiness Portal
                </h2>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automated drive matching, ML placement probability predictions, ATS resume parsing, and institutional analytics for Students, Recruiters, and TPO Officers.
                </p>
              </div>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>ML Model Placement Probability & Expected CTC Engine</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>AI Resume Parser with ATS Score & Skill Gap Analysis</span>
                </div>
                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Role-Based Access: Admin, TPO, Company & Student</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Placement Season 2026</span>
              <span className="text-indigo-400 font-semibold">Tier-1 Institutional Portal</span>
            </div>
          </div>

          {/* Right Panel: Login Form */}
          <div className="p-8 flex flex-col justify-center bg-slate-900/60">
            <div className="mb-6">
              <h3 className="text-xl font-bold font-display text-white">Sign In to Your Account</h3>
              <p className="text-xs text-slate-400 mt-1">Select demo role above or enter credentials</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username / Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. admin or student"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 mt-2"
              >
                {loading ? "Authenticating..." : "Sign In to Portal"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-indigo-400 font-semibold hover:underline">
                  Register as Student or Company
                </Link>
              </p>
            </div>
          </div>

        </div>
      </div>

      <footer className="py-3 text-center text-xs text-slate-500 border-t border-slate-900">
        Placement Management System © 2026 | Built with React, Django REST & Scikit-Learn ML
      </footer>
    </div>
  );
};

export default LoginPage;
