import React from 'react';
import { Shield, UserCheck, Stethoscope, Activity, Heart, Eye, Microscope, Wrench, Droplet, Scissors } from 'lucide-react';
import { store } from '../../../lib/store';
import { StaffRole } from '../../../types';

interface RoleAccessBarProps {
  currentRole: StaffRole;
  onRoleChange: (role: StaffRole) => void;
}

const ROLES: { role: StaffRole; label: string; icon: React.FC<{ className?: string }> }[] = [
  { role: 'Admin', label: 'Hospital Admin', icon: Shield },
  { role: 'Doctor', label: 'Attending Doctor', icon: Stethoscope },
  { role: 'Nurse', label: 'Nurse / Ward Incharge', icon: UserCheck },
  { role: 'Lab Technician', label: 'Lab Tech (Pathology)', icon: Microscope },
  { role: 'Radiology Technician', label: 'Rad Tech (X-Ray/CT/MRI)', icon: Activity },
  { role: 'Radiologist', label: 'Radiologist (Verification)', icon: Activity },
  { role: 'Cardiologist', label: 'Cardiologist', icon: Heart },
  { role: 'OT Staff', label: 'OT Coordinator', icon: Scissors },
  { role: 'Blood Bank Staff', label: 'Blood Bank Officer', icon: Droplet },
  { role: 'Equipment Manager', label: 'Biomedical Manager', icon: Wrench },
];

export const RoleAccessBar: React.FC<RoleAccessBarProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-3 shadow-md mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#94A3B8]">
        <Shield className="w-4 h-4 text-[#38BDF8]" />
        <span>Active Clinical Authorization Role:</span>
        <span className="text-white font-bold bg-[#0F172A] px-2.5 py-1 rounded-md border border-[#334155] text-xs flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></span>
          {currentRole}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[11px] text-[#64748B] mr-1 hidden lg:inline">Switch Role:</span>
        {ROLES.map(({ role, label, icon: Icon }) => (
          <button
            key={role}
            onClick={() => {
              store.setStaffRole(role);
              onRoleChange(role);
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
              currentRole === role
                ? 'bg-[#38BDF8] text-[#0F172A] font-bold shadow-md'
                : 'bg-[#0F172A] text-[#94A3B8] hover:text-white hover:bg-[#334155]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
