import React, { useEffect, useState } from 'react';
import { CheckCircle2, X, Info, AlertTriangle } from 'lucide-react';

export default function Toast({ message, type = 'success', duration = 5000, onClose }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for exit animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[#c4eec6]" />,
    info: <Info className="w-5 h-5 text-blue-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-orange-400" />,
    error: <X className="w-5 h-5 text-red-400" />
  };

  const colors = {
    success: 'border-[#c4eec6]/20 bg-[#c4eec6]/5',
    info: 'border-blue-400/20 bg-blue-400/5',
    warning: 'border-orange-400/20 bg-orange-400/5',
    error: 'border-red-400/20 bg-red-400/5'
  };

  return (
    <div className={`fixed top-10 right-10 z-[200] transition-all duration-500 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
      <div className={`flex items-start gap-4 p-5 rounded-[1.5rem] border backdrop-blur-3xl shadow-2xl min-w-[320px] max-w-[420px] ${colors[type]}`}>
        <div className="shrink-0 mt-0.5">
          {icons[type]}
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-[10px] font-bold text-white uppercase tracking-widest">
            {type === 'success' ? 'System Synchronization' : 'System Alert'}
          </p>
          <p className="text-xs font-medium text-white/70 leading-relaxed">
            {message}
          </p>
        </div>
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="shrink-0 text-white/20 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 h-[2px] bg-white/10 w-full overflow-hidden rounded-full">
          <div 
            className={`h-full transition-all duration-[5000ms] ease-linear ${type === 'success' ? 'bg-[#c4eec6]' : 'bg-white'}`}
            style={{ width: isVisible ? '0%' : '100%' }}
          ></div>
        </div>
      </div>
    </div>
  );
}
