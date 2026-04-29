import React from 'react';
import { motion } from 'motion/react';
import { Play, BookText, ArrowRight, Zap } from 'lucide-react';

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <div id="home" className="relative pt-20 pb-16 lg:pt-24 lg:pb-20 overflow-hidden bg-slate-50">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        >
          <source src="https://github.com/shubuexe/pt-assets/raw/main/6754833-hd_1280_720_25fps.mp4" type="video/mp4" />
        </video>
        {/* Lighter gradient overlay to keep video visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/30 to-slate-900/50" />
      </div>

      {/* Enhanced animated gradient background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[120px] rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold bg-white text-blue-600 border border-blue-100 mb-8 shadow-sm"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px -10px rgba(59, 130, 246, 0.3)" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Zap size={14} className="fill-current" />
              <span>AI-Powered Microarchitecture Experiment Lab</span>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8 leading-[1.1] drop-shadow-2xl">
              Deconstruct & Rebuild <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent">
                Architecture Experimentally
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 mb-12 leading-relaxed font-medium drop-shadow-lg">
              A high-precision virtual laboratory for microarchitecture analysis. Explore the 8086 and 8051 ecosystems through validated experimental tracks.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <motion.button 
              onClick={onStart}
              className="group relative w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 overflow-hidden"
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(59, 130, 246, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">Enter Experiment Lab</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
            </motion.button>
            <motion.button 
              className="w-full sm:w-auto px-10 py-5 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold flex items-center justify-center gap-3"
              whileHover={{ 
                scale: 1.02, 
                borderColor: "rgb(59, 130, 246)",
                boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)" 
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <BookText className="w-5 h-5" />
              Course Syllabus
            </motion.button>
          </motion.div>
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: 'Experiments', value: '40+' },
              { label: 'Architectures', value: '8086 | 8051' },
              { label: 'AI Validation', value: 'Real-time' },
              { label: 'Academic', value: 'IEEE Aligned' },
            ].map((stat, i) => (
              <motion.div 
                key={i} 
                className="relative text-center p-6 rounded-2xl border border-slate-100 bg-white shadow-sm group cursor-pointer overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)"
                }}
              >
                {/* Animated gradient border */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #3b82f6)",
                    backgroundSize: "200% 100%",
                  }}
                  animate={{
                    backgroundPosition: ["0% 0%", "200% 0%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                <div className="absolute inset-[1px] rounded-2xl bg-white" />
                <div className="relative z-10">
                  <div className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}