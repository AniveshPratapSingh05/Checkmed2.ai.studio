import React, { useState } from 'react';
import { Pill, Search, ShieldCheck, ShoppingBag, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Medicine } from '../../types';
import { store } from '../../lib/store';

interface MedicinePharmacyViewProps {
  medicines: Medicine[];
}

export const MedicinePharmacyView: React.FC<MedicinePharmacyViewProps> = ({ medicines }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isReserveModalOpen, setIsReserveModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);

  const categories = [
    'All',
    'Antibiotic',
    'Analgesic & Pain',
    'Cardiac & BP',
    'Diabetes Care',
    'Gastro Care',
    'Emergency & Critical',
    'Respiratory'
  ];

  const filteredMedicines = medicines.filter(med => {
    const matchesCategory = selectedCategory === 'All' || med.category === selectedCategory;
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.dosage_form.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleReserveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedicine) return;

    // Deduct stock in store
    const updatedStock = Math.max(0, selectedMedicine.stock_quantity - quantity);
    store.updateMedicineStock(selectedMedicine.id, updatedStock);

    setOrderComplete(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[#10B981] text-xs font-bold uppercase tracking-wider">
              <Pill className="w-4 h-4" /> Checkmed 24/7 Pharmacy & Dispensing
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC]">In-House Medicines & Critical Drugs Inventory</h2>
            <p className="text-xs text-[#94A3B8]">
              Verify genuine drug availability, dosage forms, prescription requirements, and reserve medicines for OPD counter pickup.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3.5 py-2 bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold rounded-xl flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 100% Verified Quality Medicines
            </span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Search medicine name (e.g. Paracetamol, Amoxicillin, Insulin, Atorvastatin)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0F172A] border border-[#334155] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-hidden focus:border-[#0EA5E9]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#10B981] text-white shadow-md'
                    : 'bg-[#0F172A] text-[#94A3B8] border border-[#334155] hover:text-[#F8FAFC]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Medicines Inventory List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedicines.map((med) => {
          const inStock = med.stock_quantity > 0;

          return (
            <div
              key={med.id}
              className={`bg-[#1E293B] rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                inStock ? 'border-[#334155] hover:border-[#10B981]/60' : 'border-[#EF4444]/30 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#0EA5E9]/10 text-[#38BDF8] border border-[#0EA5E9]/30">
                    {med.category}
                  </span>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      med.status === 'In Stock'
                        ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30'
                        : med.status === 'Low Stock'
                        ? 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                        : 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30'
                    }`}
                  >
                    {med.status} ({med.stock_quantity} Left)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#F8FAFC]">{med.name}</h3>
                
                <div className="flex items-center gap-2 mt-1 text-xs text-[#94A3B8]">
                  <span>Form: <strong className="text-[#F8FAFC]">{med.dosage_form}</strong></span>
                  <span>•</span>
                  <span>Exp: {med.expiry_date}</span>
                </div>

                {med.requires_prescription && (
                  <div className="mt-2 text-[10px] text-[#F59E0B] bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-2 py-1 rounded-md inline-flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Doctor Prescription Required
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#334155] mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#64748B] block uppercase font-bold">MRP Price</span>
                  <span className="text-base font-black text-[#10B981]">₹{med.price_per_unit.toFixed(2)}</span>
                  <span className="text-[10px] text-[#94A3B8]"> / {med.dosage_form}</span>
                </div>

                <button
                  disabled={!inStock}
                  onClick={() => {
                    setSelectedMedicine(med);
                    setQuantity(1);
                    setOrderComplete(false);
                    setIsReserveModalOpen(true);
                  }}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    inStock
                      ? 'bg-[#10B981] hover:bg-[#059669] text-white shadow-md cursor-pointer'
                      : 'bg-[#334155] text-[#64748B] cursor-not-allowed'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" /> Reserve Medicine
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reserve / Purchase Modal */}
      {isReserveModalOpen && selectedMedicine && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#1E293B] border border-[#334155] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-[#334155] pb-3">
              <div className="flex items-center gap-2 text-[#10B981]">
                <Pill className="w-5 h-5" />
                <h3 className="text-base font-bold text-[#F8FAFC]">Reserve Medicine at Counter</h3>
              </div>
              <button
                onClick={() => setIsReserveModalOpen(false)}
                className="text-[#94A3B8] hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {orderComplete ? (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#10B981]/20 text-[#10B981] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-sm font-bold text-[#F8FAFC]">Medicine Reserved Successfully!</h4>
                <p className="text-xs text-[#94A3B8]">
                  <span className="font-bold text-[#10B981]">{quantity}x {selectedMedicine.name}</span> has been set aside at Checkmed Ground Floor Pharmacy Counter 2.
                </p>
                <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] text-left text-xs space-y-1">
                  <p><span className="text-[#64748B]">Token Slip:</span> <span className="font-mono text-[#38BDF8]">MED-SLIP-{Math.floor(100 + Math.random() * 900)}</span></p>
                  <p><span className="text-[#64748B]">Total Amount Payable:</span> <span className="font-bold text-[#10B981]">₹{(selectedMedicine.price_per_unit * quantity).toFixed(2)}</span></p>
                  <p><span className="text-[#64748B]">Pickup Window:</span> Valid for 24 Hours</p>
                </div>
                <button
                  onClick={() => setIsReserveModalOpen(false)}
                  className="w-full py-2.5 bg-[#0EA5E9] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleReserveSubmit} className="space-y-3">
                <div className="bg-[#0F172A] p-3 rounded-xl border border-[#334155] text-xs space-y-1">
                  <p className="font-bold text-[#F8FAFC]">{selectedMedicine.name}</p>
                  <p className="text-[#94A3B8]">Category: {selectedMedicine.category} | Form: {selectedMedicine.dosage_form}</p>
                  <p className="text-[#10B981] font-bold">Price: ₹{selectedMedicine.price_per_unit.toFixed(2)} each</p>
                </div>

                <div>
                  <label className="block text-xs text-[#94A3B8] mb-1">Select Quantity / Strips</label>
                  <input
                    type="number"
                    min={1}
                    max={Math.min(10, selectedMedicine.stock_quantity)}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-[#0F172A] border border-[#334155] rounded-xl px-3 py-2 text-xs text-[#F8FAFC]"
                  />
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#334155]">
                  <span className="text-[#94A3B8]">Subtotal:</span>
                  <span className="text-base font-black text-[#10B981]">
                    ₹{(selectedMedicine.price_per_unit * quantity).toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReserveModalOpen(false)}
                    className="px-4 py-2 bg-[#0F172A] border border-[#334155] text-xs text-[#94A3B8] font-semibold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                  >
                    Confirm Reservation
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
