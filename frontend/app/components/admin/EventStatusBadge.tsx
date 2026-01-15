'use client';

import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Radio, 
  Archive,
  FileText 
} from 'lucide-react';

type EventStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'live' | 'ended';

interface EventStatusBadgeProps {
  status: EventStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function EventStatusBadge({ status, size = 'md' }: EventStatusBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const getStatusConfig = (status: EventStatus) => {
    switch (status) {
      case 'draft':
        return {
          icon: <FileText className={iconSizes[size]} />,
          label: 'Draft',
          bgColor: 'bg-gradient-to-r from-slate-500/10 to-slate-600/10',
          borderColor: 'border-slate-500/30',
          textColor: 'text-slate-400',
        };
      case 'pending_approval':
        return {
          icon: <Clock className={iconSizes[size]} />,
          label: 'Pending Review',
          bgColor: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-400',
        };
      case 'approved':
        return {
          icon: <CheckCircle className={iconSizes[size]} />,
          label: 'Approved',
          bgColor: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
          borderColor: 'border-emerald-500/30',
          textColor: 'text-emerald-400',
        };
      case 'rejected':
        return {
          icon: <XCircle className={iconSizes[size]} />,
          label: 'Rejected',
          bgColor: 'bg-gradient-to-r from-rose-500/10 to-pink-500/10',
          borderColor: 'border-rose-500/30',
          textColor: 'text-rose-400',
        };
      case 'live':
        return {
          icon: <Radio className={iconSizes[size]} />,
          label: 'Live',
          bgColor: 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10',
          borderColor: 'border-indigo-500/30',
          textColor: 'text-indigo-400',
        };
      case 'ended':
        return {
          icon: <Archive className={iconSizes[size]} />,
          label: 'Ended',
          bgColor: 'bg-gradient-to-r from-slate-500/10 to-slate-600/10',
          borderColor: 'border-slate-500/30',
          textColor: 'text-slate-400',
        };
      default:
        return {
          icon: <FileText className={iconSizes[size]} />,
          label: status,
          bgColor: 'bg-slate-500/10',
          borderColor: 'border-slate-500/30',
          textColor: 'text-slate-400',
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span
      className={`
        inline-flex items-center gap-2 font-semibold rounded-lg border
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