import React from 'react';
import { User, Settings, LogOut, Award, BookOpen, BarChart3, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../contexts/UserContext';
import { SettingsModal } from './SettingsModal';
import { AchievementsModal } from './AchievementsModal';
import { ProgressModal } from './ProgressModal';
import { LabReportsModal } from './LabReportsModal';
import { ImageWithFallback } from './shared/ImageWithFallback';

interface ProfileDropdownProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
  userName?: string;
  userEmail?: string;
  variant?: 'workspace' | 'dashboard';
}

export function ProfileDropdown({ 
  onNavigate, 
  onLogout,
  variant = 'workspace'
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const [achievementsOpen, setAchievementsOpen] = React.useState(false);
  const [progressOpen, setProgressOpen] = React.useState(false);
  const [reportsOpen, setReportsOpen] = React.useState(false);
  
  const { userData } = useUser();
  const userName = userData?.name || 'Student';
  const userEmail = userData?.email || '';

  const totalExperiments = 9;
  const completedExperiments = userData?.experimentsProgress 
    ? Object.values(userData.experimentsProgress).filter(p => p.isValidated).length 
    : 0;
  const completionPercent = Math.round((completedExperiments / totalExperiments) * 100);

  const menuItems = [
    { id: 'profile', label: 'View Profile', icon: User },
    { id: 'progress', label: 'My Progress', icon: BarChart3, modal: true },
    { id: 'reports', label: 'Lab Reports', icon: BookOpen, modal: true },
    { id: 'achievements', label: 'Achievements', icon: Award },
    { id: 'settings', label: 'Settings', icon: Settings, modal: true },
  ];

  const handleItemClick = (id: string) => {
    setIsOpen(false);
    if (id === 'logout' && onLogout) {
      onLogout();
    } else if (id === 'settings') {
      setSettingsOpen(true);
    } else if (id === 'progress') {
      setProgressOpen(true);
    } else if (id === 'reports') {
      setReportsOpen(true);
    } else if (onNavigate) {
      onNavigate(id);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-sm hover:shadow-md group"
      >
        <div className="relative">
          {userData?.avatar ? (
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg">
              <ImageWithFallback
                src={userData.avatar}
                alt={userName}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black shadow-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
        </div>
        <div className="text-left hidden md:block">
          <p className="font-black text-slate-900 dark:text-white text-sm">{userName}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{userEmail}</p>
        </div>
        <ChevronDown 
          size={18} 
          className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 max-h-[calc(100vh-2rem)] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-6 text-white shrink-0">
              <div className="flex items-center gap-4">
                {userData?.avatar ? (
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-white/30">
                    <ImageWithFallback
                      src={userData.avatar}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl font-black">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-black text-lg">{userName}</h3>
                  <p className="text-blue-100 text-sm font-medium">{userEmail}</p>
                  <p className="text-blue-200 text-xs font-bold mt-1 flex items-center gap-1">
                    <Award size={12} />
                    {userData?.institution || 'Student'}
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain">
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-900/50">
                <div className="text-center">
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{completedExperiments}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-purple-600 dark:text-purple-400">{userData?.achievements?.length || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Achievements</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{userData?.labReports?.length || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Reports</p>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modals */}
      <SettingsModal isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <AchievementsModal isOpen={achievementsOpen} onClose={() => setAchievementsOpen(false)} />
      <ProgressModal isOpen={progressOpen} onClose={() => setProgressOpen(false)} />
      <LabReportsModal isOpen={reportsOpen} onClose={() => setReportsOpen(false)} />
    </div>
  );
}