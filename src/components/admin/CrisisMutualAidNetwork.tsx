import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Truck, 
  Droplet, 
  BedDouble, 
  Wind, 
  PhoneCall, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  RefreshCw, 
  Navigation,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

interface PartnerHospital {
  id: string;
  name: string;
  city: string;
  distance: string;
  driveTime: string;
  icuBedsAvailable: number;
  oxygenSurplus: string;
  oNegativeBlood: number;
  emergencyContact: string;
  status: 'Ready' | 'Busy' | 'Full';
}

const PARTNER_HOSPITALS: PartnerHospital[] = [
  {
    id: 'hosp-brd',
    name: 'BRD Medical College & Nehru Hospital',
    city: 'Gorakhpur',
    distance: '8.4 km',
    driveTime: '18 mins (Green Corridor: 11 mins)',
    icuBedsAvailable: 14,
    oxygenSurplus: '+4,500 LMO (High Surplus)',
    oNegativeBlood: 18,
    emergencyContact: '+91 551 234 5678',
    status: 'Ready'
  },
  {
    id: 'hosp-kgmu',
    name: "King George's Medical University (KGMU)",
    city: 'Lucknow',
    distance: '265 km',
    driveTime: '3.5 hrs (Air Ambulance: 42 mins)',
    icuBedsAvailable: 28,
    oxygenSurplus: '+12,000 LMO',
    oNegativeBlood: 45,
    emergencyContact: '+91 522 225 7450',
    status: 'Ready'
  },
  {
    id: 'hosp-bhu',
    name: 'Institute of Medical Sciences, BHU',
    city: 'Varanasi',
    distance: '195 km',
    driveTime: '3.2 hrs',
    icuBedsAvailable: 9,
    oxygenSurplus: '+3,200 LMO',
    oNegativeBlood: 22,
    emergencyContact: '+91 542 236 8550',
    status: 'Ready'
  },
  {
    id: 'hosp-regency',
    name: 'Regency Super Specialty Hospital',
    city: 'Kanpur',
    distance: '320 km',
    driveTime: '4.8 hrs',
    icuBedsAvailable: 6,
    oxygenSurplus: '+2,100 LMO',
    oNegativeBlood: 12,
    emergencyContact: '+91 512 308 1111',
    status: 'Busy'
  },
  {
    id: 'hosp-aiims',
    name: 'AIIMS Gorakhpur Super Specialty Unit',
    city: 'Gorakhpur',
    distance: '12.6 km',
    driveTime: '22 mins',
    icuBedsAvailable: 21,
    oxygenSurplus: '+8,000 LMO',
    oNegativeBlood: 30,
    emergencyContact: '+91 551 220 5500',
    status: 'Ready'
  }
];

