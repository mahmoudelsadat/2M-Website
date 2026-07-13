/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Tag, ShoppingCart, Users, Megaphone,
  Settings, FileText, Lock, LogOut, Plus, Edit2, Trash2, Search,
  X, Check, ChevronDown, ChevronRight, AlertTriangle, Download, Eye,
  TrendingUp, ShoppingBag, DollarSign, UserCheck, ArrowUp,
  ArrowDown, Save, RefreshCw, ToggleLeft, ToggleRight, Award,
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  adminStore,
  AdminProduct, AdminOrder, AdminCustomer, AdminCategory,
  Announcement, SiteSettings, HeroContent, FaqItem,
} from '@/lib/adminStore';

// ─── Types ───────────────────────────────────────────────────
type Panel = 'overview' | 'products' | 'categories' | 'brands' | 'orders' | 'customers' | 'announcements' | 'settings' | 'content' | 'security';

// ─── Sidebar config ──────────────────────────────────────────
const NAV_ITEMS: { id: Panel; label: string; icon: React.ReactNode; badge?: string }[] = [
  { id: 'overview',       label: 'Overview',       icon: <LayoutDashboard size={16} /> },
  { id: 'products',       label: 'Products',       icon: <Package size={16} /> },
  { id: 'categories',     label: 'Categories',     icon: <Tag size={16} /> },
  { id: 'brands',         label: 'Brands',         icon: <Award size={16} /> },
  { id: 'orders',         label: 'Orders',         icon: <ShoppingCart size={16} /> },
  { id: 'customers',      label: 'Customers',      icon: <Users size={16} /> },
  { id: 'announcements',  label: 'Announcements',  icon: <Megaphone size={16} /> },
  { id: 'settings',       label: 'Site Settings',  icon: <Settings size={16} /> },
  { id: 'content',        label: 'Content',        icon: <FileText size={16} /> },
  { id: 'security',       label: 'Security',       icon: <Lock size={16} /> },
];

