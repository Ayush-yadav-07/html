import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  };
  colorScheme?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky' | 'purple' | 'slate' | 'terracotta' | 'olive' | 'espresso' | 'sand' | 'clay';
  onClick?: () => void;
  featured?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  subtitle,
  badge,
  onClick,
  featured = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`paper-card rounded-2xl p-5 border border-[#E6D5C1] transition-all duration-200 group relative overflow-hidden ${
        onClick ? 'cursor-pointer hover:-translate-y-1 hover:border-[#D98261]' : ''
      } ${
        featured ? 'bg-[#FCF8F1] ring-1 ring-[#D98261]/30 shadow-md' : 'bg-[#FCF8F1]'
      }`}
    >
      {/* Subtle warm accent watermark border on hover */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#D98261] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#B96E42] truncate">
            {title}
          </p>
          <h4 className="text-2xl sm:text-3xl font-editorial font-bold text-[#29231F] mt-1 tracking-tight truncate tabular-nums">
            {value}
          </h4>
          {subtitle && (
            <p className="text-xs text-[#483329]/70 mt-1 truncate font-medium">
              {subtitle}
            </p>
          )}
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#F7F0E5] border border-[#E6D5C1] flex items-center justify-center text-[#B96E42] shrink-0 group-hover:bg-[#D98261] group-hover:text-white group-hover:border-[#D98261] transition-colors shadow-2xs">
          {icon}
        </div>
      </div>

      {badge && (
        <div className="mt-3 pt-3 border-t border-[#E6D5C1]/70 flex items-center">
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[#E6D5C1]/40 text-[#483329] border border-[#E6D5C1]">
            {badge.text}
          </span>
        </div>
      )}
    </div>
  );
};
