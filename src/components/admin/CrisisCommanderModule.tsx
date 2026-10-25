import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Activity, 
  Users, 
  Wind, 
  BedDouble, 
  Clock, 
  Sparkles, 
  RefreshCw, 
  Lock, 
  Check, 
  AlertOctagon, 
  FileText, 
  Zap, 
  ArrowRight, 
  TrendingUp, 
  Info,
  ShieldCheck,
  Siren,
  Building2,
  PieChart as PieChartIcon
} from 'lucide-react';
import { store } from '../../lib/store';
import { CrisisRecommendation, CrisisCommanderLog, CrisisSeverity } from '../../types';
import { CrisisAnalyticsCharts } from './CrisisAnalyticsCharts';
import { CrisisCodeBroadcast } from './CrisisCodeBroadcast';
import { CrisisMutualAidNetwork } from './CrisisMutualAidNetwork';
import { CrisisBedDonutChart } from './CrisisBedDonutChart';

export const CrisisCommanderModule: React.FC = () => {
  const [recommendations, setRecommendations] = useState<CrisisRecommendation[]>(store.crisisRecommendations);
  const [auditLogs, setAuditLogs] = useState<CrisisCommanderLog[]>(store.crisisAuditLogs);
  const [beds, setBeds] = useState(store.beds);
  
  // Navigation Tabs for expanded Crisis Commander suite
  const [activeTab, setActiveTab] = useState<'pending' | 'analytics' | 'codes' | 'mutual_aid' | 'history'>('pending');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Confirmation Modal State
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    type: 'approve' | 'reject';
    recommendation: CrisisRecommendation | null;
    adminName: string;
    rejectionReason: string;
  }>({
    isOpen: false,
    type: 'approve',
    recommendation: null,
    adminName: 'Chief Medical Officer (Admin)',
    rejectionReason: 'Operational constraints / Alternate resources available'
  });

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setRecommendations([...store.crisisRecommendations]);
      setAuditLogs([...store.crisisAuditLogs]);
      setBeds([...store.beds]);
    });
    return unsubscribe;
  }, []);

  const handleRunDiagnostic = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      store.runCrisisDiagnostic();
      setIsAnalyzing(false);
      showToast('AI Operational Diagnostic completed. Fresh priority recommendations generated.');
    }, 800);
  };

  const handleSimulateScenario = (type: 'emergency_surge' | 'oxygen_scarcity' | 'opd_overload' | 'reset') => {
    store.simulateCrisisScenario(type);
    if (type === 'reset') {
      showToast('Crisis Commander scenarios reset to default state.');
    } else {
      showToast(`Crisis simulation triggered: ${type.toUpperCase().replace('_', ' ')}`);
    }
  };

  const openApproveModal = (rec: CrisisRecommendation) => {
    setActionModal({
      isOpen: true,
      type: 'approve',
      recommendation: rec,
      adminName: 'Chief Medical Officer (Admin)',
      rejectionReason: ''
    });
  };

  const openRejectModal = (rec: CrisisRecommendation) => {
    setActionModal({
      isOpen: true,
      type: 'reject',
      recommendation: rec,
      adminName: 'Chief Medical Officer (Admin)',
      rejectionReason: 'Alternate resources deployed manually'
    });
  };

  const handleConfirmAction = () => {
    if (!actionModal.recommendation) return;

    if (actionModal.type === 'approve') {
      const ok = store.approveCrisisRecommendation(
        actionModal.recommendation.id, 
        actionModal.adminName || 'Chief Medical Officer'
      );
      if (ok) {
        showToast(`✅ Action Approved & Executed! Authorized by ${actionModal.adminName}.`);
      }
    } else {
      const ok = store.rejectCrisisRecommendation(
        actionModal.recommendation.id, 
        actionModal.rejectionReason, 
        actionModal.adminName || 'Chief Medical Officer'
      );
      if (ok) {
        showToast(`❌ Recommendation rejected and logged in audit history.`);
      }
    }

    setActionModal(prev => ({ ...prev, isOpen: false, recommendation: null }));
  };

  const pendingRecs = recommendations.filter(r => r.status === 'Pending Approval');
  const criticalCount = pendingRecs.filter(r => r.severity === 'Critical').length;

  const getSeverityBadge = (severity: CrisisSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse font-extrabold';
      case 'High':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold';
      case 'Moderate':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/40 font-bold';
      default:
        return 'bg-slate-500/20 text-slate-400 border-slate-500/40 font-bold';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed top-5 right-5 z-50 bg-[#0F172A] border border-[#0EA5E9] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-bold">
          <Sparkles className="w-4 h-4 text-[#38BDF8] animate-spin" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Header Command Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-red-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/40 text-xs font-extrabold shadow-sm">
              <ShieldAlert className="w-4 h-4 text-red-400 animate-pulse" />
              <span>AI Operational Intelligence & Crisis Commander</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              Hospital Crisis Commander
              {criticalCount > 0 && (
                <span className="text-xs bg-red-600 text-white px-3 py-1 rounded-full font-black shadow-md animate-pulse">
                  {criticalCount} Critical Actions
                </span>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
              Automated real-time hospital telemetry analyzing emergency arrivals, bed occupancy, oxygen gas pipeline, staff-to-patient ratio, and regional hospital mutual aid routing.
            </p>

            {/* Safety Guardrail */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#0F172A]/90 border border-[#334155] rounded-xl text-[11px] text-[#F8FAFC]">
              <Lock className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="font-bold text-amber-300">Safety Guardrail:</span>
              <span className="text-[#94A3B8]">AI recommendations require <strong className="text-white">Authorized Admin Approval</strong> before execution. No unsolicited automatic mutations.</span>
            </div>
          </div>

          {/* Diagnostic & Action Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleRunDiagnostic}
              disabled={isAnalyzing}
              className="w-full sm:w-auto px-5 py-3.5 bg-gradient-to-r from-[#0EA5E9] to-[#0284C7] hover:brightness-110 text-white text-xs font-black rounded-xl shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Analyzing Hospital Telemetry...' : '⚡ Run AI Diagnostic'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Real-Time Operational Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Emergency Department Workload */}
        <div className="bg-[#1E293B] border border-red-500/40 p-4 rounded-2xl space-y-2 shadow-md hover:border-red-400 transition-all">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="font-black uppercase tracking-wider text-red-300">Emergency Workload</span>
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">28 Arrivals/hr</span>
            <span className="text-[10px] font-black text-red-400 bg-red-500/20 border border-red-500/40 px-2 py-0.5 rounded-md uppercase">
              Unusually High
            </span>
          </div>
          <p className="text-xs text-amber-300 font-bold bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
            “Emergency department workload unusually high hai.”
          </p>
        </div>

        {/* Metric 2: Medical Staffing */}
        <div className="bg-[#1E293B] border border-amber-500/40 p-4 rounded-2xl space-y-2 shadow-md hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="font-black uppercase tracking-wider text-amber-300">Medical Staffing</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">82% Deployed</span>
            <span className="text-[10px] font-black text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 rounded-md uppercase">
              Reallocation Ready
            </span>
          </div>
          <p className="text-xs text-[#38BDF8] font-bold bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
            “Additional staff allocation consider karein.”
          </p>
        </div>

        {/* Metric 3: Critical Resources & Oxygen */}
        <div className="bg-[#1E293B] border border-red-500/40 p-4 rounded-2xl space-y-2 shadow-md hover:border-red-400 transition-all">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="font-black uppercase tracking-wider text-red-300">Oxygen & Supplies</span>
            <div className="p-1.5 rounded-lg bg-red-500/20 text-red-400">
              <Wind className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">18% Oxygen Left</span>
            <span className="text-[10px] font-black text-red-400 bg-red-500/20 border border-red-500/40 px-2 py-0.5 rounded-md uppercase animate-pulse">
              Critically Low
            </span>
          </div>
          <p className="text-xs text-red-400 font-bold bg-[#0F172A] p-2 rounded-xl border border-red-500/30">
            “Current resources critically low hain.”
          </p>
        </div>

        {/* Metric 4: Admin Governance */}
        <div className="bg-[#1E293B] border border-[#0EA5E9]/40 p-4 rounded-2xl space-y-2 shadow-md hover:border-[#38BDF8] transition-all">
          <div className="flex items-center justify-between text-xs text-[#94A3B8]">
            <span className="font-black uppercase tracking-wider text-[#38BDF8]">Governance Status</span>
            <div className="p-1.5 rounded-lg bg-[#0EA5E9]/20 text-[#38BDF8]">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white">{pendingRecs.length} Actionable</span>
            <span className="text-[10px] font-black text-[#38BDF8] bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 px-2 py-0.5 rounded-md uppercase">
              Admin Required
            </span>
          </div>
          <p className="text-xs text-[#94A3B8] font-semibold bg-[#0F172A] p-2 rounded-xl border border-[#334155]">
            Protected by CMO Signature Protocol
          </p>
        </div>

      </div>

      {/* Stress-Testing Simulation Control Panel */}
      <div className="bg-[#1E293B] border border-[#334155] p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-2 text-xs font-black text-white">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Simulate Operational Scenarios for Admin Stress-Testing:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSimulateScenario('emergency_surge')}
            className="px-3.5 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <AlertOctagon className="w-3.5 h-3.5" /> ER Traffic Surge
          </button>
          <button
            onClick={() => handleSimulateScenario('oxygen_scarcity')}
            className="px-3.5 py-2 bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Wind className="w-3.5 h-3.5" /> Oxygen Pressure Drop
          </button>
          <button
            onClick={() => handleSimulateScenario('opd_overload')}
            className="px-3.5 py-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/40 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <Clock className="w-3.5 h-3.5" /> OPD Token Queue Overload
          </button>
          <button
            onClick={() => handleSimulateScenario('reset')}
            className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#334155] text-[#94A3B8] hover:text-white border border-[#334155] text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#334155] pb-3 overflow-x-auto">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'pending'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Pending AI Recommendations</span>
            <span className="bg-white/25 text-white px-2 py-0.5 rounded-full text-[10px] font-black">
              {pendingRecs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-[#0EA5E9] text-white shadow-lg shadow-cyan-500/30'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Surge & Depletion Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('codes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'codes'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155]'
            }`}
          >
            <Siren className="w-4 h-4" />
            <span>Emergency Code Broadcasting</span>
          </button>

          <button
            onClick={() => setActiveTab('mutual_aid')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'mutual_aid'
                ? 'bg-[#8B5CF6] text-white shadow-lg shadow-purple-500/30'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Regional Mutual Aid Grid</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0 ${
              activeTab === 'history'
                ? 'bg-[#0EA5E9] text-white shadow-md'
                : 'bg-[#1E293B] text-[#94A3B8] hover:text-white border border-[#334155]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Authorized Action Audit History</span>
            <span className="bg-[#334155] text-[#94A3B8] px-2 py-0.5 rounded-full text-[10px]">
              {auditLogs.length}
            </span>
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: PENDING AI RECOMMENDATIONS */}
      {activeTab === 'pending' && (
        <div className="space-y-6">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Columns: Recommendations List */}
            <div className="lg:col-span-2 space-y-4">
              {pendingRecs.length > 0 ? (
                pendingRecs.map((rec) => (
                  <div 
                    key={rec.id}
                    className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-lg space-y-4 transition-all hover:border-[#0EA5E9]/50"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#334155] pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] border uppercase tracking-wider ${getSeverityBadge(rec.severity)}`}>
                          {rec.severity} Severity
                        </span>
                        <span className="text-xs bg-[#0F172A] border border-[#334155] text-[#38BDF8] px-2.5 py-1 rounded-full font-bold">
                          {rec.category} • {rec.department}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Detected: {rec.createdAt}
                      </span>
                    </div>

                    {/* Body Content */}
                    <div className="space-y-3">
                      {/* Primary Trigger Heading */}
                      <div className="bg-[#0F172A] border border-red-500/30 p-3.5 rounded-xl space-y-1">
                        <div className="flex items-center gap-2 text-red-400 font-black text-sm">
                          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
                          <span>{rec.title}</span>
                        </div>
                        {rec.resourceWarningText && (
                          <p className="text-xs text-amber-300 font-bold pl-6">
                            ⚠️ {rec.resourceWarningText}
                          </p>
                        )}
                      </div>

                      {/* Triggered Telemetry & AI Rationale */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-[#0F172A]/80 border border-[#334155] p-3 rounded-xl">
                          <span className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">Triggered Metric Threshold</span>
                          <p className="text-white font-bold">{rec.triggeredMetric}</p>
                        </div>

                        <div className="bg-[#0F172A]/80 border border-[#334155] p-3 rounded-xl">
                          <span className="text-[10px] text-[#94A3B8] font-bold uppercase block mb-1">AI Recommendation</span>
                          <p className="text-[#38BDF8] font-extrabold">💡 {rec.recommendationText}</p>
                        </div>
                      </div>

                      {/* Proposed System Action Box */}
                      <div className="bg-gradient-to-r from-[#0F172A] to-[#1E293B] border border-[#0EA5E9]/40 p-3.5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2 text-xs font-bold text-white">
                            <Zap className="w-4 h-4 text-[#38BDF8]" />
                            <span>Proposed System Action Payload:</span>
                          </div>
                          <p className="text-xs text-[#94A3B8] font-medium">{rec.suggestedAction.description}</p>
                        </div>

                        <div className="shrink-0 bg-[#0EA5E9]/20 border border-[#0EA5E9]/40 text-[#38BDF8] px-3 py-1 rounded-lg text-xs font-bold">
                          Action Type: {rec.suggestedAction.type}
                        </div>
                      </div>
                    </div>

                    {/* Footer Admin Approval Controls */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#334155]">
                      <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
                        <Lock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Requires Authorized Admin Signature to execute state changes.</span>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => openRejectModal(rec)}
                          className="flex-1 sm:flex-initial px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" /> Reject
                        </button>

                        <button
                          onClick={() => openApproveModal(rec)}
                          className="flex-1 sm:flex-initial px-5 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] hover:brightness-110 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4 text-white" /> Approve & Execute Action
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-12 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#10B981] mx-auto" />
                  <h3 className="text-base font-extrabold text-white">All Operational Metrics Within Safe Limits</h3>
                  <p className="text-xs text-[#94A3B8] max-w-md mx-auto">
                    No active crisis recommendations pending approval. You can run fresh diagnostics or simulate stress-test scenarios above.
                  </p>
                </div>
              )}
            </div>

            {/* Right Column: Recharts Bed Occupancy Pie Chart & Quick Actions */}
            <div className="space-y-6">
              <CrisisBedDonutChart 
                beds={beds}
                title="Hospital Capacity Pie Chart"
                subtitle="Live occupied vs available bed telemetry"
              />

              {/* Quick Code Red / Blue Trigger Box */}
              <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 space-y-3">
                <h4 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Siren className="w-4 h-4 text-red-400" />
                  <span>Quick Code Escalation</span>
                </h4>
                <p className="text-xs text-[#94A3B8]">
                  Jump directly to Emergency Broadcasting matrix for instantaneous facility alerts:
                </p>
                <button
                  onClick={() => setActiveTab('codes')}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Siren className="w-4 h-4 animate-bounce" /> Open Emergency Codes Console →
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB CONTENT 2: SURGE & DEPLETION RECHARTS ANALYTICS */}
      {activeTab === 'analytics' && (
        <CrisisAnalyticsCharts />
      )}

      {/* TAB CONTENT 3: EMERGENCY CODE BROADCASTING */}
      {activeTab === 'codes' && (
        <CrisisCodeBroadcast />
      )}

      {/* TAB CONTENT 4: REGIONAL MUTUAL AID GRID */}
      {activeTab === 'mutual_aid' && (
        <CrisisMutualAidNetwork />
      )}

      {/* TAB CONTENT 5: AUDIT LOGS */}
      {activeTab === 'history' && (
        <div className="bg-[#1E293B] border border-[#334155] rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-[#334155] pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0EA5E9]" />
              <span>Crisis Commander Execution Audit Log</span>
            </h3>
            <span className="text-xs text-[#94A3B8]">Immutable System Trail</span>
          </div>

          <div className="divide-y divide-[#334155]">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log.id} className="py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{log.title}</span>
                    <span className="text-[11px] text-[#94A3B8]">{log.timestamp}</span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        log.executionStatus === 'Success' 
                          ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40'
                      }`}>
                        {log.executionStatus === 'Success' ? '✅ EXECUTED' : '❌ REJECTED'}
                      </span>
                      <span className="text-[#38BDF8] font-semibold">{log.actionTaken}</span>
                    </div>

                    <span className="text-[11px] text-amber-300 font-bold bg-[#0F172A] px-2 py-0.5 rounded-md border border-[#334155]">
                      Authorized By: {log.authorizedBy}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#94A3B8] font-mono bg-[#0F172A] p-2 rounded-lg border border-[#334155]/60 mt-1">
                    {log.auditDetails}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#94A3B8] py-8 text-center">No authorized crisis logs recorded yet.</p>
            )}
          </div>
        </div>
      )}

      {/* CONFIRMATION / AUTHORIZATION MODAL */}
      {actionModal.isOpen && actionModal.recommendation && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-scale-up">
            
            <div className="flex items-start justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2">
                {actionModal.type === 'approve' ? (
                  <div className="p-2 bg-[#10B981]/20 border border-[#10B981]/40 rounded-xl text-[#10B981]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                ) : (
                  <div className="p-2 bg-red-500/20 border border-red-500/40 rounded-xl text-red-400">
                    <XCircle className="w-5 h-5" />
                  </div>
                )}
                <div>
                  <h3 className="text-base font-extrabold text-white">
                    {actionModal.type === 'approve' ? 'Authorize AI Crisis Recommendation' : 'Reject Crisis Recommendation'}
                  </h3>
                  <p className="text-xs text-[#94A3B8]">
                    {actionModal.type === 'approve' ? 'This action will instantly execute system state updates.' : 'Log administrative rejection reason.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActionModal(prev => ({ ...prev, isOpen: false }))}
                className="text-[#94A3B8] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Recommendation summary in modal */}
            <div className="bg-[#0F172A] p-3.5 rounded-xl border border-[#334155] space-y-2 text-xs">
              <p className="font-extrabold text-red-400">{actionModal.recommendation.title}</p>
              <p className="text-[#38BDF8] font-bold">Action: {actionModal.recommendation.suggestedAction.payloadSummary}</p>
              <p className="text-[#94A3B8]">{actionModal.recommendation.suggestedAction.description}</p>
            </div>

            {/* Admin Credentials / Verification */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Authorized Admin Name / Badge</label>
                <input
                  type="text"
                  value={actionModal.adminName}
                  onChange={(e) => setActionModal(prev => ({ ...prev, adminName: e.target.value }))}
                  className="w-full text-xs p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:ring-2 focus:ring-[#0EA5E9]"
                  placeholder="e.g. Chief Medical Officer (Dr. Sharma)"
                />
              </div>

              {actionModal.type === 'reject' && (
                <div>
                  <label className="block text-[11px] font-bold text-[#94A3B8] uppercase mb-1">Rejection Rationale / Override Reason</label>
                  <textarea
                    rows={2}
                    value={actionModal.rejectionReason}
                    onChange={(e) => setActionModal(prev => ({ ...prev, rejectionReason: e.target.value }))}
                    className="w-full text-xs p-2.5 rounded-xl border border-[#334155] bg-[#0F172A] text-white focus:ring-2 focus:ring-[#0EA5E9]"
                    placeholder="Enter reason for administrative rejection..."
                  />
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setActionModal(prev => ({ ...prev, isOpen: false }))}
                className="px-4 py-2.5 bg-[#0F172A] hover:bg-[#334155] text-[#94A3B8] hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2.5 text-xs font-extrabold text-white rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                  actionModal.type === 'approve'
                    ? 'bg-[#10B981] hover:bg-[#059669]'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {actionModal.type === 'approve' ? (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Confirm Approval & Execute
                  </>
                ) : (
                  <>
                    <XCircle className="w-4 h-4" /> Confirm Rejection
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
