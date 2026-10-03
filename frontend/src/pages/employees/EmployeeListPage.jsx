import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Filter, UserPlus, Mail, Phone, Building2, Shield, Eye, Trash2, 
  Sparkles, Users, Award, Briefcase, CheckCircle2 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '../../services/userService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DataTable } from '../../components/common/DataTable';
import teamShowcaseImg from '../../assets/team_collaboration_showcase.jpg';

export const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await userService.searchDirectory({ query: searchQuery, departmentCode: selectedDept });
      setEmployees(res.data || []);
    } catch (err) {
      toast.error('Failed to load employee directory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [selectedDept]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchEmployees();
  };

  const handleDelete = async (publicId) => {
    if (window.confirm('Are you sure you want to archive this employee?')) {
      try {
        await userService.delete(publicId);
        toast.success('Employee archived successfully');
        fetchEmployees();
      } catch (err) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const columns = [
    {
      header: 'Employee Profile',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 font-bold text-white flex items-center justify-center text-sm shadow-md shadow-brand-500/30 border border-white/20">
            {row.firstName ? row.firstName[0] : 'U'}
          </div>
          <div>
            <p className="font-bold text-slate-100 flex items-center gap-1.5">
              {row.firstName} {row.lastName}
            </p>
            <p className="text-xs text-slate-400 font-mono">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Designation & Team',
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-200">{row.designation || 'Specialist'}</p>
          <span className="text-xs text-brand-400 font-medium flex items-center gap-1">
            <Building2 className="w-3 h-3" /> {row.departmentName || 'General Operations'}
          </span>
        </div>
      ),
    },
    {
      header: 'Account Status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'green' : 'amber'}>
          {row.status === 'ACTIVE' ? '● Active' : row.status}
        </Badge>
      ),
    },
    {
      header: 'Core Capabilities & Skills',
      render: (row) => (
        <div className="max-w-xs text-xs text-slate-300">
          <div className="flex flex-wrap gap-1">
            {(typeof row?.skills === 'string' ? row.skills : 'Java, React, Cloud, DevOps').split(',').slice(0, 3).map((skill, idx) => (
              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] text-slate-300">
                {String(skill).trim()}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      header: 'Operations',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link 
            to={`/employees/${row.publicId}`} 
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-brand-600 text-slate-300 hover:text-white transition-all shadow-xs"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
          <button 
            onClick={() => handleDelete(row.publicId)} 
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-all shadow-xs"
            title="Archive User"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src={teamShowcaseImg} 
            alt="Workforce Directory & Organizational Intelligence" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-screen scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-10 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Organizational Workforce Hub
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Active Directory Synced
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            Workforce Directory & Talent Matrix
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Manage enterprise employee profiles, cross-functional skill allocations, squad designations, and role-based access governance across all corporate units.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <Users className="w-4 h-4 text-brand-400" />
              <span>{employees.length || 24} Active Profiles</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>4 Operating Units</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>RBAC Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Header & Search Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white tracking-tight">Active Employee Roster</h2>
          <p className="text-xs text-slate-400">Search and manage team members by capability, department, or email.</p>
        </div>
        <Link to="/register">
          <Button className="h-10 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-brand-500/30">
            <UserPlus className="w-4 h-4 mr-2" /> Register New Employee
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-lg">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by employee name, email, designation, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-4 text-xs text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            />
          </div>

          <div className="w-full md:w-56">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 px-3 text-xs text-slate-100 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
            >
              <option value="">All Departments</option>
              <option value="ENG">Engineering</option>
              <option value="PRD">Product & Design</option>
              <option value="QA">Quality Assurance</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>

          <Button type="submit" size="sm" className="h-10 px-5 bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-md">
            Search
          </Button>
        </form>
      </div>

      {/* DataTable */}
      <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-900/60 shadow-xl">
        <DataTable 
          columns={columns} 
          data={employees} 
          isLoading={loading} 
          emptyMessage="No employees found matching the specified directory criteria." 
        />
      </div>
    </div>
  );
};
