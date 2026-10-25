import React, { useState } from 'react';
import { Doctor } from '../../types';
import { store } from '../../lib/store';
import { 
  FileText, Activity, Heart, Eye, CheckCircle2, 
  AlertTriangle, Filter, Search, Check, MessageSquare, ChevronDown 
} from 'lucide-react';

interface DoctorReportsViewProps {
  doctor: Doctor;
  onOpenPatientConsultation?: (patientId: string) => void;
}

export const DoctorReportsView: React.FC<DoctorReportsViewProps> = ({ doctor, onOpenPatientConsultation }) => {
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'PATHOLOGY' | 'CARDIOLOGY' | 'XRAY' | 'MRI' | 'CT' | 'EYE'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'REVIEWED'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewNoteInput, setReviewNoteInput] = useState<Record<string, string>>({});
  const [reviewedSuccessId, setReviewedSuccessId] = useState<string | null>(null);

  // Aggregate reports from store
  const labReports = store.labReports;
  const cardiologyRecords = store.cardiologyRecords;
  const xrayRecords = store.xrayRecords;
  const mriRecords = store.mriRecords;
  const ctScanRecords = store.ctScanRecords;
  const eyeRecords = store.eyeRecords;

  // Normalized Report items
  interface UnifiedReportItem {
    id: string;
    patient_id: string;
    patient_name: string;
    category: 'PATHOLOGY' | 'CARDIOLOGY' | 'XRAY' | 'MRI' | 'CT' | 'EYE';
    test_title: string;
    date: string;
    findings_summary: string;
    status: string;
    is_abnormal?: boolean;
    doctor_notes?: string;
  }

  const reports: UnifiedReportItem[] = [];

  labReports.forEach(l => {
    reports.push({
      id: l.id,
      patient_id: l.patient_id,
      patient_name: l.patient_name,
      category: 'PATHOLOGY',
      test_title: l.test_name,
      date: l.test_date || l.created_at,
      findings_summary: l.findings || l.result_summary || `Lab test status: ${l.status}.`,
      status: l.status === 'Report Delivered' || l.status === 'Report Ready' ? 'Reviewed' : 'Pending Review',
      is_abnormal: l.status === 'Sample Pending' || l.status === 'Processing',
      doctor_notes: l.findings
    });
  });

  cardiologyRecords.forEach(c => {
    reports.push({
      id: c.id,
      patient_id: c.patient_id,
      patient_name: c.patient_name,
      category: 'CARDIOLOGY',
      test_title: `Cardiology (${c.visit_type})`,
      date: c.created_at,
      findings_summary: c.echo_findings || c.ecg_findings || `Cardiology investigation recorded. LVEF: ${c.echo_ef_percent || 'Normal'}%`,
      status: c.status === 'Completed' || c.status === 'Report Ready' ? 'Reviewed' : 'Pending Review',
      is_abnormal: (c.echo_ef_percent != null && c.echo_ef_percent < 50) || c.status === 'Investigation Scheduled',
      doctor_notes: c.echo_findings
    });
  });

  xrayRecords.forEach(x => {
    reports.push({
      id: x.id,
      patient_id: x.patient_id,
      patient_name: x.patient_name,
      category: 'XRAY',
      test_title: `X-Ray (${x.procedure_name})`,
      date: x.requested_date || x.created_at,
      findings_summary: x.radiologist_findings || 'Digital radiological imaging completed.',
      status: x.status === 'Verified' || x.status === 'Delivered' ? 'Reviewed' : 'Pending Review',
      is_abnormal: x.is_urgent,
      doctor_notes: x.radiologist_findings
    });
  });

  mriRecords.forEach(m => {
    reports.push({
      id: m.id,
      patient_id: m.patient_id,
      patient_name: m.patient_name,
      category: 'MRI',
      test_title: `3T MRI Scan (${m.body_region})`,
      date: m.requested_date || m.created_at,
      findings_summary: m.findings || 'MRI series acquired and radiologist analyzed.',
      status: m.status === 'Verified' || m.status === 'Delivered' ? 'Reviewed' : 'Pending Review',
      is_abnormal: false,
      doctor_notes: m.findings
    });
  });

  ctScanRecords.forEach(ct => {
    reports.push({
      id: ct.id,
      patient_id: ct.patient_id,
      patient_name: ct.patient_name,
      category: 'CT',
      test_title: `128-Slice CT (${ct.scan_type})`,
      date: ct.requested_date || ct.created_at,
      findings_summary: ct.findings || 'Helical CT scan completed.',
      status: ct.status === 'Verified' || ct.status === 'Delivered' ? 'Reviewed' : 'Pending Review',
      is_abnormal: false,
      doctor_notes: ct.findings
    });
  });

  // Filter reports
  const filteredReports = reports.filter(r => {
    const matchesSearch = 
      r.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.patient_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.test_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.findings_summary.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'ALL' || r.category === selectedCategory;
    const matchesStatus = 
      filterStatus === 'ALL' || 
      (filterStatus === 'PENDING' && r.status !== 'Reviewed') ||
      (filterStatus === 'REVIEWED' && r.status === 'Reviewed');

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleMarkAsReviewed = (report: UnifiedReportItem) => {
    const notes = reviewNoteInput[report.id] || 'Reviewed and verified by doctor. Patient advised accordingly.';
    store.markReportAsReviewed(report.id, doctor.id, doctor.full_name, notes);
    setReviewedSuccessId(report.id);
    setTimeout(() => setReviewedSuccessId(null), 3000);
  };

  return (
    <div className="space-y-4 text-xs">
      
      {/* Search & Filter Bar */}
      <div className="bg-[#1E293B] p-4 rounded-xl border border-[#334155] flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search investigation reports by patient, test title or findings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-2 text-white text-xs placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Modalities & Labs</option>
            <option value="PATHOLOGY">Pathology / Blood</option>
            <option value="CARDIOLOGY">Cardiology / ECG</option>
            <option value="XRAY">Digital X-Ray</option>
            <option value="MRI">3T MRI</option>
            <option value="CT">128-Slice CT</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-slate-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending Review Only</option>
            <option value="REVIEWED">Reviewed & Verified</option>
          </select>
        </div>

      </div>

      {/* Reports Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-slate-400 px-1">
          <span>Diagnostic Reports ({filteredReports.length} results)</span>
          <span className="text-emerald-400 font-medium">Verified by Hospital Pathology & Radiology Suites</span>
        </div>

        {filteredReports.length === 0 ? (
          <div className="bg-[#1E293B]/50 border border-[#334155] rounded-xl p-10 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto text-slate-600 mb-2 opacity-60" />
            <p className="font-semibold text-slate-300 text-sm">No investigation reports found for this filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredReports.map(report => {
              const isPending = report.status !== 'Reviewed';
              const isSuccess = reviewedSuccessId === report.id;

              return (
                <div
                  key={report.id}
                  className={`bg-[#1E293B] border rounded-xl p-4 transition shadow-md flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                    isPending
                      ? 'border-amber-500/40 bg-[#1E293B]'
                      : 'border-[#334155] bg-[#1E293B]/70'
                  }`}
                >
                  {/* Left: Report Details */}
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-white text-sm">{report.test_title}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {report.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isPending
                          ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {report.status}
                      </span>
                      {report.is_abnormal && isPending && (
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-bold border border-red-500/30 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Attention Required
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 text-slate-400 text-xs">
                      <span>Patient: <strong className="text-white">{report.patient_name}</strong> ({report.patient_id})</span>
                      <span>•</span>
                      <span>Date: <span className="text-slate-300 font-mono">{report.date}</span></span>
                    </div>

                    {/* Findings */}
                    <div className="bg-[#0F172A] p-2.5 rounded-lg border border-slate-800 text-slate-300 text-xs">
                      <span className="font-semibold text-slate-400">Findings & Interpretation: </span>
                      {report.findings_summary}
                    </div>

                    {/* Doctor Review Input (if pending) */}
                    {isPending && (
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Add clinical remarks / dosage adjustment note..."
                          value={reviewNoteInput[report.id] || ''}
                          onChange={(e) => setReviewNoteInput({ ...reviewNoteInput, [report.id]: e.target.value })}
                          className="flex-1 bg-[#0F172A] border border-[#334155] rounded-lg px-2.5 py-1 text-white text-xs placeholder-slate-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-700/60 shrink-0">
                    {isPending ? (
                      <button
                        onClick={() => handleMarkAsReviewed(report)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-emerald-900/30"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Mark as Reviewed
                      </button>
                    ) : (
                      <div className="text-emerald-400 font-semibold text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Verified
                      </div>
                    )}

                    {isSuccess && (
                      <span className="text-emerald-400 text-xs font-semibold animate-pulse">
                        Saved!
                      </span>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};
