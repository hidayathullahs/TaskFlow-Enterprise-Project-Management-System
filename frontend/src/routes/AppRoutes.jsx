import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { AuthLayout } from '../components/layout/AuthLayout';
import { DashboardLayout } from '../components/layout/DashboardLayout';

import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../pages/auth/VerifyEmailPage';
import { VerifyOtpPage } from '../pages/auth/VerifyOtpPage';

import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { EmployeeListPage } from '../pages/employees/EmployeeListPage';
import { EmployeeDetailPage } from '../pages/employees/EmployeeDetailPage';
import { DepartmentListPage } from '../pages/departments/DepartmentListPage';
import { TeamListPage } from '../pages/teams/TeamListPage';
import { OrgChartPage } from '../pages/organization/OrgChartPage';

import { ProjectListPage } from '../pages/projects/ProjectListPage';
import { ProjectDetailPage } from '../pages/projects/ProjectDetailPage';

import { KanbanBoardPage } from '../pages/tasks/KanbanBoardPage';
import { TaskListPage } from '../pages/tasks/TaskListPage';
import { TaskDetailPage } from '../pages/tasks/TaskDetailPage';

import { ReportsPage } from '../pages/reports/ReportsPage';
import { NotificationsPage } from '../pages/notifications/NotificationsPage';
import { AiDashboardPage } from '../pages/ai/AiDashboardPage';

import { NotFoundPage } from '../pages/notFound/NotFoundPage';
import { UnauthorizedPage } from '../pages/unauthorized/UnauthorizedPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
      </Route>

      {/* Protected Dashboard & Module Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<ProfilePage />} />

          {/* Phase 7: Employee, Department & Team Management Routes */}
          <Route path="/employees" element={<EmployeeListPage />} />
          <Route path="/employees/:id" element={<EmployeeDetailPage />} />
          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/teams" element={<TeamListPage />} />
          <Route path="/analytics" element={<OrgChartPage />} />

          {/* Phase 8: Project Management Engine Routes */}
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />

          {/* Phase 9: Task Management & Interactive Kanban Board Routes */}
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/kanban" element={<KanbanBoardPage />} />
          <Route path="/tasks/:id" element={<TaskDetailPage />} />

          {/* Phase 10: Reports & Export Engine Routes */}
          <Route path="/reports" element={<ReportsPage />} />

          {/* Phase 11: Real-Time Notifications & WebSockets Routes */}
          <Route path="/notifications" element={<NotificationsPage />} />

          {/* Phase 12: Advanced AI & Predictive Analytics Routes */}
          <Route path="/ai-intelligence" element={<AiDashboardPage />} />
        </Route>
      </Route>

      {/* Error & Unauthorized Routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
