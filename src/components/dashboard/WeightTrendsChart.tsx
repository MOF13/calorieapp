import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO } from 'date-fns';

interface WeightTrendsChartProps {
  data: any[];
  targetWeight?: number;
}

export function WeightTrendsChart({ data, targetWeight }: WeightTrendsChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    return [...data]
      .reverse()
      .map(log => ({
        date: format(parseISO(log.logged_at), 'MMM d'),
        weight: parseFloat(log.weight_kg),
      }));
  }, [data]);

  if (chartData.length < 2) {
    return (
      <div className="h-[200px] flex items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
        <p className="text-sm font-bold text-slate-400 italic">Log at least 2 entries to see your trend</p>
      </div>
    );
  }

  const minWeight = Math.min(...chartData.map(d => d.weight), targetWeight || 1000) - 2;
  const maxWeight = Math.max(...chartData.map(d => d.weight), targetWeight || 0) + 2;

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fontWeight: 700, fill: '#94A3B8' }} 
            dy={10}
          />
          <YAxis 
            domain={[minWeight, maxWeight]} 
            hide 
          />
          <Tooltip 
            contentStyle={{ 
              borderRadius: '16px', 
              border: 'none', 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
              fontWeight: 'bold'
            }}
            labelStyle={{ color: '#64748B', marginBottom: '4px' }}
          />
          {targetWeight && (
            <ReferenceLine 
              y={targetWeight} 
              stroke="#A3E635" 
              strokeDasharray="3 3" 
              label={{ 
                position: 'right', 
                value: 'Goal', 
                fill: '#A3E635', 
                fontSize: 10, 
                fontWeight: 900 
              }} 
            />
          )}
          <Area 
            type="monotone" 
            dataKey="weight" 
            stroke="#10B981" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorWeight)" 
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
