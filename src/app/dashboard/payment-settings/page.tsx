'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { HiQrCode, HiCloudArrowUp, HiEye, HiCheckBadge } from 'react-icons/hi2';

export default function PaymentSettings() {
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [upiQrCode, setUpiQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('bookify_active_business');
    setBusinessId(id);
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBusiness = async () => {
      try {
        const res = await api.get('/business/my');
        const biz = res.data.find((b: any) => b._id === id);
        if (biz) {
          setUpiQrCode(biz.upiQrCode);
        }
      } catch (err) {
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !businessId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('upiQrCode', file);

      const res = await api.put(`/business/${businessId}/upi-qr`, formData);

      setUpiQrCode(res.data.business.upiQrCode);
      setFile(null);
      toast.success('UPI QR Code updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Payment Node...</p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="glass-morphism rounded-[48px] p-16 max-w-lg border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="text-7xl mb-8 animate-float-slow">💳</div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-4">Identity <span className="text-gradient">Required.</span></h1>
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
              Payment configurations are bound to a specific business identity. Please select or launch a business node first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-12">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-1">Payment Infrastructure</h1>
        <p className="text-xs text-slate-400 font-medium">Configure your UPI gateways and customer billing logic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Upload Section */}
        <div className="glass-morphism rounded-[40px] p-10 border border-white/5 space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600/10 rounded-xl flex items-center justify-center text-primary-400 border border-primary-500/20">
              <HiQrCode className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">UPI QR Configuration</h2>
          </div>

          <form onSubmit={handleUpload} className="space-y-8">
            <div className="relative">
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Deploy New QR Image</label>
              <div className={`relative group border-2 border-dashed rounded-[32px] transition-all duration-500 ${
                file ? 'border-primary-500 bg-primary-500/5' : 'border-white/10 hover:border-white/20'
              }`}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="p-12 text-center space-y-4">
                  <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
                    file ? 'bg-primary-600 text-white' : 'bg-white/5 text-slate-500'
                  }`}>
                    <HiCloudArrowUp className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{file ? file.name : 'Drop QR Image or Click'}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">PNG, JPG up to 5MB</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!file || uploading}
              className="w-full btn-primary py-5 text-sm font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-primary-600/30"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Deploy Payment Node</>
              )}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="glass-morphism rounded-[40px] p-10 border border-white/5 flex flex-col items-center justify-center text-center space-y-8 min-h-[400px] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary-600/[0.03] to-transparent" />
          
          <div className="relative z-10 w-full">
            {upiQrCode ? (
              <div className="space-y-8 animate-in fade-in zoom-in-95 duration-700">
                <div className="bg-white p-6 rounded-[32px] shadow-2xl inline-block relative group">
                  <img 
                    src={`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5200').replace('/api', '')}${upiQrCode}`} 
                    alt="Current UPI QR" 
                    className="w-48 h-48 rounded-xl object-contain"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-center justify-center">
                    <HiEye className="text-white w-10 h-10" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 text-emerald-400 mb-2">
                    <HiCheckBadge className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Active Gateway</span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium max-w-[200px] mx-auto">This QR will be displayed to customers during online booking checkout.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 opacity-40 grayscale">
                <div className="w-48 h-48 border-4 border-dashed border-white/10 rounded-[40px] mx-auto flex items-center justify-center">
                  <HiQrCode className="w-20 h-20 text-white/10" />
                </div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">No Active Gateway</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
