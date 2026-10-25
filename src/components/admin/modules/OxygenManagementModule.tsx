import React, { useState, useEffect } from 'react';
import { Wind, Plus, AlertTriangle, CheckCircle2, RefreshCw, MapPin, Truck, Shield, UserCheck } from 'lucide-react';
import { store } from '../../../lib/store';
import { OxygenCylinderRecord, OxygenCylinderStatus, OxygenCylinderType, StaffRole } from '../../../types';
import { RoleAccessBar } from './RoleAccessBar';

export const OxygenManagementModule: React.FC = () => {
  const [cylinders, setCylinders] = useState<OxygenCylinderRecord[]>(store.oxygenCylinders);
  const [currentRole, setCurrentRole] = useState<StaffRole>(store.currentStaffRole);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [assignCylinderId, setAssignCylinderId] = useState<string | null>(null);

  // New Cylinder State
  const [code, setCode] = useState(`O2-CYL-${Math.floor(100 + Math.random() * 900)}`);
  const [type, setType] = useState<OxygenCylinderType>('Medical Oxygen Gas (D-Type)');
  const [location, setLocation] = useState('Central Oxygen Depot');
  const [department, setDepartment] = useState('ICU');
  const [pressure, setPressure] = useState(150);
  const [supplier, setSupplier] = useState('Inox Air Products India Ltd');

  // Assign modal state
  const [assignLoc, setAssignLoc] = useState('Medical ICU Bed 02');
  const [assignDept, setAssignDept] = useState('ICU');
  const [assignPatient, setAssignPatient] = useState('Rohan Deshmukh');
  const [assignBed, setAssignBed] = useState('MICU-Bed-02');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setCylinders([...store.oxygenCylinders]);
      setCurrentRole(store.currentStaffRole);
    });
    return unsub;
  }, []);

  const totalCylinders = cylinders.length;
  const inUse = cylinders.filter(c => c.status === 'In Use').length;
  const available = cylinders.filter(c => c.status === 'Available').length;
  const empty = cylinders.filter(c => c.status === 'Empty').length;
  const refillNeeded = cylinders.filter(c => c.refill_status === 'Refill Required').length;

  const handleAddCylinder = (e: React.FormEvent) => {
    e.preventDefault();
    store.addOxygenCylinder({
      cylinder_code: code,
      oxygen_type: type,
      status: 'Available',
      capacity_liters: 7000,
      current_pressure_bar: Number(pressure),
      current_location: location,
      assigned_department: department,
      supplier_name: supplier,
      supplier_contact: '+91 542 2501199',
      refill_status: 'Full',
      last_inspection_date: new Date().toISOString().split('T')[0],
      next_maintenance_date: '2026-10-15',
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
    });
    setShowAddModal(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignCylinderId) return;
    store.assignOxygenCylinder(assignCylinderId, assignLoc, assignDept, assignPatient, assignBed);
    setAssignCylinderId(null);
  };

  const handleStatusChange = (id: string, st: OxygenCylinderStatus) => {
    store.updateOxygenCylinderStatus(id, st);
  };

  const canEdit = currentRole === 'Admin' || currentRole === 'Nurse' || currentRole === 'Equipment Manager';

  return (
    <div className="space-y-6">
      
      <RoleAccessBar currentRole={currentRole} onRoleChange={(r) => store.setStaffRole(r)} />

      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
            <Wind className="w-4 h-4" /> Medical Oxygen Infrastructure & Supply Management
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">Oxygen Cylinder & Liquid O2 Reserve Tracker</h1>
          <p className="text-xs text-[#94A3B8]">
            Real-time pressure monitoring, cylinder lifecycle (Available → In-Use → Empty → Refill), supplier & bed allocation logs
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#38BDF8] text-[#0F172A] font-bold text-xs rounded-xl hover:bg-[#0284C7] transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Register Oxygen Cylinder
          </button>
        )}
      </div>

      {/* Critical Stock Alert Banner */}
      {refillNeeded > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between text-amber-200 text-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 animate-bounce" />
            <div>
              <strong className="font-bold text-amber-300">Action Required: {refillNeeded} Oxygen Cylinder(s) require immediate refill!</strong>
              <p className="text-[#94A3B8]">Depleted or low-pressure cylinders sent to Refill Transit Area.</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 font-bold rounded-lg border border-amber-500/40">
            High Priority Alert
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-4">
          <span className="text-[#94A3B8] text-xs block">Total O2 Cylinders</span>
          <span className="text-2xl font-bold text-white mt-1 block">{totalCylinders}</span>
        </div>
        <div className="bg-[#1E293B] border border-emerald-500/30 rounded-xl p-4">
          <span className="text-emerald-400 text-xs block">Available (Full)</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">{available}</span>
        </div>
        <div className="bg-[#1E293B] border border-[#38BDF8]/30 rounded-xl p-4">
          <span className="text-[#38BDF8] text-xs block">Currently In-Use</span>
          <span className="text-2xl font-bold text-[#38BDF8] mt-1 block">{inUse}</span>
        </div>
        <div className="bg-[#1E293B] border border-rose-500/30 rounded-xl p-4">
          <span className="text-rose-400 text-xs block">Depleted (Empty)</span>
          <span className="text-2xl font-bold text-rose-400 mt-1 block">{empty}</span>
        </div>
        <div className="bg-[#1E293B] border border-amber-500/30 rounded-xl p-4 col-span-2 sm:col-span-1">
          <span className="text-amber-400 text-xs block">Refill Requested</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">{refillNeeded}</span>
        </div>
      </div>

      {/* Cylinder Inventory Table */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-lg">
        <div className="p-4 border-b border-[#334155] bg-[#0F172A] flex justify-between items-center">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Wind className="w-4 h-4 text-[#38BDF8]" /> Active Oxygen Cylinder Register
          </h2>
          <span className="text-xs text-[#94A3B8]">Pressure & Allocation Status</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#0F172A] text-[#94A3B8] uppercase text-[10px] tracking-wider border-b border-[#334155]">
              <tr>
                <th className="p-3.5">Cylinder Code</th>
                <th className="p-3.5">O2 Type</th>
                <th className="p-3.5">Current Location</th>
                <th className="p-3.5">Pressure (Bar)</th>
                <th className="p-3.5">Assigned Patient/Bed</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#334155]">
              {cylinders.map(c => (
                <tr key={c.id} className="hover:bg-[#0F172A]/50 transition-colors">
                  <td className="p-3.5 font-bold text-white">{c.cylinder_code}</td>
                  <td className="p-3.5">{c.oxygen_type}</td>
                  <td className="p-3.5 flex items-center gap-1.5 text-[#38BDF8]">
                    <MapPin className="w-3.5 h-3.5" /> {c.current_location}
                  </td>
                  <td className="p-3.5 font-bold">
                    <span className={c.current_pressure_bar < 30 ? 'text-rose-400' : 'text-emerald-400'}>
                      {c.current_pressure_bar} Bar
                    </span>
                  </td>
                  <td className="p-3.5">
                    {c.assigned_patient_name ? (
                      <div>
                        <strong className="text-white block">{c.assigned_patient_name}</strong>
                        <span className="text-[10px] text-[#94A3B8]">{c.assigned_bed}</span>
                      </div>
                    ) : (
                      <span className="text-[#64748B] italic">Unassigned (Store)</span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      c.status === 'In Use' ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40' :
                      c.status === 'Available' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                      c.status === 'Empty' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                      'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right space-x-1.5">
                    {canEdit && (
                      <>
                        <button
                          onClick={() => setAssignCylinderId(c.id)}
                          className="px-2.5 py-1 bg-[#0F172A] border border-[#38BDF8]/40 text-[#38BDF8] hover:bg-[#38BDF8]/20 rounded-md font-semibold text-[11px]"
                        >
                          Reassign Bed
                        </button>

                        <button
                          onClick={() => handleStatusChange(c.id, c.status === 'Empty' ? 'Available' : 'Empty')}
                          className="px-2.5 py-1 bg-[#0F172A] border border-[#334155] text-slate-300 hover:text-white rounded-md font-semibold text-[11px]"
                        >
                          Toggle Empty/Full
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddCylinder} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Wind className="w-5 h-5 text-[#38BDF8]" /> Register Oxygen Cylinder Asset
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Cylinder Code</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Oxygen Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as any)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                >
                  <option value="Medical Oxygen Gas (D-Type)">Medical Oxygen Gas (D-Type)</option>
                  <option value="Liquid Oxygen Cylinder">Liquid Oxygen Cylinder</option>
                  <option value="High-Pressure B-Type">High-Pressure B-Type</option>
                  <option value="Portable Concentrator Unit">Portable Concentrator Unit</option>
                </select>
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Initial Pressure (Bar)</label>
                <input
                  type="number"
                  value={pressure}
                  onChange={e => setPressure(Number(e.target.value))}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Location Depot</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-[#0F172A] text-[#94A3B8] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#38BDF8] text-[#0F172A] font-bold text-xs rounded-xl"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Assign Modal */}
      {assignCylinderId && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAssignSubmit} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#38BDF8]" /> Reassign Cylinder To Patient Bed
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Target Location</label>
                <input
                  type="text"
                  required
                  value={assignLoc}
                  onChange={e => setAssignLoc(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Patient Name</label>
                <input
                  type="text"
                  value={assignPatient}
                  onChange={e => setAssignPatient(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Bed Number</label>
                <input
                  type="text"
                  value={assignBed}
                  onChange={e => setAssignBed(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAssignCylinderId(null)}
                className="px-4 py-2 bg-[#0F172A] text-[#94A3B8] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#38BDF8] text-[#0F172A] font-bold text-xs rounded-xl"
              >
                Update Assignment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
