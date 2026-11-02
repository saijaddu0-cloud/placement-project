import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import StatsCard from '../components/common/StatsCard';
import { PlacementTrendChart, BranchWiseChart, SalaryDistributionChart, MLProbabilityGauge, ReadinessRadarChart } from '../components/charts/Charts';
import {
  Users, Building2, Briefcase, Award, TrendingUp, CheckCircle2,
  Clock, AlertCircle, FileSearch, BrainCircuit, ArrowUpRight, Megaphone
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const role = user?.role || 'STUDENT';

  const [analytics, setAnalytics] = useState(null);
  const [drives, setDrives] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    api.get('/analytics/overview/')
      .then(res => setAnalytics(res.data))
      .catch(err => console.log(err));

    api.get('/drives/')
      .then(res => setDrives(res.data.results || res.data || []))
      .catch(err => console.log(err));

    api.get('/announcements/')
      .then(res => setAnnouncements(res.data.results || res.data || []))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            {role} Portal Active
          </span>
          <h2 className="text-2xl font-extrabold font-display text-white mt-2">
            Welcome back, {user?.first_name || user?.username}!
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Institutional Campus Recruitment Season 2026 • AI-Powered Placement Hub
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/ml-predict"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Launch ML Predictor</span>
          </Link>
          <Link
            to="/resume-analyzer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <FileSearch className="w-4 h-4 text-purple-400" />
            <span>Analyze Resume</span>
          </Link>
        </div>
      </div>

      {/* Announcements Marquee */}
      {announcements.length > 0 && (
        <div className="p-4 rounded-2xl glass-card border border-amber-500/30 bg-amber-950/20 flex items-center gap-3">
          <Megaphone className="w-5 h-5 text-amber-400 flex-shrink-0 animate-bounce" />
          <div className="text-xs text-amber-200">
            <span className="font-bold text-amber-400 uppercase tracking-wider mr-2">[Announcement]</span>
            <span className="font-semibold">{announcements[0].title}:</span> {announcements[0].content}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Students"
          value={analytics?.total_students || 120}
          subtitle={`${analytics?.verified_students || 105} Verified Profiles`}
          icon={Users}
          color="indigo"
          trend="+12% this year"
        />
        <StatsCard
          title="Placement Rate"
          value={`${analytics?.placement_pct || 88}%`}
          subtitle={`${analytics?.placed_students || 95} Students Placed`}
          icon={TrendingUp}
          color="emerald"
          trend="Highest Record"
        />
        <StatsCard
          title="Highest Package"
          value={`₹${analytics?.highest_package || 24.5} LPA`}
          subtitle={`Average ₹${analytics?.average_package || 7.8} LPA`}
          icon={Award}
          color="purple"
          trend="Top Tier-1 CTC"
        />
        <StatsCard
          title="Active Drives"
          value={analytics?.active_drives || drives.length || 6}
          subtitle={`${analytics?.total_companies || 18} Participating Recruiters`}
          icon={Briefcase}
          color="amber"
          trend="Accepting Applications"
        />
      </div>

      {/* Main Charts & Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white font-display">Placement Progress & Monthly Hiring</h3>
              <p className="text-xs text-slate-400 mt-0.5">Cumulative candidate selections over season months</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300">Live Analytics</span>
          </div>
          <PlacementTrendChart data={analytics?.monthly_trends} />
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white font-display">Salary Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">CTC bracket breakdown in LPA</p>
            </div>
          </div>
          <SalaryDistributionChart />
        </div>
      </div>

      {/* Secondary Row: Branch Stats & Active Drives Roster */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="pb-4 mb-4 border-b border-slate-800">
            <h3 className="text-base font-bold text-white font-display">Branch-Wise Placements</h3>
            <p className="text-xs text-slate-400 mt-0.5">Selection percentages across engineering branches</p>
          </div>
          <BranchWiseChart branchStats={analytics?.branch_stats} />
        </div>

        {/* Student Placement Readiness Widget or Active Drives */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-3xl border border-slate-800">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white font-display">Active Campus Recruitment Drives</h3>
              <p className="text-xs text-slate-400 mt-0.5">Latest company drives accepting student applications</p>
            </div>
            <Link to="/drives" className="text-xs text-indigo-400 font-semibold hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {drives.slice(0, 3).map((drive) => (
              <div key={drive.id} className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">{drive.company?.company_name || 'Tier-1 Recruiter'}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{drive.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">CTC: <span className="text-emerald-400 font-semibold">₹{drive.ctc_lpa} LPA</span> • Eligible: {drive.eligible_branches} • Min CGPA: {drive.min_cgpa}</p>
                </div>
                <Link
                  to="/drives"
                  className="px-3.5 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all flex-shrink-0"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
