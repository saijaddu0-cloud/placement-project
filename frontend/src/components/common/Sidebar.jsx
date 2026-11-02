import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BrainCircuit,
  FileSearch,
  Briefcase,
  Layers,
  Users,
  Building2,
  FileBarChart,
  User,
  Sparkles
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['ADMIN', 'OFFICER', 'COMPANY', 'STUDENT']
    },
    {
      label: 'AI Placement Predictor',
      path: '/ml-predict',
      icon: BrainCircuit,
      roles: ['ADMIN', 'OFFICER', 'STUDENT'],
      badge: 'ML'
    },
    {
      label: 'AI Resume Analyzer',
      path: '/resume-analyzer',
      icon: FileSearch,
      roles: ['ADMIN', 'OFFICER', 'STUDENT'],
      badge: 'ATS'
    },
    {
      label: 'Placement Drives',
      path: '/drives',
      icon: Briefcase,
      roles: ['ADMIN', 'OFFICER', 'COMPANY', 'STUDENT']
    },
    {
      label: 'Applications',
      path: '/applications',
      icon: Layers,
      roles: ['ADMIN', 'OFFICER', 'COMPANY', 'STUDENT']
    },
    {
      label: 'Student Verification',
      path: '/students',
      icon: Users,
      roles: ['ADMIN', 'OFFICER']
    },
    {
      label: 'Company Recruiters',
      path: '/companies',
      icon: Building2,
      roles: ['ADMIN', 'OFFICER', 'COMPANY']
    },
    {
      label: 'Reports & Analytics',
      path: '/reports',
      icon: FileBarChart,
      roles: ['ADMIN', 'OFFICER']
    },
    {
      label: 'My Profile',
      path: '/profile',
      icon: User,
      roles: ['ADMIN', 'OFFICER', 'COMPANY', 'STUDENT']
    }
  ];

  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 p-4 flex flex-col justify-between hidden md:flex min-h-[calc(100vh-65px)]">
      <div className="space-y-6">
        <div className="px-3 py-2 bg-gradient-to-r from-indigo-900/40 via-purple-900/40 to-slate-900 rounded-xl border border-indigo-500/20">
          <p className="text-[11px] uppercase tracking-wider text-indigo-400 font-bold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Mode & Role Active
          </p>
          <p className="text-sm font-bold text-white mt-1 capitalize">{role.toLowerCase()} Navigation</p>
        </div>

        <nav className="space-y-1.5">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950/60 border border-slate-800 text-center">
        <p className="text-xs font-semibold text-slate-200">Placement Cell Helpdesk</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Need assistance? Contact TPO Support</p>
        <a
          href="mailto:tpo@university.edu"
          className="mt-2.5 inline-block w-full py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition-all"
        >
          Email Support
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
