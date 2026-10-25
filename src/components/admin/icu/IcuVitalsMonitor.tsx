import React, { useState } from 'react';
import { store } from '../../../lib/store';
import { IcuVitalsRecord, IcuPatientRecord } from '../../../types';
import { 
  Activity, Heart, Thermometer, Wind, Plus, Clock, AlertTriangle, CheckCircle2, User
} from 'lucide-react';

interface IcuVitalsMonitorProps {
  hospitalFilter?: string;
  preselectedPatient?: IcuPatientRecord | null;
}

export const IcuVitalsMonitor: React.FC<IcuVitalsMonitorProps> = ({ hospitalFilter, preselectedPatient }) => {
  const [vitalsList, setVitalsList] = useState<IcuVitalsRecord[]>(store.icuVitals);
  const [patients] = useState<IcuPatientRecord[]>(store.icuPatients);
  
  // Selected Patient for Entry Form
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    preselectedPatient ? preselectedPatient.patient_id : patients[0]?.patient_id || ''
  );

  // Form Fields
  const [heartRate, setHeartRate] = useState<number>(80);
  const [systolicBp, setSystolicBp] = useState<number>(120);
  const [diastolicBp, setDiastolicBp] = useState<number>(80);
  const [temperature, setTemperature] = useState<number>(98.6);
  const [spo2, setSpo2] = useState<number>(98);
  const [respRate, setRespRate] = useState<number>(18);
  const [notes, setNotes] = useState<string>('');
  const [recorderName, setRecorderName] = useState<string>('Sister Anjali Verma');
  const [recorderRole, setRecorderRole] = useState<'Doctor' | 'Nurse' | 'Admin'>('Nurse');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const refreshVitals = () => {
    setVitalsList([...store.icuVitals]);
  };

  const handleVitalsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find(p => p.patient_id === selectedPatientId || p.id === selectedPatientId);
    if (!patient) return;

    store.recordIcuVitals({
      patient_id: patient.patient_id,
      patient_name: patient.patient_name,
      bed_number: patient.bed_number,
      recorded_by_name: recorderName,
      recorded_by_role: recorderRole,
      heart_rate: heartRate,
      systolic_bp: systolicBp,
      diastolic_bp: diastolicBp,
      temperature_f: temperature,
      spo2_percent: spo2,
      respiratory_rate: respRate,
      notes: notes.trim()
    });

    refreshVitals();
    setToastMessage(`Vitals successfully logged for ${patient.patient_name} (${patient.bed_number})`);
    setTimeout(() => setToastMessage(null), 4000);
    setNotes('');
  };

  const selectedPatientObj = patients.find(p => p.patient_id === selectedPatientId || p.id === selectedPatientId);
  const patientVitalsHistory = vitalsList.filter(v => v.patient_id === selectedPatientId || (selectedPatientObj && v.patient_name === selectedPatientObj.patient_name));

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white p-3.5 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-200" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-6 h-6 text-emerald-600" />
            ICU Live Vitals Monitoring Engine
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Timestamped vitals entry, clinical anomaly triggers, automated trend logging
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Entry Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
            <Plus className="w-4 h-4 text-emerald-600" />
            Record Timestamped Vitals Entry
          </h3>

          <form onSubmit={handleVitalsSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select ICU Patient *</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.patient_id}>
                    {p.patient_name} — Bed: {p.bed_number} ({p.hospital_name || 'Hospital'})
                  </option>
                ))}
              </select>
            </div>

            {/* Vitals Inputs Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-200/80">
                <label className="block font-bold text-rose-900 mb-1 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600" /> Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  required
                  min={30}
                  max={250}
                  value={heartRate}
                  onChange={(e) => setHeartRate(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-rose-300 rounded-lg text-rose-900 font-extrabold text-sm focus:ring-2 focus:ring-rose-500"
                />
                <span className="text-[10px] text-rose-600 font-medium">Normal: 60 - 100 bpm</span>
              </div>

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200/80">
                <label className="block font-bold text-blue-900 mb-1 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-blue-600" /> SpO2 Saturation (%)
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  max={100}
                  value={spo2}
                  onChange={(e) => setSpo2(parseInt(e.target.value) || 0)}
                  className={`w-full px-3 py-1.5 bg-white border rounded-lg font-extrabold text-sm focus:ring-2 ${
                    spo2 < 90 ? 'border-rose-500 text-rose-600 bg-rose-50 animate-pulse' : 'border-blue-300 text-blue-900'
                  }`}
                />
                <span className="text-[10px] text-blue-600 font-medium">Target: ≥ 95%</span>
              </div>

              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200/80">
                <label className="block font-bold text-sky-900 mb-1 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-sky-600" /> Systolic BP (mmHg)
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  max={250}
                  value={systolicBp}
                  onChange={(e) => setSystolicBp(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-sky-900 font-extrabold text-sm"
                />
              </div>

              <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-200/80">
                <label className="block font-bold text-sky-900 mb-1 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-sky-600" /> Diastolic BP (mmHg)
                </label>
                <input
                  type="number"
                  required
                  min={30}
                  max={180}
                  value={diastolicBp}
                  onChange={(e) => setDiastolicBp(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-sky-300 rounded-lg text-sky-900 font-extrabold text-sm"
                />
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                <label className="block font-bold text-amber-900 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  min={90}
                  max={108}
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value) || 98.6)}
                  className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-amber-900 font-extrabold text-sm"
                />
              </div>

              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-200/80">
                <label className="block font-bold text-purple-900 mb-1 flex items-center gap-1">
                  <Wind className="w-3.5 h-3.5 text-purple-600" /> Resp Rate (/min)
                </label>
                <input
                  type="number"
                  required
                  min={8}
                  max={60}
                  value={respRate}
                  onChange={(e) => setRespRate(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-white border border-purple-300 rounded-lg text-purple-900 font-extrabold text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Logged By Staff Name</label>
                <input
                  type="text"
                  required
                  value={recorderName}
                  onChange={(e) => setRecorderName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={recorderRole}
                  onChange={(e) => setRecorderRole(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Nurse">Nurse</option>
                  <option value="Doctor">Doctor</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nursing / Observation Notes</label>
              <textarea
                rows={2}
                placeholder="e.g. Suctioning performed, FiO2 adjusted to 45%, patient sleeping..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Save & Broadcast Vitals Log
            </button>
          </form>
        </div>

        {/* History Table for Selected Patient */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                Vitals Log History: {selectedPatientObj ? selectedPatientObj.patient_name : 'Patient'}
              </h3>
              <p className="text-xs text-slate-500">
                Bed: <strong className="text-slate-800">{selectedPatientObj?.bed_number || 'N/A'}</strong>
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3">Logged At</th>
                  <th className="p-3">HR</th>
                  <th className="p-3">BP</th>
                  <th className="p-3">SpO2</th>
                  <th className="p-3">Temp</th>
                  <th className="p-3">RR</th>
                  <th className="p-3">Logged By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patientVitalsHistory.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-600 whitespace-nowrap">
                      {v?.recorded_at ? new Date(v.recorded_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                    </td>
                    <td className="p-3 font-bold text-rose-700">{v.heart_rate} bpm</td>
                    <td className="p-3 font-bold text-sky-800">{v.systolic_bp}/{v.diastolic_bp}</td>
                    <td className={`p-3 font-extrabold ${v.spo2_percent < 90 ? 'text-rose-600 bg-rose-50' : 'text-blue-700'}`}>
                      {v.spo2_percent}%
                    </td>
                    <td className="p-3 font-medium text-amber-800">{v.temperature_f}°F</td>
                    <td className="p-3 font-medium text-purple-800">{v.respiratory_rate}</td>
                    <td className="p-3 text-slate-600">{v.recorded_by_name}</td>
                  </tr>
                ))}

                {patientVitalsHistory.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No vitals records found for this patient.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
