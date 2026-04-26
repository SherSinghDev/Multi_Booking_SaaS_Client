'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { HiCalendarDays, HiClock, HiCheckCircle, HiExclamationCircle, HiArrowTrendingUp } from 'react-icons/hi2';
import Link from 'next/link';

interface Stats {
  totalBookings: number;
  todayBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
}

interface Booking {
  _id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  status: string;
  service: {
    name: string;
    type: string;
  };
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    const id = localStorage.getItem('bookify_active_business');
    setBusinessId(id);
    if (!id) setLoading(false);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!businessId) {
        setLoading(false);
        return;
      }
      try {
        const [statsRes, bookingsRes] = await Promise.all([
          api.get(`/bookings/${businessId}/stats`),
          api.get(`/bookings/${businessId}`),
        ]);
        setStats(statsRes.data);
        setRecentBookings(bookingsRes.data.slice(0, 5));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    if (businessId) fetchData();
  }, [businessId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-primary-600/20 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Syncing Engine...</p>
      </div>
    );
  }

  if (!businessId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
        <div className="glass-morphism rounded-[48px] p-16 max-w-lg border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10">
            <div className="text-7xl mb-8 animate-float-slow">🚀</div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-4">Welcome to <span className="text-gradient">Bookify.</span></h1>
            <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
              Your command center is ready, but you haven&apos;t launched a platform yet. 
              Create your first business to start tracking analytics and managing bookings.
            </p>
            <Link 
              href="/saas/dashboard/create-business" 
              className="btn-primary inline-flex items-center gap-3 px-10 py-4 text-sm font-black uppercase tracking-widest"
            >
              Launch My Platform
              <HiArrowTrendingUp className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: <HiCalendarDays className="w-6 h-6" />,
      color: 'bg-primary-600',
      gradient: 'from-primary-600/20 to-primary-600/5',
      border: 'border-primary-500/20'
    },
    {
      label: "Today's Volume",
      value: stats?.todayBookings || 0,
      icon: <HiClock className="w-6 h-6" />,
      color: 'bg-accent-blue',
      gradient: 'from-accent-blue/20 to-accent-blue/5',
      border: 'border-accent-blue/20'
    },
    {
      label: 'Confirmed',
      value: stats?.confirmedBookings || 0,
      icon: <HiCheckCircle className="w-6 h-6" />,
      color: 'bg-emerald-500',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Active Pending',
      value: stats?.pendingBookings || 0,
      icon: <HiExclamationCircle className="w-6 h-6" />,
      color: 'bg-amber-500',
      gradient: 'from-amber-500/20 to-amber-500/5',
      border: 'border-amber-500/20'
    },
  ];

  const statusColors: Record<string, string> = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
    completed: 'bg-primary-500/10 text-primary-400 border-primary-500/20',
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight mb-1">Command Center</h1>
          <p className="text-xs text-slate-400 font-medium">Real-time performance metrics for your platform.</p>
        </div>
        <Link 
          href="/saas/dashboard/bookings" 
          className="btn-primary text-sm font-bold flex items-center gap-3 group"
        >
          View All Bookings
          <HiArrowTrendingUp className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div
            key={i}
            className={`glass-morphism rounded-3xl p-8 border ${card.border} bg-gradient-to-br ${card.gradient} transition-all duration-300 hover:-translate-y-1`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg shadow-black/20`}>
                {card.icon}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">+12% vs last week</span>
            </div>
            <div className="text-3xl font-black text-white mb-1 tracking-tighter">{card.value}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[2px]">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Table */}
      <div className="glass-morphism rounded-[32px] overflow-hidden border border-white/5">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Activity</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Live Feed</p>
          </div>
          <Link
            href="/saas/dashboard/bookings"
            className="text-xs font-black text-primary-400 hover:text-primary-300 uppercase tracking-widest transition-colors"
          >
            View History →
          </Link>
        </div>

        {recentBookings.length === 0 ? (
          <div className="p-20 text-center">
            <div className="text-5xl mb-6 grayscale opacity-50">📅</div>
            <h3 className="text-lg font-bold text-white mb-2">No activity detected</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
              Your platform is ready. Share your booking link with customers to start seeing activity here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-premium">
              <thead>
                <tr>
                  <th>Customer Profile</th>
                  <th>Service Module</th>
                  <th>Scheduled Date</th>
                  <th>Time Segment</th>
                  <th>State</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white font-bold text-xs border border-white/10">
                          {booking.customerName.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{booking.customerName}</div>
                          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{booking.customerPhone}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm font-bold text-slate-300">{booking.service?.name}</span>
                    </td>
                    <td>
                      <span className="text-sm font-medium text-slate-400">{booking.date}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <HiClock className="text-slate-500 w-4 h-4" />
                        <span className="text-sm font-bold text-white">{booking.timeSlot}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${statusColors[booking.status]}`}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
