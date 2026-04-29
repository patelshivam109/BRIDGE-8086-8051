import React from 'react';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'motion/react';
import { Cpu, Layers, Zap, CircuitBoard, Code, FlaskConical } from 'lucide-react';

const cards = [
  {
    title: 'Forward Experiments',
    subtitle: '8086 → Complete System',
    description: 'Start with 8086 CPU and add external RAM, ROM, timers, and I/O ports to build a complete microprocessor system.',
    icon: Cpu,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    title: 'Reverse Experiments',
    subtitle: '8051 → Module Analysis',
    description: 'Deconstruct the 8051 microcontroller to understand how internal modules provide integration benefits.',
    icon: Layers,
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
  },
  {
    title: 'Circuit Design',
    subtitle: 'Drag & Drop Interface',
    description: 'Design circuits with precision using SVG schematics, manual wiring, and professional laboratory tools.',
    icon: CircuitBoard,
    gradient: 'from-emerald-500 to-teal-500',
    bgColor: 'bg-emerald-500/10',
  },
  {
    title: 'AI Validation',
    subtitle: 'Real-time Feedback',
    description: 'Get instant AI-powered validation of your circuit designs and assembly code implementations.',
    icon: Zap,
    gradient: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
  },
  {
    title: 'Assembly Coding',
    subtitle: 'Live Simulation',
    description: 'Write and execute assembly code with step-by-step debugging and register visualization.',
    icon: Code,
    gradient: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-500/10',
  },
  {
    title: 'Lab Reports',
    subtitle: 'Auto-Generated',
    description: 'Comprehensive reports with viva questions, performance analysis, and academic documentation.',
    icon: FlaskConical,
    gradient: 'from-rose-500 to-pink-500',
    bgColor: 'bg-rose-500/10',
  },
];

function InteractiveCard({ card, index, mouseX, mouseY }: any) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [bounds, setBounds] = React.useState({ x: 0, y: 0, width: 0, height: 0 });

  React.useEffect(() => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setBounds({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  const centerX = bounds.x;
  const centerY = bounds.y;

  const rotateX = useTransform(mouseY, [centerY - bounds.height / 2, centerY + bounds.height / 2], [8, -8]);
  const rotateY = useTransform(mouseX, [centerX - bounds.width / 2, centerX + bounds.width / 2], [-8, 8]);

  const springConfig = { damping: 20, stiffness: 150 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100, y: 50 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        transformStyle: "preserve-3d",
        perspective: 1000,
      }}
      className="group"
    >
      <motion.div
        className="relative bg-white rounded-3xl p-8 shadow-xl border border-slate-100 overflow-hidden h-full"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.3)",
          zIndex: 10,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Gradient mesh background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
        
        {/* Animated border gradient */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />

        {/* Glowing orb effect */}
        <motion.div
          className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-20 blur-3xl transition-all duration-500`}
        />

        <div className="relative z-10" style={{ transform: "translateZ(75px)" }}>
          {/* Icon */}
          <motion.div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center mb-6 shadow-lg relative overflow-hidden`}
            whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Icon shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6 }}
            />
            <card.icon className="w-8 h-8 text-white relative z-10" strokeWidth={2.5} />
          </motion.div>

          {/* Title & Badge */}
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-slate-900 group-hover:to-slate-600 transition-all duration-300">
              {card.title}
            </h3>
            <motion.div
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${card.gradient} text-white shadow-md`}
              whileHover={{ scale: 1.05 }}
            >
              {card.subtitle}
            </motion.div>
          </div>

          {/* Description */}
          <p className="text-slate-600 leading-relaxed text-sm font-medium">
            {card.description}
          </p>

          {/* Hover indicator */}
          <motion.div
            className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.2, rotate: 90 }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-slate-600">
              <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        </div>

        {/* Corner decoration */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-slate-200 rounded-tl-3xl" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-slate-200 rounded-br-3xl" />
      </motion.div>
    </motion.div>
  );
}

export function CardDeck() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <section 
      id="experiments"
      ref={containerRef}
      className="py-32 bg-gradient-to-b from-white via-slate-50 to-white relative overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Radial gradient backgrounds */}
      <motion.div
        className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-blue-200 text-blue-600 text-sm font-bold mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              🎯
            </motion.span>
            Explore Learning Tracks
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Your Experimental{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Journey
            </span>
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto font-medium text-lg">
            Six comprehensive learning modules designed to master microarchitecture through hands-on experimentation
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <InteractiveCard
              key={index}
              card={card}
              index={index}
              mouseX={mouseX}
              mouseY={mouseY}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-sm text-slate-500 font-medium"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Hover over cards to explore in 3D
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}