import React from 'react';
import { useUser } from '../contexts/UserContext';
import { 
  LayoutDashboard, 
  FlaskConical, 
  User, 
  Settings, 
  BookOpen, 
  LogOut, 
  Cpu,
  History,
  Menu,
  X,
  ChevronDown,
  Mail,
  ShieldCheck,
  Award,
  Building2,
  BarChart3,
  FileText,
  Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TopNavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
}

export function TopNavbar({ 
  currentView, 
  onNavigate,
  onLogout 
}: TopNavbarProps) {
  const { userData } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 z-50 transition-colors duration-300"
      >
        <div className="max-w-[1600px] mx-auto px-6 h-full flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Cpu size={24} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">
                Bridge 86-51
              </h1>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                Microarch Lab
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.filter(item => item.id !== 'logout').map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`relative px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 text-sm ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <Icon size={18} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Profile Dropdown Button */}
            <div className="hidden md:block relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              >
                <div className="relative">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-11 h-11 rounded-full border-2 border-slate-200 dark:border-slate-700"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900"></div>
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {userData.name}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {userData.email}
                  </div>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-slate-400 dark:text-slate-500 transition-transform hidden lg:block ${isProfileDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Desktop Profile Dropdown */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 mt-2 w-96 max-h-[calc(100vh-7rem)] bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden flex flex-col"
                  >
                    {/* Profile Header with Gradient */}
                    <div className="relative p-6 bg-gradient-to-br from-blue-600 via-purple-600 to-purple-700 shrink-0">
                      <div className="flex items-start gap-4">
                        <img
                          src={userData.avatar}
                          alt={userData.name}
                          className="w-20 h-20 rounded-2xl border-4 border-white/30 shadow-xl"
                        />
                        <div className="flex-1">
                          <h3 className="text-xl font-black text-white mb-1">
                            {userData.name}
                          </h3>
                          <p className="text-sm text-white/90 font-medium mb-2">
                            {userData.email}
                          </p>
                          <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium">
                            <Building2 size={14} />
                            <span>{userData.institution}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-y-auto overscroll-contain">
                      {/* Stats Section */}
                      <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                        <div className="text-center">
                          <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">
                            2
                          </div>
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            Completed
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
                            10
                          </div>
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            Achievements
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-black text-teal-600 dark:text-teal-400 mb-1">
                            2
                          </div>
                          <div className="text-xs font-bold text-slate-600 dark:text-slate-400">
                            Reports
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-3">
                        <button
                          onClick={() => {
                            onNavigate('profile');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
                        >
                          <User size={20} className="text-slate-600 dark:text-slate-400" />
                          <span className="text-sm">View Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('dashboard');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
                        >
                          <BarChart3 size={20} className="text-slate-600 dark:text-slate-400" />
                          <span className="text-sm">My Progress</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('reports');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
                        >
                          <FileText size={20} className="text-slate-600 dark:text-slate-400" />
                          <span className="text-sm">Lab Reports</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('achievements');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
                        >
                          <Trophy size={20} className="text-slate-600 dark:text-slate-400" />
                          <span className="text-sm">Achievements</span>
                        </button>
                        <button
                          onClick={() => {
                            onNavigate('settings');
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-left"
                        >
                          <Settings size={20} className="text-slate-600 dark:text-slate-400" />
                          <span className="text-sm">Settings</span>
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="p-3 border-t border-slate-100 dark:border-slate-700">
                        <button
                          onClick={() => {
                            onLogout();
                            setIsProfileDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-left"
                        >
                          <LogOut size={20} />
                          <span className="text-sm">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden fixed top-20 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700 z-40 shadow-xl"
          >
            <div className="p-4 space-y-4">
              {/* Mobile Profile Info */}
              <div className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <img
                    src={userData.avatar}
                    alt={userData.name}
                    className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-slate-700"
                  />
                  <div>
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {userData.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {userData.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
                
                {/* Profile Link for Mobile */}
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
                    currentView === 'profile'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <User size={20} />
                  <span>Profile</span>
                </button>
                
                {/* Logout Button */}
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut size={20} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'experiments', label: 'Experiments', icon: FlaskConical },
  { id: 'reports', label: 'Reports', icon: History },
  { id: 'documentation', label: 'Docs', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];