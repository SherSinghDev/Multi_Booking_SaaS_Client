'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  HiHome,
  HiUsers,
  HiBuildingOffice2,
  HiChartBar,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
  HiShieldCheck,
  HiCalendar,
  HiClock
} from 'react-icons/hi2';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'super-admin')) {
      router.push('/saas/dashboard'); // Kick out if not super-admin
    }
  }, [user, authLoading, router]);

  const handleLogout = () => {
    logout();
    router.push('/saas/');
  };

  if (authLoading || !user || user.role !== 'super-admin') {
    return (
      <div className="min-h-screen bg-[#08090a] flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  const navItems = [
    { href: '/saas/super-admin', icon: HiHome, label: 'Control Center' },
    { href: '/saas/super-admin/users', icon: HiUsers, label: 'Platform Admins' },
    { href: '/saas/super-admin/businesses', icon: HiBuildingOffice2, label: 'Business Nodes' },
    { href: '/saas/super-admin/renewals', icon: HiClock, label: 'Renewal Queue' },
  ];

  return (
    <div className="min-h-screen bg-[#08090a] flex text-slate-200">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-indigo-950/10 backdrop-blur-xl border-r border-white/5 flex flex-col transition-transform duration-500 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-white/5 bg-indigo-600/5">
          <Link href="/saas/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/20">
              <HiShieldCheck className="text-white text-lg" />
            </div>
            <span className="text-lg font-black text-white tracking-tighter">SaaS <span className="text-indigo-400">Core</span></span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-white"
          >
            <HiXMark className="w-6 h-6" />
          </button>
        </div>

        {/* Global Context Indicator */}
        <div className="px-6 py-8">
          <div className="p-4 bg-indigo-600/10 border border-indigo-500/20 rounded-2xl">
            <div className="flex items-center gap-3 mb-1">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[2px]">Super Admin Active</p>
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase">Systemwide Oversight Mode</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[2px] mb-4 ml-3">Infrastructure</p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4 p-3 bg-white/5 rounded-2xl mb-3 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-inner">
              {user.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-indigo-400 font-bold uppercase truncate tracking-tight">Root Authority</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <HiArrowRightOnRectangle className="w-5 h-5" />
            System Termination
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        {/* Background Mesh Overlay for Content */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-indigo-600/5 blur-[120px] pointer-events-none" />
        
        {/* Top Navigation Bar */}
        <header className="h-20 bg-[#08090a]/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <HiBars3 className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-indigo-600/5 border border-indigo-500/10 rounded-full">
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Global SaaS Monitoring</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white">
                {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SaaS Master Clock</p>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <div className="flex-1 p-8 md:p-12 max-w-[1600px] mx-auto w-full relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
