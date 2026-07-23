import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, Trash2, CheckCheck, Clock, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { notificationService } from '../../services/notificationService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      setNotifications(res.data || []);
    } catch (err) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (publicId) => {
    try {
      await notificationService.markAsRead(publicId);
      toast.success('Marked as read');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to mark notification');
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      toast.success('All notifications marked as read');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (publicId) => {
    try {
      await notificationService.delete(publicId);
      toast.success('Notification deleted');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to delete notification');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl mx-auto">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Activity & Notification Center
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time push alerts, task mentions, project assignments, and system security broadcasts.
          </p>
        </div>
        <Button size="sm" variant="outline" onClick={handleMarkAllRead}>
          <CheckCheck className="w-4 h-4 mr-2" /> Mark All as Read
        </Button>
      </div>

      {/* Notifications Stack */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="text-center py-12 text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No active notifications in your queue.
          </Card>
        ) : (
          notifications.map((notif) => (
            <Card
              key={notif.publicId}
              className={`p-4 transition-all ${
                !notif.read ? 'bg-brand-50/40 dark:bg-brand-950/20 border-brand-200 dark:border-brand-800' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 ${!notif.read ? 'bg-brand-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600'}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{notif.title}</h4>
                      {!notif.read && <Badge variant="blue">NEW</Badge>}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{notif.message}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(notif.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.publicId)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                      title="Mark as Read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.publicId)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
