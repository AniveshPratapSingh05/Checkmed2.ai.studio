import React, { useState } from 'react';
import { Search, Calendar, Clock, MapPin, Stethoscope, Building2, Mic, Sparkles } from 'lucide-react';
import { Doctor, CityName } from '../../types';

interface DoctorListProps {
  doctors: Doctor[];
  onBookAppointment: (doctor: Doctor) => void;
}

const CITIES: (CityName | 'All')[] = [
  'All',
  'Varanasi',
  'Lucknow',
  'Kanpur',
  'Gorakhpur',
  'Allahabad (Prayagraj)'
];

export const DoctorList: React.FC<DoctorListProps> = ({ doctors, onBookAppointment }) => {
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<CityName | 'All'>('All');

  const departments = [
    'All',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'Dermatology',
    'Emergency',
    'ENT'
  ];

  const filtered = doctors.filter(doc => {
    const matchDept = department === 'All' || doc.department === department;
    const matchCity = selectedCity === 'All' || doc.city === selectedCity;
    const matchQuery = doc.full_name.toLowerCase().includes(search.toLowerCase()) ||
                       doc.specialization.toLowerCase().includes(search.toLowerCase()) ||
                       doc.department.toLowerCase().includes(search.toLowerCase()) ||
                       (doc.hospital_name && doc.hospital_name.toLowerCase().includes(search.toLowerCase())) ||
                       (doc.city && doc.city.toLowerCase().includes(search.toLowerCase()));
    return matchDept && matchCity && matchQuery;
  });

  return (
    <div className="space-y-6">
      
      {/* Voice Booking Hero Banner */}
      <div className="bg-[#1E293B] border border-[#0EA5E9]/30 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#38BDF8] text-[11px] font-bold border border-[#0EA5E9]/30">
            <Mic className="w-3 h-3 text-[#38BDF8] animate-pulse" />
            <span>Voice-Controlled OPD Booking</span>
          </div>
          <h3 className="text-base font-extrabold text-white">Speak to Book Doctors & Time Slots</h3>
          <p className="text-xs text-[#94A3B8]">
            Simply say doctor's name, specialty, or preferred slot (e.g. "Dr. Rajesh Sharma at 10:30 AM") to auto-book your OPD token!
          </p>
        </div>

        <button
          onClick={() => onBookAppointment(doctors[0])}
          className="px-4 py-2.5 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0 active:scale-95 z-10"
        >
          <Mic className="w-4 h-4 text-white animate-bounce" />
          <span>Launch Voice Booking Assistant</span>
        </button>
      </div>

      {/* Search & Filter Header */}
      <div className="bg-[#1E293B] p-5 rounded-2xl border border-[#334155] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#F8FAFC]">Available Doctors & OPD Specialists</h2>
            <p className="text-xs text-[#94A3B8]">Filter by UP city, department or search by doctor name/hospital.</p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search doctor, hospital, specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-[#F8FAFC] focus:ring-2 focus:ring-[#0EA5E9]"
            />
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

        {/* Department Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase shrink-0">Dept:</span>
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setDepartment(dept)}
              className={`px-3.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                department === dept
                  ? 'bg-[#0EA5E9] text-white shadow-xs'
                  : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:bg-[#334155] hover:text-[#F8FAFC]'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length > 0 ? (
          filtered.map(doctor => (
            <div 
              key={doctor.id}
              className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 shadow-xs hover:border-[#0EA5E9] transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <img
                    src={doctor.avatar_url}
                    alt={doctor.full_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#334155] shadow-xs"
                  />
                  <div>
                    <div className="flex flex-wrap gap-1 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#38BDF8] bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 px-2 py-0.5 rounded-md">
                        {doctor.department}
                      </span>
                      {doctor.city && (
                        <span className="text-[10px] font-bold uppercase text-white bg-[#0284C7] px-2 py-0.5 rounded-md">
                          {doctor.city}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-[#F8FAFC]">{doctor.full_name}</h3>
                    <p className="text-[11px] text-[#94A3B8]">{doctor.qualification}</p>
                  </div>
                </div>

                {doctor.hospital_name && (
                  <p className="text-[11px] text-[#38BDF8] font-bold flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="line-clamp-1">{doctor.hospital_name}</span>
                  </p>
                )}

                <p className="text-xs text-[#94A3B8] font-medium line-clamp-2 bg-[#0F172A] p-2 rounded-lg border border-[#334155]">
                  {doctor.specialization}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="flex items-center gap-1.5 text-[#94A3B8]">
                    <Clock className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{doctor.shift_hours}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#94A3B8]">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{doctor.room_no}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#334155] text-xs">
                  <div>
                    <span className="text-[10px] text-[#94A3B8] block">Consultation Fee</span>
                    <span className="text-sm font-bold text-[#38BDF8]">₹{doctor.consultation_fee}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#94A3B8] block">Experience</span>
                    <span className="font-bold text-[#F8FAFC]">{doctor.experience_yrs} Years</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                <button
                  onClick={() => onBookAppointment(doctor)}
                  className="col-span-3 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" /> Book Slot
                </button>
                <button
                  onClick={() => onBookAppointment(doctor)}
                  className="col-span-2 py-2.5 bg-[#0F172A] hover:bg-[#1E293B] border border-[#0EA5E9]/40 text-[#38BDF8] text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Speak to book with this doctor"
                >
                  <Mic className="w-3.5 h-3.5 text-[#38BDF8] animate-pulse" /> Voice
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center bg-[#1E293B] rounded-2xl border border-[#334155]">
            <Stethoscope className="w-8 h-8 text-[#94A3B8] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#F8FAFC]">No doctors match your filter</p>
            <p className="text-xs text-[#94A3B8]">Try changing department or search term.</p>
          </div>
        )}
      </div>

    </div>
  );
};
