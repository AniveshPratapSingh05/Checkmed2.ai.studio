import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  BedDouble, 
  FileText, 
  Plus, 
  Activity, 
  UserCheck, 
  Sparkles, 
  Ticket, 
  ChevronRight, 
  Truck, 
  Droplet, 
  Pill, 
  Building2, 
  Mic, 
  ArrowLeft, 
  Home,
  QrCode,
  Stethoscope,
  Heart,
  DollarSign,
  Search,
  Bell,
  CheckCircle2,
  Shield,
  Scissors
} from 'lucide-react';
import { store } from '../../lib/store';
import { Doctor, Patient, Appointment, Token, Bed, LabReport, Ambulance, BloodStock, Medicine, FamilyMember } from '../../types';
import { DoctorList } from './DoctorList';
import { LiveQueueView } from './LiveQueueView';
import { BedAvailabilityView } from './BedAvailabilityView';
import { PatientLabReports } from './PatientLabReports';
import { AmbulanceView } from './AmbulanceView';
import { BloodBankView } from './BloodBankView';
import { MedicinePharmacyView } from './MedicinePharmacyView';
import { HospitalsDirectoryView } from './HospitalsDirectoryView';
import { AppointmentBookingModal } from './AppointmentBookingModal';
import { AppointmentHistoryView } from './AppointmentHistoryView';
import { PatientCheckInQrModal } from './PatientCheckInQrModal';
import { PatientHealthOverview } from './PatientHealthOverview';
import { PatientMyDoctors } from './PatientMyDoctors';
import { PatientPrescriptionsView } from './PatientPrescriptionsView';
import { PatientTreatmentsView } from './PatientTreatmentsView';
import { PatientConcernSearch } from './PatientConcernSearch';
import { PatientBillsView } from './PatientBillsView';
import { FamilyCentreModal } from './FamilyCentreModal';

interface PatientPortalProps {
  onOpenAuth: () => void;
  initialDoctor?: Doctor | null;
  setActiveView?: (view: string) => void;
}

type PatientTab = 
  | 'overview' 
  | 'my-doctors' 
  | 'appointments' 
  | 'reports' 
  | 'prescriptions' 
  | 'treatments' 
  | 'recommendations' 
  | 'billing' 
  | 'queue' 
  | 'beds' 
  | 'hospitals' 
  | 'ambulances' 
  | 'blood' 
  | 'pharmacy' 
  | 'doctors';

