import React from 'react';

const SchematicBase = ({ 
  width, height, label, subLabel, pinsLeft = [], pinsRight = [], pinsTop = [], pinsBottom = [],
  onPinClick, instanceId, dragRef 
}: any) => (
  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full font-mono pointer-events-none">
    {/* Body - used as the drag handle */}
    <rect 
      ref={dragRef}
      x="20" y="20" width={width - 40} height={height - 40} 
      fill="white" stroke="#334155" strokeWidth="1.5" 
      className="pointer-events-auto cursor-move" 
    />
    
    {/* Label */}
    <text x={width / 2} y={height / 2 - 5} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="bold" className="pointer-events-none">{label}</text>
    <text x={width / 2} y={height / 2 + 10} textAnchor="middle" fill="#64748b" fontSize="8" className="pointer-events-none">{subLabel}</text>
    
    {/* Pins Left */}
    {pinsLeft.map((pin: string, i: number) => {
      const y = 35 + i * 12;
      return (
        <g 
          key={`l-${i}`} 
          className="cursor-pointer group/pin pointer-events-auto"
          onClick={(e) => { e.stopPropagation(); onPinClick?.(instanceId, pin); }}
        >
          <line x1="5" y1={y} x2="20" y2={y} stroke="#334155" strokeWidth="1" className="group-hover/pin:stroke-blue-500" />
          <circle cx="5" cy={y} r="2" fill="white" stroke="#334155" strokeWidth="0.5" className="group-hover/pin:fill-blue-500" />
          <text x="23" y={y + 3} fill="#64748b" fontSize="6" className="group-hover/pin:fill-blue-500">{pin}</text>
        </g>
      );
    })}
    
    {/* Pins Right */}
    {pinsRight.map((pin: string, i: number) => {
      const y = 35 + i * 12;
      return (
        <g 
          key={`r-${i}`} 
          className="cursor-pointer group/pin pointer-events-auto"
          onClick={(e) => { e.stopPropagation(); onPinClick?.(instanceId, pin); }}
        >
          <line x1={width - 20} y1={y} x2={width - 5} y2={y} stroke="#334155" strokeWidth="1" className="group-hover/pin:stroke-blue-500" />
          <circle cx={width - 5} cy={y} r="2" fill="white" stroke="#334155" strokeWidth="0.5" className="group-hover/pin:fill-blue-500" />
          <text x={width - 23} y={y + 3} textAnchor="end" fill="#64748b" fontSize="6" className="group-hover/pin:fill-blue-500">{pin}</text>
        </g>
      );
    })}
  </svg>
);

export const Intel8086SVG = (props: any) => (
  <SchematicBase 
    {...props}
    width={120} height={160} 
    label="U1: 8086" subLabel="16-BIT CPU"
    pinsLeft={['AD0', 'AD1', 'AD2', 'AD3', 'AD4', 'AD5', 'AD6', 'AD7', 'NMI', 'INTR']}
    pinsRight={['AD15', 'AD14', 'AD13', 'AD12', 'A19/S6', 'A18/S5', 'A17/S4', 'A16/S3', 'RD', 'WR']}
    dragRef={props.dragRef}
  />
);

export const Intel8051SVG = (props: any) => (
  <SchematicBase 
    {...props}
    width={120} height={160} 
    label="U1: 8051" subLabel="8-BIT MCU"
    pinsLeft={['P1.0', 'P1.1', 'P1.2', 'P1.3', 'P1.4', 'P1.5', 'P1.6', 'P1.7', 'RST', 'RXD']}
    pinsRight={['P0.0', 'P0.1', 'P0.2', 'P0.3', 'P0.4', 'P0.5', 'P0.6', 'P0.7', 'EA', 'ALE']}
    dragRef={props.dragRef}
  />
);

export const MemorySVG = (props: any) => (
  <SchematicBase 
    {...props}
    width={100} height={120} 
    label={props.label || "MEMORY"} subLabel="MEMORY"
    pinsLeft={['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'CE']}
    pinsRight={['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'OE']}
    dragRef={props.dragRef}
  />
);

export const LogicICSVG = (props: any) => (
  <SchematicBase 
    {...props}
    width={80} height={100} 
    label={props.label || "LOGIC"} subLabel="LOGIC"
    pinsLeft={['A', 'B', 'C', 'G1']}
    pinsRight={['Y0', 'Y1', 'Y2', 'Y3', 'Y4']}
    dragRef={props.dragRef}
  />
);

export function PeripheralSVG({ label, instanceId, onPinClick, dragRef }: any) {
  return (
    <SchematicBase 
      width={100} height={100} 
      label={label} 
      subLabel="Peripheral"
      pinsLeft={['D0', 'D1', 'D2', 'CLK', 'GATE']}
      pinsRight={['OUT0', 'OUT1', 'OUT2', 'RD', 'WR']}
      instanceId={instanceId}
      onPinClick={onPinClick}
      dragRef={dragRef}
    />
  );
}

// Clock Generator Component
export function ClockSVG({ instanceId, onPinClick, dragRef }: any) {
  return (
    <SchematicBase 
      width={80} height={80} 
      label="8284" 
      subLabel="Clock Gen"
      pinsLeft={['F/C', 'EFI', 'AEN1']}
      pinsRight={['CLK', 'PCLK', 'OSC']}
      instanceId={instanceId}
      onPinClick={onPinClick}
      dragRef={dragRef}
    />
  );
}

export const WiresSVG = () => (
  <svg viewBox="0 0 100 100" className="w-full h-full opacity-60">
    <path d="M10 20 L90 20 M10 40 L90 40 M10 60 L90 60 M10 80 L90 80" stroke="#94a3b8" strokeWidth="1" strokeDasharray="4 2" />
    <text x="50" y="55" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">SYSTEM BUS</text>
  </svg>
);