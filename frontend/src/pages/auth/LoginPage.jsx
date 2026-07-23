import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Mail, Lock, LogIn, AlertTriangle, ShieldCheck } from 'lucide-react';
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

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: 'admin@taskflow.com',
      password: 'Password@123',
    }
  });

  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState('CapsLock')) {
      setCapsLockOn(true);
    } else {
      setCapsLockOn(false);
    }
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
    <div className="space-y-6 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xl transition-all duration-300">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200/50 dark:border-brand-800/50 text-[11px] font-bold text-brand-700 dark:text-brand-300 mb-3">
          <ShieldCheck className="w-3.5 h-3.5" /> Enterprise SSO & Local Auth Active
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Sign in to TaskFlow
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your authorized enterprise credentials to access your workspace.
        </p>
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

        <Button type="submit" isLoading={loading} disabled={loading} className="w-full h-11 text-sm font-bold shadow-lg shadow-brand-500/20">
          <LogIn className="w-4 h-4 mr-2" />
          {loading ? 'Signing In...' : 'Sign In to Account'}
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
        Don't have an account?{' '}
        <Link to="/register" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Create Employee Account
        </Link>
      </p>
    </div>
  );
};

