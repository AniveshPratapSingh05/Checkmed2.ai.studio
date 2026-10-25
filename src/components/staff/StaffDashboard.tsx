import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Clock, Ticket, FileText, DollarSign, BedDouble, 
  Activity, Search, Plus, CheckCircle2, AlertCircle, ArrowLeft,
  Stethoscope, Shield, RefreshCw, UserCheck, QrCode, Phone,
  Pill, Droplet, Microscope, Scan, Scissors, Cpu, Wind, Eye, Printer, Download,
  Sun, Moon
} from 'lucide-react';
import { store } from '../../lib/store';
import { StaffMember, StaffRole, Patient, Doctor, Appointment, Token, Bed, LabReport, Bill, Medicine, BloodStock } from '../../types';
import { LiveQueueView } from '../patient/LiveQueueView';
import { BedAvailabilityView } from '../patient/BedAvailabilityView';
import { PatientLabReports } from '../patient/PatientLabReports';
import { MedicinePharmacyView } from '../patient/MedicinePharmacyView';
import { BloodBankView } from '../patient/BloodBankView';
import { ICUManagement } from '../admin/ICUManagement';
import { XRayModule } from '../admin/modules/XRayModule';
import { CtScanModule } from '../admin/modules/CtScanModule';
import { MriModule } from '../admin/modules/MriModule';
import { PathologyModule } from '../admin/modules/PathologyModule';
import { CardiologyModule } from '../admin/modules/CardiologyModule';
import { OtManagementModule } from '../admin/modules/OtManagementModule';
import { OxygenManagementModule } from '../admin/modules/OxygenManagementModule';
import { OphthalmologyModule } from '../admin/modules/OphthalmologyModule';

interface StaffDashboardProps {
  onBackToHospital?: () => void;
  setActiveView?: (view: string) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({ onBackToHospital, setActiveView }) => {
  const [activeStaff, setActiveStaff] = useState<StaffMember | null>(store.activeStaffMember);
  const [currentStaffRole, setCurrentStaffRole] = useState<StaffRole>(store.currentStaffRole || 'Receptionist');
  const [currentTime, setCurrentTime] = useState('');
  const [theme, setTheme] = useState<'dark' | 'light'>(store.theme);

  // Local state from store
  const [patients, setPatients] = useState<Patient[]>(store.patients);
  const [doctors, setDoctors] = useState<Doctor[]>(store.doctors);
  const [appointments, setAppointments] = useState<Appointment[]>(store.appointments);
  const [tokens, setTokens] = useState<Token[]>(store.tokens);
  const [beds, setBeds] = useState<Bed[]>(store.beds);
  const [labReports, setLabReports] = useState<LabReport[]>(store.labReports);
  const [bills, setBills] = useState<Bill[]>(store.bills);

  // Receptionist Specific Tab state
  const [receptionistTab, setReceptionistTab] = useState<'checkin' | 'queue' | 'registration' | 'doctors' | 'billing' | 'search'>('checkin');
  
  // Registration Form
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regAge, setRegAge] = useState<number>(30);
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [regBlood, setRegBlood] = useState('B+');
  const [regHistory, setRegHistory] = useState('');
  const [regSuccessMsg, setRegSuccessMsg] = useState<string | null>(null);

  // Search Patient
  const [searchQuery, setSearchQuery] = useState('');

  // Quick Walk-In Booking
  const [selectedPatientForWalkIn, setSelectedPatientForWalkIn] = useState<Patient | null>(null);
  const [selectedDoctorForWalkIn, setSelectedDoctorForWalkIn] = useState<string>(store.doctors[0]?.id || '');
  const [walkInReason, setWalkInReason] = useState('General Consultation');
  const [walkInSuccess, setWalkInSuccess] = useState<{ token: string; doctorName: string; room: string } | null>(null);

