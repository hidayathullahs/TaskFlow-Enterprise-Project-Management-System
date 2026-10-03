import React, { useEffect, useState } from 'react';
import { Sparkles, ShieldAlert, TrendingUp, Users, Cpu, CheckCircle2, AlertTriangle, ArrowUpRight, Zap, Target, BrainCircuit } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { aiService } from '../../services/aiService';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Skeleton } from '../../components/common/Skeleton';
import aiBannerImg from '../../assets/ai_intelligence_banner.jpg';

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
        <Skeleton className="h-64 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-slate-100">
      
      {/* 1. Hero AI Intelligence Neural Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-950/30 bg-slate-950">
        <img 
          src={aiBannerImg} 
          alt="Enterprise AI Predictive Neural Engine" 
          className="w-full h-72 sm:h-80 object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
        
        {/* Floating Top & Bottom Overlays */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-purple-500/40 text-purple-300 text-xs font-black backdrop-blur-xl shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Predictive Decision Engine v3.0
          </span>
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-black backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Forecast Confidence: {data?.deliveryConfidenceScore || 96.0}%
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              AI Decision Support & Predictive Risk Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl font-normal">
              Continuous neural heuristics scanning portfolio velocity, developer burnout signals, and sprint delivery risks.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700 backdrop-blur-xl text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Risk Index</span>
              <span className="text-lg font-black text-emerald-400">Low Risk</span>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-center shadow-lg shadow-purple-600/30">
              <span className="text-[10px] text-purple-200 font-bold uppercase block">Confidence</span>
              <span className="text-lg font-black">{data?.deliveryConfidenceScore || 96.0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Natural Language Executive Narrative */}
      <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-extrabold text-white">
                Executive Heuristic Telemetry Summary
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-black border border-purple-500/30">
                NEURAL SYNTHESIS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {data?.executiveSummary || 'Portfolio telemetry confirms high velocity alignment. Sprint 26 is progressing at 42.5 pts/wk with minimal milestone delay risks across all team nodes.'}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Project Risk Prediction Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-500" /> Project Delivery Risk Matrix
          </h3>
          <span className="text-xs text-slate-400 font-medium">Updated every 15 minutes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.projectRisks?.map((risk) => (
            <div key={risk.projectPublicId} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-400 font-mono">[{risk.projectCode}]</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  risk.riskLevel === 'CRITICAL' || risk.riskLevel === 'HIGH'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  Risk Score: {risk.riskScore}/100
                </span>
              </div>

              <h4 className="text-sm font-extrabold text-white">{risk.projectName}</h4>

              <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Contributing Factors
                </span>
                {risk.riskFactors?.map((f, i) => (
                  <p key={i} className="text-slate-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{f}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Employee Workload Heat Map Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-brand-400" /> Team Workload & Burnout Telemetry
        </h3>

        <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-6 shadow-xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.workloadHeatmap?.map((item) => (
              <div key={item.employeePublicId} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-white">{item.employeeName}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    item.workloadStatus === 'OVERLOADED' 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                      : item.workloadStatus === 'UNDERUTILIZED' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}>
                    {item.workloadStatus}
                  </span>
                </div>
                
                <p className="text-slate-400 text-[11px]">{item.designation} • Active: {item.activeTasksCount} Tasks</p>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400">
                    <span>Utilization</span>
                    <span>{item.utilizationPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.workloadStatus === 'OVERLOADED' ? 'bg-rose-500' : 'bg-gradient-to-r from-brand-500 to-indigo-500'
                      }`}
                      style={{ width: `${item.utilizationPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Smart Recommendations */}
      <div className="space-y-4">
        <h3 className="text-base font-black text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-emerald-400" /> Smart Action Recommendations
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {data?.recommendations?.map((rec, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 border-l-4 border-l-brand-500 space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 font-bold text-[10px] border border-brand-500/30">
                  {rec.category}
                </span>
                <span className="text-[10px] font-bold text-rose-400">Impact: {rec.impact}</span>
              </div>
              <h4 className="text-sm font-extrabold text-white">{rec.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{rec.suggestion}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
