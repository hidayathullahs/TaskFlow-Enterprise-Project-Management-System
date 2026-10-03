import React from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../../constants';
import { ShieldCheck, Sparkles, TrendingUp, Cpu, Activity, Zap } from 'lucide-react';
import heroImg from '../../assets/auth_hero_illustration.jpg';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-[#080c14] text-slate-100 transition-colors duration-300">
      {/* Left Hero Section (Deep Cosmic Midnight) */}
      <div 
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-10 xl:p-12 relative overflow-hidden border-r border-slate-800/80"
        style={{ backgroundColor: '#0b0f19' }}
      >
        {/* Animated Mesh Gradient background elements */}
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -left-24 -bottom-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute left-1/3 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />

        {/* Top Header Logo */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 font-black text-white text-xl shadow-lg shadow-brand-500/40 border border-white/20">
              TF
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1.5">
                {APP_NAME} <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">Enterprise</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Multi-Tenant Cloud Platform</p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-xs font-semibold text-brand-300 shadow-md backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> v2.5 Enterprise SaaS
          </span>
        </div>

        {/* Hero Narrative Header */}
        <div className="space-y-3 z-10 mt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Zero-Downtime Infrastructure Active
          </div>
          <h1 className="text-3xl xl:text-4xl font-black leading-tight tracking-tight text-white drop-shadow-sm">
            Next-Generation Project Intelligence & Workflows
          </h1>
          <p className="text-xs xl:text-sm text-slate-300 leading-relaxed max-w-lg font-normal">
            Streamline enterprise portfolios, high-velocity Kanban task execution, automated burndown analytics, and multi-tenant security across your entire organization.
          </p>
        </div>

        {/* 3D Generated Hero Illustration Container */}
        <div className="relative my-4 z-10 rounded-2xl overflow-hidden border border-white/20 shadow-2xl shadow-brand-500/30 group bg-slate-950/80">
          <img 
            src={heroImg} 
            alt="TaskFlow Enterprise 3D Holographic Project Showcase" 
            className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />
          
          {/* Floating Badges Overlay */}
          <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-white/25 text-xs font-bold text-white shadow-xl">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Velocity +34.8%
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-white/25 text-xs font-bold text-white shadow-xl">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> 18ms Latency
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/95 backdrop-blur-md border border-white/25 text-xs font-bold text-white shadow-xl">
              <Cpu className="w-3.5 h-3.5 text-purple-400" /> AI Confidence 98%
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-slate-400 z-10 pt-3 border-t border-slate-800/80">
          <span>© {new Date().getFullYear()} TaskFlow Inc. All rights reserved.</span>
          <span className="flex items-center gap-1.5 text-slate-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-brand-400" /> SOC2 Type II & ISO 27001 Certified
          </span>
        </div>
      </div>

      {/* Right Form Container */}
      <div 
        className="flex flex-1 items-center justify-center p-6 sm:p-12 relative overflow-y-auto"
        style={{ backgroundColor: '#090d16' }}
      >
        <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-brand-600/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />
        <div className="w-full max-w-md relative z-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};



