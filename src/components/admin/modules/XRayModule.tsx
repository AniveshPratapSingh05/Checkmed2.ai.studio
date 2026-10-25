import React, { useState, useEffect } from 'react';
import { Activity, Plus, FileText, CheckCircle2, Clock, User, Eye, Shield, Image } from 'lucide-react';
import { store } from '../../../lib/store';
import { XRayRecord, StaffRole } from '../../../types';
import { RoleAccessBar } from './RoleAccessBar';
import { SharedPatientHistoryModal } from './SharedPatientHistoryModal';

export const XRayModule: React.FC = () => {
  const [records, setRecords] = useState<XRayRecord[]>(store.xrayRecords);
  const [currentRole, setCurrentRole] = useState<StaffRole>(store.currentStaffRole);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPatientHistoryId, setSelectedPatientHistoryId] = useState<string | null>(null);

  // New Record Form
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Ananya Sen');
  const [procedure, setProcedure] = useState('Chest X-Ray (PA View)');
  const [region, setRegion] = useState('Chest / Thorax');
  const [viewType, setViewType] = useState('PA View');
  const [radTech, setRadTech] = useState('Rad. Tech Suresh');
  const [radiologist, setRadiologist] = useState('Dr. K. L. Sharma (Radiologist)');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRecords([...store.xrayRecords]);
      setCurrentRole(store.currentStaffRole);
    });
    return unsub;
  }, []);

  const handleAddXRay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    store.addXRayRecord({
      patient_id: `pat-${Date.now().toString().slice(-4)}`,
      patient_name: patientName,
      doctor_id: 'doc-vns-1',
      doctor_name: doctorName,
      procedure_name: procedure,
      body_part: region,
      machine_id: 'xray-m01',
      machine_name: 'Digital Radiography DR-1',
      technician_name: radTech,
      radiologist_name: radiologist,
      requested_date: new Date().toISOString().split('T')[0],
      status: 'Requested',
      is_urgent: false,
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
    });

    setShowAddModal(false);
    setPatientName('');
  };

  const handleUpdateStatus = (id: string, status: XRayRecord['status'], findings?: string) => {
    store.updateXRayStatus(id, status, findings);
  };

  const canEdit = currentRole === 'Admin' || currentRole === 'Doctor' || currentRole === 'Radiology Technician' || currentRole === 'Radiologist';

  return (
    <div className="space-y-6">
      
      <RoleAccessBar currentRole={currentRole} onRoleChange={(r) => store.setStaffRole(r)} />

      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
            <Activity className="w-4 h-4" /> Digital Radiology & Imaging Department
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Digital X-Ray Center & PACS Viewer</h1>
          <p className="text-xs text-[#94A3B8]">
            PA/AP views, radiation dosage tracking (mGy), radiologist verification workflow & DICOM image links
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#38BDF8] text-[#0F172A] font-bold text-xs rounded-xl hover:bg-[#0284C7] transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> New X-Ray Request
          </button>
        )}
      </div>

      {/* X-Ray Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {records.map(r => (
          <div key={r.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div>
                <span className="text-[10px] text-[#38BDF8] font-bold uppercase tracking-wider">X-Ray ID: {r.id}</span>
                <h3 className="font-bold text-base text-white">{r.procedure_name}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                r.status === 'Verified' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                r.status === 'Image Uploaded' ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {r.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <p>Patient: <strong className="text-white">{r.patient_name}</strong></p>
              <p>Ordering Doc: <span className="text-slate-400">{r.doctor_name}</span></p>
              <p>View Type: <span className="text-[#38BDF8] font-semibold">{r.view_type}</span></p>
              <p>Dose: <span className="text-amber-400 font-semibold">{r.radiation_dose_mgy || 1.2} mGy</span></p>
            </div>

            {/* Findings Box */}
            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155] text-xs space-y-1">
              <span className="text-[#94A3B8] block text-[11px] font-bold">Radiologist Report:</span>
              <p className="text-emerald-400 font-medium">{r.radiologist_findings || 'Pending radiologist interpretation...'}</p>
              {r.impression && <p className="text-slate-300 italic text-[11px]">Impression: {r.impression}</p>}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between pt-2 gap-2 border-t border-[#334155]">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedImage(r.image_url || 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800')}
                  className="px-2.5 py-1 bg-[#0F172A] border border-[#38BDF8]/40 text-[#38BDF8] rounded-lg text-xs font-semibold hover:bg-[#38BDF8]/10 flex items-center gap-1.5"
                >
                  <Image className="w-3.5 h-3.5" /> View X-Ray Image
                </button>
                <button
                  onClick={() => setSelectedPatientHistoryId(r.patient_name)}
                  className="px-2 py-1 bg-[#0F172A] border border-[#334155] text-slate-300 rounded-lg text-xs hover:text-white"
                >
                  Patient History
                </button>
              </div>

              {canEdit && r.status !== 'Verified' && (
                <button
                  onClick={() => handleUpdateStatus(r.id, 'Verified', 'Clear lung fields bilaterally, cardiac shadow within normal limits.')}
                  className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold hover:bg-emerald-500/30"
                >
                  Verify & Sign Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddXRay} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#38BDF8]" /> Order Digital X-Ray Examination
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="e.g. Suman Gupta"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Procedure Name</label>
                <input
                  type="text"
                  required
                  value={procedure}
                  onChange={e => setProcedure(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">View Angle</label>
                <select
                  value={viewType}
                  onChange={e => setViewType(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                >
                  <option value="PA View">PA (Posteroanterior) View</option>
                  <option value="AP View">AP (Anteroposterior) View</option>
                  <option value="Lateral View">Lateral View</option>
                  <option value="Oblique View">Oblique View</option>
                </select>
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
                className="px-4 py-2 bg-[#38BDF8] text-[#0F172A] font-bold text-xs rounded-xl"
              >
                Submit Request
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
              <h3 className="font-bold text-white text-sm">PACS DICOM High-Resolution X-Ray Viewer</h3>
              <button onClick={() => setSelectedImage(null)} className="text-[#94A3B8] hover:text-white font-bold text-xs">Close</button>
            </div>
            <div className="bg-black rounded-xl p-2 flex items-center justify-center min-h-[300px]">
              <img src={selectedImage} alt="XRay DICOM" className="max-h-[60vh] object-contain rounded-lg" />
            </div>
            <p className="text-[11px] text-[#94A3B8] text-center">Diagnostic quality digital radiographic image • Stored on DICOM PACS Server</p>
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
