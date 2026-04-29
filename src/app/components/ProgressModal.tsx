import React from 'react';
import { X, TrendingUp, Clock, CheckCircle2, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressModal({ isOpen, onClose }: ProgressModalProps) {
  const { userData } = useUser();
  const progress = userData.experimentsProgress;

  const totalExperiments = 9; // F1-F4, R1-R4, U1
  const completedExperiments = Object.values(progress).filter(p => p.isValidated).length;
  const totalTimeSpent = Object.values(progress).reduce((sum, p) => sum + (p.timeSpent || 0), 0);
  const totalAttempts = Object.values(progress).reduce((sum, p) => sum + (p.attemptCount || 0), 0);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const experimentNames: Record<string, string> = {
    F1: 'External Memory Interfacing',
    F2: 'I/O Expansion via 8255 PPI',
    F3: 'Timing & Delay with 8254 PIT',
    F4: 'Vector Interrupts with 8259 PIC',
    R1: 'External RAM Interfacing (Reverse)',
    R2: 'Serial UART Decomposition',
    R3: 'Port Expansion vs Native I/O',
    R4: 'Timer Modularization',
    U1: 'μP to μC Ultimate Converter Lab',
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-700 dark:to-cyan-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">My Progress</h2>
                    <p className="text-white/80 text-sm">Track your learning journey</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Stats Cards */}
              <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center">
                      <CheckCircle2 size={20} className="text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{completedExperiments}</div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">Experiments Completed</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">out of {totalExperiments}</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-500 dark:bg-purple-600 rounded-xl flex items-center justify-center">
                      <Clock size={20} className="text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatTime(totalTimeSpent)}</div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">Total Time Spent</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">in the lab</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-amber-500 dark:bg-amber-600 rounded-xl flex items-center justify-center">
                      <Activity size={20} className="text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">{totalAttempts}</div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">Total Attempts</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">across all experiments</div>
                </div>

                <div className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-500 dark:bg-emerald-600 rounded-xl flex items-center justify-center">
                      <TrendingUp size={20} className="text-white" />
                    </div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-white">
                      {Math.round((completedExperiments / totalExperiments) * 100)}%
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">Overall Progress</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">completion rate</div>
                </div>
              </div>

              {/* Experiments List */}
              <div className="px-8 pb-8 overflow-y-auto max-h-[calc(90vh-380px)]">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Experiment Details</h3>
                <div className="space-y-3">
                  {Object.entries(experimentNames).map(([expId, expTitle]) => {
                    const exp = progress[expId];
                    const isCompleted = exp?.isValidated || false;
                    const stepsCompleted = exp?.completedSteps?.length || 0;
                    const totalSteps = exp?.totalSteps || (expId === 'U1' ? 9 : 4);
                    const timeSpent = exp?.timeSpent || 0;
                    const lastModified = exp?.lastModified;

                    return (
                      <motion.div
                        key={expId}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-5 rounded-2xl border-2 transition-all ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800'
                            : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            {/* Experiment Badge */}
                            <div
                              className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold ${
                                isCompleted
                                  ? 'bg-emerald-500 text-white'
                                  : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-300'
                              }`}
                            >
                              {expId}
                            </div>

                            {/* Info */}
                            <div className="flex-1">
                              <h4 className="font-bold text-slate-900 dark:text-white mb-1">{expTitle}</h4>
                              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                                <span>Steps: {stepsCompleted}/{totalSteps}</span>
                                {timeSpent > 0 && <span>Time: {formatTime(timeSpent)}</span>}
                                {lastModified && (
                                  <span>Last: {new Date(lastModified).toLocaleDateString()}</span>
                                )}
                              </div>
                            </div>

                            {/* Status */}
                            {isCompleted && (
                              <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold text-sm">
                                <CheckCircle2 size={16} />
                                Validated
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        {!isCompleted && stepsCompleted > 0 && (
                          <div className="mt-4">
                            <div className="bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                                style={{ width: `${(stepsCompleted / totalSteps) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}