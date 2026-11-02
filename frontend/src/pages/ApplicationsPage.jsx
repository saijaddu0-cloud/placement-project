import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { Layers, Calendar, CheckCircle2, Clock, XCircle, ArrowRight, UserCheck, Sparkles } from 'lucide-react';
import api from '../services/api';

const ApplicationsPage = () => {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [currentRound, setCurrentRound] = useState('Round 2: Technical Interview');
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const [scheduleModal, setScheduleModal] = useState(false);
  const [interviewData, setInterviewData] = useState({
    round_name: 'Technical Interview',
    scheduled_time: '2026-08-05T10:00:00Z',
    venue_or_link: 'Placement Block Room 302',
    instructions: 'Carry your ID card and printouts of your resume.'
  });

  const fetchData = () => {
    api.get('/applications/')
      .then(res => setApplications(res.data.results || res.data || []))
      .catch(err => console.log(err));

    api.get('/interviews/')
      .then(res => setInterviews(res.data.results || res.data || []))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (appId) => {
    try {
      await api.post(`/applications/${appId}/update_status/`, {
        status: newStatus,
        current_round: currentRound
      });
      setToast({ message: `Application status updated to ${newStatus}`, type: 'success' });
      setSelectedApp(null);
      fetchData();
    } catch (err) {
      setToast({ message: 'Failed to update status.', type: 'error' });
    }
  };

  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      await api.post('/interviews/', {
        application_id: selectedApp.id,
        ...interviewData
      });
      setToast({ message: 'Interview scheduled successfully!', type: 'success' });
      setScheduleModal(false);
      setSelectedApp(null);
      fetchData();
    } catch (err) {
      setToast({ message: 'Error scheduling interview.', type: 'error' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SELECTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Offered / Selected</span>;
      case 'SHORTLISTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">Shortlisted</span>;
      case 'INTERVIEWING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">Interviewing</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">Not Selected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">Applied</span>;
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
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-purple-900/40 via-indigo-900/60 to-slate-900 border border-purple-500/30 flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Recruitment Pipeline & Schedule</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white mt-1">
            Drive Applications & Interviews
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Track real-time selection rounds, candidate pipelines, and scheduled interview sessions.
          </p>
        </div>
      </div>

      {/* Scheduled Interviews Carousel / Roster */}
      {interviews.length > 0 && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white font-display flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-400" /> Upcoming Scheduled Interviews
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl glass-card border border-indigo-500/30 bg-indigo-950/20 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{item.application?.student?.user?.username || 'Candidate'}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-semibold">{item.round_name}</span>
                </div>
                <p className="text-slate-300 font-semibold">{item.application?.drive?.title}</p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between items-center">
                  <span>Venue / Link: <strong className="text-white">{item.venue_or_link}</strong></span>
                  <span className="text-indigo-400 font-mono">{new Date(item.scheduled_time).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications Roster Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white font-display">Applications Roster</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Candidate Student</th>
                <th className="pb-3">Company & Drive</th>
                <th className="pb-3">Current Round</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 font-bold text-white">
                    {app.student?.user?.first_name} {app.student?.user?.last_name}
                    <span className="block text-[11px] text-slate-400 font-mono">{app.student?.roll_no} • CGPA {app.student?.cgpa}</span>
                  </td>
                  <td className="py-3.5 text-slate-300">
                    <span className="font-bold text-indigo-400">{app.drive?.company?.company_name}</span>
                    <span className="block text-[11px] text-slate-400">{app.drive?.title} (₹{app.drive?.ctc_lpa} LPA)</span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-medium">{app.current_round}</td>
                  <td className="py-3.5">{getStatusBadge(app.status)}</td>
                  <td className="py-3.5 text-right space-x-2">
                    {(role === 'COMPANY' || role === 'ADMIN' || role === 'OFFICER') && (
                      <>
                        <button
                          onClick={() => { setSelectedApp(app); setScheduleModal(true); }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-semibold border border-indigo-500/30 transition-all"
                        >
                          Schedule Interview
                        </button>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 transition-all"
                        >
                          Update Status
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        isOpen={!!selectedApp && !scheduleModal}
        onClose={() => setSelectedApp(null)}
        title="Update Candidate Application Status"
      >
        {selectedApp && (
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <p className="font-bold text-white">{selectedApp.student?.user?.first_name} {selectedApp.student?.user?.last_name}</p>
              <p className="text-slate-400">{selectedApp.drive?.company?.company_name} - {selectedApp.drive?.title}</p>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Select New Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              >
                <option value="APPLIED">Applied</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="INTERVIEWING">Interview Scheduled</option>
                <option value="SELECTED">Selected / Offered</option>
                <option value="REJECTED">Rejected / Not Selected</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Current Round Description</label>
              <input
                type="text"
                value={currentRound}
                onChange={(e) => setCurrentRound(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <button
              onClick={() => handleStatusUpdate(selectedApp.id)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25 mt-3"
            >
              Save Application Update
            </button>
          </div>
        )}
      </Modal>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={scheduleModal}
        onClose={() => setScheduleModal(false)}
        title="Schedule Candidate Interview"
      >
        <form onSubmit={handleScheduleInterview} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Interview Round Name</label>
            <input
              type="text"
              required
              value={interviewData.round_name}
              onChange={(e) => setInterviewData({ ...interviewData, round_name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Date & Time</label>
            <input
              type="datetime-local"
              required
              value={interviewData.scheduled_time.slice(0, 16)}
              onChange={(e) => setInterviewData({ ...interviewData, scheduled_time: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Venue or Video Call Link</label>
            <input
              type="text"
              required
              value={interviewData.venue_or_link}
              onChange={(e) => setInterviewData({ ...interviewData, venue_or_link: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold transition-all shadow-lg shadow-indigo-500/25 mt-3"
          >
            Confirm & Send Interview Invite
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default ApplicationsPage;
