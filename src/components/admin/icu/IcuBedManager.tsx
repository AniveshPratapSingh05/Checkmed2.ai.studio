import React, { useState } from 'react';
import { store } from '../../../lib/store';
import { IcuBedRecord, IcuBedStatus, IcuType } from '../../../types';
import { 
  Bed, User, UserCheck, ShieldAlert, Sparkles, Filter, Plus, Clock, 
  CheckCircle2, AlertTriangle, RefreshCw, AlertCircle, Phone, Stethoscope
} from 'lucide-react';

interface IcuBedManagerProps {
  hospitalFilter?: string;
  onSelectPatient?: (patientId: string) => void;
}

export const IcuBedManager: React.FC<IcuBedManagerProps> = ({ hospitalFilter, onSelectPatient }) => {
  const [beds, setBeds] = useState<IcuBedRecord[]>(store.icuBeds);
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [isolationOnly, setIsolationOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [editingBed, setEditingBed] = useState<IcuBedRecord | null>(null);
  const [showAdmitModal, setShowAdmitModal] = useState<IcuBedRecord | null>(null);
  const [showAddBedModal, setShowAddBedModal] = useState<boolean>(false);

  // New Bed Form
  const [newBedNumber, setNewBedNumber] = useState('');
  const [newIcuType, setNewIcuType] = useState<IcuType>('Medical ICU (MICU)');
  const [newIsolation, setNewIsolation] = useState(false);
  const [newHospital, setNewHospital] = useState('Sir Sunderlal Hospital (IMS BHU)');

  // Admit Form State
  const [admitPatientName, setAdmitPatientName] = useState('');
  const [admitAge, setAdmitAge] = useState('45');
  const [admitGender, setAdmitGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [admitBloodGroup, setAdmitBloodGroup] = useState('O+');
  const [admitDoctor, setAdmitDoctor] = useState('Dr. Rajesh Sharma');
  const [admitNurse, setAdmitNurse] = useState('Sister Anjali Verma');
  const [admitDiagnosis, setAdmitDiagnosis] = useState('');
  const [admitAllergies, setAdmitAllergies] = useState('None');
  const [admitMeds, setAdmitMeds] = useState('');
  const [admitEmergencyContact, setAdmitEmergencyContact] = useState('');
  const [admitPhone, setAdmitPhone] = useState('');

  const refreshBeds = () => {
    setBeds([...store.icuBeds]);
  };

  const filteredBeds = beds.filter(bed => {
    if (hospitalFilter && hospitalFilter !== 'All' && bed.hospital_name !== hospitalFilter) return false;
    if (selectedType !== 'All' && bed.icu_type !== selectedType) return false;
    if (selectedStatus !== 'All' && bed.status !== selectedStatus) return false;
    if (isolationOnly && !bed.isolation_required) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchBed = bed.bed_number.toLowerCase().includes(q);
      const matchPatient = bed.patient_name?.toLowerCase().includes(q);
      const matchDoc = bed.attending_doctor_name?.toLowerCase().includes(q);
      if (!matchBed && !matchPatient && !matchDoc) return false;
    }
    return true;
  });

  const handleStatusChange = (bedId: string, newStatus: IcuBedStatus) => {
    store.updateIcuBedStatus(bedId, newStatus, {}, 'Admin Nurse', 'Nurse');
    refreshBeds();
    setEditingBed(null);
  };

  const handleAddBedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBedNumber.trim()) return;
    store.addIcuBed({
      bed_number: newBedNumber.trim(),
      icu_type: newIcuType,
      status: 'Available',
      isolation_required: newIsolation,
      hospital_name: newHospital,
      city: 'Varanasi'
    });
    refreshBeds();
    setShowAddBedModal(false);
    setNewBedNumber('');
  };

  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showAdmitModal || !admitPatientName.trim()) return;

    const patientId = `pat-${Date.now().toString().slice(-4)}`;
    
    // Create ICU Patient
    store.addIcuPatient({
      patient_id: patientId,
      patient_name: admitPatientName.trim(),
      age: parseInt(admitAge) || 40,
      gender: admitGender,
      blood_group: admitBloodGroup,
      bed_id: showAdmitModal.id,
      bed_number: showAdmitModal.bed_number,
      attending_doctor_id: 'doc-1',
      attending_doctor_name: admitDoctor,
      assigned_nurse_id: 'nurse-1',
      assigned_nurse_name: admitNurse,
      admission_datetime: new Date().toISOString().slice(0, 16),
      diagnosis_notes: admitDiagnosis || 'Admitted to ICU for severe critical monitoring',
      allergies: admitAllergies,
      current_medications: admitMeds || 'As per ICU protocol',
      medical_history: 'None reported at admission',
      emergency_contact_name: admitEmergencyContact || 'Next of Kin',
      emergency_contact_phone: admitPhone || '+91 98000 00000',
      hospital_name: showAdmitModal.hospital_name || 'Hospital',
      city: showAdmitModal.city || 'Varanasi',
      status: 'Critical'
    });

    refreshBeds();
    setShowAdmitModal(null);
    setAdmitPatientName('');
    setAdmitDiagnosis('');
  };

  const getStatusBadge = (status: IcuBedStatus) => {
    switch (status) {
      case 'Available':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Available</span>;
      case 'Occupied':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Occupied</span>;
      case 'Reserved':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-amber-600" /> Reserved</span>;
      case 'Cleaning':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Cleaning</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bed className="w-6 h-6 text-sky-600" />
            ICU Bed Management & Allocation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time bed tracking, isolation requirements, status lifecycle management (Available → Reserved → Occupied → Cleaning)
          </p>
        </div>
        <button
          onClick={() => setShowAddBedModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-medium text-sm rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New ICU Bed
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <Filter className="w-4 h-4 text-slate-600" />
          Filters:
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search bed no, patient or doctor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 w-48 sm:w-60"
        />

        {/* ICU Type Filter */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="All">All ICU Types</option>
          <option value="Medical ICU (MICU)">Medical ICU (MICU)</option>
          <option value="Surgical ICU (SICU)">Surgical ICU (SICU)</option>
          <option value="Cardiac Care Unit (CCU)">Cardiac Care Unit (CCU)</option>
          <option value="Pediatric ICU (PICU)">Pediatric ICU (PICU)</option>
          <option value="Neonatal ICU (NICU)">Neonatal ICU (NICU)</option>
          <option value="Trauma ICU (TICU)">Trauma ICU (TICU)</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          <option value="All">All Statuses</option>
          <option value="Available">Available</option>
          <option value="Occupied">Occupied</option>
          <option value="Reserved">Reserved</option>
          <option value="Cleaning">Cleaning</option>
        </select>

        {/* Isolation Filter */}
        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white px-3 py-1.5 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
          <input
            type="checkbox"
            checked={isolationOnly}
            onChange={(e) => setIsolationOnly(e.target.checked)}
            className="rounded text-sky-600 focus:ring-sky-500"
          />
          <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
          Isolation Beds Only
        </label>

        <button
          onClick={refreshBeds}
          className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      {/* Bed Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBeds.map((bed) => (
          <div
            key={bed.id}
            className={`bg-white rounded-2xl border p-4 transition-all hover:shadow-md flex flex-col justify-between ${
              bed.status === 'Occupied'
                ? 'border-rose-200 bg-linear-to-b from-rose-50/30 to-white'
                : bed.status === 'Reserved'
                ? 'border-amber-200 bg-linear-to-b from-amber-50/30 to-white'
                : bed.status === 'Cleaning'
                ? 'border-cyan-200 bg-linear-to-b from-cyan-50/30 to-white'
                : 'border-emerald-200 bg-linear-to-b from-emerald-50/20 to-white'
            }`}
          >
            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">{bed.bed_number}</span>
                    {bed.isolation_required && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1" title="Isolation Protection Required">
                        <ShieldAlert className="w-3 h-3" /> ISO
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-slate-500">{bed.icu_type}</span>
                </div>
                {getStatusBadge(bed.status)}
              </div>

              {/* Patient / Details section */}
              <div className="py-3 text-xs space-y-2">
                {bed.status === 'Occupied' && bed.patient_name ? (
                  <>
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Patient:</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-sky-600" />
                          {bed.patient_name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Doctor:</span>
                        <span className="font-medium text-slate-800">{bed.attending_doctor_name || 'Dr. Assigned'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span>Nurse:</span>
                        <span className="font-medium text-slate-800">{bed.assigned_nurse_name || 'Nurse On Duty'}</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-500 text-[11px] pt-1 border-t border-slate-200/60">
                        <span>Admitted:</span>
                        <span className="font-mono text-slate-700">{bed.admission_datetime ? bed.admission_datetime.replace('T', ' ') : 'N/A'}</span>
                      </div>
                    </div>
                  </>
                ) : bed.status === 'Reserved' ? (
                  <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/60 text-amber-900 text-center space-y-1">
                    <p className="font-semibold text-xs">Bed Reserved for Transfer</p>
                    <p className="text-[11px] text-amber-700">{bed.admission_datetime || 'Awaiting patient transfer'}</p>
                  </div>
                ) : bed.status === 'Cleaning' ? (
                  <div className="p-2.5 bg-cyan-50/80 rounded-xl border border-cyan-200/60 text-cyan-900 text-center space-y-1">
                    <p className="font-semibold text-xs flex items-center justify-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600" /> Disinfection in Progress
                    </p>
                    <p className="text-[11px] text-cyan-700">Sanitizing ventilator & bed area</p>
                  </div>
                ) : (
                  <div className="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-200/60 text-emerald-800 text-center space-y-1">
                    <p className="font-semibold text-xs text-emerald-700">Ready for Emergency Patient</p>
                    <p className="text-[11px] text-emerald-600">Equipment calibrated & sterile</p>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                  <span>Hospital:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{bed.hospital_name || 'Main Campus'}</span>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              {bed.status === 'Available' ? (
                <>
                  <button
                    onClick={() => setShowAdmitModal(bed)}
                    className="flex-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" /> Admit Patient
                  </button>
                  <button
                    onClick={() => handleStatusChange(bed.id, 'Reserved')}
                    className="px-2.5 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                    title="Reserve bed for incoming transfer"
                  >
                    Reserve
                  </button>
                </>
              ) : bed.status === 'Occupied' ? (
                <>
                  {bed.patient_id && onSelectPatient && (
                    <button
                      onClick={() => onSelectPatient(bed.patient_id!)}
                      className="flex-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Patient Profile
                    </button>
                  )}
                  <button
                    onClick={() => setEditingBed(bed)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Status
                  </button>
                </>
              ) : bed.status === 'Cleaning' ? (
                <button
                  onClick={() => handleStatusChange(bed.id, 'Available')}
                  className="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Mark Ready & Available
                </button>
              ) : (
                <button
                  onClick={() => setEditingBed(bed)}
                  className="w-full px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Update Bed Status
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Change Status */}
      {editingBed && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">
                Update Status: {editingBed.bed_number}
              </h3>
              <button
                onClick={() => setEditingBed(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Select the new status for this ICU Bed. Changing status to 'Cleaning' or 'Available' will release current allocation logs.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {(['Available', 'Reserved', 'Occupied', 'Cleaning'] as IcuBedStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(editingBed.id, status)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                    editingBed.status === status
                      ? 'border-sky-500 bg-sky-50 text-sky-900 ring-2 ring-sky-400'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setEditingBed(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Admit Patient to Bed */}
      {showAdmitModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-5 border border-slate-200 shadow-xl my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-sky-600" />
                  ICU Patient Admission Form
                </h3>
                <p className="text-xs text-slate-500">Allocating Bed: <span className="font-bold text-slate-900">{showAdmitModal.bed_number}</span> ({showAdmitModal.icu_type})</p>
              </div>
              <button
                onClick={() => setShowAdmitModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdmitSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={admitPatientName}
                    onChange={(e) => setAdmitPatientName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age & Gender</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={admitAge}
                      onChange={(e) => setAdmitAge(e.target.value)}
                      className="w-20 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    />
                    <select
                      value={admitGender}
                      onChange={(e) => setAdmitGender(e.target.value as any)}
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={admitBloodGroup}
                    onChange={(e) => setAdmitBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Attending Doctor</label>
                  <input
                    type="text"
                    value={admitDoctor}
                    onChange={(e) => setAdmitDoctor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Nurse</label>
                  <input
                    type="text"
                    value={admitNurse}
                    onChange={(e) => setAdmitNurse(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Spouse / Brother"
                    value={admitEmergencyContact}
                    onChange={(e) => setAdmitEmergencyContact(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Emergency Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98000 00000"
                    value={admitPhone}
                    onChange={(e) => setAdmitPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Allergies (if any)</label>
                  <input
                    type="text"
                    placeholder="e.g. Penicillin, Sulfa"
                    value={admitAllergies}
                    onChange={(e) => setAdmitAllergies(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Clinical Diagnosis / Admission Reason *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Acute Respiratory Distress Syndrome (ARDS), post-op monitoring, shock..."
                  value={admitDiagnosis}
                  onChange={(e) => setAdmitDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Initial ICU Medication & Order Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Inj Ceftriaxone 1g IV BD, O2 support @ 6L/min"
                  value={admitMeds}
                  onChange={(e) => setAdmitMeds(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm ICU Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add New ICU Bed */}
      {showAddBedModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <Bed className="w-5 h-5 text-sky-600" />
                Add New ICU Bed
              </h3>
              <button
                onClick={() => setShowAddBedModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddBedSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Bed Number / Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MICU-Bed-05 or TICU-10"
                  value={newBedNumber}
                  onChange={(e) => setNewBedNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ICU Type</label>
                <select
                  value={newIcuType}
                  onChange={(e) => setNewIcuType(e.target.value as IcuType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Medical ICU (MICU)">Medical ICU (MICU)</option>
                  <option value="Surgical ICU (SICU)">Surgical ICU (SICU)</option>
                  <option value="Cardiac Care Unit (CCU)">Cardiac Care Unit (CCU)</option>
                  <option value="Pediatric ICU (PICU)">Pediatric ICU (PICU)</option>
                  <option value="Neonatal ICU (NICU)">Neonatal ICU (NICU)</option>
                  <option value="Trauma ICU (TICU)">Trauma ICU (TICU)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hospital Campus</label>
                <select
                  value={newHospital}
                  onChange={(e) => setNewHospital(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Sir Sunderlal Hospital (IMS BHU)">Sir Sunderlal Hospital (BHU)</option>
                  <option value="Heritage Hospitals">Heritage Hospitals</option>
                  <option value="King George's Medical University (KGMU)">King George's Medical University (KGMU)</option>
                  <option value="Medanta Super Speciality Hospital">Medanta Super Speciality Hospital</option>
                  <option value="Regency Hospital (Rawatpur)">Regency Hospital</option>
                  <option value="BRD Medical College & Hospital">BRD Medical College</option>
                  <option value="MLN Medical College & SRN Hospital">MLN Medical College (SRN)</option>
                </select>
              </div>

              <div className="p-3 bg-purple-50 rounded-xl border border-purple-200">
                <label className="flex items-center gap-2 text-purple-900 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsolation}
                    onChange={(e) => setNewIsolation(e.target.checked)}
                    className="rounded text-purple-600 focus:ring-purple-500"
                  />
                  <ShieldAlert className="w-4 h-4 text-purple-600" />
                  Isolation Protocol Bed (Negative Pressure)
                </label>
                <p className="text-[11px] text-purple-700 mt-1">Check if this bed is equipped for infectious disease quarantine.</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddBedModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Create Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
