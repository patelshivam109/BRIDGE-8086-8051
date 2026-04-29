import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  History,
  ArrowUpRight,
  Target,
  FlaskConical,
  Zap
} from 'lucide-react';
import { motion } from 'motion/react';
import { ProfileDropdown } from './ProfileDropdown';
import { useUser } from '../contexts/UserContext';

export function DashboardOverview({ onSelectTrack, onNavigate, onSelectExperiment }: { onSelectTrack: (track: string) => void, onNavigate: (page: string) => void, onSelectExperiment?: (id: string) => void }) {
  const { userData } = useUser();

  const handleStatClick = (title: string) => {
    if (title === 'Experiments Completed') {
      onNavigate('experiments');
    } else if (title === 'Lab Hours Logged') {
      onNavigate('profile');
    } else if (title === 'Average Accuracy') {
      onNavigate('profile');
    } else if (title === 'Pending Reports') {
      onNavigate('reports');
    }
  };

  const stats = [
    { label: 'Experiments Completed', value: '8/16', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Lab Hours Logged', value: '42.5h', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Average Accuracy', value: '94%', icon: Target, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Pending Reports', value: '3', icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
  ];

  const recentExperiments = [
    { name: 'External Memory Interfacing', date: 'Yesterday, 4:30 PM', score: '98/100', type: 'Forward', id: 'F1' },
    { name: 'Internal RAM Extraction', date: 'Feb 18, 2026', score: '92/100', type: 'Reverse', id: 'R1' },
    { name: 'Timer Integration', date: 'Feb 15, 2026', score: '89/100', type: 'Forward', id: 'F3' },
  ];

  const statsCards = [
    {
      title: 'Experiments Completed',
      value: '8/16',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/30',
      textColor: 'text-emerald-500 dark:text-emerald-400',
      labelColor: 'text-emerald-700 dark:text-emerald-300',
      subColor: 'text-emerald-500 dark:text-emerald-400',
      bgGradient: 'bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20',
      borderColor: 'border-emerald-100 dark:border-emerald-800'
    },
    {
      title: 'Lab Hours Logged',
      value: '42.5h',
      icon: Clock,
      iconColor: 'text-blue-500 dark:text-blue-400',
      iconBg: 'bg-blue-50 dark:bg-blue-900/30',
      textColor: 'text-blue-500 dark:text-blue-400',
      labelColor: 'text-blue-700 dark:text-blue-300',
      subColor: 'text-blue-500 dark:text-blue-400',
      bgGradient: 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
      borderColor: 'border-blue-100 dark:border-blue-800'
    },
    {
      title: 'Average Accuracy',
      value: '94%',
      icon: Target,
      iconColor: 'text-indigo-500 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/30',
      textColor: 'text-indigo-500 dark:text-indigo-400',
      labelColor: 'text-indigo-700 dark:text-indigo-300',
      subColor: 'text-indigo-500 dark:text-indigo-400',
      bgGradient: 'bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20',
      borderColor: 'border-indigo-100 dark:border-indigo-800'
    },
    {
      title: 'Pending Reports',
      value: '3',
      icon: AlertCircle,
      iconColor: 'text-rose-500 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-900/30',
      textColor: 'text-rose-500 dark:text-rose-400',
      labelColor: 'text-rose-700 dark:text-rose-300',
      subColor: 'text-rose-500 dark:text-rose-400',
      bgGradient: 'bg-gradient-to-r from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20',
      borderColor: 'border-rose-100 dark:border-rose-800'
    }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
            Welcome back, {userData.name.split(' ')[0]}! 👋
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
            Continue your microarchitecture journey
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onNavigate('experiments')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-blue-200 dark:shadow-blue-900/30 hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
          >
            <FlaskConical size={20} />
            Start Experimenting
          </button>
        </div>
      </div>

      {/* Bento Box Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-6">
        {/* Large Stat - Experiments (spans 2x2) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="col-span-1 md:col-span-3 lg:col-span-4 md:row-span-2 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-800 shadow-sm hover:shadow-xl transition-all group cursor-pointer"
          onClick={() => handleStatClick(statsCards[0].title)}
        >
          <div className="flex flex-col justify-between h-full">
            <div className="bg-emerald-50 dark:bg-emerald-900/30 w-16 h-16 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="text-emerald-500 dark:text-emerald-400" size={32} />
            </div>
            <div>
              <div className="text-6xl font-black text-emerald-500 dark:text-emerald-400 mb-3">8/16</div>
              <h3 className="text-lg font-bold text-emerald-700 dark:text-emerald-300">Experiments Completed</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mt-1">50% Progress</p>
            </div>
          </div>
        </motion.div>

        {/* Medium Stat - Lab Hours */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-1 md:col-span-3 lg:col-span-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-[2.5rem] border border-blue-100 dark:border-blue-800 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
          onClick={() => handleStatClick(statsCards[1].title)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-50 dark:bg-blue-900/30 w-14 h-14 rounded-2xl flex items-center justify-center">
              <Clock className="text-blue-500 dark:text-blue-400" size={28} />
            </div>
            <span className="text-4xl font-black text-blue-500 dark:text-blue-400">42.5h</span>
          </div>
          <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300">Lab Hours Logged</h3>
        </motion.div>

        {/* Medium Stat - Accuracy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 md:col-span-3 lg:col-span-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20 p-6 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
          onClick={() => handleStatClick(statsCards[2].title)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/30 w-14 h-14 rounded-2xl flex items-center justify-center">
              <Target className="text-indigo-500 dark:text-indigo-400" size={28} />
            </div>
            <span className="text-4xl font-black text-indigo-500 dark:text-indigo-400">94%</span>
          </div>
          <h3 className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Average Accuracy</h3>
        </motion.div>

        {/* Small Stat - Pending Reports */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 md:col-span-3 lg:col-span-4 bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20 p-6 rounded-[2.5rem] border border-rose-100 dark:border-rose-800 shadow-sm hover:shadow-lg transition-all group cursor-pointer"
          onClick={() => handleStatClick(statsCards[3].title)}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="bg-rose-50 dark:bg-rose-900/30 w-14 h-14 rounded-2xl flex items-center justify-center">
              <AlertCircle className="text-rose-500 dark:text-rose-400" size={28} />
            </div>
            <span className="text-4xl font-black text-rose-500 dark:text-rose-400">3</span>
          </div>
          <h3 className="text-sm font-bold text-rose-700 dark:text-rose-300">Pending Reports</h3>
        </motion.div>

        {/* Continue Learning - Large Card (spans full width) */}
        <section className="col-span-1 md:col-span-6 lg:col-span-8 bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <Zap className="text-yellow-500" size={28} />
              Continue Learning
            </h3>
            <button 
              onClick={() => onNavigate('experiments')}
              className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-sm"
            >
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentExperiments.map((exp, i) => (
              <div key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-slate-700 group hover:border-blue-200 dark:hover:border-blue-700 transition-colors cursor-pointer" onClick={() => onSelectExperiment && onSelectExperiment(exp.id)}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm">
                    <FlaskConical size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{exp.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{exp.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-blue-600 dark:text-blue-400 mb-0.5">{exp.score}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                    exp.type === 'Forward' ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-blue-100 dark:border-blue-800' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/30 border-rose-100 dark:border-rose-800'
                  }`}>
                    {exp.type}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Tutor Tips - Sidebar */}
        <section className="col-span-1 md:col-span-6 lg:col-span-4 bg-gradient-to-br from-indigo-600 to-blue-700 dark:from-indigo-700 dark:to-blue-800 p-8 rounded-[3rem] text-white shadow-xl shadow-blue-200 dark:shadow-blue-900/30">
          <h4 className="text-xl font-black mb-4">AI Tutor Tips</h4>
          <div className="p-4 bg-white/10 rounded-[2rem] border border-white/10 backdrop-blur-sm mb-4">
            <p className="text-sm font-medium italic text-indigo-50">"Remember to always check the chip-select logic before wiring the RAM banks."</p>
          </div>
          <button onClick={() => onNavigate('documentation')} className="w-full py-3 bg-white dark:bg-white/90 text-blue-700 dark:text-blue-800 rounded-2xl font-bold text-sm hover:bg-blue-50 dark:hover:bg-white transition-colors">
            Read Lab Manual
          </button>
        </section>

        {/* Quick Access - Forward Track */}
        <button 
          onClick={() => onSelectTrack('forward')}
          className="col-span-1 md:col-span-3 lg:col-span-6 p-8 bg-blue-600 dark:bg-blue-700 rounded-[2.5rem] text-left group hover:scale-[1.02] transition-all shadow-xl shadow-blue-100 dark:shadow-blue-900/30"
        >
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
            <TrendingUp size={24} />
          </div>
          <h4 className="text-xl font-black text-white mb-2">Forward Track</h4>
          <p className="text-blue-100/70 text-sm font-medium mb-6">Build system complexity from discrete components.</p>
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            START LAB <ArrowUpRight size={16} />
          </div>
        </button>

        {/* Quick Access - Reverse Track */}
        <button 
          onClick={() => onSelectTrack('reverse')}
          className="col-span-1 md:col-span-3 lg:col-span-6 p-8 bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] text-left group hover:scale-[1.02] transition-all shadow-xl shadow-slate-200 dark:shadow-black/30"
        >
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 backdrop-blur-sm">
            <Users size={24} />
          </div>
          <h4 className="text-xl font-black text-white mb-2">Reverse Track</h4>
          <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mb-6">Analyze SoC benefits by decomposing internal modules.</p>
          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
            START LAB <ArrowUpRight size={16} />
          </div>
        </button>

        {/* Resources */}
        <section className="col-span-1 md:col-span-6 lg:col-span-12 bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-sm">
          <h4 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
            <BookOpen size={20} className="text-emerald-500 dark:text-emerald-400" />
            Resources
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {['IEEE Schematic Standards', '8086 Instruction Set', '8051 Memory Map', 'Bus Protocol Guide'].map((item, i) => (
              <button key={i} onClick={() => onNavigate('documentation')} className="text-left p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-600 transition-all flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">{item}</span>
                <ArrowUpRight size={14} className="text-slate-300 dark:text-slate-600 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}