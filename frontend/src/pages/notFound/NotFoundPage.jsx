import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center bg-slate-50 dark:bg-slate-900">
      <div className="p-4 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 mb-4">
        <FileQuestion className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-slate-100">404 - Page Not Found</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-md">
        The requested resource or endpoint does not exist on TaskFlow Enterprise System.
      </p>
      <div className="mt-6">
        <Link to="/dashboard">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" /> Return to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
