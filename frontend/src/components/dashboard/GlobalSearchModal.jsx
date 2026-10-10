import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FolderKanban, CheckSquare, ArrowRight, X } from 'lucide-react';

export const GlobalSearchModal = ({ isOpen, onClose, projects = [], tasks = [] }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(false); // toggle trigger handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.name?.toLowerCase().includes(query.toLowerCase()) ||
      p.code?.toLowerCase().includes(query.toLowerCase())
  );

  const filteredTasks = tasks.filter(
    (t) =>
      t.title?.toLowerCase().includes(query.toLowerCase()) ||
      t.taskNumber?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
      />

      {/* Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden z-10 animate-fade-in">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, tasks, deliverables... (type keyword)"
            className="w-full py-3.5 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 bg-transparent focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <kbd className="ml-2 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-[10px] text-slate-400 font-mono">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Projects Section */}
          <div>
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Projects ({filteredProjects.length})
            </div>
            {filteredProjects.length === 0 ? (
              <p className="px-3 py-2 text-xs text-slate-400 italic">No matching projects found</p>
            ) : (
              filteredProjects.slice(0, 4).map((p) => (
                <button
                  key={p.publicId}
                  onClick={() => handleSelect(`/projects/${p.publicId}`)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FolderKanban className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 truncate block">
                        {p.name}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {p.code} · {p.status}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))
            )}
          </div>

          {/* Tasks Section */}
          <div className="border-t border-slate-100 dark:border-slate-700/60 pt-2">
            <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Tasks ({filteredTasks.length})
            </div>
            {filteredTasks.length === 0 ? (
              <p className="px-3 py-2 text-xs text-slate-400 italic">No matching tasks found</p>
            ) : (
              filteredTasks.slice(0, 5).map((t) => (
                <button
                  key={t.publicId}
                  onClick={() => handleSelect(`/tasks/${t.publicId}`)}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 truncate block">
                        {t.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {t.taskNumber || 'TASK'} · {t.priority} · Due {t.dueDate || 'Pending'}
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with click or arrow keys</span>
          <span>TaskFlow Unified Quick Search</span>
        </div>
      </div>
    </div>
  );
};
