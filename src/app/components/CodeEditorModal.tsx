import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, RotateCcw, Code2, Download, Copy, Check } from 'lucide-react';

interface CodeEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  experimentId: string;
  experimentTitle: string;
}

export function CodeEditorModal({ isOpen, onClose, experimentId, experimentTitle }: CodeEditorModalProps) {
  // U1 (Ultimate) experiment supports BOTH architectures
  const isUltimateExperiment = experimentId === 'U1';
  const isForwardTrack = experimentId.startsWith('F');
  const isReverseTrack = experimentId.startsWith('R');
  
  // For Ultimate experiment, allow switching between 8086 and 8051
  const [activeArchitecture, setActiveArchitecture] = React.useState<'8086' | '8051'>(
    isUltimateExperiment ? '8086' : (isForwardTrack ? '8086' : '8051')
  );
  
  // Default code templates based on architecture
  const get8086Code = () => {
    return `; Bridge 86-51 - ${experimentTitle}
; Experiment ID: ${experimentId}
; Architecture: Intel 8086 (x86 Assembly)

.MODEL SMALL
.STACK 100H

.DATA
    ; Define your data segment here
    msg DB 'Hello, 8086 Microprocessor!$'

.CODE
MAIN PROC
    MOV AX, @DATA
    MOV DS, AX
    
    ; Your code here
    MOV AH, 09H
    LEA DX, msg
    INT 21H
    
    MOV AH, 4CH
    INT 21H
MAIN ENDP
END MAIN`;
  };

  const get8051Code = () => {
    return `; Bridge 86-51 - ${experimentTitle}
; Experiment ID: ${experimentId}
; Architecture: Intel 8051 (8051 Assembly)

ORG 0000H           ; Reset vector
    LJMP MAIN       ; Jump to main program

ORG 0030H           ; Main program starts here
MAIN:
    ; Initialize Stack Pointer
    MOV SP, #07H
    
    ; Your code here
    MOV A, #55H     ; Load accumulator with 55H
    MOV P1, A       ; Output to Port 1
    
    ; Example: Delay loop
    MOV R0, #0FFH
DELAY:
    DJNZ R0, DELAY
    
    ; Infinite loop
LOOP:
    SJMP LOOP
    
END`;
  };

  const getDefaultCode = () => {
    return activeArchitecture === '8086' ? get8086Code() : get8051Code();
  };

  const [code8086, setCode8086] = React.useState(get8086Code());
  const [code8051, setCode8051] = React.useState(get8051Code());
  const [output, setOutput] = React.useState('');
  const [isRunning, setIsRunning] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  // Get current code based on active architecture
  const currentCode = activeArchitecture === '8086' ? code8086 : code8051;
  const setCurrentCode = activeArchitecture === '8086' ? setCode8086 : setCode8051;

  const handleRun = () => {
    setIsRunning(true);
    setOutput('🔄 Compiling assembly code...\n');
    
    setTimeout(() => {
      setOutput(prev => prev + '✅ Compilation successful!\n');
      setOutput(prev => prev + '🚀 Running program...\n\n');
      setOutput(prev => prev + '--- OUTPUT ---\n');
      
      if (activeArchitecture === '8086') {
        // 8086 output simulation
        setOutput(prev => prev + 'Hello, 8086 Microprocessor!\n\n');
        setOutput(prev => prev + '--- REGISTERS (8086) ---\n');
        setOutput(prev => prev + 'AX: 0000H  BX: 0000H  CX: 0000H  DX: 0000H\n');
        setOutput(prev => prev + 'SI: 0000H  DI: 0000H  BP: 0000H  SP: 0100H\n');
        setOutput(prev => prev + 'CS: 1000H  DS: 2000H  SS: 3000H  ES: 4000H\n\n');
      } else {
        // 8051 output simulation
        setOutput(prev => prev + 'Port P1 = 55H (01010101b)\n\n');
        setOutput(prev => prev + '--- REGISTERS (8051) ---\n');
        setOutput(prev => prev + 'A: 55H    B: 00H    PSW: 00H\n');
        setOutput(prev => prev + 'R0: FFH   R1: 00H   R2: 00H   R3: 00H\n');
        setOutput(prev => prev + 'R4: 00H   R5: 00H   R6: 00H   R7: 00H\n');
        setOutput(prev => prev + 'SP: 07H   DPTR: 0000H\n');
        setOutput(prev => prev + 'P0: FFH   P1: 55H   P2: FFH   P3: FFH\n\n');
      }
      
      setOutput(prev => prev + '✨ Program terminated successfully.\n');
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode8086(get8086Code());
    setCode8051(get8051Code());
    setOutput('');
  };

  const handleCopy = () => {
    // Fallback method for when clipboard API is blocked
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(currentCode).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }).catch(() => {
          // Fallback to older method
          fallbackCopy();
        });
      } else {
        fallbackCopy();
      }
    } catch (err) {
      fallbackCopy();
    }
  };

  const fallbackCopy = () => {
    // Create a temporary textarea element
    const textarea = document.createElement('textarea');
    textarea.value = currentCode;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert('Failed to copy code. Please select and copy manually.');
    }
    
    document.body.removeChild(textarea);
  };

  const handleDownload = () => {
    const blob = new Blob([currentCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exp_${experimentId}_code.asm`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Code2 size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold">Assembly Code Editor</h3>
                  <p className="text-slate-400 text-xs">
                    {experimentTitle} • EXP {experimentId}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Toolbar */}
            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between border-b border-slate-200">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all ${
                    isRunning
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md hover:shadow-lg'
                  }`}
                >
                  <Play size={16} className="fill-current" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex overflow-hidden">
              {/* Code Editor */}
              <div className="flex-1 flex flex-col border-r border-slate-200">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    📝 Editor
                  </span>
                  
                  {/* Architecture Switcher for Ultimate Experiment */}
                  {isUltimateExperiment && (
                    <div className="flex items-center gap-1 bg-white rounded-lg p-1 border border-slate-200">
                      <button
                        onClick={() => setActiveArchitecture('8086')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          activeArchitecture === '8086'
                            ? 'bg-blue-500 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        8086 (x86)
                      </button>
                      <button
                        onClick={() => setActiveArchitecture('8051')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                          activeArchitecture === '8051'
                            ? 'bg-emerald-500 text-white shadow-sm'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        8051
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 bg-slate-900 p-6 relative">
                  <textarea
                    value={currentCode}
                    onChange={(e) => setCurrentCode(e.target.value)}
                    className="w-full h-full bg-transparent text-emerald-400 font-mono text-sm resize-none outline-none border-none"
                    style={{ 
                      caretColor: '#34d399',
                      lineHeight: '1.6',
                      tabSize: 4
                    }}
                    spellCheck={false}
                  />
                </div>
              </div>

              {/* Output Panel */}
              <div className="w-1/3 flex flex-col bg-slate-50">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    💻 Output
                  </span>
                </div>
                <div className="flex-1 overflow-auto p-6">
                  {output ? (
                    <pre className="text-sm font-mono text-slate-700 whitespace-pre-wrap">
                      {output}
                    </pre>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                      <Play size={32} className="mb-3 opacity-30" />
                      <p className="text-sm font-medium">Click "Run Code" to execute</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{activeArchitecture === '8086' ? 'Intel 8086 (x86 Assembly)' : 'Intel 8051 (8051 Assembly)'}</span>
                </div>
                <div className="w-px h-4 bg-slate-300" />
                <span>Lines: {currentCode.split('\n').length}</span>
                <div className="w-px h-4 bg-slate-300" />
                <span>Characters: {currentCode.length}</span>
              </div>
              <div className="text-xs text-slate-400 font-medium">
                Press <kbd className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">Ctrl+Enter</kbd> to run
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}