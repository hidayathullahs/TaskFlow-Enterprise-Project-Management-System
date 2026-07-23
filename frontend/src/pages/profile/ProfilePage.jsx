import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Mail, Phone, Briefcase, Shield, Save } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authService } from '../../services/authService';
import { Card } from '../../components/common/Card';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    designation: user?.designation || '',
    skills: user?.skills || '',
    bio: user?.bio || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.updateProfile(formData);
      updateUserProfile(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Profile</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage your employee profile details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Avatar Card */}
        <Card className="text-center p-6 space-y-4">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-brand-600 font-extrabold text-white text-3xl shadow-lg">
            {user?.firstName?.[0] || 'U'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user?.designation || 'Team Member'}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 pt-2">
            {user?.roles?.map((role, idx) => (
              <Badge key={idx} variant="blue">{role}</Badge>
            ))}
          </div>
        </Card>

        {/* Right Form Card */}
        <Card className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="Email Address (Read Only)"
              type="email"
              icon={Mail}
              value={user?.email || ''}
              disabled
              readOnly
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                name="phone"
                icon={Phone}
                value={formData.phone}
                onChange={handleChange}
              />
              <Input
                label="Designation"
                name="designation"
                icon={Briefcase}
                value={formData.designation}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Technical Skills
              </label>
              <textarea
                name="skills"
                rows={2}
                value={formData.skills}
                onChange={handleChange}
                placeholder="Java 21, Spring Boot, React, Tailwind CSS..."
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm p-3 focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <Button type="submit" isLoading={loading}>
              <Save className="w-4 h-4 mr-2" /> Save Profile Changes
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
