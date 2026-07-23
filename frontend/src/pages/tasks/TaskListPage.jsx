import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckSquare, Search, Plus, Filter, Eye, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { taskService } from '../../services/taskService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { DataTable } from '../../components/common/DataTable';

export const TaskListPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskService.search({ query: searchQuery, status: selectedStatus });
      setTasks(res.data || []);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [selectedStatus]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTasks();
  };

  const handleDelete = async (publicId) => {
    if (window.confirm('Soft delete this task?')) {
      try {
        await taskService.delete(publicId);
        toast.success('Task deleted');
        fetchTasks();
      } catch (err) {
        toast.error('Failed to delete task');
      }
    }
  };

  const columns = [
    {
      header: 'Task Number & Title',
      render: (row) => (
        <div>
          <span className="text-[10px] font-extrabold text-brand-600 block">[{row.taskNumber}]</span>
          <p className="font-bold text-slate-900 dark:text-slate-100">{row.title}</p>
        </div>
      ),
    },
    {
      header: 'Project Code',
      render: (row) => (
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">[{row.projectCode || 'TF'}] {row.projectName}</span>
      ),
    },
    {
      header: 'Priority',
      render: (row) => (
        <Badge variant={row.priority === 'HIGH' || row.priority === 'URGENT' ? 'red' : 'blue'}>{row.priority}</Badge>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'COMPLETED' ? 'green' : 'amber'}>{row.status}</Badge>
      ),
    },
    {
      header: 'Assignee',
      render: (row) => (
        <span className="text-xs text-slate-600 dark:text-slate-300">{row.assigneeName || 'Unassigned'}</span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link to={`/tasks/${row.publicId}`} className="p-1 text-slate-400 hover:text-brand-600">
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
            Task Management List View
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Filterable list view of all enterprise backlog and active task items.
          </p>
        </div>
        <Link to="/tasks/kanban">
          <Button size="sm" variant="outline">
            View Kanban Board →
          </Button>
        </Link>
      </div>

      {/* Search & Filter Card */}
      <Card className="p-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by task title or task number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 pl-9 pr-4 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="w-full md:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 py-2 px-3 text-xs text-slate-900 dark:text-slate-100"
            >
              <option value="">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="CODE_REVIEW">Code Review</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <Button type="submit" size="sm">Filter Tasks</Button>
        </form>
      </Card>

      <DataTable columns={columns} data={tasks} isLoading={loading} emptyMessage="No tasks found." />
    </div>
  );
};
