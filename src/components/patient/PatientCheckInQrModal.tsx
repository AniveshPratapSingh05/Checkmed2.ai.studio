import React, { useState, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  X, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  Building2, 
  Clock, 
  User, 
  MapPin, 
  Calendar, 
  ShieldCheck, 
  ScanLine, 
  Zap, 
  Download,
  AlertCircle,
  FileCheck
} from 'lucide-react';
import { Appointment, Patient, Doctor, Token } from '../../types';
import { store } from '../../lib/store';

interface PatientCheckInQrModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPatient: Patient | null;
  appointments: Appointment[];
  doctors: Doctor[];
  tokens: Token[];
  initialAppointmentId?: string | null;
  onCheckInComplete?: (appointmentId: string) => void;
}

export const PatientCheckInQrModal: React.FC<PatientCheckInQrModalProps> = ({
  isOpen,
  onClose,
  currentPatient,
  appointments,
  doctors,
  tokens,
  initialAppointmentId,
  onCheckInComplete
}) => {
  // Filter active/upcoming appointments for this patient
  const patientAppointments = currentPatient
    ? appointments.filter(a => a.patient_id === currentPatient.id || a.patient_name.toLowerCase().includes(currentPatient.full_name.toLowerCase()))
    : appointments;

  const upcomingAppts = patientAppointments.filter(a => a.status === 'Upcoming' || a.status === 'In-Progress');
  
  const [selectedApptId, setSelectedApptId] = useState<string>(
    initialAppointmentId || (upcomingAppts[0]?.id || patientAppointments[0]?.id || '')
  );

  const [copied, setCopied] = useState(false);
  const [isSimulatingScan, setIsSimulatingScan] = useState(false);
  const [scanVerifiedSuccess, setScanVerifiedSuccess] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const selectedAppt = patientAppointments.find(a => a.id === selectedApptId) || upcomingAppts[0] || patientAppointments[0];
  const matchedDoctor = selectedAppt 
    ? doctors.find(d => d.full_name.toLowerCase() === selectedAppt.doctor_name.toLowerCase() || d.id === selectedAppt.doctor_id)
    : doctors[0];
  const matchedToken = selectedAppt 
    ? tokens.find(t => t.token_number === selectedAppt.token_number || (t.doctor_name === selectedAppt.doctor_name && t.patient_name === selectedAppt.patient_name))
    : null;

  // Generate standardized JSON QR payload for hospital reception scanners
  const qrDataPayload = JSON.stringify({
    protocol: "CHECKMED_RECEPTION_FASTPASS_V2",
    checkin_code: `CHK-${selectedAppt ? selectedAppt.id.slice(0, 8).toUpperCase() : 'PATIENT-DIRECT'}`,
    patient_id: currentPatient?.id || selectedAppt?.patient_id || 'PAT-DEMO',
    patient_name: currentPatient?.full_name || selectedAppt?.patient_name || 'Registered Patient',
    contact_number: currentPatient?.contact_number || selectedAppt?.patient_phone || '+91 98765 43210',
    blood_group: currentPatient?.blood_group || 'O+',
    appointment_id: selectedAppt?.id || 'DIRECT_WALKIN',
    token_number: selectedAppt?.token_number || matchedToken?.token_number || 'OPD-101',
    doctor_name: selectedAppt?.doctor_name || matchedDoctor?.full_name || 'Dr. Specialist',
    department: selectedAppt?.department || matchedDoctor?.department || 'General OPD',
    room_no: matchedDoctor?.room_no || matchedToken?.room_no || 'Room 102',
    date: selectedAppt?.appointment_date || new Date().toISOString().split('T')[0],
    slot: selectedAppt?.time_slot || '10:00 AM',
    hospital: "Checkmed AI Super Specialty Hospital",
    issued_at: new Date().toISOString()
  });

  const checkinCode = `CHK-${selectedAppt ? selectedAppt.id.slice(0, 8).toUpperCase() : 'OPD882'}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(checkinCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateReceptionScan = () => {
    setIsSimulatingScan(true);
    setTimeout(() => {
      setIsSimulatingScan(false);
      setScanVerifiedSuccess(true);
      if (selectedAppt) {
        store.updateAppointmentStatus(selectedAppt.id, 'In-Progress');
        if (onCheckInComplete) {
          onCheckInComplete(selectedAppt.id);
        }
      }
    }, 1200);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="bg-[#0F172A] border border-[#38BDF8]/40 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#1E293B] via-[#152038] to-[#0F172A] p-5 sm:p-6 border-b border-[#334155] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 text-[10px] font-black uppercase tracking-wider border border-sky-500/30">
                  Contactless Fast-Pass
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">Hospital Reception QR Check-In</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-[#334155] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Appointment Selector (if patient has multiple) */}
          {patientAppointments.length > 1 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-400" /> Select Appointment For Check-In:
              </label>
              <select
                value={selectedApptId}
                onChange={(e) => {
                  setSelectedApptId(e.target.value);
                  setScanVerifiedSuccess(false);
                }}
                className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 py-2.5 text-xs text-white font-medium focus:ring-2 focus:ring-sky-500 outline-none"
              >
                {patientAppointments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.token_number} — {a.doctor_name} ({a.department}) | {a.appointment_date} {a.time_slot} [{a.status}]
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Verification Banner */}
          {scanVerifiedSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/60 p-4 rounded-2xl flex items-center justify-between text-xs text-emerald-300 shadow-lg animate-fadeIn">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-black text-white text-sm">Reception Check-In Verified!</p>
                  <p className="text-[11px] text-emerald-200">
                    Patient arrived at OPD desk. Token <strong>{selectedAppt?.token_number}</strong> status marked Active & queued for {matchedDoctor?.room_no || 'Consultation Room'}.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Printable / Scannable Ticket Card */}
          <div 
            ref={printRef}
            className="bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-2 border-dashed border-sky-500/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden"
          >
            {/* Top hospital branding strip */}
            <div className="flex items-center justify-between pb-4 border-b border-[#334155]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-sky-400" />
                <div>
                  <p className="text-xs font-black text-white uppercase tracking-wider">Checkmed AI Hospital</p>
                  <p className="text-[10px] text-slate-400">OPD & Reception Express Check-in Kiosk</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono bg-sky-500/10 text-sky-300 px-2.5 py-1 rounded-lg border border-sky-500/30 font-bold">
                  {checkinCode}
                </span>
              </div>
            </div>

            {/* QR Code + Info Dual Column */}
            <div className="py-5 flex flex-col sm:flex-row items-center gap-6 justify-center">
              
              {/* High-Contrast QR Code Box */}
              <div className="bg-white p-3.5 rounded-2xl shadow-2xl border-4 border-sky-400/80 flex flex-col items-center justify-center shrink-0">
                <QRCodeSVG
                  value={qrDataPayload}
                  size={168}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#0F172A"
                />
                <p className="text-[9px] font-black text-slate-800 uppercase tracking-widest mt-2">
                  Scan at Kiosk / Reception
                </p>
              </div>

              {/* Patient & Appointment Details */}
              <div className="space-y-2.5 w-full text-xs">
                <div className="bg-[#0F172A]/80 p-3 rounded-xl border border-[#334155] space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Patient Name</p>
                  <p className="text-sm font-black text-white flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    {currentPatient?.full_name || selectedAppt?.patient_name || 'Authorized Patient'}
                  </p>
                  {currentPatient?.blood_group && (
                    <p className="text-[10px] font-bold text-sky-300">
                      Blood Group: {currentPatient.blood_group} | Age: {currentPatient.age || 32}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#0F172A]/80 p-2.5 rounded-xl border border-[#334155]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Token No.</p>
                    <p className="text-base font-black text-emerald-400 font-mono">
                      {selectedAppt?.token_number || matchedToken?.token_number || 'OPD-101'}
                    </p>
                  </div>

                  <div className="bg-[#0F172A]/80 p-2.5 rounded-xl border border-[#334155]">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Room Location</p>
                    <p className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {matchedDoctor?.room_no || matchedToken?.room_no || 'Room 102'}
                    </p>
                  </div>
                </div>

                <div className="bg-[#0F172A]/80 p-2.5 rounded-xl border border-[#334155] space-y-0.5">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Consulting Specialist</p>
                  <p className="font-bold text-white text-xs">
                    {selectedAppt?.doctor_name || matchedDoctor?.full_name || 'Dr. Specialist'}
                  </p>
                  <p className="text-[10px] text-sky-400 font-semibold">
                    {selectedAppt?.department || matchedDoctor?.department} • Slot: {selectedAppt?.time_slot || '10:00 AM'}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Security Watermark */}
            <div className="pt-3 border-t border-[#334155]/60 flex items-center justify-between text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3 h-3" /> AI Express Check-in Valid
              </span>
              <span>Date: {selectedAppt?.appointment_date || new Date().toISOString().split('T')[0]}</span>
            </div>
          </div>

          {/* Quick Instructions */}
          <div className="bg-sky-950/40 border border-sky-500/20 p-3.5 rounded-xl flex items-start gap-2.5 text-xs text-sky-200">
            <ScanLine className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>How it works:</strong> Hold this QR code in front of any reception desk barcode scanner or hospital entrance self-service kiosk. Your arrival is instantly registered, triggering token priority without standing in paper queues.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <button
              onClick={handleCopyCode}
              className="px-3 py-2.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Code Copied!' : 'Copy Check-in ID'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2.5 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-sky-400" />
              <span>Print QR Slip</span>
            </button>

            <button
              onClick={handleSimulateReceptionScan}
              disabled={isSimulatingScan}
              className="px-3 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-lg shadow-sky-600/30 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {isSimulatingScan ? (
                <>
                  <Zap className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>Scanning Kiosk...</span>
                </>
              ) : (
                <>
                  <ScanLine className="w-3.5 h-3.5 text-amber-300" />
                  <span>Simulate Kiosk Scan</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#1E293B]/60 border-t border-[#334155] flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Valid at all 4 Checkmed regional hospitals and OPD counters.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#334155] hover:bg-[#475569] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
