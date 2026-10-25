import React, { useState } from 'react';
import { Doctor, Patient, DoctorRequestType } from '../../types';
import { store } from '../../lib/store';
import { 
  Bed, 
  Wind, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Building2, 
  ShieldCheck, 
  Send,
  Sparkles
} from 'lucide-react';

interface DoctorResourceRequestModalProps {
  doctor: Doctor;
  initialPatient?: Patient | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DoctorResourceRequestModal: React.FC<DoctorResourceRequestModalProps> = ({
  doctor,
  initialPatient,
  onClose,
  onSuccess
}) => {
  const doctorPatients = store.getDoctorPatients(doctor.id);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatient?.id || (doctorPatients[0]?.id || '')
  );

  const [requestType, setRequestType] = useState<DoctorRequestType>('Room');
  const [roomType, setRoomType] = useState('Private Deluxe Room');
  const [priority, setPriority] = useState<'Routine' | 'Urgent' | 'Emergency' | 'Critical'>('Urgent');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const selectedPatient = store.patients.find(p => p.id === selectedPatientId) || initialPatient;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!selectedPatient) {
      setErrorMsg('Please select a patient for this resource request.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please provide a clinical indication/reason for this request.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      store.submitDoctorResourceRequest({
        doctor_id: doctor.id,
        doctor_name: doctor.full_name,
        patient_id: selectedPatient.id,
        patient_name: selectedPatient.full_name,
        request_type: requestType,
        room_type: roomType,
        priority: priority,
        reason: reason.trim(),
        hospital_name: doctor.hospital_name || 'Sir Sunderlal Hospital (IMS BHU)'
      });

      setIsSubmitting(false);
      setSubmittedSuccess(true);

      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1400);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-xl bg-[#1E293B] rounded-3xl border border-sky-500/40 shadow-2xl p-6 relative my-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-[#0F172A] border border-[#334155] transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#334155]">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              Request Hospital Resource <span>🏥</span>
            </h3>
            <p className="text-xs text-slate-400">
              Doctor: <strong className="text-white">{doctor.full_name}</strong> ({doctor.specialization})
            </p>
          </div>
        </div>

        {submittedSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="font-bold text-base text-white">Resource Request Dispatched!</h4>
            <p className="text-xs text-emerald-300">
              Your request for <strong>{requestType}</strong> for patient <strong>{selectedPatient?.full_name}</strong> has been sent to Hospital Operations & Nursing Desk for instant bed allocation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 flex items-center gap-2 text-xs">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* 1. Patient Selection */}
            <div>
              <label className="block text-xs font-bold text-sky-400 uppercase mb-1.5">
                Select Patient *
              </label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-sky-400"
              >
                {doctorPatients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.id}) — Age: {p.age}, Blood: {p.blood_group} {p.room_no ? `• Current: ${p.room_no}` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Request Type Selection */}
            <div>
              <label className="block text-xs font-bold text-sky-400 uppercase mb-1.5">
                Resource Category Required *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'Room' as DoctorRequestType, icon: Bed, label: 'Inpatient Room' },
                  { type: 'ICU Bed' as DoctorRequestType, icon: Activity, label: 'Critical ICU Bed' },
                  { type: 'Oxygen Support' as DoctorRequestType, icon: Wind, label: 'Oxygen Support' }
                ].map(item => {
                  const Icon = item.icon;
                  const isSel = requestType === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setRequestType(item.type);
                        if (item.type === 'Room') setRoomType('Private Deluxe Room');
                        if (item.type === 'ICU Bed') setRoomType('Cardiac / Neuro ICU Bed');
                        if (item.type === 'Oxygen Support') setRoomType('High-Flow Nasal Cannula (HFNC)');
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition text-center font-bold ${
                        isSel
                          ? 'bg-sky-600/30 border-sky-400 text-white shadow-lg'
                          : 'bg-[#0F172A] border-[#334155] text-slate-400 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSel ? 'text-sky-400' : 'text-slate-400'}`} />
                      <span className="text-[11px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Sub-Category / Ward Specification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Specific Unit / Ward Type
                </label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-sky-400"
                >
                  {requestType === 'Room' && (
                    <>
                      <option value="Private Deluxe Room">Private Deluxe Room</option>
                      <option value="Semi-Private Twin Sharing">Semi-Private Twin Sharing</option>
                      <option value="General Medical Ward">General Medical Ward</option>
                      <option value="Day Care Surgery Recovery">Day Care Surgery Recovery</option>
                      <option value="Isolation / Negative Pressure Ward">Isolation / Negative Pressure Ward</option>
                    </>
                  )}
                  {requestType === 'ICU Bed' && (
                    <>
                      <option value="Cardiac ICU (CICU) Bed">Cardiac ICU (CICU) Bed</option>
                      <option value="Neuro ICU (NICU) Bed">Neuro ICU (NICU) Bed</option>
                      <option value="Medical ICU (MICU) Bed">Medical ICU (MICU) Bed</option>
                      <option value="Surgical ICU (SICU) Bed">Surgical ICU (SICU) Bed</option>
                    </>
                  )}
                  {requestType === 'Oxygen Support' && (
                    <>
                      <option value="High-Flow Nasal Cannula (HFNC 4-6 L/min)">High-Flow Nasal Cannula (HFNC 4-6 L/min)</option>
                      <option value="Venturi Mask (40-60% FiO2)">Venturi Mask (40-60% FiO2)</option>
                      <option value="BiPAP / Non-Invasive Positive Pressure">BiPAP / Non-Invasive Positive Pressure</option>
                      <option value="Mechanical Invasive Ventilator Line">Mechanical Invasive Ventilator Line</option>
                      <option value="Portable B-Type Oxygen Cylinder (10L)">Portable B-Type Oxygen Cylinder (10L)</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Urgency / Clinical Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-xs py-2 px-3 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-sky-400"
                >
                  <option value="Routine">Routine (Elective / Scheduled)</option>
                  <option value="Urgent">Urgent (Within 1-2 Hours)</option>
                  <option value="Emergency">Emergency (Immediate / Code Blue)</option>
                  <option value="Critical">Critical (Life-Threatening)</option>
                </select>
              </div>
            </div>

            {/* 4. Clinical Indication / Reason */}
            <div>
              <label className="block text-xs font-bold text-sky-400 uppercase mb-1">
                Clinical Indication / Diagnosis & Order Notes *
              </label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Patient requires continuous cardiac telemetry observation post-angiography..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-sky-400"
              />
            </div>

            {/* Submission Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Submitting Resource Order...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Authorize & Dispatch {requestType} Request</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
