import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  isDestructive = true,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-2xl flex-shrink-0 ${isDestructive ? 'bg-[#D98261]/20 text-[#B96E42]' : 'bg-[#E6D5C1] text-[#483329]'}`}>
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-[#483329] leading-relaxed font-medium">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E6D5C1]">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#483329] bg-[#F7F0E5] border border-[#E6D5C1] rounded-xl hover:bg-[#E6D5C1] transition-colors"
        >
          {cancelLabel}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl text-white transition-all shadow-md ${
            isDestructive 
              ? 'bg-[#B96E42] hover:bg-[#9E5730] shadow-[0_4px_12px_rgba(185,110,66,0.3)]' 
              : 'bg-[#D98261] hover:bg-[#B96E42] shadow-[0_4px_12px_rgba(217,130,97,0.3)]'
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};
