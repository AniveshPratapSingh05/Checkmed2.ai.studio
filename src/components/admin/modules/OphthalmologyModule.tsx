import React, { useState, useEffect } from 'react';
import { Eye, Plus, Calendar, CheckCircle2, Clock, User, FileText, Activity, Shield, ChevronRight } from 'lucide-react';
import { store } from '../../../lib/store';
import { EyeRecord, EyeSurgeryRecord, StaffRole } from '../../../types';
import { RoleAccessBar } from './RoleAccessBar';
import { SharedPatientHistoryModal } from './SharedPatientHistoryModal';

export const OphthalmologyModule: React.FC = () => {
  const [eyeRecords, setEyeRecords] = useState<EyeRecord[]>(store.eyeRecords);
  const [surgeries, setSurgeries] = useState<EyeSurgeryRecord[]>(store.eyeSurgeries);
  const [currentRole, setCurrentRole] = useState<StaffRole>(store.currentStaffRole);
  
  const [activeTab, setActiveTab] = useState<'opd' | 'surgeries'>('opd');
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [showScheduleSurgeryModal, setShowScheduleSurgeryModal] = useState(false);
  const [selectedPatientHistoryId, setSelectedPatientHistoryId] = useState<string | null>(null);

  // New Eye Record form state
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Vivek Malhotra');
  const [vaOd, setVaOd] = useState('6/6');
  const [vaOs, setVaOs] = useState('6/6');
  const [iopOd, setIopOd] = useState(15);
  const [iopOs, setIopOs] = useState(15);
  const [refrOd, setRefrOd] = useState('+0.00 DS');
  const [refrOs, setRefrOs] = useState('+0.00 DS');
  const [fundusOd, setFundusOd] = useState('Normal optic disc, clear macular region.');
  const [fundusOs, setFundusOs] = useState('Normal optic disc, clear macular region.');
  const [slitLamp, setSlitLamp] = useState('Anterior segment clear bilateral.');
  const [doctorNotes, setDoctorNotes] = useState('Routine visual assessment.');

  // New Surgery Form State
  const [surgPatientName, setSurgPatientName] = useState('');
  const [surgDoctor, setSurgDoctor] = useState('Dr. Vivek Malhotra');
  const [eyeChoice, setEyeChoice] = useState<'Right Eye (OD)' | 'Left Eye (OS)' | 'Both Eyes (OU)'>('Right Eye (OD)');
  const [procedureName, setProcedureName] = useState('Cataract Phacoemulsification with Foldable Monofocal IOL');
  const [scheduledDate, setScheduledDate] = useState('2026-08-16');
  const [scheduledTime, setScheduledTime] = useState('10:00 AM');
  const [otAllocation, setOtAllocation] = useState('OT-3 Eye Care Suite');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setEyeRecords([...store.eyeRecords]);
      setSurgeries([...store.eyeSurgeries]);
      setCurrentRole(store.currentStaffRole);
    });
    return unsub;
  }, []);

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    store.addEyeRecord({
      patient_id: `pat-${Date.now().toString().slice(-4)}`,
      patient_name: patientName,
      doctor_id: 'doc-vns-5',
      doctor_name: doctorName,
      visit_date: new Date().toISOString().split('T')[0],
      visual_acuity_od: vaOd,
      visual_acuity_os: vaOs,
      iop_od_mmHg: Number(iopOd),
      iop_os_mmHg: Number(iopOs),
      refraction_od: refrOd,
      refraction_os: refrOs,
      fundus_notes_od: fundusOd,
      fundus_notes_os: fundusOs,
      slit_lamp_notes: slitLamp,
      doctor_notes: doctorNotes,
      status: 'Completed',
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
    });

    setShowAddRecordModal(false);
    setPatientName('');
  };

  const handleScheduleSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!surgPatientName) return;

    store.addEyeSurgery({
      patient_id: `pat-${Date.now().toString().slice(-4)}`,
      patient_name: surgPatientName,
      doctor_id: 'doc-vns-5',
      doctor_name: surgDoctor,
      eye: eyeChoice,
      procedure_name: procedureName,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      ot_allocation: otAllocation,
      status: 'Scheduled',
      pre_op_checklist: {
        consent_signed: true,
        pupil_dilated: true,
        biometry_completed: true,
        bp_sugar_cleared: true
      }
    });

    setShowScheduleSurgeryModal(false);
    setSurgPatientName('');
  };

  const handleUpdateSurgeryStatus = (id: string, status: EyeSurgeryRecord['status']) => {
    store.updateEyeSurgeryStatus(id, status);
  };

  const canEdit = currentRole === 'Admin' || currentRole === 'Doctor';

  return (
    <div className="space-y-6">
      
      {/* Role Access Bar */}
      <RoleAccessBar currentRole={currentRole} onRoleChange={(r) => store.setStaffRole(r)} />

      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
            <Eye className="w-4 h-4" /> Ophthalmology & Vision Care Department
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Eye OPD & Ophthalmic Surgery Center</h1>
          <p className="text-xs text-[#94A3B8]">
            Separate Right Eye (OD) / Left Eye (OS) records, refraction, IOP tonometry, slit lamp & OT surgery tracking
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowAddRecordModal(true)}
              className="px-4 py-2 bg-[#38BDF8] text-[#0F172A] font-bold text-xs rounded-xl hover:bg-[#0284C7] transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" /> New Eye OPD Record
            </button>
            <button
              onClick={() => setShowScheduleSurgeryModal(true)}
              className="px-4 py-2 bg-[#A855F7] text-white font-bold text-xs rounded-xl hover:bg-[#9333EA] transition-all flex items-center gap-2 shadow-md"
            >
              <Calendar className="w-4 h-4" /> Schedule Eye Surgery
            </button>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#334155] gap-4">
        <button
          onClick={() => setActiveTab('opd')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'opd'
              ? 'border-[#38BDF8] text-[#38BDF8]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <Eye className="w-4 h-4" /> Eye OPD Consultation Records ({eyeRecords.length})
        </button>
        <button
          onClick={() => setActiveTab('surgeries')}
          className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'surgeries'
              ? 'border-[#A855F7] text-[#A855F7]'
              : 'border-transparent text-[#94A3B8] hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" /> Ophthalmic Surgeries & OT Schedule ({surgeries.length})
        </button>
      </div>

      {/* OPD Records List */}
      {activeTab === 'opd' && (
        <div className="grid gap-4 md:grid-cols-2">
          {eyeRecords.map(rec => (
            <div key={rec.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#334155]">
                <div>
                  <h3 className="font-bold text-base text-white">{rec.patient_name}</h3>
                  <p className="text-xs text-[#94A3B8]">Attending: {rec.doctor_name} | {rec.visit_date}</p>
                </div>
                <button
                  onClick={() => setSelectedPatientHistoryId(rec.patient_name)}
                  className="px-2.5 py-1 bg-[#0F172A] border border-[#38BDF8]/40 text-[#38BDF8] rounded-lg text-[11px] font-medium hover:bg-[#38BDF8]/10 transition-colors flex items-center gap-1"
                >
                  Full History <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Eye Visual Acuity OD vs OS Table */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                  <span className="text-[#38BDF8] font-bold block mb-1">Right Eye (OD)</span>
                  <div className="space-y-1 text-slate-300">
                    <p>Visual Acuity: <strong className="text-white">{rec.visual_acuity_od}</strong></p>
                    <p>IOP: <strong className="text-emerald-400">{rec.iop_od_mmHg} mmHg</strong></p>
                    <p className="truncate">Refraction: {rec.refraction_od}</p>
                  </div>
                </div>

                <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]">
                  <span className="text-[#A855F7] font-bold block mb-1">Left Eye (OS)</span>
                  <div className="space-y-1 text-slate-300">
                    <p>Visual Acuity: <strong className="text-white">{rec.visual_acuity_os}</strong></p>
                    <p>IOP: <strong className="text-emerald-400">{rec.iop_os_mmHg} mmHg</strong></p>
                    <p className="truncate">Refraction: {rec.refraction_os}</p>
                  </div>
                </div>
              </div>

              {/* Exam Notes */}
              <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155] space-y-1 text-xs text-[#94A3B8]">
                <p><strong className="text-slate-200">Slit Lamp:</strong> {rec.slit_lamp_notes}</p>
                <p><strong className="text-slate-200">Fundus OD:</strong> {rec.fundus_notes_od}</p>
                <p><strong className="text-slate-200">Fundus OS:</strong> {rec.fundus_notes_os}</p>
                <p className="text-emerald-400 font-semibold pt-1 border-t border-[#334155]">Doctor Advice: {rec.doctor_notes}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Surgeries List */}
      {activeTab === 'surgeries' && (
        <div className="space-y-4">
          {surgeries.map(s => (
            <div key={s.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-[#A855F7]/20 text-[#A855F7] border border-[#A855F7]/40 font-bold text-xs rounded-lg">
                    {s.eye}
                  </span>
                  <h3 className="font-bold text-base text-white">{s.procedure_name}</h3>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Patient: <strong className="text-white">{s.patient_name}</strong> | Surgeon: <strong className="text-slate-300">{s.doctor_name}</strong> | OT: <strong className="text-[#38BDF8]">{s.ot_allocation}</strong>
                </p>
                <p className="text-xs text-slate-300">
                  Scheduled Date: <strong>{s.scheduled_date} at {s.scheduled_time}</strong>
                </p>
              </div>

              {/* Status Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <span className="text-xs text-[#94A3B8]">Surgery Status:</span>
                <div className="flex gap-1.5 flex-wrap">
                  {(['Scheduled', 'Pre-Op', 'In Surgery', 'Recovery', 'Completed'] as const).map(st => (
                    <button
                      key={st}
                      disabled={!canEdit}
                      onClick={() => handleUpdateSurgeryStatus(s.id, st)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        s.status === st
                          ? 'bg-[#10B981] text-white shadow-md'
                          : 'bg-[#0F172A] text-[#94A3B8] hover:bg-[#334155]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add OPD Record Modal */}
      {showAddRecordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddRecord} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-[#38BDF8]" /> Add New Eye Examination Record
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  placeholder="e.g. Ramesh Chandra"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Attending Eye Specialist</label>
                <input
                  type="text"
                  required
                  value={doctorName}
                  onChange={e => setDoctorName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Right Eye Acuity (OD)</label>
                <input
                  type="text"
                  value={vaOd}
                  onChange={e => setVaOd(e.target.value)}
                  placeholder="e.g. 6/6 or 6/18"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Left Eye Acuity (OS)</label>
                <input
                  type="text"
                  value={vaOs}
                  onChange={e => setVaOs(e.target.value)}
                  placeholder="e.g. 6/6 or 6/9"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">IOP Right Eye (mmHg)</label>
                <input
                  type="number"
                  value={iopOd}
                  onChange={e => setIopOd(Number(e.target.value))}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">IOP Left Eye (mmHg)</label>
                <input
                  type="number"
                  value={iopOs}
                  onChange={e => setIopOs(Number(e.target.value))}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[#94A3B8] block mb-1 text-xs">Doctor Advice & Notes</label>
              <textarea
                rows={2}
                value={doctorNotes}
                onChange={e => setDoctorNotes(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white text-xs"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddRecordModal(false)}
                className="px-4 py-2 bg-[#0F172A] text-[#94A3B8] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#38BDF8] text-[#0F172A] font-bold text-xs rounded-xl"
              >
                Save Record
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Schedule Eye Surgery Modal */}
      {showScheduleSurgeryModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleScheduleSurgery} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#A855F7]" /> Schedule Ophthalmic OT Surgery
            </h2>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={surgPatientName}
                  onChange={e => setSurgPatientName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Eye To Operate</label>
                <select
                  value={eyeChoice}
                  onChange={e => setEyeChoice(e.target.value as any)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                >
                  <option value="Right Eye (OD)">Right Eye (OD)</option>
                  <option value="Left Eye (OS)">Left Eye (OS)</option>
                  <option value="Both Eyes (OU)">Both Eyes (OU)</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-[#94A3B8] block mb-1">Procedure Name</label>
                <input
                  type="text"
                  required
                  value={procedureName}
                  onChange={e => setProcedureName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Scheduled Date</label>
                <input
                  type="date"
                  required
                  value={scheduledDate}
                  onChange={e => setScheduledDate(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">OT Allocation</label>
                <input
                  type="text"
                  value={otAllocation}
                  onChange={e => setOtAllocation(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleSurgeryModal(false)}
                className="px-4 py-2 bg-[#0F172A] text-[#94A3B8] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#A855F7] text-white font-bold text-xs rounded-xl"
              >
                Schedule Surgery
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Shared Medical History Modal */}
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
