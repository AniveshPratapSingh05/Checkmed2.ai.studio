import React, { Component, useState, useEffect, ErrorInfo, ReactNode } from 'react';
import { store, AUTHORIZED_ADMINS } from '../../lib/store';
import { AdminUser } from '../../types';
import { MainAdminDashboard } from './MainAdminDashboard';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';

interface AdminDashboardProps {
  setActiveView: (view: string) => void;
}

interface ErrorBoundaryProps {
  children?: ReactNode;
  onReset?: () => void;
  onBack?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class AdminErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Admin Dashboard caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-[#0F172A] border border-[#1E293B] rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Unable to load Admin Dashboard</h2>
              <p className="text-sm text-slate-400">
                A rendering issue occurred while displaying the administration module.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#070B14] border border-[#1E293B] rounded-2xl p-4 text-left overflow-x-auto text-xs text-rose-300 font-mono">
                {this.state.error.message || 'Unknown render error'}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  this.props.onReset?.();
                }}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Retry Dashboard</span>
              </button>

              <button
                onClick={() => this.props.onBack?.()}
                className="w-full py-3 bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white font-bold text-xs rounded-xl border border-[#334155] flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Welcome</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveView }) => {
  const [activeAdmin, setActiveAdmin] = useState<AdminUser | null>(store.activeAdminUser || AUTHORIZED_ADMINS.main);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setActiveAdmin(store.activeAdminUser || AUTHORIZED_ADMINS.main);
    });
    return () => unsubscribe();
  }, []);

  const handleReset = () => {
    setReloadKey(prev => prev + 1);
  };

  const handleBack = () => {
    store.switchAccount();
    setActiveView('welcome');
  };

  const currentAdmin = activeAdmin || store.activeAdminUser || AUTHORIZED_ADMINS.main;

  return (
    <div key={reloadKey}>
      <AdminErrorBoundary onReset={handleReset} onBack={handleBack}>
        <MainAdminDashboard setActiveView={setActiveView} adminUser={currentAdmin} />
      </AdminErrorBoundary>
    </div>
  );
};
