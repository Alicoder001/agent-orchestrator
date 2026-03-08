'use client';

import { Monitor, Users, Shield, Cpu, Activity } from 'lucide-react';

export default function Scene2D() {
  return (
    <div className="w-full h-full bg-[#f5f7fa] relative overflow-hidden flex items-center justify-center pt-16">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-40" 
        style={{ 
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)', 
          backgroundSize: '24px 24px' 
        }}
      />

      {/* Map Container */}
      <div className="relative w-full max-w-5xl aspect-[16/9] bg-white/60 backdrop-blur-md shadow-2xl rounded-3xl border border-slate-200/60 p-8 overflow-hidden">
        
        {/* SVG Connecting Lines (Underneath) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          {/* Engineering to Core */}
          <path d="M 25% 40% C 40% 40%, 40% 50%, 50% 50%" fill="none" stroke="#3b82f6" strokeWidth="3" strokeDasharray="8 8" className="animate-dash opacity-60" />
          {/* Operations to Core */}
          <path d="M 75% 75% C 60% 75%, 60% 50%, 50% 50%" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="8 8" className="animate-dash opacity-60" />
          {/* Executive to Core */}
          <path d="M 75% 25% C 60% 25%, 60% 50%, 50% 50%" fill="none" stroke="#8b5cf6" strokeWidth="3" strokeDasharray="8 8" className="animate-dash opacity-60" />
        </svg>

        {/* 1. ENGINEERING ZONE */}
        <div className="absolute top-[10%] left-[5%] w-[30%] h-[70%] border border-blue-200 bg-blue-50/80 backdrop-blur-md rounded-2xl p-5 shadow-sm z-10 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-blue-800 font-bold flex items-center gap-2 text-sm tracking-wide uppercase">
              <Monitor size={16}/> Engineering
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 h-[calc(100%-3rem)]">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-blue-100 shadow-sm flex items-center justify-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                    <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-amber-400' : 'bg-blue-500'} animate-pulse`}></div>
                  </div>
                  <div className="w-12 h-1.5 bg-slate-100 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. CENTRAL COMMAND WALL */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[15%] h-[40%] bg-slate-900 rounded-xl shadow-2xl z-20 flex flex-col items-center justify-center p-4 border border-slate-700">
           <Cpu className="text-blue-400 mb-3" size={32} />
           <div className="text-center w-full">
             <div className="text-slate-400 text-[10px] font-mono tracking-widest mb-1">CORE SYSTEM</div>
             <div className="text-white font-bold text-lg mb-4">ONLINE</div>
             
             <div className="flex flex-col gap-2 w-full">
               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-blue-500 w-[85%]"></div>
               </div>
               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-emerald-500 w-[62%]"></div>
               </div>
               <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                 <div className="h-full bg-purple-500 w-[91%]"></div>
               </div>
             </div>
           </div>
        </div>

        {/* 3. OPERATIONS ZONE */}
        <div className="absolute bottom-[10%] right-[5%] w-[35%] h-[35%] border border-emerald-200 bg-emerald-50/80 backdrop-blur-md rounded-2xl p-5 shadow-sm z-10 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-emerald-800 font-bold flex items-center gap-2 text-sm tracking-wide uppercase">
              <Activity size={16}/> Operations
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          
          <div className="grid grid-cols-4 gap-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-white rounded-lg border border-emerald-100 shadow-sm flex items-center justify-center relative">
                <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-400 rounded-b-lg"></div>
                <div className={`w-2.5 h-2.5 rounded-full ${i === 2 || i === 5 ? 'bg-amber-400' : 'bg-emerald-500'} animate-pulse`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. EXECUTIVE ZONE */}
        <div className="absolute top-[10%] right-[5%] w-[35%] h-[35%] border border-purple-200 bg-purple-50/80 backdrop-blur-md rounded-2xl p-5 shadow-sm z-10 transition-transform hover:scale-[1.02]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-purple-800 font-bold flex items-center gap-2 text-sm tracking-wide uppercase">
              <Shield size={16}/> Executive
            </h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
          </div>
          
          <div className="w-full h-[calc(100%-2rem)] flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-purple-200 flex items-center justify-center relative bg-white shadow-inner">
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center border border-purple-200">
                  <Users className="text-purple-600" size={24} />
              </div>
              {/* Meeting participants */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
              <div className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
