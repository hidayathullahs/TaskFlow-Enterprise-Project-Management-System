import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldAlert, TrendingUp, Users, Cpu, CheckCircle2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { aiService } from '../../services/aiService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';

export const AiDashboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAiData = async () => {
      try {
        const res = await aiService.getSummary();
        setData(res.data);
      } catch (err) {
        toast.error('Failed to load AI Intelligence data');
      } finally {
        setLoading(false);
      }
    };
    fetchAiData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-brand-500 animate-pulse" />
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              AI Decision Support & Predictive Analytics Engine
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Machine Learning ready heuristic engine calculating delivery confidence, project risk factors, and workload heatmaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Card className="px-4 py-2 bg-gradient-to-r from-brand-600 to-purple-600 text-white flex items-center gap-3">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider block opacity-80">Delivery Confidence</span>
              <span className="text-xl font-black">{data?.deliveryConfidenceScore || 85.0}%</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Executive Summary Card */}
      <Card className="p-6 bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white border-brand-500/30">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-brand-500/20 border border-brand-500/40 text-brand-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Natural Language Executive Narrative
              <Badge variant="purple">AI GENERATED</Badge>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              {data?.executiveSummary}
            </p>
          </div>
        </div>
      </Card>

      {/* Project Risk Prediction Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-500" /> Project Risk Scoring & Bottlenecks
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.projectRisks?.map((risk) => (
            <Card key={risk.projectPublicId} className="space-y-3 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-600">[{risk.projectCode}]</span>
                <Badge variant={risk.riskLevel === 'CRITICAL' || risk.riskLevel === 'HIGH' ? 'red' : 'green'}>
                  Risk Score: {risk.riskScore}/100
                </Badge>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100">{risk.projectName}</h4>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 uppercase">Contributing Risk Factors</span>
                {risk.riskFactors?.map((f, i) => (
                  <p key={i} className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> {f}
                  </p>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Employee Workload Heat Map Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-500" /> Team Workload & Burnout Heatmap
        </h3>

        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.workloadHeatmap?.map((item) => (
              <div key={item.employeePublicId} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.employeeName}</span>
                  <Badge variant={item.workloadStatus === 'OVERLOADED' ? 'red' : item.workloadStatus === 'UNDERUTILIZED' ? 'amber' : 'green'}>
                    {item.workloadStatus}
                  </Badge>
                </div>
                <p className="text-slate-400 text-[11px]">{item.designation} • Active Tasks: {item.activeTasksCount}</p>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${item.workloadStatus === 'OVERLOADED' ? 'bg-rose-500' : 'bg-brand-500'}`}
                    style={{ width: `${item.utilizationPercentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Smart Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-500" /> Smart Action Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data?.recommendations?.map((rec, idx) => (
            <Card key={idx} className="p-4 space-y-2 border-l-4 border-l-brand-600">
              <div className="flex items-center justify-between text-xs">
                <Badge variant="blue">{rec.category}</Badge>
                <span className="text-[10px] font-bold text-rose-600">Impact: {rec.impact}</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{rec.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{rec.suggestion}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
