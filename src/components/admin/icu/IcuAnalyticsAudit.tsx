import React, { useState } from 'react';
import { store } from '../../../lib/store';
import { IcuAlertRecord, IcuAuditLog } from '../../../types';
import { 
  BarChart3, ShieldAlert, CheckCircle2, Clock, Activity, FileSpreadsheet, AlertTriangle, RefreshCw
} from 'lucide-react';

interface IcuAnalyticsAuditProps {
  hospitalFilter?: string;
}

export const IcuAnalyticsAudit: React.FC<IcuAnalyticsAuditProps> = ({ hospitalFilter }) => {
  const [alerts, setAlerts] = useState<IcuAlertRecord[]>(store.icuAlerts);
  const [auditLogs, setAuditLogs] = useState<IcuAuditLog[]>(store.icuAuditLogs);

  const refreshData = () => {
    setAlerts([...store.icuAlerts]);
    setAuditLogs([...store.icuAuditLogs]);
  };

  const handleResolveAlert = (alertId: string) => {
    store.resolveIcuAlert(alertId);
    refreshData();
  };

  const totalBeds = store.icuBeds.length;
  const occupiedBeds = store.icuBeds.filter(b => b.status === 'Occupied').length;
  const availableBeds = store.icuBeds.filter(b => b.status === 'Available').length;
  const reservedBeds = store.icuBeds.filter(b => b.status === 'Reserved').length;
  const cleaningBeds = store.icuBeds.filter(b => b.status === 'Cleaning').length;

  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const totalVentilators = store.icuEquipment.filter(e => e.equipment_type.includes('Ventilator')).length;
  const ventilatorsInUse = store.icuEquipment.filter(e => e.equipment_type.includes('Ventilator') && e.status === 'In Use').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-sky-600" />
            ICU Operations Analytics & Security Audit Trail
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time occupancy metrics, active clinical alerts & system audit logs
          </p>
        </div>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Analytics
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Bed Occupancy Rate</span>
          <p className="text-2xl font-extrabold text-slate-900">{occupancyRate}%</p>
          <div className="w-full bg-slate-100 rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full ${occupancyRate > 85 ? 'bg-rose-500' : 'bg-sky-500'}`}
              style={{ width: `${occupancyRate}%` }}
            />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Ventilator Utilization</span>
          <p className="text-2xl font-extrabold text-slate-900">{ventilatorsInUse} / {totalVentilators}</p>
          <span className="text-[11px] text-slate-500">
            {totalVentilators - ventilatorsInUse} units available for emergency
          </span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Active ICU Alerts</span>
          <p className="text-2xl font-extrabold text-rose-600">
            {alerts.filter(a => !a.is_resolved).length}
          </p>
          <span className="text-[11px] text-rose-600 font-medium">Critical patient monitoring alerts</span>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-1 shadow-xs">
          <span className="text-xs font-semibold text-slate-500">Beds in Cleaning</span>
          <p className="text-2xl font-extrabold text-cyan-600">{cleaningBeds}</p>
          <span className="text-[11px] text-cyan-700 font-medium">Sanitization protocol active</span>
        </div>
      </div>

      {/* Active Alerts Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          Active ICU Clinical Alerts & Notifications
        </h3>

        <div className="space-y-3">
          {alerts.map((al) => (
            <div
              key={al.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                al.is_resolved
                  ? 'bg-slate-50 border-slate-200 opacity-60'
                  : al.priority === 'Critical'
                  ? 'bg-rose-50 border-rose-300'
                  : 'bg-amber-50 border-amber-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    al.priority === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                  }`}>
                    {al.priority}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">{al.type}</span>
                  <span className="text-[11px] text-slate-500 font-mono">• {al.timestamp}</span>
                </div>
                <p className="text-xs text-slate-800 font-medium">{al.message}</p>
              </div>

              {!al.is_resolved && (
                <button
                  onClick={() => handleResolveAlert(al.id)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-1 transition-all cursor-pointer whitespace-nowrap"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Resolve Alert
                </button>
              )}
            </div>
          ))}

          {alerts.length === 0 && (
            <p className="text-xs text-slate-400 italic text-center py-4">No active ICU alerts at this time.</p>
          )}
        </div>
      </div>

      {/* Audit Trail Log */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 pb-3 border-b border-slate-100">
          <FileSpreadsheet className="w-5 h-5 text-sky-600" />
          ICU Audit Trail & Access Logs
        </h3>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Action</th>
                <th className="p-3">User Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="p-3 font-bold text-sky-800">{log.action}</td>
                  <td className="p-3 font-semibold text-slate-800">{log.user_name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-bold text-slate-700">
                      {log.user_role}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
