'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartDataPoint } from '../../../types/admin';
import { Users } from 'lucide-react';

interface UserGrowthChartProps {
  data: ChartDataPoint[];
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  // Format data for Recharts
  const chartData = data.map((point) => ({
    date: new Date(point.date).toLocaleDateString('en-GB', { 
      day: 'numeric',
      month: 'short' 
    }),
    users: point.value,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-purple-500/50 rounded-xl p-4 shadow-2xl shadow-purple-500/20">
          <p className="text-slate-400 text-xs mb-2 font-medium">{payload[0].payload.date}</p>
          <p className="text-white font-bold text-lg">
            {payload[0].value.toLocaleString()} users
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 shadow-xl hover:border-purple-500/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/20">
          <Users className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">
            User Growth Chart
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Last 90 Days</p>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
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
            tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#a855f7', strokeWidth: 2, strokeDasharray: '5 5' }} />
          <Area 
            type="monotone" 
            dataKey="users" 
            stroke="#a855f7" 
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorUsers)"
            dot={{ fill: '#a855f7', r: 4, strokeWidth: 2, stroke: '#1e293b' }}
            activeDot={{ r: 6, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}