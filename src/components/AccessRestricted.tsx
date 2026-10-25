import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, UserCheck, AlertTriangle } from 'lucide-react';
import { UserRole } from '../types';
import { store } from '../lib/store';

interface AccessRestrictedProps {
  requiredRole?: string | string[];
  currentRole: UserRole;
  attemptedDashboardName: string;
  onReturnToDashboard: () => void;
}

export const AccessRestricted: React.FC<AccessRestrictedProps> = ({
  requiredRole,
  currentRole,
  attemptedDashboardName,
  onReturnToDashboard
}) => {
  const getRoleDisplayName = (r: UserRole) => {
    switch (r) {
      case 'patient': return 'Patient';
      case 'doctor': return 'Doctor / Clinician';
      case 'admin': return 'Hospital Administrator';
      case 'staff': return `Hospital Staff (${store.currentStaffRole || 'Operational'})`;
      case 'guest': return 'Guest / Unauthenticated';
      default: return r;
    }
  };

  return (
    <div className="min-h-screen bg-[#070B14] flex items-center justify-center p-4 sm:p-6 text-white font-sans">
      <div className="max-w-lg w-full bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-rose-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-rose-950/40 text-center space-y-6 relative overflow-hidden">
        
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-rose-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Shield Warning Icon */}
        <div className="w-20 h-20 rounded-3xl bg-rose-500/10 border-2 border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg shadow-rose-500/20">
          <ShieldAlert className="w-10 h-10 animate-pulse text-rose-400" />
        </div>

        {/* Title & Restriction Notice */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Security & Role Enforcement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Access Restricted
          </h1>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            You do not have permission to access the <strong className="text-white">{attemptedDashboardName}</strong>. CheckMed enforces strict role-based access control.
          </p>
        </div>

        {/* Role Inspection Card */}
        <div className="bg-[#070B14]/80 border border-[#334155] rounded-2xl p-4 text-left text-xs space-y-2">
          <div className="flex items-center justify-between py-1 border-b border-[#334155]/60">
            <span className="text-slate-400 font-medium">Your Current Authenticated Role:</span>
            <span className="font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
              {getRoleDisplayName(currentRole)}
            </span>
          </div>
          {requiredRole && (
            <div className="flex items-center justify-between py-1 border-b border-[#334155]/60">
              <span className="text-slate-400 font-medium">Required Authorization:</span>
              <span className="font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20">
                {Array.isArray(requiredRole) ? requiredRole.join(' or ') : requiredRole}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between py-1 text-slate-400">
            <span>Security Policy:</span>
            <span className="text-emerald-400 font-medium">Active (Zero-Trust Verified)</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-return-my-dashboard"
            onClick={onReturnToDashboard}
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:from-[#0369A1] hover:to-[#0284C7] text-white text-sm font-black rounded-2xl shadow-xl shadow-[#0284C7]/30 transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to My Dashboard</span>
          </button>
        </div>

        <p className="text-[11px] text-slate-400">
          If you believe this is an error, please contact your CheckMed Hospital Administrator.
        </p>

      </div>
    </div>
  );
};
