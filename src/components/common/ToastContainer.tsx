import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useEventContext } from '../../context/EventContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useEventContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let icon = <CheckCircle2 className="w-5 h-5 text-[#A6A77A]" />;
        let borderClass = 'border-[#A6A77A]/50 bg-[#FCF8F1]';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-[#B96E42]" />;
          borderClass = 'border-[#B96E42]/50 bg-[#FCF8F1]';
        } else if (toast.type === 'warning') {
          icon = <AlertTriangle className="w-5 h-5 text-[#D98261]" />;
          borderClass = 'border-[#D98261]/50 bg-[#FCF8F1]';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-[#D98261]" />;
          borderClass = 'border-[#E6D5C1] bg-[#FCF8F1]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-[0_10px_30px_rgba(72,51,41,0.15)] ${borderClass} transition-all transform animate-in slide-in-from-right duration-200`}
            role="status"
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0">{icon}</span>
              <p className="text-xs sm:text-sm font-semibold text-[#29231F] leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#483329]/50 hover:text-[#29231F] p-1 rounded-lg transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
