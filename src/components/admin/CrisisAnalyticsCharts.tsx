import React from 'react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Activity, TrendingUp, AlertTriangle, Wind, Users, BedDouble, ShieldAlert, Zap } from 'lucide-react';

const SURGE_HOURLY_DATA = [
  { time: '00:00', ER_Arrivals: 8, Threshold: 15, ICU_Stress: 45, OxygenDemand: 30 },
  { time: '02:00', ER_Arrivals: 11, Threshold: 15, ICU_Stress: 50, OxygenDemand: 32 },
  { time: '04:00', ER_Arrivals: 14, Threshold: 15, ICU_Stress: 58, OxygenDemand: 38 },
  { time: '06:00', ER_Arrivals: 19, Threshold: 15, ICU_Stress: 72, OxygenDemand: 52 },
  { time: '08:00', ER_Arrivals: 26, Threshold: 15, ICU_Stress: 88, OxygenDemand: 68 },
  { time: '10:00', ER_Arrivals: 32, Threshold: 15, ICU_Stress: 94, OxygenDemand: 82 },
  { time: '12:00', ER_Arrivals: 28, Threshold: 15, ICU_Stress: 89, OxygenDemand: 79 },
  { time: '14:00', ER_Arrivals: 24, Threshold: 15, ICU_Stress: 82, OxygenDemand: 74 },
  { time: '16:00', ER_Arrivals: 29, Threshold: 15, ICU_Stress: 91, OxygenDemand: 85 },
  { time: '18:00', ER_Arrivals: 35, Threshold: 15, ICU_Stress: 96, OxygenDemand: 92 },
  { time: '20:00', ER_Arrivals: 30, Threshold: 15, ICU_Stress: 90, OxygenDemand: 86 },
  { time: '22:00', ER_Arrivals: 18, Threshold: 15, ICU_Stress: 75, OxygenDemand: 60 },
];

const DEPARTMENT_STRESS_INDEX = [
  { department: 'Emergency / Trauma', stress: 94, capacity: 100, color: '#EF4444' },
  { department: 'ICU Ventilator Bay', stress: 88, capacity: 100, color: '#F97316' },
  { department: 'Oxygen Pipeline', stress: 82, capacity: 100, color: '#EAB308' },
  { department: 'Operation Theaters', stress: 68, capacity: 100, color: '#06B6D4' },
  { department: 'Cardiology OPD', stress: 74, capacity: 100, color: '#3B82F6' },
  { department: 'General Medicine', stress: 58, capacity: 100, color: '#10B981' },
];

export const CrisisAnalyticsCharts: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* 24-Hour Emergency Surge & Inflow Forecast Chart */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-lg space-y-4 hover:border-[#0EA5E9]/40 transition-all">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-[#38BDF8]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-white text-base flex items-center gap-2">
                <span>24-Hour Emergency Influx & Surge Telemetry</span>
                <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded-full uppercase font-bold">
                  Surge Alert Active
                </span>
              </h3>
              <p className="text-xs text-[#94A3B8]">
                Real-time patient inflow tracking vs safe operational threshold (15 arrivals/hr)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-red-400 font-bold">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]" />
              <span>Live Arrivals/hr</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#38BDF8] font-bold">
              <span className="w-3 h-3 rounded-full bg-[#38BDF8]" />
              <span>Safe Threshold</span>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={SURGE_HOURLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorArrivals" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="colorThreshold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="time" stroke="#94A3B8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#0F172A', 
                  borderColor: '#38BDF8', 
                  borderRadius: '12px', 
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="ER_Arrivals" 
                name="ER Arrivals (Patient/hr)" 
                stroke="#EF4444" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorArrivals)" 
              />
              <Area 
                type="monotone" 
                dataKey="Threshold" 
                name="Safe Threshold (15/hr)" 
                stroke="#38BDF8" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                fillOpacity={1} 
                fill="url(#colorThreshold)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] flex items-center justify-between">
            <span className="text-[#94A3B8]">Peak Surge Period</span>
            <span className="text-red-400 font-extrabold">18:00 - 20:00 (35/hr)</span>
          </div>
          <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] flex items-center justify-between">
            <span className="text-[#94A3B8]">Average ER Response Time</span>
            <span className="text-amber-400 font-extrabold">8.4 Mins (Elevated)</span>
          </div>
          <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] flex items-center justify-between">
            <span className="text-[#94A3B8]">AI Staffing Allocation Advice</span>
            <span className="text-[#10B981] font-extrabold">+10 Medical Staff Needed</span>
          </div>
        </div>
      </div>

      {/* Grid: Department Stress Index & Resource Velocity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Department Stress Bar Chart */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-lg space-y-4 hover:border-[#0EA5E9]/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">Department Stress Index (%)</h4>
                <p className="text-[11px] text-[#94A3B8]">Live workload vs critical capacity ceiling</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
              Critical &gt; 80%
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_STRESS_INDEX} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis type="category" dataKey="department" stroke="#94A3B8" fontSize={11} tickLine={false} width={110} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderColor: '#38BDF8', 
                    borderRadius: '12px', 
                    color: '#fff',
                    fontSize: '12px'
                  }} 
                />
                <Bar dataKey="stress" name="Stress Load %" radius={[0, 6, 6, 0]}>
                  {DEPARTMENT_STRESS_INDEX.map((entry, index) => (
                    <Bar key={`cell-${index}`} dataKey="stress" fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Real-Time Depletion Velocity Monitor */}
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-lg space-y-4 hover:border-[#0EA5E9]/40 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-[#38BDF8]">
                <Wind className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">Resource Depletion Velocity</h4>
                <p className="text-[11px] text-[#94A3B8]">Estimated hours until critical stock exhaustion</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              AI Forecast
            </span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Oxygen Gas Pipeline */}
            <div className="bg-[#0F172A] p-3 rounded-xl border border-red-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-red-400" /> Liquid Medical Oxygen (LMO)
                </span>
                <span className="text-red-400 font-extrabold">4.2 Hours Left (18%)</span>
              </div>
              <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[18%] transition-all" />
              </div>
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>Current Burn: 420 L/min</span>
                <span className="text-amber-300 font-semibold">AI Recommendation: Dispatch 15 Cylinders</span>
              </div>
            </div>

            {/* ICU Ventilator Availability */}
            <div className="bg-[#0F172A] p-3 rounded-xl border border-amber-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <BedDouble className="w-4 h-4 text-amber-400" /> ICU Ventilator Beds
                </span>
                <span className="text-amber-400 font-extrabold">3 Beds Remaining (88% Full)</span>
              </div>
              <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 w-[88%] transition-all" />
              </div>
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>Est. Saturation: ~2.5 Hours</span>
                <span className="text-emerald-400 font-semibold">Stepdown Conversion Ready</span>
              </div>
            </div>

            {/* Blood Bank O-Negative */}
            <div className="bg-[#0F172A] p-3 rounded-xl border border-blue-500/30 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-[#38BDF8]" /> Emergency O-Negative Blood Units
                </span>
                <span className="text-[#38BDF8] font-extrabold">6 Units (Safe Reserve: 12)</span>
              </div>
              <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden">
                <div className="h-full bg-[#0EA5E9] w-[50%] transition-all" />
              </div>
              <div className="flex justify-between text-[10px] text-[#94A3B8]">
                <span>Regional Checkmed Request: Active</span>
                <span className="text-[#38BDF8] font-semibold">6 Units Inbound from BRD</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
