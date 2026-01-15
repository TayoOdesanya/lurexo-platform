'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: React.ReactNode;
}

export default function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="group relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 shadow-xl hover:shadow-indigo-500/10">
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 rounded-2xl transition-all duration-300" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-slate-400 text-sm font-medium mb-3 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-4xl font-bold text-white mb-3 tracking-tight">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </p>
          
          {change !== undefined && (
            <div className="flex items-center gap-1.5">
              {isPositive && (
                <>
                  <div className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 rounded-lg">
                    <ArrowUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-sm text-emerald-400 font-semibold">
                      +{change}%
                    </span>
                  </div>
                </>
              )}
              {isNegative && (
                <>
                  <div className="flex items-center gap-1 px-2 py-1 bg-rose-500/10 rounded-lg">
                    <ArrowDown className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-sm text-rose-400 font-semibold">
                      {change}%
                    </span>
                  </div>
                </>
              )}
              {!isPositive && !isNegative && (
                <span className="text-sm text-slate-400 font-medium">
                  {change}%
                </span>
              )}
              <span className="text-xs text-slate-500 ml-1">vs previous</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="ml-4 p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10 group-hover:shadow-indigo-500/20 transition-all">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}