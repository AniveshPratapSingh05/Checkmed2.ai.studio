import React, { useState } from 'react';
import { store } from '../../lib/store';
import { IcuPatientRecord } from '../../types';
import { IcuBedManager } from './icu/IcuBedManager';
import { IcuPatientManager } from './icu/IcuPatientManager';
import { IcuVitalsMonitor } from './icu/IcuVitalsMonitor';
import { IcuEquipmentTracker } from './icu/IcuEquipmentTracker';
import { IcuStaffRoster } from './icu/IcuStaffRoster';
import { IcuTransferDischarge } from './icu/IcuTransferDischarge';
import { IcuAnalyticsAudit } from './icu/IcuAnalyticsAudit';
import { 
  Activity, Bed, User, Wind, UserCheck, ArrowRightLeft, BarChart3, AlertTriangle, CheckCircle2,
  Clock, ShieldAlert, Sparkles, Building2
} from 'lucide-react';

interface ICUManagementProps {
  hospitalFilter?: string;
}

export const ICUManagement: React.FC<ICUManagementProps> = ({ hospitalFilter }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'beds' | 'patients' | 'vitals' | 'equipment' | 'roster' | 'transfer' | 'audit'>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<IcuPatientRecord | null>(null);

  const beds = store.icuBeds;
  const filteredBeds = hospitalFilter && hospitalFilter !== 'All' ? beds.filter(b => b.hospital_name === hospitalFilter) : beds;
  
  const totalBeds = filteredBeds.length;
  const occupiedBeds = filteredBeds.filter(b => b.status === 'Occupied').length;
  const availableBeds = filteredBeds.filter(b => b.status === 'Available').length;
  const reservedBeds = filteredBeds.filter(b => b.status === 'Reserved').length;
  const cleaningBeds = filteredBeds.filter(b => b.status === 'Cleaning').length;

  const totalPatients = store.icuPatients.length;
  const totalVentilators = store.icuEquipment.filter(e => e.equipment_type.includes('Ventilator')).length;
  const ventilatorsInUse = store.icuEquipment.filter(e => e.equipment_type.includes('Ventilator') && e.status === 'In Use').length;
  const availableVentilators = totalVentilators - ventilatorsInUse;

  const doctorsOnDuty = store.icuStaff.filter(s => s.role === 'Doctor' && s.status === 'On Duty').length;
  const nursesOnDuty = store.icuStaff.filter(s => s.role === 'Nurse' && s.status === 'On Duty').length;

  const activeAlerts = store.icuAlerts.filter(a => !a.is_resolved);

  const handleSelectPatientProfile = (patientId: string) => {
    const p = store.icuPatients.find(item => item.patient_id === patientId || item.id === patientId);
    if (p) {
      setSelectedPatient(p);
      setActiveTab('patients');
    }
  };

  const handleOpenVitalsRecorder = (p: IcuPatientRecord) => {
    setSelectedPatient(p);
    setActiveTab('vitals');
  };

  const handleOpenTransferModal = (p: IcuPatientRecord) => {
    setSelectedPatient(p);
    setActiveTab('transfer');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Banner Header */}
      <div className="bg-linear-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-sky-500/20 text-sky-400 rounded-2xl border border-sky-400/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight">ICU Intensive Care Management System</h1>
          </div>
          <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
            Real-time critical care monitoring, bed state lifecycle tracking, ventilator allocation, oxygen pressure monitoring & staff duty coordination.
          </p>
        </div>

        {hospitalFilter && hospitalFilter !== 'All' && (
          <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-semibold flex items-center gap-2">
            <Building2 className="w-4 h-4 text-sky-300" />
            Filtered Hospital: <span className="text-white font-bold">{hospitalFilter}</span>
          </div>
        )}
      </div>

      {/* Main Sub-Navigation Bar */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'dashboard'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" /> ICU Dashboard
        </button>

        <button
          onClick={() => setActiveTab('beds')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'beds'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Bed className="w-4 h-4" /> Bed Management ({totalBeds})
        </button>

        <button
          onClick={() => setActiveTab('patients')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'patients'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <User className="w-4 h-4" /> Patient Profiles ({totalPatients})
        </button>

        <button
          onClick={() => setActiveTab('vitals')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'vitals'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Activity className="w-4 h-4" /> Vitals Recorder
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'equipment'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Wind className="w-4 h-4" /> Equipment & Oxygen
        </button>

        <button
          onClick={() => setActiveTab('roster')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'roster'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <UserCheck className="w-4 h-4" /> Staff Duty Roster
        </button>

        <button
          onClick={() => setActiveTab('transfer')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'transfer'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" /> Transfer / Discharge
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-sky-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" /> Analytics & Audit
        </button>
      </div>

      {/* Tab 1: ICU Overview Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Real-time KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Total ICU Beds</span>
                <Bed className="w-4 h-4 text-sky-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{totalBeds}</p>
              <div className="flex items-center gap-2 text-[11px] font-medium pt-1">
                <span className="text-emerald-700">{availableBeds} Avail</span>
                <span>•</span>
                <span className="text-rose-700">{occupiedBeds} Occ</span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>ICU Patients</span>
                <User className="w-4 h-4 text-rose-600" />
              </div>
              <p className="text-2xl font-extrabold text-rose-900">{totalPatients}</p>
              <p className="text-[11px] text-slate-500">Currently admitted in ICU</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Ventilator Status</span>
                <Wind className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{ventilatorsInUse} / {totalVentilators}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">{availableVentilators} units free</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Doctors / Nurses</span>
                <UserCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-slate-900">{doctorsOnDuty} Dr / {nursesOnDuty} Nurse</p>
              <p className="text-[11px] text-emerald-700 font-semibold">On Shift Duty</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-1 col-span-2 md:col-span-1">
              <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                <span>Cleaning & Sanitizing</span>
                <Sparkles className="w-4 h-4 text-cyan-600" />
              </div>
              <p className="text-2xl font-extrabold text-cyan-700">{cleaningBeds} Beds</p>
              <p className="text-[11px] text-cyan-600">Sanitization protocol</p>
            </div>
          </div>

          {/* Quick Active Alerts Ribbon */}
          {activeAlerts.length > 0 && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-rose-900 text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 animate-bounce" />
                  Critical ICU Alerts Needing Immediate Attention ({activeAlerts.length})
                </h3>
                <button
                  onClick={() => setActiveTab('audit')}
                  className="text-xs font-bold text-rose-700 hover:underline"
                >
                  View All Alerts &rarr;
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {activeAlerts.slice(0, 2).map(al => (
                  <div key={al.id} className="p-2.5 bg-white rounded-xl border border-rose-200 text-rose-900 font-medium">
                    <span className="font-bold text-rose-700">[{al.priority}] {al.type}:</span> {al.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bed Matrix Preview Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Bed className="w-5 h-5 text-sky-600" />
                  ICU Bed Matrix Overview
                </h3>
                <p className="text-xs text-slate-500">Live bed status indicators (Available, Reserved, Occupied, Cleaning)</p>
              </div>
              <button
                onClick={() => setActiveTab('beds')}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Full Bed Manager &rarr;
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {filteredBeds.map((b) => (
                <div
                  key={b.id}
                  onClick={() => setActiveTab('beds')}
                  className={`p-3 rounded-xl border text-center cursor-pointer transition-all hover:scale-[1.02] ${
                    b.status === 'Occupied'
                      ? 'bg-rose-50 border-rose-300 text-rose-900'
                      : b.status === 'Reserved'
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : b.status === 'Cleaning'
                      ? 'bg-cyan-50 border-cyan-300 text-cyan-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <span className="font-extrabold text-sm block">{b.bed_number}</span>
                  <span className="text-[10px] font-medium block opacity-80">{b.icu_type.split(' ')[0]}</span>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/80 border">
                    {b.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Bed Manager */}
      {activeTab === 'beds' && (
        <IcuBedManager
          hospitalFilter={hospitalFilter}
          onSelectPatient={handleSelectPatientProfile}
        />
      )}

      {/* Tab 3: Patient Manager */}
      {activeTab === 'patients' && (
        <IcuPatientManager
          hospitalFilter={hospitalFilter}
          selectedPatientId={selectedPatient?.patient_id}
          onOpenVitalsRecorder={handleOpenVitalsRecorder}
          onOpenTransferModal={handleOpenTransferModal}
        />
      )}

      {/* Tab 4: Vitals Engine */}
      {activeTab === 'vitals' && (
        <IcuVitalsMonitor
          hospitalFilter={hospitalFilter}
          preselectedPatient={selectedPatient}
        />
      )}

      {/* Tab 5: Equipment & Oxygen */}
      {activeTab === 'equipment' && (
        <IcuEquipmentTracker hospitalFilter={hospitalFilter} />
      )}

      {/* Tab 6: Staff Roster */}
      {activeTab === 'roster' && (
        <IcuStaffRoster hospitalFilter={hospitalFilter} />
      )}

      {/* Tab 7: Transfer & Discharge */}
      {activeTab === 'transfer' && (
        <IcuTransferDischarge
          hospitalFilter={hospitalFilter}
          preselectedPatient={selectedPatient}
        />
      )}

      {/* Tab 8: Analytics & Audit */}
      {activeTab === 'audit' && (
        <IcuAnalyticsAudit hospitalFilter={hospitalFilter} />
      )}
    </div>
  );
};
