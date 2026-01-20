'use client';

import { AlertTriangle, Shield, DollarSign, UserX } from 'lucide-react';

type RiskFlag = 'high_amount' | 'new_organizer' | 'unusual_activity' | 'verification_pending';

interface RiskFlagBadgeProps {
  flag: RiskFlag;
}

export default function RiskFlagBadge({ flag }: RiskFlagBadgeProps) {
  const config = {
    high_amount: {
      icon: DollarSign,
      label: 'High Amount',
      className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    new_organizer: {
      icon: UserX,
      label: 'New Organizer',
      className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    },
    unusual_activity: {
      icon: AlertTriangle,
      label: 'Unusual Activity',
      className: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    },
    verification_pending: {
      icon: Shield,
      label: 'Verification Pending',
      className: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    },
  };

  const { icon: Icon, label, className } = config[flag];

  return (
    <span className={`inline-flex items-center gap-1 rounded-full text-xs px-2 py-0.5 font-medium border ${className}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}