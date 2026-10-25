import React, { useState, useEffect } from 'react';
import { Doctor, Patient, DoctorPrescription, DoctorResourceRequest } from '../../types';
import { store } from '../../lib/store';
import { 
  Users, Calendar, Stethoscope, Pill, FileText, 
  Clock, Shield, Heart, Activity, AlertCircle, Plus, Search, Check, RefreshCw,
  Bed, Wind, Building2, CheckCircle2, AlertTriangle, ArrowUpRight
} from 'lucide-react';
import { DoctorHeader } from './DoctorHeader';
import { DoctorSummaryCards } from './DoctorSummaryCards';
import { DoctorPatientList } from './DoctorPatientList';
import { DoctorAppointmentsView } from './DoctorAppointmentsView';
import { DoctorPrescriptionModal } from './DoctorPrescriptionModal';
import { DoctorConsultationModal } from './DoctorConsultationModal';
import { DoctorTimelineModal } from './DoctorTimelineModal';
import { DoctorReportsView } from './DoctorReportsView';
import { DoctorFollowUpsView } from './DoctorFollowUpsView';
import { SharedPatientHistoryModal } from '../admin/modules/SharedPatientHistoryModal';
import { PrintablePrescription } from './PrintablePrescription';
import { DepartmentBannerCard } from '../common/DepartmentBannerCard';
import { DoctorResourceRequestModal } from './DoctorResourceRequestModal';
import { DoctorAdminMessagingView } from './DoctorAdminMessagingView';
import { MessageSquare } from 'lucide-react';

interface DoctorDashboardProps {
  onBackToHospital: () => void;
  initialDoctorId?: string;
}

