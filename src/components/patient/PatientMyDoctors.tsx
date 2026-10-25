import React from 'react';
import { 
  Stethoscope, Calendar, Clock, MapPin, User, 
  ChevronRight, Plus, Star, CheckCircle2, Shield 
} from 'lucide-react';
import { Patient, Doctor, Appointment } from '../../types';
import { store } from '../../lib/store';

interface PatientMyDoctorsProps {
  patient: Patient;
  onBookWithDoctor: (doctor: Doctor) => void;
}

export const PatientMyDoctors: React.FC<PatientMyDoctorsProps> = ({ patient, onBookWithDoctor }) => {
  const patientDoctors = store.getPatientDoctors(patient.id);
  const patientAppointments = store.getPatientAppointments(patient.id);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B] border border-[#334155] p-6 rounded-3xl shadow-xl">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-emerald-400" />
            <span>My Care Team & Consulting Doctors</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Specialists who have treated you, reviewed your diagnostics, or are assigned to your active appointments.
          </p>
        </div>
        <div className="text-xs font-bold text-slate-300 bg-[#0F172A] px-4 py-2 rounded-2xl border border-[#334155]">
          <span className="text-emerald-400 font-mono">{patientDoctors.length}</span> Assigned Doctors
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patientDoctors.map(doctor => {
          // Find appointments with this doctor
          const docAppointments = patientAppointments.filter(
            a => a.doctor_id === doctor.id || a.doctor_name.toLowerCase().includes(doctor.full_name.toLowerCase())
          );
          const upcomingAppt = docAppointments.find(a => a.status === 'Upcoming');
          const latestAppt = docAppointments[0];

          return (
            <div
              key={doctor.id}
              className="bg-[#1E293B] border border-[#334155] hover:border-emerald-500/50 rounded-3xl p-6 shadow-xl space-y-4 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Doctor Avatar & Name */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-emerald-950/40 shrink-0">
                    {doctor.avatar_url ? (
                      <img src={doctor.avatar_url} alt={doctor.full_name} className="w-full h-full object-cover rounded-2xl" referrerPolicy="no-referrer" />
                    ) : (
                      doctor.full_name.replace('Dr. ', '').charAt(0)
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-white text-sm">{doctor.full_name}</h3>
                    <p className="text-xs text-emerald-400 font-bold">{doctor.specialization}</p>
                    <p className="text-[11px] text-slate-400">{doctor.department}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      {doctor.status}
                    </span>
                  </div>
                </div>

                {/* Consultation Info */}
                <div className="bg-[#0F172A] border border-[#334155]/60 rounded-2xl p-3.5 text-xs space-y-1.5 text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Hospital:</span>
                    <span className="font-semibold text-white truncate max-w-[140px]">{doctor.hospital_name || 'BRD Medical College'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Room / OPD:</span>
                    <span className="font-bold text-amber-300 font-mono">{doctor.room_no || 'OPD-102'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Consultation Fee:</span>
                    <span className="font-bold text-white">₹{doctor.consultation_fee}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#334155]/40">
                    <span className="text-slate-400">Next Scheduled:</span>
                    <span className="font-bold text-sky-400">
                      {upcomingAppt ? `${upcomingAppt.appointment_date} (${upcomingAppt.time_slot})` : 'No upcoming visit'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onBookWithDoctor(doctor)}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-950/40 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book Follow-Up Consultation</span>
              </button>
            </div>
          );
        })}
      </div>

    </div>
  );
};
