import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  CheckSquare, 
  FolderKanban, 
  Map, 
  Calendar, 
  Users, 
  BarChart2, 
  MessageSquare, 
  Check, 
  Settings, 
  PanelLeftClose, 
  PanelLeftOpen,
  Scan 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Sidebar = ({ isOpen, onToggle }) => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home, end: true },
    { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Roadmap', path: '/tasks/kanban', icon: Map },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Team', path: '/employees', icon: Users },
    { label: 'Reports', path: '/reports', icon: BarChart2 },
    { label: 'Messages', path: '/notifications', icon: MessageSquare, badge: 3 },
  ];

  const favorites = [
    { label: 'Product Launch', color: 'bg-amber-400' },
    { label: 'Mobile App', color: 'bg-fuchsia-500' },
    { label: 'Design System', color: 'bg-cyan-400' },
  ];

  const userInitials = 'HS';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onToggle}
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-200 bg-white border-r border-slate-200/80 text-slate-700 flex flex-col justify-between select-none ${
          isOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Logo & Header */}
            <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
              <div className="flex items-center gap-3 min-w-0">
                {/* Blue square with white checkmark icon */}
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                  <Check className="w-5 h-5 stroke-[2.5]" />
                </div>
                {isOpen && (
                  <span className="text-lg font-bold tracking-tight text-slate-900">
                    TaskFlow
                  </span>
                )}
              </div>

              <button
                onClick={onToggle}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                aria-label="Toggle sidebar"
              >
                <Scan className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation Links */}
            <nav className="p-3 space-y-0.5 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all duration-150 font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white font-semibold shadow-sm'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                          {isOpen && <span className="truncate">{item.label}</span>}
                        </div>
                        {isOpen && item.badge && (
                          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}

              {/* Favorites Section */}
              {isOpen && (
                <div className="pt-4 pb-1">
                  <div className="px-3 pb-1.5 text-[11px] font-semibold tracking-wider uppercase text-slate-400">
                    Favorites
                  </div>
                  <div className="space-y-0.5">
                    {favorites.map((fav, idx) => (
                      <NavLink
                        key={idx}
                        to="/projects"
                        className="flex items-center gap-3 px-3 py-1.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      >
                        <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${fav.color}`} />
                        <span className="truncate">{fav.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </nav>
          </div>

          {/* Workspaces Section at Bottom */}
          <div className="p-4 border-t border-slate-100 bg-white">
            {isOpen ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1 text-[11px] font-semibold text-slate-400">
                  <span>Workspaces</span>
                  <button className="text-slate-400 hover:text-slate-600 transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                  <div className="h-9 w-9 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {userInitials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      TaskFlow Team
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      Enterprise Plan
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="h-9 w-9 rounded-full bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                  {userInitials}
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
