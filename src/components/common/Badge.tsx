import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'terracotta' | 'olive' | 'sand' | 'espresso' | 'clay' | 'neutral' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  size = 'sm',
  className = '' 
}) => {
  // Warm editorial 3D palette: Ivory, Cream, Terracotta (#D98261), Burnt Clay (#B96E42), Espresso (#483329), Olive (#A6A77A), Sand (#E6D5C1), Deep Ink (#29231F)
  const variantStyles = {
    terracotta: 'bg-[#D98261]/15 text-[#B96E42] border-[#D98261]/40 font-semibold',
    clay: 'bg-[#B96E42] text-[#FCF8F1] border-[#B96E42] font-semibold',
    olive: 'bg-[#A6A77A]/20 text-[#555635] border-[#A6A77A]/50 font-semibold',
    sand: 'bg-[#E6D5C1]/50 text-[#483329] border-[#E6D5C1] font-medium',
    espresso: 'bg-[#483329] text-[#FCF8F1] border-[#483329] font-medium',
    neutral: 'bg-[#FCF8F1] text-[#483329] border-[#E6D5C1] font-medium',
    success: 'bg-[#A6A77A]/20 text-[#4D4E30] border-[#A6A77A]/60 font-semibold',
    warning: 'bg-[#D98261]/20 text-[#B96E42] border-[#D98261]/50 font-semibold',
    error: 'bg-[#B96E42]/20 text-[#8C3A19] border-[#B96E42]/50 font-semibold',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-0.5 rounded-full',
    md: 'text-xs px-3 py-1 rounded-full',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 border shadow-2xs ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}>
      {children}
    </span>
  );
};

export const RSVPBadge: React.FC<{ status: 'Confirmed' | 'Pending' | 'Declined' }> = ({ status }) => {
  if (status === 'Confirmed') {
    return (
      <Badge variant="olive">
        <span className="w-1.5 h-1.5 rounded-full bg-[#555635]"></span>
        Confirmed
      </Badge>
    );
  }
  if (status === 'Pending') {
    return (
      <Badge variant="terracotta">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D98261]"></span>
        Pending
      </Badge>
    );
  }
  return (
    <Badge variant="sand">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8A7969]"></span>
      Declined
    </Badge>
  );
};

export const TaskPriorityBadge: React.FC<{ priority: 'Low' | 'Medium' | 'High' }> = ({ priority }) => {
  if (priority === 'High') {
    return <Badge variant="clay">High Priority</Badge>;
  }
  if (priority === 'Medium') {
    return <Badge variant="terracotta">Medium Priority</Badge>;
  }
  return <Badge variant="sand">Low</Badge>;
};

export const TaskStatusBadge: React.FC<{ status: 'To Do' | 'In Progress' | 'Completed' }> = ({ status }) => {
  if (status === 'Completed') {
    return <Badge variant="olive">✓ Completed</Badge>;
  }
  if (status === 'In Progress') {
    return <Badge variant="terracotta">⟳ In Progress</Badge>;
  }
  return <Badge variant="sand">To Do</Badge>;
};

export const EventStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'Upcoming':
      return <Badge variant="terracotta">Upcoming</Badge>;
    case 'In Progress':
      return <Badge variant="clay">In Progress</Badge>;
    case 'Completed':
      return <Badge variant="olive">Completed</Badge>;
    case 'Cancelled':
      return <Badge variant="sand">Cancelled</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};

export const VendorStatusBadge: React.FC<{ status: 'Confirmed' | 'Pending' | 'Cancelled' }> = ({ status }) => {
  if (status === 'Confirmed') {
    return (
      <Badge variant="olive">
        <span className="w-1.5 h-1.5 rounded-full bg-[#555635]"></span>
        Confirmed
      </Badge>
    );
  }
  if (status === 'Pending') {
    return (
      <Badge variant="terracotta">
        <span className="w-1.5 h-1.5 rounded-full bg-[#D98261]"></span>
        Pending Contract
      </Badge>
    );
  }
  return (
    <Badge variant="sand">
      <span className="w-1.5 h-1.5 rounded-full bg-[#8A7969]"></span>
      Cancelled
    </Badge>
  );
};

export const BudgetStatusBadge: React.FC<{ status: 'Healthy' | 'Warning' | 'Critical' | 'Over Budget' }> = ({ status }) => {
  switch (status) {
    case 'Healthy':
      return <Badge variant="olive">Budget Healthy</Badge>;
    case 'Warning':
      return <Badge variant="terracotta">Approaching Limit</Badge>;
    case 'Critical':
    case 'Over Budget':
      return <Badge variant="clay">Deficit Exceeded</Badge>;
    default:
      return <Badge variant="neutral">{status}</Badge>;
  }
};
