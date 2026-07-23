import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FolderKanban, Calendar, DollarSign, Users, CheckSquare, ArrowLeft, Plus, Award, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { projectService } from '../../services/projectService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';

export const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);

  const [milestoneTitle, setMilestoneTitle] = useState('');
  const [milestoneDate, setMilestoneDate] = useState('2026-09-01');

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [projRes, msRes, analyticsRes] = await Promise.all([
          projectService.getById(id),
          projectService.getMilestones(id),
          projectService.getAnalytics(id),
        ]);
        setProject(projRes.data);
        setMilestones(msRes.data || []);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        toast.error('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await projectService.createMilestone(id, { title: milestoneTitle, dueDate: milestoneDate });
      toast.success('Milestone created!');
      setMilestones([...milestones, res.data]);
      setIsMilestoneModalOpen(false);
    } catch (err) {
      toast.error('Failed to create milestone');
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

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Project record not found.</p>
        <Link to="/projects" className="mt-4 inline-block text-xs font-bold text-brand-600">Back to Portfolio</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/projects" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects Portfolio
      </Link>

      {/* Header Banner */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-brand-600 uppercase">[{project.code}]</span>
              <Badge variant="blue">{project.status}</Badge>
              <Badge variant="purple">Priority: {project.priority}</Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
              {project.name}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              PM: <span className="font-bold text-slate-800 dark:text-slate-200">{project.managerName}</span> • Dept: <span className="font-semibold text-brand-600">{project.departmentName || 'General'}</span>
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Budget</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">${project.budget || '0'}</span>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 text-xs font-bold">
        {['overview', 'milestones', 'analytics'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 uppercase tracking-wider transition-colors ${
              activeTab === tab
                ? 'border-b-2 border-brand-600 text-brand-600 dark:text-brand-400'
                : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 space-y-4" header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Project Executive Summary</h3>}>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {project.description || 'Enterprise project modernization initiative.'}
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs">
              <div>
                <span className="text-slate-400 block">Start Date</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{project.startDate || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Target Deadline</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{project.deadline || 'N/A'}</span>
              </div>
            </div>
          </Card>

          <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Health Indicator</h3>}>
            <div className="text-center py-4 space-y-2">
              <span className="inline-block p-3 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 font-extrabold text-lg">
                HEALTHY
              </span>
              <p className="text-xs text-slate-400">On schedule for target release date.</p>
            </div>
          </Card>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <Card
          header={
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Project Milestones & Roadmaps</h3>
              <Button size="sm" onClick={() => setIsMilestoneModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add Milestone
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            {milestones.map((ms, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50/60 dark:bg-slate-800/40">
                <div className="flex items-center gap-3">
                  <Award className={`w-5 h-5 ${ms.completed ? 'text-emerald-500' : 'text-slate-400'}`} />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{ms.title}</h4>
                    <p className="text-[11px] text-slate-400">Due Date: {ms.dueDate}</p>
                  </div>
                </div>
                <Badge variant={ms.completed ? 'green' : 'amber'}>{ms.completed ? 'COMPLETED' : 'PENDING'}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Project Velocity & Cost Analytics</h3>}>
          <div className="grid grid-cols-3 gap-4 text-center py-4">
            <div>
              <span className="text-2xl font-black text-brand-600">{analytics?.totalTasks || 0}</span>
              <p className="text-xs text-slate-400">Total Tasks</p>
            </div>
            <div>
              <span className="text-2xl font-black text-emerald-600">{analytics?.completionPercentage || 0}%</span>
              <p className="text-xs text-slate-400">Completion Velocity</p>
            </div>
            <div>
              <span className="text-2xl font-black text-purple-600">${analytics?.totalBudget || 0}</span>
              <p className="text-xs text-slate-400">Allocated Budget</p>
            </div>
          </div>
        </Card>
      )}

      {/* Create Milestone Modal */}
      <Modal isOpen={isMilestoneModalOpen} onClose={() => setIsMilestoneModalOpen(false)} title="Add Milestone Target">
        <form onSubmit={handleMilestoneSubmit} className="space-y-4">
          <Input
            label="Milestone Title"
            placeholder="Complete Backend REST APIs"
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
            required
          />
          <Input
            label="Due Date"
            type="date"
            value={milestoneDate}
            onChange={(e) => setMilestoneDate(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">Create Milestone</Button>
        </form>
      </Modal>
    </div>
  );
};
