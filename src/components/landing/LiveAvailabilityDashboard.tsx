import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  BedDouble, 
  Stethoscope, 
  Truck, 
  Droplet, 
  PhoneCall, 
  CheckCircle2, 
  Activity, 
  Search, 
  Siren, 
  Phone,
  ShieldCheck,
  ChevronRight,
  UserCheck,
  Star
} from 'lucide-react';
import { store } from '../../lib/store';
import { HospitalRecord, Doctor, Bed, Ambulance, BloodStock, CityName } from '../../types';

interface LiveAvailabilityDashboardProps {
  onSelectDoctor?: (doctor: Doctor) => void;
  onNavigateToPortal?: () => void;
}

const CITIES: { id: CityName | 'All'; name: string; tag: string; badgeColor: string }[] = [
  { id: 'All', name: 'All UP Cities', tag: 'UP Network', badgeColor: 'bg-[#0284C7]' },
  { id: 'Gorakhpur', name: 'Gorakhpur', tag: 'BRD & AIIMS', badgeColor: 'bg-[#0EA5E9]' },
  { id: 'Varanasi', name: 'Varanasi', tag: 'BHU & Heritage', badgeColor: 'bg-[#8B5CF6]' },
  { id: 'Lucknow', name: 'Lucknow', tag: 'KGMU & Medanta', badgeColor: 'bg-[#10B981]' },
  { id: 'Allahabad (Prayagraj)', name: 'Allahabad (Prayagraj)', tag: 'SRN & Nazareth', badgeColor: 'bg-[#F59E0B]' },
  { id: 'Kanpur', name: 'Kanpur', tag: 'GSVM & Regency', badgeColor: 'bg-[#EC4899]' },
];

