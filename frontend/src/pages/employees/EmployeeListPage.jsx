import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, UserPlus, Mail, Phone, Building2, Shield, Eye, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { userService } from '../../services/userService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { DataTable } from '../../components/common/DataTable';

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
        toast.success('Employee archived');
        fetchEmployees();
      } catch (err) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const columns = [
    {
      header: 'Employee Name',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-brand-600 font-bold text-white flex items-center justify-center text-sm shadow-sm">
            {row.firstName[0]}
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-slate-100">{row.firstName} {row.lastName}</p>
            <p className="text-xs text-slate-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Designation & Department',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-200">{row.designation || 'Staff'}</p>
          <span className="text-xs text-brand-600 font-semibold">{row.departmentName || 'General'}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'ACTIVE' ? 'green' : 'amber'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Technical Skills',
      render: (row) => (
        <div className="max-w-xs truncate text-xs text-slate-500 dark:text-slate-400">
          {row.skills || 'No skills listed'}
        </div>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/employees/${row.publicId}`} className="p-1 text-slate-400 hover:text-brand-600">
            <Eye className="w-4 h-4" />
          </Link>
          <button onClick={() => handleDelete(row.publicId)} className="p-1 text-slate-400 hover:text-rose-600">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Employee Directory & HR Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage organizational workforce, skill matrices, designations, and reporting hierarchies.
          </p>
        </div>
        <Link to="/register">
          <Button size="sm">
            <UserPlus className="w-4 h-4 mr-2" /> Register New Employee
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by employee name, email, designation, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-slate-100"
            >
              <option value="">All Departments</option>
              <option value="ENG">Engineering</option>
              <option value="PRD">Product & Design</option>
              <option value="QA">Quality Assurance</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>

          <Button type="submit" size="sm">Search</Button>
        </form>
      </Card>

      {/* DataTable */}
      <DataTable columns={columns} data={employees} isLoading={loading} emptyMessage="No employees found in organization directory." />
    </div>
  );
};
