import React, { useState, useEffect } from 'react';
import { Scissors, Plus, AlertTriangle, CheckCircle2, Clock, Calendar, User, Shield } from 'lucide-react';
import { store } from '../../../lib/store';
import { OtRoom, SurgeryScheduleRecord, StaffRole } from '../../../types';
import { RoleAccessBar } from './RoleAccessBar';
import { SharedPatientHistoryModal } from './SharedPatientHistoryModal';

export const OtManagementModule: React.FC = () => {
  const [rooms, setRooms] = useState<OtRoom[]>(store.otRooms);
  const [surgeries, setSurgeries] = useState<SurgeryScheduleRecord[]>(store.surgeries);
  const [currentRole, setCurrentRole] = useState<StaffRole>(store.currentStaffRole);
  
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [selectedPatientHistoryId, setSelectedPatientHistoryId] = useState<string | null>(null);

  // Form State
  const [patientName, setPatientName] = useState('');
  const [surgeonName, setSurgeonName] = useState('Dr. Vivek Malhotra');
  const [surgeryType, setSurgeryType] = useState('Open Cholecystectomy');
  const [otId, setOtId] = useState('ot-rm-1');
  const [scheduledDate, setScheduledDate] = useState('2026-08-16');
  const [timeSlot, setTimeSlot] = useState('09:00 AM - 11:30 AM');
  const [anesthesiaType, setAnesthesiaType] = useState('General Anesthesia');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRooms([...store.otRooms]);
      setSurgeries([...store.surgeries]);
      setCurrentRole(store.currentStaffRole);
    });
    return unsub;
  }, []);

  const handleScheduleSurgery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    // Check conflict
    const hasConflict = store.checkOtConflict(otId, scheduledDate, timeSlot);
    if (hasConflict) {
      setConflictWarning(`Conflict Detected! OT Room is already occupied for date ${scheduledDate} during slot ${timeSlot}.`);
      return;
    }

    const matchedRoom = rooms.find(r => r.id === otId);

    store.addSurgery({
      patient_id: `pat-${Date.now().toString().slice(-4)}`,
      patient_name: patientName,
      ot_id: otId,
      ot_number: matchedRoom?.ot_number || 'OT Suite',
      lead_surgeon_id: 'doc-surg-1',
      lead_surgeon_name: surgeonName,
      anesthetist_name: 'Dr. Neha Verma (Anesthesia)',
      nursing_team: ['Nurse Sarita', 'Nurse Mohan'],
      surgery_type: surgeryType,
      scheduled_date: scheduledDate,
      scheduled_time_slot: timeSlot,
      required_equipment: ['C-Arm Imaging', 'Electrocautery'],
      pre_op_checklist: {
        fasting_npo_verified: true,
        blood_units_reserved: true,
        surgical_consent_signed: true,
        anesthesia_clearance_done: true
      },
      status: 'Scheduled',
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
    });

    setShowScheduleModal(false);
    setConflictWarning(null);
    setPatientName('');
  };

  const handleUpdateStatus = (id: string, status: SurgeryScheduleRecord['status']) => {
    store.updateSurgeryStatus(id, status);
  };

  const canEdit = currentRole === 'Admin' || currentRole === 'Doctor' || currentRole === 'OT Staff';

  return (
    <div className="space-y-6">
      
      <RoleAccessBar currentRole={currentRole} onRoleChange={(r) => store.setStaffRole(r)} />

      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Scissors className="w-4 h-4" /> Operation Theatre (OT) & Surgical Suite Management
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">OT Room Allocation & Conflict-Free Scheduling</h1>
          <p className="text-xs text-[#94A3B8]">
            Real-time OT room availability, automated time-slot conflict detector, anesthesia teams & sterilization logs
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowScheduleModal(true)}
            className="px-4 py-2 bg-amber-500 text-[#0F172A] font-bold text-xs rounded-xl hover:bg-amber-600 transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Schedule OT Surgery
          </button>
        )}
      </div>

      {/* OT Rooms Status Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {rooms.map(r => (
          <div key={r.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-4 shadow-md space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">{r.room_name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                r.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                r.status === 'In Surgery' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {r.status}
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">Specialty: {r.specialty}</p>
            {r.current_patient_name && (
              <div className="bg-[#0F172A] p-2 rounded-lg text-xs border border-[#334155]">
                <span className="text-[#94A3B8] block text-[10px]">Active Surgery:</span>
                <strong className="text-white block">{r.current_patient_name}</strong>
              </div>
            )}
            <p className="text-[10px] text-emerald-400 font-medium">Sterilization: {r.sanitization_status}</p>
          </div>
        ))}
      </div>

      {/* Surgeries Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#334155] bg-[#0F172A] flex justify-between items-center">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" /> Scheduled Surgical Procedures
          </h2>
          <span className="text-xs text-[#94A3B8]">Surgical Lifecycle Tracking</span>
        </div>

        <div className="divide-y divide-[#334155]">
          {surgeries.map(s => (
            <div key={s.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#0F172A]/40 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#0F172A] text-amber-400 border border-amber-500/30 rounded text-[11px] font-bold">
                    {s.ot_number}
                  </span>
                  <h3 className="font-bold text-white text-base">{s.surgery_type}</h3>
                </div>
                <p className="text-xs text-[#94A3B8]">
                  Patient: <strong className="text-white">{s.patient_name}</strong> | Lead Surgeon: <strong className="text-slate-200">{s.lead_surgeon_name}</strong>
                </p>
                <p className="text-xs text-slate-300">
                  Slot: <strong className="text-[#38BDF8]">{s.scheduled_date} ({s.scheduled_time_slot})</strong> | Anesthesia: {s.anesthesia_type}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <button
                  onClick={() => setSelectedPatientHistoryId(s.patient_name)}
                  className="px-2.5 py-1 bg-[#0F172A] border border-[#334155] text-slate-300 hover:text-white rounded-lg text-xs"
                >
                  History
                </button>

                {canEdit && (
                  <div className="flex gap-1 flex-wrap">
                    {(['Scheduled', 'Pre-Op', 'Ready', 'In Surgery', 'Recovery', 'Completed'] as const).map(st => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(s.id, st)}
                        className={`px-2 py-1 rounded text-[11px] font-bold ${
                          s.status === st ? 'bg-amber-500 text-[#0F172A]' : 'bg-[#0F172A] text-[#94A3B8] hover:bg-[#334155]'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleScheduleSurgery} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Scissors className="w-5 h-5 text-amber-400" /> Schedule Surgery & Allocate OT
            </h2>

            {conflictWarning && (
              <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                {conflictWarning}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={e => { setPatientName(e.target.value); setConflictWarning(null); }}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Select OT Room</label>
                <select
                  value={otId}
                  onChange={e => { setOtId(e.target.value); setConflictWarning(null); }}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>{r.room_name} ({r.specialty})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Surgery Procedure Type</label>
                <input
                  type="text"
                  required
                  value={surgeryType}
                  onChange={e => setSurgeryType(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#94A3B8] block mb-1">Scheduled Date</label>
                  <input
                    type="date"
                    required
                    value={scheduledDate}
                    onChange={e => { setScheduledDate(e.target.value); setConflictWarning(null); }}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                  />
                </div>

                <div>
                  <label className="text-[#94A3B8] block mb-1">Time Slot</label>
                  <input
                    type="text"
                    required
                    value={timeSlot}
                    onChange={e => { setTimeSlot(e.target.value); setConflictWarning(null); }}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 bg-[#0F172A] text-[#94A3B8] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-500 text-[#0F172A] font-bold text-xs rounded-xl"
              >
                Confirm OT Booking
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
