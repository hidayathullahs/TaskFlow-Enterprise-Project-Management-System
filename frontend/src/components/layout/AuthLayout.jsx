import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { APP_NAME } from '../../constants';
import { ShieldCheck, Sparkles, X, Sun, Moon, ArrowRight, Heart, Zap, CheckCircle2, Lock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import heroImg from '../../assets/hero_illustration.png';

export const AuthLayout = () => {
  const [showBanner, setShowBanner] = useState(true);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* 1. Top Announcement Bar */}
      {showBanner && (
        <div className="w-full bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white px-4 py-2.5 flex items-center justify-between shadow-md text-xs font-semibold z-50">
          <div className="flex items-center justify-center gap-2 mx-auto">
            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
            <span>TaskFlow v2.5 Enterprise SaaS Release is Live! Streamline real-time team workflows & AI analytics.</span>
            <Link to="/login" className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-0.5 rounded-full font-bold transition-colors">
              Explore Platform <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <button 
            type="button" 
            onClick={() => setShowBanner(false)} 
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Close Announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 px-6 lg:px-12 py-3.5 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 font-black text-white text-xl shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            TF
          </div>
          <span className="text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-600 dark:from-white dark:via-slate-100 dark:to-slate-400 bg-clip-text text-transparent">
            {APP_NAME} Enterprise
          </span>
        </Link>

        {/* Navigation Items */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 dark:text-slate-300">
          <Link to="/login" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
            <span>🏠</span> Home
          </Link>
          <a href="#features" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
            <span>⚡</span> Features
          </a>
          <a href="#security" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
            <span>🔒</span> Security & SOC2
          </a>
          <a href="http://localhost:8080/swagger-ui.html" target="_blank" rel="noreferrer" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1">
            <span>📖</span> API Docs
          </a>
        </nav>

        {/* Right Action Elements */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:opacity-95 transition-all hover:scale-102"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* 3. Hero Split Layout (Left Content & Form, Right Visual Card) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Category Badge, Title, Subtitle, Form, Metrics) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 dark:bg-brand-950/60 border border-brand-200 dark:border-brand-800 text-xs font-bold text-brand-700 dark:text-brand-300">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping" />
            <span>Accelerate Sprint Productivity Today</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              Streamline Enterprise <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Projects Near You</span>
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Connect your cross-functional engineering teams instantly. TaskFlow Enterprise helps you manage portfolios, Kanban tasks, and automated velocity analytics when every milestone counts.
            </p>
          </div>

          {/* Form Outlet Container */}
          <div className="w-full">
            <Outlet />
          </div>

          {/* Key Metrics Footer Bar */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
            <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-lg font-black text-slate-900 dark:text-slate-100">24/7</div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Live Uptime</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-lg font-black text-slate-900 dark:text-slate-100">100%</div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">SOC2 Security</p>
            </div>
            <div className="p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">24ms</div>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">API Latency</p>
            </div>
          </div>
        </div>

        {/* Right Column (Featured Visual Hero Card) */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-3xl p-2 bg-gradient-to-br from-brand-500/30 via-purple-500/20 to-indigo-500/30 shadow-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800 group">
            
            {/* Heart Accent Badge */}
            <div className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center text-rose-500 hover:scale-110 transition-transform">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>

            {/* Main 3D Hero Illustration */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900">
              <img 
                src={heroImg} 
                alt="TaskFlow Enterprise 3D Workspace Illustration" 
                className="w-full h-auto object-cover transform group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Floating Badges */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xl">
                  <Zap className="w-4 h-4 text-emerald-400" /> Velocity +24.5%
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-xl">
                  <CheckCircle2 className="w-4 h-4 text-brand-400" /> AI Confidence 95%
                </div>
              </div>
            </div>

            {/* Bottom Right Floating SOS / Security Floating Badge */}
            <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2 px-3.5 py-2 rounded-full bg-rose-600 text-white font-bold text-xs shadow-xl animate-bounce">
              <Lock className="w-3.5 h-3.5" /> SOC2 Verified
            </div>
          </div>
        </div>
      </main>

      {/* Footer Copyright */}
      <footer className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-4 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} TaskFlow Inc. All rights reserved. Enterprise SaaS Platform v2.5
      </footer>
    </div>
  );
};



