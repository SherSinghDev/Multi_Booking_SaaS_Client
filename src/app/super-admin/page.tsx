'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { 
  HiUsers, 
  HiBuildingOffice2, 
  HiCalendarDays, 
  HiSquares2X2,
  HiArrowTrendingUp,
  HiShieldCheck
} from 'react-icons/hi2';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  totalBusinesses: number;
  totalBookings: number;
  totalServices: number;
  recentUsers: any[];
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4">
        <div className="w-10 h-10 border-3 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">Aggregating Global Data...</p>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Platform Admins',
      value: stats?.totalUsers || 0,
      icon: <HiUsers className="w-6 h-6" />,
      color: 'bg-indigo-600',
      gradient: 'from-indigo-600/20 to-indigo-600/5',
      border: 'border-indigo-500/20'
    },
    {
      label: 'Business Nodes',
      value: stats?.totalBusinesses || 0,
      icon: <HiBuildingOffice2 className="w-6 h-6" />,
      color: 'bg-blue-500',
      gradient: 'from-blue-500/20 to-blue-500/5',
      border: 'border-blue-500/20'
    },
    {
      label: 'Global Bookings',
      value: stats?.totalBookings || 0,
      icon: <HiCalendarDays className="w-6 h-6" />,
      color: 'bg-emerald-500',
      gradient: 'from-emerald-500/20 to-emerald-500/5',
      border: 'border-emerald-500/20'
    },
    {
      label: 'Active Services',
      value: stats?.totalServices || 0,
      icon: <HiSquares2X2 className="w-6 h-6" />,
      color: 'bg-purple-500',
      gradient: 'from-purple-500/20 to-purple-500/5',
      border: 'border-purple-500/20'
    },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            <HiShieldCheck className="text-indigo-500" />
            Global Control <span className="text-indigo-400">Panel</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Real-time infrastructure health and user activity monitoring.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className={`glass-morphism rounded-3xl responsive-card border ${card.border} bg-gradient-to-br ${card.gradient} transition-all duration-300 hover:-translate-y-1 group`}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className={`w-12 h-12 rounded-2xl ${card.color} flex items-center justify-center text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                {card.icon}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active System</span>
            </div>
            <div className="text-3xl font-black text-white mb-1 tracking-tighter">{card.value}</div>
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-[2px]">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Users List */}
        <div className="lg:col-span-2 glass-morphism rounded-[32px] overflow-hidden border border-white/5">
          <div className="px-6 sm:px-8 py-6 sm:py-8 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Onboardings</h2>
            <Link href="/super-admin/users" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-colors">
              Manage All Users →
            </Link>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats?.recentUsers.map((user: any) => (
                <div key={user._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-indigo-500/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-600/10 flex items-center justify-center text-indigo-400 font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user.name}</div>
                      <div className="text-[10px] text-slate-500 font-medium">{user.email}</div>
                    </div>
                  </div>
                  <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-morphism rounded-[32px] responsive-card border border-white/5 bg-indigo-600/5">
          <h2 className="text-lg font-bold text-white tracking-tight mb-8">System Health</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>Database Load</span>
                <span>Normal</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[15%] bg-indigo-500 rounded-full" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>API Latency</span>
                <span>24ms</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[8%] bg-emerald-500 rounded-full" />
              </div>
            </div>
            
            <div className="pt-8">
              <button className="w-full btn-primary bg-indigo-600 hover:bg-indigo-500 py-4 text-[10px] font-black uppercase tracking-[2px] flex items-center justify-center gap-3">
                Download System Audit
                <HiArrowTrendingUp />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
