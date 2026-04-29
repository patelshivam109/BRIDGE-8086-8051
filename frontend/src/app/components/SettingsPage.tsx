import React from 'react';
import { useUser } from '../contexts/UserContext';
import { playSound } from '../utils/sounds';
import { 
  Settings, 
  Bell, 
  Palette, 
  Grid3x3, 
  Volume2, 
  Save,
  Waves,
  Moon,
  Sun,
  Zap,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { motion } from 'motion/react';

export function SettingsPage() {
  const { userData, updateSettings, resetAllData } = useUser();
  const { settings } = userData;
  const [showResetConfirm, setShowResetConfirm] = React.useState(false);
  const [saveNotification, setSaveNotification] = React.useState('');

  const showSaveToast = (message: string) => {
    setSaveNotification(message);
    setTimeout(() => setSaveNotification(''), 2000);
  };

  const handleToggle = (key: keyof typeof settings) => {
    playSound('click', settings.soundEffects);
    updateSettings({ [key]: !settings[key] });
    showSaveToast(`${key === 'soundEffects' ? 'Sound Effects' : key === 'gridSnap' ? 'Grid Snap' : key === 'autoSave' ? 'Auto Save' : 'Notifications'} ${!settings[key] ? 'enabled' : 'disabled'}`);
  };

  const handleWiringStyleChange = (style: 'curved' | 'straight') => {
    playSound('click', settings.soundEffects);
    updateSettings({ wiringStyle: style });
    showSaveToast(`Wiring style changed to ${style}`);
  };

  const handleThemeChange = (theme: 'light' | 'dark') => {
    playSound('click', settings.soundEffects);
    updateSettings({ theme });
    showSaveToast(`Theme changed to ${theme} mode`);
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-600 dark:from-slate-700 dark:to-slate-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
          <Settings size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Customize your lab experience</p>
        </div>
      </div>

      {/* Appearance Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Palette size={22} className="text-blue-600 dark:text-blue-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Appearance</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Theme</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Choose light or dark mode</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  settings.theme === 'light'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Sun size={16} />
                Light
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  settings.theme === 'dark'
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Moon size={16} />
                Dark
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Workspace Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Grid3x3 size={22} className="text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Workspace</h2>
        </div>

        <div className="space-y-6">
          {/* Wiring Style */}
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Wiring Style</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Choose how circuit wires are drawn</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleWiringStyleChange('curved')}
                className={`px-4 py-2 rounded-xl font-bold transition-all flex items-center gap-2 ${
                  settings.wiringStyle === 'curved'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <Waves size={16} />
                Curved
              </button>
              <button
                onClick={() => handleWiringStyleChange('straight')}
                className={`px-4 py-2 rounded-xl font-bold transition-all ${
                  settings.wiringStyle === 'straight'
                    ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Straight
              </button>
            </div>
          </div>

          {/* Grid Snap */}
          <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-700">
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Grid Snap</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Snap components to grid when dragging</p>
            </div>
            <button
              onClick={() => handleToggle('gridSnap')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.gridSnap ? 'bg-slate-700 dark:bg-slate-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <motion.div
                animate={{ x: settings.gridSnap ? 24 : 2 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Save size={18} className="text-blue-500 dark:text-blue-400" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Auto Save</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Automatically save progress every 30 seconds</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('autoSave')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.autoSave ? 'bg-slate-700 dark:bg-slate-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <motion.div
                animate={{ x: settings.autoSave ? 24 : 2 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Preferences Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm"
      >
        <div className="flex items-center gap-3 mb-6">
          <Zap size={22} className="text-yellow-600 dark:text-yellow-400" />
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Preferences</h2>
        </div>

        <div className="space-y-6">
          {/* Sound Effects */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 size={18} className="text-yellow-500 dark:text-yellow-400" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Sound Effects</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Play sounds for actions and validations</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('soundEffects')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.soundEffects ? 'bg-slate-700 dark:bg-slate-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <motion.div
                animate={{ x: settings.soundEffects ? 24 : 2 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between py-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <Bell size={18} className="text-blue-500 dark:text-blue-400" />
              <div>
                <p className="font-bold text-slate-900 dark:text-white">Notifications</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Show achievement and progress notifications</p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('notifications')}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                settings.notifications ? 'bg-slate-700 dark:bg-slate-600' : 'bg-slate-300 dark:bg-slate-600'
              }`}
            >
              <motion.div
                animate={{ x: settings.notifications ? 24 : 2 }}
                className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-red-50 rounded-3xl border border-red-200 p-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle size={22} className="text-red-600" />
          <h2 className="text-xl font-black text-red-900">Danger Zone</h2>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-red-700 font-medium">
            Resetting will permanently delete all your progress, achievements, lab reports, and settings. This action cannot be undone.
          </p>
          
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all flex items-center gap-2 shadow-lg shadow-red-200"
            >
              <RefreshCw size={18} />
              Reset All Data
            </button>
          ) : (
            <div className="bg-white border-2 border-red-300 rounded-2xl p-4 space-y-3">
              <p className="font-bold text-red-900">Are you absolutely sure?</p>
              <p className="text-sm text-red-700">This will delete all {userData.labReports.length} lab reports, {Object.keys(userData.experimentsProgress).length} experiments in progress, and all achievements.</p>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all"
                >
                  Yes, Reset Everything
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-6 py-2 bg-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-300 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Info Footer */}
      <div className="text-center py-8 text-sm text-slate-500 font-medium">
        <p>All settings are saved automatically to your browser's local storage</p>
      </div>

      {/* Save Notification */}
      {saveNotification && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg">
          {saveNotification}
        </div>
      )}
    </div>
  );
}