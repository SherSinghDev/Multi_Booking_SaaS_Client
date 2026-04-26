'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  HiHome,
  HiCalendarDays,
  HiSquares2X2,
  HiCog6Tooth,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
  HiGlobeAlt,
  HiPlus,
  HiCalendar,
  HiChevronUpDown,
  HiShieldCheck,
  HiBuildingOffice2,
  HiRocketLaunch,
  HiClock
} from 'react-icons/hi2';
import api from '@/lib/api';

interface Business {
  _id: string;
  businessName: string;
  businessType: string;
  slug: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired' | 'pending_renewal';
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activeBusiness, setActiveBusiness] = useState<Business | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/saas/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await api.get('/business/my');
        setBusinesses(res.data);
        const storedId = localStorage.getItem('bookify_active_business');
        const found = res.data.find((b: Business) => b._id === storedId);
        if (found) {
          setActiveBusiness(found);
        } else if (res.data.length > 0) {
          setActiveBusiness(res.data[0]);
          localStorage.setItem('bookify_active_business', res.data[0]._id);
        } else {
          setActiveBusiness(null);
          localStorage.removeItem('bookify_active_business');
        }
      } catch {}
    };
    if (user) fetchBusinesses();
  }, [user]);

  const handleBusinessSwitch = (business: Business) => {
    setActiveBusiness(business);
    localStorage.setItem('bookify_active_business', business._id);
    window.location.reload(); 
  };

  const handleLogout = () => {
    logout();
    router.push('/saas/');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-surface-bg flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-primary-600/30 border-t-primary-600 rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: '/saas/dashboard', icon: HiHome, label: 'Overview' },
    { href: '/saas/dashboard/my-businesses', icon: HiBuildingOffice2, label: 'My Businesses' },
    { href: '/saas/dashboard/bookings', icon: HiCalendarDays, label: 'Bookings' },
    { href: '/saas/dashboard/services', icon: HiSquares2X2, label: 'Services' },
    { href: '/saas/dashboard/settings', icon: HiCog6Tooth, label: 'Settings' },
  ];

  const businessTypeEmoji: Record<string, string> = {
    clinic: '🏥',
    salon: '💇',
    hotel: '🏨',
  };

  return (
    <div className="min-h-screen bg-surface-bg flex text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-surface-card/40 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <HiCalendar className="text-white text-xs" />
            </div>
            <span className="text-lg font-black text-white tracking-tighter">Bookify</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-white"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Business Context Switcher */}
        <div className="px-6 py-8">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 ml-1">Your Platform</p>
          {activeBusiness ? (
            <div className="relative group">
              <div className={`flex items-center justify-between w-full p-4 bg-white/5 border rounded-2xl group-hover:border-primary-500/50 transition-all cursor-pointer ${activeBusiness.status === 'pending' ? 'border-amber-500/30' : 'border-white/10'}`}>
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 bg-primary-600/20 border border-primary-500/30 rounded-lg flex items-center justify-center text-base shrink-0">
                    {businessTypeEmoji[activeBusiness.businessType]}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{activeBusiness.businessName}</h4>
                    <p className={`text-[9px] font-bold uppercase ${activeBusiness.status === 'pending' ? 'text-amber-500' : 'text-slate-500'}`}>
                      {activeBusiness.status === 'pending' ? 'Pending Activation' : activeBusiness.businessType}
                    </p>
                  </div>
                </div>
                <HiChevronUpDown className="text-slate-500 w-5 h-5 shrink-0" />
              </div>
              
              <select
                value={activeBusiness._id}
                onChange={(e) => {
                  const b = businesses.find((b) => b._id === e.target.value);
                  if (b) handleBusinessSwitch(b);
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                {businesses.map((b) => (
                  <option key={b._id} value={b._id} className="bg-surface-card text-white">
                    {b.businessName} ({b.status})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <Link
              href="/saas/dashboard/create-business"
              className="flex items-center gap-3 p-4 bg-primary-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-primary-600/20 hover:bg-primary-500 transition-all active:scale-95"
            >
              <HiPlus className="w-5 h-5" />
              Launch Business
            </Link>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 ml-3">Management</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const isBlocked = (activeBusiness?.status === 'pending' || activeBusiness?.status === 'expired' || activeBusiness?.status === 'pending_renewal') && !['/saas/dashboard', '/saas/dashboard/my-businesses'].includes(item.href);
            return (
              <Link
                key={item.href}
                href={isBlocked ? '#' : item.href}
                onClick={() => !isBlocked && setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/20'
                    : isBlocked 
                      ? 'text-slate-600 cursor-not-allowed opacity-50' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-8 space-y-1.5">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 ml-3">External</p>
            {activeBusiness && activeBusiness.status === 'approved' && (
              <Link
                href={`/saas/business/${activeBusiness.slug}`}
                target="_blank"
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-emerald-400 hover:bg-emerald-400/10 transition-all group"
              >
                <HiGlobeAlt className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Live Portal
              </Link>
            )}
            <Link
              href="/saas/dashboard/create-business"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
            >
              <HiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              New Business
            </Link>

            {user.role === 'super-admin' && (
              <div className="pt-8 space-y-1.5">
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[2px] mb-4 ml-3">System Root</p>
                <Link
                  href="/saas/super-admin"
                  className="flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold text-indigo-400 hover:bg-indigo-400/10 transition-all group"
                >
                  <HiShieldCheck className="w-5 h-5" />
                  Global Access
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white font-black text-sm shadow-inner">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase truncate tracking-tight">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <HiArrowRightOnRectangle className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary-600/5 blur-[120px] pointer-events-none" />
        
        <header className="h-20 bg-surface-bg/80 backdrop-blur-md border-b border-white/5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <HiBars3 className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full">
              <span className={`w-2 h-2 rounded-full animate-pulse ${activeBusiness?.status === 'pending' ? 'bg-amber-500' : 'bg-emerald-500'}`} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {activeBusiness?.status === 'pending' ? 'Activation Pending' : 'System Operational'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Server Time</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-6 md:p-10 max-w-[1600px] mx-auto w-full relative z-10">
          {pathname === '/saas/dashboard/renew' || pathname === '/saas/dashboard/my-businesses' ? (
            children
          ) : activeBusiness?.status === 'pending' ? (
            <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="relative">
                <div className="w-32 h-32 bg-amber-500/10 rounded-[40px] flex items-center justify-center border border-amber-500/20 shadow-2xl shadow-amber-500/10">
                  <HiRocketLaunch className="w-16 h-16 text-amber-500 animate-bounce" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-surface-bg rounded-full p-1">
                  <div className="w-full h-full bg-amber-500 rounded-full flex items-center justify-center text-white font-black text-xs">!</div>
                </div>
              </div>
              
              <div className="max-w-md space-y-4">
                <h2 className="text-3xl font-black text-white tracking-tight">Activation in <span className="text-amber-500">Progress.</span></h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Your business <span className="text-white font-bold">"{activeBusiness.businessName}"</span> has been submitted. Our Super Admin is currently reviewing your payment receipt.
                </p>
                <div className="pt-4 flex flex-col items-center gap-3">
                  <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verification Status: Pending Approval</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[2px]">This usually takes less than 24 hours.</p>
                </div>
              </div>
            </div>
          ) : activeBusiness?.status === 'expired' ? (
            <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="relative">
                <div className="w-32 h-32 bg-rose-500/10 rounded-[40px] flex items-center justify-center border border-rose-500/20 shadow-2xl shadow-rose-500/10">
                  <HiClock className="w-16 h-16 text-rose-500" />
                </div>
              </div>
              
              <div className="max-w-md space-y-4">
                <h2 className="text-3xl font-black text-white tracking-tight">Subscription <span className="text-rose-500">Expired.</span></h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Your subscription for <span className="text-white font-bold">"{activeBusiness.businessName}"</span> has ended. Please renew to restore platform operations.
                </p>
                <Link 
                  href="/saas/dashboard/renew"
                  className="btn-primary inline-flex items-center gap-3 py-4 px-10 text-lg font-black tracking-widest uppercase mt-6"
                >
                  Renew Now
                  <HiPlus className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ) : activeBusiness?.status === 'pending_renewal' ? (
            <div className="h-full min-h-[60vh] flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              <div className="relative">
                <div className="w-32 h-32 bg-indigo-500/10 rounded-[40px] flex items-center justify-center border border-indigo-500/20 shadow-2xl shadow-indigo-500/10">
                  <HiClock className="w-16 h-16 text-indigo-500 animate-pulse" />
                </div>
              </div>
              
              <div className="max-w-md space-y-4">
                <h2 className="text-3xl font-black text-white tracking-tight">Renewal <span className="text-indigo-400">Processing.</span></h2>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  We've received your renewal request for <span className="text-white font-bold">"{activeBusiness.businessName}"</span>. Our team is verifying your payment.
                </p>
                <div className="pt-4">
                  <span className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-slate-400 uppercase tracking-widest">Status: Pending Verification</span>
                </div>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
    </div>
  );
}