// ─── Status Badge ────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:    'bg-amber-50 text-amber-600 border border-amber-200/50',
    processing: 'bg-blue-50 text-blue-600 border border-blue-200/50',
    shipped:    'bg-indigo-50 text-indigo-600 border border-indigo-200/50',
    delivered:  'bg-emerald-50 text-emerald-600 border border-emerald-200/50',
    canceled:   'bg-rose-50 text-rose-600 border border-rose-200/50',
    sale:       'bg-rose-50 text-rose-600 border border-rose-200/50',
    new:        'bg-emerald-50 text-emerald-600 border border-emerald-200/50',
    hot:        'bg-orange-50 text-orange-600 border border-orange-200/50',
    'pharmacist-pick': 'bg-slate-800 text-slate-100 border border-slate-900/50',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide ${map[status] ?? 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
      {status}
    </span>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }: { message: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-slate-200"
      >
        <div className="flex items-start gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm mb-1">Confirm Action</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-xs font-black hover:bg-red-600 transition-colors">Delete</button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Modal Wrapper ───────────────────────────────────────────
function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-6 overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} border border-slate-200 my-auto`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{title}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors"><X size={14} /></button>
        </div>
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
}

// ─── Field helpers ───────────────────────────────────────────
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 mb-1.5">{label}</label>
      {children}
      {error && <p className="text-[10px] text-red-500 font-semibold mt-1">{error}</p>}
    </div>
  );
}

const inputCls = 'w-full bg-white border border-slate-200 rounded-lg px-3 py-2.5 text-xs text-slate-900 placeholder-slate-400 shadow-sm focus:outline-none focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all';

// ═══════════════════════════════════════════════════════════════
// PANEL 1 — Overview
// ═══════════════════════════════════════════════════════════════
function OverviewPanel() {
  const orders   = adminStore.getOrders();
  const products = adminStore.getProducts();
  const customers = adminStore.getCustomers();
  const revenue  = orders.filter(o => o.status !== 'canceled').reduce((s, o) => s + o.total, 0);
  const pending  = orders.filter(o => o.status === 'pending').length;
  const lowStock = products.filter(p => p.stockCount <= 10 && p.inStock);

  // Sparkline data generator
  const genSparkline = () => Array.from({ length: 12 }, () => Math.floor(Math.random() * 40) + 10);

  const kpis = [
    { label: 'Total Revenue', value: `EGP ${revenue.toLocaleString()}`, icon: <DollarSign size={18} />, color: '#1E3A8A', bg: '#EBF0FB', change: '+14.2%', data: genSparkline() },
    { label: 'Total Orders',  value: orders.length,                      icon: <ShoppingBag size={18} />, color: '#4A7C59', bg: '#EDF3EE', change: `${pending} pending`, data: genSparkline() },
    { label: 'Products',      value: products.length,                    icon: <Package size={18} />,     color: '#B5742A', bg: '#FDF3E5', change: `${lowStock.length} low stock`, data: genSparkline() },
    { label: 'Customers',     value: customers.length,                   icon: <UserCheck size={18} />,   color: '#9B1239', bg: '#FEF2F2', change: '+3 this week', data: genSparkline() },
  ];

  const recent = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  // Kanban buckets
  const statuses = ['pending', 'processing', 'shipped', 'delivered'] as const;
  
  // Mock monthly revenue data
  const revenueData = [
    { month: 'Jan', val: 12000 }, { month: 'Feb', val: 15000 }, { month: 'Mar', val: 11000 },
    { month: 'Apr', val: 22000 }, { month: 'May', val: 18000 }, { month: 'Jun', val: 26000 },
    { month: 'Jul', val: 30000 },
  ];
  const maxRev = Math.max(...revenueData.map(d => d.val));

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center justify-between tracking-tight">General Report <button className="text-xs font-semibold text-slate-500 hover:text-[#1E40AF] flex items-center gap-1"><RefreshCw size={12}/> Reload Data</button></h2>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8">
        {kpis.map(k => (
          <div key={k.label} className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 ring-1 ring-slate-200/50 p-6 transition-all duration-300 relative overflow-hidden group min-h-[160px] flex flex-col justify-between">
            <div className="flex items-start justify-between relative z-10">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200/60 shadow-sm text-slate-600 group-hover:scale-110 transition-transform duration-300">{k.icon}</div>
              <span className="text-[12px] font-semibold text-emerald-700 bg-emerald-50/80 px-2.5 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200/50 backdrop-blur-sm shadow-sm">{k.change}</span>
            </div>
            <div className="relative z-10 mt-6">
              <div className="text-3xl leading-none font-bold tracking-tight text-slate-900">{k.value}</div>
              <div className="text-sm text-slate-500 font-medium mt-2">{k.label}</div>
            </div>
            
            {/* Sparkline */}
            <div className="absolute bottom-0 left-0 right-0 h-16 opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500">
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
                <path
                  d={`M0,50 ${k.data.map((v, i) => `L${(i / (k.data.length - 1)) * 100},${50 - v}`).join(' ')} L100,50 Z`}
                  fill={k.color}
                  stroke="none"
                />
                <path
                  d={`M0,${50 - k.data[0]} ${k.data.map((v, i) => `L${(i / (k.data.length - 1)) * 100},${50 - v}`).join(' ')}`}
                  fill="none"
                  stroke={k.color}
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Revenue Overview</h3>
            <span className="text-[10px] font-black text-slate-900 bg-[#1E3A8A]/10 px-2 py-0.5 rounded-md">YTD</span>
          </div>
          <div className="flex-1 flex items-end gap-3 h-48">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full bg-[#1E3A8A]/10 rounded-t-lg relative flex items-end group-hover:bg-[#1E3A8A]/20 transition-colors">
                  <div
                    className="w-full bg-[#1E3A8A] rounded-t-lg transition-all duration-500 group-hover:bg-[#2B52C1]"
                    style={{ height: `${(d.val / maxRev) * 100}%` }}
                  />
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    EGP {(d.val / 1000).toFixed(1)}k
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Low Stock</h3>
            <AlertTriangle size={14} className="text-amber-500" />
          </div>
          {lowStock.length === 0
            ? <p className="px-5 py-8 text-xs text-slate-400 text-center font-semibold m-auto">All products well stocked ✅</p>
            : <div className="divide-y divide-slate-50 flex-1 overflow-y-auto max-h-[220px]">
                {lowStock.map(p => (
                  <div key={p.id} className="px-5 py-3 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                    <span className="text-xs font-semibold text-slate-800 truncate max-w-[60%]">{p.name}</span>
                    <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{p.stockCount} left</span>
                  </div>
                ))}
              </div>
          }
        </div>
      </div>

      {/* Kanban Pipeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Order Pipeline</h3>
          <span className="text-[10px] font-semibold text-slate-500">{orders.length} Total Orders</span>
        </div>
        <div className="flex gap-4 min-w-[800px]">
          {statuses.map(status => {
            const bucket = orders.filter(o => o.status === status);
            return (
              <div key={status} className="flex-1 bg-slate-50/80 rounded-xl p-3 flex flex-col min-h-[300px]">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-600">{status}</h4>
                  <span className="text-[10px] font-black text-slate-400 bg-white shadow-sm border border-slate-100 px-1.5 py-0.5 rounded-md">{bucket.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {bucket.slice(0, 5).map(o => (
                    <div key={o.id} className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm cursor-pointer hover:border-[#1E3A8A]/30 hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-black text-slate-900">{o.id}</span>
                        <span className="text-[10px] font-bold text-slate-400">{o.date.split('T')[0]}</span>
                      </div>
                      <div className="text-xs font-bold text-slate-800 mb-1">{o.customer}</div>
                      <div className="text-xs font-black text-emerald-600">EGP {o.total.toLocaleString()}</div>
                    </div>
                  ))}
                  {bucket.length > 5 && (
                    <div className="text-center py-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">+{bucket.length - 5} more</span>
                    </div>
                  )}
                  {bucket.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-xs font-semibold border-2 border-dashed border-slate-200 rounded-lg">
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 2 — Products
// ═══════════════════════════════════════════════════════════════
const EMPTY_PRODUCT: AdminProduct = {
  id: '', slug: '', name: '', brand: '', category: 'pharmacy', subcategory: '',
  price: 0, originalPrice: undefined, rating: 4.5, reviewCount: 0,
  image: '', badge: '', inStock: true, stockCount: 0, description: '', tags: '',
};

function ProductsPanel() {
  const [products, setProducts]     = useState<AdminProduct[]>([]);
  const [search, setSearch]         = useState('');
  const [catFilter, setCatFilter]   = useState('all');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editing, setEditing]       = useState<AdminProduct | null>(null);
  const [form, setForm]             = useState<AdminProduct>(EMPTY_PRODUCT);
  const [errors, setErrors]         = useState<Record<string, string>>({});
  const [deleteId, setDeleteId]     = useState<string | null>(null);
  const [selected, setSelected]     = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading]   = useState(false);

  const API_URL = '/api';

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        toast.error('Failed to load products');
      }
    } catch (err) {
      toast.error('Network error while loading products');
    } finally {
      setIsLoading(false);
    }
  }, [API_URL]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openAdd = () => { setEditing(null); setForm({ ...EMPTY_PRODUCT, id: Date.now().toString() }); setErrors({}); setModalOpen(true); };
  const openEdit = (p: AdminProduct) => { setEditing(p); setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(',') : p.tags }); setErrors({}); setModalOpen(true); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim())  e.name  = 'Name is required';
    if (!form.brand.trim()) e.brand = 'Brand is required';
    if (!form.slug.trim())  e.slug  = 'Slug is required';
    if (form.price <= 0)    e.price = 'Price must be > 0';
    if (!form.image.trim()) e.image = 'Image URL is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API_URL}/products/${editing.id}` : `${API_URL}/products`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editing ? 'Product updated!' : 'Product added!');
        fetchProducts();
        setModalOpen(false);
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Failed to save product');
      }
    } catch (err) {
      toast.error('Network error while saving product');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_URL}/products/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Product deleted');
        fetchProducts();
      } else {
        toast.error('Failed to delete product');
      }
    } catch (err) {
      toast.error('Network error while deleting product');
    } finally {
      setDeleteId(null);
    }
  };

  const deleteSelected = async () => {
    // Delete in parallel or sequentially
    const promises = Array.from(selected).map(id => fetch(`${API_URL}/products/${id}`, { method: 'DELETE' }));
    try {
      await Promise.all(promises);
      toast.success(`${selected.size} products deleted`);
      setSelected(new Set());
      fetchProducts();
    } catch (err) {
      toast.error('Failed to delete some products');
    }
  };

  const toggleSelect = (id: string) => {
    const s = new Set(selected);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelected(s);
  };

  const f = (key: keyof AdminProduct, val: any) => setForm(prev => ({ ...prev, [key]: val }));

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.slug.includes(q);
    const matchC = catFilter === 'all' || p.category === catFilter;
    return matchQ && matchC;
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 p-5 border-b border-slate-50">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className={`${inputCls} pl-8`} />
          </div>
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className={`${inputCls} w-auto`}>
            {['all','pharmacy','beauty','wellness','personal-care'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {selected.size > 0 && (
            <button onClick={deleteSelected} className="flex items-center gap-1.5 px-3 py-2 bg-red-500 text-white rounded-xl text-xs font-black hover:bg-red-600 transition-colors">
              <Trash2 size={12} /> Delete ({selected.size})
            </button>
          )}
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-black hover:bg-[#163074] transition-colors shadow-sm">
            <Plus size={13} /> Add Product
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="w-10 px-4 py-3"><input type="checkbox" onChange={e => setSelected(e.target.checked ? new Set(filtered.map(p => p.id)) : new Set())} /></th>
              {['Image','Name','Brand','Category','Price','Stock','Badge','Actions'].map(h => (
                <th key={h} className="px-3 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={9} className="px-4 py-12 text-center text-slate-400 font-semibold">No products found</td></tr>
                : filtered.map(p => (
                  <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSelect(p.id)} /></td>
                    <td className="px-3 py-3"><img src={p.image} className="w-8 h-8 rounded object-contain bg-white border border-slate-100 p-0.5" onError={e => (e.currentTarget.src = 'https://placehold.co/80x80?text=ERR')} /></td>
                    <td className="px-3 py-3 font-semibold text-slate-800 max-w-[120px] truncate">{p.name}</td>
                    <td className="px-3 py-3 text-slate-500">{p.brand}</td>
                    <td className="px-3 py-3 text-slate-500 capitalize">{p.category}</td>
                    <td className="px-3 py-3 font-black text-slate-900">EGP {p.price}</td>
                    <td className="px-3 py-3"><span className={`font-black px-2 py-0.5 rounded-full ${p.stockCount > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{p.stockCount}</span></td>
                    <td className="px-3 py-3"><StatusBadge status={p.badge || 'none'} /></td>
                    <td className="px-3 py-3">
                      <div className="flex gap-1.5">
                        <button onClick={() => openEdit(p)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"><Edit2 size={12} /></button>
                        <button onClick={() => setDeleteId(p.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-50 text-xs text-slate-400 font-semibold">
          Showing {filtered.length} of {products.length} products
        </div>
      </div>

      {/* Product Modal */}
      {modalOpen && (
        <Modal title={editing ? 'Edit Product' : 'Add New Product'} onClose={() => setModalOpen(false)} wide>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Product Name *" error={errors.name}>
              <input className={inputCls} value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Vitamin D3 5000 IU" />
            </Field>
            <Field label="Brand *" error={errors.brand}>
              <input className={inputCls} value={form.brand} onChange={e => f('brand', e.target.value)} placeholder="e.g. Now Foods" />
            </Field>
            <Field label="Slug *" error={errors.slug}>
              <input className={inputCls} value={form.slug} onChange={e => f('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="e.g. vitamin-d3-5000iu" />
            </Field>
            <Field label="Category">
              <select className={inputCls} value={form.category} onChange={e => f('category', e.target.value)}>
                {['pharmacy','beauty','wellness','personal-care'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Subcategory">
              <input className={inputCls} value={form.subcategory} onChange={e => f('subcategory', e.target.value)} placeholder="e.g. vitamins-minerals" />
            </Field>
            <Field label="Badge">
              <select className={inputCls} value={form.badge ?? ''} onChange={e => f('badge', e.target.value)}>
                {['','sale','new','hot','pharmacist-pick'].map(b => <option key={b} value={b}>{b || 'None'}</option>)}
              </select>
            </Field>
            <Field label="Price (EGP) *" error={errors.price}>
              <input type="number" className={inputCls} value={form.price} onChange={e => f('price', Number(e.target.value))} placeholder="0" />
            </Field>
            <Field label="Original Price (EGP)">
              <input type="number" className={inputCls} value={form.originalPrice ?? ''} onChange={e => f('originalPrice', e.target.value ? Number(e.target.value) : undefined)} placeholder="For sale badge" />
            </Field>
            <Field label="Stock Count">
              <input type="number" className={inputCls} value={form.stockCount} onChange={e => f('stockCount', Number(e.target.value))} placeholder="0" />
            </Field>
            <Field label="Rating (0–5)">
              <input type="number" step="0.1" min="0" max="5" className={inputCls} value={form.rating} onChange={e => f('rating', Number(e.target.value))} />
            </Field>
            <div className="col-span-2">
              <Field label="Image URL *" error={errors.image}>
                <input className={inputCls} value={form.image} onChange={e => f('image', e.target.value)} placeholder="https://..." />
              </Field>
              {form.image && <img src={form.image} className="mt-2 h-16 w-16 rounded-lg object-contain bg-slate-50 border border-slate-100 p-1" onError={e => (e.currentTarget.src = 'https://placehold.co/80x80?text=ERR')} />}
            </div>
            <div className="col-span-2">
              <Field label="Description">
                <textarea rows={2} className={inputCls} value={form.description} onChange={e => f('description', e.target.value)} placeholder="Short product description..." />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Tags (comma-separated)">
                <input className={inputCls} value={form.tags} onChange={e => f('tags', e.target.value)} placeholder="e.g. immunity,vitamin-d,bone-health" />
              </Field>
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">In Stock</label>
              <button onClick={() => f('inStock', !form.inStock)} className={`w-10 h-5 rounded-full transition-colors relative ${form.inStock ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${form.inStock ? 'left-5' : 'left-0.5'}`} />
              </button>
              <span className="text-xs font-semibold text-slate-600">{form.inStock ? 'Yes' : 'No'}</span>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-5 border-t border-slate-100">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-black hover:bg-[#163074] transition-colors flex items-center justify-center gap-1.5 shadow-sm">
              <Save size={13} /> {editing ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </Modal>
      )}

      {deleteId && (
        <ConfirmDialog
          message="This will permanently delete the product from the catalog."
          onConfirm={confirmDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 3 — Categories
// ═══════════════════════════════════════════════════════════════
function CategoriesPanel() {
  const [cats, setCats]       = useState<AdminCategory[]>([]);
  const [modalOpen, setModal] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [form, setForm]       = useState<AdminCategory>({ id: '', name: '', nameAr: '', slug: '', description: '', icon: '📦', color: '#1E3A8A', gradient: '', image: '' });
  const [deleteId, setDel]    = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);

  const API_URL = '/api';

  const fetchCats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (res.ok) {
        const data = await res.json();
        setCats(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [API_URL]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/products`);
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [API_URL]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCats();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchCats, fetchProducts]);

  const f = (key: keyof AdminCategory, val: string) => setForm(p => ({ ...p, [key]: val }));

  const openAdd = () => { setEditing(null); setForm({ id: '', name: '', nameAr: '', slug: '', description: '', icon: '📦', color: '#1E3A8A', gradient: 'linear-gradient(135deg, #1E3A8A, #0F52BA)', image: '' }); setModal(true); };
  const openEdit = (c: AdminCategory) => { setEditing(c); setForm({ ...c }); setModal(true); };

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) { toast.error('Name and slug required'); return; }
    
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API_URL}/categories/${editing.id}` : `${API_URL}/categories`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editing ? 'Category updated!' : 'Category added!');
        fetchCats();
        setModal(false);
      } else {
        toast.error('Failed to save category');
      }
    } catch (err) {
      toast.error('Network error saving category');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_URL}/categories/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Category deleted');
        fetchCats();
      } else {
        toast.error('Failed to delete category');
      }
    } catch (err) {
      toast.error('Network error deleting category');
    } finally {
      setDel(null);
    }
  };

  const productCount = (id: string) => products.filter(p => p.category === id).length;

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-black hover:bg-[#163074] transition-colors shadow-sm">
            <Plus size={13} /> Add Category
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {cats.map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white hover:shadow-md transition-shadow">
              <div className="h-2" style={{ background: c.gradient || c.color }} />
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">{c.name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">{c.nameAr}</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(c)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"><Edit2 size={12} /></button>
                    <button onClick={() => setDel(c.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 font-medium mb-3">{c.description}</p>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-mono">/{c.slug}</span>
                  <span className="font-black px-2 py-0.5 rounded-full text-white" style={{ background: c.color }}>{productCount(c.id)} products</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Category' : 'Add Category'} onClose={() => setModal(false)}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name (EN) *"><input className={inputCls} value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Pharmacy" /></Field>
              <Field label="Name (AR) *"><input className={inputCls} value={form.nameAr} onChange={e => f('nameAr', e.target.value)} placeholder="e.g. الصيدلية" /></Field>
              <Field label="Slug *"><input className={inputCls} value={form.slug} onChange={e => f('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="e.g. pharmacy" /></Field>
              <Field label="Icon Emoji"><input className={inputCls} value={form.icon} onChange={e => f('icon', e.target.value)} placeholder="💊" /></Field>
              <Field label="Color (hex)"><input type="color" className="w-full h-10 rounded-xl border border-slate-200 cursor-pointer" value={form.color} onChange={e => f('color', e.target.value)} /></Field>
              <Field label="Gradient CSS"><input className={inputCls} value={form.gradient} onChange={e => f('gradient', e.target.value)} placeholder="linear-gradient(135deg, #fff, #000)" /></Field>
            </div>
            <Field label="Description"><input className={inputCls} value={form.description} onChange={e => f('description', e.target.value)} placeholder="Short description..." /></Field>
            <Field label="Image URL"><input className={inputCls} value={form.image} onChange={e => f('image', e.target.value)} placeholder="https://..." /></Field>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
            <button onClick={() => setModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-black hover:bg-[#163074] transition-colors flex items-center justify-center gap-1.5">
              <Save size={13} /> Save
            </button>
          </div>
        </Modal>
      )}

      {deleteId && <ConfirmDialog message="Delete this category? Products will not be deleted." onConfirm={confirmDelete} onCancel={() => setDel(null)} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 3.5 — Brands CRUD
// ═══════════════════════════════════════════════════════════════
interface AdminBrand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  productCount: number;
  featured: boolean;
}

const EMPTY_BRAND: AdminBrand = {
  id: '', name: '', slug: '', logo: '🔵', productCount: 0, featured: false,
};

function BrandsPanel() {
  const [brands, setBrands]     = useState<AdminBrand[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]   = useState<AdminBrand | null>(null);
  const [form, setForm]         = useState<AdminBrand>(EMPTY_BRAND);
  const [deleteId, setDel]      = useState<string | null>(null);

  const API_URL = '/api';

  const fetchBrands = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/brands`);
      if (res.ok) {
        const data = await res.json();
        setBrands(data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [API_URL]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const f = (key: keyof AdminBrand, val: any) => setForm(p => ({ ...p, [key]: val }));

  const openAdd = () => { setEditing(null); setForm(EMPTY_BRAND); setModalOpen(true); };
  const openEdit = (b: AdminBrand) => { setEditing(b); setForm({ ...b }); setModalOpen(true); };

  const save = async () => {
    if (!form.name.trim() || !form.slug.trim()) { toast.error('Name and slug required'); return; }
    
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `${API_URL}/brands/${editing.id}` : `${API_URL}/brands`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success(editing ? 'Brand updated!' : 'Brand added!');
        fetchBrands();
        setModalOpen(false);
      } else {
        toast.error('Failed to save brand');
      }
    } catch (err) {
      toast.error('Network error saving brand');
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${API_URL}/brands/${deleteId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        toast.success('Brand deleted');
        fetchBrands();
      } else {
        toast.error('Failed to delete brand');
      }
    } catch (err) {
      toast.error('Network error deleting brand');
    } finally {
      setDel(null);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex justify-end">
          <button onClick={openAdd} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-black hover:bg-[#163074] transition-colors shadow-sm">
            <Plus size={13} /> Add Brand
          </button>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          {brands.map(b => (
            <div key={b.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-50 border border-slate-100 rounded-lg">{b.logo}</span>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">{b.name}</h3>
                  <p className="text-[10px] text-slate-400 font-mono">/{b.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openEdit(b)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"><Edit2 size={12} /></button>
                <button onClick={() => setDel(b.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Brand' : 'Add Brand'} onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <Field label="Brand Name *"><input className={inputCls} value={form.name} onChange={e => { f('name', e.target.value); f('slug', e.target.value.toLowerCase().replace(/\s+/g, '-')); }} placeholder="e.g. Now Foods" /></Field>
            <Field label="Brand Slug *"><input className={inputCls} value={form.slug} onChange={e => f('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'))} placeholder="e.g. now-foods" /></Field>
            <Field label="Brand Logo / Emoji"><input className={inputCls} value={form.logo} onChange={e => f('logo', e.target.value)} placeholder="e.g. 🔵 or emoji" /></Field>
            <div className="flex items-center gap-3">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500">Featured Partner</label>
              <button onClick={() => f('featured', !form.featured)} className={`w-10 h-5 rounded-full transition-colors relative ${form.featured ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${form.featured ? 'left-5' : 'left-0.5'}`} />
              </button>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
            <button onClick={() => setModalOpen(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-black hover:bg-[#163074] transition-colors flex items-center justify-center gap-1.5"><Save size={13} /> Save</button>
          </div>
        </Modal>
      )}

      {deleteId && <ConfirmDialog message="Delete this brand?" onConfirm={confirmDelete} onCancel={() => setDel(null)} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 4 — Orders
// ═══════════════════════════════════════════════════════════════
function OrdersPanel() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteId, setDel]  = useState<string | null>(null);
  const [addModal, setAdd]  = useState(false);
  const [newOrder, setNew]  = useState<Partial<AdminOrder>>({ status: 'pending', paymentMethod: 'instapay' });

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setOrders(adminStore.getOrders()); }, []);
  const persist = (o: AdminOrder[]) => { setOrders(o); adminStore.saveOrders(o); };

  const updateStatus = (id: string, status: AdminOrder['status']) => {
    persist(orders.map(o => o.id === id ? { ...o, status } : o));
    toast.success('Order status updated');
  };

  const exportCSV = () => {
    const rows = [
      ['Order ID','Customer','Phone','Items','Total','Status','Payment','Date'],
      ...orders.map(o => [o.id, o.customer, o.phone, o.items, o.total, o.status, o.paymentMethod, o.date])
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = '2m-orders.csv'; a.click();
    toast.success('Orders exported!');
  };

  const addOrder = () => {
    if (!newOrder.customer?.trim() || !newOrder.items?.trim() || !newOrder.total) { toast.error('Fill required fields'); return; }
    const o: AdminOrder = {
      id: `2M-${Date.now().toString().slice(-5)}`,
      customer: newOrder.customer || '',
      phone: newOrder.phone || '',
      items: newOrder.items || '',
      total: Number(newOrder.total) || 0,
      status: newOrder.status as AdminOrder['status'] || 'pending',
      paymentMethod: newOrder.paymentMethod as AdminOrder['paymentMethod'] || 'instapay',
      address: newOrder.address || '',
      date: new Date().toISOString().split('T')[0],
      notes: newOrder.notes || '',
    };
    persist([o, ...orders]);
    setAdd(false);
    setNew({ status: 'pending', paymentMethod: 'instapay' });
    toast.success('Order added!');
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matchQ = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    const matchF = filter === 'all' || o.status === filter;
    return matchQ && matchF;
  });

  const statuses: AdminOrder['status'][] = ['pending','processing','shipped','delivered','canceled'];

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
        <div className="flex flex-wrap items-center gap-3 p-5 border-b border-slate-50">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders..." className={`${inputCls} pl-8`} />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} className={`${inputCls} w-auto`}>
            {['all',...statuses].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={exportCSV} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition-colors">
            <Download size={12} /> CSV
          </button>
          <button onClick={() => setAdd(true)} className="flex items-center gap-1.5 px-4 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-black hover:bg-[#163074] transition-colors shadow-sm">
            <Plus size={13} /> Add Order
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50/80 border-b border-slate-100">
              {['Order ID','Customer','Items','Total','Payment','Status','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={7} className="px-4 py-12 text-center text-slate-400 font-semibold">No orders found</td></tr>
                : filtered.map((o, i) => (
                  <>
                    <tr key={o.id} className={`border-b border-slate-50 cursor-pointer hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                      <td className="px-4 py-3 font-black text-slate-900">{o.id}</td>
                      <td className="px-4 py-3 font-semibold text-slate-800 whitespace-nowrap">{o.customer}</td>
                      <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{o.items}</td>
                      <td className="px-4 py-3 font-black text-slate-900 whitespace-nowrap">EGP {o.total.toLocaleString()}</td>
                      <td className="px-4 py-3"><StatusBadge status={o.paymentMethod} /></td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <select
                          value={o.status}
                          onChange={e => updateStatus(o.id, e.target.value as AdminOrder['status'])}
                          className={`${inputCls} py-1 text-[10px] font-black w-28`}
                          style={{ color: o.status === 'canceled' ? '#dc2626' : o.status === 'delivered' ? '#16a34a' : '#1E3A8A' }}
                        >
                          {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => setExpanded(expanded === o.id ? null : o.id)} className="w-7 h-7 rounded-lg bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors"><Eye size={12} /></button>
                          <button onClick={() => setDel(o.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
                        </div>
                      </td>
                    </tr>
                    {expanded === o.id && (
                      <tr key={`${o.id}-exp`} className="bg-blue-50/30">
                        <td colSpan={7} className="px-6 py-4">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                            <div><p className="text-slate-400 font-bold uppercase mb-1">Phone</p><p className="font-semibold text-slate-800">{o.phone}</p></div>
                            <div><p className="text-slate-400 font-bold uppercase mb-1">Address</p><p className="font-semibold text-slate-800">{o.address || '—'}</p></div>
                            <div><p className="text-slate-400 font-bold uppercase mb-1">Date</p><p className="font-semibold text-slate-800">{o.date}</p></div>
                            <div><p className="text-slate-400 font-bold uppercase mb-1">Notes</p><p className="font-semibold text-slate-800">{o.notes || '—'}</p></div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-50 text-xs text-slate-400 font-semibold">
          {filtered.length} orders | Total: EGP {filtered.filter(o => o.status !== 'canceled').reduce((s, o) => s + o.total, 0).toLocaleString()}
        </div>
      </div>

      {addModal && (
        <Modal title="Add New Order" onClose={() => setAdd(false)} wide>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Customer Name *"><input className={inputCls} value={newOrder.customer || ''} onChange={e => setNew(p => ({...p, customer: e.target.value}))} placeholder="Full name" /></Field>
            <Field label="Phone"><input className={inputCls} value={newOrder.phone || ''} onChange={e => setNew(p => ({...p, phone: e.target.value}))} placeholder="01xxxxxxxxx" /></Field>
            <Field label="Items *"><input className={inputCls} value={newOrder.items || ''} onChange={e => setNew(p => ({...p, items: e.target.value}))} placeholder="Product names..." /></Field>
            <Field label="Total (EGP) *"><input type="number" className={inputCls} value={newOrder.total || ''} onChange={e => setNew(p => ({...p, total: Number(e.target.value)}))} /></Field>
            <Field label="Payment Method">
              <select className={inputCls} value={newOrder.paymentMethod || 'instapay'} onChange={e => setNew(p => ({...p, paymentMethod: e.target.value as AdminOrder['paymentMethod']}))}>
                {['instapay','vodafone','ecash'].map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select className={inputCls} value={newOrder.status || 'pending'} onChange={e => setNew(p => ({...p, status: e.target.value as AdminOrder['status']}))}>
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <div className="col-span-2"><Field label="Address"><input className={inputCls} value={newOrder.address || ''} onChange={e => setNew(p => ({...p, address: e.target.value}))} placeholder="City, District..." /></Field></div>
            <div className="col-span-2"><Field label="Notes"><input className={inputCls} value={newOrder.notes || ''} onChange={e => setNew(p => ({...p, notes: e.target.value}))} /></Field></div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
            <button onClick={() => setAdd(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={addOrder} className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-black hover:bg-[#163074] transition-colors flex items-center justify-center gap-1.5"><Save size={13} /> Add Order</button>
          </div>
        </Modal>
      )}

      {deleteId && <ConfirmDialog message={`Delete order ${deleteId}?`} onConfirm={() => { persist(orders.filter(o => o.id !== deleteId)); setDel(null); toast.success('Order deleted'); }} onCancel={() => setDel(null)} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 5 — Customers
// ═══════════════════════════════════════════════════════════════
function CustomersPanel() {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDel] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setCustomers(adminStore.getCustomers()); }, []);
  const persist = (c: AdminCustomer[]) => { setCustomers(c); adminStore.saveCustomers(c); };

  const filtered = customers.filter(c => {
    const q = search.toLowerCase();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
        <div className="flex items-center gap-3 p-5 border-b border-slate-50">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..." className={`${inputCls} pl-8`} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead><tr className="bg-slate-50/80 border-b border-slate-100">
              {['Name','Phone','Email','Address','Orders','Spent','Joined','Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-black text-slate-500 uppercase tracking-wider text-[10px] whitespace-nowrap">{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400 font-semibold">No customers found</td></tr>
                : filtered.map((c, i) => (
                  <tr key={c.id} className={`border-b border-slate-50 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                    <td className="px-4 py-3 font-bold text-slate-900 whitespace-nowrap">{c.name}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.phone}</td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{c.email}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-[140px] truncate">{c.address}</td>
                    <td className="px-4 py-3 font-black text-slate-900">{c.totalOrders}</td>
                    <td className="px-4 py-3 font-black text-slate-900">EGP {c.totalSpent.toLocaleString()}</td>
                    <td className="px-4 py-3 text-slate-400 whitespace-nowrap">{c.joinDate}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDel(c.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 border-t border-slate-50 text-xs text-slate-400 font-semibold">
          {filtered.length} customers | Total revenue: EGP {filtered.reduce((s, c) => s + c.totalSpent, 0).toLocaleString()}
        </div>
      </div>

      {deleteId && <ConfirmDialog message="Remove this customer record?" onConfirm={() => { persist(customers.filter(c => c.id !== deleteId)); setDel(null); toast.success('Customer removed'); }} onCancel={() => setDel(null)} />}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 6 — Announcements
// ═══════════════════════════════════════════════════════════════
function AnnouncementsPanel() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [editId, setEditId] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setItems(adminStore.getAnnouncements()); }, []);
  const persist = (a: Announcement[]) => { setItems(a); adminStore.saveAnnouncements(a); toast.success('Announcements saved!'); };

  const update = (id: string, key: keyof Announcement, val: string | boolean) => {
    setItems(prev => prev.map(a => a.id === id ? { ...a, [key]: val } : a));
  };

  const save = () => persist(items);
  const add  = () => { const n = { id: Date.now().toString(), textEn: 'New announcement', textAr: 'إعلان جديد', active: true }; setItems(p => [...p, n]); };
  const del  = (id: string) => setItems(p => p.filter(a => a.id !== id));
  const move = (i: number, dir: -1 | 1) => { const a = [...items]; [a[i], a[i + dir]] = [a[i + dir], a[i]]; setItems(a); };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
      <div className="flex items-center justify-between p-5 border-b border-slate-50">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Announcement Bar</h3>
          <p className="text-[10px] text-slate-400 font-medium mt-0.5">These rotate in the top navbar bar every 3.5 seconds</p>
        </div>
        <div className="flex gap-2">
          <button onClick={add} className="flex items-center gap-1.5 px-3 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-black hover:bg-[#163074] transition-colors"><Plus size={12} /> Add</button>
          <button onClick={save} className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition-colors"><Save size={12} /> Save All</button>
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {items.map((a, i) => (
          <div key={a.id} className={`p-4 ${!a.active ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-3">
              {/* Order controls */}
              <div className="flex flex-col gap-0.5 mt-1 flex-shrink-0">
                <button onClick={() => i > 0 && move(i, -1)} disabled={i === 0} className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-colors"><ArrowUp size={10} /></button>
                <button onClick={() => i < items.length - 1 && move(i, 1)} disabled={i === items.length - 1} className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center disabled:opacity-30 transition-colors"><ArrowDown size={10} /></button>
              </div>

              <div className="flex-1 space-y-2">
                {editId === a.id ? (
                  <>
                    <Field label="English Text">
                      <input className={inputCls} value={a.textEn} onChange={e => update(a.id, 'textEn', e.target.value)} />
                    </Field>
                    <Field label="Arabic Text">
                      <input className={inputCls} dir="rtl" value={a.textAr} onChange={e => update(a.id, 'textAr', e.target.value)} />
                    </Field>
                  </>
                ) : (
                  <>
                    <p className="text-xs font-semibold text-slate-800">{a.textEn}</p>
                    <p className="text-xs font-semibold text-slate-500 text-right" dir="rtl">{a.textAr}</p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button onClick={() => update(a.id, 'active', !a.active)} className={`transition-colors ${a.active ? 'text-emerald-500' : 'text-slate-300'}`}>
                  {a.active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                </button>
                <button onClick={() => setEditId(editId === a.id ? null : a.id)} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"><Edit2 size={12} /></button>
                <button onClick={() => del(a.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 7 — Site Settings
// ═══════════════════════════════════════════════════════════════
function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>(adminStore.getSettings());
  const f = (key: keyof SiteSettings, val: string | number) => setSettings(p => ({ ...p, [key]: val }));

  const save = () => { adminStore.saveSettings(settings); toast.success('Settings saved!'); };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
      <div className="flex items-center justify-between p-5 border-b border-slate-50">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Store Configuration</h3>
        <button onClick={save} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition-colors shadow-sm"><Save size={13} /> Save Settings</button>
      </div>
      <div className="p-6">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Store Name (English)"><input className={inputCls} value={settings.storeNameEn} onChange={e => f('storeNameEn', e.target.value)} /></Field>
          <Field label="Store Name (Arabic)"><input className={inputCls} dir="rtl" value={settings.storeNameAr} onChange={e => f('storeNameAr', e.target.value)} /></Field>
          <Field label="WhatsApp Number (with country code)"><input className={inputCls} value={settings.whatsapp} onChange={e => f('whatsapp', e.target.value)} placeholder="201115160947" /></Field>
          <Field label="Phone Number"><input className={inputCls} value={settings.phone} onChange={e => f('phone', e.target.value)} placeholder="01115160947" /></Field>
          <Field label="Email Address"><input className={inputCls} value={settings.email} onChange={e => f('email', e.target.value)} /></Field>
          <Field label="Store Address"><input className={inputCls} value={settings.address} onChange={e => f('address', e.target.value)} /></Field>
          <Field label="Free Delivery Threshold (EGP)"><input type="number" className={inputCls} value={settings.freeDeliveryThreshold} onChange={e => f('freeDeliveryThreshold', Number(e.target.value))} /></Field>
          <Field label="Delivery Fee (EGP)"><input type="number" className={inputCls} value={settings.deliveryFee} onChange={e => f('deliveryFee', Number(e.target.value))} /></Field>
          <div className="sm:col-span-2">
            <Field label="InstaPay Username"><input className={inputCls} value={settings.instaPayUsername} onChange={e => f('instaPayUsername', e.target.value)} placeholder="@2mpharmacy" /></Field>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 8 — Content
// ═══════════════════════════════════════════════════════════════
function ContentPanel() {
  const [hero, setHero]   = useState<HeroContent>(adminStore.getHero());
  const [faqs, setFaqs]   = useState<FaqItem[]>(adminStore.getFaqs());
  const [editFaq, setEditFaq] = useState<FaqItem | null>(null);
  const [faqModal, setFaqModal] = useState(false);
  const [deleteFaq, setDeleteFaq] = useState<string | null>(null);

  const saveHero = () => { adminStore.saveHero(hero); toast.success('Hero content saved!'); };
  const persistFaqs = (f: FaqItem[]) => { setFaqs(f); adminStore.saveFaqs(f); };

  const saveFaq = () => {
    if (!editFaq) return;
    const next = editFaq.id && faqs.find(f => f.id === editFaq.id)
      ? faqs.map(f => f.id === editFaq.id ? editFaq : f)
      : [...faqs, { ...editFaq, id: Date.now().toString() }];
    persistFaqs(next);
    setFaqModal(false);
    toast.success('FAQ saved!');
  };

  return (
    <div className="space-y-6">
      {/* Hero Content */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
        <div className="flex items-center justify-between p-5 border-b border-slate-50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Hero Section</h3>
          <button onClick={saveHero} className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-black hover:bg-emerald-600 transition-colors"><Save size={13} /> Save</button>
        </div>
        <div className="p-6 grid sm:grid-cols-2 gap-4">
          <Field label="Headline (English)"><input className={inputCls} value={hero.headlineEn} onChange={e => setHero(p => ({...p, headlineEn: e.target.value}))} /></Field>
          <Field label="Headline (Arabic)"><input className={inputCls} dir="rtl" value={hero.headlineAr} onChange={e => setHero(p => ({...p, headlineAr: e.target.value}))} /></Field>
          <Field label="Subtitle (English)"><textarea rows={2} className={inputCls} value={hero.subtitleEn} onChange={e => setHero(p => ({...p, subtitleEn: e.target.value}))} /></Field>
          <Field label="Subtitle (Arabic)"><textarea rows={2} className={inputCls} dir="rtl" value={hero.subtitleAr} onChange={e => setHero(p => ({...p, subtitleAr: e.target.value}))} /></Field>
          <Field label="CTA Button (English)"><input className={inputCls} value={hero.ctaEn} onChange={e => setHero(p => ({...p, ctaEn: e.target.value}))} /></Field>
          <Field label="CTA Button (Arabic)"><input className={inputCls} dir="rtl" value={hero.ctaAr} onChange={e => setHero(p => ({...p, ctaAr: e.target.value}))} /></Field>
        </div>
      </div>

      {/* FAQ Manager */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
        <div className="flex items-center justify-between p-5 border-b border-slate-50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">FAQ Manager</h3>
          <button onClick={() => { setEditFaq({ id: '', questionEn: '', questionAr: '', answerEn: '', answerAr: '' }); setFaqModal(true); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1E3A8A] text-white rounded-xl text-xs font-black hover:bg-[#163074] transition-colors"><Plus size={12} /> Add FAQ</button>
        </div>
        <div className="divide-y divide-slate-50">
          {faqs.map(f => (
            <div key={f.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-xs font-bold text-slate-900 mb-0.5">{f.questionEn}</p>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">{f.answerEn}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => { setEditFaq({ ...f }); setFaqModal(true); }} className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-colors"><Edit2 size={12} /></button>
                  <button onClick={() => setDeleteFaq(f.id)} className="w-7 h-7 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition-colors"><Trash2 size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {faqModal && editFaq && (
        <Modal title={editFaq.id && faqs.find(f => f.id === editFaq.id) ? 'Edit FAQ' : 'Add FAQ'} onClose={() => setFaqModal(false)} wide>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Question (EN)"><input className={inputCls} value={editFaq.questionEn} onChange={e => setEditFaq(p => p ? {...p, questionEn: e.target.value} : p)} /></Field>
              <Field label="Question (AR)"><input className={inputCls} dir="rtl" value={editFaq.questionAr} onChange={e => setEditFaq(p => p ? {...p, questionAr: e.target.value} : p)} /></Field>
              <Field label="Answer (EN)"><textarea rows={3} className={inputCls} value={editFaq.answerEn} onChange={e => setEditFaq(p => p ? {...p, answerEn: e.target.value} : p)} /></Field>
              <Field label="Answer (AR)"><textarea rows={3} className={inputCls} dir="rtl" value={editFaq.answerAr} onChange={e => setEditFaq(p => p ? {...p, answerAr: e.target.value} : p)} /></Field>
            </div>
          </div>
          <div className="flex gap-3 mt-5 pt-4 border-t border-slate-100">
            <button onClick={() => setFaqModal(false)} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-black text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={saveFaq} className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] text-white text-xs font-black hover:bg-[#163074] transition-colors flex items-center justify-center gap-1.5"><Save size={13} /> Save FAQ</button>
          </div>
        </Modal>
      )}

      {deleteFaq && <ConfirmDialog message="Delete this FAQ?" onConfirm={() => { persistFaqs(faqs.filter(f => f.id !== deleteFaq)); setDeleteFaq(null); toast.success('FAQ deleted'); }} onCancel={() => setDeleteFaq(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PANEL 9 — Security
// ═══════════════════════════════════════════════════════════════
function SecurityPanel() {
  const [current, setCurrent]   = useState('');
  const [newPass, setNewPass]   = useState('');
  const [confirm, setConfirm]   = useState('');
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const changePass = () => {
    setError(''); setSuccess(false);
    const stored = adminStore.getPassword();
    if (current !== stored) { setError('Current password is incorrect'); return; }
    if (newPass.length < 6) { setError('New password must be at least 6 characters'); return; }
    if (newPass !== confirm) { setError('Passwords do not match'); return; }
    adminStore.savePassword(newPass);
    setCurrent(''); setNewPass(''); setConfirm('');
    setSuccess(true);
    toast.success('Password changed successfully!');
  };

  return (
    <div className="max-w-md">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden bg-white">
        <div className="p-5 border-b border-slate-50">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Change Admin Password</h3>
        </div>
        <div className="p-6 space-y-4">
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <Check size={13} /> Password changed successfully
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold">
              <AlertTriangle size={13} /> {error}
            </div>
          )}
          <Field label="Current Password"><input type="password" className={inputCls} value={current} onChange={e => setCurrent(e.target.value)} placeholder="••••••••" /></Field>
          <Field label="New Password"><input type="password" className={inputCls} value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Min 6 characters" /></Field>
          <Field label="Confirm New Password"><input type="password" className={inputCls} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat new password" /></Field>
          <button onClick={changePass} className="w-full py-3 rounded-xl bg-[#1E3A8A] text-white text-xs font-black hover:bg-[#163074] transition-colors flex items-center justify-center gap-1.5 shadow-sm">
            <Lock size={13} /> Change Password
          </button>
        </div>
      </div>

      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-amber-700 mb-1">⚠️ Security Note</p>
        <p className="text-[10px] text-amber-600 font-medium leading-relaxed">
          Admin credentials are stored in the browser localStorage. Change the default password <code className="bg-amber-100 px-1 rounded">admin123</code> immediately for production use.
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN ADMIN DASHBOARD PAGE
// ═══════════════════════════════════════════════════════════════
export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const ok = localStorage.getItem('2m-admin-logged-in') === 'true';
    if (!ok) { router.push('/admin'); return; }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAuthorized(true);
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('2m-admin-logged-in');
    window.dispatchEvent(new Event('storage'));
    toast.success('Logged out');
    router.push('/admin');
  }, [router]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="w-10 h-10 border-2 border-[#E0B84A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const PANEL_MAP: Record<Panel, React.ReactNode> = {
    overview:      <OverviewPanel />,
    products:      <ProductsPanel />,
    categories:    <CategoriesPanel />,
    brands:        <BrandsPanel />,
    orders:        <OrdersPanel />,
    customers:     <CustomersPanel />,
    announcements: <AnnouncementsPanel />,
    settings:      <SettingsPanel />,
    content:       <ContentPanel />,
    security:      <SecurityPanel />,
  };

  const PANEL_TITLES: Record<Panel, string> = {
    overview: 'Overview Dashboard', products: 'Products Catalog',
    categories: 'Categories', brands: 'Brands Partner CRUD', orders: 'Orders Management',
    customers: 'Customers', announcements: 'Announcement Bar',
    settings: 'Site Settings', content: 'Content Management', security: 'Security',
  };

  const renderSidebar = ({ mobile }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-200 flex-shrink-0">
        <div className="w-9 h-9 flex items-center justify-center font-black text-white text-xl flex-shrink-0"><Package size={24} /></div>
        {(!sidebarCollapsed || mobile) && (
          <div className="overflow-hidden">
            <p className="text-slate-100 font-extrabold text-xl leading-none tracking-tight whitespace-nowrap">Mosaic</p>
            
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
        {(!sidebarCollapsed || mobile) && <div className="pl-6 mt-2 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Pages</div>}
        {NAV_ITEMS.slice(0, 6).map(item => {
          const active = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActivePanel(item.id); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 pl-6 pr-4 py-3 mb-2 text-[14px] font-semibold transition-all duration-150 rounded-l-full relative ${
                active ? 'bg-slate-100 text-[#1E40AF]' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {(!sidebarCollapsed || mobile) && <span className="truncate">{item.label}</span>}
              {(!sidebarCollapsed || mobile) && item.badge && (
                <span className="ml-auto bg-indigo-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{item.badge}</span>
              )}
            </button>
          );
        })}
        {(!sidebarCollapsed || mobile) && <div className="pl-6 mt-8 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">More</div>}
        {NAV_ITEMS.slice(6).map(item => {
          const active = activePanel === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setActivePanel(item.id); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 pl-6 pr-4 py-3 mb-2 text-[14px] font-semibold transition-all duration-150 rounded-l-full relative ${
                active ? 'bg-slate-100 text-[#1E40AF]' : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {(!sidebarCollapsed || mobile) && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200 flex-shrink-0 space-y-2">
        <Link href="/" className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 text-xs font-bold transition-all`}>
          <Eye size={14} className="flex-shrink-0" />
          {(!sidebarCollapsed || mobile) && 'View Storefront'}
        </Link>
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-bold transition-all">
          <LogOut size={14} className="flex-shrink-0" />
          {(!sidebarCollapsed || mobile) && 'Log Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0 relative bg-transparent text-white transition-all duration-200 ease-in-out z-40 pl-0 py-6" style={{ width: sidebarCollapsed ? 64 : 240 }}>
        {renderSidebar({})}
        
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div className="fixed inset-0 z-40 lg:hidden bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileSidebarOpen(false)} />
            <motion.div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden w-64 flex flex-col bg-slate-950" initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 28, stiffness: 240 }}>
              {renderSidebar({ mobile: true })}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50 border-l border-slate-800 shadow-2xl relative">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-8 lg:px-10 h-16 bg-white/70 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 flex-shrink-0 w-full text-slate-900">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 bg-white shadow-sm">
              <LayoutDashboard size={16} />
            </button>
            <div className="hidden md:flex items-center text-sm font-medium">
               <span className="text-slate-500 hover:text-slate-900 transition-colors cursor-pointer">Application</span>
               <ChevronRight size={14} className="text-slate-400 mx-2" />
               <span className="text-slate-800">{PANEL_TITLES[activePanel]}</span>
            </div>
          </div>
        </header>

        {/* Panel Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8 xl:p-10 relative text-slate-900">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activePanel}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {PANEL_MAP[activePanel]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