type TabType = 'overview' | 'patients' | 'appointments' | 'prescriptions' | 'requests' | 'reports' | 'followups' | 'admin-comms' | 'logs';

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  onBackToHospital,
  initialDoctorId
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(store.doctors);
  
  // Active Doctor
  const [activeDoctor, setActiveDoctor] = useState<Doctor>(() => {
    if (initialDoctorId) {
      const found = store.doctors.find(d => d.id === initialDoctorId);
      if (found) return found;
    }
    return store.activeDoctor || store.doctors[0];
  });

  // Modal States
  const [selectedPatientForConsultation, setSelectedPatientForConsultation] = useState<Patient | null>(null);
  const [selectedPatientForPrescription, setSelectedPatientForPrescription] = useState<Patient | null>(null);
  const [selectedPatientForTimeline, setSelectedPatientForTimeline] = useState<Patient | null>(null);
  const [selectedPatientForFullHistory, setSelectedPatientForFullHistory] = useState<Patient | null>(null);
  const [selectedPatientForResource, setSelectedPatientForResource] = useState<Patient | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [previewPrescription, setPreviewPrescription] = useState<DoctorPrescription | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setDoctorsList([...store.doctors]);
      if (store.activeDoctor) {
        const refreshed = store.doctors.find(d => d.id === store.activeDoctor?.id);
        if (refreshed) setActiveDoctor(refreshed);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSelectDoctor = (doctor: Doctor) => {
    setActiveDoctor(doctor);
    store.setActiveDoctor(doctor);
  };

  const handleSummaryCardClick = (cardId: string) => {
    if (cardId === 'my-patients') setActiveTab('patients');
    else if (cardId === 'today-appointments' || cardId === 'completed' || cardId === 'pending') setActiveTab('appointments');
    else if (cardId === 'prescriptions') setActiveTab('prescriptions');
    else if (cardId === 'reports') setActiveTab('reports');
    else if (cardId === 'critical') setActiveTab('patients');
  };

  const getDepartmentKeyForDoctor = (doc: Doctor): string => {
    const spec = (doc.specialization || '').toLowerCase();
    const servs = (doc.services || []).map(s => s.toLowerCase()).join(' ');
    const combined = `${spec} ${servs}`;
    if (combined.includes('cardio') || combined.includes('heart')) return 'cardiology';
    if (combined.includes('mri')) return 'mri';
    if (combined.includes('ct') || combined.includes('neuro')) return 'ctscan';
    if (combined.includes('eye') || combined.includes('ophthalm')) return 'eyecare';
    if (combined.includes('x-ray') || combined.includes('xray') || combined.includes('radio')) return 'xray';
    if (combined.includes('blood') || combined.includes('patho')) return 'pathology';
    if (combined.includes('icu') || combined.includes('critical')) return 'intensivecare';
    return 'cardiology';
  };

  const doctorPatients = store.getDoctorPatients(activeDoctor.id);
  const doctorAppointments = store.getDoctorAppointments(activeDoctor.id);
  const doctorPrescriptions = store.prescriptions.filter(
    p => p.doctor_id === activeDoctor.id || p.doctor_name.toLowerCase().includes(activeDoctor.full_name.toLowerCase())
  );
  const doctorRequests = store.getDoctorResourceRequests(activeDoctor.id);
  const doctorLogs = store.doctorActivityLogs.filter(
    l => l.doctor_id === activeDoctor.id || l.doctor_name.toLowerCase().includes(activeDoctor.full_name.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans pb-16">
      
      {/* 1. Header with Doctor Profile, Back Button, Availability Toggle & Notifications */}
      <DoctorHeader
        doctor={activeDoctor}
        allDoctors={doctorsList}
        onSelectDoctor={handleSelectDoctor}
        onBackToHospital={onBackToHospital}
      />

      {/* Main Workspace Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6 flex-1">
        
        {/* Department Visual Banner */}
        <DepartmentBannerCard
          departmentKey={getDepartmentKeyForDoctor(activeDoctor)}
          onRequestResource={() => {
            setSelectedPatientForResource(doctorPatients[0] || null);
            setShowResourceModal(true);
          }}
        />

        {/* 2. Summary Metric Cards */}
        <DoctorSummaryCards
          doctor={activeDoctor}
          onCardClick={handleSummaryCardClick}
        />

        {/* 3. Navigation Tabs Bar */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-1.5 flex flex-wrap items-center justify-between gap-2 shadow-lg">
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {[
              { id: 'overview', label: 'Overview & Schedule', icon: Activity },
              { id: 'patients', label: `My Patients (${doctorPatients.length})`, icon: Users },
              { id: 'appointments', label: `Appointments (${doctorAppointments.length})`, icon: Calendar },
              { id: 'prescriptions', label: `Prescriptions (${doctorPrescriptions.length})`, icon: Pill },
              { id: 'requests', label: `Resource Orders (${doctorRequests.length})`, icon: Bed },
              { id: 'reports', label: 'Diagnostic Reports', icon: FileText },
              { id: 'followups', label: 'Follow-Up Recall', icon: Clock },
              { id: 'admin-comms', label: 'Admin Comms', icon: MessageSquare },
              { id: 'logs', label: 'Doctor Activity Log', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2 transition ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/30'
                      : 'text-slate-400 hover:text-white hover:bg-[#334155]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedPatientForResource(doctorPatients[0] || null);
                setShowResourceModal(true);
              }}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-sky-900/20 cursor-pointer"
            >
              <Bed className="w-3.5 h-3.5" />
              Order Bed / Room / O2
            </button>
            <button
              onClick={() => setSelectedPatientForPrescription(doctorPatients[0] || null)}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-emerald-900/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Write Prescription
            </button>
          </div>
        </div>

        {/* 4. Tab Content Views */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Quick Actions Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              {/* Write Prescription Quick Card */}
              <div className="bg-gradient-to-br from-emerald-900/40 via-[#1E293B] to-[#1E293B] border border-emerald-500/30 p-5 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Doctor Prescription Studio</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Prescribe medications with dosage schedules, intake instructions, and printable medical layout.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPatientForPrescription(doctorPatients[0] || null)}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  New Prescription
                </button>
              </div>

              {/* Patient Consultation & Clinical Notes */}
              <div className="bg-gradient-to-br from-blue-900/40 via-[#1E293B] to-[#1E293B] border border-blue-500/30 p-5 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Clinical Examination & EHR</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Document chief complaints, clinical examination findings, disease assessments & plan.
                  </p>
                </div>
                <button
                  onClick={() => setSelectedPatientForConsultation(doctorPatients[0] || null)}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  Start Consultation
                </button>
              </div>

              {/* Resource & Bed Allocation Request */}
              <div className="bg-gradient-to-br from-sky-900/40 via-[#1E293B] to-[#1E293B] border border-sky-500/30 p-5 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                  <Bed className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Bed / ICU / Oxygen Orders</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Instantly request inpatient deluxe rooms, cardiac ICU beds, or high-flow oxygen support.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedPatientForResource(doctorPatients[0] || null);
                    setShowResourceModal(true);
                  }}
                  className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <Bed className="w-4 h-4" />
                  Order Bed / Resource
                </button>
              </div>

              {/* Lab & Diagnostic Reviews */}
              <div className="bg-gradient-to-br from-purple-900/40 via-[#1E293B] to-[#1E293B] border border-purple-500/30 p-5 rounded-2xl space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Diagnostic Investigations</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Review verified Pathology, Cardiology, Digital X-Ray, 3T MRI & CT scans with doctor notes.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  Review Reports
                </button>
              </div>

            </div>

            {/* Today's Appointments Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  Active OPD Appointments Queue ({activeDoctor.full_name})
                </h3>
                <button
                  onClick={() => setActiveTab('appointments')}
                  className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
                >
                  View Full Schedule &rarr;
                </button>
              </div>

              <DoctorAppointmentsView
                doctor={activeDoctor}
                onStartConsultation={(p) => setSelectedPatientForConsultation(p)}
                onOpenPrescription={(p) => setSelectedPatientForPrescription(p)}
                onOpenTimeline={(p) => setSelectedPatientForTimeline(p)}
              />
            </div>

          </div>
        )}

        {activeTab === 'patients' && (
          <DoctorPatientList
            doctor={activeDoctor}
            onOpenConsultation={(p) => setSelectedPatientForConsultation(p)}
            onOpenPrescription={(p) => setSelectedPatientForPrescription(p)}
            onOpenTimeline={(p) => setSelectedPatientForTimeline(p)}
            onOpenFullHistory={(p) => setSelectedPatientForFullHistory(p)}
            onRequestResource={(p) => {
              setSelectedPatientForResource(p);
              setShowResourceModal(true);
            }}
          />
        )}

        {activeTab === 'appointments' && (
          <DoctorAppointmentsView
            doctor={activeDoctor}
            onStartConsultation={(p) => setSelectedPatientForConsultation(p)}
            onOpenPrescription={(p) => setSelectedPatientForPrescription(p)}
            onOpenTimeline={(p) => setSelectedPatientForTimeline(p)}
          />
        )}

        {activeTab === 'prescriptions' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
              <div>
                <h3 className="font-bold text-white text-sm">Authorizing Doctor: {activeDoctor.full_name}</h3>
                <p className="text-xs text-slate-400">Total authorized digital prescriptions: {doctorPrescriptions.length}</p>
              </div>
              <button
                onClick={() => setSelectedPatientForPrescription(doctorPatients[0] || null)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-900/30 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Create New Prescription
              </button>
            </div>

            {doctorPrescriptions.length === 0 ? (
              <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-10 text-center text-slate-400">
                <Pill className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-60" />
                <p className="font-semibold text-slate-300 text-sm">No prescriptions created yet by {activeDoctor.full_name}.</p>
                <p className="text-xs text-slate-500 mt-1">Click the button above to write your first clinical prescription.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctorPrescriptions.map(rx => (
                  <div key={rx.id} className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{rx.prescription_number}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold text-[10px] border border-emerald-500/30">
                            {rx.status}
                          </span>
                        </div>
                        <p className="text-xs text-emerald-400 font-medium mt-0.5">Patient: {rx.patient_name} ({rx.patient_id})</p>
                        <p className="text-[11px] text-slate-400">Date: {rx.created_at} • Diagnosis: {rx.recorded_condition}</p>
                      </div>

                      <button
                        onClick={() => setPreviewPrescription(rx)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-emerald-400" />
                        Print / View
                      </button>
                    </div>

                    <div className="bg-[#0F172A] p-2.5 rounded-lg border border-slate-800 text-xs">
                      <span className="text-slate-400 text-[10px] font-semibold uppercase block mb-1">Prescribed Medicines ({rx.medicines.length}):</span>
                      <ul className="space-y-1">
                        {rx.medicines.map((m, idx) => (
                          <li key={idx} className="flex items-center justify-between text-slate-300">
                            <span>• <strong>{m.name}</strong> ({m.dosage})</span>
                            <span className="text-[11px] text-slate-400 font-mono">{m.frequency} ({m.duration})</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {rx.follow_up_date && (
                      <div className="text-[11px] text-blue-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        Follow-Up Target: <strong>{rx.follow_up_date}</strong>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Resource Orders Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1E293B] p-4 rounded-xl border border-[#334155]">
              <div>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                  <Bed className="w-4 h-4 text-sky-400" />
                  Hospital Resource Orders & Inpatient Bed Allocation
                </h3>
                <p className="text-xs text-slate-400">
                  Manage doctor requests for Patient Rooms, Cardiac/Neuro ICU beds, and High-Flow Oxygen support.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedPatientForResource(doctorPatients[0] || null);
                  setShowResourceModal(true);
                }}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-sky-900/30 cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                New Resource Request
              </button>
            </div>

            {doctorRequests.length === 0 ? (
              <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-10 text-center text-slate-400">
                <Bed className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-60" />
                <p className="font-semibold text-slate-300 text-sm">No hospital resource orders placed yet by {activeDoctor.full_name}.</p>
                <p className="text-xs text-slate-500 mt-1">Click the button above to request a Room, ICU Bed, or Oxygen Support for a patient.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctorRequests.map(req => {
                  const isAllocated = req.status === 'Allocated' || req.status === 'Approved';
                  const isPending = req.status === 'Pending';
                  return (
                    <div key={req.id} className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] space-y-3 shadow-md">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm flex items-center gap-1.5">
                              {req.request_type === 'Room' && <Bed className="w-4 h-4 text-sky-400" />}
                              {req.request_type === 'ICU Bed' && <Activity className="w-4 h-4 text-red-400" />}
                              {req.request_type === 'Oxygen Support' && <Wind className="w-4 h-4 text-cyan-400" />}
                              {req.request_type}: {req.room_type || req.request_type}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300">
                            Patient: <strong className="text-white">{req.patient_name}</strong> ({req.patient_id})
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Ordered: {req.request_time} • Hospital: {req.hospital_name}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            req.status === 'Allocated' || req.status === 'Approved'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : req.status === 'Pending'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-red-500/20 text-red-300 border-red-500/40'
                          }`}>
                            {req.status}
                          </span>

                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            req.priority === 'Critical' || req.priority === 'Emergency'
                              ? 'bg-red-500/20 text-red-400'
                              : req.priority === 'Urgent'
                              ? 'bg-amber-500/20 text-amber-400'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {req.priority} Priority
                          </span>
                        </div>
                      </div>

                      {/* Clinical Reason */}
                      <div className="bg-[#0F172A] p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                        <span className="text-slate-400 text-[10px] font-semibold uppercase block">Clinical Indication:</span>
                        <p className="text-slate-200">{req.reason}</p>
                      </div>

                      {/* Allocation Notice if approved */}
                      {isAllocated && (req.room_no || req.bed_number) && (
                        <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                          <span className="flex items-center gap-1.5 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            Allocated Assignment:
                          </span>
                          <span className="font-mono font-black text-white bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
                            {req.room_no ? `Room ${req.room_no}` : `Bed ${req.bed_number}`}
                          </span>
                        </div>
                      )}

                      {req.admin_notes && (
                        <p className="text-[11px] text-slate-400 italic">
                          Ops Note: "{req.admin_notes}"
                        </p>
                      )}

                      {/* Fast Action Buttons */}
                      {isPending && (
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            onClick={() => store.updateDoctorResourceRequestStatus(req.id, 'Allocated', 'Directly allocated by doctor priority', 'Room-204')}
                            className="px-2.5 py-1 bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/40 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            Mark Allocated
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <DoctorReportsView
            doctor={activeDoctor}
            onOpenPatientConsultation={(patId) => {
              const p = store.patients.find(pt => pt.id === patId);
              if (p) setSelectedPatientForConsultation(p);
            }}
          />
        )}

        {activeTab === 'followups' && (
          <DoctorFollowUpsView
            doctor={activeDoctor}
            onOpenConsultation={(p) => setSelectedPatientForConsultation(p)}
            onOpenPrescription={(p) => setSelectedPatientForPrescription(p)}
            onOpenTimeline={(p) => setSelectedPatientForTimeline(p)}
          />
        )}

        {activeTab === 'admin-comms' && (
          <div className="animate-fadeIn">
            <DoctorAdminMessagingView doctor={activeDoctor} />
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-sm">Doctor Privacy & Clinical Action Audit Trail</h3>
                <p className="text-xs text-slate-400">
                  Immutable log of all consultations, prescriptions, reports reviewed and status changes for {activeDoctor.full_name}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Shield className="w-3.5 h-3.5" />
                HIPAA & NABH Compliant
              </div>
            </div>

            <div className="bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden shadow-lg">
              <div className="divide-y divide-slate-800 max-h-[600px] overflow-y-auto">
                {doctorLogs.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 text-xs">
                    No activity logs recorded yet.
                  </div>
                ) : (
                  doctorLogs.map(log => (
                    <div key={log.id} className="p-3.5 hover:bg-[#334155]/40 transition flex items-start justify-between gap-4 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{log.action}</span>
                          {log.patient_name && (
                            <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 text-[11px] border border-blue-500/20 font-medium">
                              Patient: {log.patient_name}
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300">{log.details}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono shrink-0">{log.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      {/* MODALS */}

      {/* 1. Clinical Consultation Modal */}
      {selectedPatientForConsultation && (
        <DoctorConsultationModal
          doctor={activeDoctor}
          patient={selectedPatientForConsultation}
          onClose={() => setSelectedPatientForConsultation(null)}
          onOpenPrescription={(p) => {
            setSelectedPatientForConsultation(null);
            setSelectedPatientForPrescription(p);
          }}
          onOpenTimeline={(p) => {
            setSelectedPatientForConsultation(null);
            setSelectedPatientForTimeline(p);
          }}
        />
      )}

      {/* 2. Prescription Builder Modal */}
      {selectedPatientForPrescription && (
        <DoctorPrescriptionModal
          doctor={activeDoctor}
          initialPatient={selectedPatientForPrescription}
          onClose={() => setSelectedPatientForPrescription(null)}
          onSaved={(rx) => setPreviewPrescription(rx)}
        />
      )}

      {/* 3. Patient Timeline Modal */}
      {selectedPatientForTimeline && (
        <DoctorTimelineModal
          doctor={activeDoctor}
          patient={selectedPatientForTimeline}
          onClose={() => setSelectedPatientForTimeline(null)}
        />
      )}

      {/* 4. Full Unified EHR History Modal */}
      {selectedPatientForFullHistory && (
        <SharedPatientHistoryModal
          patientId={selectedPatientForFullHistory.id}
          patientName={selectedPatientForFullHistory.full_name}
          onClose={() => setSelectedPatientForFullHistory(null)}
        />
      )}

      {/* 5. Printable Prescription Modal */}
      {previewPrescription && (
        <PrintablePrescription
          prescription={previewPrescription}
          onClose={() => setPreviewPrescription(null)}
        />
      )}

      {/* 6. Doctor Resource Request Modal */}
      {showResourceModal && (
        <DoctorResourceRequestModal
          doctor={activeDoctor}
          initialPatient={selectedPatientForResource}
          onClose={() => {
            setShowResourceModal(false);
            setSelectedPatientForResource(null);
          }}
          onSuccess={() => {
            setActiveTab('requests');
          }}
        />
      )}

    </div>
  );
};
