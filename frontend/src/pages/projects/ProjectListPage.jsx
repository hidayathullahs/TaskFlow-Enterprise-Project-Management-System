import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Plus, Search, Calendar, DollarSign, Users, Eye, Trash2, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { projectService } from '../../services/projectService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Skeleton } from '../../components/common/Skeleton';

export const ProjectListPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    startDate: '2026-08-01',
    deadline: '2026-12-31',
    priority: 'MEDIUM',
    status: 'PLANNING',
    budget: '50000',
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await projectService.search({ query: searchQuery, status: selectedStatus });
      setProjects(res.data || []);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await projectService.create(formData);
      toast.success('Project created successfully!');
      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleDelete = async (publicId) => {
    if (window.confirm('Soft-delete this project?')) {
      try {
        await projectService.delete(publicId);
        toast.success('Project deleted');
        fetchProjects();
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-56 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
            Enterprise Portfolio Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Active Enterprise Projects
          </h1>
          <p className="text-xs text-slate-400">
            Track multi-tenant software initiatives, delivery milestones, team capacities, and budget allocations.
          </p>
        </div>
        <Button size="sm" onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold shadow-lg shadow-brand-500/25">
          <Plus className="w-4 h-4 mr-2" /> + Initialize Project
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by project name, public code, or milestone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="w-full md:w-52">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Status Portfolios</option>
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          <Button type="submit" size="sm" className="bg-brand-600 hover:bg-brand-500 text-white font-bold">
            Search Portfolio
          </Button>
        </form>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((proj) => (
          <div key={proj.publicId} className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl hover:scale-[1.02] group relative overflow-hidden">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-400 font-mono tracking-wider">
                  [{proj.code}]
                </span>
                <h3 className="text-base font-black text-white group-hover:text-brand-300 transition-colors line-clamp-1">
                  {proj.name}
                </h3>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                proj.status === 'COMPLETED' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : proj.status === 'IN_PROGRESS' 
                  ? 'bg-brand-500/10 text-brand-300 border-brand-500/30' 
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                {proj.status}
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {proj.description || 'Enterprise software modernization initiative with high-frequency sprint cycles.'}
            </p>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-400">Milestone Progress</span>
                <span className="text-brand-400 font-extrabold">{proj.progressPercentage}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-brand-600 to-indigo-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${proj.progressPercentage}%` }} 
                />
              </div>
            </div>

            {/* Project Footer Meta */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-800 text-slate-400">
              <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                <Calendar className="w-3.5 h-3.5 text-slate-500" /> {proj.deadline || 'Q4 2026 Target'}
              </span>
              <div className="flex items-center gap-2">
                <Link to={`/projects/${proj.publicId}`} className="p-1 text-brand-400 hover:text-brand-300 flex items-center gap-1 font-bold">
                  <Eye className="w-4 h-4" /> View Details
                </Link>
                <button onClick={() => handleDelete(proj.publicId)} className="p-1 text-slate-500 hover:text-rose-400 transition-colors" title="Delete Project">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Initialize New Project">
        <form onSubmit={handleCreateSubmit} className="space-y-3.5">
          <Input
            label="Project Name"
            placeholder="TaskFlow NextGen Modernization"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Project Code"
            placeholder="TF-NG-001"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            required
          />
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
          </div>
          <Input
            label="Budget ($)"
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          />
          <Button type="submit" className="w-full">Create Project Portfolio Item</Button>
        </form>
      </Modal>
    </div>
  );
};
