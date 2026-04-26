'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  HiClock, 
  HiUser, 
  HiMagnifyingGlass, 
  HiGlobeAlt,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi2';

interface Business {
  _id: string;
  businessName: string;
  businessType: string;
  slug: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'pending_renewal';
  paymentReceipt: string;
  owner: {
    name: string;
    email: string;
  };
  subscriptionEnd?: string;
}

export default function SuperAdminRenewals() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const fetchRenewals = async () => {
    try {
      const res = await api.get('/admin/businesses');
      // Filter for renewal relevant statuses
      const renewals = res.data.filter((b: Business) => 
        b.status === 'pending_renewal' || b.status === 'expired'
      );
      setBusinesses(renewals);
    } catch (err) {
      toast.error('Data retrieval failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewals();
  }, []);

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/admin/businesses/${id}/status`, { status });
      toast.success(`Renewal ${status} successfully.`);
      fetchRenewals();
    } catch (err) {
      toast.error('Failed to update renewal status.');
    }
  };

  const filteredBusinesses = businesses.filter(b => 
    b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.owner.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Renewal <span className="text-amber-400">Queue</span></h1>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest leading-relaxed">Processing subscription renewal requests and identifying expired nodes.</p>
      </div>

      {/* Control Bar */}
      <div className="glass-morphism rounded-[24px] p-4 flex flex-col lg:flex-row gap-4 border border-white/5 bg-white/[0.02]">
        <div className="relative flex-1 group">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by business name or owner identity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Renewals Table */}
      <div className="glass-morphism rounded-[32px] overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full table-premium">
            <thead>
              <tr>
                <th>Entity Name</th>
                <th>Current Status</th>
                <th>Expiry Data</th>
                <th>Renewal Receipt</th>
                <th>Operational Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBusinesses.map((biz) => (
                <tr key={biz._id} className="group hover:bg-amber-600/[0.02] transition-colors">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl">
                        {biz.businessType === 'clinic' ? '🏥' : biz.businessType === 'salon' ? '💇' : '🏨'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{biz.businessName}</div>
                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Owner: {biz.owner.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`inline-flex px-3 py-1 rounded-lg border text-[10px] font-black uppercase tracking-widest ${
                      biz.status === 'pending_renewal' 
                        ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
                        : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {biz.status.replace('_', ' ')}
                    </div>
                  </td>
                  <td>
                    <div className="text-xs font-bold text-slate-200">
                      {biz.subscriptionEnd ? new Date(biz.subscriptionEnd).toLocaleDateString() : 'N/A'}
                    </div>
                    <div className="text-[9px] text-slate-500 uppercase tracking-widest">Final Operational Day</div>
                  </td>
                  <td>
                    {biz.status === 'pending_renewal' ? (
                      <button 
                        onClick={() => setSelectedReceipt(`${(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace('/api', '')}${biz.paymentReceipt}`)}
                        className="text-indigo-400 hover:text-indigo-300 text-[10px] font-black uppercase tracking-widest underline decoration-2 underline-offset-4"
                      >
                        Verify Receipt
                      </button>
                    ) : (
                      <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">Awaiting Payment</span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {biz.status === 'pending_renewal' && (
                        <>
                          <button 
                            onClick={() => handleStatusUpdate(biz._id, 'approved')}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2"
                          >
                            <HiCheckCircle className="w-4 h-4" />
                            Re-Approve
                          </button>
                          <button 
                            onClick={() => handleStatusUpdate(biz._id, 'rejected')}
                            className="p-2 bg-rose-600/20 hover:bg-rose-600 text-rose-500 hover:text-white border border-rose-500/20 rounded-xl transition-all"
                          >
                            <HiXCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      {biz.status === 'expired' && (
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Pending User Input</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBusinesses.length === 0 && (
        <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-[40px]">
          <HiClock className="w-16 h-16 text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Queue Empty</h3>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">No pending renewal requests or recently expired nodes.</p>
        </div>
      )}

      {/* Receipt Preview Modal */}
      {selectedReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm overflow-y-auto" onClick={() => setSelectedReceipt(null)}>
          <div className="relative max-w-2xl w-full bg-[#08090a] rounded-[40px] p-4 border border-white/10" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedReceipt(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-bold shadow-2xl z-10 hover:scale-110 transition-transform"
            >
              ✕
            </button>
            <div className="rounded-[32px] overflow-hidden">
              <img src={selectedReceipt} alt="Renewal Receipt" className="w-full h-auto" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
