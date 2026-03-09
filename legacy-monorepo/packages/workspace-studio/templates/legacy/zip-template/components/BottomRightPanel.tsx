import { Plus, Minus, Maximize, Monitor, ChevronDown } from 'lucide-react';

export default function BottomRightPanel() {
  return (
    <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 z-40">
      {/* Controls */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg flex flex-col overflow-hidden">
        <button className="p-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border-b border-slate-100 flex items-center justify-center">
          <Plus size={18} />
        </button>
        <button className="p-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border-b border-slate-100 flex items-center justify-center">
          <Minus size={18} />
        </button>
        <button className="p-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors border-b border-slate-100 flex items-center justify-center">
          <Maximize size={18} />
        </button>
        <button className="p-3 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-center">
          <Monitor size={18} />
        </button>
      </div>

      {/* Floor Selector */}
      <button className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg px-4 py-2.5 flex items-center gap-2 hover:bg-slate-50 transition-colors">
        <span className="text-xs font-bold text-slate-800 tracking-wider">FLOOR 1/5</span>
        <ChevronDown size={14} className="text-slate-500" />
      </button>
    </div>
  );
}
