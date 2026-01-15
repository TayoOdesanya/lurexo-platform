'use client';

import Link from 'next/link';
import { AlertTriangle, AlertCircle, Info, Sparkles } from 'lucide-react';
import { Alert } from '../../types/admin';

interface AlertCardProps {
  alerts: Alert[];
}

export default function AlertCard({ alerts }: AlertCardProps) {
  const getPriorityIcon = (priority: Alert['priority']) => {
    switch (priority) {
      case 'urgent':
        return <AlertTriangle className="w-5 h-5 text-rose-400" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-400" />;
      case 'medium':
        return <AlertCircle className="w-5 h-5 text-indigo-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'border-rose-500/50 bg-gradient-to-br from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20';
      case 'high':
        return 'border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20';
      case 'medium':
        return 'border-indigo-500/50 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 hover:from-indigo-500/20 hover:to-purple-500/20';
      default:
        return 'border-blue-500/50 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20';
    }
  };

  if (alerts.length === 0) {
    return (
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-slate-700/50 shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-white">
            Requires Attention
          </h3>
        </div>
        <p className="text-slate-400 text-sm">
          All clear! No items require your attention at the moment. 🎉
        </p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-rose-500/10 to-orange-500/10 rounded-xl border border-rose-500/20">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          Requires Attention
        </h3>
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <Link
            key={alert.id}
            href={alert.link}
            className={`group block p-5 rounded-xl border transition-all duration-300 ${getPriorityColor(
              alert.priority
            )}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-900/50 rounded-lg group-hover:scale-110 transition-transform">
                  {getPriorityIcon(alert.priority)}
                </div>
                <div>
                  <p className="text-white font-semibold text-base mb-1">
                    {alert.count} {alert.message}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    Click to review 
                    <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </p>
                </div>
              </div>
              <div className="text-3xl font-bold bg-gradient-to-br from-white to-slate-300 bg-clip-text text-transparent">
                {alert.count}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}