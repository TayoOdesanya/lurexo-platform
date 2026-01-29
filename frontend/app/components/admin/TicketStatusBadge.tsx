'use client';

import { 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  MessageSquare,
} from 'lucide-react';

type TicketStatus = 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';

interface TicketStatusBadgeProps {
  status: TicketStatus;
  size?: 'sm' | 'md' | 'lg';
}

export default function TicketStatusBadge({ status, size = 'md' }: TicketStatusBadgeProps) {
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

  const getStatusConfig = (status: TicketStatus) => {
    switch (status) {
      case 'open':
        return {
          icon: <AlertCircle className={iconSizes[size]} />,
          label: 'Open',
          bgColor: 'bg-gradient-to-r from-rose-500/10 to-pink-500/10',
          borderColor: 'border-rose-500/30',
          textColor: 'text-rose-400',
        };
      case 'in_progress':
        return {
          icon: <MessageSquare className={iconSizes[size]} />,
          label: 'In Progress',
          bgColor: 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10',
          borderColor: 'border-indigo-500/30',
          textColor: 'text-indigo-400',
        };
      case 'waiting_response':
        return {
          icon: <Clock className={iconSizes[size]} />,
          label: 'Awaiting User',
          bgColor: 'bg-gradient-to-r from-amber-500/10 to-orange-500/10',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-400',
        };
      case 'resolved':
        return {
          icon: <CheckCircle className={iconSizes[size]} />,
          label: 'Resolved',
          bgColor: 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10',
          borderColor: 'border-emerald-500/30',
          textColor: 'text-emerald-400',
        };
      case 'closed':
        return {
          icon: <XCircle className={iconSizes[size]} />,
          label: 'Closed',
          bgColor: 'bg-gradient-to-r from-slate-500/10 to-slate-600/10',
          borderColor: 'border-slate-500/30',
          textColor: 'text-slate-400',
        };
      default:
        return {
          icon: <AlertCircle className={iconSizes[size]} />,
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