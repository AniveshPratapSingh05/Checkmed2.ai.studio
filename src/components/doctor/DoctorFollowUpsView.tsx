import React, { useState } from 'react';
import { Doctor, DoctorFollowUp, Patient } from '../../types';
import { store } from '../../lib/store';
import { 
  Calendar, Clock, User, CheckCircle2, AlertTriangle, 
  Stethoscope, Pill, Search, Filter, Check, ArrowRight 
} from 'lucide-react';

interface DoctorFollowUpsViewProps {
  doctor: Doctor;
  onOpenConsultation: (patient: Patient) => void;
  onOpenPrescription: (patient: Patient) => void;
  onOpenTimeline: (patient: Patient) => void;
}

export const DoctorFollowUpsView: React.FC<DoctorFollowUpsViewProps> = ({
  doctor,
  onOpenConsultation,
  onOpenPrescription,
  onOpenTimeline
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const followUps = store.doctorFollowUps.filter(
    f => f.doctor_id === doctor.id || f.doctor_name.toLowerCase().includes(doctor.full_name.toLowerCase())
  );

  const filteredFollowUps = followUps.filter(f => {
    const matchesSearch = 
      f.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.recorded_condition.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'ALL' || f.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getPatientForFollowUp = (f: DoctorFollowUp): Patient => {
    const existing = store.patients.find(p => p.id === f.patient_id || p.full_name.toLowerCase() === f.patient_name.toLowerCase());
    if (existing) return existing;
    return {
      id: f.patient_id,
      full_name: f.patient_name,
      email: `${f.patient_name.toLowerCase().replace(/\s+/g, '.')}@checkmed.org`,
      age: f.patient_age,
      gender: (f.patient_gender === 'Female' ? 'Female' : f.patient_gender === 'Male' ? 'Male' : 'Other'),
      blood_group: f.patient_blood_group || 'O+',
      phone: '+91 98765 43210',
      medical_history: f.recorded_condition,
      created_at: f.previous_consultation_date
    };
  };

  const handleStatusChange = (id: string, status: DoctorFollowUp['status']) => {
    store.updateFollowUpStatus(id, status);
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* Search and Filters */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search follow-up patients by name, ID or diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-[#0F172A] px-3 py-1.5 rounded-xl border border-[#334155]">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-transparent text-slate-200 font-semibold focus:outline-none"
          >
            <option value="ALL">All Follow-Up Statuses</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Due Soon">Due Soon</option>
            <option value="Overdue">Overdue</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Follow-Up List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-slate-400 px-1">
          <span>Follow-Up Consultations ({filteredFollowUps.length} patients)</span>
          <span className="text-emerald-400 font-medium">Automatic recall synced with prescriptions</span>
        </div>

        {filteredFollowUps.length === 0 ? (
          <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-10 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-60" />
            <p className="font-semibold text-slate-300 text-sm">No follow-up patients found.</p>
            <p className="text-xs text-slate-500 mt-1">When you set a follow-up date while writing prescriptions, patients will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredFollowUps.map(f => {
              const patient = getPatientForFollowUp(f);
              const isOverdue = f.status === 'Overdue';
              const isCompleted = f.status === 'Completed';

              return (
                <div
                  key={f.id}
                  className={`bg-[#1E293B] border rounded-xl p-4 transition shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isOverdue
                      ? 'border-red-500/40 bg-[#1E293B]'
                      : isCompleted
                      ? 'border-emerald-500/30 bg-[#1E293B]/60'
                      : 'border-[#334155] hover:border-slate-500'
                  }`}
                >
                  {/* Left: Follow-Up Info */}
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-base shrink-0 border ${
                      isOverdue
                        ? 'bg-red-500/20 text-red-400 border-red-500/30'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}>
                      {patient.full_name.charAt(0)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-sm">{patient.full_name}</h3>
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {f.patient_id}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          isOverdue
                            ? 'bg-red-500/20 text-red-400 border-red-500/30'
                            : isCompleted
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        }`}>
                          {f.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-400">
                        <span>Diagnosis: <strong className="text-slate-200">{f.recorded_condition}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-300 font-mono">
                          <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          Follow-Up Target: <strong className="text-white">{f.follow_up_date}</strong>
                        </span>
                      </div>

                      {f.previous_prescription_summary && (
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                          <Pill className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Last Rx: <strong className="text-slate-300">{f.previous_prescription_summary}</strong></span>
                        </div>
                      )}

                      {f.notes && (
                        <p className="text-[11px] text-slate-400 italic">
                          "{f.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-700/60 shrink-0">
                    <button
                      onClick={() => onOpenConsultation(patient)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition shadow-md shadow-blue-900/20"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Consultation
                    </button>

                    <button
                      onClick={() => onOpenPrescription(patient)}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      New Rx
                    </button>

                    <button
                      onClick={() => onOpenTimeline(patient)}
                      className="px-2.5 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                      title="View Timeline"
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </button>

                    {/* Status Toggle */}
                    {!isCompleted ? (
                      <button
                        onClick={() => handleStatusChange(f.id, 'Completed')}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-700 transition"
                        title="Mark Follow-up as Completed"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        Done
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(f.id, 'Upcoming')}
                        className="px-2 py-1 bg-slate-800/60 text-slate-400 text-[10px] rounded border border-slate-700 hover:text-white transition"
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
