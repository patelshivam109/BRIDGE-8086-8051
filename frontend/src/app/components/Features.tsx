import React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Zap, 
  Terminal, 
  Layers, 
  BarChart3, 
  CircuitBoard, 
  MonitorSmartphone 
} from 'lucide-react';

const features = [
  {
    title: 'Instruction Conversion',
    description: 'Smart mapping of 8086 segmented memory architecture to 8051 fixed memory space.',
    icon: Terminal,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    gradientFrom: '#3b82f6',
    gradientTo: '#60a5fa'
  },
  {
    title: 'Real-time Simulation',
    description: 'Execute assembly code step-by-step with live register and flag updates.',
    icon: Zap,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    gradientFrom: '#f59e0b',
    gradientTo: '#fbbf24'
  },
  {
    title: 'Register Mapping',
    description: 'Visual bridge showing how AX/BX/CX/DX registers translate to R0-R7 banks.',
    icon: Layers,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    gradientFrom: '#6366f1',
    gradientTo: '#818cf8'
  },
  {
    title: 'Performance Analysis',
    description: 'Compare T-states and clock cycles between microprocessor and microcontroller execution.',
    icon: BarChart3,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    gradientFrom: '#10b981',
    gradientTo: '#34d399'
  },
  {
    title: 'I/O Interfacing',
    description: 'Simulate peripherals like LCDs, Keypads, and LEDs across both platforms.',
    icon: CircuitBoard,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    gradientFrom: '#8b5cf6',
    gradientTo: '#a78bfa'
  },
  {
    title: 'Cross-Platform',
    description: 'Fully responsive web-based lab. No installation required for institutional use.',
    icon: MonitorSmartphone,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    gradientFrom: '#f43f5e',
    gradientTo: '#fb7185'
  }
];

function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const [isHovered, setIsHovered] = React.useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative p-8 rounded-3xl border border-slate-100 bg-white group cursor-pointer"
      whileHover={{
        y: -8,
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.2)",
      }}
    >
      {/* Animated gradient background on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${feature.gradientFrom}15, ${feature.gradientTo}15)`,
        }}
      />

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative" style={{ transform: "translateZ(50px)" }}>
        <motion.div 
          className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 relative overflow-hidden`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {/* Icon glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
            style={{
              background: `linear-gradient(135deg, ${feature.gradientFrom}, ${feature.gradientTo})`,
            }}
          />
          <feature.icon className={`w-7 h-7 ${feature.color} relative z-10`} />
        </motion.div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm font-medium">
          {feature.description}
        </p>
      </div>

      {/* Floating particles */}
      {isHovered && (
        <>
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-blue-400 opacity-60"
            initial={{ x: 20, y: 20 }}
            animate={{
              x: [20, 60, 40],
              y: [20, 80, 40],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-indigo-400 opacity-60"
            initial={{ x: 80, y: 60 }}
            animate={{
              x: [80, 40, 70],
              y: [60, 20, 50],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          />
        </>
      )}
    </motion.div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Floating orbs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-block px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-bold mb-4 border border-blue-100"
            whileHover={{ scale: 1.05 }}
          >
            ✨ Powerful Features
          </motion.div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            High-Precision Laboratory Tools
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium">
            A comprehensive suite of analytical instruments designed for computer architecture researchers.
          </p>
        </motion.div>

        {/* Bento Box Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}