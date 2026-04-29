import React from 'react';
import { 
  Save, 
  CheckCircle2, 
  ArrowLeft,
  Database,
  Cpu,
  Zap,
  BookOpen,
  Trash2,
  Dna,
  Layout,
  Undo2,
  RotateCcw,
  MousePointer2,
  Scissors,
  Palette,
  Move,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DraggableLabItem } from './DraggableLabItem';
import { ImageWithFallback } from './shared/ImageWithFallback';
import { CodeEditorModal } from './CodeEditorModal';
import { supabase } from "../utils/supabase";

const AUTH_SESSION_KEY = 'bridge-86-51-auth-session';

interface LabComponent {
  id: string;
  name: string;
  type: string;
  image: string;
  requiredForStep?: number;
  instanceId?: string; // Unique ID for each placed component
  x?: number;
  y?: number;
}

interface Experiment {
  id: string;
  title: string;
  goal: string;
  setup: string[];
  viva: string[];
  initialComponents: LabComponent[];
  availableComponents: LabComponent[];
}

const componentLibrary: Record<string, LabComponent> = {
  cpu8086: { id: 'cpu8086', name: 'Intel 8086 CPU', type: 'Processor', image: '' },
  mcu8051: { id: 'mcu8051', name: 'Intel 8051 MCU', type: 'Controller', image: '' },
  ram6264: { id: 'ram6264', name: '6264 SRAM (8KB)', type: 'Memory', image: '' },
  rom2764: { id: 'rom2764', name: '2764 EPROM (8KB)', type: 'Memory', image: '' },
  decoder138: { id: 'decoder138', name: '74LS138 Decoder', type: 'Logic IC', image: '' },
  timer8254: { id: 'timer8254', name: '8254 Timer/PIT', type: 'Peripheral', image: '' },
  serial8251: { id: 'serial8251', name: '8251 USART Port', type: 'Communication', image: '' },
  ppi8255: { id: 'ppi8255', name: '8255 PPI (I/O)', type: 'Peripheral', image: '' },
  pic8259: { id: 'pic8259', name: '8259 Interrupt Controller', type: 'Logic IC', image: '' },
  clock8284: { id: 'clock8284', name: '8284 Clock Generator', type: 'Clock', image: '' },
};

