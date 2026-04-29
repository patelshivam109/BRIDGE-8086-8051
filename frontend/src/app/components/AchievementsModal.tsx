import React from 'react';
import { X, Trophy, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AchievementsModal({ isOpen, onClose }: AchievementsModalProps) {
  const { userData } = useUser();
  const achievements = userData.achievements;

  const unlockedCount = achievements.filter(a => a.unlockedAt).length;
  const totalCount = achievements.length;

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
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-amber-600 to-yellow-500 dark:from-amber-700 dark:to-yellow-600 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Trophy size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">Achievements</h2>
                    <p className="text-white/80 text-sm">
                      {unlockedCount} of {totalCount} unlocked
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="px-8 pt-6">
                <div className="bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-amber-500 to-yellow-400"
                  />
                </div>
                <div className="text-center mt-2 text-sm font-bold text-slate-600 dark:text-slate-300">
                  {Math.round((unlockedCount / totalCount) * 100)}% Complete
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-220px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => {
                    const isUnlocked = !!achievement.unlockedAt;
                    const progress = achievement.progress || 0;
                    const maxProgress = achievement.maxProgress || 1;
                    const progressPercent = (progress / maxProgress) * 100;

                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-6 rounded-2xl border-2 transition-all ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800 shadow-lg shadow-amber-100 dark:shadow-amber-900/20'
                            : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div
                            className={`w-16 h-16 rounded-xl flex items-center justify-center text-3xl shrink-0 ${
                              isUnlocked
                                ? 'bg-gradient-to-br from-amber-400 to-yellow-400 shadow-lg'
                                : 'bg-slate-200 dark:bg-slate-600'
                            }`}
                          >
                            {isUnlocked ? achievement.icon : <Lock size={24} className="text-slate-400 dark:text-slate-300" />}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className={`font-bold text-base mb-1 ${isUnlocked ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                              {achievement.title}
                            </h3>
                            <p className={`text-sm mb-3 ${isUnlocked ? 'text-slate-600 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500'}`}>
                              {achievement.description}
                            </p>

                            {/* Progress Bar */}
                            {!isUnlocked && maxProgress > 1 && (
                              <div className="space-y-1">
                                <div className="bg-slate-200 dark:bg-slate-600 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                                <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                                  {progress} / {maxProgress}
                                </div>
                              </div>
                            )}

                            {/* Unlocked Date */}
                            {isUnlocked && achievement.unlockedAt && (
                              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-2">
                                Unlocked: {new Date(achievement.unlockedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
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