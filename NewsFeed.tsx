
import React from 'react';
import { AppState } from '../types';
import { 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Activity,
  ArrowUpRight,
  Zap,
  ShieldCheck
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface DashboardProps {
  state: AppState;
  onTabChange: (tab: any) => void;
}

const data = [
  { name: 'Mon', parsed: 45, published: 12 },
  { name: 'Tue', parsed: 52, published: 19 },
  { name: 'Wed', parsed: 38, published: 25 },
  { name: 'Thu', parsed: 65, published: 32 },
  { name: 'Fri', parsed: 48, published: 20 },
  { name: 'Sat', parsed: 30, published: 15 },
  { name: 'Sun', parsed: 40, published: 18 },
];

const Dashboard: React.FC<DashboardProps> = ({ state, onTabChange }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white">Project Overview</h2>
          <p className="text-slate-400 mt-1">Real-time automation status for 2026 aggregator</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-2">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-slate-200">System Healthy</span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Zap className="w-6 h-6 text-yellow-400" />}
          label="Total Parsed"
          value="1,284"
          trend="+12%"
          color="bg-yellow-400/10"
        />
        <StatCard 
          icon={<MessageSquare className="w-6 h-6 text-blue-400" />}
          label="Sent to Telegram"
          value="452"
          trend="+8%"
          color="bg-blue-400/10"
        />
        <StatCard 
          icon={<ShieldCheck className="w-6 h-6 text-green-400" />}
          label="Filtered by AI"
          value="832"
          trend="-5%"
          color="bg-green-400/10"
        />
        <StatCard 
          icon={<Users className="w-6 h-6 text-purple-400" />}
          label="Channel Subs"
          value="15.2k"
          trend="+2.4k"
          color="bg-purple-400/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-[#1e293b] border border-slate-700 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-white">Aggregator Activity</h3>
            <select className="bg-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 border border-slate-700">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorParsed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="parsed" stroke="#3b82f6" fillOpacity={1} fill="url(#colorParsed)" />
                <Area type="monotone" dataKey="published" stroke="#10b981" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions / Recent */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Recent Sources</h3>
          <div className="space-y-4 flex-1">
            {state.sources.map(source => (
              <div key={source.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800 transition-colors">
                <div className={`p-2 rounded-lg ${source.type === 'TELEGRAM' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                  {source.type === 'TELEGRAM' ? <MessageSquare className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-200">{source.name}</p>
                  <p className="text-xs text-slate-400">Synced: {source.lastParsed}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
            ))}
          </div>
          <button 
            onClick={() => onTabChange('sources')}
            className="mt-6 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Manage All Sources
          </button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, trend: string, color: string }> = ({ icon, label, value, trend, color }) => (
  <div className="bg-[#1e293b] border border-slate-700 p-6 rounded-2xl hover:border-slate-500 transition-all cursor-default">
    <div className="flex justify-between items-start">
      <div className={`${color} p-3 rounded-xl`}>{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.startsWith('+') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {trend}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-sm text-slate-400 font-medium">{label}</p>
      <h4 className="text-2xl font-bold text-white mt-1">{value}</h4>
    </div>
  </div>
);

export default Dashboard;
