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
      password: 'Password@123',
    }
  });

  const passwordVal = watch('password') || '';

  // Preset demo personas
  const demoRoles = [
    { label: 'Super Admin', email: 'admin@taskflow.com', pass: 'Password@123', icon: '👑', badge: 'Full System Control', color: 'from-amber-500/10 to-orange-500/10 border-amber-500/30' },
    { label: 'Project Manager', email: 'pm@taskflow.com', pass: 'Password@123', icon: '💼', badge: 'Portfolio & Velocity', color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30' },
    { label: 'Senior Developer', email: 'dev@taskflow.com', pass: 'Password@123', icon: '👨‍💻', badge: 'Sprint & Kanban Tasks', color: 'from-purple-500/10 to-indigo-500/10 border-purple-500/30' },
    { label: 'Client Partner', email: 'client@taskflow.com', pass: 'Password@123', icon: '🏢', badge: 'Stakeholder Read-Only', color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30' },
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
    <div className="space-y-6 bg-white/85 dark:bg-slate-900/90 backdrop-blur-2xl p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl transition-all duration-300 relative overflow-hidden">
      
      {/* Top Header Badge & Live Infrastructure Ticker */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/60 dark:border-brand-800/60 text-[11px] font-bold text-brand-700 dark:text-brand-300">
          <ShieldCheck className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" /> Enterprise Authentication Active
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
          Select an authentication method or use a pre-configured demo persona.
        </p>
      </div>

      {/* Tabbed Navigation Control (Sign In | One-Click Demo | SSO) */}
      <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('login')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'login' 
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          🔑 Standard Sign In
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('demo')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'demo' 
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          ⚡ Demo Sandbox
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sso')}
          className={`flex-1 py-2 rounded-xl transition-all ${
            activeTab === 'sso' 
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-md font-extrabold' 
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          🏢 Enterprise SSO
        </button>
      </div>

      {/* TAB 1: STANDARD SIGN IN & QUICK PERSONA BAR */}
      {activeTab === 'login' && (
        <div className="space-y-4 animate-fade-in">
          {/* Quick-Fill Persona Row */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              ⚡ Quick Role Select
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {demoRoles.map((role, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleQuickFill(role, false)}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-brand-50 dark:bg-slate-800/80 dark:hover:bg-brand-950/80 border border-slate-200/80 dark:border-slate-700/80 text-center transition-all hover:scale-102"
                  title={`Fill credentials for ${role.label}`}
                >
                  <span className="text-base">{role.icon}</span>
                  <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate w-full mt-0.5">
                    {role.label.split(' ')[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown} className="space-y-4">
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
        </div>
      )}

      {/* TAB 2: DEMO ROLE SANDBOX CARDS */}
      {activeTab === 'demo' && (
        <div className="space-y-3 animate-fade-in">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Click any persona card below to instantly sign in and explore role-based permissions.
          </p>

          <div className="space-y-2">
            {demoRoles.map((role, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl bg-gradient-to-r ${role.color} border flex items-center justify-between transition-all hover:scale-[1.02] shadow-xs`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{role.icon}</div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-slate-100">{role.label}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{role.badge}</p>
                    <code className="text-[10px] text-brand-600 dark:text-brand-400 font-mono">{role.email}</code>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleQuickFill(role, true)}
                  className="text-xs font-bold py-1.5 px-3"
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
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Authenticate using your corporate Single Sign-On (SSO) Identity Provider.
          </p>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleSsoClick('Google Workspace')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-rose-500" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Google Workspace SSO</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">OAuth 2.0 Corporate Domain</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Connect →</span>
            </button>

            <button
              type="button"
              onClick={() => handleSsoClick('Microsoft Entra ID')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5 text-blue-500" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Microsoft Entra ID (Azure AD)</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">SAML 2.0 Enterprise Federation</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Connect →</span>
            </button>

            <button
              type="button"
              onClick={() => handleSsoClick('GitHub Enterprise')}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-xs"
            >
              <div className="flex items-center gap-3">
                <KeyRound className="w-5 h-5 text-purple-400" />
                <div className="text-left">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">GitHub Enterprise Cloud</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">DevSecOps Organization SSO</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">Connect →</span>
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



