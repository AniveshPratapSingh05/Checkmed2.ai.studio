import React, { useState } from 'react';
import { BedDouble, HeartPulse, CheckCircle2, Filter, Activity, MapPin, Building2 } from 'lucide-react';
import { Bed, CityName } from '../../types';

interface BedAvailabilityViewProps {
  beds: Bed[];
  onRequestBed?: (bed: Bed) => void;
}

const CITIES: (CityName | 'All')[] = [
  'All',
  'Varanasi',
  'Lucknow',
  'Kanpur',
  'Gorakhpur',
  'Allahabad (Prayagraj)'
];

export const BedAvailabilityView: React.FC<BedAvailabilityViewProps> = ({ beds }) => {
  const [selectedWard, setSelectedWard] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<CityName | 'All'>('All');

  const wards: string[] = ['All', 'ICU', 'Emergency', 'General Male', 'General Female', 'Pediatric Ward', 'Deluxe Private Suite'];

  const filteredBeds = beds.filter(bed => {
    const matchWard = selectedWard === 'All' || bed.ward_name === selectedWard;
    const matchStatus = selectedStatus === 'All' || bed.status === selectedStatus;
    const matchCity = selectedCity === 'All' || bed.city === selectedCity;
    return matchWard && matchStatus && matchCity;
  });

  // Calculate ward stats
  const totalCount = beds.length;
  const availableCount = beds.filter(b => b.status === 'Available').length;
  const occupiedCount = beds.filter(b => b.status === 'Occupied').length;

  return (
    <div className="space-y-6">
      
      {/* Top Ward KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Total Hospital Beds</p>
            <p className="text-2xl font-extrabold text-[#F8FAFC] mt-1">{totalCount}</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Across 6 Specialized Wards</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/30 flex items-center justify-center">
            <BedDouble className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Available Beds</p>
            <p className="text-2xl font-extrabold text-[#10B981] mt-1">{availableCount}</p>
            <p className="text-[11px] text-[#10B981] mt-0.5 font-bold">Ready for Admission</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">Occupied Beds</p>
            <p className="text-2xl font-extrabold text-[#F59E0B] mt-1">{occupiedCount}</p>
            <p className="text-[11px] text-[#94A3B8] mt-0.5">Currently Admitted</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-wider">ICU / ER Available</p>
            <p className="text-2xl font-extrabold text-[#F87171] mt-1">
              {beds.filter(b => (b.ward_name === 'ICU' || b.ward_name === 'Emergency') && b.status === 'Available').length}
            </p>
            <p className="text-[11px] text-[#F87171] font-bold mt-0.5">Critical Emergency Care</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 text-[#F87171] border border-[#EF4444]/30 flex items-center justify-center">
            <HeartPulse className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Ward Filter & Status Filter Bar */}
      <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Hospital Ward & Bed Tracker</h3>
            <p className="text-xs text-[#94A3B8]">Live bed availability status across all ICU, Emergency, and Ward units.</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#94A3B8] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Status:
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs p-2 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] font-semibold focus:ring-2 focus:ring-[#0EA5E9]"
            >
              <option value="All">All Statuses</option>
              <option value="Available">Available Only</option>
              <option value="Occupied">Occupied</option>
              <option value="Reserved">Reserved</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>

        {/* City Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-[#334155]/60 pt-1">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase shrink-0 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#38BDF8]" /> City:
          </span>
          {CITIES.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCity(c)}
              className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCity === c
                  ? 'bg-[#0284C7] text-white shadow-xs'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:bg-[#334155] hover:text-[#F8FAFC]'
              }`}
            >
              {c === 'All' ? 'All UP Cities' : c}
            </button>
          ))}
        </div>

        {/* Ward Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase shrink-0">Ward:</span>
          {wards.map(ward => (
            <button
              key={ward}
              onClick={() => setSelectedWard(ward)}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedWard === ward
                  ? 'bg-[#0EA5E9] text-white shadow-xs'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:bg-[#334155] hover:text-[#F8FAFC]'
              }`}
            >
              {ward}
            </button>
          ))}
        </div>
      </div>

      {/* Beds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map(bed => (
          <div
            key={bed.id}
            className={`bg-[#1E293B] rounded-2xl border p-4 shadow-xs transition-all flex flex-col justify-between ${
              bed.status === 'Available' ? 'border-[#10B981]/50' :
              bed.status === 'Occupied' ? 'border-[#F59E0B]/50' :
              bed.status === 'Reserved' ? 'border-[#0EA5E9]/50' :
              'border-[#334155] opacity-75'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] bg-[#0F172A] px-2 py-0.5 rounded-md border border-[#334155]">
                    {bed.ward_name}
                  </span>
                  {bed.city && (
                    <span className="text-[10px] font-bold uppercase text-white bg-[#0284C7] px-2 py-0.5 rounded-md">
                      {bed.city}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  bed.status === 'Available' ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30' :
                  bed.status === 'Occupied' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/30' :
                  bed.status === 'Reserved' ? 'bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/30' :
                  'bg-[#EF4444]/10 text-[#F87171] border border-[#EF4444]/30'
                }`}>
                  {bed.status}
                </span>
              </div>

              <div>
                <h4 className="text-lg font-extrabold text-[#F8FAFC] font-mono">{bed.bed_number}</h4>
                <p className="text-xs font-medium text-[#94A3B8]">{bed.bed_type}</p>
                {bed.hospital_name && (
                  <p className="text-[10px] text-[#38BDF8] font-bold mt-1 line-clamp-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3 shrink-0" /> {bed.hospital_name}
                  </p>
                )}
              </div>

              {bed.status === 'Occupied' && bed.patient_name && (
                <div className="bg-[#0F172A] p-2 rounded-lg text-xs border border-[#334155] text-[#F8FAFC]">
                  <span className="text-[10px] text-[#F59E0B] block font-bold">Occupied By:</span>
                  <span className="font-bold">{bed.patient_name}</span>
                </div>
              )}

              <div className="pt-2 border-t border-[#334155] flex items-center justify-between text-xs">
                <span className="text-[#94A3B8]">Rate / Day:</span>
                <span className="font-bold text-[#38BDF8]">₹{bed.price_per_day}</span>
              </div>
            </div>

            {bed.status === 'Available' && (
              <div className="mt-3 pt-2">
                <span className="block text-[10px] text-[#10B981] font-semibold text-center bg-[#10B981]/10 py-1.5 rounded-lg border border-[#10B981]/20">
                  ✓ Available for Immediate Admission
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
};
