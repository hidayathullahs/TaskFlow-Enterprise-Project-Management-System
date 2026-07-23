import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckSquare, ArrowLeft, MessageSquare, Send, User, Calendar, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { taskService } from '../../services/taskService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

export const TaskDetailPage = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTaskDetails = async () => {
    try {
      const [taskRes, commentRes] = await Promise.all([
        taskService.getById(id),
        taskService.getComments(id),
      ]);
      setTask(taskRes.data);
      setComments(commentRes.data || []);
    } catch (err) {
      toast.error('Failed to load task details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await taskService.addComment(id, newComment);
      toast.success('Comment posted');
      setNewComment('');
      fetchTaskDetails();
    } catch (err) {
      toast.error('Failed to post comment');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-slate-500">Task item not found.</p>
        <Link to="/tasks" className="mt-4 inline-block text-xs font-bold text-brand-600">Back to Tasks</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/tasks/kanban" className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Kanban Board
      </Link>

      {/* Task Header Card */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-black text-brand-600">[{task.taskNumber}]</span>
              <Badge variant={task.status === 'COMPLETED' ? 'green' : 'amber'}>{task.status}</Badge>
              <Badge variant="purple">Priority: {task.priority}</Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">{task.title}</h1>
            <p className="text-xs text-slate-500 mt-1">Project: <span className="font-bold text-brand-600">[{task.projectCode}] {task.projectName}</span></p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-6 text-xs text-slate-400">
          <span>Assignee: <b className="text-slate-700 dark:text-slate-200">{task.assigneeName}</b></span>
          <span>Due Date: <b className="text-slate-700 dark:text-slate-200">{task.dueDate || 'N/A'}</b></span>
        </div>
      </Card>

      {/* Task Description & Discussion Thread */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 space-y-6" header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Discussion Thread & Activity</h3>}>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {task.description || 'No detailed description provided.'}
          </p>

          {/* Comments List */}
          <div className="space-y-4 border-t border-slate-100 dark:border-slate-700/60 pt-4">
            <h4 className="text-xs font-bold uppercase text-slate-400">Comments ({comments.length})</h4>
            <div className="space-y-3">
              {comments.map((c) => (
                <div key={c.publicId} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 mb-1">
                    <span>{c.authorName}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{new Date(c.createdAt).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{c.content}</p>
                </div>
              ))}
            </div>

            {/* Post Comment Form */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Post a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 text-xs text-slate-900 dark:text-slate-100"
              />
              <Button type="submit" size="sm">
                <Send className="w-3.5 h-3.5 mr-1" /> Post
              </Button>
            </form>
          </div>
        </Card>

        <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Time Log</h3>}>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-400">Estimated Hours</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{task.estimatedHours || 8} hrs</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-2">
              <span className="text-slate-400">Logged Hours</span>
              <span className="font-bold text-brand-600">{task.loggedHours || 0} hrs</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
