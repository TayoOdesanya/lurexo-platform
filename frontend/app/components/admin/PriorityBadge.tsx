'use client';

import { AlertTriangle, AlertCircle, Info, Zap } from 'lucide-react';

type Priority = 'low' | 'medium' | 'high' | 'urgent';

interface PriorityBadgeProps {
  priority: Priority;
  size?: 'sm' | 'md';
}

export default function PriorityBadge({ priority, size = 'sm' }: PriorityBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
  };

  const getPriorityConfig = (priority: Priority) => {
    switch (priority) {
      case 'urgent':
        return {
          icon: <Zap className={iconSizes[size]} />,
          label: 'Urgent',
          bgColor: 'bg-rose-500/20',
          borderColor: 'border-rose-500/40',
          textColor: 'text-rose-400',
        };
      case 'high':
        return {
          icon: <AlertTriangle className={iconSizes[size]} />,
          label: 'High',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/40',
          textColor: 'text-orange-400',
        };
      case 'medium':
        return {
          icon: <AlertCircle className={iconSizes[size]} />,
          label: 'Medium',
          bgColor: 'bg-amber-500/20',
          borderColor: 'border-amber-500/40',
          textColor: 'text-amber-400',
        };
      case 'low':
        return {
          icon: <Info className={iconSizes[size]} />,
          label: 'Low',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/40',
          textColor: 'text-blue-400',
        };
      default:
        return {
          icon: <Info className={iconSizes[size]} />,
          label: priority,
          bgColor: 'bg-slate-500/20',
          borderColor: 'border-slate-500/40',
          textColor: 'text-slate-400',
        };
    }
  };

  const config = getPriorityConfig(priority);

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-semibold rounded border
        ${sizeClasses[size]}
        ${config.bgColor}
        ${config.borderColor}
        ${config.textColor}
      `}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}