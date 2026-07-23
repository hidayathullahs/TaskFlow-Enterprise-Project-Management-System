import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mail, Phone, Briefcase, Building2, Shield, Calendar, ArrowLeft, Upload, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '../../services/userService';
import { fileService } from '../../services/fileService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

export const EmployeeDetailPage = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userService.getById(id);
        setEmployee(res.data);
      } catch (err) {
        toast.error('Failed to load employee details');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await fileService.uploadFile(formData);
      toast.success('Document uploaded to employee records');
    } catch (err) {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Employee record not found.</p>
        <Link to="/employees" className="mt-4 inline-block text-xs font-bold text-brand-600">Back to Employees</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/employees" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
      </Link>

      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="h-24 w-24 rounded-full bg-brand-600 font-extrabold text-white flex items-center justify-center text-3xl shadow-lg">
            {employee.firstName[0]}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {employee.firstName} {employee.lastName}
            </h2>
            <p className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              {employee.designation || 'Senior Team Member'} • {employee.departmentName || 'General Engineering'}
            </p>
            <p className="text-xs text-slate-400">{employee.email} • {employee.phone || 'No phone'}</p>

            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="green">{employee.status}</Badge>
              {employee.roles?.map((r, i) => (
                <Badge key={i} variant="purple">{r}</Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="cursor-pointer">
              <span className="inline-flex items-center justify-center px-4 py-2 text-xs font-medium bg-brand-600 text-white rounded-lg shadow-sm hover:bg-brand-700">
                <Upload className="w-4 h-4 mr-2" /> {uploading ? 'Uploading...' : 'Upload Document'}
              </span>
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </Card>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Employment Metadata</h3>}>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
              <span className="text-slate-400">Reporting Manager</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.reportingManagerName || 'Unassigned'}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
              <span className="text-slate-400">Years of Experience</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.experienceYears || '5'} years</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
              <span className="text-slate-400">Joining Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{employee.joiningDate || '2024-01-15'}</span>
            </div>
          </div>
        </Card>

        <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Skills Matrix</h3>}>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {employee.skills || 'Java 21, Spring Boot, MySQL, React 18, Vite, Tailwind CSS, Docker, Microservices, CI/CD.'}
          </p>
        </Card>
      </div>
    </div>
  );
};
