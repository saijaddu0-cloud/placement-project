import React, { useState, useEffect } from 'react';
import { Building2, Globe, Mail, Briefcase } from 'lucide-react';
import api from '../services/api';

const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    api.get('/companies/')
      .then(res => setCompanies(res.data.results || res.data || []))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-purple-900/40 via-indigo-900/60 to-slate-900 border border-purple-500/30 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-purple-400" />
            <span>Campus Corporate Partners</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white mt-1">
            Participating Companies & Recruiters
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Verified corporate partners posting placement drives for the 2026 graduating batch.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((comp) => (
          <div key={comp.id} className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4 hover:border-purple-500/40 transition-all shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 text-lg">
                {comp.company_name[0]}
              </div>
              <div>
                <h3 className="font-bold text-white text-base font-display">{comp.company_name}</h3>
                <span className="text-[11px] text-purple-400 font-medium">{comp.industry}</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{comp.description || 'Global industry partner conducting campus recruitment drives.'}</p>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-400" />
                <span>{comp.hr_name || 'HR Team'} ({comp.hr_email})</span>
              </div>
              {comp.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <a href={comp.website} target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">
                    {comp.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompaniesPage;
