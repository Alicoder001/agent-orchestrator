import { AlertTriangle, AlertCircle, Clock } from 'lucide-react';

export default function TopRightPanel() {
  return (
    <div className="absolute top-20 right-4 w-72 flex flex-col gap-4 z-40">
      {/* System Alerts */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-slate-800">System Alerts</h3>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">2 New</span>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-start gap-3 p-2 rounded-lg bg-orange-50 border border-orange-100">
            <AlertTriangle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-orange-800">High Latency</span>
                <span className="text-[10px] text-orange-600 flex items-center gap-1"><Clock size={10} /> 1m ago</span>
              </div>
              <p className="text-[11px] text-orange-700 mt-1 leading-snug">Active agents experiencing delays in zone 3.</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-red-50 border border-red-100">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-semibold text-red-800">Node Failure</span>
                <span className="text-[10px] text-red-600 flex items-center gap-1"><Clock size={10} /> 7m ago</span>
              </div>
              <p className="text-[11px] text-red-700 mt-1 leading-snug">Agent node offline in the data science sector.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Strategic Insights */}
      <div className="bg-white/90 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">Strategic Insights</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          The global headquarters are currently operating at 85% efficiency. Analyzing regions timeseries data suggests a potential bottleneck in the engineering workflow pipeline.
        </p>
        <button className="mt-3 text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
          View full report &rarr;
        </button>
      </div>
    </div>
  );
}
