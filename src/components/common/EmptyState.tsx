import React from 'react';
import { LucideIcon, PlusCircle } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#FCF8F1] rounded-3xl border border-dashed border-[#E6D5C1] shadow-2xs">
      <div className="p-4 bg-[#F7F0E5] text-[#D98261] rounded-2xl mb-4 border border-[#E6D5C1]">
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-lg font-editorial font-bold text-[#29231F]">{title}</h3>
      <p className="text-xs sm:text-sm text-[#483329]/70 max-w-sm mt-1 mb-5 font-serif">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#D98261] hover:bg-[#B96E42] rounded-xl transition-all shadow-[0_4px_12px_rgba(217,130,97,0.3)] hover:-translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};
