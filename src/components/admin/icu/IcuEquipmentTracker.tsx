import React, { useState } from 'react';
import { store } from '../../../lib/store';
import { IcuEquipmentRecord, IcuOxygenSupportRecord } from '../../../types';
import { 
  Wind, ShieldAlert, CheckCircle2, Wrench, AlertTriangle, Plus, RefreshCw, Activity, Cylinder
} from 'lucide-react';

interface IcuEquipmentTrackerProps {
  hospitalFilter?: string;
}

export const IcuEquipmentTracker: React.FC<IcuEquipmentTrackerProps> = ({ hospitalFilter }) => {
  const [equipmentList, setEquipmentList] = useState<IcuEquipmentRecord[]>(store.icuEquipment);
  const [oxygenList, setOxygenList] = useState<IcuOxygenSupportRecord[]>(store.icuOxygen);
  const [activeTab, setActiveTab] = useState<'ventilators' | 'oxygen'>('ventilators');

  // Add Equipment Modal
  const [showAddEqModal, setShowAddEqModal] = useState(false);
  const [eqCode, setEqCode] = useState('');
  const [eqType, setEqType] = useState<IcuEquipmentRecord['equipment_type']>('Servo Ventilator');
  const [eqLocation, setEqLocation] = useState('ICU Central Store');

  const refreshData = () => {
    setEquipmentList([...store.icuEquipment]);
    setOxygenList([...store.icuOxygen]);
  };

  const handleStatusChange = (id: string, status: IcuEquipmentRecord['status']) => {
    store.updateIcuEquipment(id, { status });
    refreshData();
  };

  const handleAddEquipmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eqCode.trim()) return;

    store.addIcuEquipment({
      equipment_code: eqCode.trim(),
      equipment_type: eqType,
      status: 'Available',
      current_location_bed: eqLocation,
      maintenance_status: 'Good',
      last_service_date: new Date().toISOString().slice(0, 10),
      next_service_date: '2026-11-01'
    });

    refreshData();
    setShowAddEqModal(false);
    setEqCode('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Wind className="w-6 h-6 text-sky-600" />
            Ventilator & Oxygen Equipment Management
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time tracking of mechanical ventilators, HFNC devices, central liquid O2 lines & cylinder pressure reserves
          </p>
        </div>
        <button
          onClick={() => setShowAddEqModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Add Equipment Unit
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('ventilators')}
          className={`pb-3 px-5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'ventilators'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wind className="w-4 h-4" /> Mechanical Ventilators & Monitors ({equipmentList.length})
        </button>
        <button
          onClick={() => setActiveTab('oxygen')}
          className={`pb-3 px-5 border-b-2 cursor-pointer transition-colors flex items-center gap-2 ${
            activeTab === 'oxygen'
              ? 'border-sky-600 text-sky-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Activity className="w-4 h-4 text-emerald-600" /> Oxygen Support & Pipelines ({oxygenList.length})
        </button>
      </div>

      {/* Tab 1: Ventilators */}
      {activeTab === 'ventilators' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {equipmentList.map((eq) => (
            <div
              key={eq.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-extrabold text-slate-900 text-base">{eq.equipment_code}</span>
                    <span className="text-xs text-slate-500 block">{eq.equipment_type}</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      eq.status === 'In Use'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : eq.status === 'Available'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>

                <div className="py-2 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location / Bed:</span>
                    <span className="font-bold text-slate-800">{eq.current_location_bed}</span>
                  </div>
                  {eq.assigned_patient_name && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Assigned Patient:</span>
                      <span className="font-bold text-rose-700">{eq.assigned_patient_name}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-slate-500">Maintenance Status:</span>
                    <span
                      className={`font-semibold ${
                        eq.maintenance_status === 'Good'
                          ? 'text-emerald-700'
                          : 'text-amber-700 font-bold animate-pulse'
                      }`}
                    >
                      {eq.maintenance_status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Next Service Due:</span>
                    <span className="font-mono">{eq.next_service_date}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="pt-2 border-t border-slate-100 flex gap-2 text-xs">
                {eq.status !== 'In Use' && (
                  <button
                    onClick={() => handleStatusChange(eq.id, eq.status === 'Available' ? 'Maintenance' : 'Available')}
                    className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Toggle Maintenance
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Oxygen Support */}
      {activeTab === 'oxygen' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {oxygenList.map((ox) => (
            <div
              key={ox.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <span className="font-extrabold text-slate-900 text-base">{ox.equipment_code}</span>
                    <span className="text-xs text-slate-500 block">{ox.type}</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      ox.status === 'Operational'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}
                  >
                    {ox.status}
                  </span>
                </div>

                <div className="py-2 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Assigned Bed:</span>
                    <span className="font-bold text-slate-800">{ox.assigned_bed}</span>
                  </div>
                  {ox.flow_rate_lpm && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">O2 Flow Rate:</span>
                      <span className="font-extrabold text-sky-700">{ox.flow_rate_lpm} L/min</span>
                    </div>
                  )}
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-600 text-[11px]">
                    {ox.inspection_notes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Equipment Modal */}
      {showAddEqModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Add New ICU Equipment</h3>
              <button
                onClick={() => setShowAddEqModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddEquipmentSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Equipment Code *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. VENT-05 or DEFIB-03"
                  value={eqCode}
                  onChange={(e) => setEqCode(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Equipment Type</label>
                <select
                  value={eqType}
                  onChange={(e) => setEqType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  <option value="Servo Ventilator">Servo Ventilator</option>
                  <option value="HFNC Oxygenation">HFNC Oxygenation</option>
                  <option value="Biphasic Defibrillator">Biphasic Defibrillator</option>
                  <option value="Multi-Para Monitor">Multi-Para Monitor</option>
                  <option value="Infusion Syringe Pump">Infusion Syringe Pump</option>
                  <option value="Arterial Line Monitor">Arterial Line Monitor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Location / Store</label>
                <input
                  type="text"
                  value={eqLocation}
                  onChange={(e) => setEqLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddEqModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Equipment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
