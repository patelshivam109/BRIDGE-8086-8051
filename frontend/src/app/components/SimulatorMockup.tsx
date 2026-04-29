import React from 'react';
import { Play, RotateCcw, SkipForward, Download, Terminal, Database, Cpu } from 'lucide-react';

export function SimulatorMockup() {
  const [activeTab, setActiveTab] = React.useState('8086');

  return (
    <section id="simulator" className="py-24 bg-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Interactive Instruction <br /> Bridge Interface
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Write 8086 assembly in the editor and watch it get automatically transpiled to optimized 8051 machine code. Track register changes, stack pointers, and flag status in real-time.
            </p>
            
            <div className="space-y-4">
              {[
                { label: 'Source Architecture', value: 'Intel 8086 (16-bit)' },
                { label: 'Target Architecture', value: 'MCS-51 (8-bit)' },
                { label: 'Optimization Level', value: 'Cycle-Accurate' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium">{item.label}:</span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden font-mono text-sm">
              {/* Header */}
              <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <div className="flex gap-4">
                  <button 
                    onClick={() => setActiveTab('8086')}
                    className={`px-3 py-1 rounded transition-colors ${activeTab === '8086' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    8086_SRC.asm
                  </button>
                  <button 
                    onClick={() => setActiveTab('8051')}
                    className={`px-3 py-1 rounded transition-colors ${activeTab === '8051' ? 'text-blue-400 bg-blue-400/10' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    8051_OUT.hex
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-slate-500 hover:text-blue-400"><Download size={18} /></button>
                  <div className="h-4 w-px bg-slate-800" />
                  <button className="text-green-500 hover:text-green-400 flex items-center gap-1">
                    <Play size={16} /> Run
                  </button>
                </div>
              </div>

              <div className="flex h-[400px]">
                {/* Editor Area */}
                <div className="flex-1 bg-slate-950 p-6 overflow-auto text-slate-300 border-r border-slate-800">
                  {activeTab === '8086' ? (
                    <pre className="whitespace-pre">
                      <code className="text-slate-600">0001</code>  MOV AX, 4C00h<br />
                      <code className="text-slate-600">0002</code>  MOV BX, 2000h<br />
                      <code className="text-slate-600">0003</code>  ADD AX, BX<br />
                      <code className="text-slate-600">0004</code>  <span className="text-blue-400">; Transpile to 8051</span><br />
                      <code className="text-slate-600">0005</code>  MOV DPTR, #2000h<br />
                      <code className="text-slate-600">0006</code>  MOVX A, @DPTR<br />
                      <code className="text-slate-600">0007</code>  INT 21h<br />
                    </pre>
                  ) : (
                    <pre className="whitespace-pre">
                      <code className="text-slate-600">0001</code>  :03000000020003F8<br />
                      <code className="text-slate-600">0002</code>  :1000030075810775900075A00075B00075<br />
                      <code className="text-slate-600">0003</code>  :10001300800075D000E4F5F0F582F583F5<br />
                      <code className="text-slate-600">0004</code>  :00000001FF
                    </pre>
                  )}
                </div>

                {/* Sidebar Stats */}
                <div className="w-48 bg-slate-900 p-4 space-y-6">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-3">Registers</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">AX:</span> <span className="text-blue-400">6C00h</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">BX:</span> <span className="text-slate-300">2000h</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">CX:</span> <span className="text-slate-300">0000h</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">DX:</span> <span className="text-slate-300">0000h</span></div>
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest block mb-3">8051 Banks</span>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between"><span className="text-slate-500">R0:</span> <span className="text-emerald-400">00h</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">R1:</span> <span className="text-emerald-400">00h</span></div>
                      <div className="flex justify-between"><span className="text-slate-500">ACC:</span> <span className="text-emerald-400">6Ch</span></div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-yellow-500">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      <span className="text-[10px]">CPU ACTIVE</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Footer Controls */}
              <div className="bg-slate-900 px-6 py-3 border-t border-slate-800 flex items-center gap-6">
                 <button className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                   <RotateCcw size={14} /> Reset
                 </button>
                 <button className="text-slate-400 hover:text-white flex items-center gap-2 transition-colors">
                   <SkipForward size={14} /> Step
                 </button>
                 <div className="flex-1" />
                 <span className="text-[10px] text-slate-600 italic">Cycles: 42 | T-States: 168</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
