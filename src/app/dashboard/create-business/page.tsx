'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { HiPlus, HiArrowRight, HiRocketLaunch } from 'react-icons/hi2';

export default function CreateBusinessPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    businessName: '', businessType: 'clinic', slug: '', description: '', phone: '', address: '',
  });
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleNameChange = (name: string) => {
    setForm({ ...form, businessName: name, slug: generateSlug(name) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceipt(file);
      const reader = new FileReader();
      reader.onloadend = () => setReceiptPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.slug) { toast.error('Name and slug are required'); return; }
    if (!receipt) { toast.error('Payment receipt is required'); return; }
    
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append('paymentReceipt', receipt);
      
      const res = await api.post('/business', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Registration submitted! Awaiting Super Admin approval.');
      router.push('/dashboard');
    } catch (err: any) { 
      toast.error(err.response?.data?.message || 'Failed to submit'); 
    } finally { 
      setLoading(false); 
    }
  };

  const typeInfo: Record<string, { emoji: string; desc: string; color: string; border: string }> = {
    clinic: { emoji: '🏥', desc: 'Doctors, Dentists, Health', color: 'bg-emerald-400/10 text-emerald-400', border: 'hover:border-emerald-500/30' },
    salon: { emoji: '💇', desc: 'Spas, Grooming, Beauty', color: 'bg-pink-400/10 text-pink-400', border: 'hover:border-pink-500/30' },
    hotel: { emoji: '🏨', desc: 'Stays, Rooms, Hospitality', color: 'bg-amber-400/10 text-amber-400', border: 'hover:border-amber-500/30' },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 py-10 px-4">
      <div className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Register Your <span className="text-gradient">Business.</span></h1>
        <p className="text-slate-400 text-sm font-medium max-w-md mx-auto leading-relaxed">
          Create your professional booking platform. All businesses require a monthly subscription fee of <span className="text-white font-bold">₹499/month</span>.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Business Type Selection */}
        <section className="glass-morphism rounded-[40px] p-8 border border-white/5">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-8 text-center">Operational Framework</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {(['clinic', 'salon', 'hotel'] as const).map(type => {
              const active = form.businessType === type;
              return (
                <button 
                  key={type} 
                  type="button" 
                  onClick={() => setForm({ ...form, businessType: type })}
                  className={`relative p-8 rounded-[32px] text-center transition-all duration-500 flex flex-col items-center border-2 group ${
                    active 
                    ? 'bg-primary-600/10 border-primary-500 shadow-xl shadow-primary-600/10' 
                    : `bg-white/5 border-transparent ${typeInfo[type].border}`
                  }`}
                >
                  <div className={`text-5xl mb-4 transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
                    {typeInfo[type].emoji}
                  </div>
                  <div className="text-sm font-black text-white capitalize mb-1">{type}</div>
                  <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-tight">{typeInfo[type].desc}</div>
                  
                  {active && (
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-surface-bg">
                      <HiPlus className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Identity & Discovery */}
        <section className="glass-morphism rounded-[40px] p-10 border border-white/5 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Platform Identity</label>
              <input 
                id="biz-name" 
                value={form.businessName} 
                onChange={e => handleNameChange(e.target.value)} 
                placeholder="e.g. Royal Horizon Resort" 
                className="w-full input-premium py-4" 
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Universal Resource Locator (Slug)</label>
              <div className="flex items-center group">
                <div className="hidden xs:block px-5 py-4 bg-white/[0.03] border border-r-0 border-white/10 rounded-l-2xl text-slate-500 text-[10px] font-bold font-mono">
                  bookify.io/biz/
                </div>
                <input 
                  id="biz-slug" 
                  value={form.slug} 
                  onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} 
                  placeholder="royal-horizon" 
                  className="flex-1 input-premium py-4 rounded-l-none" 
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Public Contact</label>
              <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 00000 00000" className="w-full input-premium py-4" />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Operating Location</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Mumbai, India" className="w-full input-premium py-4" />
            </div>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Brief Overview</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Tell your customers what makes your platform unique..." className="w-full input-premium py-4 resize-none" />
          </div>
        </section>

        {/* Subscription & Payment Section */}
        <section className="glass-morphism rounded-[40px] p-10 border border-primary-500/20 space-y-8 bg-primary-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <HiRocketLaunch className="w-32 h-32 text-primary-500 rotate-12" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-2">Platform Subscription</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Fixed Monthly Fee: ₹499/month</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-3xl shadow-2xl max-w-[240px] mx-auto md:mx-0">
                <img src="/upi-qr.png" alt="UPI QR Code" className="w-full rounded-2xl" />
                <div className="mt-4 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scan to Pay</p>
                  <p className="text-lg font-black text-slate-900">₹499.00 / month</p>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
                  Scan the QR code using any UPI app (GPay, PhonePe, Paytm). After payment, please upload the screenshot of the transaction receipt.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">Payment Verification Receipt</label>
              <div 
                className={`relative group h-64 rounded-[32px] border-2 border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer overflow-hidden ${
                  receipt ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-primary-500/50 hover:bg-white/5'
                }`}
                onClick={() => document.getElementById('receipt-upload')?.click()}
              >
                {receiptPreview ? (
                  <img src={receiptPreview} alt="Receipt Preview" className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <>
                    <HiPlus className="w-10 h-10 text-slate-500 group-hover:text-primary-500 transition-colors mb-4" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upload Screenshot</span>
                  </>
                )}
                <input 
                  id="receipt-upload" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
              </div>
              {receipt && (
                <p className="text-[10px] text-primary-400 font-black uppercase tracking-widest text-center italic">
                  ✓ Receipt Attached: {receipt.name}
                </p>
              )}
            </div>
          </div>
        </section>

        <button 
          id="create-biz-submit" 
          type="submit" 
          disabled={loading} 
          className="w-full btn-primary py-5 text-xl font-black tracking-widest uppercase flex items-center justify-center gap-4 group shadow-2xl shadow-primary-600/40"
        >
          {loading ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Submit for Approval
              <HiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
