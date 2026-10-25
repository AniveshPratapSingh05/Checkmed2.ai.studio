import React, { useState } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  Stethoscope, 
  Pill, 
  FileText, 
  Activity, 
  Receipt, 
  Plus, 
  Edit3, 
  Trash2, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Heart,
  CheckCircle2,
  Phone,
  Droplet,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { FamilyMember, Appointment, LabReport, DoctorPrescription, Bill, Token } from '../../types';
import { store } from '../../lib/store';

interface FamilyMemberProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember | null;
  accountOwnerName: string;
  onBookAppointment: (member: FamilyMember) => void;
  onEditMember: (member: FamilyMember) => void;
  onRemoveMember: (member: FamilyMember) => void;
}

type ProfileTab = 'appointments' | 'prescriptions' | 'reports' | 'history' | 'billing';

export const FamilyMemberProfileModal: React.FC<FamilyMemberProfileModalProps> = ({
  isOpen,
  onClose,
  member,
  accountOwnerName,
  onBookAppointment,
  onEditMember,
  onRemoveMember
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>('appointments');

  if (!isOpen || !member) return null;

  // Retrieve isolated data for this family member
  const memberAppointments = store.getPatientAppointments(member.id);
  const memberPrescriptions = store.getPatientPrescriptions(member.id);
  const memberReports = store.getPatientLabReports(member.id);
  const memberBills = store.getPatientBills(member.id);
  const memberClinicalNotes = store.getPatientClinicalNotes(member.id);

  const getRelationshipColor = (rel?: string) => {
    switch (rel?.toLowerCase()) {
      case 'father':
      case 'mother':
      case 'grandparent':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'child':
      case 'son':
      case 'daughter':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'spouse':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'brother':
      case 'sister':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#111C33] text-[#F8FAFC] w-full max-w-3xl rounded-3xl shadow-2xl border border-sky-500/30 overflow-hidden my-6 animate-fade-in flex flex-col max-h-[92vh]">
        
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#162238] to-[#0D1527] p-5 sm:p-6 border-b border-slate-700/80 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-700"
            title="Close Profile"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/30 via-sky-500/30 to-indigo-500/30 border border-emerald-400/40 flex items-center justify-center text-2xl shadow-lg shrink-0">
                {member.gender === 'Female' ? '👩' : '👨'}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-black text-white">{member.name}</h2>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getRelationshipColor(member.relationship)}`}>
                    {member.relationship || 'Family Member'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300 mt-1 flex-wrap font-medium">
                  <span>Age: <strong className="text-white">{member.age} yrs</strong></span>
                  <span>•</span>
                  <span>Blood: <strong className="text-rose-400">{member.blood_group || 'O+'}</strong></span>
                  <span>•</span>
                  <span>Gender: <strong className="text-slate-200">{member.gender || 'Not specified'}</strong></span>
                  <span>•</span>
                  <span className="font-mono text-[10px] text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/30">ID: {member.id}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <button
                onClick={() => onBookAppointment(member)}
                className="px-3.5 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/20 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> Book Appointment
              </button>
              <button
                onClick={() => onEditMember(member)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition-colors cursor-pointer"
                title="Edit Profile"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemoveMember(member)}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30 transition-colors cursor-pointer"
                title="Remove Family Member"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Primary Condition & Health Issue Banner */}
          <div className="mt-4 p-3 rounded-2xl bg-[#090F1E] border border-sky-500/20 flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Primary Health Concern / Specialty</span>
                <span className="text-white font-bold">{member.health_issue}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 block font-medium">Managed by Primary Account</span>
              <span className="text-sky-300 font-bold">{accountOwnerName}</span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setActiveTab('appointments')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'appointments'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Appointments</span>
              <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px]">{memberAppointments.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'prescriptions'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              <Pill className="w-3.5 h-3.5" />
              <span>Prescriptions</span>
              <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px]">{memberPrescriptions.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'reports'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Diagnostic Reports</span>
              <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px]">{memberReports.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'history'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Health History</span>
              <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px]">{memberClinicalNotes.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('billing')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                activeTab === 'billing'
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-700/80'
              }`}
            >
              <Receipt className="w-3.5 h-3.5" />
              <span>Bills & Invoices</span>
              <span className="px-1.5 py-0.2 bg-black/30 rounded-full text-[10px]">{memberBills.length}</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: APPOINTMENTS */}
          {activeTab === 'appointments' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                  Appointments for {member.name}
                </h4>
                <button
                  onClick={() => onBookAppointment(member)}
                  className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Book New Appointment
                </button>
              </div>

              {memberAppointments.length === 0 ? (
                <div className="text-center py-10 px-4 bg-[#0B132B] rounded-2xl border border-slate-800">
                  <Calendar className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-300">No appointments booked yet for {member.name}</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Generate an OPD queue token and doctor appointment for {member.name} using the existing CheckMed booking system.
                  </p>
                  <button
                    onClick={() => onBookAppointment(member)}
                    className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book First Appointment
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {memberAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl bg-[#090F1E] border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            {apt.token_number || 'OPD Token'}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            apt.status === 'Upcoming' || apt.status === 'In-Progress'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}>
                            {apt.status}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {apt.consultation_type || 'In-Person'}
                          </span>
                        </div>
                        <h5 className="text-sm font-bold text-white">{apt.doctor_name}</h5>
                        <p className="text-xs text-sky-400 font-medium">{apt.department} • Reason: {apt.reason}</p>
                      </div>

                      <div className="text-left sm:text-right shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800">
                        <div className="text-xs font-bold text-slate-200 flex items-center sm:justify-end gap-1">
                          <Calendar className="w-3.5 h-3.5 text-sky-400" />
                          <span>{apt.appointment_date}</span>
                        </div>
                        <div className="text-xs text-amber-400 font-medium flex items-center sm:justify-end gap-1 mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{apt.time_slot}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRESCRIPTIONS */}
          {activeTab === 'prescriptions' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Prescriptions & Medications for {member.name}
              </h4>

              {memberPrescriptions.length === 0 ? (
                <div className="text-center py-10 px-4 bg-[#0B132B] rounded-2xl border border-slate-800">
                  <Pill className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-300">No prescriptions issued yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    When consulting doctors issue medical prescriptions for {member.name}, they will automatically appear here with medicine dosages and instructions.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberPrescriptions.map((presc) => (
                    <div
                      key={presc.id}
                      className="p-4 rounded-2xl bg-[#090F1E] border border-slate-800 hover:border-sky-500/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <div>
                          <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                            {presc.prescription_number}
                          </span>
                          <h5 className="text-sm font-bold text-white mt-1">Prescribed by {presc.doctor_name}</h5>
                          <p className="text-xs text-slate-400">Condition: <strong className="text-slate-200">{presc.recorded_condition}</strong></p>
                        </div>
                        <span className="text-xs text-slate-400 font-medium">{presc.created_at}</span>
                      </div>

                      {/* Medicine list */}
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Prescribed Medicines:</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {presc.medicines.map((med, i) => (
                            <div key={i} className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                              <p className="font-bold text-white">{med.name} <span className="text-sky-300 font-normal">({med.dosage})</span></p>
                              <p className="text-slate-300 text-[11px] mt-0.5">{med.frequency} • {med.duration}</p>
                              {med.instructions && <p className="text-amber-300 text-[10px] mt-0.5 italic">{med.instructions}</p>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {presc.advice_instructions && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200">
                          <strong>Doctor's Advice:</strong> {presc.advice_instructions}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DIAGNOSTIC REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Diagnostic & Lab Reports for {member.name}
              </h4>

              {memberReports.length === 0 ? (
                <div className="text-center py-10 px-4 bg-[#0B132B] rounded-2xl border border-slate-800">
                  <FileText className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-300">No diagnostic reports uploaded yet</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Blood tests, cardiology scans, and pathology reports ordered for {member.name} will be securely cataloged here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {memberReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-2xl bg-[#090F1E] border border-slate-800 hover:border-sky-500/40 transition-all space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {report.test_category}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              report.status === 'Report Ready' || report.status === 'Report Delivered'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {report.status}
                            </span>
                          </div>
                          <h5 className="text-sm font-bold text-white mt-1">{report.test_name}</h5>
                          <p className="text-xs text-slate-400">Ordered by {report.doctor_name} on {report.test_date}</p>
                        </div>
                      </div>

                      {report.result_summary && (
                        <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Findings & Summary:</span>
                          <p className="text-slate-200 mt-0.5">{report.result_summary}</p>
                          {report.findings && <p className="text-sky-300 text-[11px] mt-1">{report.findings}</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HEALTH HISTORY & NOTES */}
          {activeTab === 'history' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Medical History & Clinical Notes for {member.name}
              </h4>

              <div className="p-4 rounded-2xl bg-[#090F1E] border border-slate-800 space-y-3">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h5 className="text-sm font-bold text-white">Profile Summary</h5>
                    <p className="text-xs text-slate-300">
                      Condition / Specialty Focus: <strong className="text-emerald-300">{member.health_issue}</strong>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div className="p-2 bg-slate-800/40 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Age</span>
                    <span className="font-bold text-white">{member.age} Years</span>
                  </div>
                  <div className="p-2 bg-slate-800/40 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Blood Group</span>
                    <span className="font-bold text-rose-400">{member.blood_group || 'O+'}</span>
                  </div>
                  <div className="p-2 bg-slate-800/40 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Gender</span>
                    <span className="font-bold text-white">{member.gender || 'Male'}</span>
                  </div>
                  <div className="p-2 bg-slate-800/40 rounded-xl">
                    <span className="text-[10px] text-slate-400 block font-bold">Relationship</span>
                    <span className="font-bold text-sky-300">{member.relationship || 'Other'}</span>
                  </div>
                </div>
              </div>

              {memberClinicalNotes.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Doctor Clinical Notes:</span>
                  {memberClinicalNotes.map((note) => (
                    <div key={note.id} className="p-3.5 rounded-2xl bg-[#090F1E] border border-slate-800 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sky-300">{note.doctor_name}</span>
                        <span className="text-slate-400 text-[10px]">{note.created_at}</span>
                      </div>
                      <p className="text-white font-medium">Condition: {note.recorded_condition}</p>
                      {note.chief_complaint && <p className="text-slate-300">Chief Complaint: {note.chief_complaint}</p>}
                      {note.clinical_notes && <p className="text-slate-400 text-[11px]">{note.clinical_notes}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BILLS & INVOICES */}
          {activeTab === 'billing' && (
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Hospital Bills & Invoices for {member.name}
              </h4>

              {memberBills.length === 0 ? (
                <div className="text-center py-10 px-4 bg-[#0B132B] rounded-2xl border border-slate-800">
                  <Receipt className="w-10 h-10 text-slate-500 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-slate-300">No bills or receipts for {member.name}</p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Consultation fees and diagnostic test receipts will be recorded here under {member.name}'s profile.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {memberBills.map((bill) => (
                    <div
                      key={bill.id}
                      className="p-4 rounded-2xl bg-[#090F1E] border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sky-400 font-bold">{bill.invoice_number}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            bill.payment_status === 'Paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {bill.payment_status}
                          </span>
                        </div>
                        <p className="text-slate-300">
                          {bill.items?.[0]?.description || 'Hospital Consultation & Services'}
                        </p>
                        <p className="text-[10px] text-slate-400">Date: {bill.date}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-black text-white">₹{bill.net_amount}</span>
                        <span className="block text-[10px] text-slate-400">Total Net</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-[#0A1020] p-4 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Strict Patient Data Separation Guaranteed</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
