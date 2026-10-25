import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  TestTube, 
  Send, 
  Calendar, 
  User, 
  Stethoscope, 
  Eye, 
  Printer, 
  X, 
  Sparkles, 
  Plus, 
  Building2, 
  ShieldCheck, 
  Bell,
  CheckCheck,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { LabReport, LabReportStatus, Patient, TestParameter } from '../../types';
import { store } from '../../lib/store';

interface PatientLabReportsProps {
  labReports: LabReport[];
  currentPatient: Patient | null;
  userRole?: 'patient' | 'doctor' | 'admin';
}

const STATUS_CONFIG: Record<LabReportStatus, {
  label: string;
  badgeBg: string;
  textColor: string;
  borderColor: string;
  stepIndex: number;
  icon: React.ElementType;
}> = {
  'Sample Pending': {
    label: 'Sample Pending',
    badgeBg: 'bg-amber-500/10',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    stepIndex: 1,
    icon: Clock
  },
  'Sample Collected': {
    label: 'Sample Collected',
    badgeBg: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    stepIndex: 2,
    icon: TestTube
  },
  'Processing': {
    label: 'Processing in Lab',
    badgeBg: 'bg-sky-500/10',
    textColor: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    stepIndex: 3,
    icon: RefreshCw
  },
  'Report Ready': {
    label: 'Report Ready',
    badgeBg: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    stepIndex: 4,
    icon: CheckCircle2
  },
  'Report Delivered': {
    label: 'Report Delivered',
    badgeBg: 'bg-teal-500/10',
    textColor: 'text-teal-300',
    borderColor: 'border-teal-500/30',
    stepIndex: 5,
    icon: CheckCheck
  },
  'Cancelled': {
    label: 'Cancelled',
    badgeBg: 'bg-rose-500/10',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    stepIndex: 0,
    icon: AlertCircle
  }
};

const PIPELINE_STEPS = [
  { step: 1, label: 'Test Ordered' },
  { step: 2, label: 'Sample Collected' },
  { step: 3, label: 'Processing' },
  { step: 4, label: 'Report Ready' },
  { step: 5, label: 'Delivered' }
];

