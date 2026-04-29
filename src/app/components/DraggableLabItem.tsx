import React from 'react';
import { useDrag } from 'react-dnd';
import { ImageWithFallback } from './shared/ImageWithFallback';
import { 
  Intel8086SVG, 
  Intel8051SVG, 
  MemorySVG, 
  LogicICSVG, 
  PeripheralSVG,
  ClockSVG
} from './CircuitSVGs';

interface DraggableLabItemProps {
  id: string;
  name: string;
  image: string;
  type: string;
  instanceId?: string; 
  onPinClick?: (instanceId: string, pinName: string) => void;
  isWiringMode?: boolean;
}

const getComponentSVG = (id: string, props: any = {}) => {
  switch (id) {
    case 'cpu8086': return <Intel8086SVG {...props} />;
    case 'mcu8051': return <Intel8051SVG {...props} />;
    case 'ram6264': return <MemorySVG label="6264 SRAM" {...props} />;
    case 'rom2764': return <MemorySVG label="2764 EPROM" {...props} />;
    case 'decoder138': return <LogicICSVG label="74LS138" {...props} />;
    case 'timer8254': return <PeripheralSVG label="8254 PIT" {...props} />;
    case 'serial8251': return <PeripheralSVG label="8251 USART" {...props} />;
    case 'ppi8255': return <PeripheralSVG label="8255 PPI" {...props} />;
    case 'pic8259': return <PeripheralSVG label="8259 PIC" {...props} />;
    case 'clock8284': return <ClockSVG {...props} />;
    default: return null;
  }
};

export function DraggableLabItem({ id, name, image, type, instanceId, onPinClick, isWiringMode }: DraggableLabItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'LAB_COMPONENT',
    canDrag: !isWiringMode,
    item: { id, name, type, instanceId },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, name, type, instanceId, isWiringMode]);

  const svgComponent = getComponentSVG(id, { 
    instanceId, 
    onPinClick, 
    dragRef: instanceId ? drag : null 
  });

  if (instanceId) {
    return (
      <div
        ref={drag}
        className={`w-full h-full relative transition-opacity ${isDragging ? 'opacity-30' : 'opacity-100'}`}
      >
        {svgComponent}
      </div>
    );
  }

  return (
    <div
      ref={drag}
      className={`p-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group ${
        isDragging ? 'opacity-40 scale-95' : 'opacity-100 scale-100'
      }`}
    >
      <div className="w-full aspect-square rounded-lg bg-slate-50 mb-2 overflow-hidden border border-slate-100 flex items-center justify-center p-2">
        {getComponentSVG(id) ? (
          <div className="w-full h-full group-hover:scale-110 transition-transform duration-500">
            {getComponentSVG(id)}
          </div>
        ) : (
          <ImageWithFallback 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
      </div>
      <div className="text-center">
        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">{type}</div>
        <div className="text-[10px] font-bold text-slate-900 line-clamp-1">{name}</div>
      </div>
    </div>
  );
}