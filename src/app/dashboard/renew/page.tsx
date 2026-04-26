'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { HiPlus, HiArrowRight, HiRocketLaunch, HiClock } from 'react-icons/hi2';

interface Business {
  _id: string;
  businessName: string;
  businessType: string;
  slug: string;
}

export default function RenewBusinessPage() {
  const router = useRouter();
  const [business, setBusiness] = useState<Business | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);

  useEffect(() => {
    const fetchActive = async () => {
      try {
        const activeId = localStorage.getItem('bookify_active_business');
        if (!activeId) {
          router.push('/dashboard');
          return;
        }
        const res = await api.get('/business/my');
        const found = res.data.find((b: any) => b._id === activeId);
        if (found) {
          setBusiness(found);
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        toast.error('Failed to load business data');
      } finally {
        setLoading(false);
      }
    };
    fetchActive();
  }, [router]);

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
    if (!business) return;
    if (!receipt) { toast.error('Payment receipt is required'); return; }
    
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('paymentReceipt', receipt);
      
      await api.post(`/business/${business._id}/renew`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      toast.success('Renewal request submitted!');
      window.location.href = '/dashboard';
    } catch (err: any) { 
      toast.error(err.response?.data?.message || 'Failed to submit renewal'); 
    } finally { 
      setSubmitting(false); 
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
      <div className="w-10 h-10 border-3 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="text-center">
        <h1 className="text-4xl font-black text-white tracking-tight mb-4">Renew <span className="text-gradient">Subscription.</span></h1>
        <p className="text-slate-400 text-sm font-medium max-w-md mx-auto leading-relaxed uppercase tracking-widest">
          Node: <span className="text-white font-bold">{business?.businessName}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">
        <section className="glass-morphism rounded-[40px] p-10 border border-primary-500/20 space-y-8 bg-primary-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <HiRocketLaunch className="w-32 h-32 text-primary-500 rotate-12" />
          </div>
          
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-2">Renewal Payment</h3>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest italic">Renewal Charge: ₹499/month</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center relative z-10">
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-3xl shadow-2xl max-w-[240px] mx-auto md:mx-0">
                <img src="/saas/upi-qr.png" alt="UPI QR Code" className="w-full rounded-2xl" />
                <div className="mt-4 text-center">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Scan to Pay</p>
                  <p className="text-lg font-black text-slate-900">₹499.00 / month</p>
                </div>
              </div>
              <div className="text-center md:text-left">
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-widest">
                  Pay the monthly fee and upload the new transaction screenshot. Your business operations will be restored once the Super Admin verifies the renewal.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3">New Verification Receipt</label>
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
                    <HiPlus className="w-10 h-10 text-slate-500 group-hover:text-primary-400 transition-colors mb-4" />
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
            </div>
          </div>
        </section>

        <button 
          type="submit" 
          disabled={submitting || !receipt} 
          className="w-full btn-primary py-5 text-xl font-black tracking-widest uppercase flex items-center justify-center gap-4 group shadow-2xl shadow-primary-600/40"
        >
          {submitting ? (
            <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Submit Renewal Request
              <HiArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
