import React, { useState } from 'react';
import { store } from '../../../lib/store';
import { IcuPatientRecord, IcuTransferDischargeLog } from '../../../types';
import { 
  ArrowRightLeft, User, CheckCircle2, AlertTriangle, FileText, Clock, Sparkles
} from 'lucide-react';

interface IcuTransferDischargeProps {
  hospitalFilter?: string;
  preselectedPatient?: IcuPatientRecord | null;
}

export const IcuTransferDischarge: React.FC<IcuTransferDischargeProps> = ({ preselectedPatient }) => {
  const [patients] = useState<IcuPatientRecord[]>(store.icuPatients);
  const [transfers, setTransfers] = useState<IcuTransferDischargeLog[]>(store.icuTransfers);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    preselectedPatient ? preselectedPatient.patient_id : patients[0]?.patient_id || ''
  );

  const [transferType, setTransferType] = useState<IcuTransferDischargeLog['transfer_type']>('ICU -> General Ward');
  const [toBedOrDept, setToBedOrDept] = useState('General Male Ward Bed 14');
  const [authorizedStaff, setAuthorizedStaff] = useState('Dr. Rajesh Sharma');
  const [transferNotes, setTransferNotes] = useState('');

  const [successToast, setSuccessToast] = useState<string | null>(null);

  const refreshData = () => {
    setTransfers([...store.icuTransfers]);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.patient_id === selectedPatientId || p.id === selectedPatientId);
    if (!patientObj || !toBedOrDept.trim()) return;

    store.processIcuTransferOrDischarge({
      patient_id: patientObj.patient_id,
      patient_name: patientObj.patient_name,
      transfer_type: transferType,
      from_bed: patientObj.bed_number,
      to_bed_or_dept: toBedOrDept.trim(),
      authorized_staff: authorizedStaff,
      transfer_notes: transferNotes.trim() || 'Patient step-down transfer executed cleanly.'
    });

    refreshData();
    setSuccessToast(`Transfer order executed for ${patientObj.patient_name}. Bed ${patientObj.bed_number} released to Cleaning.`);
    setTimeout(() => setSuccessToast(null), 5000);
    setTransferNotes('');
  };

  const selectedPatientObj = patients.find(p => p.patient_id === selectedPatientId || p.id === selectedPatientId);

  return (
    <div className="space-y-6">
      {successToast && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          {successToast}
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ArrowRightLeft className="w-6 h-6 text-amber-600" />
            ICU Transfer & Discharge Workflow
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Seamless patient transfers (ICU → General Ward / Step-down / Other Dept / Discharge) and auto bed cleaning trigger
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Transfer Order Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
            <ArrowRightLeft className="w-4 h-4 text-amber-600" />
            Execute Transfer / Discharge Order
          </h3>

          <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none font-bold"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.patient_id}>
                    {p.patient_name} — Current Bed: {p.bed_number} ({p.status})
                  </option>
                ))}
              </select>
            </div>

            {selectedPatientObj && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <p className="font-bold text-slate-900 text-xs">{selectedPatientObj.patient_name}</p>
                <p className="text-[11px] text-slate-600">Diagnosis: {selectedPatientObj.diagnosis_notes}</p>
                <p className="text-[11px] text-slate-500">Attending Doctor: {selectedPatientObj.attending_doctor_name}</p>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Transfer Action Type</label>
              <select
                value={transferType}
                onChange={(e) => setTransferType(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="ICU -> General Ward">ICU -&gt; Step-Down General Ward</option>
                <option value="ICU -> Other Department">ICU -&gt; Other Speciality Dept (OR / Radiology / OT)</option>
                <option value="ICU -> Another ICU Bed">ICU -&gt; Relocate to Another ICU Bed</option>
                <option value="ICU -> Discharge">ICU -&gt; Full Clinical Discharge to Home</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Destination Ward / Bed / Location *</label>
              <input
                type="text"
                required
                placeholder="e.g. Ward 4 Bed 12 or Home Discharge"
                value={toBedOrDept}
                onChange={(e) => setToBedOrDept(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Authorizing Doctor / Consultant</label>
              <input
                type="text"
                required
                value={authorizedStaff}
                onChange={(e) => setAuthorizedStaff(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Transfer Summary & Clearance Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Hemodynamically stable, ABG normal, tracheostomy decannulated..."
                value={transferNotes}
                onChange={(e) => setTransferNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              Process Transfer & Auto-Set Bed Cleaning
            </button>
          </form>
        </div>

        {/* Transfer Logs Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
            <Clock className="w-4 h-4 text-slate-600" />
            Historical Transfer & Discharge Logs ({transfers.length})
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Datetime</th>
                  <th className="p-3">Patient</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">From -&gt; To</th>
                  <th className="p-3">Authorized By</th>
                  <th className="p-3">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((tr) => (
                  <tr key={tr.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-600 whitespace-nowrap">{tr.datetime}</td>
                    <td className="p-3 font-bold text-slate-900">{tr.patient_name}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        {tr.transfer_type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-sky-800">
                      {tr.from_bed} &rarr; {tr.to_bed_or_dept}
                    </td>
                    <td className="p-3 text-slate-600">{tr.authorized_staff}</td>
                    <td className="p-3 text-slate-500 max-w-xs truncate">{tr.transfer_notes}</td>
                  </tr>
                ))}

                {transfers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400">
                      No transfer logs recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
