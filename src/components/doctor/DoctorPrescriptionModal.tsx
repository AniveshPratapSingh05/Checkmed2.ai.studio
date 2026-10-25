import React, { useState } from 'react';
import { Doctor, Patient, DoctorPrescription, PrescriptionMedicine } from '../../types';
import { store } from '../../lib/store';
import { X, Plus, Trash2, Pill, Check, Printer, FileText, Calendar, AlertCircle, History, Sparkles } from 'lucide-react';
import { PrintablePrescription } from './PrintablePrescription';

interface DoctorPrescriptionModalProps {
  doctor: Doctor;
  initialPatient?: Patient | null;
  onClose: () => void;
  onSaved?: (prescription: DoctorPrescription) => void;
}

const COMMON_DOSAGES = ['500 mg', '250 mg', '100 mg', '50 mg', '40 mg', '20 mg', '10 mg', '5 mg', '1 Tablet', '2 Tablets', '5 ml', '10 ml', '1 Drop'];
const COMMON_FREQUENCIES = [
  'Once Daily (Morning)',
  'Once Daily (Night)',
  '1-0-1 (Twice Daily)',
  '1-1-1 (Three Times Daily / TDS)',
  'Four Times Daily (QID)',
  'SOS / As Needed (During Symptoms)',
  'Once a Week'
];
const COMMON_DURATIONS = ['3 Days', '5 Days', '7 Days', '10 Days', '14 Days', '1 Month', '3 Months', 'Continuous / Long Term'];
const COMMON_ROUTES: PrescriptionMedicine['route'][] = ['Oral', 'IV Injection', 'IM Injection', 'Topical', 'Inhalation', 'Eye Drops', 'Sublingual'];
const COMMON_INSTRUCTIONS = [
  'After meals with plain water',
  'Before breakfast on empty stomach',
  'After dinner at bedtime',
  'With food or milk',
  'Dissolve in half glass of water',
  'Apply thinly to affected area',
  'Do not stop without doctor consultation'
];

