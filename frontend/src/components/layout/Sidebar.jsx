import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Building2, 
  BarChart3, 
  FileText, 
  Bell, 
  Settings, 
  Sparkles,
  ChevronLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { APP_NAME } from '../../constants';

const navGroups = [
  {
    group: 'CORE WORKSPACE',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: 'Live' },
      { label: 'AI Intelligence', path: '/ai-intelligence', icon: Sparkles, badge: 'AI v2' },
      { label: 'Projects Engine', path: '/projects', icon: FolderKanban },
      { label: 'Tasks & Kanban', path: '/tasks/kanban', icon: CheckSquare, badge: 'Agile' },
    ]
  },
  {
    group: 'ORGANIZATION',
    items: [
      { label: 'Team Directory', path: '/employees', icon: Users },
      { label: 'Departments', path: '/departments', icon: Building2 },
      { label: 'Org Hierarchy', path: '/analytics', icon: BarChart3 },
    ]
  },
  {
    group: 'GOVERNANCE & SYSTEM',
    items: [
      { label: 'Reports & Export', path: '/reports', icon: FileText },
      { label: 'Notifications', path: '/notifications', icon: Bell },
      { label: 'Enterprise Settings', path: '/settings', icon: Settings },
    ]
  }
];

export const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-slate-900 border-r border-slate-800 text-slate-100 flex flex-col justify-between ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-purple-600 font-black text-white text-lg shadow-lg shadow-brand-500/30 border border-white/20">
              TF
            </div>
            {isOpen && (
              <div className="min-w-0">
                <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5 truncate">
                  {APP_NAME} <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">v2.5</span>
                </span>
                <p className="text-[10px] text-slate-400 font-medium truncate">Enterprise Workspace</p>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-8.5rem)]">
          {navGroups.map((grp, grpIdx) => (
            <div key={grpIdx} className="space-y-1">
              {isOpen && (
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {grp.group}
                </div>
              )}
              {grp.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 group ${
                        isActive
                          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-md shadow-brand-600/30 font-black'
                          : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Icon className="w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-110" />
                      {isOpen && <span className="truncate">{item.label}</span>}
                    </div>
                    {isOpen && item.badge && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-slate-800 text-brand-300 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Bottom Tenant & Status Pill */}
      {isOpen ? (
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-white truncate">Global Cloud Node</p>
                <p className="text-[10px] text-slate-400 truncate">SOC2 & 99.99% SLA</p>
              </div>
            </div>
            <Zap className="w-3.5 h-3.5 text-brand-400 shrink-0" />
          </div>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800 flex justify-center">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" title="System Operational" />
        </div>
      )}
    </aside>
  );
};