export const LiveAvailabilityDashboard: React.FC<LiveAvailabilityDashboardProps> = ({
  onSelectDoctor,
  onNavigateToPortal
}) => {
  const [selectedCity, setSelectedCity] = useState<CityName | 'All'>('All');
  const [resourceCategory, setResourceCategory] = useState<'overview' | 'beds' | 'doctors' | 'ambulances' | 'blood' | 'hospitals'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  const hospitals = store.hospitals;
  const doctors = store.doctors;
  const beds = store.beds;
  const ambulances = store.ambulances;
  const bloodStock = store.bloodStock;

  // Filtered dataset according to selected city
  const filteredHospitals = hospitals.filter(h => 
    (selectedCity === 'All' || h.city === selectedCity) &&
    (h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredDoctors = doctors.filter(d => 
    (selectedCity === 'All' || d.city === selectedCity) &&
    (d.full_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
     d.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
     d.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (d.hospital_name && d.hospital_name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredBeds = beds.filter(b => 
    (selectedCity === 'All' || b.city === selectedCity) &&
    (b.bed_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
     b.ward_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (b.hospital_name && b.hospital_name.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const filteredAmbulances = ambulances.filter(a => 
    (selectedCity === 'All' || a.city === selectedCity) &&
    (a.vehicle_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
     a.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (a.hospital_name && a.hospital_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
     a.location.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Aggregate stats for current filter
  const cityHospitalsCount = filteredHospitals.length;
  const totalAvailableBeds = filteredBeds.filter(b => b.status === 'Available').length;
  const icuAvailableBeds = filteredBeds.filter(b => b.ward_name === 'ICU' && b.status === 'Available').length;
  const availableDoctorsCount = filteredDoctors.filter(d => d.status === 'Available').length;
  const readyAmbulancesCount = filteredAmbulances.filter(a => a.status === 'Available / Standby').length;
  const totalBloodUnits = bloodStock.reduce((acc, curr) => acc + curr.units_available, 0);

  return (
    <section className="py-12 bg-[#0B132B] border-y border-[#334155]/80 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0284C7]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#EF4444]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 animate-pulse text-[#38BDF8]" />
              Live Healthcare Command Center
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#F8FAFC]">
              Hospital Availability Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl">
              Real-time available <strong className="text-white">Beds</strong>, <strong className="text-white">Doctors</strong>, <strong className="text-white">Ambulances</strong>, and <strong className="text-white">Blood Stock</strong> across top government and private medical centers in <strong className="text-[#38BDF8]">Gorakhpur, Varanasi, Lucknow, Allahabad & Kanpur</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-xl border border-[#10B981]/30">
              Live System Telemetry Active
            </span>
          </div>
        </div>

        {/* City Filter Selection Tabs */}
        <div className="bg-[#1E293B] p-2.5 rounded-2xl border border-[#334155] shadow-lg">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] px-3 shrink-0 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#0284C7]" /> Select City:
            </span>
            {CITIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCity(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                  selectedCity === c.id
                    ? 'bg-[#0284C7] text-white shadow-lg shadow-[#0284C7]/30 ring-2 ring-[#38BDF8]'
                    : 'bg-[#0F172A] text-[#94A3B8] hover:bg-[#334155] hover:text-white border border-[#334155]'
                }`}
              >
                <span>{c.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase text-white ${c.badgeColor}`}>
                  {c.tag}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Aggregate Live Counter Tiles for Selected City */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          <div 
            onClick={() => setResourceCategory('beds')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              resourceCategory === 'beds'
                ? 'bg-gradient-to-br from-[#0284C7]/30 to-[#0F172A] border-[#38BDF8] ring-2 ring-[#38BDF8]/40 shadow-xl shadow-[#0284C7]/20'
                : 'bg-[#1E293B] border-[#334155] hover:border-[#38BDF8]/70 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Live Beds</span>
              <div className="w-10 h-10 rounded-2xl icon-box-sky flex items-center justify-center text-[#38BDF8]">
                <BedDouble className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono">{totalAvailableBeds}</p>
            <p className="text-xs text-[#38BDF8] font-bold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-ping" />
              {icuAvailableBeds} ICU Beds Free
            </p>
          </div>

          <div 
            onClick={() => setResourceCategory('doctors')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              resourceCategory === 'doctors'
                ? 'bg-gradient-to-br from-[#10B981]/30 to-[#0F172A] border-[#34D399] ring-2 ring-[#34D399]/40 shadow-xl shadow-[#10B981]/20'
                : 'bg-[#1E293B] border-[#334155] hover:border-[#34D399]/70 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">OPD Doctors</span>
              <div className="w-10 h-10 rounded-2xl icon-box-emerald flex items-center justify-center text-[#34D399]">
                <Stethoscope className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono">{availableDoctorsCount}</p>
            <p className="text-xs text-emerald-400 font-bold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              On Duty Consultation
            </p>
          </div>

          <div 
            onClick={() => setResourceCategory('ambulances')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              resourceCategory === 'ambulances'
                ? 'bg-gradient-to-br from-[#EF4444]/30 to-[#0F172A] border-rose-400 ring-2 ring-rose-400/40 shadow-xl shadow-rose-500/20'
                : 'bg-[#1E293B] border-[#334155] hover:border-rose-400/70 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Ambulances</span>
              <div className="w-10 h-10 rounded-2xl icon-box-rose flex items-center justify-center text-rose-400">
                <Truck className="w-5 h-5 animate-pulse" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono">{readyAmbulancesCount}</p>
            <p className="text-xs text-rose-400 font-bold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              Standby & Ventilators
            </p>
          </div>

          <div 
            onClick={() => setResourceCategory('blood')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer ${
              resourceCategory === 'blood'
                ? 'bg-gradient-to-br from-[#F59E0B]/30 to-[#0F172A] border-[#FBBF24] ring-2 ring-[#FBBF24]/40 shadow-xl shadow-[#F59E0B]/20'
                : 'bg-[#1E293B] border-[#334155] hover:border-[#FBBF24]/70 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Blood Units</span>
              <div className="w-10 h-10 rounded-2xl icon-box-amber flex items-center justify-center text-[#FBBF24]">
                <Droplet className="w-5 h-5 fill-[#FBBF24]/40" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono">{totalBloodUnits}</p>
            <p className="text-xs text-amber-300 font-bold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              8 Groups in Bank
            </p>
          </div>

          <div 
            onClick={() => setResourceCategory('hospitals')}
            className={`p-5 rounded-3xl border transition-all cursor-pointer col-span-2 sm:col-span-1 ${
              resourceCategory === 'hospitals'
                ? 'bg-gradient-to-br from-[#8B5CF6]/30 to-[#0F172A] border-purple-400 ring-2 ring-purple-400/40 shadow-xl shadow-purple-500/20'
                : 'bg-[#1E293B] border-[#334155] hover:border-purple-400/70 hover:shadow-lg'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider">Hospitals</span>
              <div className="w-10 h-10 rounded-2xl icon-box-purple flex items-center justify-center text-purple-300">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-white font-mono">{cityHospitalsCount}</p>
            <p className="text-xs text-purple-300 font-bold mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              Govt & Speciality
            </p>
          </div>

        </div>

        {/* View Segment Selector & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#334155]/80 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
            {[
              { id: 'overview', label: '📊 All-In-One Overview' },
              { id: 'beds', label: '🛏️ Live Beds Availability' },
              { id: 'doctors', label: '👨‍⚕️ Doctors On Duty' },
              { id: 'ambulances', label: '🚑 Emergency Ambulances' },
              { id: 'blood', label: '🩸 Blood Bank Reserves' },
              { id: 'hospitals', label: '🏥 Hospital Directory' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setResourceCategory(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                  resourceCategory === tab.id
                    ? 'bg-[#0284C7] text-white shadow-lg shadow-[#0284C7]/40 ring-1 ring-[#38BDF8]/60'
                    : 'bg-[#1E293B] text-slate-300 hover:bg-[#334155] hover:text-white border border-[#334155]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80 shrink-0">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#38BDF8]" />
            <input
              type="text"
              placeholder="Search hospital, doctor, bed or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-2xl border border-[#38BDF8]/40 bg-[#0F172A] text-white placeholder-slate-400 focus:outline-none focus:border-[#38BDF8] focus:ring-1 focus:ring-[#38BDF8] shadow-inner font-medium"
            />
          </div>
        </div>

        {/* OVERVIEW / BEDS VIEW */}
        {(resourceCategory === 'overview' || resourceCategory === 'beds') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BedDouble className="w-4 h-4 text-[#38BDF8]" />
                Ward & ICU Beds Availability ({selectedCity === 'All' ? 'All UP Cities' : selectedCity})
              </h3>
              <span className="text-xs text-[#94A3B8]">Showing {filteredBeds.length} Registered Beds</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBeds.map(bed => (
                <div 
                  key={bed.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    bed.status === 'Available'
                      ? 'bg-[#1E293B] border-[#10B981]/40 hover:border-[#10B981]'
                      : 'bg-[#1E293B]/70 border-[#334155]'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-[#0F172A] text-[#38BDF8] border border-[#334155]">
                        {bed.ward_name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        bed.status === 'Available' 
                          ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40' 
                          : 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                      }`}>
                        {bed.status}
                      </span>
                    </div>

                    <div>
                      <p className="text-lg font-black text-white font-mono">{bed.bed_number}</p>
                      <p className="text-xs text-[#94A3B8] font-medium">{bed.bed_type}</p>
                    </div>

                    {bed.hospital_name && (
                      <p className="text-[11px] text-[#38BDF8] font-bold line-clamp-1 flex items-center gap-1 pt-1 border-t border-[#334155]/60">
                        <Building2 className="w-3 h-3 shrink-0" /> {bed.hospital_name} ({bed.city})
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-[#334155]/60 flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">₹{bed.price_per_day} / day</span>
                    <button
                      onClick={onNavigateToPortal}
                      className="text-[#38BDF8] hover:underline font-bold text-[11px] cursor-pointer"
                    >
                      Book Bed →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DOCTORS VIEW */}
        {(resourceCategory === 'overview' || resourceCategory === 'doctors') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-[#10B981]" />
                OPD Doctors On Duty ({selectedCity === 'All' ? 'All UP Cities' : selectedCity})
              </h3>
              <span className="text-xs text-[#94A3B8]">Showing {filteredDoctors.length} Specialists</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredDoctors.map(doctor => (
                <div 
                  key={doctor.id}
                  className="bg-[#1E293B] border border-[#334155] p-4 rounded-2xl hover:border-[#10B981]/60 transition-all space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={doctor.avatar_url} 
                        alt={doctor.full_name} 
                        className="w-12 h-12 rounded-xl object-cover border border-[#334155]"
                      />
                      <div>
                        <span className="text-[9px] font-bold uppercase text-[#38BDF8] bg-[#0284C7]/20 px-2 py-0.5 rounded">
                          {doctor.department}
                        </span>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{doctor.full_name}</h4>
                        <p className="text-[10px] text-[#94A3B8]">{doctor.qualification}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      {doctor.hospital_name && (
                        <p className="text-[11px] text-[#38BDF8] font-bold line-clamp-1 flex items-center gap-1">
                          <Building2 className="w-3 h-3 shrink-0" /> {doctor.hospital_name}
                        </p>
                      )}
                      <p className="text-[11px] text-[#94A3B8] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0284C7] shrink-0" /> {doctor.city} • Room: {doctor.room_no}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#334155] flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Fee: ₹{doctor.consultation_fee}</span>
                    <button
                      onClick={() => {
                        if (onSelectDoctor) onSelectDoctor(doctor);
                        if (onNavigateToPortal) onNavigateToPortal();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Book OPD
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AMBULANCES VIEW */}
        {(resourceCategory === 'overview' || resourceCategory === 'ambulances') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#EF4444]" />
                Emergency Ambulances ({selectedCity === 'All' ? 'All UP Cities' : selectedCity})
              </h3>
              <span className="text-xs text-[#94A3B8]">{filteredAmbulances.length} Units Fleet</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAmbulances.map(amb => (
                <div key={amb.id} className="bg-[#1E293B] border border-[#334155] p-4 rounded-2xl hover:border-[#EF4444]/60 transition-all space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-sm font-extrabold text-white bg-[#0F172A] px-2.5 py-1 rounded-lg border border-[#334155]">
                      {amb.vehicle_no}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      amb.status === 'Available / Standby' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                    }`}>
                      {amb.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <p className="font-bold text-[#F8FAFC]">{amb.type}</p>
                    <p className="text-[#38BDF8] font-bold text-[11px]">🏥 {amb.hospital_name} ({amb.city})</p>
                    <p className="text-[#94A3B8] flex items-center gap-1 text-[11px]">
                      <MapPin className="w-3 h-3 text-[#EF4444]" /> Station: {amb.location}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8]">Driver: {amb.driver_name}</span>
                    <a
                      href={`tel:${amb.driver_phone}`}
                      className="px-3 py-1 rounded-lg bg-[#EF4444]/20 hover:bg-[#EF4444]/40 text-[#EF4444] font-bold text-[11px] flex items-center gap-1 cursor-pointer border border-[#EF4444]/40"
                    >
                      <PhoneCall className="w-3 h-3" /> Call
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BLOOD BANK VIEW */}
        {(resourceCategory === 'overview' || resourceCategory === 'blood') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Droplet className="w-4 h-4 text-[#EF4444] fill-current" />
                Blood Bank Reserves & Plasma Stock ({selectedCity === 'All' ? 'All UP Cities' : selectedCity})
              </h3>
              <span className="text-xs text-[#94A3B8]">Central Regional Repository</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
              {bloodStock.map(b => (
                <div key={b.group} className="bg-[#1E293B] border border-[#334155] p-3 rounded-2xl text-center space-y-1">
                  <span className="text-lg font-black text-[#EF4444] font-mono">{b.group}</span>
                  <p className="text-sm font-extrabold text-white">{b.units_available} <span className="text-[10px] text-[#94A3B8] font-normal">units</span></p>
                  <p className="text-[10px] text-[#94A3B8]">Plasma: {b.plasma_units}u</p>
                  <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                    b.status === 'Adequate' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#EF4444]/20 text-[#EF4444]'
                  }`}>
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOSPITALS DIRECTORY OVERVIEW */}
        {(resourceCategory === 'overview' || resourceCategory === 'hospitals') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#8B5CF6]" />
                Registered Hospitals Directory ({selectedCity === 'All' ? 'All UP Cities' : selectedCity})
              </h3>
              <span className="text-xs text-[#94A3B8]">{filteredHospitals.length} Super Speciality Centers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHospitals.map(h => (
                <div key={h.id} className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden hover:border-[#0284C7]/60 transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-36 w-full bg-[#0F172A]">
                      <img src={h.image_url} alt={h.name} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-black/40" />
                      <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded bg-[#0284C7] text-white text-[10px] font-bold">
                        {h.city} • {h.type}
                      </span>
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded text-[11px] text-[#F59E0B] font-bold">
                        <Star className="w-3 h-3 fill-current" /> {h.rating} / 5.0
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="text-sm font-bold text-white line-clamp-1">{h.name}</h4>
                        <p className="text-[11px] text-[#94A3B8] flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-[#0284C7] shrink-0" /> {h.address}
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-xs py-2 border-y border-[#334155]">
                        <div className="p-1.5 rounded bg-[#0F172A]">
                          <p className="text-[9px] text-[#94A3B8]">ICU Free</p>
                          <p className="font-extrabold text-[#38BDF8]">{h.icu_beds_available}</p>
                        </div>
                        <div className="p-1.5 rounded bg-[#0F172A]">
                          <p className="text-[9px] text-[#94A3B8]">Total Beds</p>
                          <p className="font-extrabold text-white">{h.total_beds}</p>
                        </div>
                        <div className="p-1.5 rounded bg-[#0F172A]">
                          <p className="text-[9px] text-[#94A3B8]">Ambulances</p>
                          <p className="font-extrabold text-[#EF4444]">{h.ambulance_count}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <a
                      href={`tel:${h.emergency_hotline}`}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#EF4444]/15 hover:bg-[#EF4444]/30 text-[#EF4444] border border-[#EF4444]/30 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Siren className="w-3.5 h-3.5" /> Emergency: {h.emergency_hotline}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
