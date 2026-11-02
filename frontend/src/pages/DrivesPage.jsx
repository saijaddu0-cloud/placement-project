import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { Briefcase, Search, Filter, MapPin, Calendar, Award, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import api from '../services/api';

const DrivesPage = () => {
  const { user, profile } = useAuth();
  const role = user?.role || 'STUDENT';

  const [drives, setDrives] = useState([]);
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'info' });
  const [applying, setApplying] = useState(false);

  const [newDrive, setNewDrive] = useState({
    title: '',
    job_role: '',
    description: '',
    ctc_lpa: '8.5',
    job_type: 'FULLTIME',
    location: 'Bangalore / Remote',
    min_cgpa: '7.0',
    eligible_branches: 'CSE,IT,ECE',
    max_backlogs: '0',
    required_skills: 'Python, React, SQL',
    deadline: '2026-08-30T23:59:00Z'
  });

  const fetchDrives = () => {
    let url = `/drives/?search=${search}`;
    api.get(url)
      .then(res => setDrives(res.data.results || res.data || []))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchDrives();
  }, [search]);

  const handleApply = async (driveId) => {
    setApplying(true);
    try {
      await api.post('/applications/', { drive_id: driveId });
      setToast({ message: 'Application submitted successfully!', type: 'success' });
      setSelectedDrive(null);
      fetchDrives();
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Failed to submit application.', type: 'error' });
    } finally {
      setApplying(false);
    }
  };

  const handlePostDrive = async (e) => {
    e.preventDefault();
    try {
      await api.post('/drives/', newDrive);
      setToast({ message: 'Placement drive posted successfully!', type: 'success' });
      setShowPostModal(false);
      fetchDrives();
    } catch (err) {
      setToast({ message: 'Failed to post drive. Check form inputs.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <Toast
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ message: '', type: 'info' })}
      />

      {/* Header Banner */}
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-indigo-900/60 via-slate-900 to-purple-900/40 border border-indigo-500/30 flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            <span>Campus Recruitment Board</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white mt-1">
            Active Placement Drives
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Browse active hiring drives, check criteria eligibility, and apply with 1-click.
          </p>
        </div>

        {(role === 'COMPANY' || role === 'ADMIN' || role === 'OFFICER') && (
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Drive</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company name, role, or title..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white"
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="ME">ME</option>
          </select>
        </div>
      </div>

      {/* Drives Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drives.map((drive) => {
          const isEligible = profile ? (profile.cgpa >= drive.min_cgpa && profile.backlogs <= drive.max_backlogs) : true;

          return (
            <div
              key={drive.id}
              className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg group"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    {drive.company?.company_name || 'Tier-1 Recruiter'}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isEligible ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                    {isEligible ? "Eligible" : "Criteria Gap"}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mt-3 font-display group-hover:text-indigo-400 transition-colors">
                  {drive.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{drive.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Package CTC:</span>
                    <span className="font-extrabold text-emerald-400 text-sm">₹{drive.ctc_lpa} LPA</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Location:</span>
                    <span>{drive.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-400">Min CGPA Cutoff:</span>
                    <span className="font-semibold">{drive.min_cgpa}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedDrive(drive)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white font-semibold text-xs transition-all border border-slate-700 hover:border-indigo-500 shadow-sm"
              >
                View Drive Details
              </button>
            </div>
          );
        })}
      </div>

      {/* Drive Detail Modal */}
      <Modal
        isOpen={!!selectedDrive}
        onClose={() => setSelectedDrive(null)}
        title={selectedDrive?.title}
      >
        {selectedDrive && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">{selectedDrive.company?.company_name}</p>
                <p className="text-slate-300 mt-0.5">Role: {selectedDrive.job_role}</p>
              </div>
              <span className="text-xl font-extrabold text-emerald-400">₹{selectedDrive.ctc_lpa} LPA</span>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">Job Description & Responsibilities:</h4>
              <p className="text-slate-300 leading-relaxed">{selectedDrive.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div>
                <span className="text-slate-400">Minimum CGPA:</span>
                <p className="font-bold text-white mt-0.5">{selectedDrive.min_cgpa}</p>
              </div>
              <div>
                <span className="text-slate-400">Eligible Branches:</span>
                <p className="font-bold text-white mt-0.5">{selectedDrive.eligible_branches}</p>
              </div>
              <div>
                <span className="text-slate-400">Max Backlogs Allowed:</span>
                <p className="font-bold text-white mt-0.5">{selectedDrive.max_backlogs}</p>
              </div>
              <div>
                <span className="text-slate-400">Job Type:</span>
                <p className="font-bold text-white mt-0.5">{selectedDrive.job_type}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">Selection Process Rounds:</h4>
              <p className="text-slate-300">{selectedDrive.rounds}</p>
            </div>

            {role === 'STUDENT' && (
              <button
                onClick={() => handleApply(selectedDrive.id)}
                disabled={applying}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs transition-all shadow-lg shadow-indigo-500/25 mt-4"
              >
                {applying ? "Submitting Application..." : "Submit 1-Click Drive Application"}
              </button>
            )}
          </div>
        )}
      </Modal>

      {/* Post Drive Modal */}
      <Modal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        title="Post New Placement Drive"
      >
        <form onSubmit={handlePostDrive} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Drive Title</label>
            <input
              type="text"
              required
              value={newDrive.title}
              onChange={(e) => setNewDrive({ ...newDrive, title: e.target.value })}
              placeholder="e.g. Software Engineer Graduate 2026"
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Job Role</label>
              <input
                type="text"
                required
                value={newDrive.job_role}
                onChange={(e) => setNewDrive({ ...newDrive, job_role: e.target.value })}
                placeholder="e.g. Full Stack Developer"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">CTC (LPA)</label>
              <input
                type="number"
                step="0.1"
                required
                value={newDrive.ctc_lpa}
                onChange={(e) => setNewDrive({ ...newDrive, ctc_lpa: e.target.value })}
                placeholder="8.5"
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              required
              value={newDrive.description}
              onChange={(e) => setNewDrive({ ...newDrive, description: e.target.value })}
              placeholder="Job responsibilities and requirements..."
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Min CGPA</label>
              <input
                type="number"
                step="0.1"
                value={newDrive.min_cgpa}
                onChange={(e) => setNewDrive({ ...newDrive, min_cgpa: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Eligible Branches</label>
              <input
                type="text"
                value={newDrive.eligible_branches}
                onChange={(e) => setNewDrive({ ...newDrive, eligible_branches: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25 mt-3"
          >
            Publish Recruitment Drive
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default DrivesPage;
