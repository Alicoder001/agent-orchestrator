'use client';

import { useState } from 'react';
import { Bell, Search, User, Map, Layers, LayoutGrid, BarChart2, FileText, Settings, HelpCircle, Maximize, Minus, Plus, Monitor, MessageSquare } from 'lucide-react';
import Scene from '../components/Scene';
import Scene2D from '../components/Scene2D';
import BottomLeftPanel from '../components/BottomLeftPanel';
import TopRightPanel from '../components/TopRightPanel';
import BottomRightPanel from '../components/BottomRightPanel';
import ChatPanel from '../components/ChatPanel';

export default function Page() {
  const [viewMode, setViewMode] = useState<'3D' | '2D'>('2D');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="relative w-full h-screen bg-[#f5f7fa] overflow-hidden font-sans text-slate-800">
      {/* Top Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Layers size={18} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">AI Orchestrator Mission Control Dashboard</h1>
        </div>
        <nav className="flex items-center gap-6">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg mr-4">
            <button 
              onClick={() => setViewMode('2D')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === '2D' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              2D Map
            </button>
            <button 
              onClick={() => setViewMode('3D')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${viewMode === '3D' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              3D View
            </button>
          </div>
          <a href="#" className="text-sm font-medium text-blue-600 border-b-2 border-blue-600 pb-5 pt-5">Explore</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Zones</a>
          <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">Search</a>
          
          {/* Chat Toggle Button */}
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ml-2 cursor-pointer transition-colors ${isChatOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
          >
            <MessageSquare size={16} />
          </button>
          
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center ml-2 cursor-pointer">
            <User size={16} className="text-slate-600" />
          </div>
        </nav>
      </header>

      {/* Left Sidebar */}
      <aside className="absolute top-20 left-4 w-48 bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-sm z-40 overflow-hidden">
        <nav className="flex flex-col py-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 bg-blue-50 text-blue-700 border-l-4 border-blue-600">
            <LayoutGrid size={18} />
            <span className="text-sm font-medium">Infrastructure</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
            <BarChart2 size={18} />
            <span className="text-sm font-medium">Analytics</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
            <FileText size={18} />
            <span className="text-sm font-medium">Logs</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 transition-colors mt-2 border-t border-slate-100">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Help</span>
          </a>
        </nav>
      </aside>

      {/* Main Scene */}
      <div className="absolute inset-0 z-0">
        {viewMode === '3D' ? <Scene /> : <Scene2D />}
      </div>

      {/* Floating Panels */}
      <BottomLeftPanel />
      <TopRightPanel />
      <BottomRightPanel />
      
      {/* Chat Panel */}
      <ChatPanel isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Bottom Left Menu Button (Mobile/Collapsed) */}
      <button className="absolute bottom-6 left-6 w-10 h-10 bg-white rounded-lg shadow-md border border-slate-200 flex items-center justify-center z-40 hover:bg-slate-50 transition-colors">
        <LayoutGrid size={20} className="text-slate-600" />
      </button>
    </div>
  );
}
