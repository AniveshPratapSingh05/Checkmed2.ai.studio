import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Siren, 
  Bed, 
  Droplet, 
  Truck, 
  Star, 
  Search, 
  Filter, 
  Clock, 
  ChevronRight, 
  CheckCircle2, 
  Hospital as HospitalIcon,
  UserCheck,
  Phone,
  Radio,
  Navigation,
  Zap
} from 'lucide-react';
import { store } from '../../lib/store';
import { HospitalRecord, CityName, Department } from '../../types';
import { AmbulanceGpsTracker } from '../AmbulanceGpsTracker';

interface HospitalsDirectoryViewProps {
  onSelectHospitalForBooking?: (hospitalName: string, city: CityName) => void;
  onNavigateToTab?: (tab: string) => void;
}

const CITIES: { name: CityName | 'All'; label: string; iconText: string }[] = [
  { name: 'All', label: 'All Cities', iconText: 'UP' },
  { name: 'Varanasi', label: 'Varanasi', iconText: 'VNS' },
  { name: 'Lucknow', label: 'Lucknow', iconText: 'LKO' },
  { name: 'Kanpur', label: 'Kanpur', iconText: 'KNP' },
  { name: 'Gorakhpur', label: 'Gorakhpur', iconText: 'GKP' },
  { name: 'Allahabad (Prayagraj)', label: 'Allahabad / Prayagraj', iconText: 'ALD' }
];

