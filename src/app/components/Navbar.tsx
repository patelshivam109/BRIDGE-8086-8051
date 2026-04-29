import React from 'react';
import { Cpu, Menu, X, Activity, FlaskConical, Binary, LogIn, User, LogOut, Settings, UserPlus } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { useUser } from '../contexts/UserContext';

export function Navbar({ 
  onNavigate, 
  currentMode, 
  isAuthenticated, 
  onSignIn,
  onLogout
}: { 
  onNavigate: (mode: string) => void, 
  currentMode: string, 
  isAuthenticated: boolean,
  onSignIn: (mode: 'signin' | 'signup') => void,
  onLogout: () => void
}) {
  const { userData } = useUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeSection, setActiveSection] = React.useState('home');

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 64; // Height of fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
    }
  };

  // Track active section on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'features', 'experiments', 'about'];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sectionNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'experiments', label: 'Experiments' },
    { id: 'about', label: 'About' },
  ];

  const navItems = [
    { id: 'dashboard', label: 'Lab Dashboard', icon: FlaskConical },
    { id: 'analysis', label: 'AI Analysis', icon: Cpu },
    { id: 'translator', label: 'Code Translator', icon: Binary },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => scrollToSection('home')}
          >
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Bridge 86-51
            </span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-1 text-sm font-medium">
              {/* Section Navigation */}
              {sectionNavItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    activeSection === item.id 
                      ? 'bg-blue-50 text-blue-600 font-semibold' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="h-6 w-px bg-slate-200 mx-2" />
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 text-slate-700 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 transition-colors cursor-pointer group">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <User size={14} />
                      </div>
                      <span className="text-xs font-semibold">{userData.name}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
                    <DropdownMenuLabel className="px-3 py-2 text-xs text-slate-500 uppercase font-bold tracking-wider">
                      My Account
                    </DropdownMenuLabel>
                    <DropdownMenuItem 
                      onClick={() => onNavigate('profile')}
                      className="rounded-xl py-2.5 cursor-pointer focus:bg-blue-50 focus:text-blue-600"
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onNavigate('profile')}
                      className="rounded-xl py-2.5 cursor-pointer focus:bg-blue-50 focus:text-blue-600"
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-slate-100" />
                    <DropdownMenuItem 
                      onClick={onLogout}
                      className="rounded-xl py-2.5 cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-500"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onSignIn('signin')}
                    className="text-slate-700 hover:text-blue-600 px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2"
                  >
                    <LogIn size={16} />
                    Sign In
                  </button>
                  <button 
                    onClick={() => onSignIn('signup')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
                  >
                    <UserPlus size={16} />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-2 pt-2 pb-3 space-y-1">
          {/* Section Navigation for Mobile */}
          <div className="pb-2 mb-2 border-b border-slate-100">
            <p className="px-3 py-2 text-xs text-slate-500 uppercase font-bold tracking-wider">Sections</p>
            {sectionNavItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  scrollToSection(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-3 rounded-xl transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-slate-600 hover:text-blue-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          {/* App Navigation */}
          <p className="px-3 py-2 text-xs text-slate-500 uppercase font-bold tracking-wider">Navigate</p>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setIsOpen(false);
              }}
              className="w-full text-left flex items-center gap-3 px-3 py-3 text-slate-600 hover:text-blue-600 rounded-xl transition-colors"
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
          {isAuthenticated ? (
            <div className="pt-2 border-t border-slate-100 mt-2 space-y-1">
              <button 
                onClick={() => { onNavigate('profile'); setIsOpen(false); }}
                className="w-full text-left flex items-center gap-3 px-3 py-3 text-slate-600 hover:text-blue-600 rounded-xl transition-colors"
              >
                <User size={18} /> Profile Settings
              </button>
              <button 
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full text-left flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <LogOut size={18} /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 mt-2 space-y-2">
              <button 
                onClick={() => { onSignIn('signin'); setIsOpen(false); }}
                className="w-full px-3 py-3 border-2 border-blue-600 text-blue-600 rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-50 transition-colors"
              >
                <LogIn size={18} /> Sign In
              </button>
              <button 
                onClick={() => { onSignIn('signup'); setIsOpen(false); }}
                className="w-full px-3 py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2 font-bold hover:bg-blue-700 transition-colors"
              >
                <UserPlus size={18} /> Sign Up
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}