  // Time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) +
        ' • ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Store subscription
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTheme(store.theme);
      setActiveStaff(store.activeStaffMember);
      setCurrentStaffRole(store.currentStaffRole || (store.activeStaffMember?.role || 'Receptionist'));
      setPatients([...store.patients]);
      setDoctors([...store.doctors]);
      setAppointments([...store.appointments]);
      setTokens([...store.tokens]);
      setBeds([...store.beds]);
      setLabReports([...store.labReports]);
      setBills([...store.bills]);
    });
    return () => unsubscribe();
  }, []);

  const handleRegisterPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regPhone) return;

    const newPatient: Patient = {
      id: `pat-${Date.now().toString().slice(-4)}`,
      full_name: regName.trim(),
      phone: regPhone.trim(),
      email: regEmail.trim() || `${regName.toLowerCase().replace(/\s+/g, '.')}${Date.now().toString().slice(-3)}@checkmed.org`,
      age: regAge,
      gender: regGender,
      blood_group: regBlood,
      medical_history: regHistory.trim() || 'Walk-in registration at CheckMed Reception Desk',
      created_at: new Date().toISOString().split('T')[0]
    };

    store.addPatient(newPatient);
    setRegSuccessMsg(`Patient registered successfully! Generated ID: ${newPatient.id} for ${newPatient.full_name}`);
    setRegName('');
    setRegPhone('');
    setRegEmail('');
    setRegHistory('');
  };

  const handleWalkInCheckIn = (patient: Patient) => {
    const doc = doctors.find(d => d.id === selectedDoctorForWalkIn) || doctors[0];
    if (!doc) return;

    // Create immediate appointment & token
    const apptId = `apt-${Date.now().toString().slice(-4)}`;
    const newAppt: Appointment = {
      id: apptId,
      patient_id: patient.id,
      doctor_id: doc.id,
      patient_name: patient.full_name,
      doctor_name: doc.full_name,
      department: doc.department,
      appointment_date: new Date().toISOString().split('T')[0],
      time_slot: 'Walk-In Immediate',
      reason: walkInReason || 'Walk-In OPD Consultation',
      status: 'In-Progress',
      token_number: '',
      consultation_type: 'In-Person',
      created_at: new Date().toISOString()
    };

    const tokenNum = `T-${doc.department.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    newAppt.token_number = tokenNum;
    store.addAppointment(newAppt);

    const newToken: Token = {
      id: `tok-${Date.now().toString().slice(-4)}`,
      appointment_id: apptId,
      patient_id: patient.id,
      patient_name: patient.full_name,
      doctor_id: doc.id,
      doctor_name: doc.full_name,
      department: doc.department,
      token_number: tokenNum,
      queue_position: tokens.filter(t => t.doctor_id === doc.id && t.status === 'Waiting').length + 1,
      status: 'Serving',
      estimated_time_mins: 0,
      room_no: doc.room_no || 'OPD-101',
      created_at: new Date().toISOString()
    };
    store.addToken(newToken);

    setWalkInSuccess({
      token: tokenNum,
      doctorName: doc.full_name,
      room: doc.room_no || 'OPD-101'
    });
  };

  // Filtered patients for search
  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phone.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-[#070B14] text-slate-100 flex flex-col font-sans pb-16">
      
      {/* 1. Top Staff Header */}
      <header className="bg-[#0F172A] border-b border-[#334155] sticky top-0 z-40 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          <div className="flex items-center gap-3">
            {onBackToHospital && (
              <button
                onClick={onBackToHospital}
                className="p-2.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-slate-300 hover:text-white border border-[#334155] transition flex items-center gap-1.5 text-xs font-semibold"
                title="Return to Hospital Overview"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">Overview</span>
              </button>
            )}

            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-600 to-yellow-400 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-amber-950/40 border border-amber-400/30">
              <Shield className="w-6 h-6 text-slate-900" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight">
                  🙏 Namaste, {activeStaff?.full_name || 'Staff Member'}
                </h1>
                <span className="text-amber-300 text-xs font-mono font-bold px-2 py-0.5 bg-amber-500/10 rounded-lg border border-amber-500/30">
                  {activeStaff?.staff_id_code || 'STF-AUTH-2026'}
                </span>
                <span className="text-emerald-400 text-[11px] font-bold px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                  {currentStaffRole} Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                CheckMed Authorized Staff Workspace • <span className="text-slate-300">{activeStaff?.department || 'Hospital Operations'}</span> • <span className="font-mono text-slate-400">{currentTime}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 ml-auto md:ml-0">
            {/* System-Wide Theme Toggle Button */}
            <button
              id="btn-staff-theme-toggle"
              onClick={() => store.toggleTheme()}
              className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-amber-400 hover:text-amber-300 transition-all cursor-pointer shadow-md flex items-center justify-center group"
              title={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            <button
              onClick={() => {
                store.switchAccount();
                if (setActiveView) setActiveView('welcome');
              }}
              className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Logout & Switch Account"
            >
              <span>🔄 Switch Account</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area based on Staff Role */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6 flex-1">
        
        {/* RECEPTIONIST WORKSPACE */}
        {currentStaffRole === 'Receptionist' && (
          <div className="space-y-6">
            
            {/* Receptionist Sub-Tabs Navigation */}
            <div className="bg-[#0F172A] border border-[#334155] rounded-2xl p-2 flex flex-wrap items-center gap-2 shadow-lg">
              {[
                { id: 'checkin', label: "Today's OPD Check-In & Walk-In", icon: UserCheck },
                { id: 'queue', label: 'Live Token Queue Counter', icon: Ticket },
                { id: 'registration', label: 'New Patient Registration', icon: Plus },
                { id: 'doctors', label: 'Doctor OPD Availability & Schedules', icon: Stethoscope },
                { id: 'billing', label: 'OPD Billing, Cashier & Receipts', icon: DollarSign },
                { id: 'search', label: 'Patient Master Directory Search', icon: Search }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = receptionistTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setReceptionistTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-900/30 ring-1 ring-amber-400'
                        : 'text-slate-300 hover:text-white hover:bg-[#1E293B] border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab 1: OPD Check-In & Walk-In */}
            {receptionistTab === 'checkin' && (
              <div className="space-y-6">
                
                {/* Walk-in Success Banner */}
                {walkInSuccess && (
                  <div className="bg-emerald-500/15 border border-emerald-500/50 p-4 rounded-2xl flex items-center justify-between gap-4 text-emerald-300 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                        ✓
                      </div>
                      <div>
                        <p className="text-sm font-black text-white">Walk-in Token Issued Successfully!</p>
                        <p className="text-xs text-slate-300">
                          Token <strong className="text-amber-300 font-mono">{walkInSuccess.token}</strong> generated for {walkInSuccess.doctorName} at Room {walkInSuccess.room}.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setWalkInSuccess(null)}
                      className="text-xs font-bold text-slate-300 hover:text-white underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left 2 Cols: Today's Scheduled Appointments for Check-in */}
                  <div className="lg:col-span-2 bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-base font-black text-white flex items-center gap-2">
                          <Calendar className="w-5 h-5 text-amber-400" />
                          <span>Today's Scheduled Appointments ({appointments.length})</span>
                        </h2>
                        <p className="text-xs text-slate-400">Verify arriving patients, generate OPD tokens, and mark check-in.</p>
                      </div>
                    </div>

                    <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                      {appointments.map(appt => {
                        const existingToken = tokens.find(t => t.appointment_id === appt.id || t.patient_id === appt.patient_id);
                        return (
                          <div
                            key={appt.id}
                            className="bg-[#1E293B]/70 border border-[#334155] hover:border-amber-500/50 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-white text-sm">{appt.patient_name}</span>
                                <span className="text-[10px] font-mono text-slate-400 bg-[#0F172A] px-2 py-0.5 rounded border border-[#334155]">
                                  {appt.patient_id}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  appt.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-300' :
                                  appt.status === 'In-Progress' ? 'bg-amber-500/20 text-amber-300' :
                                  'bg-sky-500/20 text-sky-300'
                                }`}>
                                  {appt.status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-300">
                                Consulting: <strong className="text-white">{appt.doctor_name}</strong> ({appt.department})
                              </p>
                              <p className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>Slot: {appt.time_slot}</span>
                                <span>•</span>
                                <span>Reason: {appt.reason}</span>
                              </p>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-auto">
                              {existingToken ? (
                                <div className="text-right">
                                  <span className="text-xs font-mono font-black text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl block">
                                    Token: {existingToken.token_number}
                                  </span>
                                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                                    Status: {existingToken.status}
                                  </span>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    const pt = patients.find(p => p.id === appt.patient_id) || {
                                      id: appt.patient_id,
                                      full_name: appt.patient_name,
                                      email: '',
                                      phone: '',
                                      age: 30,
                                      gender: 'Male' as const,
                                      blood_group: 'B+',
                                      created_at: ''
                                    };
                                    setSelectedDoctorForWalkIn(appt.doctor_id);
                                    handleWalkInCheckIn(pt);
                                  }}
                                  className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                                >
                                  <QrCode className="w-3.5 h-3.5" />
                                  <span>Check-In & Issue Token</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right 1 Col: Quick Walk-In Registration & Token Creator */}
                  <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
                    <div>
                      <h2 className="text-base font-black text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-amber-400" />
                        <span>Instant Walk-In OPD Token</span>
                      </h2>
                      <p className="text-xs text-slate-400">Issue direct token for unbooked walk-in patient.</p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Select Registered Patient</label>
                        <select
                          value={selectedPatientForWalkIn?.id || ''}
                          onChange={(e) => {
                            const p = patients.find(pt => pt.id === e.target.value);
                            setSelectedPatientForWalkIn(p || null);
                          }}
                          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          <option value="">-- Choose Existing Patient --</option>
                          {patients.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.full_name} ({p.id} • {p.blood_group})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Assign Doctor / OPD Specialization</label>
                        <select
                          value={selectedDoctorForWalkIn}
                          onChange={(e) => setSelectedDoctorForWalkIn(e.target.value)}
                          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        >
                          {doctors.map(d => (
                            <option key={d.id} value={d.id}>
                              {d.full_name} ({d.department} • Room {d.room_no}) - [{d.status}]
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">Chief Complaint / Visit Reason</label>
                        <input
                          type="text"
                          value={walkInReason}
                          onChange={(e) => setWalkInReason(e.target.value)}
                          placeholder="e.g. Acute chest discomfort, routine fever checkup"
                          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        disabled={!selectedPatientForWalkIn}
                        onClick={() => {
                          if (selectedPatientForWalkIn) {
                            handleWalkInCheckIn(selectedPatientForWalkIn);
                          }
                        }}
                        className={`w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition ${
                          selectedPatientForWalkIn
                            ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white shadow-lg shadow-amber-900/30 cursor-pointer'
                            : 'bg-[#1E293B] text-slate-500 border border-[#334155] cursor-not-allowed'
                        }`}
                      >
                        <Ticket className="w-4 h-4" />
                        <span>Issue Walk-In Token Now</span>
                      </button>

                      <div className="pt-2 border-t border-[#334155]/60 text-center">
                        <button
                          onClick={() => setReceptionistTab('registration')}
                          className="text-xs text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
                        >
                          + Need to register a new walk-in patient first?
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Sub-Tab 2: Live Token Queue Counter */}
            {receptionistTab === 'queue' && (
              <LiveQueueView tokens={tokens} />
            )}

            {/* Sub-Tab 3: New Patient Registration */}
            {receptionistTab === 'registration' && (
              <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto shadow-2xl space-y-6">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <Plus className="w-6 h-6 text-amber-400" />
                    <span>CheckMed OPD Front Desk - Patient Registration</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter patient demographics and clinical history to register a permanent CheckMed Medical Record.
                  </p>
                </div>

                {regSuccessMsg && (
                  <div className="bg-emerald-500/15 border border-emerald-500/40 p-4 rounded-2xl text-xs text-emerald-300 font-bold flex items-center justify-between">
                    <span>{regSuccessMsg}</span>
                    <button onClick={() => setRegSuccessMsg(null)} className="underline cursor-pointer">OK</button>
                  </div>
                )}

                <form onSubmit={handleRegisterPatient} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Full Patient Name *</label>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar Verma"
                        className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Age (Years) *</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        value={regAge}
                        onChange={(e) => setRegAge(parseInt(e.target.value) || 30)}
                        className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Gender *</label>
                      <select
                        value={regGender}
                        onChange={(e) => setRegGender(e.target.value as any)}
                        className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-bold mb-1">Blood Group *</label>
                      <select
                        value={regBlood}
                        onChange={(e) => setRegBlood(e.target.value)}
                        className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. ramesh.verma@example.com"
                      className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Known Medical History / Allergies</label>
                    <textarea
                      rows={2}
                      value={regHistory}
                      onChange={(e) => setRegHistory(e.target.value)}
                      placeholder="e.g. Hypertension on medication, Penicillin allergy"
                      className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black rounded-2xl shadow-xl shadow-amber-900/30 transition cursor-pointer text-sm"
                  >
                    Register Patient & Create Hospital Profile
                  </button>
                </form>
              </div>
            )}

            {/* Sub-Tab 4: Doctor OPD Availability */}
            {receptionistTab === 'doctors' && (
              <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-amber-400" />
                      <span>Doctor OPD Live Rosters & Status</span>
                    </h2>
                    <p className="text-xs text-slate-400">Real-time consultation status, room allocations, and shift schedules.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {doctors.map(doc => (
                    <div
                      key={doc.id}
                      className="bg-[#1E293B]/80 border border-[#334155] rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center border border-amber-500/30">
                            {doc.full_name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-white text-xs">{doc.full_name}</h3>
                            <p className="text-[11px] text-amber-400 font-medium">{doc.specialization}</p>
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          doc.status === 'Available' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                          doc.status === 'In Consultation' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                          'bg-slate-700 text-slate-400'
                        }`}>
                          {doc.status}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-300 space-y-1 bg-[#0F172A] p-2.5 rounded-xl border border-[#334155]/60">
                        <p>Department: <strong className="text-white">{doc.department}</strong></p>
                        <p>Room: <strong className="text-amber-300">{doc.room_no || 'OPD-101'}</strong></p>
                        <p>Consultation Fee: <strong className="text-white">₹{doc.consultation_fee}</strong></p>
                        <p>Shift: <span className="text-slate-400">{doc.shift_hours || '09:00 AM - 05:00 PM'}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 5: OPD Billing & Receipts */}
            {receptionistTab === 'billing' && (
              <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <span>OPD Cashier, Billing & Invoices</span>
                    </h2>
                    <p className="text-xs text-slate-400">Collect consultation & investigation fees, generate receipts.</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {bills.map(bill => (
                    <div
                      key={bill.id}
                      className="bg-[#1E293B]/70 border border-[#334155] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{bill.patient_name}</span>
                          <span className="font-mono text-[10px] text-slate-400 bg-[#0F172A] px-2 py-0.5 rounded">
                            {bill.invoice_number}
                          </span>
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                            bill.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                            bill.payment_status === 'Partial' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                            'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {bill.payment_status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Date: {bill.date} • Method: {bill.payment_method || 'Cash / UPI'}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-black text-amber-400">₹{(bill?.net_amount ?? bill?.amount ?? 0).toLocaleString('en-IN')}</p>
                          <p className="text-[10px] text-slate-400">{bill.items.length} items billed</p>
                        </div>

                        {bill.payment_status !== 'Paid' && (
                          <button
                            onClick={() => {
                              store.updateBillPayment(bill.id, 'Paid', 'UPI');
                            }}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-Tab 6: Patient Master Directory Search */}
            {receptionistTab === 'search' && (
              <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-black text-white flex items-center gap-2">
                      <Search className="w-5 h-5 text-amber-400" />
                      <span>CheckMed Patient Master Directory Search</span>
                    </h2>
                    <p className="text-xs text-slate-400">Search by Name, Patient ID, or Phone Number.</p>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, ID (e.g. pat-1) or phone number..."
                    className="w-full bg-[#1E293B] border border-[#334155] rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[500px] overflow-y-auto">
                  {filteredPatients.map(p => (
                    <div
                      key={p.id}
                      className="bg-[#1E293B]/70 border border-[#334155] p-4 rounded-2xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{p.full_name}</span>
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {p.id}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-300 space-y-0.5">
                        <p>Age: {p.age} | Gender: {p.gender} | Blood: <strong className="text-rose-400">{p.blood_group}</strong></p>
                        <p>Phone: {p.phone} | Email: {p.email}</p>
                        <p className="text-slate-400">History: {p.medical_history || 'None recorded'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* NURSE / ICU WORKSPACE */}
        {currentStaffRole === 'Nurse' && (
          <div className="space-y-6">
            <ICUManagement />
          </div>
        )}

        {/* LAB TECHNICIAN WORKSPACE */}
        {currentStaffRole === 'Lab Technician' && (
          <div className="space-y-6">
            <PathologyModule />
          </div>
        )}

        {/* RADIOLOGY TECHNICIAN / RADIOLOGIST WORKSPACE */}
        {(currentStaffRole === 'Radiology Technician' || currentStaffRole === 'Radiologist') && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <XRayModule />
              <CtScanModule />
              <MriModule />
            </div>
          </div>
        )}

        {/* CARDIOLOGIST WORKSPACE */}
        {currentStaffRole === 'Cardiologist' && (
          <div className="space-y-6">
            <CardiologyModule />
          </div>
        )}

        {/* OT STAFF WORKSPACE */}
        {currentStaffRole === 'OT Staff' && (
          <div className="space-y-6">
            <OtManagementModule />
          </div>
        )}

        {/* BLOOD BANK STAFF WORKSPACE */}
        {currentStaffRole === 'Blood Bank Staff' && (
          <div className="space-y-6">
            <BloodBankView bloodStock={store.bloodStock} />
          </div>
        )}

        {/* PHARMACY STAFF WORKSPACE */}
        {currentStaffRole === 'Pharmacy Staff' && (
          <div className="space-y-6">
            <MedicinePharmacyView medicines={store.medicines} />
          </div>
        )}

        {/* BILLING STAFF WORKSPACE */}
        {currentStaffRole === 'Billing Staff' && (
          <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-base font-black text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-400" />
              <span>Hospital Billing & Revenue Desk</span>
            </h2>
            <div className="space-y-3">
              {bills.map(bill => (
                <div key={bill.id} className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white">{bill.patient_name} - Invoice #{bill.invoice_number}</p>
                    <p className="text-[11px] text-slate-400">{bill.date} • {bill.payment_method}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-400">₹{(bill?.net_amount ?? bill?.amount ?? 0).toLocaleString('en-IN')}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">
                      {bill.payment_status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