export const DoctorPrescriptionModal: React.FC<DoctorPrescriptionModalProps> = ({
  doctor,
  initialPatient,
  onClose,
  onSaved
}) => {
  const doctorPatients = store.getDoctorPatients(doctor.id);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatient?.id || (doctorPatients[0]?.id || '')
  );

  const selectedPatient = store.patients.find(p => p.id === selectedPatientId) || initialPatient || doctorPatients[0];

  // Prescription fields
  const [condition, setCondition] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [advice, setAdvice] = useState('Maintain regular hydration and adhere to prescribed dietary guidelines.');
  const [followUpDate, setFollowUpDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split('T')[0];
  });

  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([
    {
      id: `med-${Date.now()}-1`,
      name: '',
      dosage: '500 mg',
      frequency: '1-0-1 (Twice Daily)',
      duration: '5 Days',
      route: 'Oral',
      instructions: 'After meals with plain water',
      additional_notes: ''
    }
  ]);

  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');
  const [previewPrescription, setPreviewPrescription] = useState<DoctorPrescription | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Pharmacy Inventory autocomplete
  const inventoryMeds = store.medicines;

  // Previous Prescriptions for this patient
  const previousPrescriptions = store.prescriptions.filter(
    p => p.patient_id === selectedPatientId || p.patient_name === selectedPatient?.full_name
  );

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        id: `med-${Date.now()}-${medicines.length + 1}`,
        name: '',
        dosage: '1 Tablet',
        frequency: '1-0-1 (Twice Daily)',
        duration: '5 Days',
        route: 'Oral',
        instructions: 'After meals with plain water',
        additional_notes: ''
      }
    ]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: keyof PrescriptionMedicine, value: any) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleSavePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const validMeds = medicines.filter(m => m.name.trim().length > 0);
    if (validMeds.length === 0) {
      alert('Please enter at least one medicine name in the prescription.');
      return;
    }

    const rxNumber = `RX-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newPrescription = store.addPrescription({
      prescription_number: rxNumber,
      doctor_id: doctor.id,
      doctor_name: doctor.full_name,
      doctor_specialization: doctor.specialization,
      doctor_qualification: doctor.qualification,
      doctor_room_no: doctor.room_no,
      patient_id: selectedPatient.id,
      patient_name: selectedPatient.full_name,
      patient_age: selectedPatient.age,
      patient_gender: selectedPatient.gender,
      patient_blood_group: selectedPatient.blood_group,
      recorded_condition: condition.trim() || 'General Medical Consultation',
      chief_complaint: chiefComplaint.trim(),
      clinical_notes: clinicalNotes.trim(),
      medicines: validMeds,
      advice_instructions: advice.trim(),
      follow_up_date: followUpDate || undefined,
      status: 'Finalized',
      hospital_name: doctor.hospital_name || 'Sir Sunderlal Hospital (IMS BHU)'
    });

    setSavedSuccess(true);
    setPreviewPrescription(newPrescription);
    if (onSaved) onSaved(newPrescription);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0F172A] border border-[#334155] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-5 border-b border-[#334155] bg-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Prescription Management System
              </h2>
              <p className="text-xs text-slate-400">
                Prescribe verified medications, dosage schedules, clinical notes & follow-up instructions
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-slate-900/60 p-1 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  activeTab === 'create' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Create Prescription
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`px-3 py-1 rounded-md font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'history' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Previous Prescriptions ({previousPrescriptions.length})
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#334155] transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* Patient Demographic Selector */}
          <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-slate-400 font-semibold mb-1 text-[11px]">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {doctorPatients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.full_name} ({p.gender}, {p.age}y) — ID: {p.id}
                  </option>
                ))}
              </select>
            </div>

            {selectedPatient && (
              <>
                <div className="bg-[#0F172A] p-2.5 rounded-lg border border-[#334155]/60 flex flex-col justify-center">
                  <span className="text-slate-400 text-[11px]">Age & Gender</span>
                  <span className="text-white font-bold text-xs">{selectedPatient.age} Yrs / {selectedPatient.gender}</span>
                  <span className="text-slate-400 text-[11px] mt-0.5">Blood Group: <strong className="text-red-400">{selectedPatient.blood_group || 'O+'}</strong></span>
                </div>
                <div className="bg-[#0F172A] p-2.5 rounded-lg border border-[#334155]/60 flex flex-col justify-center">
                  <span className="text-slate-400 text-[11px]">Medical History & Allergies</span>
                  <span className="text-slate-300 font-medium truncate text-xs">{selectedPatient.medical_history || 'None documented'}</span>
                  <span className="text-slate-400 text-[11px] mt-0.5">Contact: {selectedPatient.phone}</span>
                </div>
              </>
            )}
          </div>

          {activeTab === 'create' ? (
            <form onSubmit={handleSavePrescription} className="space-y-5">
              
              {/* Clinical Condition & Chief Complaint */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#1E293B]/60 p-4 rounded-xl border border-[#334155]">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">
                    Recorded Diagnosis / Clinical Condition <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Essential Stage 1 Hypertension, Acute Bronchitis"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Chief Complaint / Symptoms</label>
                  <input
                    type="text"
                    placeholder="e.g. Mild chest uneasiness, elevated BP readings, headache"
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Clinical Notes & Examination Findings</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. S1 S2 normal, no added sounds, pulse regular 76 bpm, BP 138/88 mmHg. Advised lipid profile and sodium restriction."
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Medicines Table */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-emerald-400 text-sm flex items-center gap-2">
                    <Pill className="w-4 h-4" /> Prescribed Medicines Table
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddMedicine}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another Medicine
                  </button>
                </div>

                <div className="space-y-3">
                  {medicines.map((med, index) => (
                    <div
                      key={med.id || index}
                      className="bg-[#1E293B] p-3.5 rounded-xl border border-[#334155] space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between text-xs pb-1 border-b border-slate-700/60">
                        <span className="font-bold text-slate-300 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">
                            {index + 1}
                          </span>
                          Medicine #{index + 1}
                        </span>
                        {medicines.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedicine(index)}
                            className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-red-500/10 transition"
                            title="Remove Medicine"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
                        {/* Medicine Name with Datalist Inventory Autocomplete */}
                        <div className="sm:col-span-4">
                          <label className="block text-slate-400 text-[10px] mb-0.5 font-semibold">Medicine Name *</label>
                          <input
                            type="text"
                            required
                            list={`inventory-meds-${index}`}
                            placeholder="Type or select medicine..."
                            value={med.name}
                            onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1.5 text-white font-medium text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                          <datalist id={`inventory-meds-${index}`}>
                            {inventoryMeds.map(im => (
                              <option key={im.id} value={`${im.name} (${im.dosage_form})`} />
                            ))}
                          </datalist>
                        </div>

                        {/* Dosage */}
                        <div className="sm:col-span-2">
                          <label className="block text-slate-400 text-[10px] mb-0.5 font-semibold">Dosage</label>
                          <input
                            type="text"
                            list="dosages-list"
                            placeholder="500 mg"
                            value={med.dosage}
                            onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        {/* Frequency */}
                        <div className="sm:col-span-3">
                          <label className="block text-slate-400 text-[10px] mb-0.5 font-semibold">Frequency</label>
                          <select
                            value={med.frequency}
                            onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          >
                            {COMMON_FREQUENCIES.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>

                        {/* Route */}
                        <div className="sm:col-span-3">
                          <label className="block text-slate-400 text-[10px] mb-0.5 font-semibold">Route</label>
                          <select
                            value={med.route}
                            onChange={(e) => handleMedicineChange(index, 'route', e.target.value as any)}
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          >
                            {COMMON_ROUTES.map(r => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>

                        {/* Duration */}
                        <div className="sm:col-span-3">
                          <label className="block text-slate-400 text-[10px] mb-0.5 font-semibold">Duration</label>
                          <input
                            type="text"
                            list="durations-list"
                            placeholder="5 Days"
                            value={med.duration}
                            onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        {/* Instructions */}
                        <div className="sm:col-span-5">
                          <label className="block text-slate-400 text-[10px] mb-0.5 font-semibold">Instructions</label>
                          <input
                            type="text"
                            list="instructions-list"
                            placeholder="After meals with warm water"
                            value={med.instructions}
                            onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>

                        {/* Additional Notes */}
                        <div className="sm:col-span-4">
                          <label className="block text-slate-400 text-[10px] mb-0.5 font-semibold">Special Precaution (Optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Avoid dairy, take with food"
                            value={med.additional_notes || ''}
                            onChange={(e) => handleMedicineChange(index, 'additional_notes', e.target.value)}
                            className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Common Datalists */}
                <datalist id="dosages-list">
                  {COMMON_DOSAGES.map(d => <option key={d} value={d} />)}
                </datalist>
                <datalist id="durations-list">
                  {COMMON_DURATIONS.map(d => <option key={d} value={d} />)}
                </datalist>
                <datalist id="instructions-list">
                  {COMMON_INSTRUCTIONS.map(i => <option key={i} value={i} />)}
                </datalist>
              </div>

              {/* Advice & Follow-Up */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#1E293B]/60 p-4 rounded-xl border border-[#334155]">
                <div className="sm:col-span-2">
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">General Advice & Dietary Instructions</label>
                  <input
                    type="text"
                    value={advice}
                    onChange={(e) => setAdvice(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1 text-[11px]">Next Follow-Up Date</label>
                  <input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-lg px-3 py-2 text-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Save / Preview Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Prescriptions are recorded under official Doctor Reg. No. and synced immediately.
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-900/30"
                  >
                    <Check className="w-4 h-4" />
                    Authorize & Save Prescription
                  </button>
                </div>
              </div>

            </form>
          ) : (
            /* Previous Prescriptions Tab */
            <div className="space-y-4">
              {previousPrescriptions.length === 0 ? (
                <div className="text-center py-10 bg-[#1E293B]/40 rounded-xl border border-[#334155]/60 text-slate-400">
                  <FileText className="w-10 h-10 mx-auto text-slate-500 mb-2 opacity-50" />
                  <p className="font-semibold text-slate-300">No previous prescriptions found for this patient.</p>
                  <p className="text-xs text-slate-500 mt-1">Create the patient's initial prescription using the Create tab above.</p>
                </div>
              ) : (
                previousPrescriptions.map(rx => (
                  <div key={rx.id} className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{rx.prescription_number}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                            {rx.status}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-400 font-medium mt-0.5">Condition: {rx.recorded_condition}</p>
                        <p className="text-[11px] text-slate-400">Prescribed by {rx.doctor_name} on {rx.created_at}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setPreviewPrescription(rx)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
                      >
                        <Printer className="w-3.5 h-3.5 text-emerald-400" />
                        Print / View Full Rx
                      </button>
                    </div>

                    <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155]/60">
                      <span className="text-[11px] text-slate-400 font-semibold block mb-1.5">Prescribed Medicines ({rx.medicines.length}):</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {rx.medicines.map((m, idx) => (
                          <div key={idx} className="bg-[#1E293B]/70 p-2 rounded border border-slate-700/50">
                            <span className="font-bold text-white">{m.name}</span> <span className="text-emerald-400 font-mono">({m.dosage})</span>
                            <div className="text-[11px] text-slate-400">{m.frequency} • {m.duration}</div>
                            <div className="text-[10px] text-slate-500 italic">{m.instructions}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {rx.follow_up_date && (
                      <div className="text-[11px] text-blue-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Follow-Up Date: <strong>{rx.follow_up_date}</strong>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>

      {/* Printable Preview Modal */}
      {previewPrescription && (
        <PrintablePrescription
          prescription={previewPrescription}
          onClose={() => {
            setPreviewPrescription(null);
            if (savedSuccess) onClose();
          }}
        />
      )}
    </div>
  );
};
