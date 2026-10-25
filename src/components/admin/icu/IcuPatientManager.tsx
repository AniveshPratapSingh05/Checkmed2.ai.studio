import React, { useState } from 'react';
import { store } from '../../../lib/store';
import { IcuPatientRecord, IcuVitalsRecord, IcuTimelineEvent, IcuPatientStatus } from '../../../types';
import { 
  User, Activity, FileText, Heart, Thermometer, Wind, AlertCircle, Clock, 
  Stethoscope, Phone, ShieldAlert, Pill, FileSpreadsheet, Plus, ArrowRightLeft,
  ChevronRight, Calendar, UserCheck
} from 'lucide-react';

interface IcuPatientManagerProps {
  hospitalFilter?: string;
  selectedPatientId?: string;
  onOpenVitalsRecorder?: (patient: IcuPatientRecord) => void;
  onOpenTransferModal?: (patient: IcuPatientRecord) => void;
}

export const IcuPatientManager: React.FC<IcuPatientManagerProps> = ({
  hospitalFilter,
  selectedPatientId,
  onOpenVitalsRecorder,
  onOpenTransferModal
}) => {
  const [patients, setPatients] = useState<IcuPatientRecord[]>(store.icuPatients);
  const [activePatient, setActivePatient] = useState<IcuPatientRecord | null>(
    selectedPatientId ? store.icuPatients.find(p => p.patient_id === selectedPatientId) || store.icuPatients[0] || null : store.icuPatients[0] || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'profile' | 'vitals' | 'timeline' | 'meds'>('profile');

  // Doctor Round / Note Modal
  const [showDoctorRoundModal, setShowDoctorRoundModal] = useState(false);
  const [roundTitle, setRoundTitle] = useState('Morning Consultant Round');
  const [roundNotes, setRoundNotes] = useState('');
  const [roundDoctorName, setRoundDoctorName] = useState('Dr. Rajesh Sharma');

  const refreshPatients = () => {
    setPatients([...store.icuPatients]);
    if (activePatient) {
      const refreshed = store.icuPatients.find(p => p.id === activePatient.id);
      if (refreshed) setActivePatient(refreshed);
    }
  };

  const filteredPatients = patients.filter(p => {
    if (hospitalFilter && hospitalFilter !== 'All' && p.hospital_name !== hospitalFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.patient_name.toLowerCase().includes(q) || p.bed_number.toLowerCase().includes(q) || p.diagnosis_notes.toLowerCase().includes(q);
    }
    return true;
  });

  const patientVitals = activePatient 
    ? store.icuVitals.filter(v => v.patient_id === activePatient.patient_id || v.patient_name === activePatient.patient_name)
    : [];

  const patientTimelines = activePatient
    ? store.icuTimelines.filter(t => t.patient_id === activePatient.patient_id)
    : [];

  const latestVitals = patientVitals[0] || null;

  const handleDoctorRoundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient || !roundNotes.trim()) return;

    store.addIcuTimelineEvent({
      patient_id: activePatient.patient_id,
      event_type: 'Doctor Round',
      title: roundTitle,
      description: roundNotes.trim(),
      authorized_user_name: roundDoctorName,
      authorized_user_role: 'Doctor'
    });

    store.logIcuAudit('Doctor Round Logged', `Doctor note added for ${activePatient.patient_name}`, roundDoctorName, 'Doctor');
    refreshPatients();
    setShowDoctorRoundModal(false);
    setRoundNotes('');
  };

  const getStatusBadge = (status: IcuPatientStatus) => {
    switch (status) {
      case 'Critical':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">Critical</span>;
      case 'Stable':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">Stable</span>;
      case 'Guarded':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">Guarded</span>;
      case 'Transferred':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">Transferred</span>;
      case 'Discharged':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">Discharged</span>;
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Patient List Column */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <User className="w-5 h-5 text-sky-600" />
              ICU Patients ({filteredPatients.length})
            </h3>
            <p className="text-xs text-slate-500">Active ICU clinical profiles</p>
          </div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search by patient name, bed..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:outline-none"
        />

        {/* Patient List Cards */}
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {filteredPatients.map((patient) => {
            const isSelected = activePatient?.id === patient.id;
            return (
              <div
                key={patient.id}
                onClick={() => setActivePatient(patient)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'border-sky-500 bg-sky-50/70 shadow-xs ring-1 ring-sky-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-900 text-sm block">{patient.patient_name}</span>
                    <span className="text-[11px] text-slate-500">
                      {patient.age} yrs, {patient.gender} • <span className="font-bold text-sky-700">{patient.blood_group}</span>
                    </span>
                  </div>
                  {getStatusBadge(patient.status)}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="font-semibold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                    Bed: {patient.bed_number}
                  </span>
                  <span className="truncate max-w-[140px] text-slate-500">{patient.attending_doctor_name}</span>
                </div>
              </div>
            );
          })}

          {filteredPatients.length === 0 && (
            <div className="p-6 text-center text-slate-400 text-xs">
              No active ICU patients match search filters.
            </div>
          )}
        </div>
      </div>

      {/* Right Detail Workspace */}
      <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
        {activePatient ? (
          <>
            {/* Header / Summary Card */}
            <div className="p-4 bg-linear-to-r from-slate-900 via-slate-800 to-sky-950 text-white rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{activePatient.patient_name}</h2>
                  {getStatusBadge(activePatient.status)}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <span>Bed: <strong className="text-sky-300">{activePatient.bed_number}</strong></span>
                  <span>•</span>
                  <span>Age/Gender: <strong>{activePatient.age} / {activePatient.gender}</strong></span>
                  <span>•</span>
                  <span>Blood Group: <strong className="text-rose-300">{activePatient.blood_group}</strong></span>
                  <span>•</span>
                  <span>Doctor: <strong>{activePatient.attending_doctor_name}</strong></span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                {onOpenVitalsRecorder && (
                  <button
                    onClick={() => onOpenVitalsRecorder(activePatient)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Activity className="w-4 h-4" /> Record Vitals
                  </button>
                )}
                <button
                  onClick={() => setShowDoctorRoundModal(true)}
                  className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" /> Doctor Round Note
                </button>
                {onOpenTransferModal && (
                  <button
                    onClick={() => onOpenTransferModal(activePatient)}
                    className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowRightLeft className="w-4 h-4" /> Transfer / Discharge
                  </button>
                )}
              </div>
            </div>

            {/* Quick Live Vitals Snapshot Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-rose-700 flex items-center justify-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> Heart Rate
                </span>
                <p className="text-lg font-extrabold text-rose-900 mt-0.5">
                  {latestVitals ? `${latestVitals.heart_rate} bpm` : '--'}
                </p>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-sky-700 flex items-center justify-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-sky-600" /> Blood Pressure
                </span>
                <p className="text-lg font-extrabold text-sky-900 mt-0.5">
                  {latestVitals ? `${latestVitals.systolic_bp}/${latestVitals.diastolic_bp}` : '--'}
                </p>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-blue-700 flex items-center justify-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-blue-600" /> SpO2 Saturation
                </span>
                <p className={`text-lg font-extrabold mt-0.5 ${latestVitals && latestVitals.spo2_percent < 92 ? 'text-rose-600 animate-bounce' : 'text-blue-900'}`}>
                  {latestVitals ? `${latestVitals.spo2_percent}%` : '--'}
                </p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-amber-700 flex items-center justify-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Temp (°F)
                </span>
                <p className="text-lg font-extrabold text-amber-900 mt-0.5">
                  {latestVitals ? `${latestVitals.temperature_f}°F` : '--'}
                </p>
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-purple-700 flex items-center justify-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-purple-600" /> Resp Rate
                </span>
                <p className="text-lg font-extrabold text-purple-900 mt-0.5">
                  {latestVitals ? `${latestVitals.respiratory_rate} /min` : '--'}
                </p>
              </div>
            </div>

            {/* Inner Tabs Navigation */}
            <div className="flex border-b border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Clinical Profile & Diagnosis
              </button>
              <button
                onClick={() => setActiveTab('vitals')}
                className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'vitals'
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Vitals History ({patientVitals.length})
              </button>
              <button
                onClick={() => setActiveTab('timeline')}
                className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'timeline'
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Monitoring Timeline ({patientTimelines.length})
              </button>
              <button
                onClick={() => setActiveTab('meds')}
                className={`pb-3 px-4 transition-colors border-b-2 cursor-pointer ${
                  activeTab === 'meds'
                    ? 'border-sky-600 text-sky-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                Medications & Allergies
              </button>
            </div>

            {/* Tab 1: Profile & Diagnosis */}
            {activeTab === 'profile' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    Primary ICU Diagnosis & Admission Note
                  </span>
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-white p-3 rounded-lg border border-slate-200">
                    {activePatient.diagnosis_notes}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-rose-50/50 rounded-xl border border-rose-200/80 space-y-2">
                    <span className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600" /> Known Allergies
                    </span>
                    <p className="text-rose-800 font-semibold bg-white p-2.5 rounded-lg border border-rose-200">
                      {activePatient.allergies || 'No known drug allergies (NKDA)'}
                    </p>
                  </div>

                  <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/80 space-y-2">
                    <span className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                      <Phone className="w-4 h-4 text-amber-600" /> Emergency Contact
                    </span>
                    <div className="bg-white p-2.5 rounded-lg border border-amber-200 space-y-1">
                      <p className="font-bold text-slate-900">{activePatient.emergency_contact_name}</p>
                      <p className="font-mono text-sky-700">{activePatient.emergency_contact_phone}</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                  <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-slate-600" /> Past Medical History
                  </span>
                  <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                    {activePatient.medical_history || 'No significant past surgical or chronic illness reported.'}
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Vitals History */}
            {activeTab === 'vitals' && (
              <div className="space-y-4">
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">Time</th>
                        <th className="p-3">HR (bpm)</th>
                        <th className="p-3">BP (mmHg)</th>
                        <th className="p-3">SpO2 (%)</th>
                        <th className="p-3">Temp (°F)</th>
                        <th className="p-3">Resp Rate</th>
                        <th className="p-3">Logged By</th>
                        <th className="p-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {patientVitals.map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50">
                          <td className="p-3 font-mono text-slate-600 whitespace-nowrap">
                            {v?.recorded_at ? new Date(v.recorded_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                          </td>
                          <td className="p-3 font-bold text-rose-700">{v.heart_rate}</td>
                          <td className="p-3 font-bold text-sky-800">{v.systolic_bp}/{v.diastolic_bp}</td>
                          <td className={`p-3 font-extrabold ${v.spo2_percent < 90 ? 'text-rose-600 bg-rose-50' : 'text-blue-700'}`}>
                            {v.spo2_percent}%
                          </td>
                          <td className="p-3 font-medium text-amber-800">{v.temperature_f}°F</td>
                          <td className="p-3 font-medium text-purple-800">{v.respiratory_rate}</td>
                          <td className="p-3 text-slate-600">{v.recorded_by_name} ({v.recorded_by_role})</td>
                          <td className="p-3 text-slate-500 max-w-xs truncate">{v.notes || '-'}</td>
                        </tr>
                      ))}

                      {patientVitals.length === 0 && (
                        <tr>
                          <td colSpan={8} className="p-6 text-center text-slate-400">
                            No vitals records logged yet. Click 'Record Vitals' to log initial entry.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Timeline */}
            {activeTab === 'timeline' && (
              <div className="space-y-4">
                <div className="relative pl-6 border-l-2 border-slate-200 space-y-6">
                  {patientTimelines.map((event) => (
                    <div key={event.id} className="relative group">
                      <div className="absolute -left-[31px] top-0 p-1.5 rounded-full bg-sky-600 text-white shadow-xs">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{event.title}</span>
                          <span className="text-[11px] font-mono text-slate-500">{event.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{event.description}</p>
                        <p className="text-[10px] text-slate-400 pt-1 font-medium">
                          Logged by: {event.authorized_user_name} ({event.authorized_user_role})
                        </p>
                      </div>
                    </div>
                  ))}

                  {patientTimelines.length === 0 && (
                    <p className="text-xs text-slate-400 italic">No timeline events logged for this patient yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Tab 4: Medications */}
            {activeTab === 'meds' && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-sky-50/60 rounded-xl border border-sky-200/80 space-y-2">
                  <span className="font-bold text-sky-900 text-sm flex items-center gap-2">
                    <Pill className="w-4 h-4 text-sky-600" /> Current ICU Prescription & IV Regimen
                  </span>
                  <div className="bg-white p-3.5 rounded-lg border border-sky-200 text-slate-800 font-mono text-xs leading-relaxed whitespace-pre-line">
                    {activePatient.current_medications}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center text-slate-400">
            Select a patient from the left list to view clinical ICU profile.
          </div>
        )}
      </div>

      {/* Modal: Add Doctor Round Note */}
      {showDoctorRoundModal && activePatient && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-sky-600" />
                Add Doctor Round Note
              </h3>
              <button
                onClick={() => setShowDoctorRoundModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDoctorRoundSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  required
                  value={roundDoctorName}
                  onChange={(e) => setRoundDoctorName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Round Title</label>
                <select
                  value={roundTitle}
                  onChange={(e) => setRoundTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Morning Consultant Round">Morning Consultant Round</option>
                  <option value="Evening Intensivist Review">Evening Intensivist Review</option>
                  <option value="Emergency Re-evaluation">Emergency Re-evaluation</option>
                  <option value="Specialist Sub-Consultation">Specialist Sub-Consultation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Clinical Observation & Orders *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Chest clear bilateral. ABG within normal limits. Weaning ventilator trial initiated..."
                  value={roundNotes}
                  onChange={(e) => setRoundNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDoctorRoundModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Doctor Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
