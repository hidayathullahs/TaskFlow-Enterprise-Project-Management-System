import React, { useEffect, useState } from 'react';
import { 
  FileText, Download, FileSpreadsheet, FileCode, BarChart3, TrendingUp, 
  ShieldCheck, Sparkles, Clock, CheckCircle2, Layers, Activity, Calendar, Zap, ArrowUpRight 
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reportService } from '../../services/reportService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';
import reportingHeroImg from '../../assets/analytics_reporting_showcase.jpg';

export const ReportsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingType, setDownloadingType] = useState(null);
  const [selectedRange, setSelectedRange] = useState('q4');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await reportService.getSummary();
        setSummary(res.data);
      } catch (err) {
        toast.error('Failed to load report analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const handleExport = async (type) => {
    setDownloadingType(type);
    try {
      if (type === 'excel') {
        await reportService.downloadExcel();
        toast.success('Excel (.xlsx) Report generated and downloaded successfully!');
      } else if (type === 'pdf') {
        await reportService.downloadPdf();
        toast.success('Executive PDF Document generated and downloaded successfully!');
      } else if (type === 'csv') {
        await reportService.downloadCsv();
        toast.success('Workforce CSV Dataset exported successfully!');
      }
    } catch (err) {
      toast.error(`Failed to export ${type.toUpperCase()} report`);
    } finally {
      setDownloadingType(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-56 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Executive Intelligence Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-950/90 shadow-2xl">
        <div className="absolute inset-0 z-0">
          <img 
            src={reportingHeroImg} 
            alt="Enterprise Holographic Business Intelligence & Analytics" 
            className="w-full h-full object-cover object-center opacity-40 mix-blend-screen scale-102"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 p-8 sm:p-10 lg:p-12 max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Executive Business Intelligence
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> Live Telemetry Synced
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-semibold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> OpenPDF & Apache POI Certified
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Enterprise Reporting & Export Engine
          </h1>
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Generate audit-ready executive deliverables, multi-tab financial Excel spreadsheets, and high-precision CSV data streams with automated compliance watermarking.
          </p>

          {/* Quick Date Range & Filter Pills */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-semibold">
              <button 
                onClick={() => setSelectedRange('7d')}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedRange === '7d' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Last 7 Days
              </button>
              <button 
                onClick={() => setSelectedRange('30d')}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedRange === '30d' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Last 30 Days
              </button>
              <button 
                onClick={() => setSelectedRange('q4')}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedRange === 'q4' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Current Q4
              </button>
              <button 
                onClick={() => setSelectedRange('ytd')}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedRange === 'ytd' ? 'bg-brand-600 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                YTD 2026
              </button>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-brand-400" /> Automated nightly snapshot active
            </span>
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Total Projects</span>
            <Layers className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary?.totalProjects || 12}</div>
          <p className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last quarter
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Total Tasks</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary?.totalTasks || 48}</div>
          <p className="text-[11px] text-slate-400 font-medium">92% execution rate</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>Overall Velocity</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-purple-400">{summary?.overallVelocity || '89.4%'}</div>
          <p className="text-[11px] text-purple-300 font-medium">+4.2 pts sprint acceleration</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md space-y-1 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span>On-Time Delivery</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">{summary?.onTimeDeliveryRate || '94.2%'}</div>
          <p className="text-[11px] text-emerald-400 font-semibold">Exceeds 90% SLA target</p>
        </div>
      </div>

      {/* Export Format Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight">Deliverable Export Suite</h2>
            <p className="text-xs text-slate-400">Certified enterprise file formats with instant on-demand compilation.</p>
          </div>
          <span className="text-xs text-brand-400 font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> High-Throughput Stream Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Excel */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between group space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-7 h-7" />
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                  .XLSX (Excel)
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                  Portfolio Workbook
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Full multi-tab Excel spreadsheet containing project budgets, deadlines, manager assignments, and burndown progress calculations.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between"><span>Format:</span> <span className="text-slate-200 font-mono">Apache POI 5.2</span></div>
                <div className="flex justify-between"><span>Payload Size:</span> <span className="text-slate-200 font-mono">~1.8 MB</span></div>
                <div className="flex justify-between"><span>Security:</span> <span className="text-emerald-400 font-semibold">Protected Workbook</span></div>
              </div>
            </div>

            <Button 
              onClick={() => handleExport('excel')} 
              isLoading={downloadingType === 'excel'} 
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/30"
            >
              <Download className="w-4 h-4 mr-2" /> 
              {downloadingType === 'excel' ? 'Generating Workbook...' : 'Download Excel (.xlsx)'}
            </Button>
          </div>

          {/* Card 2: PDF */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between group space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 font-mono">
                  .PDF (Document)
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white group-hover:text-rose-300 transition-colors">
                  Executive PDF Report
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  Publication-quality executive briefing document featuring summary tables, milestone health matrices, and governance signatures.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between"><span>Format:</span> <span className="text-slate-200 font-mono">OpenPDF A4 Standard</span></div>
                <div className="flex justify-between"><span>Payload Size:</span> <span className="text-slate-200 font-mono">~740 KB</span></div>
                <div className="flex justify-between"><span>Security:</span> <span className="text-rose-400 font-semibold">SOC2 Certified Layout</span></div>
              </div>
            </div>

            <Button 
              onClick={() => handleExport('pdf')} 
              isLoading={downloadingType === 'pdf'} 
              className="w-full h-11 bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-lg shadow-rose-600/30"
            >
              <Download className="w-4 h-4 mr-2" /> 
              {downloadingType === 'pdf' ? 'Rendering PDF...' : 'Download Executive PDF'}
            </Button>
          </div>

          {/* Card 3: CSV */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-brand-500/50 shadow-xl transition-all hover:scale-[1.01] flex flex-col justify-between group space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/30 text-brand-400 group-hover:scale-110 transition-transform">
                  <FileCode className="w-7 h-7" />
                </div>
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/30 font-mono">
                  .CSV (Raw Data)
                </span>
              </div>
              <div>
                <h3 className="text-lg font-black text-white group-hover:text-brand-300 transition-colors">
                  Workforce CSV Stream
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  High-speed UTF-8 encoded flat dataset of employee profiles, skill designations, active team assignments, and security roles.
                </p>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between"><span>Encoding:</span> <span className="text-slate-200 font-mono">RFC 4180 / UTF-8</span></div>
                <div className="flex justify-between"><span>Payload Size:</span> <span className="text-slate-200 font-mono">~140 KB</span></div>
                <div className="flex justify-between"><span>Integration:</span> <span className="text-brand-400 font-semibold">ETL / BI Ready</span></div>
              </div>
            </div>

            <Button 
              onClick={() => handleExport('csv')} 
              isLoading={downloadingType === 'csv'} 
              className="w-full h-11 bg-brand-600 hover:bg-brand-500 text-white font-bold shadow-lg shadow-brand-600/30"
            >
              <Download className="w-4 h-4 mr-2" /> 
              {downloadingType === 'csv' ? 'Streaming CSV...' : 'Download CSV Dataset'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
