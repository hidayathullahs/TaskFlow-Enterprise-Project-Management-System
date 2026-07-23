import React from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../../constants';
import { ShieldCheck, Sparkles, TrendingUp, Cpu } from 'lucide-react';
import heroImg from '../../assets/hero_illustration.png';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Left Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-slate-900 dark:bg-slate-950 p-10 text-white relative overflow-hidden border-r border-slate-800">
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
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-800/90 border border-slate-700 text-xs font-semibold text-brand-300 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> v2.0 Enterprise SaaS
          </span>
        </div>

        {/* Hero Narrative Header */}
        <div className="space-y-3 z-10 mt-6">
          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white">
            Next-Generation Project Intelligence & Workflows.
          </h1>
          <p className="text-xs xl:text-sm text-slate-300 leading-relaxed max-w-lg">
            Streamline enterprise portfolios, Kanban task execution, automated velocity analytics, and multi-tenant security across your entire organization.
          </p>
        </div>

        {/* 3D Generated Hero Illustration Container */}
        <div className="relative my-4 z-10 rounded-2xl overflow-hidden border border-white/15 shadow-2xl shadow-brand-500/20 group">
          <img 
            src={heroImg} 
            alt="TaskFlow Enterprise 3D Hero Workspace Illustration" 
            className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          
          {/* Floating Badges Overlay */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Velocity +24.5%
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
              <Cpu className="w-3.5 h-3.5 text-brand-400" /> AI Confidence 95%
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 z-10 pt-3 border-t border-slate-800/80">
          <span>© {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</span>
          <span className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> SOC2 Type II Certified
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


