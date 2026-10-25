import React, { useState } from 'react';
import { 
  MEDICAL_DEPARTMENT_IMAGES, 
  MedicalDepartmentVisual 
} from '../../data/medicalImages';
import { 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  PhoneCall, 
  ShieldCheck, 
  Maximize2, 
  X,
  Info
} from 'lucide-react';

interface DepartmentBannerCardProps {
  departmentKey: string;
  compact?: boolean;
  onRequestResource?: () => void;
}

export const DepartmentBannerCard: React.FC<DepartmentBannerCardProps> = ({
  departmentKey,
  compact = false,
  onRequestResource
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const data: MedicalDepartmentVisual = MEDICAL_DEPARTMENT_IMAGES[departmentKey] || MEDICAL_DEPARTMENT_IMAGES['cardiology'];

  return (
    <div className="w-full bg-[#1E293B] border border-[#334155] rounded-2xl overflow-hidden shadow-xl mb-6 relative">
      
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left / Top: High-Res Medical Department Image Banner */}
        <div className={`relative ${compact ? 'lg:col-span-4 min-h-[200px]' : 'lg:col-span-5 min-h-[280px]'} bg-slate-900 overflow-hidden group`}>
          <img
            src={data.imageUrl}
            alt={data.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 brightness-90 contrast-105"
            loading="lazy"
          />
          
          {/* Dark gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E293B] via-transparent to-black/40" />

          {/* Top Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-950/80 backdrop-blur-md text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {data.badge}
            </span>
          </div>

          {/* Zoom / Full Preview Action Button */}
          <button
            onClick={() => setShowImageModal(true)}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/80 backdrop-blur-md text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700/60 transition shadow-lg flex items-center gap-1.5 text-xs font-semibold"
            title="Enlarge Department Visual"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">View Image</span>
          </button>

          {/* Department Lead Tag */}
          {data.departmentLead && (
            <div className="absolute bottom-3 left-3 text-xs text-slate-300 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-700/50">
              <span className="text-slate-400">Head:</span> <strong className="text-white font-medium">{data.departmentLead}</strong>
            </div>
          )}
        </div>

        {/* Right: Department Information, Overview, Stats & Key Equipment */}
        <div className={`${compact ? 'lg:col-span-8 p-4 sm:p-5' : 'lg:col-span-7 p-6'} flex flex-col justify-between space-y-4`}>
          
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                  {data.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Clinical Standard
                </span>
              </div>

              <div className="flex items-center gap-2">
                {onRequestResource && (
                  <button
                    onClick={onRequestResource}
                    className="text-xs text-sky-300 hover:text-white font-bold bg-sky-600/30 hover:bg-sky-600/50 px-2.5 py-1 rounded-lg border border-sky-400/40 flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-sky-400" />
                    <span>Order Resources</span>
                  </button>
                )}
                {data.contactEmergency && (
                  <div className="text-xs text-slate-300 flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                    <PhoneCall className="w-3 h-3 text-emerald-400" />
                    <span>{data.contactEmergency}</span>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {data.name}
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              {data.description}
            </p>
          </div>

          {/* Live Operational Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-700/60">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-medium truncate">{stat.label}</p>
                <p className="text-sm font-bold text-emerald-400 mt-0.5">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Department Equipment Highlights */}
          <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-300">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-400" /> Key Equipment:
            </span>
            {data.equipmentList.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-1 bg-slate-800/90 px-2 py-0.5 rounded text-[11px] text-slate-200 border border-slate-700/50">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                {item}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Image Modal Lightbox */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-slate-700 rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-700 flex items-center justify-between bg-slate-900/90">
              <div>
                <h3 className="font-bold text-white text-base">{data.name} — {data.title}</h3>
                <p className="text-xs text-slate-400">{data.badge}</p>
              </div>
              <button
                onClick={() => setShowImageModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video max-h-[70vh] bg-black">
              <img
                src={data.imageUrl}
                alt={data.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4 bg-slate-900 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
              <p className="text-slate-400 max-w-2xl">{data.description}</p>
              <button
                onClick={() => setShowImageModal(false)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
