import React from 'react';
import { Outlet } from 'react-router-dom';
import { Check, Users, Target, BarChart3, Sparkles } from 'lucide-react';
import cosmicBg from '../../assets/login_cosmic_earth_bg.jpg';

export const AuthLayout = () => {
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#030712] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-white">
      
      {/* ============================================================= */}
      {/* 1. BACKGROUND: PHOTOREALISTIC COSMIC EARTH & DATA NETWORK     */}
      {/* ============================================================= */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none scale-105 filter brightness-125 contrast-105 saturate-115"
        style={{ backgroundImage: `url(${cosmicBg})` }}
      />
      
      {/* Atmospheric light layers with luminous electric blue glow for vibrant brightness */}
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-[#030712]/45 via-transparent to-[#030712]/30 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_65%_45%,rgba(0,180,255,0.32)_0%,transparent_65%)] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,229,255,0.25)_0%,transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_85%_50%,rgba(0,150,255,0.22)_0%,transparent_50%)] pointer-events-none" />

      {/* ============================================================= */}
      {/* 2. TOP HEADER: LOGO BRANDING (MATCHING SCREENSHOT)            */}
      {/* ============================================================= */}
      <header className="relative z-10 w-full px-6 sm:px-12 lg:px-16 pt-8 pb-4">
        <div className="flex items-center gap-3">
          {/* Blue rounded square with white checkmark */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/40">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">
              TaskFlow
            </span>
            <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-sky-400 block mt-0.5">
              PROJECT MANAGEMENT PLATFORM
            </span>
          </div>
        </div>
      </header>

      {/* ============================================================= */}
      {/* 3. MAIN CONTENT: 2-COLUMN SPLIT (HERO BRANDING + AUTH CARD)  */}
      {/* ============================================================= */}
      <main className="relative z-10 flex-1 flex items-center w-full max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-16 py-6 lg:py-10">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: HERO HEADLINE & 4 FEATURE PILLS */}
          <div className="lg:col-span-6 xl:col-span-7 space-y-8 lg:pr-6">
            
            {/* Main Headline matching screenshot */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
                Same goals. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00A3FF] to-[#00E5FF]">
                  Smarter
                </span> <br />
                collaboration.
              </h1>
              
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg font-normal pt-1">
                Join thousands of teams who plan, track, and deliver projects with clarity — all in one workspace.
              </p>
            </div>

            {/* 4 Circular Feature Badges matching screenshot */}
            <div className="flex items-center gap-5 sm:gap-7 pt-4 flex-wrap sm:flex-nowrap">
              
              {/* Badge 1: Work Together */}
              <div className="flex flex-col items-center text-center gap-2.5 group">
                <div className="w-13 h-13 rounded-full bg-[#0a152e]/80 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs font-medium text-slate-300 leading-tight">
                  Work<br />Together
                </span>
              </div>

              {/* Badge 2: Stay Organized */}
              <div className="flex flex-col items-center text-center gap-2.5 group">
                <div className="w-13 h-13 rounded-full bg-[#0a152e]/80 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                  <Target className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs font-medium text-slate-300 leading-tight">
                  Stay<br />Organized
                </span>
              </div>

              {/* Badge 3: Track Progress */}
              <div className="flex flex-col items-center text-center gap-2.5 group">
                <div className="w-13 h-13 rounded-full bg-[#0a152e]/80 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                  <BarChart3 className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs font-medium text-slate-300 leading-tight">
                  Track<br />Progress
                </span>
              </div>

              {/* Badge 4: Achieve More */}
              <div className="flex flex-col items-center text-center gap-2.5 group">
                <div className="w-13 h-13 rounded-full bg-[#0a152e]/80 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:scale-105 group-hover:border-cyan-400 transition-all">
                  <Sparkles className="w-5 h-5 stroke-[2]" />
                </div>
                <span className="text-xs font-medium text-slate-300 leading-tight">
                  Achieve<br />More
                </span>
              </div>

            </div>

          </div>

          {/* RIGHT COLUMN: OUTLET FOR LOGIN / AUTH CARDS */}
          <div className="lg:col-span-6 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-md">
              <Outlet />
            </div>
          </div>

        </div>
      </main>

    </div>
  );
};
