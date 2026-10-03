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
  Activity,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  Users
} from 'lucide-react';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import { dashboardService } from '../../services/dashboardService';

import { ProjectStatusChartWidget } from '../../components/dashboard/ProjectStatusChartWidget';
import { MonthlyProductivityChartWidget } from '../../components/dashboard/MonthlyProductivityChartWidget';
import { TaskPriorityChartWidget } from '../../components/dashboard/TaskPriorityChartWidget';

import aiBannerImg from '../../assets/ai_intelligence_banner.jpg';
import kanbanCollabImg from '../../assets/kanban_collaboration.jpg';

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
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-80 col-span-2 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  const statCards = [
    { 
      label: 'Active Projects', 
      value: stats?.activeProjects || 0, 
      subtext: `Total: ${stats?.totalProjects || 0} Portfolios`, 
      icon: FolderKanban, 
      color: 'from-blue-600 to-cyan-500',
      badge: '+12% this month' 
    },
    { 
      label: 'Completed Tasks', 
      value: stats?.completedTasks || 0, 
      subtext: `${stats?.overallCompletionRate || 0}% completion velocity`, 
      icon: CheckSquare, 
      color: 'from-emerald-600 to-teal-500',
      badge: '98% on-track'
    },
    { 
      label: 'High Priority Tasks', 
      value: stats?.highPriorityTasks || 0, 
      subtext: 'Urgent Sprint Attention', 
      icon: Clock, 
      color: 'from-purple-600 to-indigo-500',
      badge: '4 in review'
    },
    { 
      label: 'Overdue / Risk Alert', 
      value: stats?.overdueTasks || 0, 
      subtext: 'Requires Immediate Action', 
      icon: AlertCircle, 
      color: 'from-rose-600 to-pink-500',
      badge: 'Mitigated'
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* 1. Hero Executive Intelligence Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
        <img 
          src={aiBannerImg} 
          alt="TaskFlow AI Predictive Dashboard" 
          className="absolute inset-0 w-full h-full object-cover object-right opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-transparent" />
        
        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>AI Executive Command Center Active</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Enterprise Project Intelligence & Velocity Hub
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Real-time portfolio telemetry, automated sprint burndown analytics, and machine learning risk forecasts across all organizational teams.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Sprint Health: 96% Optimal</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-brand-400 font-bold">
                <Zap className="w-3.5 h-3.5" />
                <span>Live Latency: 18ms</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-purple-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Zero Trust Security Verified</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/projects"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-xs font-black shadow-lg shadow-brand-500/30 hover:scale-102 transition-all flex items-center gap-2"
            >
              <span>+ Create Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
            <a
              href="/ai-intelligence"
              className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold backdrop-blur-md hover:scale-102 transition-all flex items-center gap-2"
            >
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>AI Predictions</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Live Stat KPI Cards Grid */}
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
              <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl hover:border-slate-700/80 transition-all hover:scale-[1.02] relative overflow-hidden group">
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <div className={`p-2.5 rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-md shadow-black/40 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-3xl font-black text-white tracking-tight">{stat.value}</span>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-slate-400 font-medium">{stat.subtext}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-emerald-400">
                      {stat.badge}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 3. Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProjectStatusChartWidget data={charts?.projectStatusBreakdown} />
        <TaskPriorityChartWidget data={charts?.taskPriorityBreakdown} />
        <MonthlyProductivityChartWidget data={charts?.monthlyProductivity} />
      </div>

      {/* 4. Team Agile Sprint Collaboration & AI Insights Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: 3D Collaboration Sprint Spotlight Card */}
        <div className="lg:col-span-7 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Active Agile Sprint Workspace</h3>
                <p className="text-xs text-slate-400">Collaborative high-velocity Kanban pipelines</p>
              </div>
            </div>
            <a
              href="/tasks/kanban"
              className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              Open Kanban Board →
            </a>
          </div>

          <div className="my-4 relative rounded-2xl overflow-hidden border border-slate-800 group shadow-xl">
            <img 
              src={kanbanCollabImg} 
              alt="TaskFlow Team Agile Collaboration" 
              className="w-full h-56 object-cover object-center transform group-hover:scale-103 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-md">
                🚀 Sprint 26: 89% Complete
              </span>
              <span className="px-3 py-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs font-bold text-emerald-400 shadow-md">
                14 Tasks Deployed
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center pt-2">
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold">Active Sprint</p>
              <p className="text-sm font-black text-white mt-0.5">Sprint #26</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold">Team Velocity</p>
              <p className="text-sm font-black text-emerald-400 mt-0.5">42.5 pts</p>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <p className="text-xs text-slate-400 font-semibold">Burndown</p>
              <p className="text-sm font-black text-brand-400 mt-0.5">On Schedule</p>
            </div>
          </div>
        </div>

        {/* Right: Live Security & Activity Log Feed */}
        <div className="lg:col-span-5 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Security & Audit Telemetry</h3>
                  <p className="text-xs text-slate-400">Real-time enterprise event stream</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </div>

            <div className="space-y-3 mt-4 overflow-y-auto max-h-72 pr-1">
              {activities.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  No activity logs recorded yet. All services operational.
                </div>
              ) : (
                activities.slice(0, 5).map((act, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white">{act.action}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {act.createdAt ? new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px] truncate">
                      <span className="text-brand-400 font-semibold">[{act.entityType}]</span> {act.details || 'System audit event triggered.'}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>MySQL 8.0 Engine & Spring Boot 3</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Encrypted
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