const experimentData: Record<string, Experiment> = {
  F1: {
    id: 'F1',
    title: 'External Memory Interfacing',
    goal: 'Understand why 8086 needs external RAM & ROM.',
    setup: ['Place the 8086 CPU onto the board', 'Attach SRAM (6264) for data storage', 'Attach ROM (2764) for BIOS mapping', 'Add 74LS138 Decoder for memory bank isolation'],
    viva: [
      'Why does 8086 require address decoding?',
      'What is the difference between active-low and active-high chip select?',
      'How do you map ROM to the top of memory in 8086?'
    ],
    initialComponents: [],
    availableComponents: [componentLibrary.cpu8086, componentLibrary.ram6264, componentLibrary.rom2764, componentLibrary.decoder138]
  },
  F2: {
    id: 'F2',
    title: 'I/O Expansion via 8255 PPI',
    goal: 'Interface external switches and LEDs to the 8086.',
    setup: ['Mount 8086 CPU', 'Interface 8255 PPI chip', 'Define Address Map for Port A/B/C'],
    viva: [
      'What are the three modes of operation in 8255?',
      'How do you initialize the Control Word Register?',
      'Explain BSR (Bit Set/Reset) mode.'
    ],
    initialComponents: [componentLibrary.cpu8086],
    availableComponents: [componentLibrary.ppi8255, componentLibrary.decoder138]
  },
  F3: {
    id: 'F3',
    title: 'Timing & Delay with 8254 PIT',
    goal: 'Generate precise hardware delays and waveforms.',
    setup: ['Mount 8086 CPU', 'Interface 8254 PIT chip', 'Configure Counter 0 for Square Wave'],
    viva: [
      'How many counters are available in 8254?',
      'Explain Mode 3 (Square Wave Generator) operation.',
      'How is the frequency divided by the 8254?'
    ],
    initialComponents: [componentLibrary.cpu8086, componentLibrary.decoder138],
    availableComponents: [componentLibrary.timer8254]
  },
  F4: {
    id: 'F4',
    title: 'Vector Interrupts with 8259 PIC',
    goal: 'Manage multiple interrupt requests using priority.',
    setup: ['Mount 8086 CPU', 'Interface 8259 PIC chip', 'Connect INTR and INTA lines', 'Map IRQ0-IRQ7 inputs'],
    viva: [
      'What is the difference between Edge-triggered and Level-triggered interrupts?',
      'Explain the sequence of operations during an Interrupt Acknowledge cycle.',
      'What is the purpose of ICW (Initialization Command Words)?'
    ],
    initialComponents: [componentLibrary.cpu8086, componentLibrary.decoder138],
    availableComponents: [componentLibrary.pic8259]
  },
  R1: {
    id: 'R1',
    title: 'External RAM Interfacing (Reverse)',
    goal: 'Understand internal memory organization benefits.',
    setup: ['Start with 8051 MCU', 'Configure Port 0 for Address/Data multiplexing', 'Add External RAM (6264)', 'Set EA Pin to Low'],
    viva: [
      'Explain the impact of the EA pin in 8051.',
      'How many bytes of external RAM can 8051 address?',
      'Why is internal RAM access faster than external?'
    ],
    initialComponents: [componentLibrary.mcu8051],
    availableComponents: [componentLibrary.ram6264, componentLibrary.decoder138]
  },
  R2: {
    id: 'R2',
    title: 'Serial UART Decomposition',
    goal: 'Compare internal UART with external 8251 USART.',
    setup: ['Start with 8051 MCU', 'Disable internal SBUF communication', 'Interface 8251 USART chip'],
    viva: [
      'What is the benefit of an internal UART compared to an external one?',
      'Explain the framing format in asynchronous communication.',
      'How does the baud rate generator work in 8051?'
    ],
    initialComponents: [componentLibrary.mcu8051],
    availableComponents: [componentLibrary.serial8251]
  },
  R3: {
    id: 'R3',
    title: 'Port Expansion vs Native I/O',
    goal: 'Analyze latency differences between internal Ports and 8255.',
    setup: ['Start with 8051 MCU', 'Interface external 8255 PPI', 'Map 8255 to External Data Space', 'Verify Bit-addressability limits'],
    viva: [
      'Are external 8255 ports bit-addressable in 8051?',
      'What instruction is used to access external I/O?',
      'Compare the gate count of internal vs external port logic.'
    ],
    initialComponents: [componentLibrary.mcu8051],
    availableComponents: [componentLibrary.ppi8255, componentLibrary.decoder138]
  },
  R4: {
    id: 'R4',
    title: 'Timer Modularization',
    goal: 'Offload timing tasks from internal 8051 timers.',
    setup: ['Start with 8051 MCU', 'Interface external 8254 Timer', 'Connect GATE and CLK inputs', 'Monitor CPU overhead reduction'],
    viva: [
      'Why would you use an external timer if 8051 has two internal ones?',
      'Explain the difference between Timer 0 and Timer 1 in 8051.',
      'What is auto-reload mode?'
    ],
    initialComponents: [componentLibrary.mcu8051],
    availableComponents: [componentLibrary.timer8254]
  },
  U1: {
    id: 'U1',
    title: 'μP to μC Ultimate Converter Lab',
    goal: 'Build a functional Microcontroller system from discrete Microprocessor components, then compare with an integrated 8051.',
    setup: [
      'Mount the Intel 8086 Microprocessor (The Core)',
      'Interface External SRAM (6264) for internal data memory equivalent',
      'Interface External EPROM (2764) for program memory (ROM) equivalent',
      'Add 74LS138 Address Decoder for memory bank selection',
      'Interface 8255 PPI to create parallel I/O ports (Port A/B/C)',
      'Add 8254 Timer/PIT to implement internal hardware timers',
      'Interface 8251 USART for serial communication',
      'Add 8259 PIC for interrupt management',
      'Connect 8284 Clock Generator for system timing',
      'Compare: Place 8051 MCU alongside to visualize integration benefits'
    ],
    viva: [
      'What are the essential components we must add to a μP to make it a μC?',
      'How does an integrated SoC handle the internal bus differently than our wired board?',
      'Why does a standalone μP system consume more power than an integrated μC?',
      'Explain the role of the clock generator in a microprocessor system.',
      'How does the interrupt controller prioritize multiple interrupt requests?',
      'Count the total ICs: How many chips does 8086 need vs 8051?'
    ],
    initialComponents: [],
    availableComponents: [
      componentLibrary.cpu8086, 
      componentLibrary.ram6264, 
      componentLibrary.rom2764,
      componentLibrary.decoder138,
      componentLibrary.ppi8255,
      componentLibrary.timer8254,
      componentLibrary.serial8251,
      componentLibrary.pic8259,
      componentLibrary.clock8284,
      componentLibrary.mcu8051  // Add last for comparison
    ]
  }
};

