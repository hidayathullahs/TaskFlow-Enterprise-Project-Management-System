import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { GlobalSearchModal } from '../dashboard/GlobalSearchModal';
import { CreateProjectModal } from '../dashboard/CreateProjectModal';
import { CreateTaskModal } from '../dashboard/CreateTaskModal';
import { projectService } from '../../services/projectService';
import { taskService } from '../../services/taskService';

export const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Background fetch for global search palette
    projectService.getAll().then((res) => {
      const list = res?.data?.content || res?.data || [];
      if (Array.isArray(list)) setProjects(list);
    }).catch(() => {});

    taskService.getAll().then((res) => {
      const list = res?.data?.content || res?.data || [];
      if (Array.isArray(list)) setTasks(list);
    }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className={`transition-all duration-200 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenCreateProject={() => setCreateProjectOpen(true)}
          onOpenCreateTask={() => setCreateTaskOpen(true)}
        />
        <main className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global Modals accessible from Top Navbar anywhere */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        projects={projects}
        tasks={tasks}
      />

      <CreateProjectModal
        isOpen={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        onProjectCreated={() => {
          projectService.getAll().then((res) => {
            const list = res?.data?.content || res?.data || [];
            if (Array.isArray(list)) setProjects(list);
          });
        }}
      />

      <CreateTaskModal
        isOpen={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        projects={projects}
        onTaskCreated={() => {
          taskService.getAll().then((res) => {
            const list = res?.data?.content || res?.data || [];
            if (Array.isArray(list)) setTasks(list);
          });
        }}
      />
    </div>
  );
};
