import React from 'react';
import { 
  BookOpen, 
  Cpu, 
  Zap, 
  Layers, 
  Code, 
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Search,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  subsections: {
    title: string;
    content: string;
    tips?: string[];
  }[];
}

export function DocumentationPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [expandedSections, setExpandedSections] = React.useState<string[]>(['getting-started']);

  const toggleSection = (id: string) => {
    setExpandedSections(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const documentation: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Lightbulb,
      color: 'blue',
      subsections: [
        {
          title: 'Welcome to Bridge 86-51',
          content: 'Bridge 86-51 is an AI-powered microarchitecture experiment platform designed to teach the architectural trade-offs between 8086 microprocessors and 8051 microcontrollers through hands-on experimentation.',
          tips: [
            'Start with Forward Track experiments to build up from microprocessors',
            'Use Reverse Track to understand microcontroller integration benefits',
            'Complete experiments in sequence for best learning progression'
          ]
        },
        {
          title: 'Lab Workspace Overview',
          content: 'The interactive workspace allows you to drag-and-drop circuit components, create wire connections, write assembly code, and validate your designs with AI assistance. Use the component palette on the left to add parts to your circuit.',
          tips: [
            'Use Ctrl+Z for undo and Ctrl+Y for redo',
            'Click the wire tool to enter manual wiring mode',
            'Right-click wires to delete them',
            'Use the zoom controls for detailed work'
          ]
        }
      ]
    },
    {
      id: 'experiments',
      title: 'Experiment Tracks',
      icon: Cpu,
      color: 'purple',
      subsections: [
        {
          title: 'Forward Track (F1-F4)',
          content: 'Start with an 8086 microprocessor and progressively add external components like RAM, ROM, timers, and I/O interfaces. Learn why microprocessors need external peripherals and how to interface them properly.',
          tips: [
            'F1: External Memory Interfacing - Learn address decoding',
            'F2: I/O Expansion via 8255 PPI - Add parallel I/O capabilities',
            'F3: Timer Integration with 8254 - Implement timing functions',
            'F4: Serial Communication via 8251 USART - Enable serial data transfer'
          ]
        },
        {
          title: 'Reverse Track (R1-R4)',
          content: 'Start with an 8051 microcontroller and decompose its internal modules to understand the benefits of integration. See how internal RAM, timers, and I/O ports simplify system design.',
          tips: [
            'R1: Internal Memory Architecture - Understand on-chip RAM/ROM',
            'R2: Integrated Timer/Counters - Learn built-in timing capabilities',
            'R3: Serial Port Integration - Explore on-chip UART',
            'R4: Interrupt System Analysis - Study integrated interrupt handling'
          ]
        },
        {
          title: 'Ultimate Converter Lab (U1)',
          content: 'The capstone experiment where you build a complete microcontroller-equivalent system using a microprocessor and all necessary external components. This synthesizes everything learned in both tracks.',
          tips: [
            'Requires 9 components: 8086, SRAM, EPROM, Decoder, PPI, Timer, USART, PIC, Clock',
            'All buses must be properly connected',
            'Test with assembly code to verify functionality',
            'Aim for 100% validation score'
          ]
        }
      ]
    },
    {
      id: 'workspace',
      title: 'Workspace Features',
      icon: Layers,
      color: 'emerald',
      subsections: [
        {
          title: 'Component Placement',
          content: 'Drag components from the palette onto the canvas. Components snap to grid when Grid Snap is enabled in settings. Use the mouse wheel or zoom controls to adjust view scale.',
          tips: [
            'Double-click components to see technical specifications',
            'Components auto-arrange to prevent overlapping',
            'Delete components by selecting and pressing Delete key'
          ]
        },
        {
          title: 'Wire Connections',
          content: 'Click the wire tool to enter manual wiring mode. Click on a component pin to start a wire, then click on another pin to complete the connection. Wires can be curved or straight based on your settings.',
          tips: [
            'Right-click on wires to delete them',
            'Use the color palette to change wire colors',
            'Wires automatically route around components',
            'Hover over pins to see their function'
          ]
        },
        {
          title: 'Assembly Code Editor',
          content: 'Write and test assembly code for your circuit. The editor includes syntax highlighting for 8086/8051 assembly. Code is saved with your progress and included in lab reports.',
          tips: [
            'Use MOV, ADD, SUB, JMP and other standard opcodes',
            'Comments start with semicolon (;)',
            'Code validation checks for syntax errors',
            'Press Ctrl+S to save your code'
          ]
        },
        {
          title: 'AI Validation',
          content: 'Click "Validate Circuit" to have the AI analyze your design. It checks component connections, bus wiring, address decoding logic, and overall circuit correctness.',
          tips: [
            'Fix all critical errors before proceeding',
            'Warnings are suggestions, not requirements',
            'Validation results are saved with your progress',
            'Multiple validation attempts are allowed'
          ]
        }
      ]
    },
    {
      id: 'components',
      title: 'Component Reference',
      icon: Zap,
      color: 'yellow',
      subsections: [
        {
          title: '8086 Microprocessor',
          content: '16-bit microprocessor with 20-bit address bus (1MB addressing), 16-bit data bus, and multiplexed AD0-AD15 pins. Requires external memory and I/O devices.',
          tips: [
            'Address lines: A0-A19',
            'Data lines: D0-D15 (multiplexed with AD0-AD15)',
            'Control signals: ALE, RD, WR, M/IO',
            'Clock frequency: Up to 10 MHz'
          ]
        },
        {
          title: '8051 Microcontroller',
          content: '8-bit microcontroller with 128 bytes internal RAM, 4KB ROM, two 16-bit timers, one serial port, and four 8-bit I/O ports integrated on-chip.',
          tips: [
            'Ports: P0, P1, P2, P3 (32 I/O pins total)',
            'Timers: Timer 0, Timer 1',
            'Serial port: Full-duplex UART',
            'Interrupts: 5 interrupt sources'
          ]
        },
        {
          title: '8255 PPI (Programmable Peripheral Interface)',
          content: 'Provides 24 programmable I/O pins organized as three 8-bit ports (A, B, C). Supports multiple operating modes for flexible I/O operations.',
          tips: [
            'Port A: 8-bit I/O',
            'Port B: 8-bit I/O',
            'Port C: 8-bit I/O (can be split into two 4-bit ports)',
            'Modes: Mode 0 (basic I/O), Mode 1 (strobed I/O), Mode 2 (bidirectional)'
          ]
        },
        {
          title: '8254 Timer',
          content: 'Programmable interval timer with three independent 16-bit counters. Used for timing, event counting, and waveform generation.',
          tips: [
            'Three counters: Counter 0, 1, 2',
            'Six operating modes per counter',
            'Input clock frequency up to 10 MHz',
            'Binary or BCD counting'
          ]
        },
        {
          title: '8251 USART',
          content: 'Universal Synchronous/Asynchronous Receiver/Transmitter for serial communication. Supports various baud rates and data formats.',
          tips: [
            'Supports async and sync modes',
            'Programmable baud rate',
            'Data format: 5-8 bits, 1-2 stop bits',
            'Parity: even, odd, or none'
          ]
        }
      ]
    },
    {
      id: 'tips',
      title: 'Tips & Best Practices',
      icon: Code,
      color: 'red',
      subsections: [
        {
          title: 'Circuit Design',
          content: 'Always start with power and clock connections. Plan your address decoding before adding memory chips. Keep data and address buses organized with consistent wire colors.',
          tips: [
            'Use color coding: red for power, black for ground, blue for data, green for address',
            'Label important nodes and buses',
            'Keep wires as short as possible',
            'Group related components together'
          ]
        },
        {
          title: 'Troubleshooting',
          content: 'If validation fails, check connections systematically. Verify address decoding logic, ensure all buses are complete, and confirm control signals are properly connected.',
          tips: [
            'Use the zoom tool to inspect connections closely',
            'Check for floating pins (unconnected)',
            'Verify chip enable and read/write signals',
            'Test with simple assembly code first'
          ]
        },
        {
          title: 'Maximizing Your Score',
          content: 'Complete all experiment steps, write comprehensive assembly code, answer viva questions thoroughly, and aim for first-time validation success to maximize your lab report score.',
          tips: [
            'Read experiment objectives carefully',
            'Test incrementally as you build',
            'Document your design decisions',
            'Review concepts before starting'
          ]
        }
      ]
    }
  ];

  const filteredDocs = documentation.map(section => ({
    ...section,
    subsections: section.subsections.filter(sub =>
      sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.subsections.length > 0);

  const colorClasses = {
    blue: { 
      bg: 'bg-blue-500', 
      text: 'text-blue-600 dark:text-blue-400', 
      light: 'bg-blue-50 dark:bg-blue-900/20', 
      border: 'border-blue-200 dark:border-blue-800' 
    },
    purple: { 
      bg: 'bg-purple-500', 
      text: 'text-purple-600 dark:text-purple-400', 
      light: 'bg-purple-50 dark:bg-purple-900/20', 
      border: 'border-purple-200 dark:border-purple-800' 
    },
    emerald: { 
      bg: 'bg-emerald-500', 
      text: 'text-emerald-600 dark:text-emerald-400', 
      light: 'bg-emerald-50 dark:bg-emerald-900/20', 
      border: 'border-emerald-200 dark:border-emerald-800' 
    },
    yellow: { 
      bg: 'bg-yellow-500', 
      text: 'text-yellow-600 dark:text-yellow-400', 
      light: 'bg-yellow-50 dark:bg-yellow-900/20', 
      border: 'border-yellow-200 dark:border-yellow-800' 
    },
    red: { 
      bg: 'bg-red-500', 
      text: 'text-red-600 dark:text-red-400', 
      light: 'bg-red-50 dark:bg-red-900/20', 
      border: 'border-red-200 dark:border-red-800' 
    },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/30">
          <BookOpen size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Documentation</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Complete guide to Bridge 86-51 platform</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search documentation..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800">
        <h2 className="text-lg font-black text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb size={20} className="text-blue-600 dark:text-blue-400" />
          Quick Start
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => toggleSection('getting-started')}
            className="px-4 py-3 bg-white dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all text-left flex items-center justify-between group"
          >
            <span>Getting Started Guide</span>
            <ArrowRight size={16} className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => toggleSection('experiments')}
            className="px-4 py-3 bg-white dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all text-left flex items-center justify-between group"
          >
            <span>Experiment Tracks</span>
            <ArrowRight size={16} className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => toggleSection('workspace')}
            className="px-4 py-3 bg-white dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all text-left flex items-center justify-between group"
          >
            <span>Workspace Features</span>
            <ArrowRight size={16} className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => toggleSection('components')}
            className="px-4 py-3 bg-white dark:bg-slate-800 rounded-xl font-bold text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-slate-700 transition-all text-left flex items-center justify-between group"
          >
            <span>Component Reference</span>
            <ArrowRight size={16} className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Documentation Sections */}
      <div className="space-y-4">
        {filteredDocs.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <Search size={64} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Results Found</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium">Try a different search query</p>
          </div>
        ) : (
          filteredDocs.map((section, index) => {
            const colors = colorClasses[section.color as keyof typeof colorClasses];
            const Icon = section.icon;
            const isExpanded = expandedSections.includes(section.id);

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-slate-800 rounded-2xl border-2 ${colors.border} dark:border-opacity-50 overflow-hidden`}
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full ${colors.light} p-6 flex items-center justify-between hover:opacity-80 transition-opacity`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <Icon size={24} />
                    </div>
                    <div className="text-left">
                      <h2 className="text-xl font-black text-slate-900 dark:text-white">{section.title}</h2>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{section.subsections.length} topics</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp size={24} className={colors.text} />
                  ) : (
                    <ChevronDown size={24} className={colors.text} />
                  )}
                </button>

                {/* Subsections */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 space-y-6 border-t-2 border-slate-100 dark:border-slate-700">
                        {section.subsections.map((sub, subIndex) => (
                          <div key={subIndex} className="space-y-3">
                            <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                              <CheckCircle2 size={18} className={colors.text} />
                              {sub.title}
                            </h3>
                            <p className="text-slate-600 dark:text-slate-300 font-medium leading-relaxed pl-7">
                              {sub.content}
                            </p>
                            {sub.tips && sub.tips.length > 0 && (
                              <div className={`${colors.light} rounded-xl p-4 ml-7`}>
                                <p className={`text-sm font-bold ${colors.text} mb-2 flex items-center gap-2`}>
                                  <AlertCircle size={14} />
                                  Key Points:
                                </p>
                                <ul className="space-y-1">
                                  {sub.tips.map((tip, tipIndex) => (
                                    <li key={tipIndex} className="text-sm text-slate-700 dark:text-slate-400 font-medium flex items-start gap-2">
                                      <span className={colors.text}>•</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400 font-medium space-y-2">
        <p>Need more help? Contact your lab instructor or check the experiment-specific guides.</p>
        <p className="text-xs">Last updated: March 2026 • Bridge 86-51 v2.0</p>
      </div>
    </div>
  );
}