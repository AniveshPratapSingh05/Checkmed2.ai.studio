import React, { useState } from 'react';
import { Doctor, Patient, DoctorClinicalNote } from '../../types';
import { store } from '../../lib/store';
import { 
  X, User, Activity, FileText, Pill, Calendar, Clock, Shield, Check, 
  Heart, Microscope, Eye, AlertCircle, Plus, Sparkles, Printer, ArrowRight 
} from 'lucide-react';
import { DoctorPrescriptionModal } from './DoctorPrescriptionModal';
import { SharedPatientHistoryModal } from '../admin/modules/SharedPatientHistoryModal';

interface DoctorConsultationModalProps {
  doctor: Doctor;
  patient: Patient;
  onClose: () => void;
  onOpenPrescription?: (patient: Patient) => void;
  onOpenTimeline?: (patient: Patient) => void;
}

export const DoctorConsultationModal: React.FC<DoctorConsultationModalProps> = ({
  doctor,
  patient,
  onClose,
  onOpenPrescription,
  onOpenTimeline
}) => {
  // Existing clinical note for this patient/doctor if any
  const existingNote = store.clinicalNotes.find(
    n => (n.patient_id === patient.id || n.patient_name === patient.full_name) &&
         (n.doctor_id === doctor.id || n.doctor_name === doctor.full_name)
  );

  // Form State
  const [chiefComplaint, setChiefComplaint] = useState(existingNote?.chief_complaint || '');
  const [symptomsInput, setSymptomsInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>(
    existingNote?.symptoms || ['General Fatigue', 'Elevated BP reading']
  );
  const [recordedCondition, setRecordedCondition] = useState(
    existingNote?.recorded_condition || 'Cardiovascular Routine Assessment'
  );
  const [assessment, setAssessment] = useState(
    existingNote?.assessment || 'Patient stable on examination. Compliant with current lifestyle modifications.'
  );
  const [clinicalNotes, setClinicalNotes] = useState(
    existingNote?.clinical_notes || 'Regular heart sounds S1 S2 heard. Chest clear bilaterally. Pulse 76 bpm regular.'
  );
  const [relevantHistory, setRelevantHistory] = useState(
    existingNote?.relevant_medical_history || patient.medical_history || 'Hypertension, Seasonal Allergies'
  );
  const [allergies, setAllergies] = useState(
    existingNote?.allergies || 'No known drug allergies (NKDA)'
  );
  const [followUpNotes, setFollowUpNotes] = useState(
    existingNote?.follow_up_notes || 'Review BP chart and re-check lipid parameters in 2 weeks.'
  );
  const [followUpDate, setFollowUpDate] = useState(
    existingNote?.follow_up_date || '2026-08-28'
  );

  const [isSaved, setIsSaved] = useState(false);
  const [showFullHistoryModal, setShowFullHistoryModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Full cross-department medical history
  const fullHistory = store.getPatientFullMedicalHistory(patient.id || patient.full_name);
  const patientPrescriptions = store.prescriptions.filter(
    p => p.patient_id === patient.id || p.patient_name === patient.full_name
  );

  const handleAddSymptom = () => {
    if (symptomsInput.trim() && !symptoms.includes(symptomsInput.trim())) {
      setSymptoms([...symptoms, symptomsInput.trim()]);
      setSymptomsInput('');
    }
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const handleSaveClinicalNotes = (e: React.FormEvent) => {
    e.preventDefault();
    store.saveClinicalNote({
      patient_id: patient.id,
      patient_name: patient.full_name,
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      chief_complaint: chiefComplaint.trim(),
      symptoms,
      clinical_notes: clinicalNotes.trim(),
      assessment: assessment.trim(),
      recorded_condition: recordedCondition.trim(),
      relevant_medical_history: relevantHistory.trim(),
      allergies: allergies.trim(),
      follow_up_notes: followUpNotes.trim(),
      follow_up_date: followUpDate || undefined
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0F172A] border border-[#334155] rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-[#334155] bg-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30 font-bold text-lg">
              {patient.full_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">
                  Clinical Consultation: {patient.full_name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono font-semibold text-[11px] border border-blue-500/30">
                  {patient.id}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>{patient.age} Yrs, {patient.gender}</span>
                <span>•</span>
                <span>Blood: <strong className="text-red-400">{patient.blood_group || 'O+'}</strong></span>
                <span>•</span>
                <span>Phone: {patient.phone}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFullHistoryModal(true)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Unified EHR Records
            </button>
            <button
              type="button"
              onClick={() => {
                if (onOpenPrescription) {
                  onOpenPrescription(patient);
                } else {
                  setShowPrescriptionModal(true);
                }
              }}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-900/20"
            >
              <Pill className="w-3.5 h-3.5" />
              Write Prescription
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#334155] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* Quick Cross-Department Overview Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#1E293B] p-3.5 rounded-xl border border-[#334155]">
            <div className="bg-[#0F172A] p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Previous Prescriptions</span>
              <span className="font-bold text-emerald-400 text-sm">{patientPrescriptions.length} Active Rx</span>
            </div>
            <div className="bg-[#0F172A] p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Radiology & Labs</span>
              <span className="font-bold text-blue-400 text-sm">
                {fullHistory.labReports.length + fullHistory.xrayRecords.length + fullHistory.mriRecords.length + fullHistory.ctRecords.length} Investigations
              </span>
            </div>
            <div className="bg-[#0F172A] p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Specialty Consults</span>
              <span className="font-bold text-purple-400 text-sm">
                {fullHistory.cardiologyRecords.length + fullHistory.eyeRecords.length} Consultations
              </span>
            </div>
            <div className="bg-[#0F172A] p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">OT Surgeries & ICU</span>
              <span className="font-bold text-amber-400 text-sm">
                {fullHistory.surgeries.length + fullHistory.icuRecords.length} Procedures / Wards
              </span>
            </div>
          </div>

          {/* Form: Clinical Assessment & Disease Information */}
          <form onSubmit={handleSaveClinicalNotes} className="space-y-4">
            
            <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-2">
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Clinical Examination, Disease Assessment & Clinical Notes
                </h3>
                <span className="text-[11px] text-slate-400">
                  Doctor: <strong className="text-slate-200">{doctor.full_name}</strong> ({doctor.specialization})
                </span>
              </div>

              {/* Chief Complaint */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Chief Complaint & Presentation</label>
                <input
                  type="text"
                  placeholder="e.g. Recurrent morning dizziness, elevated systolic BP readings, headache"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Symptoms Tags */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Documented Symptoms</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {symptoms.map((sym, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs flex items-center gap-1.5"
                    >
                      {sym}
                      <button
                        type="button"
                        onClick={() => handleRemoveSymptom(idx)}
                        className="text-blue-400 hover:text-red-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type symptom and press Add..."
                    value={symptomsInput}
                    onChange={(e) => setSymptomsInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSymptom();
                      }
                    }}
                    className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-1.5 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSymptom}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              {/* Disease Condition & Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                    Recorded Diagnosis / Disease Condition <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Essential Stage 1 Hypertension, Dyslipidemia"
                    value={recordedCondition}
                    onChange={(e) => setRecordedCondition(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Known Drug Allergies</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa drugs, NKDA"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Clinical Examination Notes & Assessment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Clinical Examination Notes</label>
                  <textarea
                    rows={3}
                    placeholder="General appearance, vitals, cardiovascular, respiratory, CNS examination findings..."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Doctor's Clinical Assessment & Plan</label>
                  <textarea
                    rows={3}
                    placeholder="Summary evaluation, treatment plan, lifestyle recommendations..."
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Relevant Medical History & Follow-Up */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Past Medical History</label>
                  <input
                    type="text"
                    value={relevantHistory}
                    onChange={(e) => setRelevantHistory(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Follow-Up Plan</label>
                  <input
                    type="text"
                    value={followUpNotes}
                    onChange={(e) => setFollowUpNotes(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Follow-Up Target Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between pt-2">
              <div className="text-[11px] text-slate-400">
                {isSaved ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Clinical notes saved and logged to patient history.
                  </span>
                ) : (
                  <span>Clinical documentation is timestamped and bound to doctor credentials.</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-blue-900/30"
                >
                  <Check className="w-4 h-4" />
                  Save Clinical Notes
                </button>
              </div>
            </div>

          </form>

        </div>

      </div>

      {/* Cross-Department History Modal */}
      {showFullHistoryModal && (
        <SharedPatientHistoryModal
          patientId={patient.id}
          patientName={patient.full_name}
          onClose={() => setShowFullHistoryModal(false)}
        />
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && (
        <DoctorPrescriptionModal
          doctor={doctor}
          initialPatient={patient}
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}
    </div>
  );
};
