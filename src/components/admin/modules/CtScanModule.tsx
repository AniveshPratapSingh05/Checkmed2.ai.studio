import React, { useState, useEffect } from 'react';
import { Activity, Plus, Shield, CheckCircle2, Image, Eye } from 'lucide-react';
import { store } from '../../../lib/store';
import { CtScanRecord, StaffRole } from '../../../types';
import { RoleAccessBar } from './RoleAccessBar';
import { SharedPatientHistoryModal } from './SharedPatientHistoryModal';

export const CtScanModule: React.FC = () => {
  const [records, setRecords] = useState<CtScanRecord[]>(store.ctScanRecords);
  const [currentRole, setCurrentRole] = useState<StaffRole>(store.currentStaffRole);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPatientHistoryId, setSelectedPatientHistoryId] = useState<string | null>(null);

  // New CT scan state
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. S. K. Rastogi');
  const [scanType, setScanType] = useState('HRCT Chest (High Resolution CT)');
  const [contrast, setContrast] = useState(true);
  const [contrastType, setContrastType] = useState('Omnipaque (Iohexol 350) 80 mL');
  const [dlp, setDlp] = useState(280);

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRecords([...store.ctScanRecords]);
      setCurrentRole(store.currentStaffRole);
    });
    return unsub;
  }, []);

  const handleAddCtScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    store.addCtScanRecord({
      patient_id: `pat-${Date.now().toString().slice(-4)}`,
      patient_name: patientName,
      doctor_id: 'doc-vns-1',
      doctor_name: doctorName,
      scan_type: scanType,
      body_region: scanType,
      machine_id: 'ct-m01',
      machine_name: 'Somatom 128-Slice CT',
      requested_date: new Date().toISOString().split('T')[0],
      safety_checklist: {
        contrast_allergy_checked: true,
        serum_creatinine_verified: true,
        fasting_npo_status_ok: true
      },
      status: 'Requested',
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
    });

    setShowAddModal(false);
    setPatientName('');
  };

  const handleUpdateStatus = (id: string, status: CtScanRecord['status'], findings?: string) => {
    store.updateCtScanStatus(id, status, findings);
  };

  const canEdit = currentRole === 'Admin' || currentRole === 'Doctor' || currentRole === 'Radiology Technician' || currentRole === 'Radiologist';

  return (
    <div className="space-y-6">
      
      <RoleAccessBar currentRole={currentRole} onRoleChange={(r) => store.setStaffRole(r)} />

      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> 128-Slice Computed Tomography (CT) Center
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">High-Speed Multi-Slice CT & Angiography Suite</h1>
          <p className="text-xs text-[#94A3B8]">
            HRCT thorax, contrast enhanced CT (CECT), radiation Dose Length Product (DLP) logging & 3D reconstruction
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-500 text-[#0F172A] font-bold text-xs rounded-xl hover:bg-amber-600 transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Book CT Scan
          </button>
        )}
      </div>

      {/* CT Scan Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {records.map(c => (
          <div key={c.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">CT ID: {c.id}</span>
                <h3 className="font-bold text-base text-white">{c.scan_type}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                c.status === 'Verified' || c.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                c.status === 'Scan Completed' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
              }`}>
                {c.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <p>Patient: <strong className="text-white">{c.patient_name}</strong></p>
              <p>Ordering Doc: <span className="text-slate-400">{c.doctor_name}</span></p>
              <p>Slices: <span className="text-amber-400 font-semibold">{c.slice_count || 128} Slices</span></p>
              <p>DLP Dose: <span className="text-emerald-400 font-semibold">{c.radiation_dose_dlp || 280} mGy*cm</span></p>
            </div>

            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155] text-xs space-y-1">
              <span className="text-[#94A3B8] block text-[11px] font-bold">CT Radiologist Findings:</span>
              <p className="text-emerald-400 font-medium">{c.findings || 'CT acquisition completed. Multi-planar 3D reconstruction in progress...'}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedImage('https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800')}
                  className="px-2.5 py-1 bg-[#0F172A] border border-amber-500/40 text-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-500/10 flex items-center gap-1"
                >
                  <Image className="w-3.5 h-3.5" /> View CT 3D Slices
                </button>
                <button
                  onClick={() => setSelectedPatientHistoryId(c.patient_name)}
                  className="px-2 py-1 bg-[#0F172A] border border-[#334155] text-slate-300 rounded-lg text-xs hover:text-white"
                >
                  Patient History
                </button>
              </div>

              {canEdit && c.status !== 'Verified' && c.status !== 'Delivered' && (
                <button
                  onClick={() => handleUpdateStatus(c.id, 'Verified', 'High-resolution CT shows clear parenchymal fields. No bronchiectasis, fibrotic scarring or nodular opacity.')}
                  className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold hover:bg-emerald-500/30"
                >
                  Verify & Sign
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCtScan} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-400" /> Book 128-Slice CT Scan
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
                <label className="text-[#94A3B8] block mb-1">Scan Type</label>
                <input
                  type="text"
                  required
                  value={scanType}
                  onChange={e => setScanType(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="ctContrast"
                  checked={contrast}
                  onChange={e => setContrast(e.target.checked)}
                  className="rounded bg-[#0F172A] border-[#334155]"
                />
                <label htmlFor="ctContrast" className="text-white font-semibold">Contrast Enhanced CT (Iohexol)</label>
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
                className="px-4 py-2 bg-amber-500 text-[#0F172A] font-bold text-xs rounded-xl"
              >
                Confirm Scan Order
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
              <h3 className="font-bold text-white text-sm">128-Slice Multi-Planar CT Slices & 3D Angiogram</h3>
              <button onClick={() => setSelectedImage(null)} className="text-[#94A3B8] hover:text-white font-bold text-xs">Close</button>
            </div>
            <div className="bg-black rounded-xl p-2 flex items-center justify-center min-h-[300px]">
              <img src={selectedImage} alt="CT Slices" className="max-h-[60vh] object-contain rounded-lg" />
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
