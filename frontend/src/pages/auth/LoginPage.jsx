import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, AlertTriangle, ShieldCheck, Zap, Globe, KeyRound, CheckCircle2, Building2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [ssoModalOpen, setSsoModalOpen] = useState(false);
  const [ssoProvider, setSsoProvider] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@taskflow.com',
      password: 'Password@123',
    }
  });

  const passwordVal = watch('password') || '';

  // Quick fill preset roles
  const demoRoles = [
    { label: 'Super Admin', email: 'admin@taskflow.com', pass: 'Password@123', icon: '👑', badge: 'Full System Control' },
    { label: 'Project Manager', email: 'pm@taskflow.com', pass: 'Password@123', icon: '💼', badge: 'Portfolio Lead' },
    { label: 'Lead Engineer', email: 'dev@taskflow.com', pass: 'Password@123', icon: '👨‍💻', badge: 'Sprint Developer' },
    { label: 'Client Partner', email: 'client@taskflow.com', pass: 'Password@123', icon: '🏢', badge: 'Stakeholder Read' },
  ];

  const handleQuickFill = (role) => {
    setValue('email', role.email, { shouldValidate: true });
    setValue('password', role.pass, { shouldValidate: true });
    toast.success(`Loaded demo credentials for ${role.label}`, {
      icon: role.icon,
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '13px' }
    });
  };

  const calculatePasswordStrength = (pass) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const pwdScore = calculatePasswordStrength(passwordVal);
  const pwdLabels = ['Weak', 'Fair', 'Good', 'Strong', 'Enterprise Compliant'];
  const pwdColors = ['bg-slate-300 dark:bg-slate-700', 'bg-rose-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
  };

  const handleSsoClick = (providerName) => {
    setSsoProvider(providerName);
    setSsoModalOpen(true);
  };

  const onSubmit = async (data) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await authService.login(data);
      login(res.data);
      toast.success('Welcome back to TaskFlow Enterprise!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl transition-all duration-300 relative overflow-hidden">
      
      {/* Top Header Badge & Live Ticker */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-[11px] font-bold text-brand-700 dark:text-brand-300">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Enterprise Identity & SSO Active
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200/50 dark:border-emerald-800/50">
          <Zap className="w-3 h-3 animate-pulse" /> 24ms API Latency
        </div>
      </div>

      {/* Main Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Sign in to TaskFlow
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your organization credentials or select a pre-configured demo persona.
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Selector */}
      <div className="space-y-2 pt-1">
        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          ⚡ One-Click Demo Role Selector
        </label>
        <div className="grid grid-cols-2 gap-2">
          {demoRoles.map((role, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleQuickFill(role)}
              className="flex flex-col items-start p-2.5 rounded-xl bg-slate-50 hover:bg-brand-50/80 dark:bg-slate-800/60 dark:hover:bg-brand-950/60 border border-slate-200/80 dark:border-slate-700/60 text-left transition-all duration-200 hover:scale-[1.02] focus:ring-2 focus:ring-brand-500/30 group"
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1">
                  <span>{role.icon}</span> {role.label}
                </span>
                <span className="text-[9px] font-semibold text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill →
                </span>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate w-full mt-0.5">
                {role.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Enterprise Social SSO Buttons */}
      <div className="space-y-2 pt-1">
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Or continue with Enterprise Identity Provider
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => handleSsoClick('Google Workspace')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <Globe className="w-3.5 h-3.5 text-rose-500" /> Google
          </button>
          <button
            type="button"
            onClick={() => handleSsoClick('Microsoft Entra ID')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-500" /> Azure AD
          </button>
          <button
            type="button"
            onClick={() => handleSsoClick('GitHub Enterprise')}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
          >
            <KeyRound className="w-3.5 h-3.5 text-purple-400" /> GitHub
          </button>
        </div>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-4 pt-1">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="user@taskflow.com"
          error={errors.email?.message}
          {...register('email', { 
            required: 'Email address is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Please enter a valid email address' }
          })}
        />

        <div className="space-y-1">
          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••••••"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          {/* Password Complexity Progress Meter */}
          {passwordVal.length > 0 && (
            <div className="pt-1 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                <span>Security Complexity</span>
                <span className={pwdScore >= 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}>
                  {pwdLabels[pwdScore]}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-full transition-all duration-300 ${
                      i < pwdScore ? pwdColors[pwdScore] : 'bg-slate-200 dark:bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {capsLockOn && (
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-semibold mt-1 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" /> Caps Lock is ON
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 font-medium select-none">
            <input 
              type="checkbox" 
              defaultChecked
              className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 text-brand-600 focus:ring-brand-500 dark:bg-slate-800" 
            />
            Keep me signed in for 30 days
          </label>
          <Link to="/forgot-password" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" isLoading={loading} disabled={loading} className="w-full h-11 text-sm font-bold shadow-lg shadow-brand-500/25">
          <LogIn className="w-4 h-4 mr-2" />
          {loading ? 'Signing In...' : 'Sign In to Account'}
        </Button>
      </form>

      {/* Footer Registration Link */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Create Employee Account
        </Link>
      </p>

      {/* SSO Identity Handshake Modal */}
      {ssoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/80 border border-brand-200 dark:border-brand-800 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto text-xl font-bold">
              🔐
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Connecting to {ssoProvider}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Initiating OAuth 2.0 SAML Handshake. Please select a pre-configured demo role button above or click proceed to authenticate via local credentials.
            </p>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSsoModalOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setSsoModalOpen(false);
                  handleQuickFill(demoRoles[0]);
                }}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Use Super Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


