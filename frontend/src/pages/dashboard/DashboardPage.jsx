import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckSquare, 
  Calendar, 
  GitFork, 
  Plus, 
  MoreHorizontal, 
  Check, 
  Clock, 
  Compass, 
  Users, 
  AlertTriangle, 
  LayoutGrid, 
  List, 
  FolderKanban, 
  Paperclip,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';
import { dashboardService } from '../../services/dashboardService';
import { CreateTaskModal } from '../../components/dashboard/CreateTaskModal';
import { CreateProjectModal } from '../../components/dashboard/CreateProjectModal';
import { toast } from 'react-hot-toast';

export const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // View state: 'board' | 'list' | 'timeline' | 'files'
  const [activeView, setActiveView] = useState('board');
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [selectedColumnForNewTask, setSelectedColumnForNewTask] = useState('UPCOMING');

  // Backend data
  const [projects, setProjects] = useState([]);
  const [backendTasks, setBackendTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Default tasks matching user's exact screenshot reference
  const initialScreenshotTasks = [
    // Column: Upcoming
    {
      id: 'task-1',
      title: 'Design landing page',
      column: 'UPCOMING',
      tags: [
        { label: 'Design', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70' },
        { label: 'High', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/70' }
      ],
      assignees: [
        { type: 'image', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' }
      ],
      dueDate: 'Oct 12'
    },
    {
      id: 'task-2',
      title: 'Plan marketing campaign',
      column: 'UPCOMING',
      tags: [
        { label: 'Marketing', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/70' },
        { label: 'Medium', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'HS', bg: 'bg-blue-900' },
        { type: 'avatar', label: 'FT', bg: 'bg-purple-600' }
      ],
      dueDate: 'Oct 14'
    },
    {
      id: 'task-3',
      title: 'Set up analytics',
      column: 'UPCOMING',
      tags: [
        { label: 'DevOps', bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200/70' },
        { label: 'Low', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'VK', bg: 'bg-indigo-600' }
      ],
      dueDate: 'Oct 15'
    },

    // Column: In progress
    {
      id: 'task-4',
      title: 'Build authentication',
      column: 'IN_PROGRESS',
      tags: [
        { label: 'Development', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/70' },
        { label: 'High', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'HS', bg: 'bg-blue-900' },
        { type: 'avatar', label: 'AR', bg: 'bg-violet-600' }
      ],
      dueDate: 'Oct 10'
    },
    {
      id: 'task-5',
      title: 'Integrate payment system',
      column: 'IN_PROGRESS',
      tags: [
        { label: 'Development', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/70' },
        { label: 'Medium', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'VK', bg: 'bg-indigo-600' }
      ],
      dueDate: 'Oct 13'
    },
    {
      id: 'task-6',
      title: 'Create user onboarding',
      column: 'IN_PROGRESS',
      tags: [
        { label: 'Design', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70' },
        { label: 'Medium', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'AR', bg: 'bg-violet-600' },
        { type: 'avatar', label: 'FT', bg: 'bg-purple-600' }
      ],
      dueDate: 'Oct 16'
    },

    // Column: In review
    {
      id: 'task-7',
      title: 'UI/UX improvements',
      column: 'IN_REVIEW',
      tags: [
        { label: 'Design', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70' },
        { label: 'Medium', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'FT', bg: 'bg-purple-600' }
      ],
      dueDate: 'Oct 11'
    },
    {
      id: 'task-8',
      title: 'API documentation',
      column: 'IN_REVIEW',
      tags: [
        { label: 'Documentation', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/70' },
        { label: 'Low', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'HS', bg: 'bg-blue-900' }
      ],
      dueDate: 'Oct 12'
    },

    // Column: Completed
    {
      id: 'task-9',
      title: 'Project setup',
      column: 'COMPLETED',
      tags: [
        { label: 'Setup', bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'HS', bg: 'bg-blue-900' }
      ],
      dueDate: 'Oct 5',
      completed: true
    },
    {
      id: 'task-10',
      title: 'Database schema',
      column: 'COMPLETED',
      tags: [
        { label: 'Development', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'VK', bg: 'bg-indigo-600' }
      ],
      dueDate: 'Oct 6',
      completed: true
    },
    {
      id: 'task-11',
      title: 'Initial wireframes',
      column: 'COMPLETED',
      tags: [
        { label: 'Design', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200/70' }
      ],
      assignees: [
        { type: 'avatar', label: 'AR', bg: 'bg-violet-600' }
      ],
      dueDate: 'Oct 7',
      completed: true
    }
  ];

  const [boardTasks, setBoardTasks] = useState(initialScreenshotTasks);

  // Load backend data if available to keep sync
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, taskRes] = await Promise.all([
          projectService.getAll().catch(() => ({ data: [] })),
          taskService.getAll().catch(() => ({ data: [] }))
        ]);
        const pList = projRes?.data?.content || projRes?.data || [];
        if (Array.isArray(pList)) setProjects(pList);
        const tList = taskRes?.data?.content || taskRes?.data || [];
        if (Array.isArray(tList)) setBackendTasks(tList);
      } catch (err) {
        // silent fallback
      }
    };
    fetchData();
  }, []);

  const handleOpenAddTask = (col) => {
    setSelectedColumnForNewTask(col);
    setCreateTaskOpen(true);
  };

  const handleTaskCreated = (newTask) => {
    // Add dynamically to board
    const formattedTask = {
      id: newTask.publicId || `custom-${Date.now()}`,
      title: newTask.title,
      column: newTask.status === 'COMPLETED' ? 'COMPLETED' : (newTask.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'UPCOMING'),
      tags: [
        { 
          label: newTask.priority || 'Medium', 
          bg: newTask.priority === 'HIGH' ? 'bg-rose-50' : 'bg-amber-50', 
          text: newTask.priority === 'HIGH' ? 'text-rose-700' : 'text-amber-700',
          border: newTask.priority === 'HIGH' ? 'border-rose-200/70' : 'border-amber-200/70'
        }
      ],
      assignees: [
        { type: 'avatar', label: user?.firstName?.[0] || 'HS', bg: 'bg-blue-900' }
      ],
      dueDate: newTask.dueDate ? new Date(newTask.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Next week',
      completed: newTask.status === 'COMPLETED'
    };
    setBoardTasks((prev) => [formattedTask, ...prev]);
    toast.success('Task created successfully');
  };

  const upcomingList = boardTasks.filter((t) => t.column === 'UPCOMING');
  const inProgressList = boardTasks.filter((t) => t.column === 'IN_PROGRESS');
  const inReviewList = boardTasks.filter((t) => t.column === 'IN_REVIEW');
  const completedList = boardTasks.filter((t) => t.column === 'COMPLETED');

  return (
    <div className="space-y-7 animate-fade-in text-slate-800 font-sans pb-10">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP GREETING HEADER                                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>Good morning, team</span>
            <span className="text-xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's what's moving this week.
          </p>
        </div>
        <div className="text-xs font-medium text-slate-400 dark:text-slate-400">
          Wed, Oct 8, 2026
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. KPI / METRIC CARDS ROW                                      */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Active projects */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <FileText className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Active projects</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">08</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
              ↑ 14%
            </span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">vs last week</div>
        </div>

        {/* Card 2: Open tasks */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <CheckSquare className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Open tasks</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">24</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
              ↓ 8%
            </span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">vs last week</div>
        </div>

        {/* Card 3: Due this week */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <Calendar className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Due this week</span>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">06</span>
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 border border-rose-100 dark:border-rose-800">
              ↑ 20%
            </span>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">vs last week</div>
        </div>

        {/* Card 4: Team capacity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-xs transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <GitFork className="w-4 h-4 stroke-[2]" />
            </div>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Team capacity</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">82%</span>
            <div className="flex-1 max-w-[130px] h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '82%' }} />
            </div>
          </div>
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">Good progress</div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. MAIN DASHBOARD SPLIT: KANBAN BOARD + RIGHT SIDEBAR         */}
      {/* ------------------------------------------------------------- */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER: PROJECT BOARD (8 or 9 cols on wide screens) */}
        <div className="xl:col-span-9 space-y-4">
          
          {/* Project Title Bar with View Tabs and Add Task */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-transparent">
            
            {/* Project Title */}
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Product launch
              </h2>
            </div>

            {/* Middle: View Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setActiveView('board')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'board'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Board</span>
              </button>
              
              <button
                onClick={() => setActiveView('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'list'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>List</span>
              </button>

              <button
                onClick={() => setActiveView('timeline')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'timeline'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>

              <button
                onClick={() => setActiveView('files')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                  activeView === 'files'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Paperclip className="w-3.5 h-3.5" />
                <span>Files</span>
              </button>

              <button className="px-2 py-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Right: + Add task Button */}
            <button
              onClick={() => handleOpenAddTask('UPCOMING')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add task</span>
            </button>
          </div>

          {/* 4-Column Kanban Board View */}
          {activeView === 'board' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
              
              {/* ================= COLUMN 1: UPCOMING ================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Upcoming</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-[11px] font-bold text-slate-500 dark:text-slate-300">
                      {upcomingList.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleOpenAddTask('UPCOMING')}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {upcomingList.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-xs transition-all space-y-3.5 group cursor-pointer"
                    >
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${tag.bg} ${tag.text} ${tag.border}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-700/50">
                        {/* Assignee Avatar(s) */}
                        <div className="flex items-center -space-x-1.5">
                          {card.assignees.map((a, i) => (
                            a.type === 'image' ? (
                              <img
                                key={i}
                                src={a.src}
                                alt="Assignee"
                                className="w-6 h-6 rounded-full object-cover ring-2 ring-white dark:ring-slate-800"
                              />
                            ) : (
                              <div
                                key={i}
                                className={`w-6 h-6 rounded-full ${a.bg} text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-slate-800`}
                              >
                                {a.label}
                              </div>
                            )
                          ))}
                        </div>

                        {/* Due Date */}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-400">
                          {card.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= COLUMN 2: IN PROGRESS ================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">In progress</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/60 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                      {inProgressList.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleOpenAddTask('IN_PROGRESS')}
                    className="p-1 rounded-lg text-blue-500 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {inProgressList.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-xs transition-all space-y-3.5 group cursor-pointer"
                    >
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${tag.bg} ${tag.text} ${tag.border}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-700/50">
                        {/* Assignee Avatar(s) */}
                        <div className="flex items-center -space-x-1.5">
                          {card.assignees.map((a, i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-full ${a.bg} text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-slate-800`}
                            >
                              {a.label}
                            </div>
                          ))}
                        </div>

                        {/* Due Date */}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-400">
                          {card.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= COLUMN 3: IN REVIEW ================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-amber-600 dark:text-amber-400">In review</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-50 dark:bg-amber-950/60 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                      {inReviewList.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleOpenAddTask('IN_REVIEW')}
                    className="p-1 rounded-lg text-amber-500 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {inReviewList.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-xs transition-all space-y-3.5 group cursor-pointer"
                    >
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${tag.bg} ${tag.text} ${tag.border}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-700/50">
                        {/* Assignee Avatar */}
                        <div className="flex items-center -space-x-1.5">
                          {card.assignees.map((a, i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-full ${a.bg} text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-slate-800`}
                            >
                              {a.label}
                            </div>
                          ))}
                        </div>

                        {/* Due Date */}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-400">
                          {card.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ================= COLUMN 4: COMPLETED ================= */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">Completed</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {completedList.length}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleOpenAddTask('COMPLETED')}
                    className="p-1 rounded-lg text-emerald-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  {completedList.map((card) => (
                    <div
                      key={card.id}
                      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:border-slate-200 dark:hover:border-slate-600 hover:shadow-xs transition-all space-y-3.5 group cursor-pointer"
                    >
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {card.title}
                      </h4>
                      
                      <div className="flex flex-wrap gap-1.5">
                        {card.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${tag.bg} ${tag.text} ${tag.border}`}
                          >
                            {tag.label}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-50 dark:border-slate-700/50">
                        {/* Assignee Avatar */}
                        <div className="flex items-center -space-x-1.5">
                          {card.assignees.map((a, i) => (
                            <div
                              key={i}
                              className={`w-6 h-6 rounded-full ${a.bg} text-white font-bold text-[9px] flex items-center justify-center ring-2 ring-white dark:ring-slate-800`}
                            >
                              {a.label}
                            </div>
                          ))}
                        </div>

                        {/* Completed Checkmark + Date */}
                        <div className="inline-flex items-center gap-1 text-xs font-normal text-slate-400 dark:text-slate-400">
                          <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[2.5]" />
                          <span>{card.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Alternate List View */
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Deliverable</span>
                <div className="flex items-center gap-12 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <span>Status</span>
                  <span>Due Date</span>
                </div>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {boardTasks.map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${t.column === 'COMPLETED' ? 'bg-emerald-500' : t.column === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-amber-400'}`} />
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{t.title}</span>
                    </div>
                    <div className="flex items-center gap-12 text-xs">
                      <span className="text-slate-500">{t.column.replace('_', ' ')}</span>
                      <span className="text-slate-400">{t.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT SIDEBAR WIDGETS (3 cols on wide screens) */}
        <div className="xl:col-span-3 space-y-5">
          
          {/* --------------------------------------------------------- */}
          {/* WIDGET 1: PROJECT HEALTH                                  */}
          {/* --------------------------------------------------------- */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Project health
              </h3>
              <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Health Progress Bar & Percentage */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: '68%' }} 
                />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                68%
              </span>
            </div>

            {/* Status Heading & Description */}
            <div className="space-y-0.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  On track
                </span>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-400 pl-4">
                The project is progressing well.
              </p>
            </div>

            {/* Metric Checklist */}
            <div className="space-y-2.5 pt-2 border-t border-slate-50 dark:border-slate-700/50">
              
              {/* Timeline */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Timeline</span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  On track
                </span>
              </div>

              {/* Budget */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>Budget</span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  On track
                </span>
              </div>

              {/* Team workload */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Team workload</span>
                </div>
                <span className="font-semibold text-lime-600 dark:text-lime-400">
                  Balanced
                </span>
              </div>

              {/* Risks */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-slate-400" />
                  <span>Risks</span>
                </div>
                <span className="font-semibold text-rose-500 dark:text-rose-400">
                  2 open
                </span>
              </div>

            </div>

          </div>

          {/* --------------------------------------------------------- */}
          {/* WIDGET 2: UPCOMING MILESTONES                             */}
          {/* --------------------------------------------------------- */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/70 p-5 shadow-[0_1px_3px_rgba(0,0,0,0.03)] space-y-4">
            
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Upcoming milestones
              </h3>
              <button 
                onClick={() => navigate('/projects')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </button>
            </div>

            {/* Vertical Timeline */}
            <div className="space-y-4 pt-1">
              
              {/* Milestone 1: Project kickoff (Completed) */}
              <div className="flex items-start gap-3 relative">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700 my-1" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Project kickoff
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                    Completed · Oct 1
                  </p>
                </div>
              </div>

              {/* Milestone 2: Beta release (Active / In progress) */}
              <div className="flex items-start gap-3 relative -mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-blue-600 bg-white dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  </div>
                  <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700 my-1" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Beta release
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    In 5 days · Oct 13
                  </p>
                </div>
              </div>

              {/* Milestone 3: Public launch (Pending) */}
              <div className="flex items-start gap-3 relative -mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shrink-0" />
                  <div className="w-0.5 h-8 bg-slate-200 dark:bg-slate-700 my-1" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Public launch
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                    Oct 28
                  </p>
                </div>
              </div>

              {/* Milestone 4: Post-launch review (Pending) */}
              <div className="flex items-start gap-3 relative -mt-2">
                <div className="flex flex-col items-center">
                  <div className="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shrink-0" />
                </div>
                <div className="pt-0.5">
                  <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Post-launch review
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">
                    Nov 5
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* Task Creation Modal */}
      <CreateTaskModal
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        projects={projects}
        onTaskCreated={handleTaskCreated}
      />

      {/* Project Creation Modal */}
      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onProjectCreated={() => {
          projectService.getAll().then((res) => {
            const list = res?.data?.content || res?.data || [];
            if (Array.isArray(list)) setProjects(list);
          });
        }}
      />

    </div>
  );
};