export const PatientPortal: React.FC<PatientPortalProps> = ({ onOpenAuth, initialDoctor, setActiveView }) => {
  const [activeTab, setActiveTab] = useState<PatientTab>('overview');
  
  const [currentUser, setCurrentUser] = useState<Patient | null>(store.currentUser);
  const [doctors, setDoctors] = useState<Doctor[]>(store.doctors);
  const [appointments, setAppointments] = useState<Appointment[]>(store.appointments);
  const [tokens, setTokens] = useState<Token[]>(store.tokens);
  const [beds, setBeds] = useState<Bed[]>(store.beds);
  const [labReports, setLabReports] = useState<LabReport[]>(store.labReports);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(store.ambulances);
  const [bloodStock, setBloodStock] = useState<BloodStock[]>(store.bloodStock);
  const [medicines, setMedicines] = useState<Medicine[]>(store.medicines);

  const [isBookingOpen, setIsBookingOpen] = useState<boolean>(!!initialDoctor);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<Doctor | null>(initialDoctor || null);
  
  const [isFamilyCentreOpen, setIsFamilyCentreOpen] = useState<boolean>(false);
  const [bookingForFamilyMember, setBookingForFamilyMember] = useState<FamilyMember | null>(null);

  const [bookingNotification, setBookingNotification] = useState<{ appointment: Appointment; token: Token } | null>(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState<boolean>(false);
  const [selectedQrAppointmentId, setSelectedQrAppointmentId] = useState<string | null>(null);
  const [showNotificationPopup, setShowNotificationPopup] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setCurrentUser(store.currentUser);
      setDoctors(store.doctors);
      setAppointments(store.appointments);
      setTokens(store.tokens);
      setBeds(store.beds);
      setLabReports(store.labReports);
      setAmbulances(store.ambulances);
      setBloodStock(store.bloodStock);
      setMedicines(store.medicines);
    });
    return unsubscribe;
  }, []);

  const handleBookDoctorClick = (doctor: Doctor) => {
    setSelectedDoctorForBooking(doctor);
    setIsBookingOpen(true);
  };

  const handleBookingComplete = (appointment: Appointment, token: Token) => {
    setBookingNotification({ appointment, token });
    setActiveTab('queue');
  };

  // Safe patient instance
  const effectivePatient: Patient = currentUser || {
    id: 'pat-1',
    full_name: 'Aarav Sharma',
    age: 34,
    gender: 'Male',
    blood_group: 'B+',
    phone: '+91 98765 43210',
    email: 'aarav.sharma@example.com',
    medical_history: 'Hypertension, Seasonal pollen allergy',
    created_at: '2026-01-15'
  };

  const myAppointments = store.getPatientAppointments(effectivePatient.id);
  const upcomingAppointments = myAppointments.filter(a => a.status === 'Upcoming' || a.status === 'In-Progress');
  const myReports = store.getPatientLabReports(effectivePatient.id);
  const readyReports = myReports.filter(r => r.status === 'Report Ready' || r.status === 'Report Delivered');

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] py-6 sm:py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top-Left Navigation Back Button */}
        {setActiveView && (
          <div className="flex items-center">
            <button
              id="patient-dashboard-back-btn"
              onClick={() => {
                if (activeTab !== 'overview') {
                  setActiveTab('overview');
                } else {
                  setActiveView('landing');
                }
              }}
              className="px-4 py-2 bg-[#1E293B] hover:bg-[#334155] border border-[#334155] hover:border-sky-500/40 text-slate-200 hover:text-white rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer group"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-4 h-4 text-sky-400 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
          </div>
        )}

        {/* 1. Personalized Header Banner */}
        <div className="bg-gradient-to-r from-[#1E293B] via-[#152038] to-[#0F172A] rounded-3xl p-6 sm:p-8 border border-[#38BDF8]/30 shadow-2xl shadow-[#0284C7]/15 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
          
          <div className="space-y-2 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-black uppercase tracking-wider shadow-sm">
              <Activity className="w-4 h-4 animate-pulse text-[#38BDF8]" />
              <span>Personalized Patient Health Portal</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                🙏 Namaste, {effectivePatient.full_name}
              </h1>

              {/* Family Centre Button beside greeting */}
              <button
                id="family-centre-header-btn"
                onClick={() => setIsFamilyCentreOpen(true)}
                className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600/30 via-teal-600/30 to-sky-600/30 hover:from-emerald-600/50 hover:to-teal-600/50 border border-emerald-400/40 text-emerald-300 hover:text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center gap-2 cursor-pointer active:scale-95"
                title="Manage Family Healthcare Profiles"
              >
                <span className="text-base">👨‍👩‍👧‍👦</span>
                <span className="font-bold">Family Centre</span>
                <span className="bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded-full text-[10px] font-black border border-emerald-400/30">
                  {store.getFamilyMembers(effectivePatient.id).length}/4
                </span>
              </button>

              <span className="text-sky-300 text-xs font-mono font-bold px-2.5 py-1 bg-sky-500/10 rounded-xl border border-sky-500/30">
                ID: {effectivePatient.id.toUpperCase()}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl">
              Welcome to CheckMed. View your verified health summary, consulting doctors, appointments, e-prescriptions, and hospital diagnostic test reports.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 z-10">
            
            {/* Notifications Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationPopup(!showNotificationPopup)}
                className="p-3 bg-[#0F172A] hover:bg-[#334155] border border-[#334155] text-white rounded-2xl shadow-sm transition-all cursor-pointer relative"
                title="View Patient Notifications"
              >
                <Bell className="w-4 h-4 text-sky-400" />
                {upcomingAppointments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                    {upcomingAppointments.length}
                  </span>
                )}
              </button>

              {showNotificationPopup && (
                <div className="absolute right-0 mt-2 w-80 bg-[#1E293B] border border-[#334155] rounded-2xl p-4 shadow-2xl z-50 text-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#334155] pb-2">
                    <span className="font-black text-white">Patient Notifications</span>
                    <span className="text-[10px] text-sky-400">{upcomingAppointments.length} Active</span>
                  </div>
                  {upcomingAppointments.length > 0 ? (
                    <div className="space-y-2">
                      {upcomingAppointments.map(a => (
                        <div key={a.id} className="bg-[#0F172A] p-2.5 rounded-xl border border-[#334155]">
                          <p className="font-bold text-white">Appointment with {a.doctor_name}</p>
                          <p className="text-[11px] text-slate-400">Date: {a.appointment_date} • {a.time_slot}</p>
                          <p className="text-[10px] text-emerald-400 mt-0.5">Token: {a.token_number || 'Generated at desk'}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-400 text-center py-2">No urgent alerts.</p>
                  )}
                </div>
              )}
            </div>

            {/* Reception QR Pass */}
            <button
              onClick={() => {
                setSelectedQrAppointmentId(null);
                setIsQrModalOpen(true);
              }}
              className="px-3.5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-sky-600/30 ring-1 ring-sky-400/50 transition-all cursor-pointer flex items-center gap-1.5"
              title="Generate QR code to scan at hospital reception"
            >
              <QrCode className="w-4 h-4 text-amber-300" />
              <span>Reception QR Pass</span>
            </button>

            {/* Family Centre Header Action */}
            <button
              onClick={() => setIsFamilyCentreOpen(true)}
              className="px-3.5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-2xl shadow-lg shadow-emerald-600/30 ring-1 ring-emerald-400/50 transition-all cursor-pointer flex items-center gap-1.5"
              title="Manage Family Healthcare Profiles"
            >
              <span>👨‍👩‍👧‍👦</span>
              <span>Family Centre</span>
            </button>

            {/* Book Appointment Action */}
            <button
              onClick={() => {
                setSelectedDoctorForBooking(doctors[0]);
                setIsBookingOpen(true);
              }}
              className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-black rounded-2xl shadow-lg shadow-[#10B981]/30 transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>

            {/* Switch Account */}
            {setActiveView && (
              <button
                onClick={() => {
                  store.switchAccount();
                  setActiveView('welcome');
                }}
                className="px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-white text-xs font-bold rounded-2xl transition-all cursor-pointer flex items-center gap-1"
                title="Logout & Switch Account"
              >
                <span>🔄 Switch Account</span>
              </button>
            )}

          </div>
        </div>

        {/* 2. Quick Actions Toolbar (10 Core Shortcuts) */}
        <div className="bg-[#0F172A] border border-[#334155] rounded-3xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Patient Quick Actions</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
            {[
              { id: 'doctors', label: 'Book Appt', icon: Plus, color: 'text-emerald-400' },
              { id: 'my-doctors', label: 'My Doctors', icon: Stethoscope, color: 'text-teal-400' },
              { id: 'appointments', label: 'Appointments', icon: Calendar, color: 'text-sky-400' },
              { id: 'reports', label: 'My Reports', icon: FileText, color: 'text-cyan-400' },
              { id: 'recommendations', label: 'Search Concern', icon: Search, color: 'text-indigo-400' },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill, color: 'text-amber-400' },
              { id: 'overview', label: 'Health History', icon: Heart, color: 'text-rose-400' },
              { id: 'billing', label: 'Bills & Receipts', icon: DollarSign, color: 'text-emerald-400' },
              { id: 'queue', label: 'Token Queue', icon: Ticket, color: 'text-amber-400' },
              { id: 'hospitals', label: 'Hospital Hub', icon: Building2, color: 'text-blue-400' }
            ].map(act => {
              const Icon = act.icon;
              const isActive = activeTab === act.id;
              return (
                <button
                  key={act.id}
                  onClick={() => {
                    if (act.id === 'doctors') {
                      setSelectedDoctorForBooking(doctors[0]);
                      setIsBookingOpen(true);
                    } else {
                      setActiveTab(act.id as PatientTab);
                    }
                  }}
                  className={`p-2.5 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer ${
                    isActive 
                      ? 'bg-gradient-to-b from-[#1E293B] to-[#0F172A] border-2 border-sky-400 shadow-md scale-105' 
                      : 'bg-[#1E293B]/70 hover:bg-[#1E293B] border border-[#334155]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${act.color}`} />
                  <span className="text-[11px] font-bold text-slate-200 truncate w-full">{act.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Primary Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#334155]/80 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'overview', label: 'Health Overview & Summary', icon: Heart, badge: null },
            { id: 'my-doctors', label: 'My Doctors', icon: Stethoscope, badge: null },
            { id: 'appointments', label: 'My Appointments', icon: Calendar, badge: upcomingAppointments.length ? `${upcomingAppointments.length} upcoming` : null },
            { id: 'reports', label: 'My Reports & Diagnostic Tests', icon: FileText, badge: readyReports.length ? `${readyReports.length} ready` : null },
            { id: 'prescriptions', label: 'My Prescriptions & Medicines', icon: Pill, badge: null },
            { id: 'treatments', label: 'Treatment Information', icon: Scissors, badge: null },
            { id: 'recommendations', label: 'Concern Search & Doctors', icon: Search, badge: 'Smart' },
            { id: 'billing', label: 'Bills & Receipts', icon: DollarSign, badge: null },
            { id: 'queue', label: 'Live Token Queue', icon: Ticket, badge: null },
            { id: 'beds', label: 'Ward & ICU Beds', icon: BedDouble, badge: null },
            { id: 'hospitals', label: 'Hospital Network', icon: Building2, badge: 'UP Hub' },
            { id: 'ambulances', label: 'Ambulance Fleet', icon: Truck, badge: 'GPS' },
            { id: 'blood', label: 'Blood Bank', icon: Droplet, badge: null },
            { id: 'pharmacy', label: 'Pharmacy', icon: Pill, badge: null }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as PatientTab)}
                className={`px-4 py-2.5 text-xs font-black rounded-2xl flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-lg shadow-sky-600/30 ring-2 ring-sky-400/50 scale-105'
                    : 'bg-[#1E293B] text-slate-300 border border-[#334155] hover:bg-[#334155] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 text-sky-300" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-sky-950 text-sky-200 text-[10px] font-black border border-sky-400/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 4. Tab Views */}
        <div>
          {activeTab === 'overview' && (
            <PatientHealthOverview patient={effectivePatient} onNavigateTab={(t) => setActiveTab(t as PatientTab)} />
          )}

          {activeTab === 'my-doctors' && (
            <PatientMyDoctors patient={effectivePatient} onBookWithDoctor={handleBookDoctorClick} />
          )}

          {activeTab === 'appointments' && (
            <AppointmentHistoryView
              appointments={appointments}
              currentPatient={effectivePatient}
              doctors={doctors}
              onBookNewAppointment={(doc) => {
                if (doc) setSelectedDoctorForBooking(doc);
                else setSelectedDoctorForBooking(doctors[0] || null);
                setIsBookingOpen(true);
              }}
              onNavigateToQueue={() => setActiveTab('queue')}
              onOpenCheckInQr={(apptId) => {
                setSelectedQrAppointmentId(apptId || null);
                setIsQrModalOpen(true);
              }}
            />
          )}

          {activeTab === 'reports' && (
            <PatientLabReports labReports={labReports} currentPatient={effectivePatient} userRole="patient" />
          )}

          {activeTab === 'prescriptions' && (
            <PatientPrescriptionsView patient={effectivePatient} />
          )}

          {activeTab === 'treatments' && (
            <PatientTreatmentsView patient={effectivePatient} />
          )}

          {activeTab === 'recommendations' && (
            <PatientConcernSearch onSelectDoctorToBook={handleBookDoctorClick} />
          )}

          {activeTab === 'billing' && (
            <PatientBillsView patient={effectivePatient} />
          )}

          {activeTab === 'queue' && (
            <LiveQueueView 
              tokens={tokens} 
              currentPatient={effectivePatient} 
              onOpenQrPass={() => {
                setSelectedQrAppointmentId(null);
                setIsQrModalOpen(true);
              }}
            />
          )}

          {activeTab === 'beds' && (
            <BedAvailabilityView beds={beds} />
          )}

          {activeTab === 'hospitals' && (
            <HospitalsDirectoryView 
              onNavigateToTab={(tab) => {
                if (tab === 'appointments') setActiveTab('doctors');
              }}
            />
          )}

          {activeTab === 'ambulances' && (
            <AmbulanceView ambulances={ambulances} onBackToDashboard={() => setActiveTab('overview')} />
          )}

          {activeTab === 'blood' && (
            <BloodBankView bloodStock={bloodStock} />
          )}

          {activeTab === 'pharmacy' && (
            <MedicinePharmacyView medicines={medicines} />
          )}

          {activeTab === 'doctors' && (
            <DoctorList doctors={doctors} onBookAppointment={handleBookDoctorClick} />
          )}
        </div>

        {/* 5. Modals */}
        <FamilyCentreModal
          isOpen={isFamilyCentreOpen}
          onClose={() => setIsFamilyCentreOpen(false)}
          primaryPatient={effectivePatient}
          onBookAppointmentForMember={(member) => {
            setIsFamilyCentreOpen(false);
            setBookingForFamilyMember(member);
            setSelectedDoctorForBooking(doctors[0] || null);
            setIsBookingOpen(true);
          }}
        />

        <AppointmentBookingModal
          isOpen={isBookingOpen}
          onClose={() => {
            setIsBookingOpen(false);
            setBookingForFamilyMember(null);
          }}
          selectedDoctor={selectedDoctorForBooking}
          onBookingComplete={handleBookingComplete}
          bookingForPatient={bookingForFamilyMember}
        />

        <PatientCheckInQrModal
          isOpen={isQrModalOpen}
          onClose={() => setIsQrModalOpen(false)}
          currentPatient={effectivePatient}
          appointments={appointments}
          doctors={doctors}
          tokens={tokens}
          initialAppointmentId={selectedQrAppointmentId}
          onCheckInComplete={(apptId) => {
            // Check in complete
          }}
        />

      </div>
    </div>
  );
};
