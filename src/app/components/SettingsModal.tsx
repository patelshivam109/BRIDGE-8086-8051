import React from 'react';
import { X, Settings as SettingsIcon, Bell, Save, Zap, Grid3x3, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { userData, updateSettings } = useUser();
  const settings = userData.settings;

  const toggleSetting = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
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
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <SettingsIcon size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-bold text-xl">Settings</h2>
                    <p className="text-white/60 text-sm">Customize your lab experience</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-180px)]">
                {/* Auto Save */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Save size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Auto Save</h3>
                      <p className="text-sm text-slate-500">Automatically save your progress</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('autoSave')}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.autoSave ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.autoSave ? 24 : 2 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>

                {/* Wiring Style */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Zap size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Wiring Style</h3>
                      <p className="text-sm text-slate-500">Choose wire connection style</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateSettings({ wiringStyle: 'curved' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        settings.wiringStyle === 'curved'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-sm">Curved</div>
                      <div className="text-xs text-slate-500">Smooth Bezier curves</div>
                    </button>
                    <button
                      onClick={() => updateSettings({ wiringStyle: 'straight' })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        settings.wiringStyle === 'straight'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-sm">Straight</div>
                      <div className="text-xs text-slate-500">Direct lines</div>
                    </button>
                  </div>
                </div>

                {/* Grid Snap */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <Grid3x3 size={24} className="text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Grid Snap</h3>
                      <p className="text-sm text-slate-500">Snap components to grid</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('gridSnap')}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.gridSnap ? 'bg-emerald-600' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.gridSnap ? 24 : 2 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                      <Volume2 size={24} className="text-amber-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Sound Effects</h3>
                      <p className="text-sm text-slate-500">Enable interaction sounds</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('soundEffects')}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.soundEffects ? 'bg-amber-600' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.soundEffects ? 24 : 2 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>

                {/* Notifications */}
                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                      <Bell size={24} className="text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">Notifications</h3>
                      <p className="text-sm text-slate-500">Achievement notifications</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleSetting('notifications')}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      settings.notifications ? 'bg-red-600' : 'bg-slate-300'
                    }`}
                  >
                    <motion.div
                      animate={{ x: settings.notifications ? 24 : 2 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-md"
                    />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
