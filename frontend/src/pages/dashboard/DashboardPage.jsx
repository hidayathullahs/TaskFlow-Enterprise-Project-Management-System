import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Users,
  Building2,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FolderPlus,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { Skeleton } from '../../components/common/Skeleton';
import { CreateProjectModal } from '../../components/dashboard/CreateProjectModal';
import { CreateTaskModal } from '../../components/dashboard/CreateTaskModal';
import { GlobalSearchModal } from '../../components/dashboard/GlobalSearchModal';
import { toast } from 'react-hot-toast';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Data States
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [projectFilter, setProjectFilter] = useState('ALL'); // ALL | IN_PROGRESS | PLANNING | COMPLETED
  const [projectSearch, setProjectSearch] = useState('');
  const [taskFilter, setTaskFilter] = useState('ALL'); // ALL | IN_PROGRESS | TODO | COMPLETED
  const [taskSearch, setTaskSearch] = useState('');

  // Modal States
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Fetch all live data from backend APIs
  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, projectsRes, tasksRes, actRes] = await Promise.all([
        dashboardService.getStats().catch(() => ({ data: null })),
        projectService.getAll().catch(() => ({ data: { content: [] } })),
        taskService.getAll().catch(() => ({ data: { content: [] } })),
        dashboardService.getActivities().catch(() => ({ data: [] })),
      ]);

      setStats(statsRes?.data || null);
      
      const projsList = projectsRes?.data?.content || projectsRes?.data || [];
      setProjects(Array.isArray(projsList) ? projsList : []);

      const tasksList = tasksRes?.data?.content || tasksRes?.data || [];
      setTasks(Array.isArray(tasksList) ? tasksList : []);

      setActivities(Array.isArray(actRes?.data) ? actRes.data : []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Unable to load enterprise dashboard metrics. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesFilter = projectFilter === 'ALL' || p.status === projectFilter;
      const matchesSearch = 
        !projectSearch ||
        p.name?.toLowerCase().includes(projectSearch.toLowerCase()) ||
        p.code?.toLowerCase().includes(projectSearch.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [projects, projectFilter, projectSearch]);

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      let matchesFilter = true;
      if (taskFilter === 'IN_PROGRESS') matchesFilter = t.status === 'IN_PROGRESS';
      else if (taskFilter === 'TODO') matchesFilter = t.status === 'TODO';
      else if (taskFilter === 'COMPLETED') matchesFilter = t.status === 'COMPLETED';

      const matchesSearch = 
        !taskSearch ||
        t.title?.toLowerCase().includes(taskSearch.toLowerCase()) ||
        t.taskNumber?.toLowerCase().includes(taskSearch.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [tasks, taskFilter, taskSearch]);

  // Tasks due soon (within 7 days)
  const tasksDueSoonCount = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    return tasks.filter((t) => {
      if (!t.dueDate || t.status === 'COMPLETED') return false;
      const d = new Date(t.dueDate);
      return d >= today && d <= nextWeek;
    }).length;
  }, [tasks]);

  // Toggle Task Status (Optimistic Update + API Call)
  const handleToggleTaskStatus = async (task) => {
    const isCompleted = task.status === 'COMPLETED';
    const newStatus = isCompleted ? 'IN_PROGRESS' : 'COMPLETED';

    // Optimistic local update
    setTasks((prev) =>
      prev.map((t) =>
        t.publicId === task.publicId ? { ...t, status: newStatus } : t
      )
    );

    try {
      await taskService.moveStatus(task.publicId, newStatus);
      toast.success(
        newStatus === 'COMPLETED'
          ? `Marked "${task.title}" as completed`
          : `Re-opened "${task.title}" to In Progress`
      );
      // Soft refresh stats in background
      dashboardService.getStats().then((res) => res?.data && setStats(res.data));
    } catch (err) {
      // Revert if failed
      setTasks((prev) =>
        prev.map((t) =>
          t.publicId === task.publicId ? { ...t, status: task.status } : t
        )
      );
      toast.error('Failed to update task status');
    }
  };

  // Helper formatting for status pills
  const getStatusBadge = (status) => {
    switch (status) {
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
            In Progress
          </span>
        );
      case 'PLANNING':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Planning
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
            Completed
          </span>
        );
      case 'TODO':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            To Do
          </span>
        );
      case 'REVIEW':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
            In Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  // Helper formatting for priority pills
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'URGENT':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800">
            Urgent
          </span>
        );
      case 'HIGH':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800">
            High
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
            Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200">
            {priority || 'Low'}
          </span>
        );
    }
  };

  // Helper date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Check if date is overdue
  const isOverdue = (dateStr, status) => {
    if (!dateStr || status === 'COMPLETED') return false;
    return new Date(dateStr) < new Date();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-28 w-full rounded-xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-xl border border-rose-200 dark:border-rose-900 space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto" />
        <h3 className="text-base font-bold text-slate-900 dark:text-white">Failed to Load Dashboard</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">{error}</p>
        <button
          onClick={loadDashboardData}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-800 dark:text-slate-100 font-sans">
      
      {/* ========================================================================= */}
      {/* SECTION C: WELCOME & OVERVIEW SECTION */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/90 dark:border-slate-700/80 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Good day, {user?.firstName || 'Enterprise Leader'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Here is what's happening across your projects and deliverables today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCreateProjectOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
            <button
              onClick={() => setCreateTaskOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-slate-600 transition-all shadow-2xs"
            >
              <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>New Task</span>
            </button>
            <Link
              to="/tasks"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
            >
              <span>View My Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Compact KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700/60">
          
          {/* KPI 1: Active Projects */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active Projects</span>
              <span className="w-2 h-2 rounded-full bg-blue-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats?.activeProjects || 0}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                of {stats?.totalProjects || projects.length} total
              </span>
            </div>
          </div>

          {/* KPI 2: Open Tasks */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Open Tasks</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats?.pendingTasks || tasks.filter(t => t.status !== 'COMPLETED').length}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {tasks.filter(t => t.status === 'IN_PROGRESS').length} in progress
              </span>
            </div>
          </div>

          {/* KPI 3: Due This Week */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Due This Week</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 dark:text-white">
                {tasksDueSoonCount}
              </span>
              <span className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                {stats?.overdueTasks ? `${stats.overdueTasks} overdue` : 'Sprint deliverables'}
              </span>
            </div>
          </div>

          {/* KPI 4: Overall Progress Velocity */}
          <div className="p-3.5 rounded-lg bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Overall Progress</span>
              <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                {stats?.overallCompletionRate ? `${stats.overallCompletionRate}%` : '42.9%'}
              </span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${stats?.overallCompletionRate || 42.9}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 text-right">
                {stats?.completedTasks || tasks.filter(t => t.status === 'COMPLETED').length} of {stats?.totalTasks || tasks.length} tasks completed
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION D: MY PROJECTS (VISUAL CENTERPIECE OF DASHBOARD) */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        {/* Section Header with Tabs & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Active Projects</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {projects.length}
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Tabs */}
            <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => setProjectFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  projectFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setProjectFilter('IN_PROGRESS')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  projectFilter === 'IN_PROGRESS'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setProjectFilter('PLANNING')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  projectFilter === 'PLANNING'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Planning
              </button>
              <button
                onClick={() => setProjectFilter('COMPLETED')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  projectFilter === 'COMPLETED'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Completed
              </button>
            </div>

            {/* Project Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Filter projects..."
                className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => setCreateProjectOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="p-10 text-center bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 space-y-2">
            <FolderKanban className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Projects Found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {projectSearch ? 'No projects match your filter query.' : 'Get started by creating your first enterprise project.'}
            </p>
            {projectSearch ? (
              <button
                onClick={() => { setProjectSearch(''); setProjectFilter('ALL'); }}
                className="mt-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Clear Search Filter
              </button>
            ) : (
              <button
                onClick={() => setCreateProjectOpen(true)}
                className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-xs hover:bg-indigo-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProjects.map((project) => {
              // Calculate progress %
              const projectTasks = tasks.filter(t => t.projectPublicId === project.publicId || t.projectCode === project.code);
              const completedTasksCount = projectTasks.filter(t => t.status === 'COMPLETED').length;
              const progressPct = projectTasks.length > 0 
                ? Math.round((completedTasksCount / projectTasks.length) * 100) 
                : (project.status === 'COMPLETED' ? 100 : 25);

              return (
                <div
                  key={project.publicId}
                  onClick={() => navigate(`/projects/${project.publicId}`)}
                  className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/90 dark:border-slate-700/80 p-5 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between group space-y-4"
                >
                  <div className="space-y-2">
                    {/* Top Row: Code, Status, Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-slate-400 dark:text-slate-500">
                        {project.code}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {getStatusBadge(project.status)}
                        {getPriorityBadge(project.priority)}
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center justify-between">
                        <span>{project.name}</span>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                        {project.description || 'Enterprise project delivery roadmap.'}
                      </p>
                    </div>
                  </div>

                  {/* Bottom: Progress Bar & Metadata */}
                  <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                    <div>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-slate-500 font-medium text-[11px]">Sprint Progress</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                          {progressPct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className={isOverdue(project.deadline, project.status) ? 'text-rose-600 font-semibold' : ''}>
                          Due {formatDate(project.deadline)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {project.budget > 0 && (
                          <span className="font-medium text-slate-600 dark:text-slate-300">
                            ${Number(project.budget).toLocaleString()}
                          </span>
                        )}
                        <span className="text-slate-400">·</span>
                        <span className="font-medium">
                          {projectTasks.length} {projectTasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION E: MY TASKS & UPCOMING WORK (LINEAR / ASANA STYLE) */}
      {/* ========================================================================= */}
      <section className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/90 dark:border-slate-700/80 shadow-xs overflow-hidden">
        {/* Section Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/80 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>My Tasks & Upcoming Work</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                {tasks.length}
              </span>
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Tabs */}
            <div className="flex p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium border border-slate-200/80 dark:border-slate-700">
              <button
                onClick={() => setTaskFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  taskFilter === 'ALL'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                All ({tasks.length})
              </button>
              <button
                onClick={() => setTaskFilter('IN_PROGRESS')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  taskFilter === 'IN_PROGRESS'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                In Progress ({tasks.filter(t => t.status === 'IN_PROGRESS').length})
              </button>
              <button
                onClick={() => setTaskFilter('TODO')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  taskFilter === 'TODO'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                To Do ({tasks.filter(t => t.status === 'TODO').length})
              </button>
              <button
                onClick={() => setTaskFilter('COMPLETED')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  taskFilter === 'COMPLETED'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                Completed ({tasks.filter(t => t.status === 'COMPLETED').length})
              </button>
            </div>

            {/* Task Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                placeholder="Filter tasks..."
                className="pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              onClick={() => setCreateTaskOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
            </button>
          </div>
        </div>

        {/* Task Rows List */}
        {filteredTasks.length === 0 ? (
          <div className="p-10 text-center space-y-2">
            <CheckSquare className="w-8 h-8 text-slate-400 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No Tasks Match Filter</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {taskSearch ? 'Try a different search term or clear the filter.' : 'No tasks assigned in this category.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'COMPLETED';
              const overdue = isOverdue(task.dueDate, task.status);

              return (
                <div
                  key={task.publicId}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 sm:px-5 hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors gap-3 ${
                    isDone ? 'opacity-65' : ''
                  }`}
                >
                  {/* Left: Checkbox, Code & Title */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Interactive Completion Toggle */}
                    <button
                      onClick={() => handleToggleTaskStatus(task)}
                      className={`h-4.5 w-4.5 rounded border flex items-center justify-center shrink-0 transition-all ${
                        isDone
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-700'
                      }`}
                      title={isDone ? 'Mark as In Progress' : 'Mark as Completed'}
                    >
                      {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </button>

                    <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 shrink-0">
                      {task.taskNumber || 'TASK'}
                    </span>

                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/tasks/${task.publicId}`}
                        className={`text-xs sm:text-sm font-medium hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate block ${
                          isDone ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {task.title}
                      </Link>
                      {task.projectName && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                          <FolderKanban className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{task.projectName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Priority, Due Date, Status */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="flex items-center gap-2">
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs min-w-[100px] justify-end">
                      <Clock className={`w-3.5 h-3.5 ${overdue ? 'text-rose-500' : 'text-slate-400'}`} />
                      <span className={`text-[11px] font-medium ${overdue ? 'text-rose-600 font-semibold' : 'text-slate-500 dark:text-slate-400'}`}>
                        {formatDate(task.dueDate)}
                      </span>
                    </div>

                    {/* Assignee Avatar */}
                    <div 
                      className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[10px] font-bold text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0"
                      title={task.assigneeName || 'Unassigned'}
                    >
                      {task.assigneeName?.[0] || 'A'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* SECTION F: RECENT ACTIVITY & PROJECT HEALTH (SECONDARY) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recent Activity Feed */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Team Activity</h3>
              </div>
              <span className="text-[11px] font-medium text-slate-400">Live Audit Log</span>
            </div>

            <div className="space-y-3 mt-4">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No activity events recorded yet. All services operational.
                </div>
              ) : (
                activities.slice(0, 5).map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs">
                    <div className="h-6 w-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {act.performedBy ? String(act.performedBy)[0] : 'S'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-800 dark:text-slate-200 font-medium">
                        <span className="font-semibold">{act.action?.replace(/_/g, ' ')}</span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {act.details || `Audit event on ${act.entityType || 'entity'}`}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Spring Boot 3 REST API & MySQL 8.0</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Real-Time Telemetry
            </span>
          </div>
        </div>

        {/* Right: Upcoming Deadlines & Sprints */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/90 dark:border-slate-700/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Upcoming Milestones</h3>
              </div>
              <Link to="/tasks/kanban" className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700">
                Kanban View →
              </Link>
            </div>

            <div className="space-y-3 mt-4">
              {projects.slice(0, 4).map((p) => (
                <div key={p.publicId} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700/60">
                  <div className="min-w-0 pr-2">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Target: {formatDate(p.deadline)}
                    </p>
                  </div>
                  {getStatusBadge(p.status)}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>SOC2 Type II Compliant Governance</span>
            <span className="text-indigo-600 font-semibold">Method-Level RBAC</span>
          </div>
        </div>

      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE MODALS */}
      {/* ========================================================================= */}
      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onProjectCreated={() => loadDashboardData()}
      />

      <CreateTaskModal
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        projects={projects}
        onTaskCreated={() => loadDashboardData()}
      />

      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        projects={projects}
        tasks={tasks}
      />

    </div>
  );
};
