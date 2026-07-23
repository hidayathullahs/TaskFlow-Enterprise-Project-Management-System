import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.resetPassword({ token, newPassword });
      toast.success('Password reset completed! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Set New Password</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter your 6-digit OTP code and your new password.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="6-Digit OTP / Token"
          icon={KeyRound}
          placeholder="123456"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />

        <Input
          label="New Secure Password"
          type="password"
          icon={Lock}
          placeholder="NewPassword123!"
          helperText="Minimum 12 characters with upper, lower, digit, symbol"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />

        <Button type="submit" isLoading={loading} className="w-full">
          <CheckCircle2 className="w-4 h-4 mr-2" /> Reset Password & Sign In
        </Button>
      </form>
    </div>
  );
};
