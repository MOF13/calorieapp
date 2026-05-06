import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { format, parseISO } from 'date-fns';
import { getWeeklyLogs } from '@/lib/db';
import { Flame, TrendingUp } from 'lucide-react';

interface WeeklyViewProps {
  userId: string;
}

export function WeeklyView({ userId }: WeeklyViewProps) {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const data = await getWeeklyLogs(userId);
      setLogs(data);
      setLoading(false);
    }
    loadData();
  }, [userId]);

  const chartData = logs.map(log => ({
    name: format(parseISO(log.log_date), 'EEE'),
    calories: log.total_calories,
    protein: log.total_protein_g,
    carbs: log.total_carbs_g,
    fat: log.total_fat_g,
  }));

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="h-64 bg-slate-100 rounded-[2.5rem]"></div>
        <div className="h-64 bg-slate-100 rounded-[2.5rem]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-32">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6 rounded-3xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weekly Avg</p>
          <p className="text-2xl font-black text-vitality-slate">
            {logs.length > 0 ? Math.round(logs.reduce((acc, curr) => acc + curr.total_calories, 0) / logs.length) : 0}
            <span className="text-sm font-normal ml-1">kcal</span>
          </p>
        </div>
        <div className="glass-card p-6 rounded-3xl">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Consistency</p>
          <p className="text-2xl font-black text-vitality-emerald">
            {logs.length}/7 <span className="text-sm font-normal ml-1">days</span>
          </p>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] shadow-sm">
        <h3 className="text-xl font-extrabold text-vitality-slate mb-6 flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500" />
          Calorie Adherence
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
              <YAxis hide />
              <Tooltip 
                cursor={{ fill: 'rgba(163, 230, 53, 0.1)' }}
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="calories" fill="#10B981" radius={[10, 10, 10, 10]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-8 rounded-[2.5rem] shadow-sm">
        <h3 className="text-xl font-extrabold text-vitality-slate mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-vitality-emerald" />
          Macro Distribution
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorProtein" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="protein" stroke="#10B981" fillOpacity={1} fill="url(#colorProtein)" strokeWidth={3} />
              <Area type="monotone" dataKey="carbs" stroke="#FBBF24" fill="transparent" strokeWidth={3} />
              <Area type="monotone" dataKey="fat" stroke="#F87171" fill="transparent" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-vitality-emerald"></div>
            <span className="text-xs font-bold text-slate-500 uppercase">Protein</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-vitality-amber"></div>
            <span className="text-xs font-bold text-slate-500 uppercase">Carbs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-xs font-bold text-slate-500 uppercase">Fat</span>
          </div>
        </div>
      </div>
    </div>
  );
}
