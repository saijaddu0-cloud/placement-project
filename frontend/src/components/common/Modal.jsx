import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-panel rounded-3xl p-6 shadow-2xl border border-slate-700/60 relative">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <h2 className="text-lg font-bold text-white font-display flex items-center gap-2">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
