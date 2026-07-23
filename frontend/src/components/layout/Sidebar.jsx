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
  ChevronLeft
} from 'lucide-react';
import { APP_NAME } from '../../constants';

const navItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'AI Intelligence', path: '/ai-intelligence', icon: Sparkles },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Tasks & Kanban', path: '/tasks/kanban', icon: CheckSquare },
  { label: 'Employees', path: '/employees', icon: Users },
  { label: 'Departments', path: '/departments', icon: Building2 },
  { label: 'Org Hierarchy', path: '/analytics', icon: BarChart3 },
  { label: 'Reports & Export', path: '/reports', icon: FileText },
  { label: 'Notifications', path: '/notifications', icon: Bell },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export const Sidebar = ({ isOpen, onToggle }) => {
  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-extrabold text-white text-lg shadow-md shadow-brand-500/30">
            TF
          </div>
          {isOpen && (
            <span className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
              {APP_NAME} <span className="text-xs font-normal text-brand-600">Enterprise</span>
            </span>
          )}
        </div>
        <button
          onClick={onToggle}
          className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeft className={`w-5 h-5 transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-4rem)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
