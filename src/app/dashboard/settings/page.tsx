'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { HiCheck, HiOutlineClock, HiMapPin, HiPhone, HiInformationCircle } from 'react-icons/hi2';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export default function SettingsPage() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessName: '', description: '', phone: '', address: '',
    days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
    startTime: '09:00', endTime: '18:00', slotDuration: 30,
  });

  useEffect(() => {
    const id = localStorage.getItem('bookify_active_business');
    setBusinessId(id);
    if (!id) setLoading(false);
    const fetch = async () => {
      if (!id) return;
      try {
        const res = await api.get('/business/my');
        const biz = res.data.find((b: any) => b._id === id);
        if (biz) {
          setForm({
            businessName: biz.businessName, description: biz.description || '',
            phone: biz.phone || '', address: biz.address || '',
            days: biz.availability?.days || [], startTime: biz.availability?.startTime || '09:00',
            endTime: biz.availability?.endTime || '18:00', slotDuration: biz.availability?.slotDuration || 30,
          });
        }
      } catch { } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const toggleDay = (day: string) => {
    setForm(p => ({ ...p, days: p.days.includes(day) ? p.days.filter(d => d !== day) : [...p.days, day] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessId) return;
    setSaving(true);
    try {
      await api.put(`/business/${businessId}`, {
        businessName: form.businessName, description: form.description,
        phone: form.phone, address: form.address,
        availability: { days: form.days, startTime: form.startTime, endTime: form.endTime, slotDuration: form.slotDuration },
      });
      toast.success('System parameters updated.');
    } catch (err: any) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Configuration Sync...</p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="glass-morphism rounded-[48px] p-16 max-w-lg border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="text-7xl mb-8 animate-float-slow">⚙️</div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-4">Settings <span className="text-gradient">Unavailable.</span></h1>
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
              System parameters are tied to your platform identity. Launch your business to start configuring operational windows and global logic.
            </p>
            <a
              href="/saas/dashboard/create-business"
              className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-sm font-black uppercase tracking-widest"
            >
              Launch My Platform
              <HiCheck className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-1">Platform Settings</h1>
        <p className="text-xs text-slate-400 font-medium">Control your core business parameters and availability logic.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Core Identity */}
        <section className="glass-morphism rounded-[40px] responsive-card border border-white/5 space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-400 border border-primary-500/20">
              <HiInformationCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Core Identity</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Platform Name</label>
              <input value={form.businessName} onChange={e => setForm({ ...form, businessName: e.target.value })} className="w-full input-premium py-4" placeholder="Business Name" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Contextual Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} className="w-full input-premium py-4 resize-none" placeholder="Business description..." />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Public Phone</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full input-premium py-4" placeholder="+1 (555) 000-0000" />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Physical Address</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full input-premium py-4" placeholder="City, Country" />
            </div>
          </div>
        </section>

        {/* Operating Windows */}
        <section className="glass-morphism rounded-[40px] responsive-card border border-white/5 space-y-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent-blue/10 rounded-xl flex items-center justify-center text-accent-blue border border-accent-blue/20">
              <HiOutlineClock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Operating Windows</h2>
          </div>

          <div className="space-y-10">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-6 ml-1">Operational Days</label>
              <div className="flex flex-wrap gap-4">
                {DAYS.map(day => {
                  const isActive = form.days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border ${isActive
                          ? 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-600/20'
                          : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                        }`}
                    >
                      {isActive && <HiCheck className="w-4 h-4" />}
                      {day.slice(0, 3)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-6 border-t border-white/5">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Shift Start</label>
                <input type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} className="w-full input-premium py-4" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Shift End</label>
                <input type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} className="w-full input-premium py-4" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Slot Granularity (Min)</label>
                <input type="number" value={form.slotDuration} onChange={e => setForm({ ...form, slotDuration: Number(e.target.value) })} min={5} className="w-full input-premium py-4" />
              </div>
            </div>
          </div>
        </section>

        <button
          type="submit"
          disabled={saving}
          className="w-full btn-primary py-5 text-lg font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-primary-600/30"
        >
          {saving ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>Commit Platform Changes</>
          )}
        </button>
      </form>
    </div>
  );
}
