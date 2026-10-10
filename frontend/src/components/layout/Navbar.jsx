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
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 backdrop-blur-md text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Left: Mobile Toggle & Global Search Bar */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar matching screenshot */}
        <div className="relative">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-3 w-64 md:w-96 px-3.5 py-2 text-xs rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 text-slate-400 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all text-left shadow-2xs group"
          >
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 shrink-0" />
            <span className="truncate flex-1 font-normal text-slate-500 dark:text-slate-400">Search tasks, projects, people...</span>
            <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-[10px] font-medium text-slate-400 shadow-2xs">
              Ctrl K
            </kbd>
          </button>
        </div>
      </div>

      {/* Right: Notifications & User Profile matching screenshot */}
      <div className="flex items-center gap-4">

        {/* Notifications Bell matching screenshot with red badge */}
        <Link
          to="/notifications"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
        </Link>

        {/* User Account Menu matching screenshot */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-3 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
            aria-expanded={dropdownOpen}
            aria-label="User account menu"
          >
            <div className="h-9 w-9 rounded-full bg-[#1E3A8A] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
              HS
            </div>
            <div className="hidden md:flex flex-col">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                Hidayathullah
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-400 leading-tight">
                Developer
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
          </button>

          {dropdownOpen && (
            <div 
              onMouseLeave={() => setDropdownOpen(false)}
              className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1.5 shadow-xl z-50 text-xs text-slate-700 dark:text-slate-200 animate-fade-in"
            >
              <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700/60 mb-1">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Hidayathullah'}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user?.email || 'hidayath@taskflow.enterprise'}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  <ShieldCheck className="w-3 h-3 text-indigo-500" />
                  {user?.roles?.[0]?.replace('ROLE_', '') || 'Developer'}
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
