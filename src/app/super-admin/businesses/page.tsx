'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  HiBuildingOffice2, 
  HiUser, 
  HiMagnifyingGlass, 
  HiGlobeAlt,
  HiMapPin,
  HiBriefcase
} from 'react-icons/hi2';

interface Business {
  _id: string;
  businessName: string;
  businessType: string;
  slug: string;
  status: 'pending' | 'approved' | 'rejected';
  paymentReceipt: string;
  owner: {
    name: string;
    email: string;
  };
  createdAt: string;
  subscriptionStart?: string;
  subscriptionEnd?: string;
}

export default function SuperAdminBusinesses() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const fetchBusinesses = async () => {
    try {
      const res = await api.get('/admin/businesses');
      setBusinesses(res.data);
    } catch (err) {
      toast.error('Data retrieval failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/admin/businesses/${id}/status`, { status });
      toast.success(`Business ${status} successfully.`);
      fetchBusinesses();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  const filteredBusinesses = businesses.filter(b => 
    b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const typeIcons: Record<string, string> = {
    clinic: '🏥',
    salon: '💇',
    hotel: '🏨'
  };

  const statusColors = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-2">Business <span className="text-indigo-400">Nodes</span></h1>
          <p className="text-xs text-slate-400 font-medium">Monitoring all active and pending operational frameworks on the platform.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="glass-morphism rounded-[24px] p-4 flex flex-col lg:flex-row gap-4 border border-white/5 bg-white/[0.02]">
        <div className="relative flex-1 group">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by business name or owner identity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Businesses Table */}
      <div className="glass-morphism rounded-[32px] overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full table-premium">
            <thead>
              <tr>
                <th>Operational Entity</th>
                <th>Status</th>
                <th>Master Account</th>
                <th>Payment Verification</th>
                <th>Subscription Cycle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((biz) => (
                <tr key={biz._id} className="group hover:bg-indigo-600/[0.02] transition-colors">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                        {typeIcons[biz.businessType]}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{biz.businessName}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">/{biz.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`inline-flex px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${statusColors[biz.status]}`}>
                      {biz.status}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        {biz.owner.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{biz.owner.name}</div>
                        <div className="text-[9px] text-slate-500">{biz.owner.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {biz.paymentReceipt ? (
                      <button 
                        onClick={() => setSelectedReceipt(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '')}${biz.paymentReceipt}`)}
                        className="text-indigo-400 hover:text-indigo-300 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
                      >
                        View Receipt
                      </button>
                    ) : (
                      <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">No Receipt</span>
                    )}
                  </td>
                  <td>
                    {biz.status === 'approved' && biz.subscriptionEnd ? (
                      <div>
                        <div className="text-[10px] font-bold text-white">{new Date(biz.subscriptionStart!).toLocaleDateString()}</div>
                        <div className="text-[9px] text-slate-500 uppercase tracking-widest">to {new Date(biz.subscriptionEnd).toLocaleDateString()}</div>
                      </div>
                    ) : (
                      <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">—</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {biz.status !== 'approved' && (
                        <button 
                          onClick={() => handleStatusUpdate(biz._id, 'approved')}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                        >
                          Approve
                        </button>
                      )}
                      {biz.status !== 'rejected' && (
                        <button 
                          onClick={() => handleStatusUpdate(biz._id, 'rejected')}
                          className="px-3 py-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto" onClick={() => setSelectedReceipt(null)}>
          <div className="relative max-w-2xl w-full bg-surface-bg rounded-[40px] p-4 border border-white/10" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedReceipt(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold shadow-2xl z-10 hover:scale-110 transition-transform"
            >
              ✕
            </button>
            <div className="rounded-[32px] overflow-hidden">
              <img src={selectedReceipt} alt="Payment Receipt" className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
