import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ShieldCheck, ArrowRight, Zap, Cpu, CheckSquare, 
  Users, BarChart3, Lock, CheckCircle2, ChevronRight, Globe, 
  Terminal, Server, Play, Star, Building2, Download, MousePointerClick,
  Layers, Activity, Check, Target, Compass
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME } from '../../constants';
import { Button } from '../../components/common/Button';

// High-tech AI background artwork & showcase visual assets
import cosmicGlobeBg from '../../assets/homepage_cosmic_globe_bg.jpg';
import motionGridBg from '../../assets/enterprise_motion_grid_bg.jpg';
import heroShowcaseImg from '../../assets/auth_hero_illustration.jpg';
import aiBannerImg from '../../assets/ai_intelligence_banner.jpg';
import kanbanImg from '../../assets/kanban_collaboration.jpg';
import reportingImg from '../../assets/analytics_reporting_showcase.jpg';
import teamImg from '../../assets/team_collaboration_showcase.jpg';

export const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('kanban');
  const [scrollY, setScrollY] = useState(0);
  const [scrollPercent, setScrollPercent] = useState(0);

  // High-performance scroll tracking using requestAnimationFrame for buttery-smooth 60fps+ parallax
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScroll = window.scrollY;
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          const percent = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
          setScrollY(currentScroll);
          setScrollPercent(percent);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productTabs = [
    {
      id: 'kanban',
      label: 'Agile Kanban Boards',
      icon: CheckSquare,
      title: 'High-Velocity Sprint & Task Execution',
      desc: 'Orchestrate cross-functional engineering sprints with custom WIP limits, real-time board sync, priority tagging, and automated stage transitions.',
      image: kanbanImg,
      badge: 'Real-Time Sync',
      metrics: [
        { label: 'Sprint Velocity', value: '+34.8%' },
        { label: 'Cycle Time Reduction', value: '4.2 Days' },
        { label: 'Team Alignment', value: '99.4%' },
      ]
    },
    {
      id: 'ai',
      label: 'Predictive AI Intelligence',
      icon: Cpu,
      title: 'Neural Decision Support & Risk Forecasts',
      desc: 'Proactively detect project slippages, calculate milestone confidence probabilities, and optimize engineer workloads using real-time machine learning heuristics.',
      image: aiBannerImg,
      badge: 'Neural Core v3.0',
      metrics: [
        { label: 'Forecast Accuracy', value: '96.2%' },
        { label: 'Burnout Detection', value: 'Real-Time' },
        { label: 'Mitigated Risks', value: '14 Alerts' },
      ]
    },
    {
      id: 'reporting',
      label: 'Executive Reports & BI',
      icon: BarChart3,
      title: 'Audit-Ready Reports & Multi-Format Exports',
      desc: 'One-click compiled executive PDF briefings via OpenPDF, multi-sheet Excel workbooks via Apache POI, and raw workforce CSV streams with zero data lag.',
      image: reportingImg,
      badge: 'OpenPDF Certified',
      metrics: [
        { label: 'Export Formats', value: 'PDF, XLSX, CSV' },
        { label: 'Compilation Time', value: '<800ms' },
        { label: 'Audit Trail', value: '100% Verified' },
      ]
    },
    {
      id: 'workforce',
      label: 'Workforce Directory',
      icon: Users,
      title: 'Global Team Matrix & RBAC Governance',
      desc: 'Centralize employee profiles, track departmental skill distributions, configure squad hierarchies, and enforce fine-grained role-based security.',
      image: teamImg,
      badge: 'Zero-Trust RBAC',
      metrics: [
        { label: 'Security Standard', value: 'SOC2 Type II' },
        { label: 'Active Personnel', value: '25,000+' },
        { label: 'Hierarchy Depth', value: 'N-Tier' },
      ]
    }
  ];

  const currentTab = productTabs.find(t => t.id === activeTab) || productTabs[0];

  return (
    <div className="min-h-screen bg-[#030611] text-slate-100 selection:bg-cyan-500 selection:text-white overflow-x-hidden font-sans relative">
      
      {/* ========================================================================= */}
      {/* 🚀 TOP SCROLL PROGRESS INDICATOR                                          */}
      {/* ========================================================================= */}
      <div 
        className="fixed top-0 left-0 right-0 h-[3px] z-[100] bg-gradient-to-r from-[#00A3FF] via-[#00E5FF] to-purple-500 transition-all duration-75 shadow-[0_0_14px_rgba(0,180,255,0.9)]"
        style={{ width: `${scrollPercent}%` }}
      />

      {/* ========================================================================= */}
      {/* 🌌 MULTI-LAYER GLOBAL PARALLAX SCROLL MOTION BACKGROUND                   */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        
        {/* Layer 1: Photorealistic Cosmic Globe Wallpaper (User's Exact Asset) */}
        <div 
          className="absolute -top-16 -left-12 -right-12 h-[140vh] bg-cover bg-center transition-transform duration-75 ease-out will-change-transform filter brightness-115 contrast-105"
          style={{
            backgroundImage: `url(${cosmicGlobeBg})`,
            transform: `translate3d(0, ${-scrollY * 0.16}px, 0) scale(1.05)`,
            opacity: Math.max(0.75 - scrollY * 0.0003, 0.35)
          }}
        />

        {/* Layer 2: Subtle Cybernetic Constellation Grid with Parallax Drift */}
        <div 
          className="absolute inset-0 opacity-20 will-change-transform"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(0, 163, 255, 0.25) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 163, 255, 0.25) 1px, transparent 1px)
            `,
            backgroundSize: '4.5rem 4.5rem',
            transform: `translate3d(0, ${-scrollY * 0.06}px, 0)`
          }}
        />

        {/* Layer 3: Radiant Cosmic Ambient Light Glows */}
        <div 
          className="absolute -top-32 left-1/4 w-[800px] h-[800px] rounded-full bg-cyan-500/20 blur-[180px] will-change-transform"
          style={{
            transform: `translate3d(${Math.sin(scrollY * 0.0016) * 60}px, ${-scrollY * 0.2}px, 0)`
          }}
        />
        <div 
          className="absolute top-1/3 right-[-60px] w-[700px] h-[700px] rounded-full bg-blue-600/25 blur-[190px] will-change-transform"
          style={{
            transform: `translate3d(${Math.cos(scrollY * 0.0019) * -50}px, ${-scrollY * 0.25}px, 0)`
          }}
        />

        {/* Layer 4: Vignette Gradient for Perfect Contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#030611]/35 via-[#030611]/70 to-[#030611]/95 pointer-events-none" />
      </div>

      {/* ========================================================================= */}
      {/* 1. TOP ENTERPRISE STICKY NAVIGATION BAR (MATCHING TASKFLOW BRAND)        */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#030611]/85 backdrop-blur-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand matching reference */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/40 group-hover:scale-105 transition-transform">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block leading-tight">
                TaskFlow
              </span>
              <span className="text-[9px] font-bold tracking-[0.22em] uppercase text-cyan-400 block mt-0.5">
                PROJECT MANAGEMENT PLATFORM
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-300">
            <a href="#showcase" className="hover:text-cyan-400 transition-colors">Platform Modules</a>
            <a href="#features" className="hover:text-cyan-400 transition-colors">Capabilities</a>
            <a href="#security" className="hover:text-cyan-400 transition-colors">Enterprise Security</a>
            <a href="#metrics" className="hover:text-cyan-400 transition-colors">Telemetry</a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button 
                onClick={() => navigate('/dashboard')}
                className="bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] hover:from-[#0092E5] hover:to-[#00D0E5] text-white font-bold shadow-lg shadow-cyan-500/30 h-10 px-5 text-xs rounded-xl"
              >
                Go to Workspace <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <>
                <Link 
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all border border-slate-700/60 backdrop-blur-md"
                >
                  Sign In
                </Link>
                <Link 
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] hover:from-[#0092E5] hover:to-[#00D0E5] text-white text-xs font-bold shadow-lg shadow-cyan-500/30 hover:scale-102 transition-all cursor-pointer"
                >
                  <span>Launch Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO SECTION WITH PARALLAX MOTION & COSMIC GLOBE ELEVATION            */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-32 overflow-hidden z-10">
        
        {/* Floating 3D Depth Card 1 (Top Left) */}
        <div 
          className="hidden xl:flex absolute top-32 left-10 items-center gap-3.5 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,180,255,0.2)] text-xs z-20 pointer-events-none transition-transform duration-75 will-change-transform"
          style={{
            transform: `translate3d(${Math.sin(scrollY * 0.002) * 20}px, ${-scrollY * 0.35}px, 0)`
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm">18ms API Latency</div>
            <div className="text-[11px] text-slate-400 font-medium">Real-Time WebSocket Sync</div>
          </div>
        </div>

        {/* Floating 3D Depth Card 2 (Top Right) */}
        <div 
          className="hidden xl:flex absolute top-36 right-10 items-center gap-3.5 p-4 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-blue-500/30 shadow-[0_10px_30px_rgba(0,140,255,0.2)] text-xs z-20 pointer-events-none transition-transform duration-75 will-change-transform"
          style={{
            transform: `translate3d(${Math.cos(scrollY * 0.002) * -20}px, ${-scrollY * 0.45}px, 0)`
          }}
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-inner">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="font-extrabold text-white text-sm">96.2% AI Forecast</div>
            <div className="text-[11px] text-slate-400 font-medium">Neural Predictive Delivery</div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center space-y-6">
          
          {/* Top Pill Announcement */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/40 text-cyan-300 text-xs font-bold shadow-xl backdrop-blur-md hover:border-cyan-400 transition-colors cursor-default animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>TaskFlow Enterprise v2.5 Architecture Live</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-5xl mx-auto leading-[1.1] drop-shadow-xl">
            Global Project Intelligence for{' '}
            <span className="bg-gradient-to-r from-[#00A3FF] via-[#00E5FF] to-purple-400 bg-clip-text text-transparent">
              High-Velocity Teams
            </span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed drop-shadow-md">
            Eliminate operational silos with real-time Kanban task orchestration, machine learning delivery forecasting, automated OpenPDF & Excel reporting, and SOC2-compliant role governance across 140+ countries.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] hover:from-[#0092E5] hover:to-[#00D0E5] text-white font-extrabold text-sm shadow-xl shadow-cyan-500/40 hover:scale-105 transition-all cursor-pointer"
            >
              <span>Explore Workspace Sandbox</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a 
              href="#showcase"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-bold text-sm backdrop-blur-md hover:scale-102 transition-all shadow-lg cursor-pointer"
            >
              <Play className="w-4 h-4 text-cyan-400" />
              <span>Watch Interactive Tour</span>
            </a>
          </div>

          {/* 4 Circular Feature Badges matching reference aesthetic */}
          <div className="pt-8 flex items-center justify-center gap-6 sm:gap-12 flex-wrap">
            
            <div className="flex flex-col items-center text-center gap-2 group">
              <div className="w-12 h-12 rounded-full bg-[#0a152e]/90 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-slate-300 leading-tight">
                Work<br />Together
              </span>
            </div>

            <div className="flex flex-col items-center text-center gap-2 group">
              <div className="w-12 h-12 rounded-full bg-[#0a152e]/90 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-slate-300 leading-tight">
                Stay<br />Organized
              </span>
            </div>

            <div className="flex flex-col items-center text-center gap-2 group">
              <div className="w-12 h-12 rounded-full bg-[#0a152e]/90 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:scale-110 transition-transform">
                <BarChart3 className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-slate-300 leading-tight">
                Track<br />Progress
              </span>
            </div>

            <div className="flex flex-col items-center text-center gap-2 group">
              <div className="w-12 h-12 rounded-full bg-[#0a152e]/90 border border-cyan-500/35 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(0,180,255,0.25)] group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 stroke-[2]" />
              </div>
              <span className="text-xs font-semibold text-slate-300 leading-tight">
                Achieve<br />More
              </span>
            </div>

          </div>

          {/* Live Trust Metrics Ribbon */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-md">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>SOC2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-md">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>18ms API Latency</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-md">
              <CheckCircle2 className="w-4 h-4 text-indigo-400" />
              <span>99.99% SLA Uptime</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-md shadow-md">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>Zero-Trust RBAC</span>
            </div>
          </div>

          {/* 3D Hero Visual Preview Showcase */}
          <div 
            className="mt-14 relative rounded-3xl overflow-hidden border border-slate-700/80 shadow-[0_20px_70px_rgba(0,163,255,0.3)] max-w-5xl mx-auto group bg-slate-950/80 backdrop-blur-xl transition-all duration-300 will-change-transform"
            style={{
              transform: `perspective(1200px) rotateX(${Math.min(scrollY * 0.02, 6)}deg) translateY(${scrollY * -0.06}px)`,
              boxShadow: `0 ${20 + Math.min(scrollY * 0.05, 40)}px ${60 + Math.min(scrollY * 0.1, 80)}px rgba(0, 163, 255, 0.25)`
            }}
          >
            <img 
              src={heroShowcaseImg} 
              alt="TaskFlow Enterprise 3D Project Showcase" 
              className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-transparent to-transparent pointer-events-none" />
            
            {/* Floating Live Tags */}
            <div className="absolute bottom-6 left-6 right-6 hidden sm:flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/20 text-xs font-bold text-white shadow-2xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Live Portfolio Engine Active</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-white/20 text-xs font-bold text-white shadow-2xl">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Neural Predictive Heuristics: 96.2% Confidence</span>
              </div>
            </div>
          </div>

          {/* Animated Scroll Down Prompt */}
          <div 
            className="pt-8 flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-semibold transition-opacity duration-300 pointer-events-none"
            style={{ opacity: Math.max(1 - scrollY * 0.012, 0) }}
          >
            <span className="tracking-wide uppercase text-[11px] text-cyan-400 font-bold">Scroll to Explore Architecture</span>
            <div className="w-5 h-9 rounded-full border-2 border-cyan-500/50 flex items-start justify-center p-1 bg-slate-900/60 backdrop-blur-md">
              <div className="w-1.5 h-2.5 rounded-full bg-cyan-400 animate-bounce" />
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE PLATFORM MODULE SHOWCASE                                  */}
      {/* ========================================================================= */}
      <section id="showcase" className="py-24 border-t border-slate-800/80 relative z-10 overflow-hidden">
        
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none transition-transform duration-75 ease-out will-change-transform"
          style={{
            backgroundImage: `url(${motionGridBg})`,
            transform: `translate3d(0, ${(scrollY - 1000) * -0.15}px, 0) scale(1.08)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#030611] via-[#030611]/80 to-[#030611] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Integrated Enterprise Suite</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Engineered for Every Layer of Your Organization
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore four mission-critical modules built directly into the TaskFlow Enterprise architecture.
            </p>
          </div>

          {/* Interactive Tab Switcher */}
          <div className="flex p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 max-w-3xl mx-auto overflow-x-auto text-xs font-bold backdrop-blur-xl shadow-xl">
            {productTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] text-white shadow-lg shadow-cyan-500/30 font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Tab Showcase Display with Glass Elevation */}
          <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800/90 shadow-2xl backdrop-blur-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> {currentTab.badge}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {currentTab.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                {currentTab.desc}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                {currentTab.metrics.map((m, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center shadow-md">
                    <span className="text-lg font-black text-white block">{m.value}</span>
                    <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{m.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] hover:from-[#0092E5] hover:to-[#00D0E5] text-white text-xs font-bold shadow-md shadow-cyan-500/30 transition-all hover:scale-102 cursor-pointer"
                >
                  <span>Launch {currentTab.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right 3D Visual Preview */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl group bg-slate-950">
              <img 
                src={currentTab.image} 
                alt={currentTab.title} 
                className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE FEATURES GRID                                                    */}
      {/* ========================================================================= */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Enterprise Capabilities</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Built for Modern Fortune 500 Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Engineered with Java 25 Spring Boot 3, Hibernate JPA, React 18, and WebSocket state synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-7 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 hover:border-blue-500/60 transition-all space-y-4 shadow-xl group hover:scale-[1.02] hover:shadow-blue-500/10">
            <div className="h-12 w-12 rounded-2xl bg-blue-500/15 border border-blue-500/40 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">Kanban Velocity Board</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Interactive 4-stage Kanban columns (Upcoming, In Progress, In Review, Completed) with task number tracking and inline stage transitions.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 hover:border-purple-500/60 transition-all space-y-4 shadow-xl group hover:scale-[1.02] hover:shadow-purple-500/10">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/15 border border-purple-500/40 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Cpu className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">Neural Risk Heuristics</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Automated AI sprint recommendations, deadline confidence scores, and developer burnout heat maps based on active task velocities.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 hover:border-emerald-500/60 transition-all space-y-4 shadow-xl group hover:scale-[1.02] hover:shadow-emerald-500/10">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Download className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">Multi-Format Exports</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generate formatted multi-sheet Excel workbooks, executive PDF briefing documents, and UTF-8 encoded CSV workforce data streams.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 hover:border-rose-500/60 transition-all space-y-4 shadow-xl group hover:scale-[1.02] hover:shadow-rose-500/10">
            <div className="h-12 w-12 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">Zero-Trust RBAC Governance</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              6 discrete role hierarchies (Super Admin, Admin, Project Manager, Team Lead, Employee, Client) with method-level authorization.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 hover:border-cyan-500/60 transition-all space-y-4 shadow-xl group hover:scale-[1.02] hover:shadow-cyan-500/10">
            <div className="h-12 w-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">Real-Time WebSockets</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Instant notification dispatch and cross-team board synchronization via STOMP / WebSocket protocol with live status pulses.
            </p>
          </div>

          <div className="p-7 rounded-3xl bg-slate-900/85 backdrop-blur-xl border border-slate-800 hover:border-amber-500/60 transition-all space-y-4 shadow-xl group hover:scale-[1.02] hover:shadow-amber-500/10">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="text-lg font-black text-white">Organization & Hierarchy</h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Tree-based corporate hierarchy visualization mapping headquarters, departments, cross-functional squads, and direct reports.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-24 border-t border-slate-800/80 relative z-10 overflow-hidden">
        
        <div 
          className="absolute inset-0 bg-cover bg-bottom opacity-35 pointer-events-none transition-transform duration-75 will-change-transform"
          style={{
            backgroundImage: `url(${motionGridBg})`,
            transform: `translate3d(0, ${(scrollY - 2600) * -0.12}px, 0) scale(1.08)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-[#030611]/80 to-[#030611] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Zero-Downtime Multi-Tenant Platform Ready
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Accelerate Your Enterprise Delivery?
          </h2>
          <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Test the complete system now with pre-configured demo personas or sign in with your enterprise credentials.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#00A3FF] to-[#00E5FF] hover:from-[#0092E5] hover:to-[#00D0E5] text-white font-black text-sm shadow-xl shadow-cyan-500/40 hover:scale-105 transition-all cursor-pointer"
            >
              Sign In to TaskFlow Enterprise <ArrowRight className="w-4 h-4 inline-block ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. ENTERPRISE FOOTER                                                     */}
      {/* ========================================================================= */}
      <footer className="border-t border-slate-800/80 bg-[#02040a] py-12 text-slate-400 text-xs relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm">TaskFlow</span>
              <span className="text-[10px] text-slate-500 block">© {new Date().getFullYear()} Enterprise SaaS Inc. All rights reserved.</span>
            </div>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" /> SOC2 Type II Certified
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Server className="w-4 h-4 text-emerald-400" /> ISO 27001 Certified
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
