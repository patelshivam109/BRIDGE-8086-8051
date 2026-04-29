import React from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  LayoutDashboard, 
  FlaskConical, 
  User, 
  Settings, 
  FileText, 
  BookOpen, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Cpu,
  ShieldCheck,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ 
  isOpen, 
  currentView, 
  onNavigate,
  onLogout 
}: SidebarProps) {
  return (
    <motion.div
      initial={false}
      animate={{ 
        width: isOpen ? 280 : 80,
        x: 0 
      }}
      className="fixed left-0 top-0 h-screen bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col shadow-lg transition-colors duration-300 z-40"
    >
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-700">
        <motion.div 
          className="flex items-center gap-3"
          animate={{ justifyContent: isOpen ? 'flex-start' : 'center' }}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Cpu size={22} />
          </div>
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <h1 className="text-lg font-black text-slate-900 dark:text-white whitespace-nowrap">
                  Bridge 86-51
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'logout') {
                  onLogout();
                } else {
                  onNavigate(item.id);
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30'
                  : item.id === 'logout' 
                    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
              title={!isOpen ? item.label : undefined}
            >
              <Icon size={20} />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <AnimatePresence>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-slate-500 dark:text-slate-400 font-medium"
            >
              <p className="font-bold text-slate-900 dark:text-white mb-1">Bridge 86-51</p>
              <p>AI-Powered Microarchitecture Lab</p>
              <p className="mt-2 text-slate-400 dark:text-slate-500">Version 2.0</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-center"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'experiments', label: 'Experiments', icon: FlaskConical },
  { id: 'reports', label: 'Lab Reports', icon: History },
  { id: 'documentation', label: 'Documentation', icon: BookOpen },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'logout', label: 'Sign Out', icon: LogOut },
];