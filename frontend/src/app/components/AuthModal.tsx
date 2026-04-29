import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, X, LogIn, Mail, Lock, ShieldCheck, UserPlus, User, Eye, EyeOff } from 'lucide-react';
import { apiRequest } from '../utils/api';

const AUTH_SESSION_KEY = 'bridge-86-51-auth-session';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  token: string;
  avatar?: string;
  institution?: string;
  rollNumber?: string;
  role?: string;
  joinedAt?: string;
}

export function AuthModal({ isOpen, onClose, onSuccess, initialMode = 'signin' }: { isOpen: boolean, onClose: () => void, onSuccess: (user: AuthUser) => void, initialMode?: 'signin' | 'signup' }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [mode, setMode] = React.useState<'signin' | 'signup'>(initialMode);
  const [fullName, setFullName] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [resetEmail, setResetEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    setMode(initialMode);
    setErrorMessage('');
  }, [initialMode]);

  const handleForgotPassword = async () => {
    const trimmedEmail = resetEmail.trim().toLowerCase();
    if (trimmedEmail) {
      alert(`Password reset is not enabled for local SQLite accounts yet. Please contact the lab administrator for ${trimmedEmail}.`);
      setShowForgotPassword(false);
      setResetEmail('');
    } else {
      alert('Please enter your email address');
    }
  };

  const handleAuthSuccess = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = fullName.trim();

    setErrorMessage('');

    if (!trimmedEmail || !password) {
      setErrorMessage('Please enter your email and password.');
      return;
    }

    if (mode === 'signup' && !trimmedName) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (mode === 'signup' && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    try {
      setIsSubmitting(true);

      const authResult = mode === 'signin'
        ? await apiRequest<{ user: Omit<AuthUser, 'token'>; token: string }>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({
              email: trimmedEmail,
              password,
            }),
          })
        : await apiRequest<{ user: Omit<AuthUser, 'token'>; token: string }>('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({
              email: trimmedEmail,
              password,
              name: trimmedName,
            }),
          });

      const user = {
        ...authResult.user,
        token: authResult.token,
      };

      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(user));

      onSuccess(user);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="bg-blue-600 p-5 sm:p-8 text-center relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="inline-flex w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl items-center justify-center mb-4 border border-white/20">
              <Cpu className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-white mb-2">{mode === 'signin' ? 'Student Access' : 'Create Account'}</h2>
            <p className="text-blue-100 text-sm font-medium">
              {mode === 'signin' ? 'Please sign in to access the experimental lab.' : 'Register to start your microarchitecture journey.'}
            </p>
          </div>

          <div className="p-5 sm:p-8 space-y-6 overflow-y-auto overscroll-contain">
            {/* Mode Toggle */}
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => setMode('signin')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                  mode === 'signin'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LogIn size={16} className="inline mr-2" />
                Sign In
              </button>
              <button
                onClick={() => setMode('signup')}
                className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${
                  mode === 'signup'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <UserPlus size={16} className="inline mr-2" />
                Sign Up
              </button>
            </div>

            <div className="space-y-4">
              {/* Full Name - Only for Sign Up */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Shubham Patel"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Institutional Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password - Only for Sign Up */}
              {mode === 'signup' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Forgot Password Link - Only for Sign In */}
              {mode === 'signin' && (
                <div className="text-right -mt-2">
                  <button 
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={handleAuthSuccess}
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-extrabold shadow-xl shadow-blue-100 transition-all flex items-center justify-center gap-2 group"
            >
              {isSubmitting ? (
                'Please wait...'
              ) : mode === 'signin' ? (
                <>
                  <ShieldCheck size={20} />
                  Verify & Enter Lab
                </>
              ) : (
                <>
                  <UserPlus size={20} />
                  Create Account & Enter
                </>
              )}
            </button>

            {errorMessage && (
              <p className="text-sm font-semibold text-red-600 text-center">{errorMessage}</p>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setMode(mode === 'signin' ? 'signup' : 'signin');
                  setErrorMessage('');
                }}
                className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors"
              >
                {mode === 'signin' ? 'Need help with your access key?' : 'Already have an account?'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 flex items-center justify-center p-4 z-10"
          >
            <div 
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setShowForgotPassword(false)}
            />
            <div className="relative w-full max-w-sm max-h-[88vh] bg-white rounded-3xl shadow-2xl p-5 sm:p-8 space-y-4 overflow-y-auto">
              <div className="text-center">
                <div className="inline-flex w-14 h-14 bg-blue-100 rounded-2xl items-center justify-center mb-4">
                  <Lock className="text-blue-600" size={24} />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">Reset Password</h3>
                <p className="text-sm text-slate-600">Enter your institutional email to receive password reset instructions.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="student@university.edu"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleForgotPassword}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all"
                >
                  Send Reset Link
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
}
