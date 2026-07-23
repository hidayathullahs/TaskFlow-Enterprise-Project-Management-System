import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Password reset instructions & OTP code sent!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Reset Your Password</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter your email address and we'll send you an OTP reset code.</p>
      </div>

      {sent ? (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 space-y-3">
          <p className="font-semibold">OTP Code Dispatched!</p>
          <p>We've sent a 6-digit OTP code to <b>{email}</b>. Use it on the reset password screen.</p>
          <Link to="/reset-password" className="inline-block font-bold text-brand-600 dark:text-brand-400 hover:underline">
            Proceed to Reset Password →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Corporate Email Address"
            type="email"
            icon={Mail}
            placeholder="user@taskflow.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" isLoading={loading} className="w-full">
            <Send className="w-4 h-4 mr-2" /> Send Reset OTP Code
          </Button>
        </form>
      )}

      <p className="text-center text-xs">
        <Link to="/login" className="inline-flex items-center font-bold text-slate-600 dark:text-slate-400 hover:underline">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Sign In
        </Link>
      </p>
    </div>
  );
};
