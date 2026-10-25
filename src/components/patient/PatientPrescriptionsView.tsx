import React, { useState } from 'react';
import { 
  Pill, FileText, Calendar, User, Stethoscope, 
  Printer, Download, AlertCircle, CheckCircle2, ShieldCheck, Clock 
} from 'lucide-react';
import { Patient, DoctorPrescription } from '../../types';
import { store } from '../../lib/store';

interface PatientPrescriptionsViewProps {
  patient: Patient;
}

export const PatientPrescriptionsView: React.FC<PatientPrescriptionsViewProps> = ({ patient }) => {
  const prescriptions = store.getPatientPrescriptions(patient.id);
  const [selectedPrescription, setSelectedPrescription] = useState<DoctorPrescription | null>(prescriptions[0] || null);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] border border-[#334155] p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Pill className="w-5 h-5 text-amber-400" />
            <span>My Prescriptions & Medications</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Doctor-verified electronic prescriptions. Patient view is read-only for medication safety.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl font-mono">
            {prescriptions.length} Prescriptions Logged
          </span>
        </div>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-12 text-center space-y-3">
          <Pill className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Prescriptions On Record</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Once your doctor conducts your OPD consultation and generates an e-prescription, it will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Prescription List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">Prescription History</h3>
            {prescriptions.map(presc => {
              const isSelected = selectedPrescription?.id === presc.id;
              return (
                <button
                  key={presc.id}
                  onClick={() => setSelectedPrescription(presc)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/50 shadow-lg'
                      : 'bg-[#1E293B] border-[#334155] hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-amber-400">{presc.prescription_number}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{presc.created_at}</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{presc.doctor_name}</p>
                    <p className="text-[11px] text-slate-400">Condition: <strong className="text-slate-200">{presc.recorded_condition}</strong></p>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                    <span>{presc.medicines.length} Medicines Prescribed</span>
                    <span className="text-emerald-400 font-semibold">{presc.status}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right 2 Columns: Full Printable E-Prescription Card */}
          {selectedPrescription && (
            <div className="lg:col-span-2 bg-[#1E293B] border border-[#334155] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              
              {/* Prescription Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#334155]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">CheckMed Official E-Prescription</h3>
                    <p className="text-xs text-amber-400 font-mono font-bold">Rx No: {selectedPrescription.prescription_number}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#334155] text-slate-200 hover:text-white border border-[#334155] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400" />
                    <span>Print Rx</span>
                  </button>
                </div>
              </div>

              {/* Doctor & Patient Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0F172A] p-4 rounded-2xl border border-[#334155]/60 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400">Prescribing Doctor:</p>
                  <p className="font-bold text-white text-sm">{selectedPrescription.doctor_name}</p>
                  <p className="text-slate-400">Date: <span className="font-mono text-white">{selectedPrescription.created_at}</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Patient:</p>
                  <p className="font-bold text-white text-sm">{selectedPrescription.patient_name} ({selectedPrescription.patient_age} Y, {selectedPrescription.patient_gender})</p>
                  <p className="text-slate-400">Blood Group: <strong className="text-rose-400">{selectedPrescription.patient_blood_group}</strong></p>
                </div>
              </div>

              {/* Diagnosis / Chief Complaint */}
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400">Diagnosed Condition & Chief Complaint:</p>
                <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] text-xs font-semibold text-white">
                  {selectedPrescription.recorded_condition}
                </div>
              </div>

              {/* Medicine Table */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prescribed Medicines & Dosage Schedule</p>
                <div className="border border-[#334155] rounded-2xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F172A] text-slate-400 font-bold border-b border-[#334155]">
                      <tr>
                        <th className="p-3">#</th>
                        <th className="p-3">Medicine Name</th>
                        <th className="p-3">Dosage</th>
                        <th className="p-3">Frequency</th>
                        <th className="p-3">Duration</th>
                        <th className="p-3">Special Instructions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155] bg-[#1E293B]">
                      {selectedPrescription.medicines.map((med, idx) => (
                        <tr key={idx} className="hover:bg-[#0F172A]/50">
                          <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                          <td className="p-3 font-bold text-white">{med.name}</td>
                          <td className="p-3 text-amber-300 font-mono">{med.dosage}</td>
                          <td className="p-3 text-slate-300">{med.frequency}</td>
                          <td className="p-3 text-slate-300">{med.duration}</td>
                          <td className="p-3 text-slate-400 italic">{med.instructions || 'As directed by physician'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor Advice & Follow-Up */}
              {selectedPrescription.advice_instructions && (
                <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl space-y-1 text-xs text-amber-200">
                  <strong className="text-amber-300">Doctor's Clinical Advice & Lifestyle Guidelines:</strong>
                  <p>{selectedPrescription.advice_instructions}</p>
                </div>
              )}

              {selectedPrescription.follow_up_date && (
                <div className="flex items-center justify-between bg-[#0F172A] p-3.5 rounded-2xl border border-[#334155] text-xs">
                  <span className="text-slate-400">Recommended Follow-Up Date:</span>
                  <span className="font-bold text-sky-400 font-mono">{selectedPrescription.follow_up_date}</span>
                </div>
              )}

              <div className="text-[11px] text-slate-500 text-center">
                CheckMed Certified Electronic Prescription • Digital Hash: #CKM-RX-{selectedPrescription.id}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
