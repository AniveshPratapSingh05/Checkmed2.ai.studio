import React, { useState } from 'react';
import { DollarSign, FileText, Printer, Download, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { Patient, Bill } from '../../types';
import { store } from '../../lib/store';

interface PatientBillsViewProps {
  patient: Patient;
}

export const PatientBillsView: React.FC<PatientBillsViewProps> = ({ patient }) => {
  const bills = store.getPatientBills(patient.id) || [];
  const [selectedBill, setSelectedBill] = useState<Bill | null>(bills[0] || null);

  const totalBilled = bills.reduce((acc, b) => acc + (b?.net_amount ?? b?.amount ?? 0), 0);
  const totalPaid = bills.filter(b => b?.payment_status === 'Paid').reduce((acc, b) => acc + (b?.net_amount ?? b?.amount ?? 0), 0);
  const pendingAmount = totalBilled - totalPaid;

  return (
    <div className="space-y-6">
      
      {/* Metrics Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Hospital Invoices</p>
            <p className="text-xl font-black text-white">₹{totalBilled.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-500">{bills.length} invoices generated</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Amount Paid</p>
            <p className="text-xl font-black text-emerald-400">₹{totalPaid.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-500">Verified receipts available</p>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-[#334155] p-5 rounded-3xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending Balance</p>
            <p className="text-xl font-black text-amber-400">₹{pendingAmount.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-slate-500">Payable at Cash Counter or UPI</p>
          </div>
        </div>
      </div>

      {bills.length === 0 ? (
        <div className="bg-[#1E293B] border border-[#334155] rounded-3xl p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Invoices Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You do not have any pending or previous hospital bills logged for this account.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bill List */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">My Hospital Invoices</h3>
            {bills.map(b => {
              const isSelected = selectedBill?.id === b.id;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBill(b)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/50 shadow-lg'
                      : 'bg-[#1E293B] border-[#334155] hover:border-slate-500 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-emerald-400">{b.invoice_number}</span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      b.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                      b.payment_status === 'Partial' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    }`}>
                      {b.payment_status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">₹{(b?.net_amount ?? b?.amount ?? 0).toLocaleString('en-IN')}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{b.date}</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{b.items.length} items billed • {b.payment_method || 'Cash'}</p>
                </button>
              );
            })}
          </div>

          {/* Detailed Invoice & Receipt */}
          {selectedBill && (
            <div className="lg:col-span-2 bg-[#1E293B] border border-[#334155] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#334155]">
                <div>
                  <h3 className="text-base font-black text-white">CheckMed Official Tax Invoice</h3>
                  <p className="text-xs text-emerald-400 font-mono">Invoice #{selectedBill.invoice_number}</p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 bg-[#0F172A] hover:bg-[#334155] text-slate-200 hover:text-white border border-[#334155] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Print Receipt</span>
                </button>
              </div>

              {/* Patient & Billing Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0F172A] p-4 rounded-2xl border border-[#334155]/60 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400">Billed To:</p>
                  <p className="font-bold text-white text-sm">{selectedBill.patient_name}</p>
                  <p className="text-slate-400">Patient ID: <span className="font-mono text-white">{selectedBill.patient_id}</span></p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400">Payment Status:</p>
                  <span className={`inline-block font-black text-xs px-2.5 py-1 rounded-full ${
                    selectedBill.payment_status === 'Paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {selectedBill.payment_status}
                  </span>
                  <p className="text-slate-400 mt-1">Payment Method: <span className="text-white">{selectedBill.payment_method}</span></p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="border border-[#334155] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0F172A] text-slate-400 font-bold border-b border-[#334155]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Service / Item Description</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Rate</th>
                      <th className="p-3 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#334155] bg-[#1E293B]">
                    {selectedBill.items.map((item, idx) => (
                      <tr key={idx}>
                        <td className="p-3 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-3 font-bold text-white">{item.description}</td>
                        <td className="p-3 text-right font-mono text-slate-300">{item.quantity}</td>
                        <td className="p-3 text-right font-mono text-slate-300">₹{item.unit_price}</td>
                        <td className="p-3 text-right font-mono font-bold text-white">₹{item.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-[#0F172A] text-xs font-bold text-slate-300 border-t border-[#334155]">
                    <tr>
                      <td colSpan={4} className="p-3 text-right text-slate-400">Gross Total:</td>
                      <td className="p-3 text-right font-mono text-white">₹{(selectedBill?.total_amount ?? selectedBill?.subtotal ?? selectedBill?.net_amount ?? selectedBill?.amount ?? 0).toLocaleString('en-IN')}</td>
                    </tr>
                    {((selectedBill?.discount ?? 0) > 0) && (
                      <tr>
                        <td colSpan={4} className="p-3 text-right text-emerald-400">Discount Applied:</td>
                        <td className="p-3 text-right font-mono text-emerald-400">-₹{selectedBill?.discount}</td>
                      </tr>
                    )}
                    <tr className="border-t border-[#334155] text-sm">
                      <td colSpan={4} className="p-3.5 text-right font-black text-white">Net Payable / Received:</td>
                      <td className="p-3.5 text-right font-black text-emerald-400 font-mono">₹{(selectedBill?.net_amount ?? selectedBill?.amount ?? 0).toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="text-[11px] text-slate-500 text-center">
                This is a computer generated tax receipt for CheckMed Regional Hospital Network.
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
