import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/common/Toast';
import { FileSearch, UploadCloud, CheckCircle2, AlertCircle, Sparkles, FileText, ArrowRight } from 'lucide-react';
import api from '../services/api';

const ResumeAnalyzerPage = () => {
  const { profile, updateProfileState } = useAuth();
  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      setToast({ message: 'Please select a PDF resume to upload.', type: 'warning' });
      return;
    }

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.post('/resume/parse/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResults(res.data);
      setToast({ message: `Resume parsed cleanly! ATS Score: ${res.data.ats_score}%`, type: 'success' });

      // Update local profile state with new ATS score if available
      if (profile) {
        updateProfileState({ ...profile, ats_resume_score: res.data.ats_score });
      }
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Error parsing resume file.', type: 'error' });
    } finally {
      setAnalyzing(false);
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
      <div className="p-6 rounded-3xl glass-panel bg-gradient-to-r from-pink-900/40 via-purple-900/60 to-slate-900 border border-pink-500/30 shadow-xl flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-pink-400 uppercase tracking-wider">
            <FileSearch className="w-4 h-4 text-pink-400" />
            <span>AI Resume Parser & ATS Scoring Engine</span>
          </div>
          <h2 className="text-2xl font-extrabold font-display text-white mt-1">
            Automated PDF Resume Analyzer
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Upload your PDF resume to extract contact details, technical skills, ATS match score, and formatting suggestions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Upload Form */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <UploadCloud className="w-4 h-4 text-indigo-400" /> Select Resume PDF
          </h3>

          <div className="border-2 border-dashed border-slate-700/80 rounded-3xl p-6 text-center hover:border-indigo-500/50 transition-all bg-slate-900/40">
            <FileText className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-xs text-slate-300 font-semibold">{file ? file.name : "Drag & drop PDF resume or click below"}</p>
            <p className="text-[11px] text-slate-500 mt-1">Supports PDF format up to 10MB</p>

            <input
              type="file"
              accept=".pdf"
              id="resume-input"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="resume-input"
              className="mt-4 inline-block px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer transition-all"
            >
              Browse PDF File
            </label>
          </div>

          <button
            onClick={handleUploadAndAnalyze}
            disabled={analyzing || !file}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:opacity-95 text-white font-semibold text-xs transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{analyzing ? "Extracting & Analyzing PDF..." : "Analyze Resume with AI"}</span>
          </button>

          {profile?.resume && (
            <div className="p-3.5 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
              <span>Current Saved Resume:</span>
              <a href={profile.resume} target="_blank" rel="noreferrer" className="text-indigo-400 font-semibold underline">
                View PDF
              </a>
            </div>
          )}
        </div>

        {/* Right Output Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {results ? (
            <div className="space-y-6">
              {/* ATS Score Meter */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex items-center justify-between flex-wrap gap-4 bg-gradient-to-r from-slate-900 to-indigo-950/50">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">ATS Match Calculator</span>
                  <h3 className="text-xl font-bold font-display text-white mt-0.5">Resume Strength & ATS Score</h3>
                  <p className="text-xs text-slate-400 mt-1">Evaluated against tier-1 recruiter search algorithms</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full border-4 border-indigo-500/30 flex items-center justify-center bg-slate-900/80 shadow-lg">
                    <span className="text-2xl font-extrabold font-display text-emerald-400">{results.ats_score}%</span>
                  </div>
                </div>
              </div>

              {/* Extracted Details & Skills */}
              <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-white font-display border-b border-slate-800 pb-3">
                  Parsed Contact Details & Technical Skills
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-slate-400 font-semibold">Extracted Email:</span>
                    <p className="text-white font-bold mt-0.5">{results.extracted_email || "Detected in document"}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50">
                    <span className="text-slate-400 font-semibold">Extracted Phone:</span>
                    <p className="text-white font-bold mt-0.5">{results.extracted_phone || "Detected in header"}</p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-2">Detected Technical Skills:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {results.extracted_skills?.map((sk, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-medium">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Suggestions & Missing Skills */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Resume Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {results.strengths?.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" /> Recommended Improvements
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {results.suggestions?.map((s, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
              <FileSearch className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-base font-bold text-white font-display">No Resume Selected Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Upload your PDF resume on the left panel to trigger the AI NLP parsing & ATS scoring algorithm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeAnalyzerPage;
