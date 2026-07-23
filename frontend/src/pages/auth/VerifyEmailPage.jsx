import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.verifyEmail(token);
      toast.success('Email address verified successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Verify Your Email Address</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Enter your verification code sent to your email.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Verification Code / Token"
          icon={ShieldCheck}
          placeholder="Enter code"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
        />

        <Button type="submit" isLoading={loading} className="w-full">
          Verify Email & Activate Account
        </Button>
      </form>
    </div>
  );
};
