import React, { useEffect, useState } from 'react';
import { Building2, Users, ChevronRight, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '../../services/userService';
import { Card } from '../../components/common/Card';
import { Skeleton } from '../../components/common/Skeleton';

export const OrgChartPage = () => {
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrg = async () => {
      try {
        const res = await userService.getOrganizationHierarchy();
        setHierarchy(res.data);
      } catch (err) {
        toast.error('Failed to load organization hierarchy');
      } finally {
        setLoading(false);
      }
    };
    fetchOrg();
  }, []);

  if (loading) {
    return <Skeleton className="h-96 w-full" />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          Organization Hierarchy Chart
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Dynamic multi-level organization structure (Company → Departments → Teams → Employees).
        </p>
      </div>

      {/* Root Node: Company */}
      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-brand-600 text-white font-extrabold text-lg shadow-lg flex items-center gap-3">
          <Building2 className="w-6 h-6" /> {hierarchy?.companyName || 'TaskFlow Enterprise Inc.'}
        </div>

        {/* Level 2: Departments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
          {hierarchy?.departments?.map((dept, idx) => (
            <Card key={idx} className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{dept.departmentName}</h3>
                <span className="text-xs font-bold text-brand-600">[{dept.code}]</span>
              </div>
              <p className="text-xs text-slate-400">Head: <span className="font-bold text-slate-700 dark:text-slate-200">{dept.manager}</span></p>

              {/* Employees List */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">Department Members ({dept.employees?.length || 0})</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {dept.employees?.map((emp) => (
                    <div key={emp.publicId} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <User className="w-3.5 h-3.5 text-brand-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{emp.firstName} {emp.lastName}</span>
                      <span className="text-[10px] text-slate-400 ml-auto">{emp.designation || 'Staff'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
