import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  HeartPulse,
  MapPin,
  ArrowRight
} from 'lucide-react';
import { Patient } from '../types';
import { store } from '../lib/store';

interface PatientRegistrationGateProps {
  isOpen: boolean;
  onSubmitSuccess: (patient: Patient) => void;
}

export const PatientRegistrationGate: React.FC<PatientRegistrationGateProps> = ({
  isOpen,
  onSubmitSuccess
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    const cleanName = fullName.trim();
    const cleanPhone = phone.trim();
    const cleanEmail = email.trim();
    const numAge = Number(age);

    if (!cleanName) {
      setErrorMsg('Please enter patient name.');
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!age || isNaN(numAge) || numAge < 1 || numAge > 120) {
      setErrorMsg('Please enter a valid patient age (1 - 120).');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Register Patient into store
      const newPatient = store.registerPatient({
        full_name: cleanName,
        phone: cleanPhone,
        email: cleanEmail,
        age: numAge,
        gender,
        blood_group: bloodGroup,
        medical_history: 'Registered via Patient Gate'
      });

      // Mark onboarding completed in storage
      localStorage.setItem('smartcare_user_registered', 'true');
      setIsSubmitting(false);

      // Callback to unlock app
      onSubmitSuccess(newPatient);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/95 backdrop-blur-md p-4 overflow-y-auto animate-fadeIn select-none">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0EA5E9]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Mandatory Registration Card */}
      <div className="relative w-full max-w-lg bg-[#1E293B] text-white rounded-3xl shadow-2xl border-2 border-[#38BDF8]/50 overflow-hidden my-auto">
        
        {/* Lock Banner Notice */}
        <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] p-6 text-center border-b border-[#334155] relative">
          
          {/* Lock Icon Badge */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0EA5E9]/20 border border-[#38BDF8]/40 mb-3 shadow-lg shadow-[#0EA5E9]/20">
            <Lock className="w-7 h-7 text-[#38BDF8]" />
          </div>

          <div className="flex items-center justify-center gap-1.5 mb-1">
            <span className="text-[10px] uppercase tracking-widest font-black text-[#38BDF8] bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 px-2.5 py-0.5 rounded-full">
              Mandatory Patient Verification
            </span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Mandatory Patient Registration <span className="text-[#38BDF8] font-normal">(अनिवार्य विवरण)</span>
          </h2>
          
          <p className="text-xs text-[#CBD5E1] mt-1.5 max-w-md mx-auto leading-relaxed">
            बिना नाम, मोबाइल नंबर और ईमेल विवरण दर्ज किए ऐप का उपयोग नहीं किया जा सकता। कृपया अपना विवरण भरें।
            <br />
            <span className="text-[#38BDF8] font-semibold">Username, Mobile Number, Email ID & Age are strictly compulsory.</span>
          </p>
        </div>

        {/* Error Alert Message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/40 text-[#EF4444] text-xs font-bold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Mandatory Details Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* 1. Patient Name */}
          <div>
            <label className="block text-xs font-bold text-[#38BDF8] uppercase mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Patient Full Name *
              </span>
              <span className="text-[10px] text-[#94A3B8] font-normal">Required</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="e.g. Rahul Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0EA5E9]/30 transition-all font-medium"
              />
            </div>
          </div>

          {/* 2. Mobile No & Email ID Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Mobile No */}
            <div>
              <label className="block text-xs font-bold text-[#38BDF8] uppercase mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" /> Mobile No *
                </span>
              </label>
              <input
                type="tel"
                required
                maxLength={10}
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0EA5E9]/30 transition-all font-mono font-medium"
              />
            </div>

            {/* Email ID */}
            <div>
              <label className="block text-xs font-bold text-[#38BDF8] uppercase mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" /> Email ID *
                </span>
              </label>
              <input
                type="email"
                required
                placeholder="e.g. rahul@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0EA5E9]/30 transition-all font-medium"
              />
            </div>

          </div>

          {/* 3. Age & Gender Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* Age */}
            <div>
              <label className="block text-xs font-bold text-[#38BDF8] uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Age *
              </label>
              <input
                type="number"
                required
                min={1}
                max={120}
                placeholder="e.g. 28"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                className="w-full text-xs py-3 px-3.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] focus:ring-2 focus:ring-[#0EA5E9]/30 transition-all font-medium"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full text-xs py-3 px-3 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-[#38BDF8] transition-all"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-[#94A3B8] uppercase mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full text-xs py-3 px-3 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:outline-none focus:border-[#38BDF8] transition-all"
              >
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>

          </div>

          {/* Privacy Note */}
          <div className="p-3 bg-[#0F172A]/80 rounded-xl border border-[#334155]/60 text-[11px] text-[#94A3B8] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" />
            <span>Your medical records are encrypted & secured under Checkmed Healthcare Network.</span>
          </div>

          {/* Submit Button */}
          <button
            id="btn-submit-patient-gate"
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-gradient-to-r from-[#0EA5E9] via-[#0284C7] to-[#0369A1] hover:from-[#0284C7] hover:to-[#0369A1] text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-[#0EA5E9]/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving Patient Record...</span>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-white" />
                <span>Submit & Access Hospital Network</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
