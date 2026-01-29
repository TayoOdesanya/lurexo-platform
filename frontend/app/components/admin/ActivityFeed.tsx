'use client';

import { ActivityItem } from '../../types/admin';
import {
  Calendar,
  UserPlus,
  ShoppingCart,
  CreditCard,
  MessageSquare,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
  maxItems?: number;
}

export default function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const displayedActivities = activities.slice(0, maxItems);

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'event_created':
        return <Calendar className="w-4 h-4" />;
      case 'user_signup':
        return <UserPlus className="w-4 h-4" />;
      case 'ticket_purchased':
        return <ShoppingCart className="w-4 h-4" />;
      case 'payout_processed':
        return <CreditCard className="w-4 h-4" />;
      case 'support_ticket':
        return <MessageSquare className="w-4 h-4" />;
      case 'event_approved':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: ActivityItem['type']) => {
    switch (type) {
      case 'event_created':
        return 'text-blue-400 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20';
      case 'user_signup':
        return 'text-emerald-400 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-emerald-500/20';
      case 'ticket_purchased':
        return 'text-purple-400 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20';
      case 'payout_processed':
        return 'text-amber-400 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20';
      case 'support_ticket':
        return 'text-rose-400 bg-gradient-to-br from-rose-500/10 to-pink-500/10 border-rose-500/20';
      case 'event_approved':
        return 'text-emerald-400 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-emerald-500/20';
      default:
        return 'text-slate-400 bg-gradient-to-br from-slate-500/10 to-slate-600/10 border-slate-500/20';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
          <Clock className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          Recent Activity
        </h3>
      </div>
      
      <div className="space-y-2">
        {displayedActivities.map((activity) => (
          <div
            key={activity.id}
            className="group flex items-start gap-4 p-4 bg-gradient-to-br from-slate-800/30 to-slate-700/30 rounded-xl hover:from-slate-800/60 hover:to-slate-700/60 border border-slate-700/30 hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className={`p-2.5 rounded-xl border ${getActivityColor(activity.type)} group-hover:scale-110 transition-transform flex-shrink-0`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white mb-1 leading-relaxed">
                {activity.message}
              </p>
              <p className="text-xs text-slate-400">
                {formatTimestamp(activity.timestamp)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {activities.length > maxItems && (
        <button className="mt-4 w-full py-3 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors rounded-xl hover:bg-slate-800/50">
          Show more activities →
        </button>
      )}
    </div>
  );
}