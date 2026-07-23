import React from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../../constants';
import { TrendingUp, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-900 dark:bg-slate-950 p-12 text-white relative overflow-hidden border-r border-slate-800">
        {/* Animated Mesh Gradient background elements */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-600/30 blur-3xl animate-pulse" />
        <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-pulse" />
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />

        {/* Top Header Logo */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 font-black text-white text-xl shadow-lg shadow-brand-500/30">
              TF
            </div>
            <span className="text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              {APP_NAME} Enterprise
            </span>
          </div>
          <span className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-semibold text-brand-300">
            v2.0 Enterprise SaaS
          </span>
        </div>

        {/* Hero Narrative & Floating Analytics Cards */}
        <div className="space-y-8 z-10 my-auto py-8">
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white">
              Next-Generation Project Intelligence & Workflows.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
              Streamline enterprise portfolios, Kanban task execution, automated velocity analytics, and multi-tenant security across your entire organization.
            </p>
          </div>

          {/* Floating Live Product Analytics Cards */}
          <div className="grid grid-cols-2 gap-4 max-w-lg pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl hover:translate-y-1 transition-transform">
              <div className="flex items-center justify-between text-slate-300 text-xs font-bold uppercase tracking-wider">
                <span>Velocity Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-2 text-2xl font-black text-white">+24.5%</div>
              <p className="text-[11px] text-emerald-400 font-semibold mt-1">↑ Outperforming sprint goal</p>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl hover:translate-y-1 transition-transform">
              <div className="flex items-center justify-between text-slate-300 text-xs font-bold uppercase tracking-wider">
                <span>AI Confidence</span>
                <Cpu className="w-4 h-4 text-brand-400" />
              </div>
              <div className="mt-2 text-2xl font-black text-white">95%</div>
              <p className="text-[11px] text-brand-300 font-semibold mt-1">Zero critical bottlenecks</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 backdrop-blur-md border border-slate-700/80 flex items-center justify-between max-w-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">System Certified Operational</h4>
                <p className="text-[11px] text-slate-400">Zero open security exceptions</p>
              </div>
            </div>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between text-xs text-slate-400 z-10 pt-4 border-t border-slate-800/80">
          <span>© {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</span>
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> SOC2 Compliant
          </span>
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12 relative">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

