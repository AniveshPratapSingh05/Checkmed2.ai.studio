import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Search, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Filter, 
  Layers, 
  Building2,
  Cpu,
  Wind,
  ShieldCheck,
  Edit3,
  X,
  Save
} from 'lucide-react';
import { store } from '../../lib/store';
import { MedicalSupplyItem } from '../../types';

export const MedicalSuppliesInventoryView: React.FC = () => {
  const [supplies, setSupplies] = useState<MedicalSupplyItem[]>(store.medicalSupplies);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [editingItem, setEditingItem] = useState<MedicalSupplyItem | null>(null);
  const [editTotal, setEditTotal] = useState<number>(0);
  const [editAvailable, setEditAvailable] = useState<number>(0);
  const [editInUse, setEditInUse] = useState<number>(0);
  const [editLocation, setEditLocation] = useState<string>('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setSupplies([...store.medicalSupplies]);
    });
    return () => unsubscribe();
  }, []);

  const categories = ['All', ...Array.from(new Set(supplies.map(s => s.category)))];

  const filteredSupplies = supplies.filter(s => {
    const matchesCat = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesSearch = s.item_name.toLowerCase().includes(search.toLowerCase()) ||
                          s.sku.toLowerCase().includes(search.toLowerCase()) ||
                          s.location.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenEdit = (item: MedicalSupplyItem) => {
    setEditingItem(item);
    setEditTotal(item.total_quantity);
    setEditAvailable(item.available_quantity);
    setEditInUse(item.in_use_quantity);
    setEditLocation(item.location);
  };

  const handleSaveSupply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    store.updateMedicalSupplyStock(editingItem.id, editTotal, editAvailable, editInUse, editLocation);
    setToast(`Updated stock levels for ${editingItem.item_name}.`);
    setEditingItem(null);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const totalItemsCount = supplies.reduce((acc, s) => acc + s.total_quantity, 0);
  const lowStockCount = supplies.filter(s => s.status === 'Low Stock' || s.status === 'Out of Stock').length;
  const inUseCount = supplies.reduce((acc, s) => acc + s.in_use_quantity, 0);

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toast && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toast}</span>
          </div>
          <button onClick={() => setToast(null)} className="text-emerald-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Total Inventory Master Units</p>
            <p className="text-2xl font-black text-white">{(totalItemsCount ?? 0).toLocaleString()}</p>
            <p className="text-[10px] text-sky-400 mt-0.5">Across all hospital wards & ICUs</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Equipment In-Use</p>
            <p className="text-2xl font-black text-amber-400">{(inUseCount ?? 0).toLocaleString()}</p>
            <p className="text-[10px] text-slate-400 mt-0.5">Patient connected & operational</p>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-gradient-to-br from-[#0F172A] to-[#1E293B] border border-[#334155] shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">Low Stock Alert Items</p>
            <p className="text-2xl font-black text-rose-400">{lowStockCount}</p>
            <p className="text-[10px] text-rose-300 mt-0.5">Threshold replenishment required</p>
          </div>
        </div>
      </div>

      {/* Main Supplies Master Table */}
      <div className="bg-[#0B1120] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Filters */}
        <div className="p-5 bg-[#0F172A] border-b border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search equipment, SKU, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs py-2.5 pl-9 pr-3 rounded-xl bg-[#070B14] border border-[#334155] text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 w-64 font-medium"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                    categoryFilter === cat
                      ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                      : 'bg-[#1E293B] text-slate-400 border-[#334155] hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-400 font-medium">
            Showing <strong className="text-white">{filteredSupplies.length}</strong> items
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#070B14] text-slate-400 font-bold uppercase tracking-wider border-b border-[#1E293B]">
              <tr>
                <th className="py-4 px-5">Item & SKU</th>
                <th className="py-4 px-5">Category</th>
                <th className="py-4 px-5">Available / Total</th>
                <th className="py-4 px-5">Currently In Use</th>
                <th className="py-4 px-5">Location</th>
                <th className="py-4 px-5">Status</th>
                <th className="py-4 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E293B]/70">
              {filteredSupplies.map(item => (
                <tr key={item.id} className="hover:bg-[#0F172A]/60 transition-colors">
                  <td className="py-4 px-5">
                    <div>
                      <p className="font-bold text-white text-sm">{item.item_name}</p>
                      <p className="text-slate-500 font-mono text-[10px]">{item.sku}</p>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#1E293B] border border-[#334155] text-slate-300">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <span className="text-base font-black text-sky-400 font-mono">
                        {item.available_quantity}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        / {item.total_quantity} {item.unit}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {item.in_use_quantity} {item.unit}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-slate-300 text-[11px]">
                    {item.location}
                  </td>
                  <td className="py-4 px-5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      item.status === 'Available'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : item.status === 'Low Stock'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-3.5 py-1.5 rounded-xl bg-sky-600/20 hover:bg-sky-600/40 border border-sky-500/40 text-sky-300 font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Adjust Stock</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Adjust Stock Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#1E293B] rounded-3xl border border-sky-500/40 shadow-2xl p-6 space-y-5 animate-fadeIn">
            
            <div className="flex items-center justify-between border-b border-[#334155] pb-4">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-sky-400" />
                  <span>Adjust Medical Stock Levels</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {editingItem.item_name} ({editingItem.sku})
                </p>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-[#0F172A] flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupply} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
                    Total Quantity
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editTotal}
                    onChange={(e) => setEditTotal(Number(e.target.value))}
                    className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-sky-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-400 uppercase mb-1">
                    Available
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editAvailable}
                    onChange={(e) => setEditAvailable(Number(e.target.value))}
                    className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-amber-400 uppercase mb-1">
                    In Use
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editInUse}
                    onChange={(e) => setEditInUse(Number(e.target.value))}
                    className="w-full text-xs font-bold py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-1">
                  Location / Department
                </label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full text-xs py-2.5 px-3 rounded-xl bg-[#0F172A] border border-[#334155] text-white focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-2.5 rounded-xl bg-[#0F172A] border border-[#334155] text-slate-300 font-bold text-xs hover:bg-[#334155] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Update Stock</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
