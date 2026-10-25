import React from 'react';
import { DoctorPrescription } from '../../types';
import { Printer, X, Heart, Shield, Activity, Calendar, User, Phone, MapPin } from 'lucide-react';

interface PrintablePrescriptionProps {
  prescription: DoctorPrescription;
  onClose: () => void;
}

export const PrintablePrescription: React.FC<PrintablePrescriptionProps> = ({ prescription, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white text-slate-900 border border-slate-300 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full">
        
        {/* Modal Controls (Hidden in Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="font-semibold text-sm">Official Medical Prescription Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs flex items-center gap-2 transition shadow-lg shadow-emerald-900/30"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Prescription Body */}
        <div id="printable-rx-area" className="p-8 overflow-y-auto space-y-6 flex-1 bg-white print:p-6 print:overflow-visible">
          
          {/* Hospital & Doctor Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 text-emerald-700">
                  <Heart className="w-7 h-7 fill-emerald-600 text-emerald-600" />
                  <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    {prescription.hospital_name || 'SMARTCARE MULTISPECIALITY HOSPITAL'}
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> NABH Accredited Tertiary Care & Research Institute
                </p>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-md border border-slate-300 inline-block">
                  Prescription No: {prescription.prescription_number}
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  Date: <span className="text-slate-900 font-bold">{prescription.created_at}</span>
                </div>
              </div>
            </div>

            {/* Doctor Info Subheader */}
            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-start text-xs">
              <div>
                <h2 className="text-base font-bold text-slate-900">{prescription.doctor_name}</h2>
                <p className="text-emerald-700 font-semibold text-xs">{prescription.doctor_specialization}</p>
                <p className="text-slate-500 text-[11px]">{prescription.doctor_qualification || 'MBBS, MD'}</p>
              </div>
              <div className="text-right text-slate-600">
                <p className="font-semibold text-slate-800">Doctor ID: <span className="font-mono">{prescription.doctor_id}</span></p>
                <p>Consultation Room: <span className="font-medium text-slate-800">{prescription.doctor_room_no || 'OPD Consulting'}</span></p>
              </div>
            </div>
          </div>

          {/* Patient Demographic Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{prescription.patient_name}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Patient ID</span>
              <span className="font-mono font-semibold text-slate-800">{prescription.patient_id}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Age / Gender</span>
              <span className="font-semibold text-slate-800">{prescription.patient_age} Yrs / {prescription.patient_gender}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px] font-medium">Blood Group</span>
              <span className="font-bold text-red-600">{prescription.patient_blood_group || 'Not Specified'}</span>
            </div>
          </div>

          {/* Clinical Findings & Diagnosis */}
          <div className="space-y-2 text-xs">
            {prescription.chief_complaint && (
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="font-bold text-slate-700">Chief Complaint: </span>
                <span className="text-slate-800">{prescription.chief_complaint}</span>
              </div>
            )}
            <div className="bg-emerald-50/60 p-3 rounded-lg border border-emerald-200">
              <span className="font-bold text-emerald-900 text-xs">Diagnosis / Condition: </span>
              <span className="text-emerald-950 font-bold text-sm ml-1">{prescription.recorded_condition}</span>
              {prescription.clinical_notes && (
                <p className="mt-1 text-slate-700 text-xs italic">{prescription.clinical_notes}</p>
              )}
            </div>
          </div>

          {/* Rx Symbol & Medication Table */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-300 pb-1">
              <span className="text-2xl font-black font-serif text-slate-900 tracking-wider">℞</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">Prescribed Medications</span>
            </div>

            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 text-[11px] uppercase bg-slate-50">
                  <th className="py-2 px-3 font-semibold">#</th>
                  <th className="py-2 px-3 font-semibold">Medicine Name</th>
                  <th className="py-2 px-3 font-semibold">Dosage</th>
                  <th className="py-2 px-3 font-semibold">Frequency</th>
                  <th className="py-2 px-3 font-semibold">Route</th>
                  <th className="py-2 px-3 font-semibold">Duration</th>
                  <th className="py-2 px-3 font-semibold">Instructions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {prescription.medicines.map((med, index) => (
                  <tr key={index} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-mono font-medium text-slate-400">{index + 1}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{med.name}</div>
                      {med.additional_notes && (
                        <div className="text-[10px] text-slate-500 italic">{med.additional_notes}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{med.dosage}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-semibold text-[11px] border border-blue-200 inline-block">
                        {med.frequency}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{med.route}</td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{med.duration}</td>
                    <td className="py-2.5 px-3 text-slate-700">{med.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Advice & Follow-Up */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
            {prescription.advice_instructions && (
              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-200">
                <span className="font-bold text-amber-900 block mb-1">General Advice & Dietary Precautions:</span>
                <p className="text-slate-800 text-xs leading-relaxed">{prescription.advice_instructions}</p>
              </div>
            )}

            {prescription.follow_up_date && (
              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-blue-900 block text-xs">Next Follow-Up Consultation:</span>
                  <p className="text-slate-700 text-xs">Please bring this prescription and recent investigation reports.</p>
                </div>
                <div className="text-right">
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs inline-block">
                    {prescription.follow_up_date}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer & Signature Section */}
          <div className="pt-8 border-t border-slate-300 mt-6 flex justify-between items-end text-xs">
            <div className="text-slate-400 text-[10px]">
              <p>Generated electronically via SmartCare Clinical Hospital Suite</p>
              <p>Valid without physical stamp if verified online • Helpline: 1800-SMART-CARE</p>
            </div>
            <div className="text-right space-y-1">
              <div className="font-serif italic text-base font-bold text-slate-800 tracking-wider">
                {prescription.doctor_name}
              </div>
              <div className="w-40 border-t border-slate-400 ml-auto pt-1">
                <p className="text-[11px] font-bold text-slate-700">Authorized Medical Practitioner</p>
                <p className="text-[10px] text-slate-500">Reg. No: UP-MED-{(prescription.doctor_id.split('-').pop() || '4410').padStart(6, '0')}</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
