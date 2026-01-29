'use client';

import { TrendingUp, Award } from 'lucide-react';

interface PopularItem {
  id: string;
  name: string;
  metric: string;
  value: string | number;
}

interface PopularItemCardProps {
  title: string;
  items: PopularItem[];
  icon?: React.ReactNode;
}

export default function PopularItemCard({ title, items, icon }: PopularItemCardProps) {
  const rankColors = [
    'from-yellow-500 to-orange-500', // 1st place - gold
    'from-slate-400 to-slate-500',   // 2nd place - silver
    'from-amber-600 to-orange-700',  // 3rd place - bronze
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:border-indigo-500/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
          {icon || <TrendingUp className="w-5 h-5 text-indigo-400" />}
        </div>
        <h3 className="text-lg font-semibold text-white">
          {title}
        </h3>
      </div>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="group relative p-4 bg-gradient-to-br from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-700/50 hover:border-indigo-500/30 hover:from-slate-800 hover:to-slate-700 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                {/* Rank Badge */}
                {index < 3 ? (
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${rankColors[index]} shadow-lg`}>
                    {index === 0 ? (
                      <Award className="w-5 h-5 text-white" />
                    ) : (
                      <span className="font-bold text-white text-sm">{index + 1}</span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-700/50 border border-slate-600/50">
                    <span className="font-semibold text-slate-400 text-sm">{index + 1}</span>
                  </div>
                )}
                
                {/* Item Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate mb-1">
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {item.metric}
                  </p>
                </div>
              </div>
              
              {/* Value */}
              <div className="text-right ml-3">
                <p className="text-white font-bold text-base whitespace-nowrap">
                  {typeof item.value === 'number'
                    ? item.value.toLocaleString()
                    : item.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}