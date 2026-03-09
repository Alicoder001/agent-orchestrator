'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const data = [
  { time: '08:00', agents: 400 },
  { time: '10:00', agents: 1200 },
  { time: '12:00', agents: 800 },
  { time: '14:00', agents: 1600 },
  { time: '16:00', agents: 2400 },
  { time: '18:00', agents: 1800 },
  { time: '20:00', agents: 1000 },
];

export default function BottomLeftPanel() {
  return (
    <div className="absolute bottom-20 left-4 w-64 flex flex-col gap-4 z-40">
      {/* Live Agent Activity */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Live Agent Activity</h3>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ color: '#64748b', fontSize: '12px' }}
                itemStyle={{ color: '#0f172a', fontSize: '14px', fontWeight: 600 }}
              />
              <Area type="monotone" dataKey="agents" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorAgents)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workflow Efficiency */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Workflow Efficiency</h3>
        <div className="flex items-center justify-between">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500"
                strokeWidth="3"
                strokeDasharray="85, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-lg font-bold text-slate-800 leading-none">85</span>
              <span className="text-[10px] text-slate-500 font-medium">%</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              <span className="text-slate-600">Optimal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200"></div>
              <span className="text-slate-600">Sub-optimal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