function LabWorkbench({ 
  onComponentDropped, 
  placedComponents, 
  onComponentRemoved,
  onComponentMoved,
  onPinClick,
  wires,
  getPinPos,
  isWiringMode,
  isDeleteMode,
  activeWire,
  mousePos,
  handleMouseMove,
  workbenchRef,
  onWireClick,
  zoom,
  isPanMode,
  panOffset,
  onPanMouseDown,
  onPanMouseMove,
  onPanMouseUp
}: { 
  onComponentDropped: (componentId: string, x: number, y: number) => void, 
  placedComponents: LabComponent[],
  onComponentRemoved: (instanceId: string) => void,
  onComponentMoved: (instanceId: string, x: number, y: number) => void,
  onPinClick: (instanceId: string, pinName: string) => void,
  wires: any[],
  getPinPos: (id: string, pin: string) => {x: number, y: number},
  isWiringMode: boolean,
  isDeleteMode?: boolean,
  activeWire: {
    color: string;comp: string, pin: string
} | null,
  mousePos: {x: number, y: number},
  handleMouseMove: (e: React.MouseEvent) => void,
  workbenchRef: React.RefObject<HTMLDivElement | null>,
  onWireClick?: (index: number) => void,
  zoom: number,
  isPanMode?: boolean,
  panOffset?: {x: number, y: number},
  onPanMouseDown?: (e: React.MouseEvent) => void,
  onPanMouseMove?: (e: React.MouseEvent) => void,
  onPanMouseUp?: () => void
}) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'LAB_COMPONENT',
    drop: (item: any, monitor) => {
      if (isWiringMode || isDeleteMode) return;
      const clientOffset = monitor.getClientOffset();
      const element = (workbenchRef as any)?.current;
      if (!clientOffset || !element) return;
      
      const rect = element.getBoundingClientRect();
      const rawX = clientOffset.x - rect.left;
      const rawY = clientOffset.y - rect.top;
      
      // Get workbench center for transform origin calculation
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Adjust for zoom with center transform origin
      const adjustedX = ((rawX - centerX) / zoom) + centerX;
      const adjustedY = ((rawY - centerY) / zoom) + centerY;
      
      // Remove pan offset
      const x = adjustedX - (panOffset?.x || 0) / zoom;
      const y = adjustedY - (panOffset?.y || 0) / zoom;
      
      // Get component dimensions for centering
      const compWidth = (item.id === 'cpu8086' || item.id === 'mcu8051') ? 120 : 
                        ((item.id === 'ram6264' || item.id === 'rom2764') ? 100 : 80);
      const compHeight = (item.id === 'cpu8086' || item.id === 'mcu8051') ? 160 : 
                         ((item.id === 'ram6264' || item.id === 'rom2764') ? 120 : 100);
      
      // Center the component on cursor
      const finalX = x - (compWidth / 2);
      const finalY = y - (compHeight / 2);
      
      if (item.instanceId) {
        // Move existing component
        onComponentMoved(item.instanceId, finalX, finalY);
      } else {
        // Drop new component
        onComponentDropped(item.id, finalX, finalY);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [onComponentDropped, onComponentMoved, isWiringMode, isDeleteMode, placedComponents, zoom, panOffset]);

  const isActive = isOver && canDrop;

  return (
    <div 
      ref={(el) => {
        drop(el);
        if (workbenchRef) (workbenchRef as any).current = el;
      }}
      onMouseMove={(e) => {
        handleMouseMove(e);
        if (onPanMouseMove) onPanMouseMove(e);
      }}
      onMouseDown={onPanMouseDown}
      onMouseUp={onPanMouseUp}
      onMouseLeave={onPanMouseUp}
      className={`aspect-video rounded-3xl border border-slate-200 dark:border-slate-700 transition-all relative flex items-center justify-center overflow-hidden ${
        isActive ? 'bg-blue-50/50 dark:bg-blue-900/20 shadow-inner' : 'bg-white dark:bg-slate-800'
      } ${isWiringMode ? 'cursor-crosshair' : ''} ${isPanMode ? 'cursor-move' : ''}`}
      style={{
        backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)',
        backgroundSize: '24px 24px'
      }}
    >
      {/* Zoom indicator */}
      <div className="absolute top-4 right-4 z-40 bg-slate-900/80 text-white px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-sm">
        {Math.round(zoom * 100)}%
      </div>

      {/* Zoomable and pannable content wrapper */}
      <div
        style={{
          transform: `translate(${panOffset?.x || 0}px, ${panOffset?.y || 0}px) scale(${zoom})`,
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          position: 'absolute',
          transition: isPanMode ? 'none' : 'transform 0.1s ease-out',
          pointerEvents: isPanMode ? 'none' : 'auto'
        }}
      >
        {placedComponents.length === 0 && (
          <div className="flex flex-col items-center gap-4 text-slate-300 absolute inset-0 justify-center">
            <div className="w-16 h-16 rounded-full border border-slate-200 border-dashed flex items-center justify-center animate-pulse">
              <Layout size={32} strokeWidth={1} />
            </div>
            <p className="text-xs font-mono uppercase tracking-widest">Workspace ready</p>
          </div>
        )}

        {placedComponents.map((comp) => (
          <div
            key={comp.instanceId}
            className={`absolute z-10 group pointer-events-auto ${isWiringMode ? '' : 'cursor-grab active:cursor-grabbing'} ${isDeleteMode ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (isDeleteMode) onComponentRemoved(comp.instanceId!);
            }}
            style={{ 
              left: comp.x, 
              top: comp.y, 
              width: comp.type === 'Processor' || comp.type === 'Controller' ? 120 : (comp.type === 'Memory' ? 100 : 80), 
              height: comp.type === 'Processor' || comp.type === 'Controller' ? 160 : (comp.type === 'Memory' ? 120 : 100)
            }}
          >
            <div className={`w-full h-full relative rounded-xl transition-all ${isDeleteMode ? 'ring-2 ring-red-500 ring-offset-2 bg-red-50/50' : ''}`}>
              <DraggableLabItem 
                id={comp.id} 
                name={comp.name} 
                image={comp.image} 
                type={comp.type} 
                instanceId={comp.instanceId}
                onPinClick={onPinClick}
                isWiringMode={isWiringMode}
              />
              
              {isDeleteMode && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-500/10 pointer-events-none">
                  <Scissors size={32} className="text-red-500 opacity-50" />
                </div>
              )}
              
              {!isWiringMode && !isDeleteMode && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onComponentRemoved(comp.instanceId!);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-50 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border border-red-100 shadow-sm z-20 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={10} />
                </button>
              )}
            </div>
          </div>
        ))}

        {/* SVG Layer for wires - moved to top and enhanced visibility */}
        <svg className="absolute inset-0 pointer-events-none z-30 w-full h-full overflow-visible">
          {wires.map((wire, i) => {
            const from = getPinPos(wire.from.comp, wire.from.pin);
            const to = getPinPos(wire.to.comp, wire.to.pin);
            const midX = (from.x + to.x) / 2;
            return (
              <path 
                key={i}
                d={`M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`}
                stroke={isDeleteMode ? "#ef4444" : (wire.color || "#2563eb")}
                strokeWidth={isDeleteMode ? "4" : "2.5"}
                fill="none"
                strokeLinecap="round"
                className={`drop-shadow-sm animate-in fade-in duration-500 cursor-pointer hover:stroke-red-500 hover:stroke-[5px] transition-all ${isDeleteMode ? 'pointer-events-auto animate-pulse' : 'pointer-events-none'}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (onWireClick && isDeleteMode) onWireClick(i);
                }}
              >
                <title>Click to remove wire</title>
              </path>
            );
          })}
          {/* Active connection preview wire */}
          {activeWire && (
            <path 
              d={`M ${getPinPos(activeWire.comp, activeWire.pin).x} ${getPinPos(activeWire.comp, activeWire.pin).y} L ${mousePos.x} ${mousePos.y}`}
              stroke={activeWire.color || "#0546d2"}
              strokeWidth="2"
              strokeDasharray="4 4"
              fill="none"
              className="animate-pulse"
            />
          )}
        </svg>
      </div>

      {isActive && !isWiringMode && (
        <div className="absolute inset-0 border-2 border-blue-400 border-dashed rounded-3xl pointer-events-none" />
      )}
    </div>
  );
}

