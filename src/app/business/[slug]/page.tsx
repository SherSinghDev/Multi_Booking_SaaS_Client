'use client';

import { useState, useEffect, use } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { HiCalendarDays, HiClock, HiPhone, HiUser, HiCheckCircle, HiMapPin, HiArrowRight, HiCurrencyRupee, HiTag, HiRocketLaunch } from 'react-icons/hi2';

interface Business {
  _id: string;
  businessName: string;
  businessType: string;
  slug: string;
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  phone: string;
  address: string;
  upiQrCode?: string;
  availability: { days: string[]; startTime: string; endTime: string; slotDuration: number };
}

interface Service {
  _id: string;
  name: string;
  type: string;
  price: number;
  duration: number;
  description: string;
  paymentMode?: 'online' | 'offline';
}

interface SlotInfo {
  time: string;
  available: boolean;
}

const typeConfig: Record<string, { label: string; cta: string; emoji: string; gradient: string; theme: string }> = {
  clinic: { label: 'Clinic', cta: 'Book Appointment', emoji: '🏥', gradient: 'from-emerald-500 to-teal-600', theme: 'emerald' },
  salon: { label: 'Salon', cta: 'Secure Slot', emoji: '💇', gradient: 'from-pink-500 to-rose-600', theme: 'pink' },
  hotel: { label: 'Hotel', cta: 'Reserve Room', emoji: '🏨', gradient: 'from-amber-500 to-orange-600', theme: 'amber' },
};