export const HospitalsDirectoryView: React.FC<HospitalsDirectoryViewProps> = ({
  onSelectHospitalForBooking,
  onNavigateToTab
}) => {
  const [hospitals, setHospitals] = useState<HospitalRecord[]>(store.hospitals);
  const [selectedCity, setSelectedCity] = useState<CityName | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('All');
  const [selectedHospitalForModal, setSelectedHospitalForModal] = useState<HospitalRecord | null>(null);
  const [gpsHospitalModal, setGpsHospitalModal] = useState<HospitalRecord | null>(null);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setHospitals(store.hospitals);
    });
    return unsubscribe;
  }, []);

  const filteredHospitals = hospitals.filter(h => {
    const matchesCity = selectedCity === 'All' || h.city === selectedCity;
    const matchesType = selectedTypeFilter === 'All' || h.type === selectedTypeFilter;
    const matchesSearch = 
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.departments.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCity && matchesType && matchesSearch;
  });

  const totalIcuBeds = filteredHospitals.reduce((acc, h) => acc + h.icu_beds_available, 0);
  const totalAmbulances = filteredHospitals.reduce((acc, h) => acc + h.ambulance_count, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & City Stats */}
      <div className="bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#0284C7]/20 border border-[#334155] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> Multi-City Healthcare Network
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#F8FAFC]">
              Hospitals & Medical Centers Directory
            </h2>
            <p className="text-sm text-[#94A3B8] max-w-2xl">
              Verified records for top government & super speciality hospitals across <span className="text-[#38BDF8] font-bold">Varanasi, Lucknow, Kanpur, Gorakhpur, and Allahabad (Prayagraj)</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 bg-[#0F172A]/80 p-4 rounded-xl border border-[#334155]/80 min-w-[240px]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#0284C7]/20 text-[#38BDF8]">
                <Bed className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold">Available ICU Beds</p>
                <p className="text-xl font-black text-white">{totalIcuBeds}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-[#EF4444]/20 text-[#EF4444]">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-[#94A3B8] uppercase font-bold">Active Ambulances</p>
                <p className="text-xl font-black text-white">{totalAmbulances}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* City Selector Tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-[#334155]">
        {CITIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedCity(c.name)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedCity === c.name
                ? 'bg-[#0284C7] text-white shadow-lg shadow-[#0284C7]/25 ring-2 ring-[#38BDF8]'
                : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#334155] hover:text-white border border-[#334155]'
            }`}
          >
            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-black uppercase ${
              selectedCity === c.name ? 'bg-white/20 text-white' : 'bg-[#0F172A] text-[#38BDF8]'
            }`}>
              {c.iconText}
            </span>
            {c.label}
          </button>
        ))}
      </div>

      {/* Search & Type Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Search hospital name, address or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#1E293B] text-sm text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#0284C7]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#94A3B8]" />
          <span className="text-xs text-[#94A3B8] font-bold">Category:</span>
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="p-2.5 rounded-xl border border-[#334155] bg-[#1E293B] text-xs text-[#F8FAFC] focus:outline-none focus:border-[#0284C7]"
          >
            <option value="All">All Categories</option>
            <option value="Government">Government</option>
            <option value="Medical College">Medical College</option>
            <option value="Super Speciality">Super Speciality</option>
            <option value="Multispeciality">Multispeciality</option>
          </select>
        </div>
      </div>

      {/* Hospital Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hospital) => (
          <div 
            key={hospital.id}
            className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden hover:border-[#0284C7]/60 transition-all shadow-lg flex flex-col group"
          >
            {/* Header Image & Badges */}
            <div className="relative h-44 w-full overflow-hidden bg-[#0F172A]">
              <img 
                src={hospital.image_url} 
                alt={hospital.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-black/40" />

              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-md bg-[#0284C7] text-white text-[10px] font-bold tracking-wide uppercase shadow-md">
                  {hospital.city}
                </span>
                <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-xs text-[#38BDF8] border border-[#38BDF8]/30 text-[10px] font-bold">
                  {hospital.type}
                </span>
              </div>

              {hospital.is_24_7_emergency && (
                <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#EF4444] text-white text-[10px] font-extrabold uppercase shadow-md animate-pulse">
                  <Siren className="w-3 h-3" /> 24/7 Emergency
                </div>
              )}

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                <div className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md text-[#F59E0B] font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" /> {hospital.rating} / 5.0
                </div>
                <div className="text-[11px] font-medium text-[#CBD5E1] bg-black/60 px-2 py-0.5 rounded-md">
                  Capacity: {hospital.total_beds} Beds
                </div>
              </div>
            </div>

            {/* Hospital Content Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                  {hospital.name}
                </h3>
                <p className="text-xs text-[#94A3B8] flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#0284C7] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{hospital.address}</span>
                </p>
              </div>

              {/* Resource Summary Pill Grid */}
              <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#334155]/70 text-center">
                <div className="p-2 rounded-lg bg-[#0F172A]">
                  <p className="text-[9px] font-bold uppercase text-[#94A3B8]">ICU Beds</p>
                  <p className="text-sm font-extrabold text-[#38BDF8]">{hospital.icu_beds_available}</p>
                </div>
                <div className="p-2 rounded-lg bg-[#0F172A]">
                  <p className="text-[9px] font-bold uppercase text-[#94A3B8]">Blood Bank</p>
                  <p className={`text-xs font-bold ${
                    hospital.blood_bank_status === 'Adequate' ? 'text-[#10B981]' : 'text-[#F59E0B]'
                  }`}>
                    {hospital.blood_bank_status}
                  </p>
                </div>
                <div 
                  onClick={() => setGpsHospitalModal(hospital)}
                  className="p-2 rounded-lg bg-[#0F172A] hover:bg-[#EF4444]/20 border border-transparent hover:border-[#EF4444]/50 cursor-pointer transition-all group/amb text-center"
                  title="Click to track & book ambulance with GPS"
                >
                  <p className="text-[9px] font-bold uppercase text-[#94A3B8] group-hover/amb:text-[#EF4444]">Ambulances</p>
                  <p className="text-sm font-extrabold text-[#EF4444] flex items-center justify-center gap-1">
                    <Truck className="w-3.5 h-3.5" /> {hospital.ambulance_count}
                  </p>
                </div>
              </div>

              {/* Key Departments */}
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Key Departments</p>
                <div className="flex flex-wrap gap-1">
                  {hospital.departments.slice(0, 4).map((dept, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-[#0F172A] border border-[#334155] text-[#CBD5E1] text-[10px] font-medium">
                      {dept}
                    </span>
                  ))}
                  {hospital.departments.length > 4 && (
                    <span className="px-2 py-0.5 rounded-md bg-[#0F172A] text-[#94A3B8] text-[10px]">
                      +{hospital.departments.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Emergency Hotline & Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button 
                  onClick={() => setGpsHospitalModal(hospital)}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-[#EF4444]/20"
                >
                  <Navigation className="w-3.5 h-3.5" /> Book Ambulance (GPS Nav)
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedHospitalForModal(hospital)}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => {
                      if (onNavigateToTab) onNavigateToTab('appointments');
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all cursor-pointer shadow-md"
                  >
                    Book Doctor <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredHospitals.length === 0 && (
        <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-[#334155]">
          <HospitalIcon className="w-12 h-12 text-[#64748B] mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Hospital Records Found</h3>
          <p className="text-xs text-[#94A3B8] mt-1">Try switching the city filter or clearing search keywords.</p>
        </div>
      )}

      {/* Detailed Hospital Modal */}
      {selectedHospitalForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#1E293B] text-[#F8FAFC] w-full max-w-xl rounded-2xl border border-[#334155] p-6 space-y-5 shadow-2xl my-8">
            <div className="flex items-start justify-between border-b border-[#334155] pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-[#0284C7] text-white text-[10px] font-bold uppercase">
                  {selectedHospitalForModal.city} • {selectedHospitalForModal.type}
                </span>
                <h3 className="text-xl font-bold text-[#F8FAFC] mt-1">
                  {selectedHospitalForModal.name}
                </h3>
                <p className="text-xs text-[#94A3B8] flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0284C7]" /> {selectedHospitalForModal.address}
                </p>
              </div>
              <button 
                onClick={() => setSelectedHospitalForModal(null)}
                className="text-[#94A3B8] hover:text-white text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Total Beds</p>
                <p className="text-lg font-black text-white">{selectedHospitalForModal.total_beds}</p>
              </div>
              <div className="p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Available ICU</p>
                <p className="text-lg font-black text-[#38BDF8]">{selectedHospitalForModal.icu_beds_available}</p>
              </div>
              <div className="p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Blood Bank</p>
                <p className="text-xs font-bold text-[#10B981] mt-1">{selectedHospitalForModal.blood_bank_status}</p>
              </div>
              <div className="p-3 bg-[#0F172A] rounded-xl border border-[#334155]">
                <p className="text-[10px] text-[#94A3B8] font-bold uppercase">Ambulances</p>
                <p className="text-lg font-black text-[#EF4444]">{selectedHospitalForModal.ambulance_count}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#94A3B8] uppercase">Departments & Specialities</h4>
              <div className="flex flex-wrap gap-2">
                {selectedHospitalForModal.departments.map((dept, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-[#0F172A] border border-[#334155] text-xs font-semibold text-[#38BDF8]">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-[#0F172A] p-4 rounded-xl space-y-2 text-xs border border-[#334155]">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Reception Phone:</span>
                <span className="font-bold text-white">{selectedHospitalForModal.contact_number}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] flex items-center gap-1.5"><Siren className="w-3.5 h-3.5 text-[#EF4444]" /> Emergency Line:</span>
                <span className="font-bold text-[#EF4444]">{selectedHospitalForModal.emergency_hotline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-[#10B981]" /> Operating Hours:</span>
                <span className="font-bold text-[#10B981]">24x7 Emergency & Trauma Services</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 flex-wrap">
              <button
                onClick={() => setSelectedHospitalForModal(null)}
                className="px-4 py-2 bg-[#334155] text-[#94A3B8] hover:text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const target = selectedHospitalForModal;
                  setSelectedHospitalForModal(null);
                  setGpsHospitalModal(target);
                }}
                className="px-4 py-2 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                <Truck className="w-4 h-4" /> Book Ambulance (GPS Nav)
              </button>
              <a
                href={`tel:${selectedHospitalForModal.emergency_hotline}`}
                className="px-4 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-lg shadow-[#EF4444]/20"
              >
                <PhoneCall className="w-4 h-4" /> Dial Hotline
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Live GPS Navigation & Ambulance Booking Modal Overlay */}
      {gpsHospitalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-5xl my-auto relative">
            <AmbulanceGpsTracker 
              selectedCity={gpsHospitalModal.city}
              preselectedHospital={gpsHospitalModal.name}
              autoOpenBookingModal={true}
              onClose={() => setGpsHospitalModal(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
