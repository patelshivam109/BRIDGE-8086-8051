import React from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { CardDeck } from './components/CardDeck';
import { Footer } from './components/Footer';
import { LabDashboard } from './components/LabDashboard';
import { LabWorkspace } from './components/LabWorkspace';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { TopNavbar } from './components/TopNavbar';
import { DashboardOverview } from './components/DashboardOverview';
import { ProfileDropdown } from './components/ProfileDropdown';
import { SettingsPage } from './components/SettingsPage';
import { LabReportsPage } from './components/LabReportsPage';
import { DocumentationPage } from './components/DocumentationPage';
import { UserProvider, useUser } from './contexts/UserContext';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu } from 'lucide-react';
import { apiRequest } from './utils/api';

const AUTH_SESSION_KEY = 'bridge-86-51-auth-session';

function AppContent() {
  const { userData, setActiveUser, clearActiveUser } = useUser();
  const [view, setView] = React.useState('landing'); 
  const [activeExp, setActiveExp] = React.useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return !!localStorage.getItem(AUTH_SESSION_KEY);
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);
  const [authModalMode, setAuthModalMode] = React.useState<'signin' | 'signup'>('signin');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const isDarkMode = userData.settings.theme === 'dark';

  const handleActionRequiringAuth = (targetView: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    } else {
      setView(targetView);
    }
  };

  const navigate = (mode: string) => {
    if (mode === 'landing') setView('landing');
    else if (mode === 'profile') handleActionRequiringAuth('profile');
    else if (mode === 'settings') handleActionRequiringAuth('settings');
    else if (mode === 'dashboard') handleActionRequiringAuth('dashboard');
    else if (mode === 'experiments') handleActionRequiringAuth('experiments');
    else if (mode === 'reports') handleActionRequiringAuth('reports');
    else if (mode === 'documentation') handleActionRequiringAuth('documentation');
    else {
      handleActionRequiringAuth('dashboard');
    }
  };

  const startExperiment = (id: string) => {
    setActiveExp(id);
    setView('lab');
  };

  const onAuthSuccess = (user: { id: string; name: string; email: string; token: string }) => {
    setActiveUser(user);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    void apiRequest('/api/auth/logout', { method: 'POST' }).catch(() => {});
    setIsAuthenticated(false);
    setView('landing');
    setActiveExp(null);
    clearActiveUser();
  };

  const isDashboardView = isAuthenticated && view !== 'landing' && view !== 'lab';

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-900 text-slate-100' : 'bg-white text-slate-900'} selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden transition-colors duration-300`}>
      {view === 'landing' && (
        <Navbar 
          onNavigate={navigate} 
          currentMode={view} 
          isAuthenticated={isAuthenticated}
          onSignIn={(mode) => {
            setAuthModalMode(mode);
            setIsAuthModalOpen(true);
          }}
          onLogout={handleLogout}
        />
      )}
      
      {isDashboardView && (
        <TopNavbar 
          currentView={view} 
          onNavigate={setView} 
          onLogout={handleLogout}
        />
      )}

      <main className={`transition-all duration-300 ${isDashboardView ? 'pt-20' : ''}`}>
        {view === 'landing' && (
          <>
            <Hero onStart={() => handleActionRequiringAuth('dashboard')} />
            <Features />
            <CardDeck />
            <section id="about" className="py-24 bg-slate-50 border-y border-slate-100 relative overflow-hidden">
              {/* Animated background elements */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.05),transparent_50%)]" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(99,102,241,0.05),transparent_50%)]" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <motion.div 
                  className="max-w-3xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">Research-Driven Methodology</h2>
                  <p className="text-slate-600 text-lg mb-12 font-medium">
                    Our platform implements a modular architectural integration framework, allowing students to explore system complexity through systematic bidirectional experiments.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { 
                        label: 'IEEE', 
                        subtitle: 'Aligned Standard', 
                        color: 'text-blue-600',
                        bgGradient: 'from-blue-500/10 to-blue-600/10',
                        delay: 0
                      },
                      { 
                        label: 'AI', 
                        subtitle: 'Validation Engine', 
                        color: 'text-indigo-600',
                        bgGradient: 'from-indigo-500/10 to-indigo-600/10',
                        delay: 0.1
                      },
                      { 
                        label: 'VIRTUAL', 
                        subtitle: 'Experiment Lab', 
                        color: 'text-emerald-600',
                        bgGradient: 'from-emerald-500/10 to-emerald-600/10',
                        delay: 0.2
                      }
                    ].map((item, i) => (
                      <motion.div 
                        key={i}
                        className="relative p-10 bg-white border border-slate-100 rounded-[2.5rem] group cursor-pointer overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: item.delay }}
                        whileHover={{ 
                          y: -8,
                          boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.15)"
                        }}
                      >
                        {/* Animated gradient background */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                        />
                        
                        {/* Shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                          initial={{ x: "-100%", y: "-100%" }}
                          whileHover={{ x: "100%", y: "100%" }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        />
                        
                        <div className="relative z-10">
                          <motion.div 
                            className={`text-3xl font-extrabold ${item.color} mb-2`}
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          >
                            {item.label}
                          </motion.div>
                          <div className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                            {item.subtitle}
                          </div>
                        </div>

                        {/* Corner accent */}
                        <motion.div
                          className={`absolute top-0 right-0 w-20 h-20 ${item.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </section>
            <Footer />
          </>
        )}

        <div className={isDashboardView ? "p-8 max-w-7xl mx-auto min-h-screen" : ""}>
          {isDashboardView && view !== 'experiments' && (
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {view === 'dashboard' && 'Dashboard'}
                  {view === 'experiments' && 'Experiments'}
                  {view === 'reports' && 'Lab Reports'}
                  {view === 'documentation' && 'Documentation'}
                  {view === 'settings' && 'Settings'}
                  {view === 'profile' && 'My Profile'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Bridge 86-51 Microarchitecture Lab</p>
              </div>
            </div>
          )}
          
          {view === 'dashboard' && isAuthenticated && (
            <DashboardOverview 
              onSelectTrack={() => setView('experiments')} 
              onNavigate={(page) => setView(page)}
              onSelectExperiment={startExperiment}
            />
          )}

          {view === 'experiments' && isAuthenticated && (
            <LabDashboard onSelectExperiment={startExperiment} />
          )}

          {view === 'lab' && activeExp && isAuthenticated && (
            <LabWorkspace expId={activeExp} onBack={() => setView('experiments')} />
          )}

          {(view === 'profile' || view === 'achievements') && isAuthenticated && (
            <UserProfile 
              onLogout={handleLogout} 
              onBack={() => setView('dashboard')} 
              initialTab={view === 'achievements' ? 'achievements' : 'profile'}
            />
          )}

          {view === 'settings' && isAuthenticated && (
            <SettingsPage />
          )}

          {view === 'reports' && isAuthenticated && (
            <LabReportsPage />
          )}

          {view === 'documentation' && isAuthenticated && (
            <DocumentationPage />
          )}
        </div>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={onAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
