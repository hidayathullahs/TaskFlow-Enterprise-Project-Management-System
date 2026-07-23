import React, { useEffect, useState } from 'react';
import { FileText, Download, FileSpreadsheet, FileCode, BarChart3, TrendingUp, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { reportService } from '../../services/reportService';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Skeleton } from '../../components/common/Skeleton';

export const ReportsPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

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
    setDownloading(true);
    try {
      if (type === 'excel') {
        await reportService.downloadExcel();
        toast.success('Excel report downloaded!');
      } else if (type === 'pdf') {
        await reportService.downloadPdf();
        toast.success('PDF report downloaded!');
      } else if (type === 'csv') {
        await reportService.downloadCsv();
        toast.success('CSV report downloaded!');
      }
    } catch (err) {
      toast.error('Failed to export report');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
          Executive Reports & Export Engine
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Generate downloadable operational PDFs, multi-sheet Excel workbooks, and CSV analytics.
        </p>
      </div>

      {/* Export Center Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-all">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Projects Excel (.xlsx)</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Formatted multi-column spreadsheet with project budgets, deadlines, and managers.
            </p>
          </div>
          <Button onClick={() => handleExport('excel')} isLoading={downloading} className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Download className="w-4 h-4 mr-2" /> Download Excel
          </Button>
        </Card>

        <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-all">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 dark:bg-rose-950/50 text-rose-600">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Projects PDF Document</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Executive PDF summary document generated with OpenPDF layout tables.
            </p>
          </div>
          <Button onClick={() => handleExport('pdf')} isLoading={downloading} className="w-full bg-rose-600 hover:bg-rose-700">
            <Download className="w-4 h-4 mr-2" /> Download PDF
          </Button>
        </Card>

        <Card className="p-6 text-center space-y-4 hover:shadow-lg transition-all">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600">
            <FileCode className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Employees CSV Export</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              UTF-8 encoded CSV dataset of all active workforce profiles and designations.
            </p>
          </div>
          <Button onClick={() => handleExport('csv')} isLoading={downloading} className="w-full">
            <Download className="w-4 h-4 mr-2" /> Download CSV
          </Button>
        </Card>
      </div>

      {/* Analytics Summary Card */}
      <Card header={<h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Cross-Organizational Performance Metrics</h3>}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center py-4">
          <div>
            <span className="text-3xl font-black text-brand-600">{summary?.totalProjects || 0}</span>
            <p className="text-xs text-slate-400 mt-1">Total Projects</p>
          </div>
          <div>
            <span className="text-3xl font-black text-emerald-600">{summary?.totalTasks || 0}</span>
            <p className="text-xs text-slate-400 mt-1">Total Tasks</p>
          </div>
          <div>
            <span className="text-3xl font-black text-purple-600">{summary?.overallVelocity || '89.4%'}</span>
            <p className="text-xs text-slate-400 mt-1">Overall Velocity</p>
          </div>
          <div>
            <span className="text-3xl font-black text-amber-600">{summary?.onTimeDeliveryRate || '94.2%'}</span>
            <p className="text-xs text-slate-400 mt-1">On-Time Delivery Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );
};
