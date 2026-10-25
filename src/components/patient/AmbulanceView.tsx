import React, { useState } from 'react';
import { Truck, Phone, MapPin, ShieldAlert, CheckCircle2, Clock, Wrench, Search, Radio, Navigation, PhoneCall } from 'lucide-react';
import { Ambulance } from '../../types';
import { store } from '../../lib/store';
import { AmbulanceGpsTracker } from '../AmbulanceGpsTracker';
import { AmbulanceDriverCallModal } from './AmbulanceDriverCallModal';

interface AmbulanceViewProps {
  ambulances: Ambulance[];
  onBackToDashboard?: () => void;
}

export const AmbulanceView: React.FC<AmbulanceViewProps> = ({ ambulances, onBackToDashboard }) => {
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Emergency request modal state
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [patientName, setPatientName] = useState(store.currentUser?.full_name || '');
  const [contactPhone, setContactPhone] = useState(store.currentUser?.phone || '');
  const [pickupAddress, setPickupAddress] = useState('');
  const [emergencyReason, setEmergencyReason] = useState('Cardiac / Chest Pain');
  const [dispatchResult, setDispatchResult] = useState<Ambulance | null>(null);

  // Driver Call State
  const [selectedAmbulanceForCall, setSelectedAmbulanceForCall] = useState<Ambulance | null>(null);
  const [isDriverCallModalOpen, setIsDriverCallModalOpen] = useState<boolean>(false);

  const availableCount = ambulances.filter(a => a.status === 'Available / Standby').length;
  const dutyCount = ambulances.filter(a => a.status === 'On Emergency Duty').length;
  const maintenanceCount = ambulances.filter(a => a.status === 'In Maintenance').length;

  const filteredAmbulances = ambulances.filter(amb => {
    const matchesType = filterType === 'All' || amb.type.includes(filterType);
    const matchesSearch = amb.vehicle_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          amb.driver_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          amb.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleDispatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupAddress) return;

    const dispatched = store.requestEmergencyAmbulance(patientName || 'Emergency Patient', pickupAddress);
    if (dispatched) {
      setDispatchResult(dispatched);
    } else {
      alert('All ambulances are currently on duty. Our helpline (+91 1800-CHECKMED) is dispatching a partner unit!');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Quick Metrics */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#EF4444] text-xs font-bold uppercase tracking-wider">
              <Truck className="w-4 h-4 animate-bounce" /> Checkmed 24/7 Emergency Fleet
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">Ambulance & Life Support Services</h2>
            <p className="text-xs text-[#94A3B8]">
              Advanced ventilator & ICU-equipped emergency response fleet stationed across the city.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:108"
              className="px-5 py-3 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#EF4444]/20 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
            >
              <Phone className="w-4 h-4 animate-pulse" /> Emergency Helpline: 108 / 1800-CHECKMED
            </a>
            
            <button
              onClick={() => {
                setDispatchResult(null);
                setIsDispatchModalOpen(true);
              }}
              className="px-4 py-3 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <Radio className="w-4 h-4" /> Request Ambulance Online
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0F172A] border border-[#334155] p-4 rounded-xl">
            <p className="text-[11px] text-[#94A3B8] font-medium uppercase">Total Fleet Size</p>
            <p className="text-2xl font-black text-[#F8FAFC] mt-1">{ambulances.length} Units</p>
            <p className="text-[10px] text-[#38BDF8] mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Fully Equipped
            </p>
          </div>

          <div className="bg-[#0F172A] border border-[#10B981]/30 p-4 rounded-xl">
            <p className="text-[11px] text-[#10B981] font-medium uppercase">Ready / Available</p>
            <p className="text-2xl font-black text-[#10B981] mt-1">{availableCount} Units</p>
            <p className="text-[10px] text-[#10B981]/80 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Dispatch in &lt; 3 Mins
            </p>
          </div>

          <div className="bg-[#0F172A] border border-[#38BDF8]/30 p-4 rounded-xl">
            <p className="text-[11px] text-[#38BDF8] font-medium uppercase">On Emergency Duty</p>
            <p className="text-2xl font-black text-[#38BDF8] mt-1">{dutyCount} Units</p>
            <p className="text-[10px] text-[#38BDF8]/80 mt-1 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-pulse" /> Live Tracking Active
            </p>
          </div>

          <div className="bg-[#0F172A] border border-[#334155] p-4 rounded-xl">
            <p className="text-[11px] text-[#F59E0B] font-medium uppercase">In Maintenance</p>
            <p className="text-2xl font-black text-[#F59E0B] mt-1">{maintenanceCount} Unit</p>
            <p className="text-[10px] text-[#94A3B8] mt-1 flex items-center gap-1">
              <Wrench className="w-3 h-3" /> Regular Servicing
            </p>
          </div>
        </div>
      </div>

      {/* Live Satellite GPS Tracker Panel */}
      <AmbulanceGpsTracker onClose={onBackToDashboard} />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search vehicle no, driver, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-hidden focus:border-[#0EA5E9]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['All', 'ICU', 'Advanced', 'Basic', 'Neonatal'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                filterType === type
                  ? 'bg-[#0EA5E9] text-white'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:text-[#F8FAFC]'
              }`}
            >
              {type === 'All' ? 'All Types' : `${type} Ambulance`}
            </button>
          ))}
        </div>
      </div>

      {/* Ambulance List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredAmbulances.map((amb) => {
          const isAvailable = amb.status === 'Available / Standby';
          const isOnDuty = amb.status === 'On Emergency Duty';

          return (
            <div
              key={amb.id}
              className={`bg-[#1E293B] rounded-2xl p-5 border transition-all ${
                isAvailable
                  ? 'border-[#10B981]/40 hover:border-[#10B981]'
                  : isOnDuty
                  ? 'border-[#0EA5E9]/40 hover:border-[#0EA5E9]'
                  : 'border-[#334155] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono font-bold text-[#38BDF8] bg-[#0EA5E9]/10 px-2.5 py-1 rounded-md border border-[#0EA5E9]/20">
                  {amb.vehicle_no}
                </span>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                    isAvailable
                      ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                      : isOnDuty
                      ? 'bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/30'
                      : 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30'
                  }`}
                >
                  {amb.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#F8FAFC]">{amb.type}</p>
                  {amb.city && (
                    <span className="text-[10px] font-bold uppercase text-white bg-[#0284C7] px-2 py-0.5 rounded-md">
                      {amb.city}
                    </span>
                  )}
                </div>

                <div className="text-xs text-[#94A3B8] space-y-1.5 pt-2 border-t border-[#334155]/60">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-[#0EA5E9] shrink-0" />
                    <span className="truncate">{amb.location}</span>
                  </div>

                  {amb.hospital_name && (
                    <p className="text-[10px] text-[#38BDF8] font-bold truncate">
                      🏥 {amb.hospital_name}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-[#64748B]">Driver: {amb.driver_name}</span>
                    <button
                      onClick={() => {
                        setSelectedAmbulanceForCall(amb);
                        setIsDriverCallModalOpen(true);
                      }}
                      className="text-[11px] font-bold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 cursor-pointer bg-sky-500/10 px-2 py-1 rounded-lg border border-sky-500/20 active:scale-95 transition-all"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-400 animate-pulse" /> Call Driver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Online Request Modal */}
      {isDispatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2 text-[#EF4444]">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#F8FAFC]">Request Emergency Ambulance</h3>
              </div>
              <button
                onClick={() => setIsDispatchModalOpen(false)}
                className="text-[#94A3B8] hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {dispatchResult ? (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-[#F8FAFC]">Ambulance Dispatched!</h4>
                <p className="text-xs text-[#94A3B8]">
                  Vehicle <span className="font-mono font-bold text-[#38BDF8]">{dispatchResult.vehicle_no}</span> ({dispatchResult.type}) is en-route to your pickup location.
                </p>
                <div className="bg-[#0F172A] p-3 rounded-xl text-left border border-[#334155] text-xs space-y-1">
                  <p><span className="text-[#64748B]">Driver Name:</span> {dispatchResult.driver_name}</p>
                  <p className="flex items-center justify-between">
                    <span className="text-[#64748B]">Driver Phone:</span>
                    <button
                      onClick={() => {
                        setSelectedAmbulanceForCall(dispatchResult);
                        setIsDriverCallModalOpen(true);
                      }}
                      className="text-[#38BDF8] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <PhoneCall className="w-3 h-3 text-emerald-400 animate-pulse" /> Call {dispatchResult.driver_name}
                    </button>
                  </p>
                  <p><span className="text-[#64748B]">Est. Arrival:</span> &lt; 8 Minutes</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedAmbulanceForCall(dispatchResult);
                      setIsDriverCallModalOpen(true);
                    }}
                    className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
                  >
                    <Phone className="w-4 h-4" /> Call Driver Now
                  </button>
                  <button
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="flex-1 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Close & Track
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleDispatchSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient name"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Emergency Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 Phone number"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Pickup Address / Landmark</label>
                  <textarea
                    required
                    rows={2}
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="House No., Street, Sector / Landmark..."
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Emergency Condition</label>
                  <select
                    value={emergencyReason}
                    onChange={(e) => setEmergencyReason(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                  >
                    <option value="Cardiac / Chest Pain">Cardiac / Chest Pain</option>
                    <option value="Road Accident / Injury">Road Accident / Trauma</option>
                    <option value="Breathing Difficulty">Severe Breathing Difficulty</option>
                    <option value="Stroke / Unconscious">Stroke / Loss of Consciousness</option>
                    <option value="Pregnancy / Labor">Pregnancy / Labor Emergency</option>
                    <option value="General Transfer">Patient Transfer to Checkmed</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsDispatchModalOpen(false)}
                    className="px-4 py-2 bg-[#0F172A] border border-[#334155] text-xs font-semibold text-[#94A3B8] rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    Dispatch Now
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Interactive Emergency Voice Intercom Call Modal */}
      <AmbulanceDriverCallModal
        isOpen={isDriverCallModalOpen}
        onClose={() => setIsDriverCallModalOpen(false)}
        ambulance={selectedAmbulanceForCall}
      />

    </div>
  );
};
