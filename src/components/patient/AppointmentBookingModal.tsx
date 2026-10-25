import React, { useState, useEffect } from 'react';
import { X, Ticket, Sparkles, Mic, FileText, User, Heart } from 'lucide-react';
import { Doctor, Appointment, Token } from '../../types';
import { store } from '../../lib/store';
import { VoiceBookingAssistant } from './VoiceBookingAssistant';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDoctor: Doctor | null;
  onBookingComplete: (appointment: Appointment, token: Token) => void;
  bookingForPatient?: {
    id: string;
    name: string;
    age?: number;
    phone?: string;
    blood_group?: string;
    health_issue?: string;
    relationship?: string;
  } | null;
}

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  isOpen,
  onClose,
  selectedDoctor,
  onBookingComplete,
  bookingForPatient
}) => {
  const [bookingMode, setBookingMode] = useState<'form' | 'voice'>('voice');
  const [doctorId, setDoctorId] = useState<string>(selectedDoctor?.id || store.doctors[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState<string>('10:00 AM');
  const [reason, setReason] = useState<string>(bookingForPatient?.health_issue || '');
  const [consultationType, setConsultationType] = useState<'In-Person' | 'Tele-Consultation'>('In-Person');

  // Selected target patient (Primary Account or a Family Member)
  const currentPatient = store.currentUser || store.patients[0];
  const familyMembers = currentPatient ? store.getFamilyMembers(currentPatient.id) : [];
  
  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    bookingForPatient?.id || currentPatient?.id || ''
  );

  useEffect(() => {
    if (bookingForPatient) {
      setSelectedTargetId(bookingForPatient.id);
      if (bookingForPatient.health_issue && !reason) {
        setReason(bookingForPatient.health_issue);
      }
    } else if (currentPatient) {
      setSelectedTargetId(currentPatient.id);
    }
  }, [bookingForPatient, currentPatient]);

  if (!isOpen) return null;

  // Resolve target patient name and details
  const activeFamilyMember = familyMembers.find(f => f.id === selectedTargetId);
  const isFamilyMemberSelected = !!activeFamilyMember || (bookingForPatient && bookingForPatient.id === selectedTargetId);
  
  const targetPatientName = activeFamilyMember 
    ? activeFamilyMember.name 
    : (bookingForPatient && bookingForPatient.id === selectedTargetId ? bookingForPatient.name : currentPatient?.full_name || 'Patient');
    
  const targetPatientBlood = activeFamilyMember?.blood_group || bookingForPatient?.blood_group || currentPatient?.blood_group || 'O+';
  const targetPatientRel = activeFamilyMember?.relationship || bookingForPatient?.relationship || '';

  const activeDoctor = store.doctors.find(d => d.id === doctorId) || selectedDoctor || store.doctors[0];

  const availableSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', 
    '11:30 AM', '02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient || !activeDoctor || !reason) return;

    const { appointment, token } = store.bookAppointment({
      patient_id: selectedTargetId || currentPatient.id,
      patient_name: targetPatientName,
      doctor_id: activeDoctor.id,
      appointment_date: appointmentDate,
      time_slot: timeSlot,
      reason,
      consultation_type: consultationType
    });

    onBookingComplete(appointment, token);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#1E293B] text-[#F8FAFC] w-full max-w-lg rounded-2xl shadow-2xl border border-[#334155] overflow-hidden my-8">
        
        {/* Header */}
        <div className="bg-[#0F172A] p-6 border-b border-[#334155] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Ticket className="w-5 h-5 text-[#38BDF8]" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#38BDF8]">OPD Token Generator</span>
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC]">Book OPD Appointment</h3>
          <p className="text-xs text-[#94A3B8] mt-1">
            {isFamilyMemberSelected ? (
              <span className="text-emerald-400 font-medium">
                👨‍👩‍👧‍👦 Booking for family member: <strong>{targetPatientName}</strong>
              </span>
            ) : (
              'Generate your live OPD queue token & slot instantly.'
            )}
          </p>

          {/* Booking Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 mt-4 p-1 bg-[#1E293B] border border-[#334155] rounded-xl">
            <button
              type="button"
              onClick={() => setBookingMode('voice')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                bookingMode === 'voice'
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-white" /> 🎙️ Voice Controlled Mode
            </button>
            <button
              type="button"
              onClick={() => setBookingMode('form')}
              className={`py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                bookingMode === 'form'
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> 📝 Manual Form Mode
            </button>
          </div>
        </div>

        {/* Content Section */}
        {bookingMode === 'voice' ? (
          <div className="p-4">
            <VoiceBookingAssistant
              initialDoctor={selectedDoctor}
              onClose={onClose}
              bookingForPatient={isFamilyMemberSelected ? {
                id: selectedTargetId,
                name: targetPatientName,
                relationship: targetPatientRel,
                blood_group: targetPatientBlood,
                health_issue: reason
              } : undefined}
              onBookingComplete={(apt, tok) => {
                onBookingComplete(apt, tok);
                onClose();
              }}
            />
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Patient Selection (Primary Account vs Family Member) */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">
                Booking Patient (Account / Family Member)
              </label>
              <select
                value={selectedTargetId}
                onChange={(e) => {
                  const val = e.target.value;
                  setSelectedTargetId(val);
                  const mem = familyMembers.find(f => f.id === val);
                  if (mem?.health_issue) setReason(mem.health_issue);
                }}
                className="w-full text-xs p-3 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9] font-medium"
              >
                <option value={currentPatient?.id}>
                  👤 {currentPatient?.full_name} (Myself - Primary Account)
                </option>
                {familyMembers.map(f => (
                  <option key={f.id} value={f.id}>
                    👨‍👩‍👧‍👦 {f.name} ({f.relationship || 'Family'} - Age: {f.age}, {f.health_issue})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Patient Details Preview */}
            <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
              isFamilyMemberSelected 
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' 
                : 'bg-[#0F172A] border-[#334155]'
            }`}>
              <div>
                <span className="text-[10px] text-[#94A3B8] block font-bold uppercase">
                  {isFamilyMemberSelected ? '👨‍👩‍👧‍👦 Selected Family Member' : 'Primary Patient Account'}
                </span>
                <span className="font-bold text-[#F8FAFC]">
                  {targetPatientName} {targetPatientRel ? `(${targetPatientRel})` : ''}
                </span>
              </div>
              <span className="text-[10px] bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/30 px-2 py-0.5 rounded-md font-bold">
                Blood: {targetPatientBlood}
              </span>
            </div>

            {/* Select Doctor */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Select Doctor / Specialist</label>
              <select
                value={doctorId}
                onChange={(e) => setDoctorId(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9] font-medium"
              >
                {store.doctors.map(doc => (
                  <option key={doc.id} value={doc.id}>
                    {doc.full_name} ({doc.department}) - Fee: ₹{doc.consultation_fee} [{doc.room_no}]
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor preview */}
            {activeDoctor && (
              <div className="flex items-center gap-3 p-3 bg-[#0F172A] border border-[#0EA5E9]/30 rounded-xl text-xs">
                <img src={activeDoctor.avatar_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-[#334155]" />
                <div>
                  <p className="font-bold text-[#F8FAFC]">{activeDoctor.full_name}</p>
                  <p className="text-[11px] text-[#38BDF8]">{activeDoctor.specialization}</p>
                  <p className="text-[10px] text-[#94A3B8]">Room: {activeDoctor.room_no} | Timings: {activeDoctor.shift_hours}</p>
                </div>
              </div>
            )}

            {/* Consultation Type */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Consultation Mode</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setConsultationType('In-Person')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    consultationType === 'In-Person'
                      ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-xs'
                      : 'bg-[#0F172A] text-[#94A3B8] border-[#334155] hover:bg-[#334155]'
                  }`}
                >
                  🏥 In-Person OPD
                </button>
                <button
                  type="button"
                  onClick={() => setConsultationType('Tele-Consultation')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    consultationType === 'Tele-Consultation'
                      ? 'bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-xs'
                      : 'bg-[#0F172A] text-[#94A3B8] border-[#334155] hover:bg-[#334155]'
                  }`}
                >
                  💻 Video Tele-Consult
                </button>
              </div>
            </div>

            {/* Date and Time Slot */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Appointment Date</label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9] font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Time Slot</label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9] font-medium"
                >
                  {availableSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Reason */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Symptoms / Reason for Visit</label>
              <textarea
                required
                rows={2}
                placeholder="e.g. Chest pain, Routine BP checkup, High fever..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <Sparkles className="w-4 h-4 text-white" /> Confirm Booking & Generate Token
            </button>

          </form>
        )}
      </div>
    </div>
  );
};
