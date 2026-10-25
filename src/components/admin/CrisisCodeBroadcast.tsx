import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Siren, 
  Flame, 
  HeartPulse, 
  AlertTriangle, 
  Radio, 
  Volume2, 
  VolumeX, 
  CheckCircle2, 
  Clock, 
  Users, 
  MapPin, 
  Lock, 
  PhoneCall, 
  Zap,
  Activity
} from 'lucide-react';
import { playQueueChimeSound } from '../../lib/sound';

export interface EmergencyCode {
  code: string;
  name: string;
  color: string;
  border: string;
  bgBadge: string;
  description: string;
  teamLead: string;
  protocol: string[];
  active: boolean;
  activatedAt?: string;
  location?: string;
}

const INITIAL_CODES: EmergencyCode[] = [
  {
    code: 'CODE BLUE',
    name: 'Cardiac / Respiratory Arrest',
    color: 'text-blue-400',
    border: 'border-blue-500/40',
    bgBadge: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
    description: 'Immediate resuscitation protocol for adult/pediatric cardiac arrest.',
    teamLead: 'Dr. Rahul Sharma (Chief Cardiologist & Crash Team)',
    protocol: ['Deploy Crash Cart #4', 'Airway Intubation Lead', 'Defibrillator Prep', 'ICU Bed 01 Reservation'],
    active: false
  },
  {
    code: 'CODE RED',
    name: 'Fire / Thermal Hazard',
    color: 'text-red-400',
    border: 'border-red-500/40',
    bgBadge: 'bg-red-500/20 text-red-400 border-red-500/40',
    description: 'Facility fire alarm, thermal containment & emergency ward evacuation.',
    teamLead: 'Security & Safety Marshal (Col. Verma)',
    protocol: ['Seal Fire Doors Zone B', 'Oxygen Main Valve Isolation', 'Evacuate General Ward Wing 2', 'Notify City Fire Brigade'],
    active: false
  },
  {
    code: 'CODE YELLOW',
    name: 'Mass Casualty Disaster / Highway Surge',
    color: 'text-amber-400',
    border: 'border-amber-500/40',
    bgBadge: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    description: 'Major external disaster triage, highway accident or multi-trauma influx.',
    teamLead: 'Dr. Priya Singh (Trauma Director) & ER Response Team',
    protocol: ['Mobilize 12 Trauma Surgeons', 'Open Overflow Bays A & B', 'O-Negative Blood Thaw', 'Green Ambulance Corridor'],
    active: true,
    activatedAt: '12 mins ago',
    location: 'Emergency Trauma Entrance & Triage Bay'
  },
  {
    code: 'CODE ORANGE',
    name: 'Hazardous Chemical / Biohazard Spill',
    color: 'text-orange-400',
    border: 'border-orange-500/40',
    bgBadge: 'bg-orange-500/20 text-orange-400 border-orange-500/40',
    description: 'Toxic substance release, biological containment or radiation spill.',
    teamLead: 'Hazmat Incident Commander & Pathology Officer',
    protocol: ['Level 4 Hazmat Suits', 'Negative Pressure Ventilation', 'Decontamination Chamber', 'Area Lockdown'],
    active: false
  },
  {
    code: 'CODE PINK',
    name: 'Infant / Pediatric Emergency Alert',
    color: 'text-pink-400',
    border: 'border-pink-500/40',
    bgBadge: 'bg-pink-500/20 text-pink-400 border-pink-500/40',
    description: 'NICU critical vitals drop, pediatric distress, or security perimeter alert.',
    teamLead: 'Dr. Neha Kapoor (NICU Lead)',
    protocol: ['Pediatric Crash Cart #1', 'NICU Isolation Gate Lock', 'Pediatric Anesthetist Alert', 'Security Gate Verification'],
    active: false
  },
  {
    code: 'CODE SILVER',
    name: 'Weapon / Facility Security Threat',
    color: 'text-slate-300',
    border: 'border-slate-500/40',
    bgBadge: 'bg-slate-500/20 text-slate-300 border-slate-500/40',
    description: 'Hospital perimeter security breach, active threat or hostage containment.',
    teamLead: 'Armed Quick Response Unit & Police Liaison',
    protocol: ['Full Ward Auto-Lockdown', 'CCTV Lockdown Matrix', 'Emergency Police Broadcast', 'Staff Silent Beacon'],
    active: false
  }
];

