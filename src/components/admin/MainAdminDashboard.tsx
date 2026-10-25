import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BedDouble, 
  FileText, 
  Plus, 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  UserCheck,
  Building2,
  Stethoscope,
  Activity,
  ChevronRight,
  Filter,
  Download,
  Trash2,
  RefreshCw,
  LogOut,
  Bell,
  Truck,
  Droplet,
  Pill,
  MapPin,
  Siren,
  Search,
  Sparkles,
  Phone,
  Clock,
  Laptop,
  Menu,
  X,
  Radio,
  Eye,
  Wind,
  Scan,
  Cpu,
  Microscope,
  Heart,
  Scissors,
  Layers,
  MessageSquare,
  Package,
  ShieldAlert,
  Sliders,
  Sun,
  Moon,
  ArrowLeft
} from 'lucide-react';
import { store, AUTHORIZED_ADMINS } from '../../lib/store';
import { Doctor, Patient, Appointment, Token, Bed, LabReport, Bill, Ambulance, BloodStock, Medicine, CityName, AdminUser } from '../../types';
import { AmbulanceGpsTracker } from '../AmbulanceGpsTracker';
import { PatientLabReports } from '../patient/PatientLabReports';
import { ICUManagement } from './ICUManagement';
import { OphthalmologyModule } from './modules/OphthalmologyModule';
import { OxygenManagementModule } from './modules/OxygenManagementModule';
import { CtScanModule } from './modules/CtScanModule';
import { MriModule } from './modules/MriModule';
import { XRayModule } from './modules/XRayModule';
import { PathologyModule } from './modules/PathologyModule';
import { CardiologyModule } from './modules/CardiologyModule';
import { OtManagementModule } from './modules/OtManagementModule';
import { CrisisCommanderModule } from './CrisisCommanderModule';
import { CrisisBedDonutChart } from './CrisisBedDonutChart';
import { AdminDoctorMessagingView } from './AdminDoctorMessagingView';
import { ConsultationFeeTariffView } from './ConsultationFeeTariffView';
import { MedicalSuppliesInventoryView } from './MedicalSuppliesInventoryView';
import { AccountApprovalsView } from './AccountApprovalsView';
import { SystemAuditLogsView } from './SystemAuditLogsView';

interface MainAdminDashboardProps {
  setActiveView: (view: string) => void;
  adminUser?: AdminUser;
}

const CITIES: (CityName | 'All')[] = [
  'All',
  'Gorakhpur',
  'Varanasi',
  'Lucknow',
  'Allahabad (Prayagraj)',
  'Kanpur'
];

type MainAdminTab = 
  | 'overview' 
  | 'crisis-commander' 
  | 'doctor-messaging'
  | 'tariff-schedule'
  | 'account-approvals'
  | 'medical-supplies'
  | 'audit-trail'
  | 'icu' 
  | 'hospitals' 
  | 'beds' 
  | 'doctors' 
  | 'patients' 
  | 'billing' 
  | 'resources' 
  | 'gps-tracker' 
  | 'lab-tests'
  | 'ophthalmology' 
  | 'oxygen' 
  | 'ct-scan' 
  | 'mri' 
  | 'x-ray' 
  | 'pathology' 
  | 'cardiology' 
  | 'ot-management';

