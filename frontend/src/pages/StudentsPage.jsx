import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/common/Modal';
import Toast from '../components/common/Toast';
import { Users, CheckCircle2, XCircle, Search, Filter, FileText, Award } from 'lucide-react';
import api from '../services/api';

const StudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const fetchStudents = () => {
    let url = `/students/?search=${search}`;
    if (verificationFilter) url += `&verification_status=${verificationFilter}`;
    api.get(url)
      .then(res => setStudents(res.data.results || res.data || []))
      .catch(err => console.log(err));
  };

  useEffect(() => {
    fetchStudents();
  }, [search, verificationFilter]);

  const handleVerify = async (studentId, statusChoice) => {
    try {
      await api.post(`/students/${studentId}/verify/`, { status: statusChoice });
      setToast({ message: `Student status updated to ${statusChoice}`, type: 'success' });
      setSelectedStudent(null);
      fetchStudents();
    } catch (err) {
      setToast({ message: 'Error updating student verification.', type: 'error' });
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
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-emerald-900/40 via-indigo-900/60 to-slate-900 border border-emerald-500/30 flex items-center justify-between flex-wrap gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Placement Officer & Admin Audit Queue</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white mt-1">
            Student Profile Verification Roster
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Audit academic credentials, CGPA, backlogs, skills, and PDF resumes for placement drive readiness.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or roll number..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder:text-slate-500"
          />
        </div>

        <select
          value={verificationFilter}
          onChange={(e) => setVerificationFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white"
        >
          <option value="">All Verification Statuses</option>
          <option value="PENDING">Pending Verification</option>
          <option value="VERIFIED">Verified</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Roll No & Name</th>
                <th className="pb-3">Branch</th>
                <th className="pb-3">Academic CGPA</th>
                <th className="pb-3">Backlogs</th>
                <th className="pb-3">ATS Resume Score</th>
                <th className="pb-3">Verification</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {students.map((st) => (
                <tr key={st.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 font-bold text-white">
                    {st.user?.first_name} {st.user?.last_name}
                    <span className="block text-[11px] text-indigo-400 font-mono">{st.roll_no}</span>
                  </td>
                  <td className="py-3.5 text-slate-300 font-semibold">{st.branch}</td>
                  <td className="py-3.5 font-extrabold text-emerald-400">{st.cgpa}</td>
                  <td className="py-3.5">
                    <span className={st.backlogs === 0 ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                      {st.backlogs}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-purple-400">{st.ats_resume_score}%</td>
                  <td className="py-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      st.verification_status === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      st.verification_status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-rose-500/20 text-rose-300'
                    }`}>
                      {st.verification_status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setSelectedStudent(st)}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 font-semibold border border-indigo-500/30 transition-all"
                    >
                      Audit & Verify
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Profile Verification & Audit"
      >
        {selectedStudent && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between">
              <div>
                <p className="font-bold text-white text-sm">{selectedStudent.user?.first_name} {selectedStudent.user?.last_name}</p>
                <p className="text-slate-300">{selectedStudent.roll_no} • {selectedStudent.branch} Branch</p>
              </div>
              <span className="text-xl font-extrabold text-emerald-400">CGPA: {selectedStudent.cgpa}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <span className="text-slate-400">10th Score:</span>
                <p className="font-bold text-white mt-0.5">{selectedStudent.tenth_pct}%</p>
              </div>
              <div>
                <span className="text-slate-400">12th Score:</span>
                <p className="font-bold text-white mt-0.5">{selectedStudent.twelfth_pct}%</p>
              </div>
              <div>
                <span className="text-slate-400">Active Backlogs:</span>
                <p className="font-bold text-white mt-0.5">{selectedStudent.backlogs}</p>
              </div>
              <div>
                <span className="text-slate-400">ATS Resume Score:</span>
                <p className="font-bold text-purple-400 mt-0.5">{selectedStudent.ats_resume_score}%</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-1">Skills & Certifications:</h4>
              <p className="text-slate-300">{selectedStudent.skills || "Not provided"}</p>
            </div>

            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleVerify(selectedStudent.id, 'VERIFIED')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg"
              >
                Approve & Verify Profile
              </button>
              <button
                onClick={() => handleVerify(selectedStudent.id, 'REJECTED')}
                className="flex-1 py-2.5 rounded-xl bg-rose-600/30 hover:bg-rose-600 text-rose-200 hover:text-white font-bold transition-all border border-rose-500/30"
              >
                Reject / Request Update
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentsPage;
