import React from 'react';
import { HeartPulse, PhoneCall, MapPin, Clock, ShieldCheck, Database } from 'lucide-react';

interface FooterProps {
  onOpenSupabase: () => void;
  setActiveView: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenSupabase, setActiveView }) => {
  return (
    <footer id="main-footer" className="bg-[#0F172A] text-[#94A3B8] pt-12 pb-8 border-t border-[#334155]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#334155]">
          
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] flex items-center justify-center text-white font-bold shadow-md shadow-[#0EA5E9]/20">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#F8FAFC]">
                Checkmed<span className="text-[#38BDF8]">.</span>
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Next-generation hospital management system. Streamlining OPD queues, bed allocation, lab reports, and doctor consultations.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={onOpenSupabase}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#38BDF8] bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 rounded-lg hover:bg-[#0EA5E9]/20 transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Schema & Config</span>
              </button>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider mb-4">Patient Portal</h4>
            <ul className="space-y-2.5 text-xs text-[#94A3B8]">
              <li>
                <button onClick={() => setActiveView('patient-portal')} className="hover:text-[#38BDF8] transition-colors">
                  Find & Search Doctors
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('patient-portal')} className="hover:text-[#38BDF8] transition-colors">
                  Book OPD Appointment
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('patient-portal')} className="hover:text-[#38BDF8] transition-colors">
                  Live Token Queue Monitor
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('patient-portal')} className="hover:text-[#38BDF8] transition-colors">
                  ICU & Ward Bed Tracker
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('patient-portal')} className="hover:text-[#38BDF8] transition-colors">
                  Lab Test Reports & Invoices
                </button>
              </li>
            </ul>
          </div>

          {/* Hospital Wards */}
          <div>
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider mb-4">Departments</h4>
            <ul className="space-y-2 text-xs text-[#94A3B8]">
              <li>Cardiology & Heart Care</li>
              <li>Neurology & Brain Sciences</li>
              <li>Orthopedics & Spine Surgery</li>
              <li>Pediatrics & Child Care</li>
              <li>General Internal Medicine</li>
              <li>24/7 Trauma & Emergency</li>
            </ul>
          </div>

          {/* Emergency & Working Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider">Emergency Contact</h4>
            <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 space-y-1">
              <div className="flex items-center gap-2 text-[#F87171] font-bold text-xs">
                <PhoneCall className="w-4 h-4 text-[#F87171]" />
                <span>Emergency Ambulance: 108</span>
              </div>
              <p className="text-[11px] text-[#F87171]/80">Trauma Unit Open 24/7 x 365 Days</p>
            </div>

            <div className="text-xs space-y-1.5 text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>OPD Hours: 8:00 AM - 8:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>Campus Medical Block 4, Sector 12</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#94A3B8] gap-4">
          <p>© 2026 Checkmed App • Crafted with ❤️ & 🔥 by <span className="text-[#F59E0B] font-bold">Late X</span> ⚔️</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2.5 py-1 rounded-full text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
              Live Queue Engine Active
            </span>
            <button onClick={() => setActiveView('welcome')} className="hover:text-[#F8FAFC] flex items-center gap-1 cursor-pointer">
              <ShieldCheck className="w-3.5 h-3.5 text-[#38BDF8]" /> Staff / Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
