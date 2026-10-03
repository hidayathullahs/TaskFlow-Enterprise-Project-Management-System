import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon, Bell, Search, LogOut, User, Settings, Shield } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        setUnreadCount(res.data || 0);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 backdrop-blur-xl text-slate-100 transition-colors">
      {/* Left: Mobile Toggle & Global Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        {/* Workspace Title Pill */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-400">
          <span className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            🏢 Production Workspace
          </span>
          <span className="text-slate-600">/</span>
          <span className="text-brand-400 font-extrabold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Live Sync
          </span>
        </div>

        <div className="relative hidden md:block w-80">
          <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects, tasks, sprints..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-1.5 pl-10 pr-12 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-brand-500 transition-all"
          />
          <kbd className="absolute right-3 top-2 px-1.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right: Quick Action, Notifications, Profile Dropdown */}
      <div className="flex items-center gap-3">
        {/* Quick Task Action Button */}
        <a
          href="/tasks/kanban"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-brand-500/20 hover:scale-102 transition-all"
        >
          <span>+ New Task</span>
        </a>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Toggle Theme"
        >
          {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-slate-300" />}
        </button>

        {/* Notification Bell */}
        <a
          href="/notifications"
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 ? (
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
              {unreadCount}
            </span>
          ) : (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          )}
        </a>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700/60"
          >
            <div className="relative">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 font-bold text-white shadow-md text-sm border border-white/20">
                {user?.firstName?.[0] || 'A'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </div>
            <div className="hidden text-left md:block">
              <p className="text-xs font-bold text-white">
                {user?.firstName || 'Super'} {user?.lastName || 'Admin'}
              </p>
              <p className="text-[10px] text-brand-400 font-semibold tracking-wide">
                {user?.roles?.[0]?.replace('ROLE_', '') || 'SUPER_ADMIN'}
              </p>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-800 bg-slate-900/95 backdrop-blur-xl py-1.5 shadow-2xl z-50 animate-fade-in text-slate-100">
              <div className="px-4 py-3 border-b border-slate-800">
                <p className="text-sm font-black text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-slate-400 truncate mt-0.5">{user?.email}</p>
                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30">
                  <Shield className="w-3 h-3 text-brand-400" /> Enterprise Role
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <a
                  href="/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <User className="w-4 h-4 text-brand-400" /> Profile & Credentials
                </a>
                <a
                  href="/settings"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <Settings className="w-4 h-4 text-purple-400" /> Organization Settings
                </a>
              </div>

              <div className="border-t border-slate-800 my-1" />
              <div className="p-1">
                <button
                  onClick={logout}
                  className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out from Workspace
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