export const MainAdminDashboard: React.FC<MainAdminDashboardProps> = ({ 
  setActiveView,
  adminUser = AUTHORIZED_ADMINS.main
}) => {
  const safeAdmin: AdminUser = adminUser || store.activeAdminUser || AUTHORIZED_ADMINS.main;
  const [activeTab, setActiveTab] = useState<MainAdminTab>('overview');
  const [selectedCity, setSelectedCity] = useState<CityName | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(store.theme);

  const [doctors, setDoctors] = useState<Doctor[]>(store.doctors || []);
  const [patients, setPatients] = useState<Patient[]>(store.patients || []);
  const [tokens, setTokens] = useState<Token[]>(store.tokens || []);
  const [beds, setBeds] = useState<Bed[]>(store.beds || []);
  const [bills, setBills] = useState<Bill[]>(store.bills || []);
  const [labReports, setLabReports] = useState<LabReport[]>(store.labReports || []);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(store.ambulances || []);
  const [bloodStock, setBloodStock] = useState<BloodStock[]>(store.bloodStock || []);
  const [medicines, setMedicines] = useState<Medicine[]>(store.medicines || []);
  const [hospitals, setHospitals] = useState(store.hospitals || []);

  // Modals
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocDept, setNewDocDept] = useState('Cardiology');
  const [newDocSpecialty, setNewDocSpecialty] = useState('');
  const [newDocCity, setNewDocCity] = useState<CityName>('Gorakhpur');
  const [newDocHospital, setNewDocHospital] = useState('BRD Medical College & Hospital');
  const [newDocFee, setNewDocFee] = useState(500);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTheme(store.theme);
      setDoctors(store.doctors || []);
      setPatients(store.patients || []);
      setTokens(store.tokens || []);
      setBeds(store.beds || []);
      setBills(store.bills || []);
      setLabReports(store.labReports || []);
      setAmbulances(store.ambulances || []);
      setBloodStock(store.bloodStock || []);
      setMedicines(store.medicines || []);
      setHospitals(store.hospitals || []);
    });
    return () => unsubscribe();
  }, []);

  const safeBedsList = beds || [];
  const safeDoctorsList = doctors || [];
  const safeAmbulancesList = ambulances || [];

  const filteredBeds = safeBedsList.filter(b => 
    (selectedCity === 'All' || b?.city === selectedCity) &&
    (!searchQuery || b?.bed_number?.toLowerCase().includes(searchQuery.toLowerCase()) || b?.ward_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDoctors = safeDoctorsList.filter(d => 
    (selectedCity === 'All' || d?.city === selectedCity) &&
    (!searchQuery || d?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || d?.specialization?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAmbulances = safeAmbulancesList.filter(a => 
    selectedCity === 'All' || a?.city === selectedCity
  );

  // KPI Calculations
  const totalBeds = safeBedsList.length;
  const availableBeds = safeBedsList.filter(b => b?.status === 'Available').length;
  const occupiedBeds = safeBedsList.filter(b => b?.status === 'Occupied').length;
  const activeDoctorsCount = safeDoctorsList.filter(d => d?.status === 'Available' || d?.status === 'In Consultation').length;
  const totalRevenue = (bills || []).filter(b => b?.payment_status === 'Paid').reduce((acc, b) => acc + (b?.net_amount ?? b?.amount ?? 0), 0);
  const pendingApprovalsCount = (store.accountRequests || []).filter(r => r?.status === 'Pending').length;
  const unreadMessagesCount = (store.adminDoctorMessages || []).filter(m => m?.receiver_id === safeAdmin.id && !m?.is_read).length;

  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    store.addDoctor({
      full_name: newDocName,
      department: newDocDept as any,
      specialization: newDocSpecialty || `${newDocDept} Specialist`,
      qualification: 'MBBS, MD',
      experience_yrs: 5,
      consultation_fee: newDocFee,
      room_no: `OPD-${Math.floor(Math.random() * 500 + 100)}`,
      status: 'Available',
      avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80',
      shift_hours: '09:00 AM - 02:00 PM',
      rating: 4.9,
      available_days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      city: newDocCity,
      hospital_name: newDocHospital
    });

    store.addSystemAuditLog({
      user_id: safeAdmin.id,
      user_name: safeAdmin.name,
      user_role: 'Main Admin',
      action: 'Doctor Record Created',
      module: 'Doctor Management',
      details: `Added new doctor ${newDocName} to ${newDocHospital} (${newDocCity}).`,
      affected_record: newDocName
    });

    setShowAddDoctorModal(false);
    setNewDocName('');
    setNewDocSpecialty('');
    showNotification(`Doctor ${newDocName} successfully registered to CheckMed network.`);
  };

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC] flex flex-col font-sans select-none">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 p-4 bg-purple-600 text-white font-bold text-xs rounded-2xl shadow-2xl flex items-center gap-2 border border-purple-400 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Navigation Header */}
      <header className="sticky top-0 z-40 bg-[#0B1120]/95 backdrop-blur-md border-b border-[#1E293B] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand & Administrator Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-sky-500 p-0.5 shadow-lg shadow-purple-600/30 flex items-center justify-center">
              <div className="w-full h-full bg-[#0B1120] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-black text-white tracking-tight">
                  CheckMed <span className="text-purple-400">MAIN ADMIN COMMAND</span>
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  Supreme Authority
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Logged in as: <strong className="text-white font-bold">{safeAdmin.name}</strong> • {safeAdmin.email}
              </p>
            </div>
          </div>

          {/* Quick Actions & Logout */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 bg-[#070B14] p-1 rounded-2xl border border-[#1E293B]">
              <span className="text-[11px] font-bold text-slate-400 px-2 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-400" /> City Telemetry:
              </span>
              {CITIES.map(c => (
                <button
                  key={c}
                  onClick={() => setSelectedCity(c)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCity === c
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* System-Wide Theme Toggle Button */}
            <button
              id="btn-main-admin-theme-toggle"
              onClick={() => store.toggleTheme()}
              className="p-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] text-amber-400 hover:text-amber-300 transition-all cursor-pointer shadow-md flex items-center justify-center group shrink-0"
              title={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
              aria-label={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>

            {/* Main Admin Back Button */}
            <button
              id="btn-main-admin-header-back"
              onClick={() => {
                if (activeTab !== 'overview') {
                  setActiveTab('overview');
                } else {
                  setActiveView('landing');
                }
              }}
              className="px-3 py-1.5 rounded-xl bg-[#1E293B] hover:bg-[#334155] border border-[#334155] hover:border-purple-500/40 text-slate-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              title="Return to previous screen"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-purple-400" />
              <span>Back</span>
            </button>

            <button
              id="btn-main-admin-header-logout"
              onClick={() => {
                store.switchAccount();
                setActiveView('welcome');
              }}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Log Out</span>
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#1E293B] text-slate-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Tab Navigation Bar */}
      <nav className="bg-[#0F172A] border-b border-[#1E293B] px-4 sm:px-6 py-2 overflow-x-auto select-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Master Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('doctor-messaging')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === 'doctor-messaging'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-indigo-300 hover:text-white hover:bg-indigo-950/40 border border-indigo-500/30'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
            <span>Doctor Communication</span>
            {unreadMessagesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-rose-500 text-white">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tariff-schedule')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'tariff-schedule'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-emerald-400 hover:text-white hover:bg-emerald-950/40 border border-emerald-500/30'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tariff & Revenue Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('account-approvals')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 relative ${
              activeTab === 'account-approvals'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-amber-400 hover:text-white hover:bg-amber-950/40 border border-amber-500/30'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Account Approvals</span>
            {pendingApprovalsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-500 text-slate-900">
                {pendingApprovalsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('medical-supplies')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'medical-supplies'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-sky-300 hover:text-white hover:bg-sky-950/40 border border-sky-500/30'
            }`}
          >
            <Package className="w-3.5 h-3.5 text-sky-400" />
            <span>Supplies & Inventory Master</span>
          </button>

          <button
            onClick={() => setActiveTab('audit-trail')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'audit-trail'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-purple-300 hover:text-white hover:bg-purple-950/40 border border-purple-500/30'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />
            <span>Security Audit Trail</span>
          </button>

          <div className="h-5 w-px bg-[#334155] mx-1" />

          <button
            onClick={() => setActiveTab('crisis-commander')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'crisis-commander'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-rose-400 hover:text-white hover:bg-rose-950/40 border border-rose-500/30'
            }`}
          >
            <Siren className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Crisis Commander</span>
          </button>

          <button
            onClick={() => setActiveTab('icu')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'icu'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <BedDouble className="w-3.5 h-3.5 text-sky-400" />
            <span>ICU Command</span>
          </button>

          <button
            onClick={() => setActiveTab('gps-tracker')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'gps-tracker'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <Truck className="w-3.5 h-3.5 text-amber-400" />
            <span>Ambulance GPS</span>
          </button>

          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'doctors'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
            <span>Doctors Directory</span>
          </button>

          <button
            onClick={() => setActiveTab('beds')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'beds'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-[#1E293B]'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Ward Allocation</span>
          </button>

          {/* Diagnostic Modules Dropdown Tabs */}
          <button
            onClick={() => setActiveTab('cardiology')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'cardiology' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cardio
          </button>
          <button
            onClick={() => setActiveTab('ot-management')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ot-management' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            OT
          </button>
          <button
            onClick={() => setActiveTab('pathology')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'pathology' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pathology
          </button>
          <button
            onClick={() => setActiveTab('oxygen')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'oxygen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Oxygen
          </button>
          <button
            onClick={() => setActiveTab('ct-scan')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ct-scan' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            CT
          </button>
          <button
            onClick={() => setActiveTab('mri')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'mri' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            MRI
          </button>
          <button
            onClick={() => setActiveTab('x-ray')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'x-ray' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            X-Ray
          </button>
          <button
            onClick={() => setActiveTab('ophthalmology')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'ophthalmology' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Eye Care
          </button>

        </div>
      </nav>

      {/* Main Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        
        {/* ============================================================ */}
        {/* 1. MASTER OVERVIEW */}
        {/* ============================================================ */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Top KPI Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">Total Ward Beds</span>
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                    <BedDouble className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{availableBeds}</span>
                  <span className="text-xs text-slate-400">/ {totalBeds} Available</span>
                </div>
                <p className="text-[10px] text-emerald-400 mt-2 font-medium">
                  {occupiedBeds} occupied across all wings
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">Active Doctors On Duty</span>
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{activeDoctorsCount}</span>
                  <span className="text-xs text-slate-400">/ {doctors.length} Roster</span>
                </div>
                <p className="text-[10px] text-sky-400 mt-2 font-medium">
                  All departments operational
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">Hospital Revenue</span>
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-emerald-400 font-mono">
                    ₹{(totalRevenue ?? 0).toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-300 mt-2 font-medium">
                  Processed bills & OPD collections
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-400">Emergency Response</span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{filteredAmbulances.length}</span>
                  <span className="text-xs text-slate-400">Fleet Units</span>
                </div>
                <p className="text-[10px] text-amber-400 mt-2 font-medium">
                  Live GPS telemetry connected
                </p>
              </div>

            </div>

            {/* Quick Command Launch Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div 
                onClick={() => setActiveTab('doctor-messaging')}
                className="p-6 rounded-3xl bg-gradient-to-br from-indigo-950/40 via-[#0F172A] to-[#1E293B] border border-indigo-500/30 hover:border-indigo-400/60 transition-all cursor-pointer shadow-xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-base font-black text-white">Private Doctor Messaging</h3>
                <p className="text-xs text-slate-400 mt-1">
                  1-to-1 secure direct line with doctors. Send shift advisories, resource notes, or clinical reviews.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('tariff-schedule')}
                className="p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-[#0F172A] to-[#1E293B] border border-emerald-500/30 hover:border-emerald-400/60 transition-all cursor-pointer shadow-xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-base font-black text-white">Consultation Fee Schedule</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Exclusive Main Admin authority to adjust OPD consultation fees and review revenue breakdowns.
                </p>
              </div>

              <div 
                onClick={() => setActiveTab('account-approvals')}
                className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/40 via-[#0F172A] to-[#1E293B] border border-purple-500/30 hover:border-purple-400/60 transition-all cursor-pointer shadow-xl group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </div>
                <h3 className="text-base font-black text-white">Account Approvals & Security</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Approve/reject new doctor and staff applications with full tamper-evident audit trail.
                </p>
              </div>

            </div>

            {/* Live Telemetry & ICU Donut Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AmbulanceGpsTracker />
              </div>
              <div>
                <CrisisBedDonutChart beds={safeBedsList} />
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* 2. PRIVATE DOCTOR MESSAGING */}
        {/* ============================================================ */}
        {activeTab === 'doctor-messaging' && (
          <div className="animate-fadeIn">
            <AdminDoctorMessagingView currentAdmin={safeAdmin} />
          </div>
        )}

        {/* ============================================================ */}
        {/* 3. TARIFF & REVENUE SCHEDULE */}
        {/* ============================================================ */}
        {activeTab === 'tariff-schedule' && (
          <div className="animate-fadeIn">
            <ConsultationFeeTariffView />
          </div>
        )}

        {/* ============================================================ */}
        {/* 4. ACCOUNT APPROVALS */}
        {/* ============================================================ */}
        {activeTab === 'account-approvals' && (
          <div className="animate-fadeIn">
            <AccountApprovalsView />
          </div>
        )}

        {/* ============================================================ */}
        {/* 5. MEDICAL SUPPLIES MASTER */}
        {/* ============================================================ */}
        {activeTab === 'medical-supplies' && (
          <div className="animate-fadeIn">
            <MedicalSuppliesInventoryView />
          </div>
        )}

        {/* ============================================================ */}
        {/* 6. SECURITY AUDIT TRAIL */}
        {/* ============================================================ */}
        {activeTab === 'audit-trail' && (
          <div className="animate-fadeIn">
            <SystemAuditLogsView />
          </div>
        )}

        {/* ============================================================ */}
        {/* 7. CRISIS COMMANDER */}
        {/* ============================================================ */}
        {activeTab === 'crisis-commander' && (
          <div className="animate-fadeIn">
            <CrisisCommanderModule />
          </div>
        )}

        {/* ============================================================ */}
        {/* 8. ICU COMMAND */}
        {/* ============================================================ */}
        {activeTab === 'icu' && (
          <div className="animate-fadeIn">
            <ICUManagement />
          </div>
        )}

        {/* ============================================================ */}
        {/* 9. AMBULANCE GPS TRACKER */}
        {activeTab === 'gps-tracker' && (
          <div className="animate-fadeIn">
            <AmbulanceGpsTracker />
          </div>
        )}

        {/* ============================================================ */}
        {/* 10. DOCTORS DIRECTORY */}
        {/* ============================================================ */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-white">Hospital Medical Faculty Roster</h2>
                  <p className="text-xs text-slate-400">Authorized medical specialists, room allocation & active consultation status</p>
                </div>
              </div>

              <button
                onClick={() => setShowAddDoctorModal(true)}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Doctor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDoctors.map(doc => (
                <div key={doc.id} className="p-5 rounded-3xl bg-[#0B1120] border border-[#1E293B] shadow-xl flex items-start gap-4">
                  <img 
                    src={doc.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80'} 
                    alt={doc.full_name} 
                    className="w-14 h-14 rounded-2xl object-cover border border-[#334155]"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white truncate">{doc.full_name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <p className="text-xs text-purple-400 font-semibold">{doc.specialization}</p>
                    <p className="text-[11px] text-slate-400">{doc.department} • {doc.room_no}</p>
                    <p className="text-[10px] text-slate-500 mt-1">{doc.hospital_name} ({doc.city})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 11. BEDS & WARDS */}
        {/* ============================================================ */}
        {activeTab === 'beds' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-white">General & Special Ward Beds Allocation</h2>
                <p className="text-xs text-slate-400">Real-time room status, oxygen line availability, and patient occupant tracking</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredBeds.map(bed => (
                <div 
                  key={bed.id}
                  className={`p-3.5 rounded-2xl border text-center transition-all ${
                    bed.status === 'Available'
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : bed.status === 'Occupied'
                      ? 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                      : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                  }`}
                >
                  <p className="text-xs font-black">{bed.bed_number}</p>
                  <p className="text-[10px] text-slate-400 truncate">{bed.ward_name}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-black uppercase bg-black/40">
                    {bed.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* 12. DIAGNOSTIC MODULES */}
        {/* ============================================================ */}
        {activeTab === 'cardiology' && <CardiologyModule />}
        {activeTab === 'ot-management' && <OtManagementModule />}
        {activeTab === 'pathology' && <PathologyModule />}
        {activeTab === 'oxygen' && <OxygenManagementModule />}
        {activeTab === 'ct-scan' && <CtScanModule />}
        {activeTab === 'mri' && <MriModule />}
        {activeTab === 'x-ray' && <XRayModule />}
        {activeTab === 'ophthalmology' && <OphthalmologyModule />}

      </main>

      {/* Add Doctor Modal */}
      {showAddDoctorModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1E293B] rounded-3xl border border-purple-500/40 shadow-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-purple-400" />
                <span>Register New Medical Practitioner</span>
              </h3>
              <button
                onClick={() => setShowAddDoctorModal(false)}
                className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddDoctor} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Doctor Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Kumar"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Department</label>
                  <select
                    value={newDocDept}
                    onChange={(e) => setNewDocDept(e.target.value)}
                    className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-purple-400"
                  >
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="General Medicine">General Medicine</option>
                    <option value="Critical Care">Critical Care</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">City</label>
                  <select
                    value={newDocCity}
                    onChange={(e) => setNewDocCity(e.target.value as any)}
                    className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-purple-400"
                  >
                    {CITIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Specialty Description</label>
                <input
                  type="text"
                  placeholder="e.g. Interventional Cardiologist"
                  value={newDocSpecialty}
                  onChange={(e) => setNewDocSpecialty(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Initial Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={newDocFee}
                  onChange={(e) => setNewDocFee(Number(e.target.value))}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddDoctorModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
                >
                  Register Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
