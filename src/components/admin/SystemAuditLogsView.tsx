import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  FileText, 
  CheckCircle2, 
  Building2,
  RefreshCw,
  Lock
} from 'lucide-react';
import { store } from '../../lib/store';
import { SystemAuditLog } from '../../types';

export const SystemAuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<SystemAuditLog[]>(store.systemAuditLogs);
  const [moduleFilter, setModuleFilter] = useState<string>('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setLogs([...store.systemAuditLogs]);
    });
    return () => unsubscribe();
  }, []);

  const modules = ['All', ...Array.from(new Set(logs.map(l => l.module)))];

  const filteredLogs = logs.filter(l => {
    const matchesModule = moduleFilter === 'All' || l.module === moduleFilter;
    const matchesSearch = l.action.toLowerCase().includes(search.toLowerCase()) ||
                          l.user_name.toLowerCase().includes(search.toLowerCase()) ||
                          l.details.toLowerCase().includes(search.toLowerCase()) ||
                          (l.affected_record && l.affected_record.toLowerCase().includes(search.toLowerCase()));
    return matchesModule && matchesSearch;
  });

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'User Role', 'User Name', 'Action', 'Module', 'Details', 'Affected Record'];
    const rows = filteredLogs.map(l => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.user_role}"`,
      `"${l.user_name}"`,
      `"${l.action}"`,
      `"${l.module}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.affected_record || ''}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `checkmed_audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-purple-500/30 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-white">System Security & Audit Trail</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-400/40">
                Tamper Evident
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Immutable chronological record of administrative actions, tariff shifts, account activations, and doctor dispatches.
            </p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail (CSV)</span>
        </button>
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
                placeholder="Search action, user, details..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs py-2.5 pl-9 pr-3 rounded-xl bg-[#070B14] border border-[#334155] text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-64 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {modules.map(mod => (
                <button
                  key={mod}
                  onClick={() => setModuleFilter(mod)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                    moduleFilter === mod
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-[#1E293B] text-slate-400 border-[#334155] hover:text-white'
                  }`}
                >
                  {mod}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredLogs.length}</strong> recorded audit events
          </span>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070B14] text-slate-400 font-bold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-4 px-5">Timestamp</th>
                <th className="py-4 px-5">Actor / User</th>
                <th className="py-4 px-5">Module</th>
                <th className="py-4 px-5">Action Performed</th>
                <th className="py-4 px-5">Audit Details</th>
                <th className="py-4 px-5">Affected Record</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/70">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-[#0F172A]/60 transition-colors font-medium">
                  <td className="py-4 px-5 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-bold text-white text-xs">{log.user_name}</p>
                      <span className="text-[10px] text-purple-400 font-semibold">{log.user_role}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#1E293B] border border-[#334155] text-slate-300">
                      {log.module}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-white font-bold">
                    {log.action}
                  </td>
                  <td className="py-4 px-5 text-slate-300 text-xs max-w-xs leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-4 px-5 text-slate-400 font-mono text-[11px]">
                    {log.affected_record || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
