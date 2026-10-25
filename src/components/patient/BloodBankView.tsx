import React, { useState } from 'react';
import { Droplet, HeartHandshake, ShieldAlert, CheckCircle2, AlertTriangle, Send, Phone } from 'lucide-react';
import { BloodStock } from '../../types';
import { store } from '../../lib/store';

interface BloodBankViewProps {
  bloodStock: BloodStock[];
}

export const BloodBankView: React.FC<BloodBankViewProps> = ({ bloodStock }) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // Form State
  const [patientName, setPatientName] = useState(store.currentUser?.full_name || '');
  const [requestedGroup, setRequestedGroup] = useState<BloodStock['group']>('O-');
  const [componentType, setComponentType] = useState('Whole Blood');
  const [unitsNeeded, setUnitsNeeded] = useState(2);
  const [hospitalWard, setHospitalWard] = useState('Checkmed ICU / Emergency');
  const [urgencyLevel, setUrgencyLevel] = useState('Immediate / Emergency (Under 1 Hour)');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  const totalUnits = bloodStock.reduce((acc, curr) => acc + curr.units_available, 0);
  const totalPlasma = bloodStock.reduce((acc, curr) => acc + curr.plasma_units, 0);
  const totalPlatelets = bloodStock.reduce((acc, curr) => acc + curr.platelet_units, 0);

  const filteredStock = bloodStock.filter(item => {
    if (selectedGroup === 'All') return true;
    return item.group === selectedGroup;
  });

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#EF4444] text-xs font-bold uppercase tracking-wider">
              <Droplet className="w-4 h-4 fill-[#EF4444]" /> Checkmed Central Blood Bank
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">Live Blood Stock & Component Reserves</h2>
            <p className="text-xs text-[#94A3B8]">
              Real-time donor blood inventory, plasma reserves, platelet counts, and 24/7 priority emergency allocation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:+9118001234567"
              className="px-4 py-2.5 bg-[#0F172A] border border-[#334155] hover:border-[#38BDF8] text-[#38BDF8] text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Phone className="w-4 h-4" /> Blood Bank Hotline
            </a>

            <button
              onClick={() => {
                setRequestSubmitted(false);
                setIsRequestModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs rounded-xl shadow-lg shadow-[#EF4444]/20 transition-transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4" /> Request Blood / Components
            </button>
          </div>
        </div>

        {/* Global Stock Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#0F172A] border border-[#EF4444]/30 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6 fill-[#EF4444]" />
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] font-medium uppercase">Total Blood Units</p>
              <p className="text-2xl font-black text-[#F8FAFC]">{totalUnits} Units</p>
              <p className="text-[10px] text-[#10B981] font-semibold">Tested & Cryo-Stored</p>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#38BDF8]/30 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#38BDF8]/10 text-[#38BDF8] flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] font-medium uppercase">Fresh Frozen Plasma (FFP)</p>
              <p className="text-2xl font-black text-[#38BDF8]">{totalPlasma} Units</p>
              <p className="text-[10px] text-[#38BDF8] font-semibold">Frozen at -30°C</p>
            </div>
          </div>

          <div className="bg-[#0F172A] border border-[#F59E0B]/30 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold">
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[11px] text-[#94A3B8] font-medium uppercase">Platelet Concentrate</p>
              <p className="text-2xl font-black text-[#F59E0B]">{totalPlatelets} Units</p>
              <p className="text-[10px] text-[#F59E0B] font-semibold">Agitated Storage</p>
            </div>
          </div>
        </div>
      </div>

      {/* Group Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider mr-2">Blood Group:</span>
        {['All', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((grp) => (
          <button
            key={grp}
            onClick={() => setSelectedGroup(grp)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
              selectedGroup === grp
                ? 'bg-[#EF4444] text-white shadow-md'
                : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:text-white'
            }`}
          >
            {grp}
          </button>
        ))}
      </div>

      {/* Blood Stock Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStock.map((item) => {
          const isCritical = item.status === 'Critical';
          const isLow = item.status === 'Low Stock';

          return (
            <div
              key={item.group}
              className={`bg-[#1E293B] rounded-2xl p-5 border transition-all ${
                isCritical
                  ? 'border-[#EF4444]/60 bg-[#EF4444]/5'
                  : isLow
                  ? 'border-[#F59E0B]/50'
                  : 'border-[#334155] hover:border-[#10B981]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444] flex items-center justify-center font-black text-lg">
                    {item.group}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#F8FAFC]">Blood Group</p>
                    <p className="text-[10px] text-[#94A3B8]">
                      {item.group === 'O-' ? 'Universal Donor' : item.group === 'AB+' ? 'Universal Recipient' : 'RH Standard'}
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isCritical
                      ? 'bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/40 animate-pulse'
                      : isLow
                      ? 'bg-[#F59E0B]/20 text-[#F59E0B] border border-[#F59E0B]/40'
                      : 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="space-y-3 pt-2 border-t border-[#334155]">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#94A3B8]">Whole Blood Units:</span>
                  <span className="font-extrabold text-[#F8FAFC]">{item.units_available} Units</span>
                </div>

                {/* Progress bar visual */}
                <div className="w-full bg-[#0F172A] rounded-full h-2 overflow-hidden border border-[#334155]">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCritical ? 'bg-[#EF4444]' : isLow ? 'bg-[#F59E0B]' : 'bg-[#10B981]'
                    }`}
                    style={{ width: `${Math.min(100, (item.units_available / 50) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-[#94A3B8]">
                  <div className="bg-[#0F172A] p-2 rounded-lg border border-[#334155]">
                    <span className="block text-[9px] uppercase text-[#64748B]">Plasma</span>
                    <span className="font-bold text-[#38BDF8]">{item.plasma_units} Units</span>
                  </div>
                  <div className="bg-[#0F172A] p-2 rounded-lg border border-[#334155]">
                    <span className="block text-[9px] uppercase text-[#64748B]">Platelets</span>
                    <span className="font-bold text-[#F59E0B]">{item.platelet_units} Units</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setRequestedGroup(item.group);
                    setRequestSubmitted(false);
                    setIsRequestModalOpen(true);
                  }}
                  className="w-full mt-2 py-2 bg-[#0F172A] hover:bg-[#0EA5E9] hover:text-white border border-[#334155] text-xs font-bold text-[#38BDF8] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Reserve {item.group} Units
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2 text-[#EF4444]">
                <Droplet className="w-5 h-5 fill-[#EF4444]" />
                <h3 className="text-base font-bold text-[#F8FAFC]">Emergency Blood Requisition</h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-[#94A3B8] hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {requestSubmitted ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-[#F8FAFC]">Requisition Confirmed & Priority Reserved</h4>
                <p className="text-xs text-[#94A3B8]">
                  <span className="font-bold text-[#EF4444]">{unitsNeeded} Units of {requestedGroup} ({componentType})</span> have been allocated for patient <span className="font-bold text-[#F8FAFC]">{patientName}</span> at Checkmed Blood Bank.
                </p>
                <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] text-left text-xs space-y-1">
                  <p><span className="text-[#64748B]">Requisition ID:</span> <span className="font-mono text-[#38BDF8]">REQ-BLD-{Math.floor(1000 + Math.random() * 9000)}</span></p>
                  <p><span className="text-[#64748B]">Location:</span> Checkmed Central Wing (Floor 1, Blood Bank Bay)</p>
                  <p><span className="text-[#64748B]">Support Hotline:</span> +91 1800-CHECKMED</p>
                </div>
                <button
                  onClick={() => setIsRequestModalOpen(false)}
                  className="w-full py-2.5 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleRequestSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter recipient patient name"
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Required Blood Group</label>
                    <select
                      value={requestedGroup}
                      onChange={(e) => setRequestedGroup(e.target.value as BloodStock['group'])}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(grp => (
                        <option key={grp} value={grp}>{grp}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Blood Component</label>
                    <select
                      value={componentType}
                      onChange={(e) => setComponentType(e.target.value)}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    >
                      <option value="Whole Blood">Whole Blood</option>
                      <option value="Packed Red Blood Cells (PRBC)">PRBC (Red Blood Cells)</option>
                      <option value="Fresh Frozen Plasma (FFP)">Fresh Frozen Plasma (FFP)</option>
                      <option value="Platelet Concentrate">Platelet Concentrate</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Units Required</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={unitsNeeded}
                      onChange={(e) => setUnitsNeeded(Number(e.target.value))}
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#94A3B8] mb-1">Hospital Ward / Bed</label>
                    <input
                      type="text"
                      value={hospitalWard}
                      onChange={(e) => setHospitalWard(e.target.value)}
                      placeholder="e.g. ICU Bed 02 / OT Room"
                      className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Urgency Priority</label>
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(e.target.value)}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                  >
                    <option value="Immediate / Emergency (Under 1 Hour)">Immediate / Emergency (Under 1 Hour)</option>
                    <option value="Scheduled Operation / OT Surgery">Scheduled Operation / OT Surgery</option>
                    <option value="Routine Blood Transfusion">Routine Blood Transfusion</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8] font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#EF4444] hover:bg-[#DC2626] text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    Submit Requisition
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