export const PatientLabReports: React.FC<PatientLabReportsProps> = ({ 
  labReports, 
  currentPatient,
  userRole = 'patient'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('All');
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(null);
  const [showReportModal, setShowReportModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);
  
  // Order New Test Modal State
  const [showOrderTestModal, setShowOrderTestModal] = useState<boolean>(false);
  const [newTestName, setNewTestName] = useState('Complete Blood Count (CBC)');
  const [newTestCategory, setNewTestCategory] = useState('Pathology');
  const [newTestDoctor, setNewTestDoctor] = useState('Dr. Rajesh Sharma');

  // Staff Edit Status Modal State
  const [editStatusReport, setEditStatusReport] = useState<LabReport | null>(null);
  const [newStatusValue, setNewStatusValue] = useState<LabReportStatus>('Sample Collected');
  const [editFindings, setEditFindings] = useState('');

  // Filter reports according to user role & profile
  const roleFilteredReports = (userRole === 'patient' && currentPatient)
    ? labReports.filter(r => r.patient_id === currentPatient.id || r.patient_name.toLowerCase().includes(currentPatient.full_name.toLowerCase()))
    : labReports;

  // Search & Filter criteria
  const filteredReports = roleFilteredReports.filter(report => {
    const matchesSearch = 
      report.test_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.patient_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || report.status === statusFilter;

    let matchesDate = true;
    if (dateFilter === 'Today') {
      const todayStr = new Date().toISOString().split('T')[0];
      matchesDate = report.test_date === todayStr;
    } else if (dateFilter === 'Past 7 Days') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);
      matchesDate = new Date(report.test_date) >= cutoff;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Ready Reports for Notification Banner
  const readyReports = roleFilteredReports.filter(r => r.status === 'Report Ready');

  const handleOrderTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) {
      alert('Please complete patient registration first.');
      return;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    store.addLabReport({
      patient_id: currentPatient.id,
      patient_name: currentPatient.full_name,
      doctor_name: newTestDoctor,
      test_name: newTestName,
      test_category: newTestCategory,
      sample_collection_date: `${todayStr} ${nowTime} (Scheduled)`,
      expected_report_date: `${todayStr} 06:00 PM`,
      test_date: todayStr,
      status: 'Sample Pending',
      result_summary: 'Requisition order created. Sample collection team scheduled.',
      findings: 'Awaiting phlebotomy collection.',
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)',
      parameters: []
    });

    setShowOrderTestModal(false);
    alert(`Success! Test "${newTestName}" ordered. Sample collection team assigned.`);
  };

  const handleUpdateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStatusReport) return;

    store.updateLabReportStatus(editStatusReport.id, newStatusValue, {
      findings: editFindings || editStatusReport.findings
    });

    setEditStatusReport(null);
    alert(`Status for Test ID ${editStatusReport.id} updated to ${newStatusValue}`);
  };

  return (
    <div className="space-y-6">
      
      {/* Module Title Banner */}
      <div className="bg-[#1E293B] p-6 rounded-2xl border border-[#334155] shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#38BDF8] text-xs font-bold uppercase tracking-wider">
            <TestTube className="w-4 h-4" /> Central Diagnostic Pathology & Radiology
          </div>
          <h2 className="text-xl font-extrabold text-[#F8FAFC]">Diagnostic Test Status & Live Report Tracker</h2>
          <p className="text-xs text-[#94A3B8]">
            Track sample collection, live laboratory analysis stage, and download verified digital medical reports.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowOrderTestModal(true)}
            className="px-4 py-2.5 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-extrabold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Book / Order New Test</span>
          </button>
        </div>
      </div>

      {/* Report Ready Notification Alert Banner */}
      {readyReports.length > 0 && (
        <div className="bg-gradient-to-r from-[#10B981]/20 via-[#10B981]/10 to-transparent p-4 rounded-2xl border border-[#10B981]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#10B981] text-slate-900 rounded-xl shadow-md">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <p className="text-xs font-black text-[#10B981] uppercase tracking-wide">
                🎉 Notification: {readyReports.length} Test Report{readyReports.length > 1 ? 's are' : ' is'} Ready!
              </p>
              <p className="text-xs text-[#E2E8F0] font-medium">
                Report for <strong className="text-white">{readyReports[0].test_name}</strong> is processed and signed. View or download PDF report now.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedReport(readyReports[0]);
              setShowReportModal(true);
            }}
            className="px-3.5 py-1.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md shrink-0"
          >
            <Eye className="w-4 h-4" /> View Ready Report
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-[#1E293B] p-4 rounded-2xl border border-[#334155] grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Query */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test name, Test ID (e.g. TEST-801), doctor name..."
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-white placeholder-[#94A3B8] focus:outline-none focus:border-[#38BDF8]"
          />
        </div>

        {/* Status Filter */}
        <div className="md:col-span-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#38BDF8] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="All">All Statuses ({roleFilteredReports.length})</option>
            <option value="Sample Pending">Sample Pending</option>
            <option value="Sample Collected">Sample Collected</option>
            <option value="Processing">Processing in Lab</option>
            <option value="Report Ready">Report Ready</option>
            <option value="Report Delivered">Report Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Filter */}
        <div className="md:col-span-3">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#38BDF8]"
          >
            <option value="All">All Dates</option>
            <option value="Today">Today's Tests</option>
            <option value="Past 7 Days">Past 7 Days</option>
          </select>
        </div>
      </div>

      {/* Main Diagnostic Tests List & Detail Section */}
      <div className="space-y-4">
        
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => {
            const statusConfig = STATUS_CONFIG[report.status] || STATUS_CONFIG['Sample Pending'];
            const StatusIcon = statusConfig.icon;
            const currentStepIdx = statusConfig.stepIndex;

            return (
              <div 
                key={report.id}
                className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 shadow-lg space-y-4 hover:border-[#38BDF8]/40 transition-all"
              >
                
                {/* Header Row: Test ID, Name, Visual Status Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#334155] pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-extrabold text-[#38BDF8] bg-[#0EA5E9]/10 border border-[#0EA5E9]/30 px-2.5 py-0.5 rounded-md">
                        {report.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-[#94A3B8] bg-[#0F172A] border border-[#334155] px-2 py-0.5 rounded-md">
                        {report.test_category}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-white">{report.test_name}</h3>
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-xl border ${statusConfig.badgeBg} ${statusConfig.borderColor} ${statusConfig.textColor} text-xs font-black flex items-center gap-1.5`}>
                      <StatusIcon className={`w-4 h-4 ${report.status === 'Processing' ? 'animate-spin' : ''}`} />
                      <span>{statusConfig.label}</span>
                    </div>

                    {/* Staff Edit Status Action (For Admins/Doctors/Staff) */}
                    {(userRole === 'admin' || userRole === 'doctor') && (
                      <button
                        onClick={() => {
                          setEditStatusReport(report);
                          setNewStatusValue(report.status);
                          setEditFindings(report.findings || '');
                        }}
                        className="px-2.5 py-1.5 bg-[#0F172A] hover:bg-[#334155] border border-[#334155] text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                        title="Update Status & Parameters"
                      >
                        ⚙️ Update
                      </button>
                    )}
                  </div>
                </div>

                {/* Test Meta Info Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-[#0F172A] p-3 rounded-xl border border-[#334155]">
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block font-bold">Patient Name</span>
                    <span className="font-extrabold text-white flex items-center gap-1">
                      <User className="w-3 h-3 text-[#38BDF8]" /> {report.patient_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block font-bold">Prescribed By Doctor</span>
                    <span className="font-extrabold text-white flex items-center gap-1">
                      <Stethoscope className="w-3 h-3 text-[#10B981]" /> {report.doctor_name}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block font-bold">Sample Collection</span>
                    <span className="font-bold text-[#CBD5E1] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#F59E0B]" /> {report.sample_collection_date || report.test_date}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#94A3B8] text-[10px] block font-bold">Expected Report Date</span>
                    <span className="font-bold text-[#CBD5E1] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#38BDF8]" /> {report.expected_report_date || 'Same Day'}
                    </span>
                  </div>
                </div>

                {/* Progress Tracker Pipeline (Test Ordered -> Sample Collected -> Processing -> Report Ready -> Delivered) */}
                <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] space-y-2">
                  <p className="text-[10px] font-black uppercase text-[#94A3B8] tracking-wider flex items-center justify-between">
                    <span>Live Test Stage Pipeline</span>
                    <span className="text-[#38BDF8] font-mono">Stage {currentStepIdx} of 5</span>
                  </p>

                  {report.status === 'Cancelled' ? (
                    <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs font-bold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>This test requisition was cancelled. Please consult your physician for details.</span>
                    </div>
                  ) : (
                    <div className="relative pt-2 pb-1">
                      {/* Step circles and connector bar */}
                      <div className="grid grid-cols-5 gap-1 text-center relative z-10">
                        {PIPELINE_STEPS.map((stepItem) => {
                          const isDone = currentStepIdx > stepItem.step || report.status === 'Report Delivered';
                          const isCurrent = currentStepIdx === stepItem.step;

                          return (
                            <div key={stepItem.step} className="flex flex-col items-center space-y-1.5">
                              <div 
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                                  isDone 
                                    ? 'bg-[#10B981] text-slate-900 border-2 border-[#10B981]' 
                                    : isCurrent 
                                    ? 'bg-[#0EA5E9] text-white border-2 border-white animate-pulse' 
                                    : 'bg-[#1E293B] text-[#64748B] border border-[#334155]'
                                }`}
                              >
                                {isDone ? <CheckCircle2 className="w-4 h-4 text-slate-900" /> : stepItem.step}
                              </div>
                              <span className={`text-[10px] font-bold leading-tight ${
                                isCurrent ? 'text-[#38BDF8]' : isDone ? 'text-[#10B981]' : 'text-[#64748B]'
                              }`}>
                                {stepItem.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Diagnostic Findings / Summary */}
                {report.result_summary && (
                  <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] text-xs space-y-1">
                    <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wide block">Laboratory Summary:</span>
                    <p className="text-[#E2E8F0] font-mono leading-relaxed">{report.result_summary}</p>
                  </div>
                )}

                {/* Bottom Actions: View Report & Download Report buttons */}
                <div className="pt-1 flex flex-wrap items-center justify-between gap-3 border-t border-[#334155]">
                  <span className="text-[11px] text-[#94A3B8] font-medium flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" /> {report.hospital_name || 'Central Pathology Lab'}
                  </span>

                  <div className="flex items-center gap-2">
                    {(report.status === 'Report Ready' || report.status === 'Report Delivered' || report.status === 'Processing') && (
                      <>
                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowReportModal(true);
                          }}
                          className="px-3.5 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                        >
                          <Eye className="w-4 h-4" /> View Full Report
                        </button>

                        <button
                          onClick={() => {
                            setSelectedReport(report);
                            setShowPrintModal(true);
                          }}
                          className="px-3.5 py-2 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-extrabold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                        >
                          <Download className="w-4 h-4" /> Download Report PDF
                        </button>
                      </>
                    )}

                    {report.status === 'Sample Pending' && (
                      <span className="text-[11px] text-[#F59E0B] font-bold bg-[#F59E0B]/10 border border-[#F59E0B]/30 px-3 py-1.5 rounded-xl flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Sample collection scheduled
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="p-12 text-center bg-[#1E293B] rounded-2xl border border-[#334155] space-y-3">
            <FileText className="w-12 h-12 text-[#64748B] mx-auto" />
            <h4 className="text-base font-bold text-white">No Diagnostic Tests Found</h4>
            <p className="text-xs text-[#94A3B8] max-w-sm mx-auto">
              No lab test orders matched your search or status filter. Click below to book a new laboratory test.
            </p>
            <button
              onClick={() => setShowOrderTestModal(true)}
              className="px-4 py-2 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              + Book New Test Now
            </button>
          </div>
        )}

      </div>

      {/* FULL DIAGNOSTIC LAB REPORT MODAL */}
      {showReportModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-[#1E293B] text-white w-full max-w-2xl rounded-2xl p-6 border border-[#38BDF8]/50 space-y-5 shadow-2xl relative my-8">
            
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#0EA5E9] text-white rounded-xl shadow-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-white">Verified Diagnostic Report</h3>
                  <p className="text-xs text-[#38BDF8] font-mono">Test ID: {selectedReport.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-[#94A3B8] hover:text-white font-black text-lg p-1.5 rounded-lg hover:bg-[#334155]"
              >
                ✕
              </button>
            </div>

            {/* Official Hospital & Pathology Letterhead Header */}
            <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-extrabold text-sm text-white">{selectedReport.hospital_name || 'Central Pathology & Radiology Hospital Network'}</h4>
                <p className="text-[10px] text-[#94A3B8]">ISO 9001:2015 Accredited Diagnostic Laboratories</p>
                <p className="text-[10px] text-[#38BDF8] font-semibold mt-0.5">Emergency Helpline: 108 / +91 542 2367001</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2.5 py-1 rounded-md uppercase block">
                  Report Approved & Verified
                </span>
                <span className="text-[10px] text-[#94A3B8] block mt-1">Date: {selectedReport.test_date}</span>
              </div>
            </div>

            {/* Patient & Requisition Details Table */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#0F172A] p-3 rounded-xl border border-[#334155] text-xs">
              <div>
                <span className="text-[#94A3B8] text-[10px] block font-bold">PATIENT NAME</span>
                <span className="font-extrabold text-white">{selectedReport.patient_name}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] block font-bold">ORDERING DOCTOR</span>
                <span className="font-extrabold text-white">{selectedReport.doctor_name}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] block font-bold">CATEGORY</span>
                <span className="font-extrabold text-[#38BDF8]">{selectedReport.test_category}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] block font-bold">SAMPLE DRAWN</span>
                <span className="font-bold text-[#CBD5E1]">{selectedReport.sample_collection_date || selectedReport.test_date}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] block font-bold">REPORT PUBLISHED</span>
                <span className="font-bold text-[#CBD5E1]">{selectedReport.expected_report_date || 'Same Day'}</span>
              </div>
              <div>
                <span className="text-[#94A3B8] text-[10px] block font-bold">STATUS</span>
                <span className="font-bold text-[#10B981]">{selectedReport.status}</span>
              </div>
            </div>

            {/* Detailed Test Parameters Table */}
            {selectedReport.parameters && selectedReport.parameters.length > 0 ? (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase text-[#38BDF8] tracking-wider">Test Parameter Results</h4>
                <div className="overflow-x-auto rounded-xl border border-[#334155]">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F172A] text-[#94A3B8] text-[10px] uppercase border-b border-[#334155]">
                      <tr>
                        <th className="p-2.5">Parameter Name</th>
                        <th className="p-2.5">Observed Result</th>
                        <th className="p-2.5">Unit</th>
                        <th className="p-2.5">Biological Reference Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#334155] bg-[#1E293B]">
                      {selectedReport.parameters.map((param, i) => (
                        <tr key={i} className="hover:bg-[#0F172A]/50">
                          <td className="p-2.5 font-bold text-white">{param.parameter_name}</td>
                          <td className="p-2.5 font-extrabold font-mono text-[#38BDF8]">{param.result_value}</td>
                          <td className="p-2.5 text-[#94A3B8] font-mono">{param.unit}</td>
                          <td className="p-2.5 text-[#CBD5E1] font-mono">{param.reference_range}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {/* Pathologist Summary & Impression */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-black uppercase text-[#38BDF8] tracking-wider">Result Summary & Impression</h4>
              <div className="p-3.5 bg-[#0F172A] rounded-xl border border-[#334155] text-xs text-[#E2E8F0] font-mono leading-relaxed">
                {selectedReport.result_summary}
              </div>
            </div>

            {selectedReport.findings && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-[#38BDF8] tracking-wider">Doctor & Pathologist Findings</h4>
                <div className="p-3.5 bg-[#0F172A] rounded-xl border border-[#334155] text-xs text-white leading-relaxed">
                  {selectedReport.findings}
                </div>
              </div>
            )}

            {/* Pathologist Signature Footer */}
            <div className="pt-3 border-t border-[#334155] flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#94A3B8]">Verified By Chief Pathologist:</p>
                <p className="text-xs font-extrabold text-white">Dr. K. N. Banerjee, MD (Pathology)</p>
                <p className="text-[10px] text-[#38BDF8]">Medical Council Reg. #UP-48201</p>
              </div>

              <button
                onClick={() => {
                  setShowReportModal(false);
                  setShowPrintModal(true);
                }}
                className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" /> Download Official PDF
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRINT / DOWNLOAD REPORT PREVIEW MODAL */}
      {showPrintModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white text-slate-900 w-full max-w-2xl rounded-2xl p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-black">
                  🥼
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedReport.hospital_name || 'Central Pathology Diagnostic Network'}</h3>
                  <p className="text-xs text-slate-500 font-bold">Official Laboratory Test & Diagnostic Report</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPrintModal(false)}
                className="text-slate-400 hover:text-slate-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            {/* Print Header Table */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-500 font-bold text-[10px]">PATIENT DETAILS</p>
                <p className="font-black text-sm text-slate-900">{selectedReport.patient_name}</p>
                <p className="text-slate-600">Patient ID: {selectedReport.patient_id}</p>
              </div>
              <div className="text-right">
                <p className="text-slate-500 font-bold text-[10px]">TEST REQUISITION ID</p>
                <p className="font-black text-sm text-sky-700 font-mono">{selectedReport.id}</p>
                <p className="text-slate-600">Prescribed: {selectedReport.doctor_name}</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-xl p-4 space-y-2">
              <p className="font-bold text-xs text-slate-800 uppercase tracking-wide">Test Name: {selectedReport.test_name}</p>
              <p className="text-xs text-slate-700 font-mono bg-slate-100 p-3 rounded-lg border border-slate-200">
                {selectedReport.result_summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <p className="text-[11px] text-slate-500 italic">Digitally certified document. Valid without physical stamp.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" /> Print Document
                </button>
                <button
                  onClick={() => {
                    alert(`PDF Downloaded: ${selectedReport.id}_${selectedReport.test_name.replace(/\s+/g, '_')}.pdf`);
                    setShowPrintModal(false);
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Download className="w-4 h-4" /> Save PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOK / ORDER NEW TEST MODAL */}
      {showOrderTestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#1E293B] text-white w-full max-w-md rounded-2xl p-6 border border-[#38BDF8]/50 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2 text-[#38BDF8]">
                <Plus className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-white">Order / Requisition New Lab Test</h3>
              </div>
              <button onClick={() => setShowOrderTestModal(false)} className="text-[#94A3B8] hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleOrderTestSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94A3B8] font-bold mb-1">Select Diagnostic Test</label>
                <select
                  value={newTestName}
                  onChange={(e) => {
                    setNewTestName(e.target.value);
                    if (e.target.value.includes('X-Ray') || e.target.value.includes('MRI')) setNewTestCategory('Radiology');
                    else if (e.target.value.includes('Lipid') || e.target.value.includes('ECG')) setNewTestCategory('Cardiology');
                    else if (e.target.value.includes('Dengue')) setNewTestCategory('Microbiology');
                    else setNewTestCategory('Pathology');
                  }}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</option>
                  <option value="Complete Lipid Profile & ECG">Complete Lipid Profile & ECG</option>
                  <option value="Dengue NS1 Antigen & Platelet Count">Dengue NS1 Antigen & Platelet Count</option>
                  <option value="Thyroid Profile (T3, T4, TSH)">Thyroid Profile (T3, T4, TSH)</option>
                  <option value="Liver Function Test (LFT) & KFT">Liver Function Test (LFT) & KFT</option>
                  <option value="Digital Chest X-Ray (PA View)">Digital Chest X-Ray (PA View)</option>
                  <option value="Brain MRI Scan with Contrast">Brain MRI Scan with Contrast</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-bold mb-1">Prescribed Doctor</label>
                <select
                  value={newTestDoctor}
                  onChange={(e) => setNewTestDoctor(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Dr. Rajesh Sharma">Dr. Rajesh Sharma (Cardiology)</option>
                  <option value="Dr. Arvind Patel">Dr. Arvind Patel (General Medicine)</option>
                  <option value="Dr. Ananya Roy">Dr. Ananya Roy (Neurology)</option>
                  <option value="Dr. Vikramaditya Verma">Dr. Vikramaditya Verma (Orthopedics)</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-bold mb-1">Sample Collection Type</label>
                <select
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Hospital Collection Counter">Hospital Pathology Counter Collection</option>
                  <option value="Home Sample Collection">Home Phlebotomy Collection Service (+ ₹100)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#334155]">
                <button
                  type="button"
                  onClick={() => setShowOrderTestModal(false)}
                  className="px-4 py-2 bg-[#0F172A] hover:bg-[#334155] text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-black rounded-xl shadow-md cursor-pointer flex items-center gap-1"
                >
                  <Send className="w-4 h-4" /> Confirm Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LAB STAFF / ADMIN UPDATE STATUS MODAL */}
      {editStatusReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="bg-[#1E293B] text-white w-full max-w-md rounded-2xl p-6 border border-[#10B981]/50 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2 text-[#10B981]">
                <RefreshCw className="w-5 h-5" />
                <h3 className="text-base font-extrabold text-white">Update Test Status: {editStatusReport.id}</h3>
              </div>
              <button onClick={() => setEditStatusReport(null)} className="text-[#94A3B8] hover:text-white font-bold">✕</button>
            </div>

            <form onSubmit={handleUpdateStatusSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#94A3B8] font-bold mb-1">New Stage Status</label>
                <select
                  value={newStatusValue}
                  onChange={(e) => setNewStatusValue(e.target.value as LabReportStatus)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-white font-bold"
                >
                  <option value="Sample Pending">Sample Pending</option>
                  <option value="Sample Collected">Sample Collected</option>
                  <option value="Processing">Processing in Lab</option>
                  <option value="Report Ready">Report Ready</option>
                  <option value="Report Delivered">Report Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-[#94A3B8] font-bold mb-1">Pathologist / Lab Findings Notes</label>
                <textarea
                  rows={3}
                  value={editFindings}
                  onChange={(e) => setEditFindings(e.target.value)}
                  placeholder="Enter clinical observations, parameter values, or pathologist remarks..."
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-xl p-3 text-white text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#334155]">
                <button
                  type="button"
                  onClick={() => setEditStatusReport(null)}
                  className="px-4 py-2 bg-[#0F172A] hover:bg-[#334155] text-white font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-xl shadow-md cursor-pointer"
                >
                  Save & Publish Live Status
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