export const CrisisCodeBroadcast: React.FC = () => {
  const [codes, setCodes] = useState<EmergencyCode[]>(INITIAL_CODES);
  const [selectedCode, setSelectedCode] = useState<EmergencyCode | null>(null);
  const [locationInput, setLocationInput] = useState('Emergency Trauma Bay 3');
  const [leadInput, setLeadInput] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activeCodesCount = codes.filter(c => c.active).length;

  const handleActivateClick = (code: EmergencyCode) => {
    setSelectedCode(code);
    setLeadInput(code.teamLead);
    setIsModalOpen(true);
  };

  const confirmActivation = () => {
    if (!selectedCode) return;

    if (soundEnabled) {
      playQueueChimeSound();
    }

    setCodes(prev => prev.map(c => {
      if (c.code === selectedCode.code) {
        return {
          ...c,
          active: true,
          activatedAt: 'Just now',
          location: locationInput,
          teamLead: leadInput || c.teamLead
        };
      }
      return c;
    }));

    setIsModalOpen(false);
    setSelectedCode(null);
  };

  const handleDeactivate = (codeStr: string) => {
    setCodes(prev => prev.map(c => {
      if (c.code === codeStr) {
        return {
          ...c,
          active: false,
          activatedAt: undefined,
          location: undefined
        };
      }
      return c;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* Code Broadcast Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-400 animate-pulse">
            <Siren className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Hospital Emergency Code Broadcasting Matrix</h3>
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                activeCodesCount > 0 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}>
                {activeCodesCount > 0 ? `${activeCodesCount} Active Code Broadcast` : 'All Clear / Standby'}
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              One-click multi-department emergency alert dispatch with auto-allocated response teams & chimes
            </p>
          </div>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-2 ${
            soundEnabled 
              ? 'bg-[#0284C7]/20 border-[#38BDF8]/40 text-[#38BDF8]' 
              : 'bg-[#1E293B] border-[#334155] text-[#94A3B8]'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span>{soundEnabled ? 'Siren Chimes: ON' : 'Siren Chimes: MUTED'}</span>
        </button>
      </div>

      {/* Grid of Emergency Codes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {codes.map(c => (
          <div 
            key={c.code}
            className={`bg-[#1E293B] rounded-2xl border p-5 space-y-4 shadow-lg transition-all relative overflow-hidden ${
              c.active 
                ? `${c.border} ring-2 ring-red-500/30 bg-gradient-to-b from-[#1E293B] to-[#0F172A]`
                : 'border-[#334155] hover:border-[#38BDF8]/40'
            }`}
          >
            {/* Active Glow Pulsar */}
            {c.active && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
            )}

            {/* Card Header */}
            <div className="flex items-start justify-between gap-2 border-b border-[#334155] pb-3">
              <div>
                <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full border inline-block ${c.bgBadge}`}>
                  {c.code}
                </span>
                <h4 className="font-extrabold text-white text-sm mt-2">{c.name}</h4>
              </div>

              {c.active ? (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-red-400 bg-red-500/20 border border-red-500/40 px-2 py-1 rounded-full animate-pulse">
                  <Siren className="w-3.5 h-3.5" /> LIVE
                </span>
              ) : (
                <span className="text-[10px] font-bold text-[#94A3B8] bg-[#0F172A] px-2 py-1 rounded-full border border-[#334155]">
                  Standby
                </span>
              )}
            </div>

            <p className="text-xs text-[#94A3B8] leading-relaxed">{c.description}</p>

            {/* Active Details Box if active */}
            {c.active && (
              <div className="bg-[#0F172A] border border-red-500/30 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-red-400 font-bold">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {c.location || 'Hospital Wide'}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {c.activatedAt}
                  </span>
                </div>
                <div className="text-[#38BDF8] text-[11px] font-semibold flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Lead: {c.teamLead}
                </div>
              </div>
            )}

            {/* Protocol Checklist */}
            <div className="space-y-1.5 text-xs">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
                Standard Response Protocol:
              </span>
              <ul className="space-y-1">
                {c.protocol.map((step, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-[11px] text-[#F8FAFC]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8]" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 border-t border-[#334155]">
              {c.active ? (
                <button
                  onClick={() => handleDeactivate(c.code)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> De-escalate & Stand Down
                </button>
              ) : (
                <button
                  onClick={() => handleActivateClick(c)}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                >
                  <Siren className="w-4 h-4" /> Broadcast {c.code}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Code Activation Confirmation Modal */}
      {isModalOpen && selectedCode && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-red-500/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400">
                  <Siren className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Broadcast Emergency {selectedCode.code}</h3>
                  <p className="text-xs text-[#94A3B8]">{selectedCode.name}</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#94A3B8] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#94A3B8] uppercase mb-1">Target Location / Ward</label>
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. Trauma Bay 3, General Ward 2B"
                />
              </div>

              <div>
                <label className="block font-bold text-[#94A3B8] uppercase mb-1">Assigned Incident Team Lead</label>
                <input
                  type="text"
                  value={leadInput}
                  onChange={(e) => setLeadInput(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:ring-2 focus:ring-red-500"
                  placeholder="e.g. Dr. Priya Singh (Trauma Director)"
                />
              </div>

              <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl space-y-1">
                <span className="font-bold text-red-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> Immediate Automated Actions Triggered:
                </span>
                <p className="text-[#94A3B8] text-[11px]">
                  All hospital intercoms, emergency pagers, ICU response teams, and mobile doctor consoles will receive instant audio siren chimes and triage routing directions.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 bg-[#0F172A] hover:bg-[#334155] text-[#94A3B8] hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={confirmActivation}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Siren className="w-4 h-4 animate-bounce" /> Authorize & Broadcast Alert
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
