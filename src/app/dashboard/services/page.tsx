'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { HiPlus, HiPencilSquare, HiTrash, HiXMark, HiCurrencyRupee, HiClock, HiTag, HiCreditCard, HiBanknotes } from 'react-icons/hi2';

interface Service {
  _id: string;
  name: string;
  type: string;
  price: number;
  duration: number;
  description: string;
  isActive: boolean;
  paymentMode: 'online' | 'offline';
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [businessType, setBusinessType] = useState<string>('clinic');
  const [form, setForm] = useState({ name: '', type: 'service', price: '', duration: '30', description: '', paymentMode: 'offline' });

  useEffect(() => {
    const id = localStorage.getItem('bookify_active_business');
    setBusinessId(id);
    if (!id) setLoading(false);
    const fetchBiz = async () => {
      if (!id) return;
      try {
        const res = await api.get('/business/my');
        const biz = res.data.find((b: any) => b._id === id);
        if (biz) {
          setBusinessType(biz.businessType);
          const m: Record<string, string> = { clinic: 'service', salon: 'slot', hotel: 'room' };
          setForm(p => ({ ...p, type: m[biz.businessType] || 'service', paymentMode: 'offline' }));
        }
      } catch {}
    };
    fetchBiz();
  }, []);

  const fetchServices = async () => {
    if (!businessId) return;
    try {
      const res = await api.get(`/services/${businessId}`);
      setServices(res.data);
    } catch { toast.error('Failed to load services'); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (businessId) fetchServices(); }, [businessId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name required'); return; }
    try {
      const payload = { 
        name: form.name, 
        type: form.type, 
        price: Number(form.price) || 0, 
        duration: Number(form.duration) || 30, 
        description: form.description,
        paymentMode: form.paymentMode
      };
      if (editing) {
        await api.put(`/services/${editing._id}`, payload);
        toast.success('Service updated');
      } else {
        await api.post('/services', { businessId, ...payload });
        toast.success('Service created');
      }
      setShowModal(false); setEditing(null); resetForm(); fetchServices();
    } catch (err: any) { toast.error(err.response?.data?.message || 'Error saving service'); }
  };

  const handleEdit = (s: Service) => {
    setEditing(s);
    setForm({ 
      name: s.name, 
      type: s.type, 
      price: String(s.price), 
      duration: String(s.duration), 
      description: s.description,
      paymentMode: s.paymentMode || 'offline'
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently remove this service module?')) return;
    try { await api.delete(`/services/${id}`); toast.success('Module deleted'); fetchServices(); }
    catch { toast.error('Failed to delete module'); }
  };

  const resetForm = () => {
    const m: Record<string, string> = { clinic: 'service', salon: 'slot', hotel: 'room' };
    setForm({ name: '', type: m[businessType] || 'service', price: '', duration: '30', description: '', paymentMode: 'offline' });
  };

  const typeConfig: Record<string, { label: string; icon: string; color: string }> = {
    service: { label: 'Appointment', icon: '🏥', color: 'text-emerald-400 bg-emerald-400/10' },
    slot: { label: 'Time Slot', icon: '💇', color: 'text-pink-400 bg-pink-400/10' },
    room: { label: 'Room Unit', icon: '🏨', color: 'text-amber-400 bg-amber-400/10' }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Inventory Sync...</p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="glass-morphism rounded-[48px] p-16 max-w-lg border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="text-7xl mb-8 animate-float-slow">📦</div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-4">Inventory <span className="text-gradient">Locked.</span></h1>
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
              Service modules require an active platform to be deployed. Launch your business first to start configuring services.
            </p>
            <a 
              href="/dashboard/create-business" 
              className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-sm font-black uppercase tracking-widest"
            >
              Launch My Platform
              <HiPlus className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Service Inventory</h1>
          <p className="text-xs text-slate-400 font-medium">Configure and deploy your booking modules.</p>
        </div>
        <button 
          id="add-service-btn" 
          onClick={() => { setEditing(null); resetForm(); setShowModal(true); }} 
          className="btn-primary flex items-center gap-2 group"
        >
          <HiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
          Add Service Module
        </button>
      </div>

      {services.length === 0 ? (
        <div className="glass-morphism rounded-[40px] p-24 text-center border-dashed border-2 border-white/5">
          <div className="text-7xl mb-8 opacity-40">📦</div>
          <h3 className="text-2xl font-black text-white mb-4 tracking-tight">Empty Inventory</h3>
          <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">Your platform needs services to function. Create your first module to start accepting bookings.</p>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="btn-primary px-10">Deploy First Module</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(s => (
            <div key={s._id} className="group glass-morphism rounded-[32px] responsive-card border border-white/5 hover:border-primary-500/30 transition-all duration-500 relative overflow-hidden">
              {/* Subtle background glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-600/5 rounded-full blur-3xl group-hover:bg-primary-600/20 transition-all duration-500" />
              
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${typeConfig[s.type]?.color}`}>
                  {typeConfig[s.type]?.label}
                </div>
                <div className="flex gap-2">
                  <div className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${s.paymentMode === 'online' ? 'bg-amber-400/10 text-amber-400' : 'bg-slate-400/10 text-slate-400'}`}>
                    {s.paymentMode === 'online' ? <HiCreditCard className="w-3 h-3" /> : <HiBanknotes className="w-3 h-3" />}
                    {s.paymentMode}
                  </div>
                </div>
                <div className="flex gap-2 ml-auto">
                  <button onClick={() => handleEdit(s)} className="w-10 h-10 bg-white/5 hover:bg-primary-600/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-all border border-white/5">
                    <HiPencilSquare className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(s._id)} className="w-10 h-10 bg-white/5 hover:bg-red-500/20 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-400 transition-all border border-white/5">
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-8 relative z-10">
                <h3 className="text-xl font-black text-white tracking-tight leading-tight group-hover:text-primary-400 transition-colors">{s.name}</h3>
                {s.description && (
                  <p className="text-slate-400 text-xs font-medium line-clamp-2 leading-relaxed">{s.description}</p>
                )}
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-white/5 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                    <HiCurrencyRupee className="text-emerald-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Price</p>
                    <p className="text-sm font-black text-white leading-none">₹{s.price || 'Free'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <HiClock className="text-blue-400 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Time</p>
                    <p className="text-sm font-black text-white leading-none">{s.duration} min</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal Component */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="glass-morphism rounded-[40px] w-full max-w-xl overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">{editing ? 'Configure Module' : 'Deploy New Module'}</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Service Settings</p>
              </div>
              <button onClick={() => { setShowModal(false); setEditing(null); }} className="w-10 h-10 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <HiXMark className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 sm:px-10 py-6 sm:py-10 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Module Name</label>
                  <input id="service-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Master Suite / Executive Consultation" className="w-full input-premium py-4 rounded-2xl" />
                </div>
                
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Module Type</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['service', 'slot', 'room'] as const).map(t => (
                      <button key={t} type="button" onClick={() => setForm({ ...form, type: t })} className={`py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${form.type === t ? 'bg-primary-600 border-primary-500 text-white' : 'bg-white/5 border-white/5 text-slate-400 hover:bg-white/10'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Unit Price (₹)</label>
                    <input id="service-price" type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0" className="w-full input-premium py-4 rounded-2xl" />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Duration (Min)</label>
                    <input id="service-duration" type="number" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="30" className="w-full input-premium py-4 rounded-2xl" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Context / Description</label>
                  <textarea id="service-desc" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Briefly describe the module details..." rows={3} className="w-full input-premium py-4 rounded-2xl resize-none" />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Settlement Method</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button" 
                      onClick={() => setForm({ ...form, paymentMode: 'offline' })}
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${form.paymentMode === 'offline' ? 'bg-white/10 border-white/20 text-white shadow-xl shadow-white/5' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      <HiBanknotes className="w-4 h-4" />
                      Offline / Pay at Counter
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setForm({ ...form, paymentMode: 'online' })}
                      className={`flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${form.paymentMode === 'online' ? 'bg-amber-600 border-amber-500 text-white shadow-xl shadow-amber-600/20' : 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10'}`}
                    >
                      <HiCreditCard className="w-4 h-4" />
                      Online / UPI Gateway
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => { setShowModal(false); setEditing(null); }} className="flex-1 btn-secondary">Cancel</button>
                <button id="service-submit" type="submit" className="flex-[2] btn-primary">{editing ? 'Save Changes' : 'Deploy Module'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
