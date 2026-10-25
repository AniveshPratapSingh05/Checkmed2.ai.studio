import React, { useState, useEffect } from 'react';
import { Activity, Plus, Shield, CheckCircle2, AlertTriangle, Eye, Image } from 'lucide-react';
import { store } from '../../../lib/store';
import { MriRecord, StaffRole } from '../../../types';
import { RoleAccessBar } from './RoleAccessBar';
import { SharedPatientHistoryModal } from './SharedPatientHistoryModal';

export const MriModule: React.FC = () => {
  const [records, setRecords] = useState<MriRecord[]>(store.mriRecords);
  const [currentRole, setCurrentRole] = useState<StaffRole>(store.currentStaffRole);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPatientHistoryId, setSelectedPatientHistoryId] = useState<string | null>(null);

  // New MRI state
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. S. K. Rastogi');
  const [bodyRegion, setBodyRegion] = useState('Brain & Brainstem (3T MRI)');
  const [contrast, setContrast] = useState(false);
  const [contrastAgent, setContrastAgent] = useState('Gadovist (Gadobutrol) 7.5 mL');
  const [egfr, setEgfr] = useState(95);
  const [machine, setMachine] = useState('Siemens Magnetom 3.0T MRI');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRecords([...store.mriRecords]);
      setCurrentRole(store.currentStaffRole);
    });
    return unsub;
  }, []);

  const handleAddMri = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    store.addMriRecord({
      patient_id: `pat-${Date.now().toString().slice(-4)}`,
      patient_name: patientName,
      doctor_id: 'doc-vns-1',
      doctor_name: doctorName,
      body_region: bodyRegion,
      machine_id: 'mri-m01',
      machine_name: machine || 'Siemens 3.0T Magnetom',
      requested_date: new Date().toISOString().split('T')[0],
      status: 'Scheduled',
      preparation_checklist: {
        pacemaker_checked: true,
        metal_implants_checked: true,
        contrast_consent_signed: true,
        renal_creatinine_ok: true
      },
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
    });

    setShowAddModal(false);
    setPatientName('');
  };

  const handleUpdateStatus = (id: string, status: MriRecord['status'], findings?: string) => {
    store.updateMriStatus(id, status, findings);
  };

  const canEdit = currentRole === 'Admin' || currentRole === 'Doctor' || currentRole === 'Radiology Technician' || currentRole === 'Radiologist';

  return (
    <div className="space-y-6">
      
      <RoleAccessBar currentRole={currentRole} onRoleChange={(r) => store.setStaffRole(r)} />

      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> Advanced Magnetic Resonance Imaging (MRI) Center
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">3.0 Tesla Silent MRI Suite & Safety Control</h1>
          <p className="text-xs text-[#94A3B8]">
            Pre-scan ferromagnet safety screening, eGFR renal clearance, contrast protocols & high-field neuro/musculoskeletal imaging
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-purple-500 text-white font-bold text-xs rounded-xl hover:bg-purple-600 transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Schedule MRI Scan
          </button>
        )}
      </div>

      {/* MRI Records Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {records.map(m => (
          <div key={m.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">MRI ID: {m.id}</span>
                <h3 className="font-bold text-base text-white">{m.body_region}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                m.status === 'Verified' || m.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                m.status === 'Scan Completed' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {m.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <p>Patient: <strong className="text-white">{m.patient_name}</strong></p>
              <p>Ordering Doctor: <span className="text-slate-400">{m.doctor_name}</span></p>
              <p>Scanner: <span className="text-purple-300 font-semibold">{m.machine_name}</span></p>
              <p>Contrast: <span className={m.preparation_checklist?.contrast_consent_signed ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>{m.preparation_checklist?.contrast_consent_signed ? 'Yes (Gadolinium)' : 'Non-Contrast'}</span></p>
            </div>

            {/* Safety Checklist Banner */}
            <div className="bg-[#0F172A] p-2.5 rounded-lg border border-[#334155] text-[11px] flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-semibold text-emerald-400">
                <Shield className="w-3.5 h-3.5" /> Ferromagnet & Renal Safety Cleared
              </span>
              <span>eGFR: <strong className="text-white">90 mL/min</strong></span>
            </div>

            {/* Findings */}
            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155] text-xs space-y-1">
              <span className="text-[#94A3B8] block text-[11px] font-bold">MRI Radiologist Findings:</span>
              <p className="text-emerald-400 font-medium">{m.findings || 'Image acquisition completed. Radiologist review in progress...'}</p>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedImage('https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=800')}
                  className="px-2.5 py-1 bg-[#0F172A] border border-purple-500/40 text-purple-300 rounded-lg text-xs font-semibold hover:bg-purple-500/10 flex items-center gap-1"
                >
                  <Image className="w-3.5 h-3.5" /> View MRI Slices
                </button>
                <button
                  onClick={() => setSelectedPatientHistoryId(m.patient_name)}
                  className="px-2 py-1 bg-[#0F172A] border border-[#334155] text-slate-300 rounded-lg text-xs hover:text-white"
                >
                  Patient History
                </button>
              </div>

              {canEdit && m.status !== 'Verified' && m.status !== 'Delivered' && (
                <button
                  onClick={() => handleUpdateStatus(m.id, 'Verified', 'Normal brain parenchyma. No acute intracranial hemorrhage or territorial infarction.')}
                  className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold hover:bg-emerald-500/30"
                >
                  Verify & Authorize
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddMri} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" /> Book 3.0T MRI Scan
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
                <label className="text-[#94A3B8] block mb-1">Body Region</label>
                <input
                  type="text"
                  required
                  value={bodyRegion}
                  onChange={e => setBodyRegion(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="mriContrast"
                  checked={contrast}
                  onChange={e => setContrast(e.target.checked)}
                  className="rounded bg-[#0F172A] border-[#334155]"
                />
                <label htmlFor="mriContrast" className="text-white font-semibold">Contrast Enhanced MRI (Gadolinium)</label>
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
                className="px-4 py-2 bg-purple-500 text-white font-bold text-xs rounded-xl"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-2xl w-full p-4 space-y-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <h3 className="font-bold text-white text-sm">3.0T High-Resolution MRI Multi-Slice Viewer</h3>
              <button onClick={() => setSelectedImage(null)} className="text-[#94A3B8] hover:text-white font-bold text-xs">Close</button>
            </div>
            <div className="bg-black rounded-xl p-2 flex items-center justify-center min-h-[300px]">
              <img src={selectedImage} alt="MRI DICOM" className="max-h-[60vh] object-contain rounded-lg" />
            </div>
          </div>
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
