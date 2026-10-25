import React, { useState } from 'react';
import { Doctor, Patient } from '../../types';
import { store } from '../../lib/store';
import { 
  Search, Filter, User, Stethoscope, Pill, Clock, 
  FileText, Shield, Heart, Plus, ChevronRight, Activity, Calendar, AlertCircle,
  Bed, Wind, FlaskConical
} from 'lucide-react';

interface DoctorPatientListProps {
  doctor: Doctor;
  onOpenConsultation: (patient: Patient) => void;
  onOpenPrescription: (patient: Patient) => void;
  onOpenTimeline: (patient: Patient) => void;
  onOpenFullHistory: (patient: Patient) => void;
  onRequestResource?: (patient: Patient) => void;
}

export const DoctorPatientList: React.FC<DoctorPatientListProps> = ({
  doctor,
  onOpenConsultation,
  onOpenPrescription,
  onOpenTimeline,
  onOpenFullHistory,
  onRequestResource
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');

  const doctorPatients = store.getDoctorPatients(doctor.id);

  // Filter patients
  const filteredPatients = doctorPatients.filter(patient => {
    const matchesSearch = 
      patient.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm) ||
      (patient.medical_history && patient.medical_history.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesBlood = selectedBloodGroup === 'ALL' || patient.blood_group === selectedBloodGroup;
    const matchesGender = selectedGender === 'ALL' || patient.gender.toLowerCase() === selectedGender.toLowerCase();

    return matchesSearch && matchesBlood && matchesGender;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search assigned patients by Name, ID (PAT-...), phone or medical condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1.5 rounded-xl border border-[#334155] text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-transparent text-slate-300 font-medium focus:outline-none"
            >
              <option value="ALL">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#0F172A] px-2.5 py-1.5 rounded-xl border border-[#334155] text-xs">
            <Heart className="w-3.5 h-3.5 text-red-400" />
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="bg-transparent text-slate-300 font-medium focus:outline-none"
            >
              <option value="ALL">All Blood Groups</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
            </select>
          </div>
        </div>

      </div>

      {/* Patient List Results */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span>Showing <strong className="text-white">{filteredPatients.length}</strong> patients assigned to {doctor.full_name}</span>
          <span className="text-[11px] text-emerald-400 font-medium">Privacy Guaranteed: Doctor-specific patient view</span>
        </div>

        {filteredPatients.length === 0 ? (
          <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-10 text-center text-slate-400">
            <User className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-60" />
            <p className="font-semibold text-slate-300 text-sm">No patients found matching your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try adjusting the search keywords or filters above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredPatients.map(patient => {
              // Check for patient's last prescription or follow-up
              const patientPrescriptions = store.prescriptions.filter(
                p => p.patient_id === patient.id || p.patient_name === patient.full_name
              );
              const patientFollowUps = store.doctorFollowUps.filter(
                f => f.patient_id === patient.id || f.patient_name === patient.full_name
              );
              const latestRx = patientPrescriptions[0];
              const latestFollowUp = patientFollowUps[0];

              return (
                <div
                  key={patient.id}
                  className="bg-[#1E293B] border border-[#334155] hover:border-slate-500 rounded-xl p-4 transition shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                >
                  {/* Left: Demographics & Info */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30 shrink-0">
                      {patient.full_name.charAt(0)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-white text-sm tracking-tight">{patient.full_name}</h3>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {patient.id}
                        </span>
                        {patient.blood_group && (
                          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 font-bold text-[10px] border border-red-500/20">
                            {patient.blood_group}
                          </span>
                        )}
                        {patient.room_no && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 font-bold text-[10px] border border-sky-500/20">
                            <Bed className="w-3 h-3" /> {patient.room_no}
                          </span>
                        )}
                        {patient.icu_bed && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/15 text-red-300 font-bold text-[10px] border border-red-500/30">
                            <Activity className="w-3 h-3 text-red-400" /> {patient.icu_bed}
                          </span>
                        )}
                        {patient.required_test && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-bold text-[10px] border border-purple-500/20">
                            <FlaskConical className="w-3 h-3 text-purple-400" /> Test: {patient.required_test}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400">
                        <span>Age: <strong className="text-slate-200">{patient.age} Yrs</strong></span>
                        <span>•</span>
                        <span>Gender: <strong className="text-slate-200 capitalize">{patient.gender}</strong></span>
                        <span>•</span>
                        <span>Phone: <span className="font-mono text-slate-300">{patient.phone}</span></span>
                      </div>

                      {/* Medical History Snippet */}
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 pt-0.5">
                        <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate max-w-md">
                          History: <strong className="text-slate-300">{patient.medical_history || 'No chronic history recorded'}</strong>
                        </span>
                      </div>

                      {/* Latest Clinical Activity Badge */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        {latestRx && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">
                            <Pill className="w-3 h-3" /> Last Rx: {latestRx.prescription_number} ({latestRx.recorded_condition})
                          </span>
                        )}
                        {latestFollowUp && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px] border border-blue-500/20">
                            <Calendar className="w-3 h-3" /> Follow-Up: {latestFollowUp.follow_up_date} ({latestFollowUp.status})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: Quick Doctor Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-700/60">
                    <button
                      onClick={() => onOpenConsultation(patient)}
                      className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title="Open Doctor Clinical Consultation & Notes Workspace"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      Consultation
                    </button>

                    <button
                      onClick={() => onOpenPrescription(patient)}
                      className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title="Write or Review Prescriptions"
                    >
                      <Pill className="w-3.5 h-3.5" />
                      Prescription
                    </button>

                    {onRequestResource && (
                      <button
                        onClick={() => onRequestResource(patient)}
                        className="px-2.5 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                        title="Request Inpatient Room, ICU Bed, or Oxygen Support"
                      >
                        <Bed className="w-3.5 h-3.5" />
                        Bed / O2
                      </button>
                    )}

                    <button
                      onClick={() => onOpenTimeline(patient)}
                      className="px-3 py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      title="View Chronological Medical Timeline"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Timeline
                    </button>

                    <button
                      onClick={() => onOpenFullHistory(patient)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
                      title="View Complete Unified EHR History (Labs, Radiology, Surgeries)"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};

