import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, Eye, EyeOff, Check, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@taskflow.com',
      password: 'TaskFlow#2026!Secure',
    }
  });

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

  const handleQuickFill = (roleEmail, rolePass, roleName) => {
    setValue('email', roleEmail, { shouldValidate: true });
    setValue('password', rolePass, { shouldValidate: true });
    toast.success(`Loaded credentials for ${roleName}`);
  };

  const handleGoogleLogin = () => {
    toast.info('Google Workspace Single Sign-On initiated');
    // Preload admin credentials for smooth demo experience
    onSubmit({ email: 'admin@taskflow.com', password: 'TaskFlow#2026!Secure' });
  };

  return (
    <div className="w-full rounded-[32px] p-8 sm:p-10 bg-[#071329]/85 backdrop-blur-2xl border border-cyan-400/80 shadow-[0_0_60px_rgba(0,180,255,0.35)] relative overflow-hidden text-slate-100 transition-all">
      
      {/* Top Card Header matching screenshot */}
      <div className="flex flex-col items-center text-center gap-1.5 mb-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white">
            TaskFlow
          </span>
        </div>
        <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-cyan-400/90">
          PROJECT MANAGEMENT PLATFORM
        </span>
      </div>

      {/* Welcome Title */}
      <div className="text-center mb-7">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome <span className="text-cyan-400">back</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1.5 font-normal">
          Sign in to continue to your workspace
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email Address Input */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              placeholder="Email address"
              className={`w-full pl-10 pr-4 py-3 rounded-xl bg-[#0b1836]/90 border ${
                errors.email ? 'border-rose-500' : 'border-slate-700/80 focus:border-cyan-400'
              } text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all`}
              {...register('email', { 
                required: 'Email address is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
              })}
            />
          </div>
          {errors.email && (
            <p className="text-[11px] text-rose-400 pl-1">{errors.email.message}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className={`w-full pl-10 pr-10 py-3 rounded-xl bg-[#0b1836]/90 border ${
                errors.password ? 'border-rose-500' : 'border-slate-700/80 focus:border-cyan-400'
              } text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-400/40 transition-all`}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              tabIndex="-1"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-[11px] text-rose-400 pl-1">{errors.password.message}</p>
          )}
        </div>

        {/* Remember me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded bg-[#0b1836] border-slate-700 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-blue-600"
            />
            <span>Remember me</span>
          </label>
          <Link
            to="/forgot-password"
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit Button: Sign In -> */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] hover:from-[#0092E5] hover:to-[#00D0E5] text-white font-bold text-sm shadow-[0_4px_25px_rgba(0,180,255,0.4)] hover:shadow-[0_4px_30px_rgba(0,180,255,0.6)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In</span>
              <span className="text-base font-semibold">→</span>
            </>
          )}
        </button>

      </form>

      {/* OR Divider */}
      <div className="relative flex items-center justify-center my-5">
        <div className="border-t border-slate-700/80 w-full" />
        <span className="bg-[#071329] px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
          OR
        </span>
        <div className="border-t border-slate-700/80 w-full" />
      </div>

      {/* Social Login: Continue with Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full py-2.5 rounded-xl border border-slate-700/80 bg-[#0b1836]/60 hover:bg-[#0e2048] text-slate-200 text-xs font-semibold flex items-center justify-center gap-2.5 transition-all shadow-xs cursor-pointer"
      >
        {/* Official Google multicolored G Logo */}
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </button>

      {/* Card Footer: Don't have an account? Create one */}
      <p className="text-center text-xs text-slate-400 mt-5 font-normal">
        Don't have an account?{' '}
        <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
          Create one
        </Link>
      </p>

      {/* Quick Testing Bar (subtle 1-click credentials for demo testing) */}
      <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1 font-medium">
          <Zap className="w-3 h-3 text-cyan-400" /> Demo Quick-Fill:
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleQuickFill('admin@taskflow.com', 'TaskFlow#2026!Secure', 'Super Admin')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline"
          >
            Super Admin
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => handleQuickFill('dev@taskflow.com', 'TaskFlow#2026!Secure', 'Developer')}
            className="text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer underline"
          >
            Developer
          </button>
        </div>
      </div>

    </div>
  );
};
