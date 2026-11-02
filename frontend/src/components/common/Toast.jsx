import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const Toast = ({ type = 'success', message, onClose, duration = 4000 }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: { icon: CheckCircle2, bg: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-300' },
    error: { icon: XCircle, bg: 'bg-rose-950/90 border-rose-500/40 text-rose-300' },
    warning: { icon: AlertTriangle, bg: 'bg-amber-950/90 border-amber-500/40 text-amber-300' },
    info: { icon: Info, bg: 'bg-indigo-950/90 border-indigo-500/40 text-indigo-300' },
  };

  const Config = typeConfig[type] || typeConfig.info;
  const Icon = Config.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slideUp">
      <div className={`px-4 py-3 rounded-2xl backdrop-blur-md border shadow-2xl flex items-center gap-3 ${Config.bg}`}>
        <Icon className="w-5 h-5 flex-shrink-0" />
        <span className="text-xs font-semibold">{message}</span>
        <button onClick={onClose} className="p-1 hover:opacity-70">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
