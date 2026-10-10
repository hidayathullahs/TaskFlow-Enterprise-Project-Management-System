import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Home, 
  FolderKanban, 
  CheckSquare, 
  Users, 
  Columns3, 
  BarChart3, 
  Bell, 
  Settings, 
  Sparkles,
  ChevronLeft,
  ChevronDown,
  Building2,
  Shield,
  LogOut,
  Zap
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { APP_NAME } from '../../constants';

export const Sidebar = ({ isOpen, onToggle }) => {
  const { user, logout } = useAuth();

  const navGroups = [
    {
      group: 'WORKSPACE',
      items: [
        { label: 'Home', path: '/dashboard', icon: Home, end: true },
        { label: 'My Tasks', path: '/tasks', icon: CheckSquare, badge: '4' },
        { label: 'Projects', path: '/projects', icon: FolderKanban, badge: '4' },
        { label: 'Kanban Board', path: '/tasks/kanban', icon: Columns3 },
        { label: 'Team', path: '/employees', icon: Users },
      ]
    },
    {
      group: 'ANALYTICS & GOVERNANCE',
      items: [
        { label: 'Reports', path: '/reports', icon: BarChart3 },
        { label: 'AI Intelligence', path: '/ai-intelligence', icon: Sparkles, badge: 'AI' },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Settings', path: '/settings', icon: Settings },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-200 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 flex flex-col justify-between select-none ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div>
          {/* Brand Header & Workspace Selector */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200/80 dark:border-slate-800">
            <Link to="/dashboard" className="flex items-center gap-3 min-w-0 group">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-sm shadow-xs transition-transform group-hover:scale-105">
                TF
              </div>
              {isOpen && (
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
                      {APP_NAME}
                    </span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60">
                      Enterprise
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate flex items-center gap-1">
                    <span>Acme Production</span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </p>
                </div>
              )}
            </Link>

            <button
              onClick={onToggle}
              className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              aria-label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
            >
              <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${!isOpen && 'rotate-180'}`} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-5 overflow-y-auto max-h-[calc(100vh-8.5rem)]">
            {navGroups.map((grp, grpIdx) => (
              <div key={grpIdx} className="space-y-1">
                {isOpen && (
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    {grp.group}
                  </div>
                )}
                {grp.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors duration-150 group ${
                          isActive
                            ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border-l-2 border-indigo-600 shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 transition-transform group-hover:scale-105" />
                        {isOpen && <span className="truncate">{item.label}</span>}
                      </div>
                      {isOpen && item.badge && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
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

        {/* User Profile Snippet & Workspace Status */}
        <div className="p-3 border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          {isOpen ? (
            <div className="flex items-center justify-between gap-2 p-1.5 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center shrink-0">
                  {user?.firstName?.[0] || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                    {user?.firstName || 'User'} {user?.lastName || ''}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                    {user?.roles?.[0]?.replace('ROLE_', '') || 'Team Member'}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Sign Out"
                aria-label="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div 
                className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center"
                title={`${user?.firstName} ${user?.lastName}`}
              >
                {user?.firstName?.[0] || 'U'}
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
