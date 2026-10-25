import React, { useState, useEffect } from 'react';
import { Heart, Plus, Activity, FileText, ChevronRight } from 'lucide-react';
import { store } from '../../../lib/store';
import { CardiologyRecord, StaffRole } from '../../../types';
import { RoleAccessBar } from './RoleAccessBar';
import { SharedPatientHistoryModal } from './SharedPatientHistoryModal';

export const CardiologyModule: React.FC = () => {
  const [records, setRecords] = useState<CardiologyRecord[]>(store.cardiologyRecords);
  const [currentRole, setCurrentRole] = useState<StaffRole>(store.currentStaffRole);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientHistoryId, setSelectedPatientHistoryId] = useState<string | null>(null);

  // New Cardiology Form State
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. S. N. Pandey (Cardiologist)');
  const [visitType, setVisitType] = useState<'Cardiac OPD' | 'ECG' | '2D Echo' | 'TMT Stress Test' | 'Holter Monitoring' | 'Cardiac Angiography'>('2D Echo');
  const [ecgFindings, setEcgFindings] = useState('Normal sinus rhythm, HR 72 bpm, PR interval 150ms.');
  const [efPercent, setEfPercent] = useState(62);
  const [echoNotes, setEchoNotes] = useState('Good LV systolic function. No regional wall motion abnormality (RWMA).');
  const [troponin, setTroponin] = useState(0.01);
  const [treatmentPlan, setTreatmentPlan] = useState('Continue Tab Aspirin 75mg OD and Tab Atorvastatin 20mg HS.');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRecords([...store.cardiologyRecords]);
      setCurrentRole(store.currentStaffRole);
    });
    return unsub;
  }, []);

  const handleAddCardiology = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    store.addCardiologyRecord({
      patient_id: `pat-${Date.now().toString().slice(-4)}`,
      patient_name: patientName,
      cardiologist_id: 'doc-vns-card-1',
      cardiologist_name: doctorName,
      visit_type: visitType,
      cardiac_history: treatmentPlan || 'Hypertension, Cardiac Evaluation',
      ecg_findings: ecgFindings,
      echo_ef_percent: Number(efPercent),
      echo_findings: echoNotes,
      status: 'Consultation',
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
    });

    setShowAddModal(false);
    setPatientName('');
  };

  const canEdit = currentRole === 'Admin' || currentRole === 'Doctor' || currentRole === 'Cardiologist';

  return (
    <div className="space-y-6">
      
      <RoleAccessBar currentRole={currentRole} onRoleChange={(r) => store.setStaffRole(r)} />

      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Heart className="w-4 h-4" /> Comprehensive Cardiology & Cath Lab Center
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Cardiac Care, 2D Echo, ECG & TMT Unit</h1>
          <p className="text-xs text-[#94A3B8]">
            Left Ventricular Ejection Fraction (LVEF%), Troponin-I biomarkers, Holter arrhythmias & cardiac intervention history
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl hover:bg-rose-600 transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> New Cardiology Entry
          </button>
        )}
      </div>

      {/* Cardiology Records Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {records.map(cd => (
          <div key={cd.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div>
                <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">{cd.visit_type}</span>
                <h3 className="font-bold text-base text-white">{cd.patient_name}</h3>
              </div>
              <button
                onClick={() => setSelectedPatientHistoryId(cd.patient_name)}
                className="px-2.5 py-1 bg-[#0F172A] border border-rose-500/40 text-rose-300 rounded-lg text-[11px] font-medium hover:bg-rose-500/10 flex items-center gap-1"
              >
                Full History <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs text-[#94A3B8]">Cardiologist: <strong className="text-slate-200">{cd.cardiologist_name}</strong> | Date: {cd.created_at}</p>

            {/* Echo & ECG Card */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                <span className="text-rose-400 font-bold block mb-1">2D Echo (LVEF)</span>
                <p className="text-2xl font-bold text-emerald-400">{cd.echo_ef_percent}%</p>
                <p className="text-[#94A3B8] text-[10px] mt-1">{cd.echo_findings}</p>
              </div>

              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                <span className="text-[#38BDF8] font-bold block mb-1">Troponin-I Level</span>
                <p className="text-lg font-bold text-white">{cd.cardiac_biomarkers?.troponin_i_ng_ml || 0.01} ng/mL</p>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Normal (&lt; 0.04)</span>
              </div>
            </div>

            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155] text-xs space-y-1">
              <span className="text-[#94A3B8] block text-[11px] font-bold">ECG Analysis:</span>
              <p className="text-slate-200">{cd.ecg_findings}</p>
              {cd.treatment_plan && <p className="text-emerald-400 font-semibold pt-1 border-t border-[#334155]">Rx Plan: {cd.treatment_plan}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCardiology} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400" /> New Cardiology Evaluation
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Visit Type</label>
                <select
                  value={visitType}
                  onChange={e => setVisitType(e.target.value as any)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                >
                  <option value="2D Echo">2D Echo & Doppler</option>
                  <option value="ECG">12-Lead ECG</option>
                  <option value="TMT Stress Test">TMT Stress Test</option>
                  <option value="Holter Monitoring">Holter Monitoring</option>
                  <option value="Cardiac Angiography">Cardiac Angiography</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">2D Echo LVEF %</label>
                <input
                  type="number"
                  value={efPercent}
                  onChange={e => setEfPercent(Number(e.target.value))}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">ECG Findings</label>
                <input
                  type="text"
                  value={ecgFindings}
                  onChange={e => setEcgFindings(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-[#0F172A] text-[#94A3B8] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-500 text-white font-bold text-xs rounded-xl"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedPatientHistoryId && (
        <SharedPatientHistoryModal
          patientId={selectedPatientHistoryId}
          patientName={selectedPatientHistoryId}
          onClose={() => setSelectedPatientHistoryId(null)}
        />
      )}
    </div>
  );
};
