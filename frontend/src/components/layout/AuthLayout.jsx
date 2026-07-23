import React from 'react';
import { Outlet } from 'react-router-dom';
import { APP_NAME } from '../../constants';

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row bg-slate-50 dark:bg-slate-900">
      {/* Left Banner */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-brand-900 via-brand-700 to-slate-900 p-12 text-white relative overflow-hidden">
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -left-20 -bottom-20 h-96 w-96 rounded-full bg-brand-400/20 blur-3xl" />

        <div className="flex items-center gap-3 z-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-black text-brand-700 text-xl shadow-lg">
            TF
          </div>
          <span className="text-xl font-bold tracking-tight">{APP_NAME} Enterprise</span>
        </div>

        <div className="space-y-6 z-10">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight">
            Streamline Enterprise Workflows & Real-Time Project Collaboration.
          </h1>
          <p className="text-sm text-brand-100/90 leading-relaxed max-w-lg">
            Centralized platform for projects, departments, team Kanban boards, automated deadline analytics, and role-based enterprise access control.
          </p>
        </div>

        <div className="text-xs text-brand-200/70 z-10">
          © {new Date().getFullYear()} TaskFlow Inc. All rights reserved. Enterprise Production v1.0.0
        </div>
      </div>

      {/* Right Form Container */}
      <div className="flex flex-1 items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
