import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  User, 
  Stethoscope, 
  Shield, 
  ShieldCheck,
  Users, 
  ArrowRight, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  KeyRound, 
  Building2, 
  Activity, 
  UserCheck, 
  FileText, 
  HelpCircle,
  X,
  Send,
  Eye,
  EyeOff,
  Zap,
  BedDouble,
  Microscope,
  Radio,
  FileCheck2,
  Volume2,
  Sun,
  Moon
} from 'lucide-react';
import { store, INITIAL_STAFF_MEMBERS } from '../../lib/store';
import { UserRole, Patient, Doctor, StaffMember, StaffRole } from '../../types';
import { speakWelcomeToCheckmed } from '../../lib/sound';
import { fastHash } from '../../lib/doctorAuth';

interface CheckMedWelcomeAuthProps {
  onSuccessLogin: (role: UserRole, targetView?: string) => void;
  initialRole?: UserRole | null;
}

type AuthMode = 'select-role' | 'patient' | 'doctor' | 'admin' | 'staff';
type PatientTab = 'signin' | 'signup';

export const CheckMedWelcomeAuth: React.FC<CheckMedWelcomeAuthProps> = ({
  onSuccessLogin,
  initialRole
}) => {
  const [mode, setMode] = useState<AuthMode>(initialRole && initialRole !== 'guest' ? (initialRole as AuthMode) : 'select-role');
  const [patientTab, setPatientTab] = useState<PatientTab>('signin');
  
  // Form states
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Patient Sign Up States
  const [patientName, setPatientName] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientAge, setPatientAge] = useState<number | ''>('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientBloodGroup, setPatientBloodGroup] = useState('O+');
  const [patientPassword, setPatientPassword] = useState('');
  const [patientConfirmPassword, setPatientConfirmPassword] = useState('');

  // Modals
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestRole, setRequestRole] = useState<'doctor' | 'staff'>('doctor');
  const [reqName, setReqName] = useState('');
  const [reqEmail, setReqEmail] = useState('');
  const [reqPhone, setReqPhone] = useState('');
  const [reqDept, setReqDept] = useState('');
  const [reqSpecialization, setReqSpecialization] = useState('');
  const [reqQualification, setReqQualification] = useState('');
  const [reqCode, setReqCode] = useState('');
  const [reqPassword, setReqPassword] = useState('');
  const [reqConfirmPassword, setReqConfirmPassword] = useState('');
  const [reqError, setReqError] = useState('');
  const [reqNotes, setReqNotes] = useState('');
  const [reqSuccess, setReqSuccess] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(store.theme);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTheme(store.theme);
    });
    return unsubscribe;
  }, []);

  // Clear errors when changing modes
  const handleSelectRole = (newRole: AuthMode) => {
    setMode(newRole);
    setErrorMsg('');
    setSuccessMsg('');
    setIdentifier('');
    setPassword('');
  };

  const handleBackToSelection = () => {
    setMode('select-role');
    setErrorMsg('');
    setSuccessMsg('');
  };

  // --- 1. PATIENT SIGN IN ---
  const handlePatientSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = store.loginPatient(identifier, password);
      setIsLoading(false);
      if (res.success) {
        onSuccessLogin('patient', 'patient-portal');
      } else {
        setErrorMsg(res.error || 'Invalid patient details. Please check and try again.');
      }
    }, 350);
  };

  // Quick Demo Patient Login
  const handleDemoPatientSelect = (patient: Patient) => {
    store.setCurrentUser(patient);
    store.setRole('patient');
    localStorage.setItem('smartcare_user_registered', 'true');
    onSuccessLogin('patient', 'patient-portal');
  };

  // --- 2. PATIENT SIGN UP ---
  const handlePatientSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanName = patientName.trim();
    const cleanEmail = patientEmail.trim();
    const cleanPhone = patientPhone.trim();
    const numAge = Number(patientAge);

    if (!cleanName) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!patientAge || isNaN(numAge) || numAge < 1 || numAge > 120) {
      setErrorMsg('Please enter a valid age (1 to 120).');
      return;
    }
    if (patientPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }
    if (patientPassword !== patientConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const newPat = store.registerPatient({
        full_name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        age: numAge,
        gender: patientGender,
        blood_group: patientBloodGroup,
        medical_history: 'New patient registered via CheckMed Portal'
      });

      localStorage.setItem('smartcare_user_registered', 'true');
      setIsLoading(false);
      onSuccessLogin('patient', 'patient-portal');
    }, 400);
  };

  // --- 3. DOCTOR SIGN IN ---
  const handleDoctorSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = store.loginDoctor(identifier, password);
      setIsLoading(false);
      if (res.success) {
        onSuccessLogin('doctor', 'doctor-dashboard');
      } else {
        setErrorMsg(res.error || 'Doctor account not found. Please verify your Doctor ID.');
      }
    }, 350);
  };

  const handleDemoDoctorSelect = (doctor: Doctor) => {
    store.setActiveDoctor(doctor);
    store.setRole('doctor');
    onSuccessLogin('doctor', 'doctor-dashboard');
  };

  // --- 4. ADMIN SIGN IN ---
  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = store.loginAdmin(identifier, password);
      setIsLoading(false);
      if (res.success) {
        onSuccessLogin('admin', 'admin-dashboard');
      } else {
        setErrorMsg(res.error || 'Invalid administrator security credentials.');
      }
    }, 350);
  };

  // --- 5. STAFF SIGN IN ---
  const handleStaffSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = store.loginStaff(identifier, password);
      setIsLoading(false);
      if (res.success) {
        onSuccessLogin('staff', 'staff-dashboard');
      } else {
        setErrorMsg(res.error || 'Staff credentials not recognized. Please check your Staff ID.');
      }
    }, 350);
  };

  const handleDemoStaffSelect = (staff: StaffMember) => {
    store.setActiveStaffMember(staff);
    store.setRole('staff');
    onSuccessLogin('staff', 'staff-dashboard');
  };

  // --- FORGOT PASSWORD SUBMIT ---
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSubmitted(true);
    setTimeout(() => {
      setShowForgotPassword(false);
      setForgotSubmitted(false);
      setForgotEmail('');
      setSuccessMsg('Password recovery instructions sent to your registered contact.');
    }, 2000);
  };

  // --- REQUEST ACCOUNT SUBMIT ---
  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReqError('');
    if (!reqName.trim() || !reqEmail.trim()) {
      setReqError('Please provide your full name and official email.');
      return;
    }

    if (reqPassword) {
      if (reqPassword.length < 4) {
        setReqError('Password must be at least 4 characters long.');
        return;
      }
      if (reqPassword !== reqConfirmPassword) {
        setReqError('Passwords do not match. Please re-enter your password.');
        return;
      }
    }

    store.submitAccountRequest({
      role: requestRole,
      full_name: reqName.trim(),
      email: reqEmail.trim(),
      phone: reqPhone.trim() || '9876543210',
      department: reqDept.trim() || 'General Medicine',
      specialization: reqSpecialization.trim() || (reqDept.trim() ? `${reqDept.trim()} Specialist` : 'General Medicine Specialist'),
      qualification: reqQualification.trim() || 'MBBS, MD',
      license_or_emp_id: reqCode.trim() || `MCI-REG-${Date.now().toString().slice(-4)}`,
      password_hash: fastHash(reqPassword.trim() || 'Doctor@123'),
      notes: reqNotes.trim()
    });

    setReqSuccess(true);
    setTimeout(() => {
      setShowRequestModal(false);
      setReqSuccess(false);
      setReqName('');
      setReqEmail('');
      setReqPhone('');
      setReqDept('');
      setReqSpecialization('');
      setReqQualification('');
      setReqCode('');
      setReqPassword('');
      setReqConfirmPassword('');
      setReqError('');
      setReqNotes('');
      setSuccessMsg('Your account request has been submitted for hospital administrative approval.');
    }, 2200);
  };

  return (
    <div className="min-h-screen w-full bg-[#070B14] text-white flex flex-col justify-between select-none relative overflow-x-hidden font-sans">
      
      {/* Background Ambient Glow Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-[#0284C7]/20 via-[#0EA5E9]/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-[#10B981]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 blur-3xl pointer-events-none" />

      {/* Top Banner / Hospital Branding Bar */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] p-0.5 shadow-xl shadow-[#0284C7]/30 ring-2 ring-[#38BDF8]/40 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B1120] rounded-[14px] flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-[#38BDF8] animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
                CheckMed<span className="text-[#38BDF8]">.</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#0EA5E9]/15 text-[#38BDF8] border border-[#38BDF8]/30 px-2 py-0.5 rounded-full">
                Healthcare Network
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] font-medium hidden sm:block">
              Kanpur • Gorakhpur • Prayagraj • Varanasi • Lucknow
            </p>
          </div>
        </div>

        {/* System Theme Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-welcome-theme-toggle"
            onClick={() => store.toggleTheme()}
            className="p-2.5 rounded-2xl bg-[#0F172A]/80 hover:bg-[#1E293B] border border-[#334155] text-amber-400 hover:text-amber-300 transition-all cursor-pointer shadow-lg backdrop-blur-md flex items-center justify-center group"
            title={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to High-Contrast Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
      </header>

      {/* Main Center Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto w-full">
        
        {/* Global Toast Alert */}
        {successMsg && (
          <div className="mb-6 w-full max-w-md p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5 animate-fadeIn shadow-lg">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 w-full max-w-md p-3.5 rounded-2xl bg-rose-500/15 border border-rose-400/40 text-rose-300 text-xs font-bold flex items-center gap-2.5 animate-shake shadow-lg">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 1: OPENING WELCOME SCREEN & ROLE SELECTION ("Continue as") */}
        {/* ============================================================ */}
        {mode === 'select-role' && (
          <div className="w-full max-w-4xl space-y-8 text-center animate-fadeIn">
            
            {/* Top Namaste Greeting Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-amber-500/20 via-sky-500/20 to-emerald-500/20 border border-amber-400/40 text-white shadow-lg backdrop-blur-md">
                <span className="text-xl">🙏</span>
                <span className="text-sm font-black tracking-wide bg-gradient-to-r from-amber-300 via-sky-300 to-emerald-300 bg-clip-text text-transparent">
                  Namaste
                </span>
                <span className="text-xs text-slate-300 font-medium">(नमस्ते)</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] via-[#0EA5E9] to-[#10B981]">CheckMed</span>
              </h1>

              <p className="text-sm sm:text-base text-[#94A3B8] font-medium max-w-xl mx-auto">
                Your Smart Hospital Management System
              </p>

              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={() => speakWelcomeToCheckmed(true)}
                  title="Click to replay AI Voice Welcome"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 hover:bg-sky-500/25 border border-sky-400/40 text-sky-300 text-xs font-bold transition-all cursor-pointer shadow-md hover:scale-105 group"
                >
                  <Volume2 className="w-4 h-4 text-sky-400 group-hover:animate-bounce" />
                  <span className="flex items-center gap-1.5">
                    <span>AI Voice:</span>
                    <span className="text-white font-extrabold">"Welcome to CheckMed"</span>
                  </span>
                </button>
              </div>
            </div>


            {/* "Continue as" Selection Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-center gap-2">
                <span className="h-px w-12 bg-[#334155]" />
                <span className="text-xs font-black uppercase tracking-widest text-[#38BDF8]">
                  Continue as
                </span>
                <span className="h-px w-12 bg-[#334155]" />
              </div>

              {/* Four Large Selectable Role Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
                
                {/* 1. PATIENT CARD */}
                <div 
                  id="card-role-patient"
                  onClick={() => handleSelectRole('patient')}
                  className="group relative p-5 rounded-3xl bg-[#1E293B]/80 hover:bg-[#1E293B] border-2 border-[#334155] hover:border-emerald-500/80 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-emerald-500/20 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-black text-white group-hover:text-emerald-400 transition-colors">
                          Patient
                        </h3>
                        <span className="text-xs">👤</span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                        Manage appointments, reports, prescriptions and bills.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-xs font-black text-emerald-400 group-hover:text-emerald-300">
                    <span>Patient Portal</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. DOCTOR CARD */}
                <div 
                  id="card-role-doctor"
                  onClick={() => handleSelectRole('doctor')}
                  className="group relative p-5 rounded-3xl bg-[#1E293B]/80 hover:bg-[#1E293B] border-2 border-[#334155] hover:border-sky-500/80 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-sky-500/20 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-black text-white group-hover:text-sky-400 transition-colors">
                          Doctor
                        </h3>
                        <span className="text-xs">🩺</span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                        Manage patients, appointments, consultations and prescriptions.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-xs font-black text-sky-400 group-hover:text-sky-300">
                    <span>Doctor Workspace</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. ADMIN CARD */}
                <div 
                  id="card-role-admin"
                  onClick={() => handleSelectRole('admin')}
                  className="group relative p-5 rounded-3xl bg-[#1E293B]/80 hover:bg-[#1E293B] border-2 border-[#334155] hover:border-purple-500/80 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-purple-500/20 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-black text-white group-hover:text-purple-400 transition-colors">
                          Admin
                        </h3>
                        <span className="text-xs">🛡️</span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                        Manage hospital operations, staff, departments and analytics.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-xs font-black text-purple-400 group-hover:text-purple-300">
                    <span>Hospital Command</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 4. STAFF CARD */}
                <div 
                  id="card-role-staff"
                  onClick={() => handleSelectRole('staff')}
                  className="group relative p-5 rounded-3xl bg-[#1E293B]/80 hover:bg-[#1E293B] border-2 border-[#334155] hover:border-amber-500/80 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-amber-500/20 flex flex-col justify-between hover:-translate-y-1.5"
                >
                  <div className="space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-black text-white group-hover:text-amber-400 transition-colors">
                          Staff
                        </h3>
                        <span className="text-xs">👨‍💼</span>
                      </div>
                      <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                        Manage hospital front-desk and authorized staff operations.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-[#334155]/60 flex items-center justify-between text-xs font-black text-amber-400 group-hover:text-amber-300">
                    <span>Staff Portal</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Network Badges */}
            <div className="pt-4 flex items-center justify-center gap-2 flex-wrap text-xs text-[#94A3B8] font-medium">
              <span className="inline-flex items-center gap-1 bg-[#1E293B]/60 px-3 py-1 rounded-full border border-[#334155]">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> 24x7 ER Ready
              </span>
              <span className="inline-flex items-center gap-1 bg-[#1E293B]/60 px-3 py-1 rounded-full border border-[#334155]">
                <BedDouble className="w-3.5 h-3.5 text-sky-400" /> Live ICU & Bed Trackers
              </span>
              <span className="inline-flex items-center gap-1 bg-[#1E293B]/60 px-3 py-1 rounded-full border border-[#334155]">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Zero Waiting OPD Token Queue
              </span>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 2: PATIENT AUTHENTICATION (Sign In / Sign Up) */}
        {/* ============================================================ */}
        {mode === 'patient' && (
          <div className="w-full max-w-lg bg-[#1E293B] rounded-3xl border-2 border-emerald-500/40 shadow-2xl overflow-hidden animate-fadeIn">
            
            {/* Header with Back Button */}
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 border-b border-[#334155] relative">
              <button
                onClick={handleBackToSelection}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] hover:text-white mb-3 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#334155] border border-[#334155] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Role Selection</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-md">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    Patient Portal <span>👤</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Sign in to your health records or register a new patient account
                  </p>
                </div>
              </div>

              {/* Tabs: Sign In / Sign Up */}
              <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-[#0F172A] rounded-2xl border border-[#334155]">
                <button
                  id="tab-patient-signin"
                  onClick={() => { setPatientTab('signin'); setErrorMsg(''); }}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    patientTab === 'signin'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
                <button
                  id="tab-patient-signup"
                  onClick={() => { setPatientTab('signup'); setErrorMsg(''); }}
                  className={`py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    patientTab === 'signup'
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </button>
              </div>
            </div>

            {/* TAB CONTENT: SIGN IN */}
            {patientTab === 'signin' && (
              <div className="p-6 space-y-5">
                <form onSubmit={handlePatientSignIn} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Patient ID / Email / Phone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. pat-101, rahul@example.com or 9876543210"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-emerald-400 uppercase flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5" /> Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-[11px] font-bold text-[#38BDF8] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password (optional for demo)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full text-xs py-3 pl-3.5 pr-10 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    id="btn-patient-signin-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                  >
                    {isLoading ? <span>Signing In...</span> : <><span>Sign In to Patient Portal</span> <ArrowRight className="w-4 h-4" /></>}
                  </button>
                </form>

                {/* Quick One-Click Demo Profiles */}
                <div className="pt-3 border-t border-[#334155]/80 space-y-2.5">
                  <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider text-center">
                    Quick One-Click Demo Patient Logins:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {store.patients.slice(0, 3).map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleDemoPatientSelect(p)}
                        className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-[#334155] border border-[#334155] text-left transition-all cursor-pointer group"
                      >
                        <p className="text-xs font-bold text-white group-hover:text-emerald-400 truncate">
                          {p.full_name}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {p.blood_group} • Age {p.age}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT: SIGN UP */}
            {patientTab === 'signup' && (
              <form onSubmit={handlePatientSignUp} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-400 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      placeholder="e.g. 28"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value ? Number(e.target.value) : '')}
                      className="w-full text-xs py-2.5 px-3 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Gender
                    </label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as any)}
                      className="w-full text-xs py-2.5 px-2 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-emerald-400"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                      Blood
                    </label>
                    <select
                      value={patientBloodGroup}
                      onChange={(e) => setPatientBloodGroup(e.target.value)}
                      className="w-full text-xs py-2.5 px-2 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-emerald-400"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                      Create Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 4 characters"
                      value={patientPassword}
                      onChange={(e) => setPatientPassword(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={patientConfirmPassword}
                      onChange={(e) => setPatientConfirmPassword(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  id="btn-patient-create-account"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  {isLoading ? <span>Creating Account...</span> : <><span>Create Patient Account</span> <CheckCircle2 className="w-4 h-4" /></>}
                </button>
              </form>
            )}

          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 3: DOCTOR AUTHENTICATION */}
        {/* ============================================================ */}
        {mode === 'doctor' && (
          <div className="w-full max-w-lg bg-[#1E293B] rounded-3xl border-2 border-sky-500/40 shadow-2xl overflow-hidden animate-fadeIn">
            
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 border-b border-[#334155] relative">
              <button
                onClick={handleBackToSelection}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] hover:text-white mb-3 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#334155] border border-[#334155] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Role Selection</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shadow-md">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    Doctor Portal <span>🩺</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Authorized medical practitioner workspace & OPD command
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <form onSubmit={handleDoctorSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-sky-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Doctor ID / Registered Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your registered Doctor Email or ID"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-sky-400 uppercase flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Security Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] font-bold text-[#38BDF8] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your security password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs py-3 pl-3.5 pr-10 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-doctor-signin-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  {isLoading ? <span>Verifying Credentials...</span> : <><span>Sign In to Doctor Workspace</span> <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              {/* Controlled Doctor Account Notice / Request */}
              <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-white">Need a Doctor Account?</p>
                  <p className="text-[11px] text-slate-400">Authorized medical practitioners only.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRequestRole('doctor');
                    setShowRequestModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-400/40 text-sky-300 font-bold text-xs cursor-pointer whitespace-nowrap"
                >
                  Request Doctor Account
                </button>
              </div>

              {/* Quick Demo Access for Authorized Doctors */}
              <div className="pt-2 border-t border-[#334155]/80 space-y-2 text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Login as Authorized Doctor
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    id="btn-quick-login-anivesh"
                    type="button"
                    onClick={() => {
                      const doc = store.doctors.find(d => d.id === 'doc-anivesh' || d.full_name.toLowerCase().includes('anivesh')) || store.doctors[0];
                      if (doc) handleDemoDoctorSelect(doc);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/40 text-sky-200 font-bold text-xs transition-all cursor-pointer flex items-center gap-2.5 shadow-md group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-white group-hover:text-sky-300 truncate">Dr. Anivesh Singh</div>
                      <div className="text-[10px] text-sky-300/80 font-medium truncate">Cardiology & Blood Testing</div>
                    </div>
                  </button>

                  <button
                    id="btn-quick-login-deepanshu"
                    type="button"
                    onClick={() => {
                      const doc = store.doctors.find(d => d.id === 'doc-deepanshu' || d.full_name.toLowerCase().includes('deepanshu')) || store.doctors[1];
                      if (doc) handleDemoDoctorSelect(doc);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-200 font-bold text-xs transition-all cursor-pointer flex items-center gap-2.5 shadow-md group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-white group-hover:text-cyan-300 truncate">Dr. Deepanshu Singh</div>
                      <div className="text-[10px] text-cyan-300/80 font-medium truncate">Neurology & CT Scan</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 4: ADMIN AUTHENTICATION */}
        {/* ============================================================ */}
        {mode === 'admin' && (
          <div className="w-full max-w-lg bg-[#1E293B] rounded-3xl border-2 border-purple-500/40 shadow-2xl overflow-hidden animate-fadeIn">
            
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 border-b border-[#334155] relative">
              <button
                onClick={handleBackToSelection}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] hover:text-white mb-3 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#334155] border border-[#334155] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Role Selection</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400 shadow-md">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    Admin Portal <span>🛡️</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Hospital operations, staff management and multi-city telemetry
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <form onSubmit={handleAdminSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-purple-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" /> Admin ID / Username
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. admin or checkmed-admin"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-purple-400 uppercase flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5" /> Admin Security Passcode
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] font-bold text-[#38BDF8] hover:underline cursor-pointer"
                    >
                      Forgot Passcode?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Passcode (e.g. admin123, 1234 or leave blank)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs py-3 pl-3.5 pr-10 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-admin-signin-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  {isLoading ? <span>Authenticating Admin...</span> : <><span>Sign In to Admin Dashboard</span> <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs text-slate-400">
                <p className="font-semibold text-slate-300">
                  🔒 Notice on Administrator Accounts:
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  Admin accounts are created and authorized strictly by CheckMed Hospital Board. Unrestricted public signup is disabled.
                </p>
              </div>

              {/* Quick Demo Access for Authorized Admin */}
              <div className="pt-2 border-t border-[#334155]/80 space-y-2 text-center">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Quick Login as Hospital Administrator
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      store.loginAdmin('ashifansari.@gmail.com', 'admin123');
                      onSuccessLogin('admin', 'admin-dashboard');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/60 border border-purple-500/40 text-purple-200 font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <Shield className="w-4 h-4 text-purple-400" />
                    <span>Ashif Ansari (Hospital Admin)</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SCREEN 5: STAFF AUTHENTICATION */}
        {/* ============================================================ */}
        {mode === 'staff' && (
          <div className="w-full max-w-lg bg-[#1E293B] rounded-3xl border-2 border-amber-500/40 shadow-2xl overflow-hidden animate-fadeIn">
            
            <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 border-b border-[#334155] relative">
              <button
                onClick={handleBackToSelection}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#94A3B8] hover:text-white mb-3 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-[#334155] border border-[#334155] transition-all cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Role Selection</span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-md">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    Staff Portal <span>👨‍💼</span>
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Receptionist, Nursing, Laboratory, OT, Radiology & Pharmacy Modules
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <form onSubmit={handleStaffSignIn} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5" /> Staff ID / Staff Email
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. STF-REC-101 or sunita.nursing@checkmed.org"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-amber-400 uppercase flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5" /> Staff Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-[11px] font-bold text-[#38BDF8] hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter staff password (optional for demo)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs py-3 pl-3.5 pr-10 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  id="btn-staff-signin-submit"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                >
                  {isLoading ? <span>Verifying Staff Credentials...</span> : <><span>Sign In to Staff Module</span> <ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>

              {/* Request Staff Account */}
              <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#334155] text-xs flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-white">Hospital Staff Member?</p>
                  <p className="text-[11px] text-slate-400">Request account credentials from HR.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setRequestRole('staff');
                    setShowRequestModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/40 text-amber-300 font-bold text-xs cursor-pointer whitespace-nowrap"
                >
                  Request Staff Account
                </button>
              </div>

              {/* Quick Select by Authorized Department */}
              <div className="pt-2 border-t border-[#334155]/80 space-y-2">
                <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider text-center">
                  Quick Select by Staff Department:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {store.staffMembers.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleDemoStaffSelect(s)}
                      className="p-2 rounded-xl bg-[#0F172A] hover:bg-[#334155] border border-[#334155] text-left transition-all cursor-pointer group"
                    >
                      <p className="text-[11px] font-bold text-white group-hover:text-amber-400 truncate">
                        {s.role}
                      </p>
                      <p className="text-[9px] text-slate-400 truncate">
                        {s.full_name}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* Footer Branding & Emergency Quick Hotline */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#94A3B8] border-t border-[#334155]/60">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CheckMed 24x7 Multi-Hospital Network</span>
          <span>•</span>
          <span>By Late X</span>
        </div>
        
        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-slate-400">Emergency ER: <strong className="text-rose-400">108</strong></span>
          <span className="text-slate-400">Support: <strong className="text-sky-300">support@checkmed.org</strong></span>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* MODAL 1: FORGOT PASSWORD */}
      {/* ============================================================ */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#1E293B] rounded-3xl border border-[#38BDF8]/40 shadow-2xl p-6 relative">
            <button
              onClick={() => setShowForgotPassword(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-[#0F172A] border border-[#334155]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">Reset Account Password</h3>
                <p className="text-xs text-slate-400">CheckMed Security & Recovery</p>
              </div>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Password reset link and OTP has been dispatched to {forgotEmail}. Please check your inbox.</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Enter your registered Email Address or Patient / Doctor / Staff ID. We will generate a secure reset link.
                </p>

                <div>
                  <label className="block text-xs font-bold text-sky-400 uppercase mb-1">
                    Registered Email / ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. user@checkmed.org or 9876543210"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-sky-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
                >
                  Send Recovery Link
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: REQUEST DOCTOR / STAFF ACCOUNT */}
      {/* ============================================================ */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="w-full max-w-lg bg-[#1E293B] rounded-3xl border border-[#38BDF8]/40 shadow-2xl p-6 relative my-auto">
            <button
              onClick={() => setShowRequestModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl bg-[#0F172A] border border-[#334155]"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">
                  Request {requestRole === 'doctor' ? 'Doctor' : 'Staff'} Account
                </h3>
                <p className="text-xs text-slate-400">Hospital Administration Verification Request</p>
              </div>
            </div>

            {reqSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>Your request has been submitted to CheckMed HR & Medical Board for authorization.</span>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3.5">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Please provide your professional medical council or employee credentials for admin verification.
                </p>

                {reqError && (
                  <div className="p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                    <span>{reqError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                    Full Professional Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={requestRole === 'doctor' ? 'e.g. Dr. Rajesh Khanna' : 'e.g. Priya Sharma'}
                    value={reqName}
                    onChange={(e) => setReqName(e.target.value)}
                    className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. doctor@hospital.org"
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                      Department / Specialty
                    </label>
                    <input
                      type="text"
                      placeholder={requestRole === 'doctor' ? 'e.g. Cardiology, Neurology' : 'e.g. ICU, Nursing, Reception'}
                      value={reqDept}
                      onChange={(e) => setReqDept(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                      {requestRole === 'doctor' ? 'Medical Council Reg No *' : 'Employee ID'}
                    </label>
                    <input
                      type="text"
                      placeholder={requestRole === 'doctor' ? 'e.g. MCI-2024-9988' : 'e.g. EMP-551'}
                      value={reqCode}
                      onChange={(e) => setReqCode(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {requestRole === 'doctor' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Specialization
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Interventional Cardiology"
                        value={reqSpecialization}
                        onChange={(e) => setReqSpecialization(e.target.value)}
                        className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-300 uppercase mb-1">
                        Degree / Qualification
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. MBBS, MD, DM"
                        value={reqQualification}
                        onChange={(e) => setReqQualification(e.target.value)}
                        className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                      Account Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter secure password"
                      value={reqPassword}
                      onChange={(e) => setReqPassword(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Re-enter password"
                      value={reqConfirmPassword}
                      onChange={(e) => setReqConfirmPassword(e.target.value)}
                      className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Briefly mention your hospital unit or credentials..."
                    value={reqNotes}
                    onChange={(e) => setReqNotes(e.target.value)}
                    className="w-full text-xs py-2 px-3 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Account Request for Approval</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