export default function PublicBookingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [business, setBusiness] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);

  const [form, setForm] = useState({
    serviceId: '', date: '', timeSlot: '', customerName: '', customerPhone: '', customerEmail: '', notes: '',
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const bizRes = await api.get(`/business/${slug}`);
        setBusiness(bizRes.data);
        if (bizRes.data.status === 'approved') {
          const svcRes = await api.get(`/services/${bizRes.data._id}`);
          setServices(svcRes.data);
        }
      } catch { setNotFound(true); }
      finally { setLoading(false); }
    };
    fetch();
  }, [slug]);

  useEffect(() => {
    const fetchSlots = async () => {
      if (!business || !form.serviceId || !form.date) return;
      try {
        const res = await api.get('/bookings/available-slots', {
          params: { businessId: business._id, serviceId: form.serviceId, date: form.date },
        });
        setSlots(res.data.slots || []);
      } catch { setSlots([]); }
    };
    fetchSlots();
  }, [business, form.serviceId, form.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.serviceId || !form.date || !form.timeSlot || !form.customerName || !form.customerPhone) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('businessId', business?._id || '');
      formData.append('serviceId', form.serviceId);
      formData.append('date', form.date);
      formData.append('timeSlot', form.timeSlot);
      formData.append('customerName', form.customerName);
      formData.append('customerPhone', form.customerPhone);
      formData.append('customerEmail', form.customerEmail);
      formData.append('notes', form.notes);
      if (receipt) formData.append('paymentReceipt', receipt);

      await api.post('/bookings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
    } catch (err: any) { toast.error(err.response?.data?.message || 'Transaction failed. Please try again.'); }
    finally { setSubmitting(false); }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl mb-8 grayscale opacity-40">🏢</div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Portal Offline</h1>
        <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">This business portal is not active or the URL is incorrect.</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">Go Home <HiArrowRight /></Link>
      </div>
    </div>
  );

  if (business && business.status !== 'approved') return (
    <div className="min-h-screen bg-surface-bg flex items-center justify-center px-6">
      <div className="glass-morphism rounded-[48px] p-12 max-w-xl w-full text-center border-amber-500/20">
        <div className="w-24 h-24 mx-auto rounded-[32px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8">
          <HiClock className="w-12 h-12 text-amber-500 animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Activation <span className="text-amber-500">Pending.</span></h1>
        <p className="text-slate-400 mb-10 font-medium leading-relaxed">
          The booking portal for <span className="text-white font-bold">{business.businessName}</span> is currently awaiting administrative activation. 
          <br /><br />
          Please check back later once the subscription has been verified.
        </p>
        <Link href="/" className="btn-primary w-full py-5 rounded-2xl text-lg font-black tracking-widest uppercase flex items-center justify-center gap-3">
          Return to Hub <HiArrowRight />
        </Link>
      </div>
    </div>
  );

  if (success) return (
    <div className="min-h-screen bg-surface-bg bg-mesh flex items-center justify-center px-6">
      <div className="glass-morphism rounded-[48px] p-12 max-w-xl w-full text-center border-emerald-500/20">
        <div className="w-24 h-24 mx-auto rounded-[32px] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8">
          <HiCheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Confirmed.</h1>
        <p className="text-slate-400 mb-10 font-medium">Your request at <span className="text-white font-bold">{business?.businessName}</span> has been processed successfully.</p>
        
        <div className="bg-white/5 border border-white/5 rounded-3xl p-6 text-left space-y-4 mb-10">
          <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Appointment ID</span><span className="text-xs font-bold text-white font-mono">#{Math.random().toString(36).substr(2, 6).toUpperCase()}</span></div>
          <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scheduled For</span><span className="text-sm font-bold text-white">{form.date} @ {form.timeSlot}</span></div>
          <div className="flex justify-between items-center"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Service Unit</span><span className="text-sm font-bold text-white">{services.find(s => s._id === form.serviceId)?.name}</span></div>
        </div>

        <button 
          onClick={() => { setSuccess(false); setForm({ serviceId: '', date: '', timeSlot: '', customerName: '', customerPhone: '', customerEmail: '', notes: '' }); }}
          className="btn-primary w-full py-5 rounded-2xl text-lg font-black tracking-widest uppercase"
        >
          Book Another Session
        </button>
      </div>
    </div>
  );

  const config = typeConfig[business?.businessType || 'clinic'];

  return (
    <div className="min-h-screen bg-surface-bg pb-20">
      {/* Dynamic Brand Header */}
      <div className={`relative bg-gradient-to-br ${config.gradient} pt-32 pb-24 px-8 overflow-hidden`}>
        {/* Abstract background graphics */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -ml-32 -mb-32" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="text-5xl mb-6 animate-float">{config.emoji}</div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">{business?.businessName}</h1>
          {business?.description && <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-8 font-medium leading-relaxed">{business.description}</p>}
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            {business?.phone && (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-black/20 backdrop-blur-md rounded-full text-white/90 text-sm font-bold border border-white/10">
                <HiPhone className="w-4 h-4" /> {business.phone}
              </div>
            )}
            {business?.address && (
              <div className="flex items-center gap-2 px-5 py-2.5 bg-black/20 backdrop-blur-md rounded-full text-white/90 text-sm font-bold border border-white/10">
                <HiMapPin className="w-4 h-4" /> {business.address}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modern Booking Flow */}
      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-20">
        <form onSubmit={handleSubmit} className="glass-morphism rounded-[48px] p-8 md:p-16 border border-white/10 space-y-16">
          
          {/* Section 1: Service Choice */}
          <div className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                <HiTag className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Select a Service</h2>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Step 01 of 03</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {services.map(s => (
                <button 
                  key={s._id} 
                  type="button" 
                  onClick={() => setForm({ ...form, serviceId: s._id, timeSlot: '' })}
                  className={`group relative p-6 rounded-[32px] text-left transition-all duration-500 border-2 ${
                    form.serviceId === s._id 
                    ? 'bg-primary-600/10 border-primary-500 shadow-xl shadow-primary-600/10' 
                    : 'bg-white/5 border-transparent hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-black text-white tracking-tight">{s.name}</h3>
                    {form.serviceId === s._id && (
                      <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white">
                        <HiCheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <HiCurrencyRupee className="w-4 h-4" />
                      ₹{s.price || 'Free'}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <HiClock className="w-4 h-4" />
                      {s.duration} Min
                    </div>
                  </div>
                  {s.description && <p className="mt-4 text-xs text-slate-500 font-medium leading-relaxed line-clamp-1">{s.description}</p>}
                </button>
              ))}
            </div>
            {services.length === 0 && <p className="text-slate-500 font-medium text-center py-10 border border-white/5 rounded-3xl border-dashed">No services currently available.</p>}
          </div>

          {/* Section 2: Time Logic */}
          <div className={`space-y-10 transition-all duration-500 ${form.serviceId ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-blue rounded-2xl flex items-center justify-center text-white shadow-lg">
                <HiCalendarDays className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Pick Your Time</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Step 02 of 03</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Target Date</label>
                <input 
                  type="date" 
                  value={form.date} 
                  min={today} 
                  onChange={e => setForm({ ...form, date: e.target.value, timeSlot: '' })}
                  className="w-full input-premium py-5 rounded-3xl font-bold tracking-tight text-lg" 
                />
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Available Windows</label>
                {!form.date ? (
                  <div className="h-[68px] flex items-center justify-center border border-white/5 rounded-3xl text-xs font-bold text-slate-600 uppercase tracking-widest">Select Date First</div>
                ) : slots.length === 0 ? (
                  <div className="h-[68px] flex items-center justify-center border border-white/5 rounded-3xl text-xs font-bold text-red-400/50 uppercase tracking-widest">No Windows Found</div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                    {slots.map(slot => (
                      <button 
                        key={slot.time} 
                        type="button" 
                        disabled={!slot.available}
                        onClick={() => setForm({ ...form, timeSlot: slot.time })}
                        className={`py-3 rounded-xl text-xs font-black transition-all ${
                          form.timeSlot === slot.time
                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                            : slot.available
                            ? 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
                            : 'bg-white/[0.02] text-slate-700 cursor-not-allowed border border-transparent'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Final Details */}
          <div className={`space-y-10 transition-all duration-500 ${form.timeSlot ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-purple rounded-2xl flex items-center justify-center text-white shadow-lg">
                <HiUser className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">Your Profile</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Step 03 of 03</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Legal Name</label>
                <input value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="Full Name" className="w-full input-premium py-4 rounded-2xl" />
              </div>
              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Contact Number</label>
                <input value={form.customerPhone} onChange={e => setForm({ ...form, customerPhone: e.target.value })} placeholder="+1 (555) 000-0000" className="w-full input-premium py-4 rounded-2xl" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Electronic Mail (Optional)</label>
                <input type="email" value={form.customerEmail} onChange={e => setForm({ ...form, customerEmail: e.target.value })} placeholder="email@example.com" className="w-full input-premium py-4 rounded-2xl" />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1">Additional Context (Optional)</label>
                <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any specific requirements or notes..." rows={3} className="w-full input-premium py-4 rounded-2xl resize-none" />
              </div>
            </div>
          </div>

          {/* Section 4: Payment Node (Conditional) */}
          {services.find(s => s._id === form.serviceId)?.paymentMode === 'online' && (
            <div className={`space-y-10 transition-all duration-500 ${form.customerPhone ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <HiCurrencyRupee className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Settlement Required</h2>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Direct to Business Payment</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="bg-white p-6 rounded-[40px] shadow-2xl max-w-[280px] mx-auto md:mx-0">
                  {business?.upiQrCode ? (
                    <img 
                      src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5200').replace('/api', '')}${business.upiQrCode}`} 
                      alt="Merchant QR" 
                      className="w-full h-auto rounded-2xl"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-2">
                      <HiTag className="w-10 h-10" />
                      <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Merchant QR</p>
                    </div>
                  )}
                  <div className="mt-4 text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scan & Pay Now</p>
                    <p className="text-xl font-black text-slate-900">₹{services.find(s => s._id === form.serviceId)?.price}</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-sm text-slate-400 font-medium leading-relaxed italic">
                    This service requires upfront settlement. Please scan the QR code and pay the exact amount. Upload your payment screenshot below to confirm your slot.
                  </p>
                  <div className="relative group">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Payment Receipt (Screenshot)</label>
                    <div className={`border-2 border-dashed rounded-2xl p-6 transition-all ${receipt ? 'border-emerald-500 bg-emerald-500/5' : 'border-white/10 hover:border-white/20'}`}>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setReceipt(e.target.files?.[0] || null)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${receipt ? 'bg-emerald-500 text-white' : 'bg-white/5 text-slate-500'}`}>
                          <HiRocketLaunch className="w-5 h-5" />
                        </div>
                        <p className="text-xs font-bold text-white truncate max-w-[150px]">
                          {receipt ? receipt.name : 'Upload Screenshot'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Checkout CTA */}
          <div className="pt-10 border-t border-white/5">
            <button 
              type="submit" 
              disabled={submitting || !form.timeSlot} 
              className={`w-full py-6 bg-gradient-to-r ${config.gradient} hover:opacity-90 disabled:opacity-30 text-white rounded-3xl font-black text-xl tracking-widest uppercase transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-4`}
            >
              {submitting ? (
                <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {config.cta}
                  <HiArrowRight className="w-6 h-6" />
                </>
              )}
            </button>
            <p className="text-center text-slate-500 text-[10px] font-black uppercase tracking-[3px] mt-8">Secure End-to-End Encryption</p>
          </div>
        </form>

        {/* Footer Brand */}
        <div className="text-center py-16">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[4px] group-hover:text-primary-400 transition-colors">Powered by Bookify Platform</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
