import React from 'react';
import { ShieldCheck, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 border-b border-slate-800/60 bg-[#070b12]/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
          <ShieldCheck size={18} />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-200">AI Protection Active</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">
            Система защищает вас в реальном времени
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors bg-slate-900/40 border border-slate-800/60 rounded-xl cursor-pointer">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-3 h-3 bg-red-500 border-2 border-[#070b12] rounded-full text-[7px] text-white font-bold flex items-center justify-center">
            3
          </span>
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800/80">
          <div className="text-right">
            <div className="text-xs font-bold text-slate-200">User</div>
            <div className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-1.5 py-0.5 rounded-md mt-0.5 inline-block">
              Pro Plan
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center text-slate-300 font-bold text-xs shadow-inner">
            U
          </div>
        </div>
      </div>
    </header>
  );
}