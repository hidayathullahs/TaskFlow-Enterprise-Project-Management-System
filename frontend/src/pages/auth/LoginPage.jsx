import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, AlertTriangle, ShieldCheck, Zap, Globe, KeyRound, CheckCircle2, Building2, UserCheck, Star, Sparkles, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'demo' | 'sso'
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [ssoModalOpen, setSsoModalOpen] = useState(false);
  const [ssoProvider, setSsoProvider] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@taskflow.com',
      password: 'TaskFlow#2026!Secure',
    }
  });

  const passwordVal = watch('password') || '';

  // Preset demo personas
  const demoRoles = [
    { label: 'Super Admin', email: 'admin@taskflow.com', pass: 'TaskFlow#2026!Secure', icon: '👑', badge: 'Full System Control', color: 'from-amber-500/10 to-orange-500/10 border-amber-500/30' },
    { label: 'Project Manager', email: 'admin@taskflow.com', pass: 'TaskFlow#2026!Secure', icon: '💼', badge: 'Portfolio & Velocity', color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30' },
    { label: 'Senior Developer', email: 'admin@taskflow.com', pass: 'TaskFlow#2026!Secure', icon: '👨‍💻', badge: 'Sprint & Kanban Tasks', color: 'from-purple-500/10 to-indigo-500/10 border-purple-500/30' },
    { label: 'Client Partner', email: 'admin@taskflow.com', pass: 'TaskFlow#2026!Secure', icon: '🏢', badge: 'Stakeholder Read-Only', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30' },
  ];

  const handleQuickFill = (role, autoSubmit = false) => {
    setValue('email', role.email, { shouldValidate: true });
    setValue('password', role.pass, { shouldValidate: true });
    toast.success(`Loaded credentials for ${role.label}`, {
      icon: role.icon,
      style: { borderRadius: '16px', background: '#0f172a', color: '#fff', fontSize: '13px' }
    });
    if (autoSubmit) {
      onSubmit({ email: role.email, password: role.pass });
    }
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
    <div className="space-y-4 xl:space-y-5 bg-slate-900/90 backdrop-blur-2xl p-6 sm:p-7 xl:p-8 rounded-3xl border border-slate-800 shadow-2xl shadow-black/80 transition-all duration-300 relative overflow-hidden text-slate-100">
      
      {/* Top Header Badge & Live Infrastructure Ticker */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-[11px] font-bold text-brand-300">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Enterprise Authentication
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
          <Zap className="w-3 h-3 animate-pulse text-emerald-400" /> 18ms Live Latency
        </div>
      </div>

      {/* Main Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Sign In to TaskFlow
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Select an enterprise authentication method or test with a pre-configured persona.
        </p>
      </div>

      {/* Tabbed Navigation Control (Sign In | One-Click Demo | SSO) */}
      <div className="flex p-1 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'login' 
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/40 font-extrabold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🔑 Standard Sign In
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('demo')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'demo' 
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/40 font-extrabold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          ⚡ Demo Sandbox
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sso')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'sso' 
              ? 'bg-brand-600 text-white shadow-md shadow-brand-600/40 font-extrabold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          🏢 Enterprise SSO
        </button>
      </div>

      {/* TAB 1: STANDARD SIGN IN & QUICK PERSONA BAR */}
      {activeTab === 'login' && (
        <div className="space-y-4 animate-fade-in">
          {/* Quick-Fill Persona 2x2 Grid */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                ⚡ 1-Click Role Switcher
              </label>
              <span className="text-[10px] text-brand-400 font-semibold">Click to auto-populate</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoRoles.map((role, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickFill(role, false)}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/90 border border-slate-800 hover:border-brand-500/50 text-left transition-all hover:scale-[1.02] group shadow-xs"
                  title={`Fill credentials for ${role.label}`}
                >
                  <span className="text-xl p-1.5 rounded-lg bg-slate-900 border border-slate-700/60 group-hover:scale-110 transition-transform">
                    {role.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="block text-xs font-bold text-white group-hover:text-brand-300 truncate">
                      {role.label}
                    </span>
                    <span className="block text-[10px] text-slate-400 truncate font-normal">
                      {role.badge}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
            <Input
              label="Work Email Address"
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
                label="Enterprise Password"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                error={errors.password?.message}
                {...register('password', { required: 'Password is required' })}
              />

              {/* Password Complexity Progress Meter */}
              {passwordVal.length > 0 && (
                <div className="pt-1 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Security Complexity</span>
                    <span className={pwdScore >= 3 ? 'text-emerald-400 font-extrabold' : 'text-amber-400 font-extrabold'}>
                      {pwdLabels[pwdScore]}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1 h-1.5 w-full rounded-full overflow-hidden bg-slate-800">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-full transition-all duration-300 ${
                          i < pwdScore ? pwdColors[pwdScore] : 'bg-slate-800'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {capsLockOn && (
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-semibold mt-1 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5" /> Caps Lock is ON
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 font-medium select-none">
                <input 
                  type="checkbox" 
                  defaultChecked
                  className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-brand-600 focus:ring-brand-500" 
                />
                Keep me signed in for 30 days
              </label>
              <Link to="/forgot-password" className="font-bold text-brand-400 hover:text-brand-300 hover:underline">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" isLoading={loading} disabled={loading} className="w-full h-11 text-sm font-bold shadow-lg shadow-brand-500/30 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500">
              <LogIn className="w-4 h-4 mr-2" />
              {loading ? 'Authenticating...' : 'Sign In to TaskFlow Enterprise'}
            </Button>
          </form>
        </div>
      )}

      {/* TAB 2: DEMO ROLE SANDBOX CARDS */}
      {activeTab === 'demo' && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-slate-400">
            Click any persona card below to instantly sign in and explore role-based permissions.
          </p>

          <div className="space-y-2.5">
            {demoRoles.map((role, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between transition-all hover:scale-[1.01] hover:border-slate-700 shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl p-2 rounded-xl bg-slate-900 border border-slate-800">{role.icon}</div>
                  <div>
                    <h4 className="text-xs font-black text-white">{role.label}</h4>
                    <p className="text-[11px] text-slate-400 font-medium">{role.badge}</p>
                    <code className="text-[10px] text-brand-400 font-mono">{role.email}</code>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleQuickFill(role, true)}
                  className="text-xs font-bold py-1.5 px-3 bg-brand-600 hover:bg-brand-500 shadow-sm"
                >
                  Direct Login <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: ENTERPRISE SSO DIRECTORY */}
      {activeTab === 'sso' && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-slate-400">
            Authenticate using your corporate Single Sign-On (SSO) Identity Provider.
          </p>

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSsoClick('Google Workspace')}
              className="w-full p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:bg-slate-800/80 hover:border-slate-700 transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <Globe className="w-5 h-5 text-rose-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-300">Google Workspace SSO</h4>
                  <p className="text-[11px] text-slate-400">OAuth 2.0 Corporate Domain</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-400">Connect →</span>
            </button>

            <button
              type="button"
              onClick={() => handleSsoClick('Microsoft Entra ID')}
              className="w-full p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:bg-slate-800/80 hover:border-slate-700 transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <Building2 className="w-5 h-5 text-blue-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-300">Microsoft Entra ID (Azure AD)</h4>
                  <p className="text-[11px] text-slate-400">SAML 2.0 Enterprise Federation</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-400">Connect →</span>
            </button>

            <button
              type="button"
              onClick={() => handleSsoClick('GitHub Enterprise')}
              className="w-full p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between hover:bg-slate-800/80 hover:border-slate-700 transition-all shadow-md group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <KeyRound className="w-5 h-5 text-purple-400" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-300">GitHub Enterprise Cloud</h4>
                  <p className="text-[11px] text-slate-400">DevSecOps Organization SSO</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-400">Connect →</span>
            </button>
          </div>
        </div>
      )}

      {/* Enterprise Security Badges Bar */}
      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-around text-[10px] font-bold text-slate-400 dark:text-slate-500">
        <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /> SOC 2 Type II</span>
        <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-blue-500" /> 256-Bit AES</span>
        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> ISO 27001</span>
      </div>

      {/* Footer Registration Link */}
      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Create Employee Account
        </Link>
      </p>

      {/* SSO Modal Handshake */}
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
              Initiating OAuth 2.0 SAML Handshake. Click proceed below to sign in using the pre-configured Super Admin persona.
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
                  handleQuickFill(demoRoles[0], true);
                }}
                className="w-full"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" /> Sign In as Admin
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



