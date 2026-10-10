import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  Sun, 
  Moon, 
  Bell, 
  Search, 
  LogOut, 
  User, 
  Settings, 
  ShieldCheck, 
  Menu, 
  Plus, 
  FolderPlus, 
  CheckSquare, 
  ChevronDown 
} from 'lucide-react';
import { notificationService } from '../../services/notificationService';

export const Navbar = ({ onToggleSidebar, onOpenSearch, onOpenCreateProject, onOpenCreateTask }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [createDropdownOpen, setCreateDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await notificationService.getUnreadCount();
        setUnreadCount(res.data || 0);
      } catch (err) {
        // silent fallback
      }
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 px-4 md:px-6 backdrop-blur-md text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Left: Mobile Toggle, Breadcrumb & Global Search */}
      <div className="flex items-center gap-3 md:gap-5">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-md text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Contextual Breadcrumb */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <span className="font-medium text-slate-400 dark:text-slate-500">Workspace</span>
          <span className="text-slate-300 dark:text-slate-600">/</span>
          <span className="font-semibold text-slate-800 dark:text-slate-200">Overview</span>
        </nav>

        {/* Global Search Bar */}
        <div className="relative">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2.5 w-48 sm:w-64 md:w-80 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all text-left shadow-2xs group"
          >
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0" />
            <span className="truncate flex-1">Search projects, tasks, files...</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-mono text-slate-400 shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right: Quick Actions, Theme, Notifications & Account Menu */}
      <div className="flex items-center gap-2 md:gap-3">
        
        {/* Quick Action Dropdown */}
        <div className="relative">
          <button
            onClick={() => setCreateDropdownOpen(!createDropdownOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New</span>
            <ChevronDown className="w-3 h-3 text-indigo-200" />
          </button>

          {createDropdownOpen && (
            <div 
              onMouseLeave={() => setCreateDropdownOpen(false)}
              className="absolute right-0 mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 shadow-lg z-50 text-xs text-slate-700 dark:text-slate-200 animate-fade-in"
            >
              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  if (onOpenCreateProject) onOpenCreateProject();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors text-left"
              >
                <FolderPlus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-medium">New Project</span>
              </button>
              <button
                onClick={() => {
                  setCreateDropdownOpen(false);
                  if (onOpenCreateTask) onOpenCreateTask();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors text-left"
              >
                <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-medium">New Task</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600" />
          )}
        </button>

        {/* Notifications Bell */}
        <Link
          to="/notifications"
          className="relative p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Link>

        {/* User Account Menu */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-expanded={dropdownOpen}
            aria-label="User account menu"
          >
            <div className="h-7 w-7 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
              {user?.firstName?.[0] || 'A'}
            </div>
            <span className="hidden md:block text-xs font-semibold text-slate-800 dark:text-slate-200">
              {user?.firstName || 'User'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div 
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-xl z-50 text-xs text-slate-700 dark:text-slate-200 animate-fade-in"
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user?.email}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-indigo-500" />
                  {user?.roles?.[0]?.replace('ROLE_', '') || 'Member'}
                </span>
              </div>

              <Link
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Profile & Account</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Workspace Settings</span>
              </Link>

              <div className="border-t border-slate-100 dark:border-slate-700/60 my-1" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left font-medium"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};
