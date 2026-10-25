import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Bed } from '../../types';
import { store } from '../../lib/store';
import { BedDouble, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface CrisisBedDonutChartProps {
  beds?: Bed[];
  title?: string;
  subtitle?: string;
}

export const CrisisBedDonutChart: React.FC<CrisisBedDonutChartProps> = ({ 
  beds, 
  title = 'Bed Occupancy Ratio', 
  subtitle = 'Live hospital capacity breakdown'
}) => {
  const safeBeds = Array.isArray(beds) ? beds : (store.beds || []);
  const totalBeds = safeBeds.length || 1;
  const availableBeds = safeBeds.filter(b => b?.status === 'Available').length;
  const occupiedBeds = safeBeds.filter(b => b?.status === 'Occupied').length;
  const maintenanceBeds = safeBeds.filter(b => b?.status === 'Under Maintenance').length;

  const occupiedPct = Math.round((occupiedBeds / totalBeds) * 100);
  const availablePct = Math.round((availableBeds / totalBeds) * 100);
  const maintenancePct = Math.round((maintenanceBeds / totalBeds) * 100);

  const data = [
    { name: 'Occupied Beds', value: occupiedBeds, color: '#EF4444' }, // Bright Red
    { name: 'Available Beds', value: availableBeds, color: '#10B981' }, // Bright Emerald
    { name: 'Under Maintenance', value: maintenanceBeds, color: '#F59E0B' } // Bright Amber
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const pct = Math.round((item.value / totalBeds) * 100);
      return (
        <div className="bg-[#0F172A] border border-[#38BDF8]/40 px-3 py-2 rounded-xl shadow-xl text-xs">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.payload.color }} />
            <span>{item.name}</span>
          </div>
          <p className="text-[#94A3B8] mt-1">
            <strong className="text-white text-sm">{item.value}</strong> beds ({pct}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-4 sm:p-5 shadow-lg space-y-4 hover:border-[#38BDF8]/40 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#0284C7]/20 border border-[#0284C7]/40 text-[#38BDF8]">
              <BedDouble className="w-4 h-4" />
            </div>
            <span>{title}</span>
          </h3>
          <p className="text-[11px] text-[#94A3B8]">{subtitle}</p>
        </div>

        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${
          occupiedPct >= 85 
            ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
            : occupiedPct >= 65
            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
        }`}>
          {occupiedPct >= 85 ? '🚨 High Load' : occupiedPct >= 65 ? '⚠️ Moderate' : '✅ Normal'}
        </span>
      </div>

      {/* Recharts Pie / Donut Chart */}
      <div className="relative h-44 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<CustomTooltip />} />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={72}
              paddingAngle={4}
              dataKey="value"
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#1E293B" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center Donut Label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white">{occupiedPct}%</span>
          <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">Occupied</span>
        </div>
      </div>

      {/* Breakdown Badges */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#334155] text-center text-xs">
        <div className="bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
          <div className="flex items-center justify-center gap-1 text-[#EF4444] font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
            <span>Occupied</span>
          </div>
          <p className="text-white font-extrabold text-sm mt-0.5">{occupiedBeds}</p>
          <span className="text-[10px] text-[#94A3B8]">{occupiedPct}%</span>
        </div>

        <div className="bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
          <div className="flex items-center justify-center gap-1 text-[#10B981] font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span>Free</span>
          </div>
          <p className="text-white font-extrabold text-sm mt-0.5">{availableBeds}</p>
          <span className="text-[10px] text-[#94A3B8]">{availablePct}%</span>
        </div>

        <div className="bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
          <div className="flex items-center justify-center gap-1 text-[#F59E0B] font-bold text-[11px]">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
            <span>Maint.</span>
          </div>
          <p className="text-white font-extrabold text-sm mt-0.5">{maintenanceBeds}</p>
          <span className="text-[10px] text-[#94A3B8]">{maintenancePct}%</span>
        </div>
      </div>
    </div>
  );
};
