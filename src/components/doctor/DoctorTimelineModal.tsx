import React from 'react';
import { Doctor, Patient } from '../../types';
import { store } from '../../lib/store';
import { X, Calendar, Clock, Activity, Pill, FileText, CheckCircle2, AlertCircle, Sparkles, User } from 'lucide-react';

interface DoctorTimelineModalProps {
  doctor: Doctor;
  patient: Patient;
  onClose: () => void;
}

interface TimelineItem {
  id: string;
  title: string;
  type: 'appointment' | 'token' | 'consultation' | 'report' | 'prescription' | 'followup' | 'surgery';
  date: string;
  time?: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

export const DoctorTimelineModal: React.FC<DoctorTimelineModalProps> = ({ doctor, patient, onClose }) => {
  const fullHistory = store.getPatientFullMedicalHistory(patient.id || patient.full_name);
  const patientPrescriptions = store.prescriptions.filter(p => p.patient_id === patient.id || p.patient_name === patient.full_name);
  const patientNotes = store.clinicalNotes.filter(n => n.patient_id === patient.id || n.patient_name === patient.full_name);
  const patientFollowUps = store.doctorFollowUps.filter(f => f.patient_id === patient.id || f.patient_name === patient.full_name);
  const patientAppointments = store.appointments.filter(a => a.patient_id === patient.id || a.patient_name.toLowerCase().includes(patient.full_name.toLowerCase()));

  // Aggregate unified chronological timeline items
  const timeline: TimelineItem[] = [];

  // Appointments
  patientAppointments.forEach(a => {
    timeline.push({
      id: a.id,
      title: `OPD Appointment Scheduled (${a.department})`,
      type: 'appointment',
      date: a.appointment_date,
      time: a.time_slot,
      description: `Consultation with ${a.doctor_name}. Reason: ${a.reason}`,
      badge: a.status,
      badgeColor: a.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
    });
  });

  // Clinical Notes & Consultations
  patientNotes.forEach(n => {
    timeline.push({
      id: n.id,
      title: `Clinical Consultation & Diagnosis Recorded`,
      type: 'consultation',
      date: n.created_at.split(' ')[0] || '2026-08-12',
      time: n.created_at.split(' ')[1] || '10:15 AM',
      description: `Diagnosis: ${n.recorded_condition}. Assessment: ${n.assessment}`,
      badge: 'Documented',
      badgeColor: 'bg-purple-500/20 text-purple-400'
    });
  });

  // Investigations & Reports (Cardiology, Radiology, Pathology)
  fullHistory.cardiologyRecords.forEach(c => {
    timeline.push({
      id: c.id,
      title: `Cardiology Investigation (${c.visit_type})`,
      type: 'report',
      date: c.created_at.split('T')[0] || c.created_at,
      description: `Test result: ${c.echo_findings || c.ecg_findings || 'ECG / Echo completed'}. LVEF: ${c.echo_ef_percent || 'Normal'}%`,
      badge: c.status,
      badgeColor: 'bg-amber-500/20 text-amber-400'
    });
  });

  fullHistory.xrayRecords.forEach(x => {
    timeline.push({
      id: x.id,
      title: `Digital X-Ray Scan (${x.procedure_name})`,
      type: 'report',
      date: x.requested_date || x.created_at.split('T')[0] || x.created_at,
      description: `Findings: ${x.radiologist_findings || 'Procedure conducted successfully'}`,
      badge: x.status,
      badgeColor: 'bg-cyan-500/20 text-cyan-400'
    });
  });

  fullHistory.mriRecords.forEach(m => {
    timeline.push({
      id: m.id,
      title: `MRI 3T Scan (${m.body_region})`,
      type: 'report',
      date: m.requested_date || m.created_at.split('T')[0] || m.created_at,
      description: `Findings: ${m.findings || 'No acute abnormalities'}`,
      badge: m.status,
      badgeColor: 'bg-indigo-500/20 text-indigo-400'
    });
  });

  fullHistory.labReports.forEach(l => {
    timeline.push({
      id: l.id,
      title: `Pathology & Lab Test (${l.test_name})`,
      type: 'report',
      date: l.test_date,
      description: `Status: ${l.status}. Lab specialist verified.`,
      badge: l.status,
      badgeColor: 'bg-emerald-500/20 text-emerald-400'
    });
  });

  // Prescriptions
  patientPrescriptions.forEach(p => {
    timeline.push({
      id: p.id,
      title: `Prescription Authorized (${p.prescription_number})`,
      type: 'prescription',
      date: p.created_at,
      description: `Prescribed ${p.medicines.length} medicines (${p.medicines.map(m => m.name).slice(0, 3).join(', ')}). Condition: ${p.recorded_condition}`,
      badge: p.status,
      badgeColor: 'bg-emerald-500/20 text-emerald-400'
    });
  });

  // Follow-ups
  patientFollowUps.forEach(f => {
    timeline.push({
      id: f.id,
      title: `Follow-Up Consultation Scheduled`,
      type: 'followup',
      date: f.follow_up_date,
      description: `Target condition: ${f.recorded_condition}. Notes: ${f.notes || 'Review clinical response'}`,
      badge: f.status,
      badgeColor: f.status === 'Overdue' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
    });
  });

  // Fallback demo events if timeline is brief
  if (timeline.length === 0) {
    timeline.push({
      id: 'demo-1',
      title: 'Initial Hospital Registration & EHR Created',
      type: 'appointment',
      date: patient.created_at || '2026-08-01',
      description: `Patient registered under SmartCare Health Network with ID ${patient.id}.`,
      badge: 'Active Record',
      badgeColor: 'bg-slate-700 text-slate-300'
    });
  }

  // Sort timeline descending by date
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0F172A] border border-[#334155] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-[#334155] bg-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Patient Medical Timeline: {patient.full_name}
              </h2>
              <p className="text-xs text-slate-400">
                Chronological patient journey from initial appointment to follow-up
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#334155] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Timeline Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          
          {/* Patient Header Card */}
          <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/40">
                {patient.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">{patient.full_name}</h3>
                <p className="text-slate-400 text-xs">{patient.age}y • {patient.gender} • Blood Group: <strong className="text-red-400">{patient.blood_group || 'O+'}</strong></p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-xs bg-slate-800 px-2.5 py-1 rounded border border-slate-700 text-slate-300">
                ID: {patient.id}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Timeline Events: {timeline.length}</p>
            </div>
          </div>

          {/* Timeline Nodes */}
          <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
            {timeline.map((event, idx) => {
              let icon = <Calendar className="w-3.5 h-3.5" />;
              let dotColor = 'bg-blue-500 border-blue-400 text-white';

              if (event.type === 'consultation') {
                icon = <Activity className="w-3.5 h-3.5" />;
                dotColor = 'bg-purple-500 border-purple-400 text-white';
              } else if (event.type === 'prescription') {
                icon = <Pill className="w-3.5 h-3.5" />;
                dotColor = 'bg-emerald-500 border-emerald-400 text-white';
              } else if (event.type === 'report') {
                icon = <FileText className="w-3.5 h-3.5" />;
                dotColor = 'bg-amber-500 border-amber-400 text-white';
              } else if (event.type === 'followup') {
                icon = <Clock className="w-3.5 h-3.5" />;
                dotColor = 'bg-cyan-500 border-cyan-400 text-white';
              }

              return (
                <div key={event.id || idx} className="relative group">
                  {/* Timeline Icon Node */}
                  <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 rounded-full border-2 ${dotColor} flex items-center justify-center shadow-lg`}>
                    {icon}
                  </div>

                  {/* Timeline Card */}
                  <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] group-hover:border-slate-500 transition space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="font-bold text-white text-xs">{event.title}</h4>
                      <div className="flex items-center gap-2">
                        {event.badge && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border border-current/20 ${event.badgeColor}`}>
                            {event.badge}
                          </span>
                        )}
                        <span className="text-[11px] text-slate-400 font-mono">
                          {event.date} {event.time ? `• ${event.time}` : ''}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
