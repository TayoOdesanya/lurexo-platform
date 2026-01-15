'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../../../types/admin';
import { Calendar } from 'lucide-react';

interface EventCreationChartProps {
  data: ChartDataPoint[];
}

export default function EventCreationChart({ data }: EventCreationChartProps) {
  // Format data for Recharts
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short' 
    }),
    events: point.value,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-emerald-500/50 rounded-xl p-4 shadow-2xl shadow-emerald-500/20">
          <p className="text-slate-400 text-xs mb-2 font-medium">{payload[0].payload.date}</p>
          <p className="text-white font-bold text-lg">
            {payload[0].value} event{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:border-emerald-500/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl border border-emerald-500/20">
          <Calendar className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            Event Creation Trend
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 90 Days</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <defs>
            <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
              <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.8}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: '500' }}
            tickLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            style={{ fontSize: '12px', fontWeight: '500' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
          <Bar 
            dataKey="events" 
            fill="url(#colorEvents)"
            radius={[8, 8, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}