import React, { useState, useEffect } from 'react';
import { 
  UserCheck, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Filter, 
  Building2, 
  Mail, 
  Phone, 
  FileText,
  AlertCircle,
  X
} from 'lucide-react';
import { store } from '../../lib/store';
import { AccountRequestRecord } from '../../types';

export const AccountApprovalsView: React.FC = () => {
  const [requests, setRequests] = useState<AccountRequestRecord[]>(store.accountRequests);
  const [filterRole, setFilterRole] = useState<'All' | 'doctor' | 'staff'>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Approved' | 'Rejected'>('All');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  // Reject Modal
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Medical license verification pending');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setRequests([...store.accountRequests]);
    });
    return () => unsubscribe();
  }, []);

  const handleApprove = (id: string, name: string) => {
    store.approveAccountRequest(id);
    setToast(`Approved and activated credentials for ${name}.`);
    setTimeout(() => setToast(null), 3000);
  };

  const handleRejectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId) return;

    const req = requests.find(r => r.id === rejectingId);
    store.rejectAccountRequest(rejectingId, 'Ashif Ansari (Main Admin)', rejectReason);
    setToast(`Rejected account request for ${req?.full_name || 'user'}.`);
    setRejectingId(null);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = requests.filter(r => {
    const matchesRole = filterRole === 'All' || r.role === filterRole;
    const matchesStatus = filterStatus === 'All' || r.status === filterStatus;
    const matchesSearch = r.full_name.toLowerCase().includes(search.toLowerCase()) ||
                          r.email.toLowerCase().includes(search.toLowerCase()) ||
                          r.department.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesStatus && matchesSearch;
  });

  const pendingCount = requests.filter(r => r.status === 'Pending').length;
  const approvedCount = requests.filter(r => r.status === 'Approved').length;

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Pending Account Approvals</p>
            <p className="text-2xl font-black text-amber-400">{pendingCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Awaiting Medical Superintendent review</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Approved & Onboarded</p>
            <p className="text-2xl font-black text-emerald-400">{approvedCount}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Active doctor & staff profiles</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Security Gatekeeper</p>
            <p className="text-sm font-black text-purple-300">Ashif Ansari</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Main Administrator Sign-Off</p>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0B1120] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Filters */}
        <div className="p-5 bg-[#0F172A] border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search applicant name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs py-2.5 pl-9 pr-3 rounded-xl bg-[#070B14] border border-[#334155] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-64 font-medium"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              {(['All', 'Pending', 'Approved', 'Rejected'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    filterStatus === st
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-[#1E293B] text-slate-400 border-[#334155] hover:text-white'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filtered.length}</strong> applications
          </span>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <UserCheck className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold text-slate-400">No account requests found matching criteria</p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070B14] text-slate-400 font-bold uppercase tracking-wider border-b border-[#1E293B]">
                <tr>
                  <th className="py-4 px-5">Applicant Details</th>
                  <th className="py-4 px-5">Target Role</th>
                  <th className="py-4 px-5">Department & License</th>
                  <th className="py-4 px-5">Requested Date</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Approval Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/70">
                {filtered.map(req => (
                  <tr key={req.id} className="hover:bg-[#0F172A]/60 transition-colors">
                    <td className="py-4 px-5">
                      <div>
                        <p className="font-bold text-white text-sm">{req.full_name}</p>
                        <p className="text-slate-400 text-[11px] flex items-center gap-2 mt-0.5">
                          <span>{req.email}</span> • <span>{req.phone}</span>
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border ${
                        req.role === 'doctor'
                          ? 'bg-sky-500/20 text-sky-300 border-sky-400/30'
                          : 'bg-amber-500/20 text-amber-300 border-amber-400/30'
                      }`}>
                        {req.role === 'doctor' ? 'Doctor Practitioner' : `Staff (${req.staff_type || 'General'})`}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-slate-200 font-medium">{req.department}</p>
                      <p className="text-slate-400 text-[11px] font-mono">{req.license_or_emp_id}</p>
                    </td>
                    <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">
                      {req.created_at}
                    </td>
                    <td className="py-4 px-5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        req.status === 'Approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : req.status === 'Pending'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(req.id, req.full_name)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs inline-flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectingId(req.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/40 text-rose-300 font-bold text-xs inline-flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-500 text-[11px] italic font-medium">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1E293B] rounded-3xl border border-rose-500/40 shadow-2xl p-6 space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" />
                <span>Reject Account Request</span>
              </h3>
              <button
                onClick={() => setRejectingId(null)}
                className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRejectSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Reason for Rejection
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-rose-400"
                >
                  <option value="Medical license verification pending">Medical license verification pending</option>
                  <option value="Incomplete hospital credential documents">Incomplete hospital credential documents</option>
                  <option value="Duplicate registration submission">Duplicate registration submission</option>
                  <option value="Unauthorized outside practitioner application">Unauthorized outside practitioner application</option>
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingId(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-slate-300 font-bold text-xs hover:bg-[#334155] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 cursor-pointer"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
