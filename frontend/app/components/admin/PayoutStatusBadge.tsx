'use client';

import { 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Pause,
} from 'lucide-react';

type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'on_hold';

interface PayoutStatusBadgeProps {
  status: PayoutStatus;
  size?: 'sm' | 'md';
}

export default function PayoutStatusBadge({ status, size = 'md' }: PayoutStatusBadgeProps) {
  const config = {
    pending: {
      icon: Clock,
      label: 'Pending',
      className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    processing: {
      icon: Clock,
      label: 'Processing',
      className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    completed: {
      icon: CheckCircle,
      label: 'Completed',
      className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    failed: {
      icon: XCircle,
      label: 'Failed',
      className: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
    on_hold: {
      icon: Pause,
      label: 'On Hold',
      className: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    },
  };

  const { icon: Icon, label, className } = config[status];
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${className} ${sizeClass}`}>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      {label}
    </span>
  );
}