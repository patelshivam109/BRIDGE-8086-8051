import React from 'react';
import { motion } from 'motion/react';
import { Activity, FlaskConical, ChevronRight, Binary, Cpu, Boxes } from 'lucide-react';

const forwardExperiments = [
  { id: 'F1', title: 'External Memory Interfacing', goal: 'Connect RAM/ROM & Decoder' },
  { id: 'F2', title: 'I/O Port Mapping', goal: 'I/O vs Memory-mapped config' },
  { id: 'F3', title: 'Timer Integration', goal: '8253 Interface & Interrupts' },
  { id: 'F4', title: 'Serial Communication', goal: 'UART & Baud Rate config' }
];

const reverseExperiments = [
  { id: 'R1', title: 'Internal RAM Extraction', goal: 'Measure Bus Latency' },
  { id: 'R2', title: 'Timer Decomposition', goal: 'Compare Power & Complexity' },
  { id: 'R3', title: 'I/O Port Expansion', goal: 'External Decoder Logic' },
  { id: 'R4', title: 'Interrupt Priority Study', goal: 'Internal vs External PIC' }
];

export function LabDashboard({ onSelectExperiment }: { onSelectExperiment: (id: string) => void }) {
  return (
    <div className="pt-6 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Experimental Framework</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium">Select an architectural track to begin analysis</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Forward Track */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl shadow-sm">
            <Activity className="text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-lg font-bold text-blue-700 dark:text-blue-400">🔵 Forward Experiments</h3>
              <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold">8086 → Integrated System Behavior</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {forwardExperiments.map((exp) => (
              <button
                key={exp.id}
                onClick={() => onSelectExperiment(exp.id)}
                className="w-full text-left group p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-lg transition-all flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded-full border border-blue-100 dark:border-blue-800">EXP {exp.id}</span>
                    <h4 className="text-slate-900 dark:text-white font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{exp.title}</h4>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{exp.goal}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Reverse Track */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl shadow-sm">
            <FlaskConical className="text-rose-600 dark:text-rose-400" />
            <div>
              <h3 className="text-lg font-bold text-rose-700 dark:text-rose-400">🔴 Reverse Experiments</h3>
              <p className="text-[10px] text-rose-600 dark:text-rose-400 uppercase tracking-widest font-bold">8051 → Decomposed System Behavior</p>
            </div>
          </div>

          <div className="space-y-4">
            {reverseExperiments.map((exp) => (
              <button
                key={exp.id}
                onClick={() => onSelectExperiment(exp.id)}
                className="w-full text-left group p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-lg transition-all flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 px-2 py-0.5 bg-rose-50 dark:bg-rose-900/30 rounded-full border border-rose-100 dark:border-rose-800">EXP {exp.id}</span>
                    <h4 className="text-slate-900 dark:text-white font-bold group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">{exp.title}</h4>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{exp.goal}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 group-hover:bg-rose-600 group-hover:text-white transition-all">
                  <ChevronRight size={18} />
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
      
      {/* Ultimate Experiment Section */}
      <section className="mt-16 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-950 p-1 rounded-[3rem] shadow-2xl shadow-indigo-200/50">
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-[2.8rem] border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                <Boxes className="animate-pulse" />
              </div>
              <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-[0.2em]">The Ultimate Challenge</span>
            </div>
            <h3 className="text-4xl font-black text-white mb-4 tracking-tight leading-tight">μP to μC Ultimate Converter Lab</h3>
            <p className="text-indigo-100/70 text-lg mb-8 font-medium">The definitive comparative experiment. Side-by-side architectural decomposition of the 8086 system and the 8051 SoC in a single master workspace.</p>
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider">Dual Benchmarking</span>
              <span className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider">Full System Logic</span>
              <span className="px-4 py-2 bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-white uppercase tracking-wider">Advanced AI Report</span>
            </div>
          </div>
          <button 
            onClick={() => onSelectExperiment('U1')}
            className="group relative px-10 py-6 bg-white text-indigo-950 rounded-[2rem] font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-black/20 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-4">
              LAUNCH ULTIMATE LAB <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </section>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-200 dark:border-slate-700 pt-12">
        <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <Binary className="text-blue-600 dark:text-blue-400 mb-4" />
          <h4 className="text-slate-900 dark:text-white font-bold mb-2">Mode C: AI Analysis</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Cross-architecture comparative studies using real-world performance metrics.</p>
        </div>
        <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <Cpu className="text-indigo-600 dark:text-indigo-400 mb-4" />
          <h4 className="text-slate-900 dark:text-white font-bold mb-2">Mode D: AI Translator</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Instruction-level transpilation with architectural bottleneck warnings.</p>
        </div>
        <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
          <Boxes className="text-emerald-600 dark:text-emerald-400 mb-4" />
          <h4 className="text-slate-900 dark:text-white font-bold mb-2">System Reports</h4>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Auto-generated lab documentation for experimental validation.</p>
        </div>
      </div>
    </div>
  );
}