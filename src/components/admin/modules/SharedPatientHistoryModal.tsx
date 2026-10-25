import React from 'react';
import { X, Eye, Activity, Heart, Microscope, Scissors, Droplet, Wind, Calendar, FileText, UserCheck, Shield } from 'lucide-react';
import { store } from '../../../lib/store';

interface SharedPatientHistoryModalProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
}

export const SharedPatientHistoryModal: React.FC<SharedPatientHistoryModalProps> = ({ patientId, patientName, onClose }) => {
  const history = store.getPatientFullMedicalHistory(patientId || patientName);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-[#334155] bg-[#0F172A] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#38BDF8]/20 text-[#38BDF8] flex items-center justify-center font-bold text-lg border border-[#38BDF8]/30">
              {patientName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Unified Medical Record: {patientName}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Complete cross-departmental history across Eye, Radiology, Pathology, Cardiology, OT, and Blood Bank
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#94A3B8] hover:text-white rounded-lg hover:bg-[#334155] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Summary Banner */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#0F172A] p-4 rounded-xl border border-[#334155]">
            <div>
              <span className="text-[#94A3B8] block text-[11px]">Lab & Pathology</span>
              <span className="font-bold text-white text-sm">{history.pathologyRecords.length + history.labReports.length} Tests</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[11px]">Radiology (XRay/MRI/CT)</span>
              <span className="font-bold text-[#38BDF8] text-sm">{history.xrayRecords.length + history.mriRecords.length + history.ctRecords.length} Scans</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[11px]">Cardiology & Eye</span>
              <span className="font-bold text-[#A855F7] text-sm">{history.cardiologyRecords.length + history.eyeRecords.length} Consultations</span>
            </div>
            <div>
              <span className="text-[#94A3B8] block text-[11px]">OT Surgeries</span>
              <span className="font-bold text-[#10B981] text-sm">{history.surgeries.length + history.eyeSurgeries.length} Procedures</span>
            </div>
          </div>

          {/* Eye Care Records */}
          {history.eyeRecords.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#38BDF8] flex items-center gap-2">
                <Eye className="w-4 h-4" /> Ophthalmology & Vision Examination
              </h3>
              <div className="space-y-2">
                {history.eyeRecords.map(e => (
                  <div key={e.id} className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                    <div className="flex justify-between font-semibold text-white">
                      <span>Doctor: {e.doctor_name}</span>
                      <span className="text-[#94A3B8]">{e.visit_date}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-slate-300">
                      <div>Right Eye (OD): Acuity {e.visual_acuity_od} | IOP: {e.iop_od_mmHg} mmHg</div>
                      <div>Left Eye (OS): Acuity {e.visual_acuity_os} | IOP: {e.iop_os_mmHg} mmHg</div>
                    </div>
                    {e.doctor_notes && (
                      <p className="mt-1 text-[#94A3B8] italic">Notes: {e.doctor_notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Radiology (X-Ray, MRI, CT) */}
          {(history.xrayRecords.length > 0 || history.mriRecords.length > 0 || history.ctRecords.length > 0) && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#38BDF8] flex items-center gap-2">
                <Activity className="w-4 h-4" /> Radiology & Advanced Imaging
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {history.xrayRecords.map(x => (
                  <div key={x.id} className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                    <div className="flex justify-between font-bold text-white">
                      <span>X-Ray: {x.procedure_name}</span>
                      <span className="text-[#38BDF8]">{x.status}</span>
                    </div>
                    <p className="text-[#94A3B8] mt-1">Requested by: {x.doctor_name}</p>
                    {x.radiologist_findings && <p className="text-emerald-400 mt-1">Findings: {x.radiologist_findings}</p>}
                  </div>
                ))}

                {history.mriRecords.map(m => (
                  <div key={m.id} className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                    <div className="flex justify-between font-bold text-white">
                      <span>MRI: {m.body_region}</span>
                      <span className="text-purple-400">{m.status}</span>
                    </div>
                    <p className="text-[#94A3B8] mt-1">Machine: {m.machine_name}</p>
                    {m.findings && <p className="text-emerald-400 mt-1">Findings: {m.findings}</p>}
                  </div>
                ))}

                {history.ctRecords.map(c => (
                  <div key={c.id} className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                    <div className="flex justify-between font-bold text-white">
                      <span>CT Scan: {c.scan_type}</span>
                      <span className="text-amber-400">{c.status}</span>
                    </div>
                    <p className="text-[#94A3B8] mt-1">Doctor: {c.doctor_name}</p>
                    {c.findings && <p className="text-emerald-400 mt-1">Findings: {c.findings}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cardiology */}
          {history.cardiologyRecords.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#EF4444] flex items-center gap-2">
                <Heart className="w-4 h-4" /> Cardiology & Cardiac Evaluation
              </h3>
              <div className="space-y-2">
                {history.cardiologyRecords.map(cd => (
                  <div key={cd.id} className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                    <div className="flex justify-between text-white font-bold">
                      <span>{cd.visit_type} ({cd.cardiologist_name})</span>
                      <span className="text-[#94A3B8]">{cd.created_at}</span>
                    </div>
                    {cd.echo_ef_percent && <p className="text-emerald-400 mt-1 font-semibold">LVEF: {cd.echo_ef_percent}%</p>}
                    {cd.ecg_findings && <p className="text-slate-300 mt-1">ECG: {cd.ecg_findings}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pathology Tests */}
          {history.pathologyRecords.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#10B981] flex items-center gap-2">
                <Microscope className="w-4 h-4" /> Pathology & Lab Investigations
              </h3>
              <div className="space-y-2">
                {history.pathologyRecords.map(p => (
                  <div key={p.id} className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                    <div className="flex justify-between font-bold text-white">
                      <span>{p.test_name} ({p.sample_id})</span>
                      <span className="text-emerald-400">{p.status}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-2 text-slate-300">
                      {p.test_parameters.map((param, idx) => (
                        <div key={idx} className={param.is_abnormal ? 'text-amber-400 font-bold' : ''}>
                          {param.parameter_name}: {param.result_value} {param.unit} (Ref: {param.reference_range})
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Surgeries & OT */}
          {(history.surgeries.length > 0 || history.eyeSurgeries.length > 0) && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-[#F59E0B] flex items-center gap-2">
                <Scissors className="w-4 h-4" /> Surgical Records & OT Operations
              </h3>
              <div className="space-y-2">
                {history.surgeries.map(s => (
                  <div key={s.id} className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                    <div className="flex justify-between font-bold text-white">
                      <span>{s.surgery_type} - {s.ot_number}</span>
                      <span className="text-amber-400">{s.status}</span>
                    </div>
                    <p className="text-[#94A3B8] mt-1">Surgeon: {s.lead_surgeon_name} | Date: {s.scheduled_date} ({s.scheduled_time_slot})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blood Requests */}
          {history.bloodRequests.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-bold text-sm text-rose-400 flex items-center gap-2">
                <Droplet className="w-4 h-4" /> Blood Bank Transfusion Requests
              </h3>
              <div className="space-y-2">
                {history.bloodRequests.map(b => (
                  <div key={b.id} className="bg-[#0F172A] p-3 rounded-lg border border-[#334155] flex justify-between">
                    <div>
                      <p className="font-bold text-white">{b.units_requested} Units {b.blood_group} ({b.component_type})</p>
                      <p className="text-[#94A3B8]">Requesting Doctor: {b.requesting_doctor}</p>
                    </div>
                    <span className="text-emerald-400 font-bold">{b.status}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state check */}
          {history.pathologyRecords.length === 0 &&
           history.xrayRecords.length === 0 &&
           history.mriRecords.length === 0 &&
           history.ctRecords.length === 0 &&
           history.cardiologyRecords.length === 0 &&
           history.eyeRecords.length === 0 &&
           history.surgeries.length === 0 &&
           history.bloodRequests.length === 0 && (
             <div className="text-center py-8 text-[#94A3B8]">
               No clinical history found for this patient across advanced modules.
             </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#334155] bg-[#0F172A] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#38BDF8] text-[#0F172A] font-bold text-xs hover:bg-[#0284C7] transition-colors"
          >
            Close Record View
          </button>
        </div>
      </div>
    </div>
  );
};
