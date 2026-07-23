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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Interactive Agile Kanban Board
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time status transitions, column limits, and task card velocity metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-slate-100"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.publicId} value={p.publicId}>[{p.code}] {p.name}</option>
              ))}
            </select>
          </div>
          <Button size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Create Task
          </Button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const tasks = boardData[col.id] || [];
          return (
            <div key={col.id} className="flex flex-col rounded-2xl bg-slate-100/70 dark:bg-slate-800/40 p-4 border border-slate-200/60 dark:border-slate-700/60 min-h-[500px]">
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${col.color}`} />
                  <h3 className="text-xs font-extrabold uppercase text-slate-800 dark:text-slate-200 tracking-wider">
                    {col.label}
                  </h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {tasks.length}
                </span>
              </div>

              {/* Task Cards Stack */}
              <div className="space-y-3 flex-1">
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                    No tasks in {col.label}
                  </div>
                ) : (
                  tasks.map((task) => (
                    <Card key={task.publicId} className="p-3.5 hover:shadow-md transition-all space-y-3 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-brand-600">[{task.taskNumber}]</span>
                        <Badge variant={task.priority === 'HIGH' || task.priority === 'URGENT' ? 'red' : 'blue'}>
                          {task.priority}
                        </Badge>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-2">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {task.assigneeName || 'Unassigned'}
                        </span>

                        {/* Move Dropdown Action */}
                        <select
                          value={task.status}
                          onChange={(e) => handleMoveTask(task.publicId, e.target.value)}
                          className="text-[10px] rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-1 py-0.5 text-slate-700 dark:text-slate-300"
                        >
                          <option value="TODO">To Do</option>
                          <option value="IN_PROGRESS">In Progress</option>
                          <option value="CODE_REVIEW">Code Review</option>
                          <option value="COMPLETED">Completed</option>
                        </select>
                      </div>
                    </Card>
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