export function LabWorkspace({ expId, onBack }: { expId: string, onBack: () => void }) {
  const exp = experimentData[expId] || experimentData['F1'];
  const [completedSteps, setCompletedSteps] = React.useState<number[]>([]);
  const [isValidated, setIsValidated] = React.useState(false);
  const [placedComponents, setPlacedComponents] = React.useState<LabComponent[]>(exp.initialComponents.map(c => ({
    ...c,
    instanceId: Math.random().toString(36).substr(2, 9),
    x: 100 + Math.random() * 200,
    y: 100 + Math.random() * 100
  })));
  const [isWiringMode, setIsWiringMode] = React.useState(false);
  const [isDeleteMode, setIsDeleteMode] = React.useState(false);
  const [isPanMode, setIsPanMode] = React.useState(false);
  const [panOffset, setPanOffset] = React.useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = React.useState(false);
  const [panStart, setPanStart] = React.useState({ x: 0, y: 0 });
  const [wireColor, setWireColor] = React.useState("#2563eb");
  const [wires, setWires] = React.useState<{from: {comp: string, pin: string}, to: {comp: string, pin: string}, color: string}[]>([]);
  const [activeWire, setActiveWire] = React.useState<{comp: string, pin: string, color: string} | null>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [history, setHistory] = React.useState<{components: LabComponent[], wires: any[]}[]>([]);
  const [zoom, setZoom] = React.useState(1);
  const workbenchRef = React.useRef<HTMLDivElement>(null);
  const [isCodeEditorOpen, setIsCodeEditorOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = React.useState(false);
  const [validationResult, setValidationResult] = React.useState<any>(null);

  // Load saved progress from localStorage on component mount
  React.useEffect(() => {
    const savedData = localStorage.getItem(`lab-progress-${exp.id}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPlacedComponents(parsed.placedComponents || []);
        setWires(parsed.wires || []);
        setCompletedSteps(parsed.completedSteps || []);
        setZoom(parsed.zoom || 1);
        setPanOffset(parsed.panOffset || { x: 0, y: 0 });
      } catch (error) {
        console.error('Failed to load saved progress:', error);
      }
    }
  }, [exp.id]);

  // Save progress function
  const handleSaveProgress = async () => {
    try {
      setIsSaving(true);

      const progressData = {
        placedComponents,
        wires,
        completedSteps,
        zoom,
        panOffset,
      };

      localStorage.setItem(`lab-progress-${exp.id}`, JSON.stringify(progressData));

      // App auth is localStorage-based; sync to Supabase only when a Supabase auth user exists.
      const { data: userData, error: authError } = await supabase.auth.getUser();
      const user = userData.user;

      if (authError) {
        console.warn('Supabase auth check failed. Progress was saved locally.', authError);
      }

      const fakeUser = user || { id: "test-user-123" };

      const { error: syncError } = await supabase.from("progress").insert([
        {
          user_id: fakeUser.id,
          experiment_id: exp.id,
          components: JSON.stringify(placedComponents),
          wires: JSON.stringify(wires),
        }
      ]);

      if (syncError) {
        console.error("❌ FULL ERROR:", syncError);
      } else {
        console.log("🔥 SAVED TO SUPABASE");
      }

      setSaveSuccess(true);

    } catch (error) {
      console.error("Save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };


const handleValidate = async () => {
  try {
    console.log("AI Validate clicked");

    const response = await fetch("/api/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        experiment: exp.id,
        components: placedComponents.map(c => {
          if (c.id.includes("ram")) return "RAM";
          if (c.id.includes("rom")) return "ROM";
          if (c.id.includes("decoder")) return "Decoder";
          if (c.id.includes("cpu")) return "CPU";
          if (c.id.includes("ppi")) return "8255";
          if (c.id.includes("timer")) return "8253";
          if (c.id.includes("serial")) return "8251";
          return c.id;
        }),
        connections: wires.map(w => `${w.from.comp}-${w.to.comp}`)
      })
    });

    const data = await response.json();

    console.log("🔥 Backend Response:", data);

    setValidationResult(data);
setIsValidated(true);

  } catch (error) {
    console.error("❌ Validation error:", error);
  }
};



  // Keyboard Event Listener for ESC and Shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeWire) {
          setActiveWire(null);
        } else if (isWiringMode) {
          setIsWiringMode(false);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeWire, isWiringMode, history]);

  // Native wheel event listener to prevent page scroll
  React.useEffect(() => {
    const element = workbenchRef.current;
    if (!element) return;

    const handleNativeWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.min(Math.max(0.5, prev + delta), 2));
    };

    element.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleNativeWheel);
  }, []);

  const saveHistory = () => {
    setHistory(prev => [...prev, { components: [...placedComponents], wires: [...wires] }].slice(-20)); // Keep last 20 steps
  };

  const handleUndo = () => {
    if (history.length === 0) return;
    const lastState = history[history.length - 1];
    setPlacedComponents(lastState.components);
    setWires(lastState.wires);
    setHistory(prev => prev.slice(0, -1));
  };

  const handleClearBoard = () => {
    saveHistory();
    setPlacedComponents([]);
    setWires([]);
  };

  const handleWireDelete = (index: number) => {
    saveHistory();
    setWires(prev => prev.filter((_, i) => i !== index));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!activeWire || !workbenchRef.current) return;
    const rect = workbenchRef.current.getBoundingClientRect();
    
    // Calculate mouse position accounting for pan and zoom
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;
    
    // Remove pan offset and zoom to get actual workbench coordinates
    const x = (rawX - panOffset.x) / zoom;
    const y = (rawY - panOffset.y) / zoom;
    
    setMousePos({ x, y });
  };

  // Handle panning
  const handlePanMouseDown = (e: React.MouseEvent) => {
    if (!isPanMode) return;
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handlePanMouseMove = (e: React.MouseEvent) => {
    if (!isPanning || !isPanMode) return;
    setPanOffset({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    });
  };

  const handlePanMouseUp = () => {
    setIsPanning(false);
  };

  const handlePinClick = (instanceId: string, pinName: string) => {
    if (!isWiringMode) return;
    
    if (!activeWire) {
      setActiveWire({ comp: instanceId, pin: pinName, color: wireColor });
      // Initialize mouse pos to pin pos to avoid jump
      const pos = getPinPos(instanceId, pinName);
      setMousePos(pos);
    } else {
      if (activeWire.comp === instanceId && activeWire.pin === pinName) {
        setActiveWire(null);
        return;
      }
      saveHistory();
      setWires(prev => [...prev, { from: { comp: activeWire.comp, pin: activeWire.pin }, to: { comp: instanceId, pin: pinName }, color: activeWire.color }]);
      setActiveWire(null);
    }
  };

  const getPinPos = (instanceId: string, pinName: string) => {
    const comp = placedComponents.find(c => c.instanceId === instanceId);
    if (!comp) return { x: 0, y: 0 };
    
    const isCPU = comp.type === 'Processor' || comp.type === 'Controller';
    const isMemory = comp.type === 'Memory';
    const isPeripheral = comp.type === 'Peripheral';
    const isLogic = comp.type === 'Logic IC';
    
    const width = isCPU ? 120 : (isMemory || isPeripheral ? 100 : 80);
    
    // Define exact pin layouts based on SVG component definitions
    const pinLayouts: Record<string, { left: string[], right: string[] }> = {
      'cpu8086': {
        left: ['AD0', 'AD1', 'AD2', 'AD3', 'AD4', 'AD5', 'AD6', 'AD7', 'NMI', 'INTR'],
        right: ['AD15', 'AD14', 'AD13', 'AD12', 'A19/S6', 'A18/S5', 'A17/S4', 'A16/S3', 'RD', 'WR']
      },
      'mcu8051': {
        left: ['P1.0', 'P1.1', 'P1.2', 'P1.3', 'P1.4', 'P1.5', 'P1.6', 'P1.7', 'RST', 'RXD'],
        right: ['P0.0', 'P0.1', 'P0.2', 'P0.3', 'P0.4', 'P0.5', 'P0.6', 'P0.7', 'EA', 'ALE']
      },
      'ram6264': {
        left: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'CE'],
        right: ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'OE']
      },
      'rom2764': {
        left: ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'CE'],
        right: ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'OE']
      },
      'decoder138': {
        left: ['A', 'B', 'C', 'G1'],
        right: ['Y0', 'Y1', 'Y2', 'Y3', 'Y4']
      },
      'timer8254': {
        left: ['D0', 'D1', 'D2', 'CLK', 'GATE'],
        right: ['OUT0', 'OUT1', 'OUT2', 'RD', 'WR']
      },
      'serial8251': {
        left: ['D0', 'D1', 'D2', 'CLK', 'GATE'],
        right: ['OUT0', 'OUT1', 'OUT2', 'RD', 'WR']
      },
      'ppi8255': {
        left: ['D0', 'D1', 'D2', 'CLK', 'GATE'],
        right: ['OUT0', 'OUT1', 'OUT2', 'RD', 'WR']
      },
      'pic8259': {
        left: ['D0', 'D1', 'D2', 'CLK', 'GATE'],
        right: ['OUT0', 'OUT1', 'OUT2', 'RD', 'WR']
      },
      'clock8284': {
        left: ['F/C', 'EFI', 'AEN1'],
        right: ['CLK', 'PCLK', 'OSC']
      }
    };
    
    const layout = pinLayouts[comp.id];
    if (!layout) return { x: comp.x! + width / 2, y: comp.y! + 35 };
    
    // Determine if pin is on left or right side
    const leftIndex = layout.left.indexOf(pinName);
    const rightIndex = layout.right.indexOf(pinName);
    
    let x: number;
    let pinIndex: number;
    
    if (leftIndex !== -1) {
      // Pin is on the left side
      x = comp.x! + 5;
      pinIndex = leftIndex;
    } else if (rightIndex !== -1) {
      // Pin is on the right side
      x = comp.x! + width - 5;
      pinIndex = rightIndex;
    } else {
      // Fallback if pin not found
      x = comp.x! + width / 2;
      pinIndex = 0;
    }
    
    // Calculate Y position: pins start at 35 and have 12px spacing
    const y = comp.y! + 35 + (pinIndex * 12);
    
    return { x, y };
  };

  const handleComponentDropped = (componentId: string, x: number, y: number) => {
    const component = componentLibrary[componentId];
    if (!component) return;

    saveHistory();
    const newComponent = { 
      ...component, 
      instanceId: Math.random().toString(36).substr(2, 9),
      x, 
      y 
    };
    
    setPlacedComponents(prev => [...prev, newComponent]);

    const stepMapping: Record<string, Record<string, number>> = {
      'F1': { 'cpu8086': 0, 'ram6264': 1, 'rom2764': 2, 'decoder138': 3 },
      'F2': { 'ppi8255': 1, 'decoder138': 2 },
      'F3': { 'timer8254': 2 },
      'F4': { 'pic8259': 1 },
      'R1': { 'ram6264': 2 },
      'R2': { 'serial8251': 2 },
      'R3': { 'ppi8255': 1 },
      'R4': { 'timer8254': 1 },
      'U1': { 'cpu8086': 0, 'ram6264': 1, 'rom2764': 2, 'decoder138': 3, 'ppi8255': 4, 'timer8254': 5, 'serial8251': 6, 'pic8259': 7, 'clock8284': 8 }
    };

    const targetStep = stepMapping[exp.id]?.[componentId];
    if (targetStep !== undefined && !completedSteps.includes(targetStep)) {
      setCompletedSteps(prev => [...prev, targetStep].sort());
    }
  };

  const handleComponentMoved = (instanceId: string, x: number, y: number) => {
    saveHistory();
    setPlacedComponents(prev => prev.map(c => 
      c.instanceId === instanceId ? { ...c, x, y } : c
    ));
  };

  const handleComponentRemoved = (instanceId: string) => {
    saveHistory();
    setPlacedComponents(prev => prev.filter(c => c.instanceId !== instanceId));
  };

  const wireColors = [
    { name: 'Blue', value: '#2563eb' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Black', value: '#0f172a' }
  ];

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="pt-16 min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between shadow-sm z-20">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-slate-100 dark:border-slate-600">
              <ArrowLeft size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded-full">EXP {exp.id}</span>
              <h3 className="text-slate-900 dark:text-white font-bold text-sm mt-0.5">{exp.title}</h3>
            </div>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={handleSaveProgress}
              className={`px-4 py-2 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors flex items-center gap-2 ${
                isSaving ? 'animate-pulse' : ''
              }`}
            >
              {isSaving ? <Save size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Saving...' : 'Save Progress'}
            </button>
            {saveSuccess && (
              <div className="px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl text-sm font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="fill-current" />
                Saved!
              </div>
            )}
            <button 
              onClick={() => setIsCodeEditorOpen(true)}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl text-sm font-bold hover:from-emerald-600 hover:to-teal-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30"
            >
              <Code2 size={16} /> Write Code
            </button>
            <button 
              onClick={handleValidate}
              className="px-6 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-lg bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200 dark:shadow-blue-900/30"
            >
              <Zap size={16} className="fill-current" /> AI Validate
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Workspace Area */}
          <div className="flex-1 p-8 overflow-auto relative bg-slate-50 dark:bg-slate-900">
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#0f172a_1px,transparent_1px)] dark:bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:32px_32px]" />
            
            <div className="max-w-5xl mx-auto space-y-8 relative">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 shadow-xl shadow-slate-200/40 dark:shadow-slate-900/40">
                <div className="flex items-center justify-between mb-8">
                  <h4 className="text-slate-900 dark:text-white font-extrabold flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center">
                      <Layout size={20} />
                    </div>
                    Virtual Lab Bench
                  </h4>
                  <div className="flex items-center gap-2">
                    {/* Wire Color Selection */}
                    {isWiringMode && (
                      <div className="flex items-center bg-white border border-slate-200 p-1 rounded-2xl mr-2 shadow-sm animate-in fade-in zoom-in duration-300">
                        <div className="px-2 border-r border-slate-100 flex items-center gap-2">
                          <Palette size={14} className="text-slate-400" />
                        </div>
                        <div className="flex items-center gap-1.5 px-2">
                          {wireColors.map((color) => (
                            <button
                              key={color.value}
                              onClick={() => setWireColor(color.value)}
                              title={color.name}
                              className={`w-6 h-6 rounded-full border-2 transition-all ${
                                wireColor === color.value 
                                  ? 'scale-110 shadow-md ring-2 ring-blue-100' 
                                  : 'hover:scale-105 opacity-60'
                              }`}
                              style={{ backgroundColor: color.value, borderColor: wireColor === color.value ? '#fff' : 'transparent' }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Workspace Controls */}
                    <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200 mr-2">
                      <button 
                        onClick={handleUndo}
                        disabled={history.length === 0}
                        title="Undo (Ctrl+Z)"
                        className={`p-2 rounded-xl transition-all ${history.length === 0 ? 'text-slate-300' : 'text-slate-600 hover:bg-white hover:text-blue-600 hover:shadow-sm'}`}
                      >
                        <Undo2 size={18} />
                      </button>
                      <div className="w-px h-4 bg-slate-200 mx-1" />
                      <button 
                        onClick={handleClearBoard}
                        title="Clear Board"
                        className="p-2 rounded-xl text-slate-600 hover:bg-white hover:text-red-600 hover:shadow-sm transition-all"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <div className="w-px h-4 bg-slate-200 mx-1" />
                      <button 
                        onClick={() => {
                          setIsDeleteMode(!isDeleteMode);
                          if (isWiringMode) setIsWiringMode(false);
                          if (isPanMode) setIsPanMode(false);
                        }}
                        title="Delete Tool (Cuts components and wires)"
                        className={`p-2 rounded-xl transition-all ${isDeleteMode ? 'bg-red-500 text-white shadow-lg shadow-red-200 scale-105' : 'text-slate-600 hover:bg-white hover:text-red-600 hover:shadow-sm'}`}
                      >
                        <Scissors size={18} />
                      </button>
                      <div className="w-px h-4 bg-slate-200 mx-1" />
                      <button 
                        onClick={() => {
                          setIsPanMode(!isPanMode);
                          if (isWiringMode) setIsWiringMode(false);
                          if (isDeleteMode) setIsDeleteMode(false);
                        }}
                        title="Pan Mode (Move workbench)"
                        className={`p-2 rounded-xl transition-all ${isPanMode ? 'bg-purple-500 text-white shadow-lg shadow-purple-200 scale-105' : 'text-slate-600 hover:bg-white hover:text-purple-600 hover:shadow-sm'}`}
                      >
                        <Move size={18} />
                      </button>
                    </div>

                    <button 
                      onClick={() => {
                        setIsWiringMode(!isWiringMode);
                        if (isDeleteMode) setIsDeleteMode(false);
                        if (isPanMode) setIsPanMode(false);
                      }}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                        isWiringMode 
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isWiringMode ? <Zap size={16} fill="white" /> : <MousePointer2 size={16} />}
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {isWiringMode ? 'Wiring Active' : 'Placement Mode'}
                      </span>
                    </button>
                    {activeWire && (
                      <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest animate-pulse border border-blue-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: activeWire.color }} />
                        Connecting: {activeWire.pin}
                        <span className="ml-2 text-[8px] opacity-60">(ESC to cancel)</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative">
                    <LabWorkbench 
                      onComponentDropped={handleComponentDropped} 
                      placedComponents={placedComponents}
                      onComponentRemoved={handleComponentRemoved}
                      onComponentMoved={handleComponentMoved}
                      onPinClick={handlePinClick}
                      wires={wires}
                      getPinPos={getPinPos}
                      isWiringMode={isWiringMode}
                      isDeleteMode={isDeleteMode}
                      activeWire={activeWire}
                      mousePos={mousePos}
                      handleMouseMove={handleMouseMove}
                      workbenchRef={workbenchRef}
                      onWireClick={handleWireDelete}
                      zoom={zoom}
                      isPanMode={isPanMode}
                      panOffset={panOffset}
                      onPanMouseDown={handlePanMouseDown}
                      onPanMouseMove={handlePanMouseMove}
                      onPanMouseUp={handlePanMouseUp}
                    />
                    
                    {/* Validation Overlay - Only covers the workbench */}
                    <AnimatePresence>
                      {isValidated && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }} 
                          animate={{ opacity: 1, scale: 1 }} 
                          className="absolute inset-0 z-50 pointer-events-none rounded-3xl overflow-hidden"
                        >
                          <div className="w-full h-full bg-blue-600/10 rounded-3xl border-2 border-blue-300 flex items-center justify-center pointer-events-auto">
                            <div className="bg-white border border-emerald-100 text-emerald-600 px-12 py-6 rounded-3xl font-extrabold shadow-2xl shadow-emerald-100/50 flex items-center gap-6">
                              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center">
                                <CheckCircle2 size={32} />
                              </div>
                              <div>
                                <div className="text-xl">Architecture Validated</div>
                                <div className="text-sm font-medium text-slate-500">Experiment logic matches 100% with {exp.id.startsWith('F') ? '8086' : '8051'} design specs.</div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                </div>
                
              </div>

              {/* AI Analysis Output */}
              {validationResult && (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white border border-blue-100 p-8 rounded-[2.5rem] shadow-xl space-y-6"
  >

    <h2 className={`text-xl font-bold ${
      validationResult.status === "success" 
        ? "text-green-600" 
        : "text-yellow-500"
    }`}>
      {validationResult.message}
    </h2>

    <p className="font-semibold">
      Score: {validationResult.score} / 100
    </p>

    <div className="w-full bg-slate-200 rounded-full h-3">
      <div 
        className={`h-3 rounded-full ${
          validationResult.score >= 70 ? "bg-green-500" : "bg-yellow-500"
        }`}
        style={{ width: `${validationResult.score}%` }}
      />
    </div>

    {validationResult.issues?.length > 0 && (
      <div>
        <p className="font-semibold">⚠ Issues:</p>
        <ul className="list-disc ml-5 text-sm">
          {validationResult.issues.map((issue: string, i: number) => (
            <li key={i}>{issue}</li>
          ))}
        </ul>
      </div>
    )}

    {validationResult.explanation?.length > 0 && (
      <div>
        <p className="font-semibold">🧠 Explanation:</p>
        <ul className="list-disc ml-5 text-sm text-slate-600">
          {validationResult.explanation.map((exp: string, i: number) => (
            <li key={i}>{exp}</li>
          ))}
        </ul>
      </div>
    )}

  </motion.div>
)}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-[28rem] bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 flex flex-col shadow-2xl relative z-20">
            <div className="p-8 flex-1 overflow-auto space-y-12">
              
              {/* Component Library */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Component Library</h4>
                <div className="grid grid-cols-2 gap-4">
                  {exp.availableComponents.map((comp) => (
                    <DraggableLabItem 
                      key={comp.id}
                      id={comp.id}
                      name={comp.name}
                      type={comp.type}
                      image={comp.image}
                      isWiringMode={isWiringMode}
                    />
                  ))}
                </div>
              </div>

              {/* Checklist */}
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Experiment Checklist</h4>
                <div className="space-y-3">
                  {exp.setup.map((step, i) => (
                    <div
                      key={i}
                      className={`w-full text-left p-5 rounded-2xl border transition-all flex items-start gap-4 ${
                        completedSteps.includes(i) 
                          ? 'bg-blue-50 border-blue-200 shadow-sm' 
                          : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className={`mt-0.5 w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                        completedSteps.includes(i) ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100' : 'border-slate-200 bg-slate-50'
                      }`}>
                        {completedSteps.includes(i) ? <CheckCircle2 size={14} /> : <span className="text-[10px] font-bold">{i+1}</span>}
                      </div>
                      <span className={`text-sm font-bold ${completedSteps.includes(i) ? 'text-blue-700' : 'text-slate-500'}`}>
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Viva */}
              {isValidated && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Architectural Viva</h4>
                    <div className="space-y-6">
                      {exp.viva.map((q, i) => (
                        <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700">
                          <p className="text-slate-900 dark:text-white text-sm font-bold mb-4">{q}</p>
                          <textarea 
                            placeholder="Provide your technical explanation..." 
                            className="w-full bg-white border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-xs text-slate-600 dark:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-inner"
                            rows={4}
                          />
                        </div>
                      ))}
                    </div>
                 </motion.div>
              )}
            </div>
            
            <div className="p-8 border-t border-slate-100 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 backdrop-blur-md">
              <button className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-slate-200 group">
                <BookOpen size={20} className="group-hover:scale-110 transition-transform" /> 
                Generate Certified Lab Report
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Code Editor Modal */}
      <CodeEditorModal 
        isOpen={isCodeEditorOpen}
        onClose={() => setIsCodeEditorOpen(false)}
        experimentId={exp.id}
        experimentTitle={exp.title}
      />
    </DndProvider>
  );
}
