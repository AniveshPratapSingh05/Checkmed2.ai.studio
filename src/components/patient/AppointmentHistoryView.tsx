import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RotateCcw, 
  FileText, 
  Video, 
  MapPin, 
  Plus, 
  Sparkles, 
  PhoneCall,
  ChevronRight,
  Printer,
  ShieldCheck,
  QrCode
} from 'lucide-react';
import { Appointment, Doctor, Patient, AppointmentStatus } from '../../types';
import { store } from '../../lib/store';

interface AppointmentHistoryViewProps {
  appointments: Appointment[];
  currentPatient: Patient | null;
  doctors: Doctor[];
  onBookNewAppointment: (doctor?: Doctor) => void;
  onNavigateToQueue?: () => void;
  onOpenCheckInQr?: (appointmentId?: string) => void;
}

export const AppointmentHistoryView: React.FC<AppointmentHistoryViewProps> = ({
  appointments,
  currentPatient,
  doctors,
  onBookNewAppointment,
  onNavigateToQueue,
  onOpenCheckInQr
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<AppointmentStatus | 'All'>('All');
  
  // State for Cancellation Confirmation
  const [cancelingAppointmentId, setCancelingAppointmentId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Change of plans');

  // State for Rescheduling Modal
  const [reschedulingAppointment, setReschedulingAppointment] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTimeSlot, setNewTimeSlot] = useState('10:30 AM');

  // State for E-Prescription View Modal
  const [selectedPrescriptionAppt, setSelectedPrescriptionAppt] = useState<Appointment | null>(null);

  // Filter patient's appointments
  const patientAppointments = currentPatient
    ? appointments.filter(a => a.patient_id === currentPatient.id || a.patient_name.toLowerCase().includes(currentPatient.full_name.toLowerCase()))
    : appointments;

  // Filtered list based on tab and search
  const filteredAppointments = patientAppointments.filter(appt => {
    const matchesStatus = selectedStatusFilter === 'All' || appt.status === selectedStatusFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      appt.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.token_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.appointment_date.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  // Metric Counts
  const totalCount = patientAppointments.length;
  const upcomingCount = patientAppointments.filter(a => a.status === 'Upcoming').length;
  const inProgressCount = patientAppointments.filter(a => a.status === 'In-Progress').length;
  const completedCount = patientAppointments.filter(a => a.status === 'Completed').length;
  const cancelledCount = patientAppointments.filter(a => a.status === 'Cancelled').length;

  const handleConfirmCancel = (id: string) => {
    store.updateAppointmentStatus(id, 'Cancelled');
    setCancelingAppointmentId(null);
  };

  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reschedulingAppointment) return;

    // Update appointment in store
    store.appointments = store.appointments.map(a => 
      a.id === reschedulingAppointment.id 
        ? { ...a, appointment_date: newDate, time_slot: newTimeSlot, status: 'Upcoming' } 
        : a
    );
    store.updateAppointmentStatus(reschedulingAppointment.id, 'Upcoming');
    setReschedulingAppointment(null);
  };

  const getDoctorObject = (doctorName: string, docId?: string): Doctor | undefined => {
    if (docId) {
      const found = doctors.find(d => d.id === docId);
      if (found) return found;
    }
    return doctors.find(d => d.full_name.toLowerCase() === doctorName.toLowerCase());
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-4 h-4" /> Patient Medical History
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white">Consultation & Appointment History</h2>
          <p className="text-xs text-[#94A3B8]">
            Track upcoming visits, view digital e-prescriptions for completed checkups, or reschedule/cancel existing bookings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenCheckInQr && (
            <button
              onClick={() => onOpenCheckInQr()}
              className="px-4 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>Reception QR Check-In</span>
            </button>
          )}

          <button
            onClick={() => onBookNewAppointment()}
            className="px-4 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl shadow-lg shadow-[#10B981]/20 flex items-center justify-center gap-2 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> Book New Consultation
          </button>
        </div>
      </div>

      {/* Summary KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div 
          onClick={() => setSelectedStatusFilter('All')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'All' 
              ? 'bg-[#0EA5E9]/15 border-[#0EA5E9] shadow-md' 
              : 'bg-[#1E293B] border-[#334155] hover:border-[#475569]'
          }`}
        >
          <p className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider">Total Consultations</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-1">{totalCount}</p>
          <p className="text-[10px] text-[#38BDF8] mt-1 font-semibold">All Records</p>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('Upcoming')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'Upcoming' 
              ? 'bg-[#0EA5E9]/20 border-[#38BDF8] shadow-md' 
              : 'bg-[#1E293B] border-[#334155] hover:border-[#475569]'
          }`}
        >
          <p className="text-[10px] font-extrabold text-[#38BDF8] uppercase tracking-wider">Upcoming</p>
          <p className="text-xl sm:text-2xl font-black text-[#38BDF8] mt-1">{upcomingCount + inProgressCount}</p>
          <p className="text-[10px] text-[#94A3B8] mt-1 font-semibold">Scheduled Visits</p>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('Completed')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'Completed' 
              ? 'bg-[#10B981]/20 border-[#10B981] shadow-md' 
              : 'bg-[#1E293B] border-[#334155] hover:border-[#475569]'
          }`}
        >
          <p className="text-[10px] font-extrabold text-[#10B981] uppercase tracking-wider">Completed</p>
          <p className="text-xl sm:text-2xl font-black text-[#10B981] mt-1">{completedCount}</p>
          <p className="text-[10px] text-[#94A3B8] mt-1 font-semibold">Prescriptions Ready</p>
        </div>

        <div 
          onClick={() => setSelectedStatusFilter('Cancelled')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            selectedStatusFilter === 'Cancelled' 
              ? 'bg-[#EF4444]/20 border-[#EF4444] shadow-md' 
              : 'bg-[#1E293B] border-[#334155] hover:border-[#475569]'
          }`}
        >
          <p className="text-[10px] font-extrabold text-[#EF4444] uppercase tracking-wider">Canceled</p>
          <p className="text-xl sm:text-2xl font-black text-[#EF4444] mt-1">{cancelledCount}</p>
          <p className="text-[10px] text-[#94A3B8] mt-1 font-semibold">Reschedule Available</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#1E293B] p-4 rounded-2xl border border-[#334155]">
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 no-scrollbar">
          {(['All', 'Upcoming', 'In-Progress', 'Completed', 'Cancelled'] as const).map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedStatusFilter === status
                  ? 'bg-[#0EA5E9] text-white shadow-md'
                  : 'bg-[#0F172A] text-[#94A3B8] hover:text-white border border-[#334155]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search doctor, token, date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0F172A] text-xs text-white rounded-xl border border-[#334155] focus:outline-none focus:border-[#38BDF8]"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appt => {
            const doc = getDoctorObject(appt.doctor_name, appt.doctor_id);

            return (
              <div 
                key={appt.id}
                className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 shadow-lg hover:border-[#475569] transition-all space-y-4 relative overflow-hidden"
              >
                {/* Left accent border by status */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                  appt.status === 'Upcoming' ? 'bg-[#0EA5E9]' :
                  appt.status === 'In-Progress' ? 'bg-[#F59E0B]' :
                  appt.status === 'Completed' ? 'bg-[#10B981]' :
                  'bg-[#EF4444]'
                }`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pl-2">
                  
                  {/* Doctor Info & Token */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-[#0F172A] border border-[#334155] flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                      {doc?.avatar_url ? (
                        <img src={doc.avatar_url} alt={appt.doctor_name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-6 h-6 text-[#38BDF8]" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-[#38BDF8] bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 px-2 py-0.5 rounded-lg font-mono">
                          Token: {appt.token_number}
                        </span>
                        
                        {/* Status Badge */}
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                          appt.status === 'Upcoming' ? 'bg-[#0EA5E9]/15 text-[#38BDF8] border-[#0EA5E9]/40' :
                          appt.status === 'In-Progress' ? 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/40' :
                          appt.status === 'Completed' ? 'bg-[#10B981]/15 text-[#10B981] border-[#10B981]/40' :
                          'bg-[#EF4444]/15 text-[#EF4444] border-[#EF4444]/40'
                        }`}>
                          {appt.status === 'Upcoming' && <Clock className="w-3 h-3" />}
                          {appt.status === 'In-Progress' && <Sparkles className="w-3 h-3 animate-pulse" />}
                          {appt.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                          {appt.status === 'Cancelled' && <XCircle className="w-3 h-3" />}
                          {appt.status}
                        </span>

                        <span className="text-[10px] text-[#94A3B8] font-bold uppercase bg-[#0F172A] px-2 py-0.5 rounded-md border border-[#334155]">
                          {appt.consultation_type}
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-white flex items-center gap-1.5">
                        {appt.doctor_name}
                      </h3>
                      
                      <p className="text-xs text-[#94A3B8] font-semibold flex items-center gap-1">
                        <span>{appt.department}</span>
                        {doc?.hospital_name && (
                          <>
                            <span>•</span>
                            <span className="text-[#38BDF8] flex items-center gap-0.5">
                              <MapPin className="w-3 h-3" /> {doc.hospital_name}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Date & Time Slot Callout */}
                  <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] space-y-1 min-w-[200px]">
                    <div className="flex items-center gap-2 text-xs text-[#CBD5E1] font-bold">
                      <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Date: {appt.appointment_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#CBD5E1] font-bold">
                      <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Slot: {appt.time_slot}</span>
                    </div>
                    {doc?.room_no && (
                      <p className="text-[10px] text-[#94A3B8] font-semibold pt-0.5">
                        Location: <span className="text-white font-bold">{doc.room_no}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Reason & Notes */}
                <div className="pl-2 pr-2 py-2 bg-[#0F172A]/60 rounded-xl border border-[#334155]/60 text-xs text-[#CBD5E1]">
                  <span className="font-bold text-[#94A3B8] uppercase text-[10px]">Chief Complaint / Reason: </span>
                  <span className="font-medium text-white">{appt.reason || 'General health consultation & review'}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#334155]/80 pl-2">
                  <div className="text-[11px] text-[#94A3B8]">
                    <span>Booked on: {appt.created_at || '2026-08-10'}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    
                    {/* UPCOMING / IN-PROGRESS ACTIONS */}
                    {(appt.status === 'Upcoming' || appt.status === 'In-Progress') && (
                      <>
                        {onOpenCheckInQr && (
                          <button
                            onClick={() => onOpenCheckInQr(appt.id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-sky-600/30 to-blue-600/30 hover:from-sky-600/50 hover:to-blue-600/50 text-sky-300 border border-sky-400/40 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                            title="Generate QR Pass for Hospital Reception Scan"
                          >
                            <QrCode className="w-3.5 h-3.5 text-amber-300" />
                            <span>QR Check-In Pass</span>
                          </button>
                        )}

                        {onNavigateToQueue && (
                          <button
                            onClick={onNavigateToQueue}
                            className="px-3 py-1.5 bg-[#0284C7]/20 hover:bg-[#0284C7]/30 text-[#38BDF8] border border-[#0284C7]/40 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                          >
                            <Clock className="w-3.5 h-3.5" /> View OPD Queue
                          </button>
                        )}

                        <button
                          onClick={() => {
                            setReschedulingAppointment(appt);
                            setNewDate(appt.appointment_date);
                            setNewTimeSlot(appt.time_slot);
                          }}
                          className="px-3 py-1.5 bg-[#334155] hover:bg-[#475569] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reschedule
                        </button>

                        <button
                          onClick={() => setCancelingAppointmentId(appt.id)}
                          className="px-3 py-1.5 bg-[#EF4444]/15 hover:bg-[#EF4444]/25 text-[#EF4444] border border-[#EF4444]/30 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Cancel Booking
                        </button>
                      </>
                    )}

                    {/* COMPLETED ACTIONS */}
                    {appt.status === 'Completed' && (
                      <>
                        <button
                          onClick={() => setSelectedPrescriptionAppt(appt)}
                          className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                        >
                          <FileText className="w-3.5 h-3.5" /> View E-Prescription
                        </button>

                        <button
                          onClick={() => onBookNewAppointment(doc)}
                          className="px-3 py-1.5 bg-[#0EA5E9]/20 hover:bg-[#0EA5E9]/30 text-[#38BDF8] border border-[#0EA5E9]/40 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Book Follow-Up
                        </button>
                      </>
                    )}

                    {/* CANCELLED ACTIONS */}
                    {appt.status === 'Cancelled' && (
                      <button
                        onClick={() => onBookNewAppointment(doc)}
                        className="px-4 py-1.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Re-book Doctor
                      </button>
                    )}

                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="bg-[#1E293B] rounded-2xl p-12 text-center border border-[#334155] space-y-3">
            <Calendar className="w-12 h-12 text-[#94A3B8] mx-auto opacity-60" />
            <h3 className="text-base font-extrabold text-white">No Appointments Found</h3>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              There are no medical appointments matching the selected filter criteria.
            </p>
            <button
              onClick={() => onBookNewAppointment()}
              className="mt-2 px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Book an Appointment Now
            </button>
          </div>
        )}
      </div>

      {/* CANCELLATION CONFIRMATION MODAL */}
      {cancelingAppointmentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#1E293B] text-white w-full max-w-md rounded-2xl p-6 border border-[#EF4444]/40 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#EF4444] border-b border-[#334155] pb-3">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-extrabold">Cancel Consultation Booking</h3>
            </div>

            <p className="text-xs text-[#CBD5E1]">
              Are you sure you want to cancel this appointment? Your reserved OPD queue token will be released for other patients.
            </p>

            <div>
              <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white"
              >
                <option value="Change of plans">Change of plans / Schedule conflict</option>
                <option value="Health improved">Feeling better / Symptoms resolved</option>
                <option value="Booked another hospital">Booked another hospital / doctor</option>
                <option value="Emergency resolved">Emergency resolved</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setCancelingAppointmentId(null)}
                className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-xs font-bold cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => handleConfirmCancel(cancelingAppointmentId)}
                className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold cursor-pointer shadow-lg shadow-[#EF4444]/25"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE APPOINTMENT MODAL */}
      {reschedulingAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#1E293B] text-white w-full max-w-md rounded-2xl p-6 border border-[#38BDF8]/40 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-[#38BDF8]" /> Reschedule Consultation
              </h3>
              <button onClick={() => setReschedulingAppointment(null)} className="text-[#94A3B8] hover:text-white">✕</button>
            </div>

            <p className="text-xs text-[#94A3B8]">
              Rescheduling appointment with <span className="text-white font-bold">{reschedulingAppointment.doctor_name}</span> ({reschedulingAppointment.department}).
            </p>

            <form onSubmit={handleConfirmReschedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#94A3B8] uppercase mb-1">Select New Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white"
                />
              </div>

              <div>
                <label className="block font-bold text-[#94A3B8] uppercase mb-1">Select New Time Slot</label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white"
                >
                  <option value="09:30 AM">09:30 AM</option>
                  <option value="10:30 AM">10:30 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="02:00 PM">02:00 PM</option>
                  <option value="03:30 PM">03:30 PM</option>
                  <option value="04:30 PM">04:30 PM</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#334155]">
                <button
                  type="button"
                  onClick={() => setReschedulingAppointment(null)}
                  className="px-4 py-2 rounded-xl border border-[#334155] text-[#94A3B8] hover:text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold cursor-pointer shadow-lg shadow-[#0EA5E9]/25"
                >
                  Save Rescheduled Date
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* E-PRESCRIPTION VIEW MODAL FOR COMPLETED APPOINTMENTS */}
      {selectedPrescriptionAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#1E293B] text-white w-full max-w-xl rounded-2xl p-6 border border-[#10B981]/50 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#10B981] text-white flex items-center justify-center font-bold">
                  Rx
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Digital Medical Prescription</h3>
                  <p className="text-[10px] text-[#38BDF8]">Checkmed Healthcare Verified Record</p>
                </div>
              </div>

              <button 
                onClick={() => setSelectedPrescriptionAppt(null)} 
                className="text-[#94A3B8] hover:text-white font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Content Sheet */}
            <div className="bg-[#0F172A] p-5 rounded-2xl border border-[#334155] space-y-4 text-xs">
              
              {/* Doctor Details Header */}
              <div className="flex justify-between items-start border-b border-[#334155] pb-3">
                <div>
                  <p className="text-sm font-extrabold text-white">{selectedPrescriptionAppt.doctor_name}</p>
                  <p className="text-[11px] text-[#38BDF8] font-bold">{selectedPrescriptionAppt.department}</p>
                  <p className="text-[10px] text-[#94A3B8]">Token: {selectedPrescriptionAppt.token_number}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40">
                    Verified Digital Rx
                  </span>
                  <p className="text-[10px] text-[#94A3B8] mt-1">Date: {selectedPrescriptionAppt.appointment_date}</p>
                </div>
              </div>

              {/* Patient Details */}
              <div className="bg-[#1E293B] p-3 rounded-xl border border-[#334155] grid grid-cols-2 gap-2">
                <div>
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Patient Name</p>
                  <p className="font-bold text-white">{selectedPrescriptionAppt.patient_name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Consultation Mode</p>
                  <p className="font-bold text-[#38BDF8]">{selectedPrescriptionAppt.consultation_type}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <p className="text-[10px] font-extrabold text-[#94A3B8] uppercase tracking-wider mb-1">Clinical Diagnosis & Findings</p>
                <p className="p-3 rounded-xl bg-[#1E293B] border border-[#334155] text-white">
                  {selectedPrescriptionAppt.reason} - Clinical examination completed. Vital signs stable. Follow-up recommended in 14 days.
                </p>
              </div>

              {/* Prescribed Medications */}
              <div>
                <p className="text-[10px] font-extrabold text-[#10B981] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" /> Prescribed Medications (Rx)
                </p>

                <div className="space-y-2">
                  <div className="p-2.5 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Tab. Paracetamol 650mg</p>
                      <p className="text-[10px] text-[#94A3B8]">1 tablet after meals (1 - 0 - 1) for 5 days</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded-md">
                      Qty: 10 Tabs
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-between">
                    <div>
                      <p className="font-bold text-white">Cap. Amoxicillin 500mg</p>
                      <p className="text-[10px] text-[#94A3B8]">1 capsule twice daily after food for 5 days</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#38BDF8] bg-[#38BDF8]/10 px-2 py-0.5 rounded-md">
                      Qty: 10 Caps
                    </span>
                  </div>
                </div>
              </div>

              {/* Advice */}
              <div className="p-3 bg-[#10B981]/10 rounded-xl border border-[#10B981]/30 text-[11px] text-[#10B981]">
                <p className="font-bold">Doctor's Advice:</p>
                <p className="text-[10px] text-[#CBD5E1] mt-0.5">Stay hydrated, rest adequately, and monitor body temperature twice daily.</p>
              </div>

            </div>

            {/* Footer Action Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print / Save PDF
              </button>

              <button
                onClick={() => setSelectedPrescriptionAppt(null)}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold cursor-pointer shadow-md"
              >
                Close Prescription
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
