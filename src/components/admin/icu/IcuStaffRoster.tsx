import React, { useState } from 'react';
import { store } from '../../../lib/store';
import { IcuStaffAssignment } from '../../../types';
import { UserCheck, Clock, Plus, Phone, Stethoscope, CheckCircle2 } from 'lucide-react';

interface IcuStaffRosterProps {
  hospitalFilter?: string;
}

export const IcuStaffRoster: React.FC<IcuStaffRosterProps> = () => {
  const [staffList, setStaffList] = useState<IcuStaffAssignment[]>(store.icuStaff);
  const [showAddModal, setShowAddModal] = useState(false);

  const [staffName, setStaffName] = useState('');
  const [role, setRole] = useState<'Doctor' | 'Nurse'>('Doctor');
  const [shift, setShift] = useState<'Morning (07:00 - 15:00)' | 'Evening (15:00 - 23:00)' | 'Night (23:00 - 07:00)'>('Morning (07:00 - 15:00)');
  const [specialization, setSpecialization] = useState('Critical Care Intensivist');
  const [phone, setPhone] = useState('+91 98765 00000');
  const [assignedBedsInput, setAssignedBedsInput] = useState('MICU-Bed-01, MICU-Bed-02');

  const refreshData = () => {
    setStaffList([...store.icuStaff]);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim()) return;

    const bedsArray = assignedBedsInput.split(',').map(b => b.trim()).filter(Boolean);

    store.addIcuStaffAssignment({
      staff_name: staffName.trim(),
      role,
      shift,
      specialization: role === 'Doctor' ? specialization : 'Senior ICU Nurse',
      assigned_beds: bedsArray,
      status: 'On Duty',
      contact_phone: phone
    });

    refreshData();
    setShowAddModal(false);
    setStaffName('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-sky-600" />
            ICU Staff Duty Roster & Bed Allocation
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Doctors on Duty, Nurses on Duty, shift rotation (Morning/Evening/Night) and assigned bed coverage
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Assign Staff Shift
        </button>
      </div>

      {/* Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staffList.map((st) => (
          <div
            key={st.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl text-white ${st.role === 'Doctor' ? 'bg-sky-600' : 'bg-purple-600'}`}>
                    <Stethoscope className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm block">{st.staff_name}</span>
                    <span className="text-xs text-slate-500">{st.role} • {st.specialization || 'ICU Staff'}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {st.status}
                </span>
              </div>

              <div className="py-2 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Shift:
                  </span>
                  <span className="font-bold text-slate-800">{st.shift}</span>
                </div>

                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500">Assigned ICU Beds:</span>
                  <div className="flex flex-wrap gap-1">
                    {st.assigned_beds.map((bed) => (
                      <span key={bed} className="px-2 py-0.5 bg-sky-100 text-sky-800 font-mono font-bold rounded text-[11px]">
                        {bed}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact:
                  </span>
                  <span className="font-mono text-sky-700 font-semibold">{st.contact_phone}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-lg">Assign Staff Shift Duty</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Sharma or Sister Anjali"
                  value={staffName}
                  onChange={(e) => setStaffName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Doctor">Doctor</option>
                    <option value="Nurse">Nurse</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Shift</label>
                  <select
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                  >
                    <option value="Morning (07:00 - 15:00)">Morning (07:00 - 15:00)</option>
                    <option value="Evening (15:00 - 23:00)">Evening (15:00 - 23:00)</option>
                    <option value="Night (23:00 - 07:00)">Night (23:00 - 07:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specialization / Designation</label>
                <input
                  type="text"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Beds (Comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. MICU-Bed-01, MICU-Bed-02"
                  value={assignedBedsInput}
                  onChange={(e) => setAssignedBedsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl cursor-pointer"
                >
                  Save Shift Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
