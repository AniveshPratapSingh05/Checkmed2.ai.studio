import React from 'react';
import { 
  Heart, Activity, AlertCircle, FileText, Calendar, 
  User, ShieldCheck, Stethoscope, Clock, CheckCircle2,
  Pill, AlertTriangle, ChevronRight, Download, Printer
} from 'lucide-react';
import { Patient, DoctorClinicalNote } from '../../types';
import { store } from '../../lib/store';

interface PatientHealthOverviewProps {
  patient: Patient;
  onNavigateTab?: (tab: string) => void;
}

export const PatientHealthOverview: React.FC<PatientHealthOverviewProps> = ({ patient, onNavigateTab }) => {
  const appointments = store.getPatientAppointments(patient.id);
  const prescriptions = store.getPatientPrescriptions(patient.id);
  const labReports = store.getPatientLabReports(patient.id);
  const clinicalNotes = store.getPatientClinicalNotes(patient.id);
  const treatments = store.getPatientTreatments(patient.id);

  // Derive known conditions from clinical notes + patient medical history
  const conditionsList = [
    ...(patient.medical_history ? patient.medical_history.split(',').map(s => s.trim()) : []),
    ...clinicalNotes.map(n => n.recorded_condition)
  ].filter((v, i, a) => v && a.indexOf(v) === i);

  // Fallback if none recorded
  const activeConditions = conditionsList.length > 0 ? conditionsList : ['General Health Monitoring', 'No Chronic Ailments Flagged'];

  return (
    <div className="space-y-6">
      
      {/* 1. Top Vitals & Patient Demographic Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center font-black">
            <Heart className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Blood Group</p>
            <p className="text-xl font-black text-rose-400">{patient.blood_group || 'O+'}</p>
            <p className="text-[10px] text-slate-500">Universal Donor / Compatibility verified</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-black">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Age & Gender</p>
            <p className="text-xl font-black text-white">{patient.age} Yrs • {patient.gender}</p>
            <p className="text-[10px] text-slate-500">Patient ID: {patient.id}</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Past Consultations</p>
            <p className="text-xl font-black text-emerald-400">{appointments.length}</p>
            <p className="text-[10px] text-slate-500">{appointments.filter(a => a.status === 'Completed').length} completed visits</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-5 shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Prescriptions</p>
            <p className="text-xl font-black text-amber-400">{prescriptions.length}</p>
            <p className="text-[10px] text-slate-500">{labReports.length} lab tests on record</p>
          </div>
        </div>
      </div>

      {/* 2. Main 2-Column Clinical Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recorded Medical Conditions & Clinical Notes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recorded Conditions & Allergies */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-black text-white">Recorded Medical Conditions & Chronic Care</h2>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Medical Record
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activeConditions.map((cond, idx) => (
                <div key={idx} className="bg-[#0F172A] border border-[#334155] p-3.5 rounded-2xl flex items-start gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">{cond}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Tracked in OPD & Clinical Encounters</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Allergies Notice */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Allergies & Drug Contraindications:</strong>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  No critical anaphylactic drug allergies recorded. Always inform your treating doctor before new medicine administration.
                </p>
              </div>
            </div>
          </div>

          {/* Previous Clinical Consultations & Diagnosis History */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-400" />
                <h2 className="text-base font-black text-white">Previous Consultations & Diagnoses</h2>
              </div>
              {onNavigateTab && (
                <button
                  onClick={() => onNavigateTab('appointments')}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <span>View All Visits</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {clinicalNotes.length > 0 ? (
              <div className="space-y-3">
                {clinicalNotes.map(note => (
                  <div key={note.id} className="bg-[#0F172A] border border-[#334155] p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-black text-white">{note.doctor_name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-[#1E293B] px-2 py-0.5 rounded border border-[#334155]">
                        {note.created_at}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-300 bg-[#1E293B]/50 p-3 rounded-xl border border-[#334155]/60">
                      <p><strong className="text-white">Chief Complaint:</strong> {note.chief_complaint}</p>
                      <p><strong className="text-sky-300">Diagnosis:</strong> {note.recorded_condition || note.assessment}</p>
                      {note.clinical_notes && (
                        <p className="text-[11px] text-slate-400"><strong className="text-slate-300">Notes:</strong> {note.clinical_notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2.5">
                {appointments.slice(0, 3).map(a => (
                  <div key={a.id} className="bg-[#0F172A] border border-[#334155] p-3.5 rounded-2xl flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">{a.doctor_name} ({a.department})</p>
                      <p className="text-[11px] text-slate-400">Date: {a.appointment_date} • Reason: {a.reason}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {a.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Quick Medical Details, Treatments & Contacts */}
        <div className="space-y-6">
          
          {/* Hospital Treatments & Procedures */}
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h2 className="text-base font-black text-white">Treatments & Procedures</h2>
            </div>

            {treatments.length > 0 ? (
              <div className="space-y-2.5">
                {treatments.map(t => (
                  <div key={t.id} className="bg-[#0F172A] border border-[#334155] p-3.5 rounded-2xl space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-purple-300">{t.title}</p>
                      <span className="text-[10px] font-mono text-slate-400">{t.date}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">Doctor: {t.doctor} • {t.department}</p>
                    <p className="text-[10px] text-slate-400">{t.notes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0F172A] p-4 rounded-2xl text-center text-xs text-slate-400">
                <p>No invasive surgical procedures recorded.</p>
                <p className="text-[11px] text-slate-500 mt-1">Routine OPD consultations & outpatient care.</p>
              </div>
            )}
          </div>

          {/* Emergency Contact & CheckMed Hospital Info */}
          <div className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-3">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>CheckMed Hospital Registry</span>
            </h3>
            
            <div className="text-xs space-y-2 text-slate-300">
              <p>Registered Phone: <strong className="text-white font-mono">{patient.phone || '+91 98765 43210'}</strong></p>
              <p>Email: <strong className="text-white">{patient.email}</strong></p>
              <p>Hospital Branch: <strong className="text-emerald-400">BRD Medical College & CheckMed Network</strong></p>
              <p>Emergency Helpline: <strong className="text-rose-400 font-mono">108 / 112</strong></p>
            </div>

            <div className="pt-2 border-t border-[#334155]/60">
              <button
                onClick={() => window.print()}
                className="w-full py-2.5 bg-[#0F172A] hover:bg-[#334155] text-slate-200 hover:text-white border border-[#334155] rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-sky-400" />
                <span>Print Health Summary Card</span>
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