export const CrisisMutualAidNetwork: React.FC = () => {
  const [hospitals, setHospitals] = useState<PartnerHospital[]>(PARTNER_HOSPITALS);
  const [filterCity, setFilterCity] = useState<string>('All');
  const [activeTransferModal, setActiveTransferModal] = useState<PartnerHospital | null>(null);
  const [transferType, setTransferType] = useState<'icu_bed' | 'oxygen_cylinder' | 'blood_unit' | 'green_corridor'>('icu_bed');
  const [patientName, setPatientName] = useState('Critical Trauma Patient #408');
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  const filtered = filterCity === 'All' ? hospitals : hospitals.filter(h => h.city.toLowerCase().includes(filterCity.toLowerCase()));

  const handleOpenTransfer = (hosp: PartnerHospital) => {
    setActiveTransferModal(hosp);
    setTransferSuccess(null);
  };

  const handleConfirmTransfer = () => {
    if (!activeTransferModal) return;
    setTransferSuccess(`✅ Inter-Hospital Emergency Corridor Activated with ${activeTransferModal.name}. GPS Tracker dispatched.`);
    setTimeout(() => {
      setActiveTransferModal(null);
      setTransferSuccess(null);
    }, 2800);
  };

  return (
    <div className="space-y-6">
      
      {/* Mutual Aid Header */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#334155] rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-[#38BDF8]">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Regional Inter-Hospital Mutual Aid Grid</h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-bold">
                5 Hospitals Connected Live
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Live hospital federated network for emergency bed sharing, oxygen diversion & green ambulance corridors
            </p>
          </div>
        </div>

        {/* City Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#94A3B8] font-bold">Filter Hub:</span>
          <select
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="p-2 text-xs rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:ring-2 focus:ring-[#0EA5E9]"
          >
            <option value="All">All Partner Hubs (UP & NCR)</option>
            <option value="Gorakhpur">Gorakhpur Hub</option>
            <option value="Lucknow">Lucknow Hub</option>
            <option value="Varanasi">Varanasi Hub</option>
            <option value="Kanpur">Kanpur Hub</option>
          </select>
        </div>
      </div>

      {/* Grid of Partner Hospitals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(h => (
          <div 
            key={h.id}
            className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-4 shadow-lg hover:border-[#0EA5E9]/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-extrabold text-white text-sm line-clamp-1">{h.name}</h4>
                  <p className="text-xs text-[#94A3B8] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" /> {h.city} • {h.distance}
                  </p>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  h.status === 'Ready' 
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                }`}>
                  {h.status}
                </span>
              </div>

              {/* Transit Time */}
              <div className="bg-[#0F172A] p-2.5 rounded-xl border border-[#334155] text-[11px] text-[#F8FAFC] flex items-center justify-between">
                <span className="text-[#94A3B8] flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#38BDF8]" /> Transit Time:
                </span>
                <span className="font-bold text-white">{h.driveTime}</span>
              </div>

              {/* Resource Reserves Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
                  <span className="text-[10px] text-[#94A3B8] block">ICU Beds</span>
                  <span className="text-[#38BDF8] font-black text-sm">{h.icuBedsAvailable} Free</span>
                </div>
                <div className="bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
                  <span className="text-[10px] text-[#94A3B8] block">O-ve Blood</span>
                  <span className="text-red-400 font-black text-sm">{h.oNegativeBlood} Units</span>
                </div>
                <div className="bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
                  <span className="text-[10px] text-[#94A3B8] block">Oxygen</span>
                  <span className="text-emerald-400 font-black text-[11px] mt-0.5 block">Surplus</span>
                </div>
              </div>

              {/* Emergency Hotline */}
              <div className="text-[11px] text-[#94A3B8] flex items-center justify-between pt-1">
                <span>Emergency Direct Line:</span>
                <span className="font-bold text-white flex items-center gap-1">
                  <PhoneCall className="w-3 h-3 text-[#10B981]" /> {h.emergencyContact}
                </span>
              </div>
            </div>

            {/* Action Dispatch */}
            <div className="pt-2 border-t border-[#334155]">
              <button
                onClick={() => handleOpenTransfer(h)}
                className="w-full py-2.5 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:brightness-110 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" /> Request Mutual Aid Transfer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Transfer Request Modal */}
      {activeTransferModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#0EA5E9]/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 rounded-xl text-[#38BDF8]">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">Dispatch Inter-Hospital Transfer</h3>
                  <p className="text-xs text-[#94A3B8]">{activeTransferModal.name} ({activeTransferModal.city})</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTransferModal(null)}
                className="text-[#94A3B8] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {transferSuccess ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
                <p className="text-sm font-bold text-white">{transferSuccess}</p>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-[#94A3B8] uppercase mb-1">Transfer Request Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTransferType('icu_bed')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        transferType === 'icu_bed' 
                          ? 'bg-[#0284C7] text-white border-[#38BDF8]' 
                          : 'bg-[#0F172A] text-[#94A3B8] border-[#334155]'
                      }`}
                    >
                      🛏️ ICU Bed Transfer
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferType('green_corridor')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        transferType === 'green_corridor' 
                          ? 'bg-[#0284C7] text-white border-[#38BDF8]' 
                          : 'bg-[#0F172A] text-[#94A3B8] border-[#334155]'
                      }`}
                    >
                      🚑 Green Ambulance Corridor
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferType('oxygen_cylinder')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        transferType === 'oxygen_cylinder' 
                          ? 'bg-[#0284C7] text-white border-[#38BDF8]' 
                          : 'bg-[#0F172A] text-[#94A3B8] border-[#334155]'
                      }`}
                    >
                      💨 Oxygen Tank Requisition
                    </button>
                    <button
                      type="button"
                      onClick={() => setTransferType('blood_unit')}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        transferType === 'blood_unit' 
                          ? 'bg-[#0284C7] text-white border-[#38BDF8]' 
                          : 'bg-[#0F172A] text-[#94A3B8] border-[#334155]'
                      }`}
                    >
                      🩸 O-ve Blood Dispatch
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-[#94A3B8] uppercase mb-1">Patient Details / Requisition Note</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:ring-2 focus:ring-[#0EA5E9]"
                    placeholder="Patient name or inventory request..."
                  />
                </div>

                <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] space-y-1">
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Estimated Transit Duration:</span>
                    <span className="text-white font-bold">{activeTransferModal.driveTime}</span>
                  </div>
                  <div className="flex justify-between text-[#94A3B8]">
                    <span>Available Capacity:</span>
                    <span className="text-[#38BDF8] font-bold">{activeTransferModal.icuBedsAvailable} ICU Beds</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => setActiveTransferModal(null)}
                    className="px-4 py-2.5 bg-[#0F172A] hover:bg-[#334155] text-[#94A3B8] hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirmTransfer}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-white text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" /> Authorize & Dispatch Request
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
