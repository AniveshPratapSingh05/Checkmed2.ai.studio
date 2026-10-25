import React from 'react';
import { Doctor } from '../../types';
import { store } from '../../lib/store';
import { 
  Users, Calendar, CheckCircle2, Clock, AlertTriangle, 
  Pill, FileText, Activity, ArrowUpRight 
} from 'lucide-react';

interface DoctorSummaryCardsProps {
  doctor: Doctor;
  onCardClick?: (filterType: string) => void;
}

export const DoctorSummaryCards: React.FC<DoctorSummaryCardsProps> = ({ doctor, onCardClick }) => {
  const doctorPatients = store.getDoctorPatients(doctor.id);
  const doctorAppointments = store.getDoctorAppointments(doctor.id);
  
  const todayStr = '2026-08-14'; // Match app timeline or current day
  const todayAppointments = doctorAppointments.filter(
    a => a.appointment_date === todayStr || a.appointment_date.startsWith('2026-08')
  );

  const completedConsultations = doctorAppointments.filter(a => a.status === 'Completed').length;
  const pendingAppointments = doctorAppointments.filter(
    a => a.status === 'Upcoming' || a.status === 'In-Progress'
  ).length;

  // Critical Patients (e.g. patients with abnormal reports, ICU history, or severe conditions)
  const criticalPatientsCount = doctorPatients.filter(
    p => p.medical_history?.toLowerCase().includes('critical') || 
         p.medical_history?.toLowerCase().includes('severe') || 
         p.medical_history?.toLowerCase().includes('cad') ||
         p.age >= 60
  ).length;

  // Active Prescriptions authored by this doctor
  const activePrescriptionsCount = store.prescriptions.filter(
    p => p.doctor_id === doctor.id || p.doctor_name.toLowerCase().includes(doctor.full_name.toLowerCase())
  ).length;

  // Pending reports needing doctor review
  const doctorReports = store.labReports.filter(l => l.status === 'Sample Pending' || l.status === 'Processing').length +
                        store.cardiologyRecords.filter(c => c.status === 'Investigation Scheduled' || c.status === 'Consultation').length +
                        store.xrayRecords.filter(x => x.status === 'Requested' || x.status === 'Report Pending').length;

  const cards = [
    {
      id: 'my-patients',
      label: 'My Patients',
      value: doctorPatients.length,
      sublabel: 'Assigned & active patients',
      icon: Users,
      color: 'from-blue-600/20 to-blue-500/10 border-blue-500/30 text-blue-400',
      textColor: 'text-blue-400'
    },
    {
      id: 'today-appointments',
      label: "Today's Schedule",
      value: todayAppointments.length,
      sublabel: 'Appointments booked today',
      icon: Calendar,
      color: 'from-indigo-600/20 to-indigo-500/10 border-indigo-500/30 text-indigo-400',
      textColor: 'text-indigo-400'
    },
    {
      id: 'completed',
      label: 'Completed Consultations',
      value: completedConsultations,
      sublabel: 'Successfully examined',
      icon: CheckCircle2,
      color: 'from-emerald-600/20 to-emerald-500/10 border-emerald-500/30 text-emerald-400',
      textColor: 'text-emerald-400'
    },
    {
      id: 'pending',
      label: 'Pending / In-Queue',
      value: pendingAppointments,
      sublabel: 'Awaiting consultation',
      icon: Clock,
      color: 'from-amber-600/20 to-amber-500/10 border-amber-500/30 text-amber-400',
      textColor: 'text-amber-400'
    },
    {
      id: 'critical',
      label: 'Critical / High-Risk',
      value: criticalPatientsCount,
      sublabel: 'Requiring close attention',
      icon: AlertTriangle,
      color: 'from-red-600/20 to-red-500/10 border-red-500/30 text-red-400',
      textColor: 'text-red-400'
    },
    {
      id: 'prescriptions',
      label: 'Active Prescriptions',
      value: activePrescriptionsCount,
      sublabel: 'Digital Rx generated',
      icon: Pill,
      color: 'from-teal-600/20 to-teal-500/10 border-teal-500/30 text-teal-400',
      textColor: 'text-teal-400'
    },
    {
      id: 'reports',
      label: 'Reports For Review',
      value: doctorReports,
      sublabel: 'Lab & Radiology awaiting review',
      icon: FileText,
      color: 'from-purple-600/20 to-purple-500/10 border-purple-500/30 text-purple-400',
      textColor: 'text-purple-400'
    }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
      {cards.map(card => {
        const Icon = card.icon;
        return (
          <button
            key={card.id}
            onClick={() => onCardClick && onCardClick(card.id)}
            className={`p-3.5 rounded-xl bg-gradient-to-b ${card.color} border text-left flex flex-col justify-between hover:scale-[1.02] active:scale-[0.99] transition shadow-md group relative overflow-hidden`}
          >
            <div className="flex items-center justify-between w-full mb-2">
              <div className="p-2 rounded-lg bg-[#0F172A]/60 border border-current/20">
                <Icon className="w-4 h-4" />
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
            </div>

            <div>
              <div className="text-2xl font-black text-white tracking-tight">{card.value}</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5 leading-tight">{card.label}</div>
              <div className="text-[10px] text-slate-400 mt-1 truncate">{card.sublabel}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
