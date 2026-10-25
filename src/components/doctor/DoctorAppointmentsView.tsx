import React, { useState } from 'react';
import { Doctor, Appointment, Patient } from '../../types';
import { store } from '../../lib/store';
import { 
  Calendar, Clock, User, CheckCircle2, AlertCircle, 
  Stethoscope, Pill, FileText, ChevronRight, Play, Check, Filter, Search 
} from 'lucide-react';

interface DoctorAppointmentsViewProps {
  doctor: Doctor;
  onStartConsultation: (patient: Patient) => void;
  onOpenPrescription: (patient: Patient) => void;
  onOpenTimeline: (patient: Patient) => void;
}

export const DoctorAppointmentsView: React.FC<DoctorAppointmentsViewProps> = ({
  doctor,
  onStartConsultation,
  onOpenPrescription,
  onOpenTimeline
}) => {
  const [filterDate, setFilterDate] = useState<'all' | 'today' | 'upcoming' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const appointments = store.getDoctorAppointments(doctor.id);

  const todayStr = '2026-08-14';

  const filteredAppointments = appointments.filter(app => {
    const matchesSearch = 
      app.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.time_slot.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterDate === 'today') {
      return app.appointment_date === todayStr || app.appointment_date.startsWith('2026-08');
    }
    if (filterDate === 'upcoming') {
      return app.status === 'Upcoming' || app.status === 'In-Progress';
    }
    if (filterDate === 'completed') {
      return app.status === 'Completed';
    }
    return true;
  });

  const handleUpdateStatus = (appointmentId: string, newStatus: Appointment['status']) => {
    store.updateAppointmentStatus(appointmentId, newStatus);
    const app = appointments.find(a => a.id === appointmentId);
    if (app) {
      store.logDoctorActivity({
        doctor_id: doctor.id,
        doctor_name: doctor.full_name,
        patient_id: app.patient_id,
        patient_name: app.patient_name,
        action: 'Doctor updated status',
        details: `Updated appointment status for ${app.patient_name} to "${newStatus}"`
      });
    }
  };

  const getPatientForAppointment = (app: Appointment): Patient => {
    const existing = store.patients.find(p => p.id === app.patient_id || p.full_name.toLowerCase() === app.patient_name.toLowerCase());
    if (existing) return existing;
    return {
      id: app.patient_id || `pat-${Date.now()}`,
      full_name: app.patient_name,
      email: `${app.patient_name.toLowerCase().replace(/\s+/g, '.')}@checkmed.org`,
      age: 45,
      gender: 'Male',
      phone: '+91 98765 43210',
      medical_history: app.reason,
      blood_group: 'O+',
      created_at: app.appointment_date
    };
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* Search & Filter Bar */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search appointments by Patient name, reason, or time..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Date Filter Tabs */}
        <div className="flex rounded-xl bg-[#0F172A] p-1 border border-[#334155] text-xs">
          {[
            { id: 'all', label: `All (${appointments.length})` },
            { id: 'today', label: `Today's Schedule` },
            { id: 'upcoming', label: 'Upcoming / Queued' },
            { id: 'completed', label: 'Completed' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterDate(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                filterDate === tab.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Appointments List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-slate-400 px-1">
          <span>Appointments Queue for <strong className="text-white">{doctor.full_name}</strong></span>
          <span className="text-emerald-400 font-medium">Synced with OPD Tokens & Slot Calendar</span>
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-10 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-60" />
            <p className="font-semibold text-slate-300 text-sm">No appointments found for the selected filter.</p>
            <p className="text-xs text-slate-500 mt-1">New OPD appointments booked by patients will automatically stream here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredAppointments.map(app => {
              const patient = getPatientForAppointment(app);
              const isCompleted = app.status === 'Completed';
              const isInProgress = app.status === 'In-Progress';

              return (
                <div
                  key={app.id}
                  className={`bg-[#1E293B] border rounded-xl p-4 transition shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isCompleted
                      ? 'border-emerald-500/30 bg-[#1E293B]/60'
                      : isInProgress
                      ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                      : 'border-[#334155] hover:border-slate-500'
                  }`}
                >
                  {/* Left: Patient and Slot Info */}
                  <div className="flex items-start gap-3.5">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border ${
                      isCompleted 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : isInProgress
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {patient.full_name.charAt(0)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{patient.full_name}</h3>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {app.patient_id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : isInProgress
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          {app.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300">
                          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                          {app.appointment_date}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300 font-mono">
                          <Clock className="w-3.5 h-3.5 text-blue-400" />
                          {app.time_slot}
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">Type: <strong className="text-slate-300 capitalize">{app.consultation_type || 'In-Person OPD'}</strong></span>
                      </div>

                      <div className="text-xs text-slate-300 flex items-center gap-1.5 pt-0.5">
                        <span className="text-slate-400 font-medium">Chief Complaint:</span>
                        <span className="text-slate-200 font-semibold">{app.reason}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-700/60">
                    
                    {/* Start / Open Consultation */}
                    <button
                      onClick={() => onStartConsultation(patient)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-blue-900/20"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Consultation
                    </button>

                    {/* Write Prescription */}
                    <button
                      onClick={() => onOpenPrescription(patient)}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      Write Rx
                    </button>

                    {/* Patient Timeline */}
                    <button
                      onClick={() => onOpenTimeline(patient)}
                      className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                      title="View Timeline"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>

                    {/* Quick Status Toggle */}
                    {!isCompleted ? (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Completed')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Mark Done
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'Upcoming')}
                        className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-400 text-[11px] rounded-lg border border-slate-700 transition"
                      >
                        Reopen
                      </button>
                    )}

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
