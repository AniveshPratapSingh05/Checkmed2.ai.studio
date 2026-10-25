import React, { useState, useEffect } from 'react';
import { Microscope, Plus, AlertTriangle, CheckCircle2, Clock, FileText, ChevronRight } from 'lucide-react';
import { store } from '../../../lib/store';
import { PathologyTestRecord, PathologyCategory, StaffRole } from '../../../types';
import { RoleAccessBar } from './RoleAccessBar';
import { SharedPatientHistoryModal } from './SharedPatientHistoryModal';

export const PathologyModule: React.FC = () => {
  const [records, setRecords] = useState<PathologyTestRecord[]>(store.pathologyRecords);
  const [currentRole, setCurrentRole] = useState<StaffRole>(store.currentStaffRole);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPatientHistoryId, setSelectedPatientHistoryId] = useState<string | null>(null);

  // New Test Form
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('Dr. Priya Sharma');
  const [testName, setTestName] = useState('Complete Blood Count (CBC) with ESR');
  const [department, setDepartment] = useState<'Hematology' | 'Biochemistry' | 'Microbiology' | 'Histopathology' | 'Serology' | 'Endocrinology'>('Hematology');
  const [specimen, setSpecimen] = useState('EDTA Whole Blood');

  useEffect(() => {
    const unsub = store.subscribe(() => {
      setRecords([...store.pathologyRecords]);
      setCurrentRole(store.currentStaffRole);
    });
    return unsub;
  }, []);

  const handleAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;

    store.addPathologyRecord({
      patient_id: `pat-${Date.now().toString().slice(-4)}`,
      patient_name: patientName,
      doctor_name: doctorName,
      test_category: (department as PathologyCategory) || 'Hematology',
      test_name: testName,
      sample_type: (specimen as any) || 'Blood',
      status: 'Ordered',
      test_parameters: [
        { parameter_name: 'Hemoglobin (Hb)', result_value: '13.5', reference_range: '12.0 - 16.5', unit: 'g/dL', is_abnormal: false },
        { parameter_name: 'Total Leukocyte Count (TLC)', result_value: '7,800', reference_range: '4,000 - 11,000', unit: '/cu mm', is_abnormal: false },
        { parameter_name: 'Platelet Count', result_value: '2,40,000', reference_range: '1,50,000 - 4,50,000', unit: '/cu mm', is_abnormal: false }
      ],
      summary_findings: 'Normal hematological profile.',
      hospital_name: 'Sir Sunderlal Hospital (IMS BHU)'
    });

    setShowAddModal(false);
    setPatientName('');
  };

  const handleUpdateStatus = (id: string, status: PathologyTestRecord['status']) => {
    store.updatePathologyStatus(id, status);
  };

  const canEdit = currentRole === 'Admin' || currentRole === 'Doctor' || currentRole === 'Lab Technician';

  return (
    <div className="space-y-6">
      
      <RoleAccessBar currentRole={currentRole} onRoleChange={(r) => store.setStaffRole(r)} />

      {/* Header Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#10B981] text-xs font-bold uppercase tracking-wider">
            <Microscope className="w-4 h-4" /> Pathology & Automated Clinical Laboratory
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">NABL Accredited Pathology & Specimen Analyzer</h1>
          <p className="text-xs text-[#94A3B8]">
            Automated barcode tracking, specimen logs, reference ranges, abnormal value flagging & verification workflow
          </p>
        </div>

        {canEdit && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-[#10B981] text-white font-bold text-xs rounded-xl hover:bg-[#059669] transition-all flex items-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4" /> Order Pathology Test
          </button>
        )}
      </div>

      {/* Test List Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {records.map(p => (
          <div key={p.id} className="bg-[#1E293B] border border-[#334155] rounded-xl p-5 shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#334155]">
              <div>
                <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider">Sample Barcode: {p.sample_id}</span>
                <h3 className="font-bold text-base text-white">{p.test_name}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                p.status === 'Report Ready' || p.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                p.status === 'Verification' ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              }`}>
                {p.status}
              </span>
            </div>

            <div className="flex justify-between text-xs text-[#94A3B8]">
              <span>Patient: <strong className="text-white">{p.patient_name}</strong></span>
              <span>Specimen: <strong className="text-slate-300">{p.sample_type}</strong></span>
            </div>

            {/* Test Parameters Table */}
            <div className="bg-[#0F172A] p-3 rounded-lg border border-[#334155] space-y-2 text-xs">
              <span className="text-[#94A3B8] block text-[11px] font-bold border-b border-[#334155] pb-1">Test Results:</span>
              <div className="space-y-1.5">
                {p.test_parameters.map((param, idx) => (
                  <div key={idx} className="flex justify-between items-center text-slate-300">
                    <span>{param.parameter_name}</span>
                    <span className={`font-bold ${param.is_abnormal ? 'text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded' : 'text-white'}`}>
                      {param.result_value} {param.unit} <span className="text-[#64748B] font-normal text-[10px]">(Ref: {param.reference_range})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Workflow buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-[#334155]">
              <button
                onClick={() => setSelectedPatientHistoryId(p.patient_name)}
                className="px-2.5 py-1 bg-[#0F172A] border border-[#334155] text-[#38BDF8] rounded-lg text-xs hover:text-white"
              >
                Patient History
              </button>

              {canEdit && (
                <div className="flex gap-1.5">
                  {(['Ordered', 'Sample Collected', 'Processing', 'Verification', 'Report Ready'] as const).map(st => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(p.id, st)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.status === st ? 'bg-[#10B981] text-white' : 'bg-[#0F172A] text-[#94A3B8] hover:bg-[#334155]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddTest} className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Microscope className="w-5 h-5 text-[#10B981]" /> Order Pathology Test
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#94A3B8] block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Test Name</label>
                <input
                  type="text"
                  required
                  value={testName}
                  onChange={e => setTestName(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#94A3B8] block mb-1">Department</label>
                <select
                  value={department}
                  onChange={e => setDepartment(e.target.value as any)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-lg p-2.5 text-white"
                >
                  <option value="Hematology">Hematology</option>
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Microbiology">Microbiology</option>
                  <option value="Histopathology">Histopathology</option>
                  <option value="Serology">Serology</option>
                  <option value="Endocrinology">Endocrinology</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-[#0F172A] text-[#94A3B8] rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#10B981] text-white font-bold text-xs rounded-xl"
              >
                Order Test
              </button>
            </div>
          </form>
        </div>
      )}

      {selectedPatientHistoryId && (
        <SharedPatientHistoryModal
          patientId={selectedPatientHistoryId}
          patientName={selectedPatientHistoryId}
          onClose={() => setSelectedPatientHistoryId(null)}
        />
      )}
    </div>
  );
};
