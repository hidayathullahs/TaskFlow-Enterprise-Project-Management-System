import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  Activity
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { dashboardService } from '../../services/dashboardService';

import { ProjectStatusChartWidget } from '../../components/dashboard/ProjectStatusChartWidget';
import { MonthlyProductivityChartWidget } from '../../components/dashboard/MonthlyProductivityChartWidget';
import { TaskPriorityChartWidget } from '../../components/dashboard/TaskPriorityChartWidget';

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, chartsRes, actRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getCharts(),
          dashboardService.getActivities(),
        ]);
        setStats(statsRes.data);
        setCharts(chartsRes.data);
        setActivities(actRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-80 col-span-2 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Active Projects', value: stats?.activeProjects || 0, change: 'Total: ' + (stats?.totalProjects || 0), icon: FolderKanban, color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/50' },
    { label: 'Completed Tasks', value: stats?.completedTasks || 0, change: (stats?.overallCompletionRate || 0) + '% completion rate', icon: CheckSquare, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50' },
    { label: 'High Priority Tasks', value: stats?.highPriorityTasks || 0, change: 'Urgent attention', icon: Clock, color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/50' },
    { label: 'Overdue Tasks', value: stats?.overdueTasks || 0, change: 'Action required', icon: AlertCircle, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/50' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Interactive Executive Analytics Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time live metrics from MySQL database analytics engine.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" /> July 2026
          </Button>
          <Button size="sm">
            + New Project
          </Button>
        </div>
      </div>

      {/* Live Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
            >
              <Card className="hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-black text-slate-900 dark:text-slate-100">{stat.value}</span>
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400 mt-1 flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> {stat.change}
                  </p>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProjectStatusChartWidget data={charts?.projectStatusBreakdown} />
        <TaskPriorityChartWidget data={charts?.taskPriorityBreakdown} />
        <MonthlyProductivityChartWidget data={charts?.monthlyProductivity} />
      </div>

      {/* Recent Activity Audit Trail */}
      <Card
        header={
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-600" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Live Security & Activity Log Feed
            </h3>
          </div>
        }
      >
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-xs text-slate-400">No activity logs recorded yet.</p>
          ) : (
            activities.map((act, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/50 text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-100">{act.action}</span>
                  <span className="text-slate-500 ml-2">[{act.entityType}] {act.details}</span>
                </div>
                <span className="text-[10px] text-slate-400">{new Date(act.createdAt).toLocaleTimeString()}</span>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
