import React, { useEffect, useState } from 'react';
import { Plus, CheckSquare, Clock, ArrowRight, MessageSquare, User, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { taskService } from '../../services/taskService';
import { projectService } from '../../services/projectService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Skeleton } from '../../components/common/Skeleton';

const KANBAN_COLUMNS = [
  { id: 'TODO', label: 'To Do', color: 'bg-slate-500' },
  { id: 'IN_PROGRESS', label: 'In Progress', color: 'bg-brand-500' },
  { id: 'CODE_REVIEW', label: 'Code Review', color: 'bg-purple-500' },
  { id: 'COMPLETED', label: 'Completed', color: 'bg-emerald-500' },
];

export const KanbanBoardPage = () => {
  const [boardData, setBoardData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProject, setNewTaskProject] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');

  const fetchKanban = async () => {
    try {
      const res = await taskService.getKanbanBoard(selectedProject);
      setBoardData(res.data?.columns || {});
    } catch (err) {
      toast.error('Failed to load Kanban board');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        const projRes = await projectService.getAll();
        setProjects(projRes.data || []);
        if (projRes.data?.length > 0) {
          setNewTaskProject(projRes.data[0].publicId);
        }
      } catch (err) {
        console.error(err);
      }
      fetchKanban();
    };
    initData();
  }, []);

  useEffect(() => {
    fetchKanban();
  }, [selectedProject]);

  const handleMoveTask = async (taskPublicId, newStatus) => {
    try {
      await taskService.moveStatus(taskPublicId, newStatus);
      toast.success(`Task moved to ${newStatus}`);
      fetchKanban();
    } catch (err) {
      toast.error('Failed to move task');
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await taskService.create({
        title: newTaskTitle,
        projectPublicId: newTaskProject,
        priority: newTaskPriority,
        status: 'TODO',
      });
      toast.success('Task created successfully!');
      setIsModalOpen(false);
      setNewTaskTitle('');
      fetchKanban();
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-96 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
            Active Sprint #26 Board
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Agile Kanban Velocity Board
          </h1>
          <p className="text-xs text-slate-400">
            Drag, track, and transition enterprise task cards across high-velocity sprint stages.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-52">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">All Active Portfolios</option>
              {projects.map((p) => (
                <option key={p.publicId} value={p.publicId}>[{p.code}] {p.name}</option>
              ))}
            </select>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-brand-600 to-indigo-600 text-white font-bold shadow-md shadow-brand-500/25">
            <Plus className="w-4 h-4 mr-1.5" /> + New Task
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const tasks = boardData[col.id] || [];
          return (
            <div key={col.id} className="flex flex-col rounded-3xl bg-slate-900/70 p-4 border border-slate-800 min-h-[550px] shadow-lg">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${col.color} shadow-sm`} />
                  <h3 className="text-xs font-black uppercase text-white tracking-wider">
                    {col.label}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                  {tasks.length}
                </span>
              </div>

              {/* Task Cards Stack */}
              <div className="space-y-3 flex-1">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl bg-slate-950/40">
                    No tasks in {col.label}
                  </div>
                ) : (
                  tasks.map((task) => (
                    <div 
                      key={task.publicId} 
                      className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 cursor-pointer shadow-md hover:scale-[1.02] group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-400 font-mono">[{task.taskNumber}]</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          task.priority === 'HIGH' || task.priority === 'URGENT'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                            : 'bg-brand-500/10 text-brand-300 border-brand-500/30'
                        }`}>
                          {task.priority}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white group-hover:text-brand-300 line-clamp-2 transition-colors">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2.5 border-t border-slate-800/80">
                        <span className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-500" /> {task.assigneeName || 'Unassigned'}
                        </span>

                        {/* Move Dropdown Action */}
                        <select
                          value={task.status}
                          onChange={(e) => handleMoveTask(task.publicId, e.target.value)}
                          className="text-[10px] rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-slate-300 focus:outline-none focus:ring-1 focus:ring-brand-500"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="CODE_REVIEW">Review</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Task Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <Input
            label="Task Title"
            placeholder="Implement JWT Refresh Interceptor"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Project</label>
            <select
              value={newTaskProject}
              onChange={(e) => setNewTaskProject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100"
              required
            >
              {projects.map((p) => (
                <option key={p.publicId} value={p.publicId}>[{p.code}] {p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Priority</label>
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-slate-100"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <Button type="submit" className="w-full">Create Task & Add to Board</Button>
        </form>
      </Modal>
    </div>
  );
};
