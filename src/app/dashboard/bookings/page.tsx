'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { HiMagnifyingGlass, HiFunnel, HiClock, HiCalendarDays, HiUser, HiAdjustmentsHorizontal } from 'react-icons/hi2';

interface Booking {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  timeSlot: string;
  status: string;
  notes: string;
  service: {
    _id: string;
    name: string;
    type: string;
  };
  createdAt: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('bookify_active_business');
    setBusinessId(id);
    if (!id) setLoading(false);
  }, []);

  const fetchBookings = async () => {
    if (!businessId) return;
    try {
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      const res = await api.get(`/bookings/${businessId}`, { params });
      setBookings(res.data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (businessId) fetchBookings();
  }, [businessId, statusFilter, dateFilter]);

  const updateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking ${newStatus}`);
      fetchBookings();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter((b) =>
    b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.customerPhone.includes(searchQuery)
  );

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    completed: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Ledger...</p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="glass-morphism rounded-[48px] p-16 max-w-lg border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="text-7xl mb-8 animate-float-slow">📅</div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-4">No Active <span className="text-gradient">Platform.</span></h1>
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
              Bookings are tied to specific business platforms. You need to launch a business before you can manage reservations.
            </p>
            <a 
              href="/dashboard/create-business" 
              className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-sm font-black uppercase tracking-widest"
            >
              Launch My Platform
              <HiCalendarDays className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight mb-1">Bookings Ledger</h1>
        <p className="text-xs text-slate-400 font-medium">Manage and audit all customer reservations.</p>
      </div>

      {/* Control Bar */}
      <div className="glass-morphism rounded-[24px] p-4 flex flex-col lg:flex-row gap-4 border border-white/5 bg-white/[0.02]">
        <div className="relative flex-1 group">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
          <input
            id="booking-search"
            type="text"
            placeholder="Filter by customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-primary-500 transition-all text-sm font-medium"
          />
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <HiFunnel className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              id="booking-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold focus:outline-none focus:border-primary-500 appearance-none cursor-pointer hover:bg-white/10 transition-all min-w-[160px]"
            >
              <option value="" className="bg-surface-card">All States</option>
              <option value="confirmed" className="bg-surface-card">Confirmed</option>
              <option value="pending" className="bg-surface-card">Pending</option>
              <option value="cancelled" className="bg-surface-card">Cancelled</option>
              <option value="completed" className="bg-surface-card">Completed</option>
            </select>
            <HiAdjustmentsHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          </div>

          <div className="relative">
            <HiCalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="booking-date-filter"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold focus:outline-none focus:border-primary-500 hover:bg-white/10 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="glass-morphism rounded-[32px] overflow-hidden border border-white/5">
        {filteredBookings.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-6xl mb-6 opacity-30">📂</div>
            <h3 className="text-xl font-bold text-white mb-2">No records found</h3>
            <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed font-medium">
              We couldn&apos;t find any bookings matching your current filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-premium">
              <thead>
                <tr>
                  <th>Customer Identification</th>
                  <th>Service Module</th>
                  <th>Execution Window</th>
                  <th>Status</th>
                  <th>Operations</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary-600/10 border border-primary-500/20 flex items-center justify-center text-primary-400">
                          <HiUser className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{booking.customerName}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{booking.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                        <span className="text-xs font-bold text-slate-200">{booking.service?.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3 text-sm font-bold text-white">
                          <HiCalendarDays className="w-4 h-4 text-slate-500" />
                          {booking.date}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                          <HiClock className="w-4 h-4" />
                          {booking.timeSlot}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="relative group/select">
                        <select
                          value={booking.status}
                          onChange={(e) => updateStatus(booking._id, e.target.value)}
                          className="bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest py-2 px-4 rounded-xl outline-none transition-all cursor-pointer appearance-none min-w-[120px]"
                        >
                          <option value="pending" className="bg-surface-card">Pending</option>
                          <option value="confirmed" className="bg-surface-card">Confirm</option>
                          <option value="completed" className="bg-surface-card">Complete</option>
                          <option value="cancelled" className="bg-surface-card">Cancel</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <HiAdjustmentsHorizontal className="w-4 h-4" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-2">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">
          Total Records: {filteredBookings.length}
        </p>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[2px]">
          SaaS Engine v1.0
        </p>
      </div>
    </div>
  );
}
