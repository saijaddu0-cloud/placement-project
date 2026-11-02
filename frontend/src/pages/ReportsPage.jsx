import React, { useState, useEffect } from 'react';
import StatsCard from '../components/common/StatsCard';
import { PlacementTrendChart, BranchWiseChart, SalaryDistributionChart } from '../components/charts/Charts';
import { FileBarChart, Download, FileSpreadsheet, FileText, Award, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const ReportsPage = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/analytics/overview/')
      .then(res => setAnalytics(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleDownloadPDF = () => {
    window.open('/api/reports/pdf/', '_blank');
  };

  const handleDownloadExcel = () => {
    window.open('/api/reports/excel/', '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <FileBarChart className="w-4 h-4 text-indigo-400" />
            <span>Institutional Placement Intelligence</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white mt-1">
            Analytics & Export Center
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Generate formal ReportLab PDF summary reports and multi-sheet OpenPyXL Excel worksheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
          >
            <FileText className="w-4 h-4" />
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={handleDownloadExcel}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Institutional Placement %"
          value={`${analytics?.placement_pct || 88}%`}
          subtitle="Target 90%+ for 2026 Batch"
          icon={TrendingUp}
          color="emerald"
        />
        <StatsCard
          title="Highest CTC Package"
          value={`₹${analytics?.highest_package || 24.5} LPA`}
          subtitle="Tier-1 Product Placement"
          icon={Award}
          color="purple"
        />
        <StatsCard
          title="Average CTC Package"
          value={`₹${analytics?.average_package || 7.8} LPA`}
          subtitle="Institutional Batch Mean"
          icon={FileBarChart}
          color="indigo"
        />
        <StatsCard
          title="Lowest CTC Package"
          value={`₹${analytics?.lowest_package || 3.6} LPA`}
          subtitle="Base Service Recruiters"
          icon={Users}
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-display">Branch-Wise Placement Summary</h3>
          <BranchWiseChart branchStats={analytics?.branch_stats} />
        </div>

        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-display">Salary Package Breakdown</h3>
          <SalaryDistributionChart />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
