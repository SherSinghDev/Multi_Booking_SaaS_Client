'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  HiBuildingOffice2, 
  HiGlobeAlt, 
  HiClock, 
  HiCheckCircle, 
  HiXCircle,
  HiPlus
} from 'react-icons/hi2';
import Link from 'next/link';

interface Business {
  _id: string;
  businessName: string;
  businessType: string;
  slug: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
}

export default function MyBusinessesPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get('/business/my');
        setBusinesses(res.data);
      } catch (err) {
        toast.error('Failed to load businesses');
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, []);

  const statusInfo = {
    pending: { 
      icon: HiClock, 
      color: 'text-amber-500', 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20',
      label: 'Pending Approval'
    },
    approved: { 
      icon: HiCheckCircle, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20',
      label: 'Active & Live'
    },
    rejected: { 
      icon: HiXCircle, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/20',
      label: 'Action Required'
    },
    expired: { 
      icon: HiClock, 
      color: 'text-rose-500', 
      bg: 'bg-rose-500/10', 
      border: 'border-rose-500/20',
      label: 'Subscription Expired'
    },
    pending_renewal: { 
      icon: HiClock, 
      color: 'text-indigo-400', 
      bg: 'bg-indigo-400/10', 
      border: 'border-indigo-400/20',
      label: 'Renewal Processing'
    }
  };

  const businessTypeEmoji: Record<string, string> = {
    clinic: '🏥',
    salon: '💇',
    hotel: '🏨',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">My <span className="text-gradient">Platforms.</span></h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Managing your registered operational entities.</p>
        </div>
        <Link 
          href="/dashboard/create-business"
          className="btn-primary py-3 px-6 text-xs font-black tracking-widest uppercase flex items-center justify-center gap-3 shadow-xl shadow-primary-600/20"
        >
          <HiPlus className="w-4 h-4" />
          Launch New Node
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {businesses.map((biz) => {
          const status = statusInfo[biz.status];
          const StatusIcon = status.icon;

          return (
            <div 
              key={biz._id} 
              className="glass-morphism rounded-[32px] p-8 border border-white/5 relative group hover:border-white/10 transition-all duration-500"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-500">
                  {businessTypeEmoji[biz.businessType]}
                </div>
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${status.bg} ${status.color} ${status.border}`}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>

              <div className="space-y-1 mb-8">
                <h3 className="text-xl font-black text-white tracking-tight group-hover:text-primary-400 transition-colors">{biz.businessName}</h3>
                <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                  <HiBuildingOffice2 className="w-3 h-3" />
                  {biz.businessType} Node
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Public Endpoint</p>
                  <a 
                    href={`/saas/business/${biz.slug}`} 
                    target="_blank"
                    className="flex items-center gap-2 text-white hover:text-primary-400 text-[11px] font-bold transition-colors"
                  >
                    <HiGlobeAlt className="w-4 h-4" />
                    /{biz.slug}
                  </a>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                    {biz.status === 'approved' ? 'Subscription Expires' : 'Registered On'}
                  </p>
                  <p className={`text-[11px] font-bold ${biz.status === 'approved' ? 'text-amber-400' : 'text-slate-400'}`}>
                    {biz.status === 'approved' && biz.subscriptionEnd 
                      ? new Date(biz.subscriptionEnd).toLocaleDateString()
                      : new Date(biz.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              {biz.status === 'approved' && (
                <button 
                  onClick={() => {
                    localStorage.setItem('bookify_active_business', biz._id);
                    window.location.href = '/saas/dashboard';
                  }}
                  className="mt-8 w-full py-4 bg-white/5 hover:bg-primary-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[2px] border border-white/10 hover:border-primary-500 transition-all duration-300"
                >
                  Manage Framework
                </button>
              )}
            </div>
          );
        })}

        {businesses.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 glass-morphism rounded-[40px] border border-dashed border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
              <HiBuildingOffice2 className="w-10 h-10 text-slate-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">No Active Nodes</h3>
              <p className="text-slate-500 text-xs font-medium max-w-xs mx-auto">You haven't registered any businesses yet. Start by launching your first operational platform.</p>
            </div>
            <Link 
              href="/saas/dashboard/create-business"
              className="mt-4 text-primary-400 hover:text-primary-300 text-xs font-black uppercase tracking-widest underline decoration-2 underline-offset-4 transition-all"
            >
              Initialize Node Registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
