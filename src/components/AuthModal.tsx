import React, { useState } from 'react';
import { X, User, ShieldCheck, UserPlus, HeartPulse, CheckCircle2, Stethoscope } from 'lucide-react';
import { store } from '../lib/store';
import { Doctor } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register' | 'doctor' | 'admin';
  onSuccess: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
  onSuccess
}) => {
  const [tab, setTab] = useState<'login' | 'register' | 'doctor' | 'admin'>(defaultTab);

  React.useEffect(() => {
    if (isOpen && defaultTab) {
      setTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Patient Registration state
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [medicalHistory, setMedicalHistory] = useState('');

  // Login selection
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState(store.activeDoctor?.id || store.doctors[0]?.id || '');
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  if (!isOpen) return null;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !age) return;

    const patientName = fullName || username || 'New User';

    store.registerPatient({
      full_name: patientName,
      email,
      phone,
      age: Number(age),
      gender,
      blood_group: bloodGroup,
      medical_history: medicalHistory ? `${username ? `[Username: ${username}] ` : ''}${medicalHistory}` : (username ? `Username: ${username}` : '')
    });

    onSuccess();
    onClose();
  };

  const handlePatientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = store.patients.find(p => p.id === selectedPatientId) || store.patients[0];
    if (patient) {
      store.setCurrentUser(patient);
      store.setRole('patient');
      onSuccess();
      onClose();
    }
  };

  const handleDoctorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const doctor = store.doctors.find(d => d.id === selectedDoctorId) || store.doctors[0];
    if (doctor) {
      store.setActiveDoctor(doctor);
      store.setRole('doctor');
      onSuccess();
      onClose();
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === 'admin123' || adminPin === '1234' || adminPin.length >= 0) {
      store.setRole('admin');
      onSuccess();
      onClose();
    } else {
      setAdminError('Invalid Admin Key. Use "admin123" or click Quick Admin Access.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-[#1E293B] text-[#F8FAFC] w-full max-w-md rounded-2xl shadow-2xl border border-[#334155] overflow-hidden my-8 transition-all">
        
        {/* Header */}
        <div className="bg-[#0F172A] p-6 text-white border-b border-[#334155] relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <HeartPulse className="w-6 h-6 text-[#38BDF8]" />
            <span className="text-xs uppercase tracking-widest font-bold text-[#38BDF8]">Checkmed Portal</span>
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC]">Welcome to Checkmed Hospital</h3>
          <p className="text-xs text-[#94A3B8] mt-1">Select your access role to continue to the system.</p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-4 border-b border-[#334155] bg-[#0F172A] p-1 text-[11px]">
          <button
            onClick={() => setTab('login')}
            className={`py-2 px-1 font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              tab === 'login' ? 'bg-[#1E293B] text-[#38BDF8] border border-[#0EA5E9]/30' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <User className="w-3.5 h-3.5" /> <span>Patient</span>
          </button>
          <button
            onClick={() => setTab('doctor')}
            className={`py-2 px-1 font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              tab === 'doctor' ? 'bg-emerald-600 text-white shadow-md' : 'text-[#94A3B8] hover:text-white'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" /> <span>Doctor</span>
          </button>
          <button
            onClick={() => setTab('register')}
            className={`py-2 px-1 font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              tab === 'register' ? 'bg-[#1E293B] text-[#38BDF8] border border-[#0EA5E9]/30' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> <span>Register</span>
          </button>
          <button
            onClick={() => setTab('admin')}
            className={`py-2 px-1 font-bold rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
              tab === 'admin' ? 'bg-[#0EA5E9] text-white' : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> <span>Admin</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          
          {/* Doctor Login Form */}
          {tab === 'doctor' && (
            <form onSubmit={handleDoctorLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1">Select Doctor Profile</label>
                <select
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#334155] focus:ring-2 focus:ring-emerald-500 bg-[#0F172A] text-[#F8FAFC]"
                >
                  {store.doctors.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.full_name} — {d.specialization} ({d.department})
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl text-xs text-emerald-300 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" /> Doctor Clinical Workspace
                </p>
                <p className="text-[11px] text-slate-300">
                  Access your dedicated OPD schedule, write prescriptions, review diagnostic lab reports, and manage patient EHR histories.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-900/30 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Stethoscope className="w-4 h-4" />
                Launch Doctor Dashboard
              </button>

              <div className="pt-2 border-t border-[#334155]/60 space-y-2 text-center">
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
                  Quick Login as Authorized Doctor
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const doc = store.doctors.find(d => d.id === 'doc-anivesh' || d.full_name.toLowerCase().includes('anivesh')) || store.doctors[0];
                      if (doc) {
                        store.setActiveDoctor(doc);
                        store.setRole('doctor');
                        onSuccess();
                        onClose();
                      }
                    }}
                    className="p-2 rounded-xl bg-sky-950/40 hover:bg-sky-900/60 border border-sky-500/40 text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-sky-300 flex items-center gap-1 truncate">
                      <Stethoscope className="w-3.5 h-3.5 text-sky-400 shrink-0" /> Dr. Anivesh
                    </p>
                    <p className="text-[10px] text-sky-300/80 truncate">Cardiology</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const doc = store.doctors.find(d => d.id === 'doc-deepanshu' || d.full_name.toLowerCase().includes('deepanshu')) || store.doctors[1];
                      if (doc) {
                        store.setActiveDoctor(doc);
                        store.setRole('doctor');
                        onSuccess();
                        onClose();
                      }
                    }}
                    className="p-2 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/40 text-left transition-all cursor-pointer group"
                  >
                    <p className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center gap-1 truncate">
                      <Stethoscope className="w-3.5 h-3.5 text-cyan-400 shrink-0" /> Dr. Deepanshu
                    </p>
                    <p className="text-[10px] text-cyan-300/80 truncate">Neurology</p>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Patient Login Form */}
          {tab === 'login' && (
            <form onSubmit={handlePatientLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Select Patient Profile</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#334155] focus:ring-2 focus:ring-[#0EA5E9] bg-[#0F172A] text-[#F8FAFC]"
                >
                  <option value="">Select an existing patient account...</option>
                  {store.patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.full_name} ({p.phone}) - Age {p.age} [{p.blood_group}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 p-3 rounded-xl text-xs text-[#38BDF8] space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#38BDF8]" /> Hackathon Quick Login
                </p>
                <p className="text-[11px] text-[#94A3B8]">Choose any demo patient or click Register to create a new patient instantly.</p>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Access Patient Dashboard
              </button>
            </form>
          )}

          {/* Patient Register Form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 p-2.5 rounded-xl text-xs text-[#38BDF8] flex items-center gap-2 mb-2">
                <span className="text-base">📝</span>
                <span>Please fill in your details to create your Checkmed account.</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#38BDF8] uppercase mb-1">Username *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. anish_sharma"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Age *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="25"
                    value={age}
                    onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#38BDF8] uppercase mb-1">Blood Group *</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Full Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Anish Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full text-xs p-2.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Medical History / Allergies (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Asthma, Penicillin allergy..."
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl shadow-lg shadow-[#10B981]/25 transition-all mt-3 cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-white" />
                Submit & Sign Up
              </button>
            </form>
          )}

          {/* Admin Login Form */}
          {tab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Admin Passcode / Key</label>
                <input
                  type="password"
                  placeholder="Enter passcode (or click quick access below)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
                />
              </div>

              {adminError && <p className="text-xs text-[#F87171] font-semibold">{adminError}</p>}

              <button
                type="submit"
                className="w-full py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                Login to Hospital Admin Dashboard
              </button>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    store.setRole('admin');
                    onSuccess();
                    onClose();
                  }}
                  className="w-full py-2 bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  ⚡ One-Click Hackathon Admin Access
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
