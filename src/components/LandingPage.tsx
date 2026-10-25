import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Calendar, 
  Clock, 
  BedDouble, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Sparkles,
  Stethoscope,
  Award,
  Zap,
  FileText,
  Truck,
  Droplet,
  Pill,
  PhoneCall,
  MapPin
} from 'lucide-react';
import { store } from '../lib/store';
import { Doctor, Bed, Token, Ambulance, BloodStock, Medicine } from '../types';
import { LiveAvailabilityDashboard } from './landing/LiveAvailabilityDashboard';
import { NearbyHospitalsMap } from './landing/NearbyHospitalsMap';

interface LandingPageProps {
  onOpenAuth: (defaultRole?: 'login' | 'register' | 'admin') => void;
  onSelectDoctor: (doctor: Doctor) => void;
  setActiveView: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectDoctor,
  setActiveView
}) => {
  const [doctors, setDoctors] = useState<Doctor[]>(store.doctors);
  const [beds, setBeds] = useState<Bed[]>(store.beds);
  const [tokens, setTokens] = useState<Token[]>(store.tokens);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(store.ambulances);
  const [bloodStock, setBloodStock] = useState<BloodStock[]>(store.bloodStock);
  const [medicines, setMedicines] = useState<Medicine[]>(store.medicines);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedCityShowcase, setSelectedCityShowcase] = useState<string>('Varanasi');

  const getCityMetrics = (city: string) => {
    const cityBeds = beds.filter(b => b.city === city);
    const cityDocs = doctors.filter(d => d.city === city);
    return {
      availableBeds: cityBeds.filter(b => b.status === 'Available').length,
      icuBeds: cityBeds.filter(b => b.ward_name === 'ICU' && b.status === 'Available').length,
      doctorsOnDuty: cityDocs.filter(d => d.status === 'Available').length
    };
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setDoctors(store.doctors);
      setBeds(store.beds);
      setTokens(store.tokens);
      setAmbulances(store.ambulances);
      setBloodStock(store.bloodStock);
      setMedicines(store.medicines);
    });
    return unsubscribe;
  }, []);

  const departments = [
    'All',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'Dermatology',
    'Emergency'
  ];

  const filteredDoctors = doctors.filter(doc => {
    const matchesDept = selectedDept === 'All' || doc.department === selectedDept;
    const matchesQuery = doc.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesQuery;
  });

  // Bed counters
  const totalBeds = beds.length;
  const availableBeds = beds.filter(b => b.status === 'Available').length;
  const icuAvailable = beds.filter(b => b.ward_name === 'ICU' && b.status === 'Available').length;
  const emergencyAvailable = beds.filter(b => b.ward_name === 'Emergency' && b.status === 'Available').length;

  // Currently serving token
  const servingTokens = tokens.filter(t => t.status === 'Serving');

  return (
    <div id="landing-page" className="min-h-screen bg-[#0F172A] text-[#F8FAFC] font-sans">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0F172A] via-[#111C35] to-[#0B1120] text-[#F8FAFC] pt-12 pb-20 border-b border-[#334155]/80">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#0284C7]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0284C7]/15 border border-[#38BDF8]/40 text-[#38BDF8] text-xs font-bold shadow-md shadow-[#0284C7]/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#38BDF8] animate-spin" />
                <span className="tracking-wide">AI-Powered Next-Gen Healthcare Management Suite</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                Checkmed<span className="text-gradient-sky"> Hospital</span> Network
              </h1>

              <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
                Unified healthcare operating platform connecting patients with specialist doctors, live OPD queue tokens, real-time ICU/ward bed tracking, digital lab diagnostics, and emergency dispatch.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-book-btn"
                  onClick={() => {
                    store.setRole('patient');
                    setActiveView('patient-portal');
                  }}
                  className="px-7 py-4 bg-gradient-to-r from-[#0284C7] via-[#0EA5E9] to-[#38BDF8] hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-2xl shadow-xl shadow-[#0284C7]/40 ring-2 ring-[#38BDF8]/60 flex items-center gap-3 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Book OPD Appointment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  id="hero-map-btn"
                  onClick={() => {
                    const el = document.getElementById('nearby-hospitals-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-7 py-4 bg-[#0284C7]/20 hover:bg-[#0284C7]/30 text-sky-300 hover:text-white font-black text-xs sm:text-sm rounded-2xl border border-[#38BDF8]/40 hover:border-sky-400 flex items-center gap-3 transition-all cursor-pointer shadow-xl shadow-sky-950/30 ring-1 ring-sky-400/20"
                >
                  <MapPin className="w-4 h-4 text-[#38BDF8] animate-bounce" />
                  <span>Nearby Hospitals (Map)</span>
                </button>

                <button
                  id="hero-explore-btn"
                  onClick={() => {
                    store.setRole('patient');
                    setActiveView('patient-portal');
                  }}
                  className="px-7 py-4 bg-[#1E293B] hover:bg-[#334155] text-white font-black text-xs sm:text-sm rounded-2xl border border-[#334155] hover:border-sky-400 flex items-center gap-3 transition-all cursor-pointer shadow-xl shadow-slate-950/30 ring-1 ring-white/10"
                >
                  <Users className="w-4 h-4 text-sky-400" />
                  <span>Explore Patient Services</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-[#334155]/80">
                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#1E293B]/60 border border-[#334155]">
                  <div className="w-12 h-12 rounded-2xl icon-box-sky flex items-center justify-center text-[#38BDF8] shrink-0">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">50+ Doctors</p>
                    <p className="text-xs text-sky-400 font-semibold">Top Specialists</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#1E293B]/60 border border-[#334155]">
                  <div className="w-12 h-12 rounded-2xl icon-box-emerald flex items-center justify-center text-[#34D399] shrink-0">
                    <BedDouble className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{availableBeds} / {totalBeds} Beds</p>
                    <p className="text-xs text-emerald-400 font-semibold">Live Bed Telemetry</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#1E293B]/60 border border-[#334155]">
                  <div className="w-12 h-12 rounded-2xl icon-box-amber flex items-center justify-center text-[#FBBF24] shrink-0">
                    <Zap className="w-6 h-6 fill-[#FBBF24]/30" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">Live OPD Queue</p>
                    <p className="text-xs text-amber-300 font-semibold">Zero Wait Confusion</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Hero Right Widget: Live OPD Queue Monitor */}
            <div className="lg:col-span-5">
              <div className="bg-[#1E293B]/90 backdrop-blur-xl rounded-3xl p-6 border border-[#38BDF8]/30 shadow-2xl shadow-[#0284C7]/15 relative space-y-5">
                
                <div className="flex items-center justify-between border-b border-[#334155] pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3 h-3 rounded-full bg-[#10B981] animate-ping" />
                    <h3 className="text-sm font-black text-white">Live OPD Queue Telemetry</h3>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#38BDF8] bg-[#0284C7]/20 px-3 py-1 rounded-full border border-[#38BDF8]/40 shadow-sm">
                    SmartCare Display
                  </span>
                </div>

                {/* Serving tokens preview */}
                <div className="space-y-3">
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Currently Serving in OPD Rooms</p>
                  
                  {servingTokens.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {servingTokens.slice(0, 2).map(token => (
                        <div key={token.id} className="bg-[#0F172A] border border-[#0284C7]/40 p-4 rounded-2xl space-y-1.5 shadow-md">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-[#38BDF8] font-black">{token.room_no}</span>
                            <span className="bg-[#0284C7] text-white font-black text-[10px] px-2 py-0.5 rounded-lg shadow-sm">SERVING</span>
                          </div>
                          <p className="text-2xl font-black text-white font-mono tracking-tight">{token.token_number}</p>
                          <p className="text-xs text-slate-200 font-semibold truncate">{token.patient_name}</p>
                          <p className="text-[11px] text-[#38BDF8] font-medium">{token.doctor_name}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#0F172A] p-4 rounded-2xl text-center text-xs text-slate-400 border border-[#334155]">
                      <Clock className="w-5 h-5 mx-auto text-[#38BDF8] mb-1" />
                      OPD Queue is currently clear or on break.
                    </div>
                  )}
                </div>

                {/* Quick Bed Availability Status */}
                <div className="bg-[#0F172A] rounded-2xl p-4 border border-[#334155] space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white font-black flex items-center gap-2">
                      <BedDouble className="w-4 h-4 text-[#10B981]" /> Ward Bed Availability
                    </span>
                    <button 
                      onClick={() => {
                        store.setRole('patient');
                        setActiveView('patient-portal');
                      }} 
                      className="text-[11px] text-[#38BDF8] hover:text-white font-bold cursor-pointer"
                    >
                      View All Wards →
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#1E293B] p-2.5 rounded-xl flex items-center justify-between border border-[#334155]">
                      <span className="text-slate-300 text-[11px] font-medium">ICU Beds</span>
                      <span className={`font-black text-sm ${icuAvailable > 0 ? 'text-[#34D399]' : 'text-rose-400'}`}>
                        {icuAvailable} Free
                      </span>
                    </div>
                    <div className="bg-[#1E293B] p-2.5 rounded-xl flex items-center justify-between border border-[#334155]">
                      <span className="text-slate-300 text-[11px] font-medium">Emergency Beds</span>
                      <span className={`font-black text-sm ${emergencyAvailable > 0 ? 'text-[#34D399]' : 'text-rose-400'}`}>
                        {emergencyAvailable} Free
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    store.setRole('patient');
                    setActiveView('patient-portal');
                  }}
                  className="w-full py-3 bg-[#0284C7]/20 hover:bg-[#0284C7]/30 text-[#38BDF8] hover:text-white border border-[#38BDF8]/40 hover:border-[#38BDF8] text-xs font-black rounded-2xl transition-all text-center cursor-pointer shadow-md"
                >
                  Generate Token & Check Live Queue →
                </button>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Real-Time Regional UP Hospitals Availability Dashboard */}
      <LiveAvailabilityDashboard 
        onSelectDoctor={onSelectDoctor}
        onNavigateToPortal={() => {
          store.setRole('patient');
          setActiveView('patient-portal');
        }}
      />

      {/* 24/7 Emergency Services Section: Ambulances, Blood Bank & Pharmacy */}
      <section className="py-10 bg-[#1E293B]/60 border-y border-[#334155]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* UP Cities Regional Hospitals Showcase */}
          <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#0284C7]/20 border border-[#0284C7]/30 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 flex-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8] text-[11px] font-extrabold uppercase tracking-wider">
                Regional Multi-City Healthcare Network
              </div>
              <h3 className="text-xl md:text-2xl font-black text-[#F8FAFC]">
                Checkmed Uttar Pradesh Hospital Network
              </h3>
              <p className="text-xs text-[#94A3B8] max-w-2xl">
                Click any town to inspect live ICU beds, doctors on duty, and available beds:
              </p>
              
              <div className="flex flex-wrap gap-2.5 pt-1">
                {['Varanasi', 'Lucknow', 'Kanpur', 'Gorakhpur', 'Allahabad (Prayagraj)'].map((cityName) => {
                  const m = getCityMetrics(cityName);
                  const isSelected = selectedCityShowcase === cityName;
                  return (
                    <button
                      key={cityName}
                      onClick={() => setSelectedCityShowcase(cityName)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#0284C7] border-[#38BDF8] text-white shadow-lg shadow-[#0284C7]/30 ring-2 ring-[#38BDF8]/50'
                          : 'bg-[#0F172A] border-[#334155] text-slate-300 hover:bg-[#1E293B] hover:text-white hover:border-[#38BDF8]/50'
                      }`}
                    >
                      <span>📍 {cityName.replace(' (Prayagraj)', '')}</span>
                      <div className="flex items-center gap-1 text-[10px] font-mono">
                        <span className={`px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/30 text-emerald-300' : 'bg-[#1E293B] text-emerald-400'}`}>
                          🛏️ {m.availableBeds}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/30 text-rose-300' : 'bg-[#1E293B] text-rose-400'}`}>
                          🚨 {m.icuBeds} ICU
                        </span>
                        <span className={`px-1.5 py-0.5 rounded ${isSelected ? 'bg-black/30 text-sky-300' : 'bg-[#1E293B] text-sky-300'}`}>
                          🩺 {m.doctorsOnDuty}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Town Live Summary Bar */}
              {selectedCityShowcase && (
                <div className="bg-[#0F172A]/90 border border-[#38BDF8]/40 rounded-xl p-3 flex flex-wrap items-center gap-4 text-xs">
                  <span className="text-[#38BDF8] font-bold">📍 {selectedCityShowcase} Live:</span>
                  <span className="text-emerald-400 font-mono font-bold">🛏️ {getCityMetrics(selectedCityShowcase).availableBeds} Beds Free</span>
                  <span className="text-rose-400 font-mono font-bold">🚨 {getCityMetrics(selectedCityShowcase).icuBeds} ICU Beds Available</span>
                  <span className="text-sky-300 font-mono font-bold">🩺 {getCityMetrics(selectedCityShowcase).doctorsOnDuty} Doctors on Duty</span>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                store.setRole('patient');
                setActiveView('patient-portal');
              }}
              className="px-5 py-3 rounded-xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-xs font-bold transition-all shadow-lg shadow-[#0284C7]/30 shrink-0 cursor-pointer flex items-center gap-2 self-start md:self-center"
            >
              Explore UP Hospitals Directory →
            </button>
          </div>

          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#EF4444] bg-[#EF4444]/10 px-3 py-1 rounded-full border border-[#EF4444]/30">
              Checkmed 24/7 Critical Services
            </span>
            <h2 className="text-2xl font-extrabold text-[#F8FAFC]">
              Emergency Fleet, Blood Bank & In-House Pharmacy
            </h2>
            <p className="text-xs text-[#94A3B8]">
              Live real-time tracking of Checkmed emergency resources, blood group units, and essential medicine inventory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Ambulance Fleet */}
            <div className="bg-gradient-to-b from-[#1E293B] to-[#151F30] border border-rose-500/30 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-rose-500/80 hover:shadow-rose-500/15 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl icon-box-rose flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                    <Truck className="w-6 h-6 animate-pulse" />
                  </div>
                  <span className="text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full shadow-sm">
                    {ambulances.filter(a => a.status === 'Available / Standby').length} Ready Fleet
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-rose-300 transition-colors">Ambulance & Life Support</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    {ambulances.length} Ventilator & ALS/BLS ICU ambulances stationed with live GPS tracking.
                  </p>
                </div>

                <div className="bg-[#0B1120] p-3.5 rounded-2xl border border-[#334155] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Fleet:</span>
                    <span className="font-black text-white">{ambulances.length} Units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Response Time:</span>
                    <span className="font-black text-emerald-400">&lt; 8 Minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Emergency Hotline:</span>
                    <span className="font-black text-rose-400">108 / 1800-CHECKMED</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  store.setRole('patient');
                  setActiveView('patient-portal');
                }}
                className="mt-5 w-full py-3 bg-gradient-to-r from-rose-600 to-rose-500 hover:brightness-110 text-white text-xs font-black rounded-2xl shadow-xl shadow-rose-600/30 ring-1 ring-rose-400/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" /> Request Ambulance / Live GPS
              </button>
            </div>

            {/* Card 2: Blood Bank */}
            <div className="bg-gradient-to-b from-[#1E293B] to-[#151F30] border border-sky-500/30 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-sky-400/80 hover:shadow-sky-500/15 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl icon-box-sky flex items-center justify-center text-sky-400 group-hover:scale-110 transition-transform">
                    <Droplet className="w-6 h-6 fill-sky-400" />
                  </div>
                  <span className="text-xs font-black bg-sky-500/20 text-sky-300 border border-sky-400/40 px-3 py-1 rounded-full shadow-sm">
                    {bloodStock.reduce((acc, c) => acc + c.units_available, 0)} Units Available
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-sky-300 transition-colors">Blood Bank & Plasma Reserves</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Real-time blood stock across A+, B+, O+, AB+ with Fresh Frozen Plasma and Platelet units.
                  </p>
                </div>

                <div className="bg-[#0B1120] p-3.5 rounded-2xl border border-[#334155] text-xs">
                  <p className="text-[10px] uppercase text-slate-400 font-bold mb-2">Group Stock Breakdown:</p>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {bloodStock.slice(0, 4).map(b => (
                      <div key={b.group} className="bg-[#1E293B] p-2 rounded-xl border border-[#334155]">
                        <p className="font-black text-rose-400 text-xs">{b.group}</p>
                        <p className="text-xs font-black text-white mt-0.5">{b.units_available}u</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  store.setRole('patient');
                  setActiveView('patient-portal');
                }}
                className="mt-5 w-full py-3 bg-gradient-to-r from-sky-600 to-sky-500 hover:brightness-110 text-white text-xs font-black rounded-2xl shadow-xl shadow-sky-600/30 ring-1 ring-sky-400/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Droplet className="w-4 h-4" /> Requisition Blood / Stock
              </button>
            </div>

            {/* Card 3: In-House Pharmacy */}
            <div className="bg-gradient-to-b from-[#1E293B] to-[#151F30] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-emerald-400/80 hover:shadow-emerald-500/15 transition-all group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl icon-box-emerald flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <Pill className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-3 py-1 rounded-full shadow-sm">
                    {medicines.filter(m => m.stock_quantity > 0).length} Drugs In Stock
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white group-hover:text-emerald-300 transition-colors">Pharmacy & Medicine Inventory</h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Check stock for cardiac, antibiotic, insulin & OTC drugs. Reserve for rapid counter pickup.
                  </p>
                </div>

                <div className="bg-[#0B1120] p-3.5 rounded-2xl border border-[#334155] text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Popular Medicines:</span>
                    <span className="font-bold text-white">Paracetamol, Insulin, Pan-40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Verification:</span>
                    <span className="font-bold text-emerald-400">100% Quality Certified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Pickup Counter:</span>
                    <span className="font-bold text-sky-400">Ground Floor Bay 2</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  store.setRole('patient');
                  setActiveView('patient-portal');
                }}
                className="mt-5 w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white text-xs font-black rounded-2xl shadow-xl shadow-emerald-600/30 ring-1 ring-emerald-400/40 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Pill className="w-4 h-4" /> Search Medicine Inventory
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Real-time Nearby Hospitals & Clinics Interactive Google Maps Section */}
      <NearbyHospitalsMap />

      {/* Doctor Search & Directory */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[#38BDF8] font-bold text-xs uppercase tracking-wider mb-1">
              <Stethoscope className="w-4 h-4" /> Specialist Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Find Specialist Doctors & OPD Schedule
            </h2>
            <p className="text-xs text-[#94A3B8] mt-1">
              Search by department, specialty, or doctor name to book instant OPD slots.
            </p>
          </div>

          {/* Search bar */}
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search doctor name or specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-[#334155] focus:ring-2 focus:ring-[#0EA5E9] bg-[#1E293B] text-[#F8FAFC] shadow-xs"
            />
          </div>
        </div>

        {/* Department Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {departments.map((dept, index) => {
            const isSelected = selectedDept === dept;
            const colors = [
              { bg: 'from-sky-500 to-blue-600', ring: 'ring-sky-400' },
              { bg: 'from-rose-500 to-pink-600', ring: 'ring-rose-400' },
              { bg: 'from-purple-500 to-indigo-600', ring: 'ring-purple-400' },
              { bg: 'from-emerald-500 to-teal-600', ring: 'ring-emerald-400' },
              { bg: 'from-amber-500 to-orange-600', ring: 'ring-amber-400' },
              { bg: 'from-cyan-500 to-teal-600', ring: 'ring-cyan-400' },
            ];
            const color = colors[index % colors.length];
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all cursor-pointer shadow-sm ${
                  isSelected
                    ? `bg-gradient-to-r ${color.bg} text-white shadow-lg ring-2 ${color.ring} scale-105`
                    : 'bg-[#1E293B] text-slate-300 border border-[#334155] hover:bg-[#334155] hover:text-white'
                }`}
              >
                {dept}
              </button>
            );
          })}
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDoctors.map(doctor => (
            <div 
              key={doctor.id} 
              className="bg-gradient-to-b from-[#1E293B] to-[#121D2F] rounded-3xl border border-[#334155] p-5 shadow-xl hover:border-sky-400/80 hover:shadow-sky-500/15 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={doctor.avatar_url} 
                    alt={doctor.full_name} 
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-sky-400/50 shadow-md ring-2 ring-sky-500/20"
                  />
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-sky-300 bg-sky-500/20 border border-sky-400/40 px-2.5 py-0.5 rounded-md shadow-xs">
                      {doctor.department}
                    </span>
                    <h3 className="text-sm font-black text-white group-hover:text-sky-300 transition-colors mt-1.5 line-clamp-1">
                      {doctor.full_name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium">{doctor.qualification}</p>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs text-slate-300 pt-2 border-t border-[#334155]">
                  <p className="line-clamp-2 text-[11px] text-slate-300 font-medium">
                    {doctor.specialization}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-400">Exp: <strong className="text-white font-bold">{doctor.experience_yrs} yrs</strong></span>
                    <span className="text-slate-400">Fee: <strong className="text-emerald-400 font-black">₹{doctor.consultation_fee}</strong></span>
                  </div>

                  <div className="flex items-center justify-between text-xs bg-[#0B1120] p-2.5 rounded-xl border border-[#334155]">
                    <span className="text-slate-300 font-bold flex items-center gap-1.5 text-[11px]">
                      <Clock className="w-3.5 h-3.5 text-sky-400" /> {doctor.room_no}
                    </span>
                    <span className={`font-black px-2.5 py-0.5 rounded-full text-[10px] ${
                      doctor.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {doctor.status}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  store.setRole('patient');
                  onSelectDoctor(doctor);
                  setActiveView('patient-portal');
                }}
                className="w-full mt-4 py-3 bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:brightness-110 text-white font-black text-xs rounded-2xl shadow-lg shadow-[#0284C7]/30 ring-1 ring-sky-400/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-white" /> Book OPD Slot
              </button>
            </div>
          ))}
        </div>

      </section>

      {/* System Capabilities Section */}
      <section className="bg-[#1E293B] py-16 border-y border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#38BDF8] bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 px-3 py-1 rounded-full">
              Full-Stack Architecture
            </span>
            <h2 className="text-3xl font-extrabold text-[#F8FAFC] mt-3">
              Comprehensive Healthcare Workflow
            </h2>
            <p className="text-xs text-[#94A3B8] mt-2">
              Designed for patients, medical staff, lab technicians, and hospital administrators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] space-y-3 hover:border-[#0EA5E9] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#0EA5E9] text-white flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">1. Patient OPD Self-Service</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Patients register, pick available doctors, select consultation time slots, generate automated token numbers, and monitor their position in the OPD queue live on their mobile screens.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] space-y-3 hover:border-[#10B981] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white flex items-center justify-center">
                <BedDouble className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">2. Ward & Bed Management</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Real-time tracking of ICU, Emergency, General Male/Female, Pediatric, and Deluxe Suite beds. Admins can assign patients to beds, update status, and track daily occupancy rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0F172A] border border-[#334155] space-y-3 hover:border-[#38BDF8] transition-all">
              <div className="w-10 h-10 rounded-xl bg-[#38BDF8] text-slate-950 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#F8FAFC]">3. Lab Reports & Billing</h3>
              <p className="text-xs text-[#94A3B8] leading-relaxed">
                Seamless digital diagnostic lab reports with findings summary and automatic invoice generation for consultation, bed charges, and lab tests with payment status tracking.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* College Hackathon Banner */}
      <section className="bg-[#0F172A] text-[#F8FAFC] py-12 border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Award className="w-5 h-5 text-[#F59E0B]" /> SmartCare Hospital Hackathon Project
            </h3>
            <p className="text-xs text-[#94A3B8]">
              Built with React 19, TypeScript, Tailwind CSS, and Supabase / PostgreSQL backend database.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                store.setRole('patient');
                setActiveView('patient-portal');
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-xs rounded-xl shadow-md hover:brightness-110 transition-all cursor-pointer"
            >
              Enter Patient Portal
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
