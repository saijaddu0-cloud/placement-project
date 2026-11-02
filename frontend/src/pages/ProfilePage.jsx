import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';
import { User, Award, FileText, CheckCircle2, Save, UploadCloud } from 'lucide-react';
import api from '../services/api';

const ProfilePage = () => {
  const { user, profile, updateProfileState } = useAuth();
  const [formData, setFormData] = useState({
    cgpa: profile?.cgpa || 8.5,
    branch: profile?.branch || 'CSE',
    section: profile?.section || 'A',
    year: profile?.year || 4,
    backlogs: profile?.backlogs || 0,
    skills: profile?.skills || 'Python, React, JavaScript, SQL, Django',
    certifications: profile?.certifications || 'AWS Certified Cloud Practitioner',
    projects: profile?.projects || 'AI Placement Management System',
    internships: profile?.internships || 'Software Intern at TechCorp',
    github_profile: profile?.github_profile || 'https://github.com/student',
    linkedin_profile: profile?.linkedin_profile || 'https://linkedin.com/in/student'
  });

  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile?.id) {
      setToast({ message: 'Profile ID not found.', type: 'warning' });
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch(`/students/${profile.id}/`, formData);
      updateProfileState(res.data);
      setToast({ message: 'Profile updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Failed to save profile changes.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* Header */}
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/30 flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Profile Management & Portfolio</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white mt-1">
            {user?.first_name} {user?.last_name} ({user?.role})
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            {user?.email} • {profile?.roll_no || 'Registered User'}
          </p>
        </div>
      </div>

      <div className="glass-panel p-8 rounded-3xl border border-slate-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
            Academic Scores & Branch Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Branch</label>
              <select
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="ME">ME</option>
                <option value="CIVIL">CIVIL</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">CGPA Score</label>
              <input
                type="number"
                step="0.1"
                value={formData.cgpa}
                onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Active Backlogs Count</label>
              <input
                type="number"
                value={formData.backlogs}
                onChange={(e) => setFormData({ ...formData, backlogs: parseInt(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3 pt-4">
            Technical Skills, Projects & Certifications
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Technical Skills (Comma-separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Key Projects Summary</label>
              <textarea
                rows={2}
                value={formData.projects}
                onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Internship Experience</label>
              <textarea
                rows={2}
                value={formData.internships}
                onChange={(e) => setFormData({ ...formData, internships: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile Details"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
