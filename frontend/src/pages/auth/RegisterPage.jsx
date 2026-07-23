import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { User, Mail, Lock, Phone, Briefcase, UserPlus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authService.register(data);
      toast.success('Registration successful! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Create Employee Account</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Join TaskFlow Enterprise management system.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            {...register('firstName', { required: 'First name required' })}
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            {...register('lastName', { required: 'Last name required' })}
          />
        </div>

        <Input
          label="Corporate Email"
          type="email"
          icon={Mail}
          placeholder="john.doe@company.com"
          error={errors.email?.message}
          {...register('email', { required: 'Email required' })}
        />

        <Input
          label="Secure Password"
          type="password"
          icon={Lock}
          placeholder="Password@123!"
          helperText="Must be 12+ chars with upper, lower, number & symbol"
          error={errors.password?.message}
          {...register('password', { required: 'Password required' })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Phone"
            icon={Phone}
            placeholder="+1-555-0199"
            {...register('phone')}
          />
          <Input
            label="Designation"
            icon={Briefcase}
            placeholder="Senior Developer"
            {...register('designation')}
          />
        </div>

        <Button type="submit" isLoading={loading} className="w-full">
          <UserPlus className="w-4 h-4 mr-2" /> Complete Registration
        </Button>
      </form>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400">
        Already registered?{' '}
        <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};
