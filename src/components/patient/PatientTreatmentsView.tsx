import React from 'react';
import { Activity, Scissors, Stethoscope, Calendar, CheckCircle2, Clock, ShieldCheck, Heart, Eye } from 'lucide-react';
import { Patient } from '../../types';
import { store } from '../../lib/store';

interface PatientTreatmentsViewProps {
  patient: Patient;
}

export const PatientTreatmentsView: React.FC<PatientTreatmentsViewProps> = ({ patient }) => {
  const treatments = store.getPatientTreatments(patient.id);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] border border-[#334155] p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-400" />
            <span>Clinical Treatments & Medical Procedures</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Official record of inpatient interventions, surgical procedures, and specialty care performed by authorized hospital staff.
          </p>
        </div>
        <span className="text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 px-3 py-1.5 rounded-xl font-mono">
          {treatments.length} Procedures Logged
        </span>
      </div>

      {treatments.length === 0 ? (
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-12 text-center space-y-3">
          <Activity className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Inpatient / Surgical Procedures Recorded</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Your medical record currently reflects routine outpatient care and OPD consultations without invasive interventions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {treatments.map((t, idx) => (
            <div
              key={t.id || idx}
              className="bg-[#1E293B] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center font-black">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{t.title}</h3>
                    <p className="text-xs text-purple-400 font-medium">{t.department}</p>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                  t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  t.status === 'In-Progress' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                }`}>
                  {t.status}
                </span>
              </div>

              <div className="bg-[#0F172A] border border-[#334155]/60 rounded-2xl p-4 text-xs space-y-2 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Lead Clinician / Surgeon:</span>
                  <strong className="text-white">{t.doctor}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Procedure Date:</span>
                  <span className="font-mono text-white">{t.date}</span>
                </div>
                {t.followUp && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Follow-Up Check:</span>
                    <span className="font-mono text-sky-400">{t.followUp}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#334155]/60">
                  <span className="text-slate-400 block mb-1">Clinical Notes & Findings:</span>
                  <p className="text-slate-200 bg-[#1E293B] p-2.5 rounded-xl text-[11px] leading-relaxed">
                    {t.notes}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
