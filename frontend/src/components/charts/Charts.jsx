import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const PlacementTrendChart = ({ data }) => {
  const chartData = {
    labels: data ? data.map(d => d.month) : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Placed Students',
        data: data ? data.map(d => d.placements) : [14, 28, 45, 62, 85, 110],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#a855f7',
        pointRadius: 5
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a', titleColor: '#fff', bodyColor: '#cbd5e1' }
    },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } }
    }
  };

  return <Line data={chartData} options={options} />;
};

export const BranchWiseChart = ({ branchStats }) => {
  const chartData = {
    labels: branchStats ? branchStats.map(b => b.branch_code) : ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CIVIL'],
    datasets: [
      {
        label: 'Placement %',
        data: branchStats ? branchStats.map(b => b.placement_pct) : [92, 88, 79, 68, 62, 55],
        backgroundColor: [
          '#6366f1',
          '#3b82f6',
          '#a855f7',
          '#10b981',
          '#f59e0b',
          '#ec4899'
        ],
        borderRadius: 8
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a' }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' }, max: 100 }
    }
  };

  return <Bar data={chartData} options={options} />;
};

export const SalaryDistributionChart = () => {
  const chartData = {
    labels: ['3.5 - 6 LPA', '6 - 10 LPA', '10 - 15 LPA', '15+ LPA'],
    datasets: [
      {
        data: [45, 35, 15, 5],
        backgroundColor: ['#3b82f6', '#10b981', '#a855f7', '#f43f5e'],
        borderWidth: 0
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12 } }
    },
    cutout: '70%'
  };

  return <Doughnut data={chartData} options={options} />;
};

export const ReadinessRadarChart = ({ meterData }) => {
  const chartData = {
    labels: ['Technical', 'Communication', 'Resume ATS', 'Interview', 'Overall'],
    datasets: [
      {
        label: 'Readiness Level Score (%)',
        data: meterData ? [
          meterData.technical,
          meterData.communication,
          meterData.resume,
          meterData.interview,
          meterData.overall
        ] : [90, 75, 82, 80, 85],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        pointBackgroundColor: '#a855f7',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1'
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,0.1)' },
        grid: { color: 'rgba(255,255,255,0.1)' },
        pointLabels: { color: '#cbd5e1', font: { size: 11 } },
        ticks: { backdropColor: 'transparent', color: '#64748b' },
        min: 0,
        max: 100
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return <Radar data={chartData} options={options} />;
};

export const MLProbabilityGauge = ({ percentage = 85 }) => {
  const getColor = (pct) => {
    if (pct >= 75) return '#10b981'; // Green
    if (pct >= 50) return '#f59e0b'; // Amber
    return '#f43f5e'; // Red
  };

  const color = getColor(percentage);

  return (
    <div className="flex flex-col items-center justify-center p-6 glass-card rounded-3xl border border-slate-700/50 text-center relative overflow-hidden">
      <div className="w-40 h-40 rounded-full border-8 border-slate-800 flex items-center justify-center relative shadow-inner">
        <div
          className="absolute inset-0 rounded-full border-8 border-transparent transition-all duration-1000"
          style={{
            borderColor: color,
            clipPath: `inset(0 0 ${100 - percentage}% 0)`
          }}
        />
        <div className="text-center">
          <span className="text-4xl font-extrabold font-display text-white">{percentage}%</span>
          <p className="text-[11px] font-medium text-slate-400 mt-0.5">Placement Chance</p>
        </div>
      </div>

      <div className="mt-4">
        <span
          className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block"
          style={{ backgroundColor: `${color}20`, color: color, border: `1px solid ${color}40` }}
        >
          {percentage >= 75 ? "High Placement Potential" : percentage >= 50 ? "Moderate Readiness" : "Action Required"}
        </span>
      </div>
    </div>
  );
};
