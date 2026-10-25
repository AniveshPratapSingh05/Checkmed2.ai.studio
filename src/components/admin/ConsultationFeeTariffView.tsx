import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Search, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Filter, 
  Sparkles,
  TrendingUp,
  Save,
  X
} from 'lucide-react';
import { store } from '../../lib/store';
import { ConsultationFeeRecord } from '../../types';

export const ConsultationFeeTariffView: React.FC = () => {
  const [fees, setFees] = useState<ConsultationFeeRecord[]>(store.consultationFees);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [editingRecord, setEditingRecord] = useState<ConsultationFeeRecord | null>(null);
  const [editPrice, setEditPrice] = useState<number>(500);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setFees([...store.consultationFees]);
    });
    return () => unsubscribe();
  }, []);

  const departments = ['All', ...Array.from(new Set(fees.map(f => f.department)))];

  const filteredFees = fees.filter(f => {
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    const matchesSearch = f.specialty.toLowerCase().includes(search.toLowerCase()) ||
                          f.department.toLowerCase().includes(search.toLowerCase()) ||
                          f.consultation_type.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleOpenEdit = (feeRec: ConsultationFeeRecord) => {
    setEditingRecord(feeRec);
    setEditPrice(feeRec.fee);
  };

  const handleSaveFee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRecord) return;

    store.updateConsultationFee(editingRecord.id, editPrice);
    setSuccessToast(`Successfully updated ${editingRecord.specialty} consultation fee to ₹${editPrice}.`);
    setEditingRecord(null);

    setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
  };

  const totalSpecialties = fees.length;
  const avgFee = Math.round(fees.reduce((acc, f) => acc + f.fee, 0) / (fees.length || 1));
  const emergencyOpdFee = fees.find(f => f.consultation_type.toLowerCase().includes('emergency'))?.fee || 1200;

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Banner & Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Standard Average OPD Fee</p>
            <p className="text-2xl font-black text-white">₹{avgFee}</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">Hospital-wide baseline tariff</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Emergency Triage Tariff</p>
            <p className="text-2xl font-black text-rose-400">₹{emergencyOpdFee}</p>
            <p className="text-[10px] text-rose-300 mt-0.5">24x7 Critical Care Response</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Main Admin Authority</p>
            <p className="text-sm font-black text-indigo-300">Ashif Ansari</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Exclusive tariff modification lock</p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-[#0B1120] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Filters Bar */}
        <div className="p-5 bg-[#0F172A] border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search specialty, department..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs py-2.5 pl-9 pr-3 rounded-xl bg-[#070B14] border border-[#334155] text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-64 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {departments.map(dept => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                    selectedDept === dept
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                      : 'bg-[#1E293B] text-slate-400 border-[#334155] hover:text-white'
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredFees.length}</strong> of {totalSpecialties} tariff records
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070B14] text-slate-400 font-bold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-4 px-5">Department & Specialty</th>
                <th className="py-4 px-5">Consultation Type</th>
                <th className="py-4 px-5">Current Tariff</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5">Last Updated</th>
                <th className="py-4 px-5 text-right">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/70">
              {filteredFees.map(feeRec => (
                <tr key={feeRec.id} className="hover:bg-[#0F172A]/60 transition-colors">
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-bold text-white text-sm">{feeRec.specialty}</p>
                      <p className="text-slate-400 text-[11px]">{feeRec.department}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#1E293B] border border-[#334155] text-slate-300">
                      {feeRec.consultation_type}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-base font-black text-emerald-400 font-mono">
                      ₹{(feeRec?.fee ?? 0).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {feeRec.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">
                    {feeRec.last_updated}
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => handleOpenEdit(feeRec)}
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Tariff</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Edit Tariff Modal */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1E293B] rounded-3xl border border-indigo-500/40 shadow-2xl p-6 space-y-5 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                  <span>Update Tariff Schedule</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Authorized Main Administrator Modification
                </p>
              </div>
              <button
                onClick={() => setEditingRecord(null)}
                className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFee} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Department & Specialty
                </label>
                <input
                  type="text"
                  disabled
                  value={`${editingRecord.specialty} (${editingRecord.department})`}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Consultation Type
                </label>
                <input
                  type="text"
                  disabled
                  value={editingRecord.consultation_type}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-400 uppercase mb-1 flex items-center justify-between">
                  <span>Consultation Fee (INR ₹) *</span>
                  <span className="text-[10px] text-slate-400 font-normal">Min ₹100, Max ₹10,000</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min={50}
                    max={20000}
                    step={50}
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value))}
                    className="w-full text-sm font-bold py-2.5 pl-8 pr-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[11px] text-slate-300">
                🔒 Every tariff adjustment is signed by <strong>Ashif Ansari</strong> and recorded into the hospital security audit log.
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-slate-300 font-bold text-xs hover:bg-[#334155] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Tariff</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
