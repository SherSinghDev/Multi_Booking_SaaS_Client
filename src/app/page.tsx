'use client';

import Link from 'next/link';
import {
  HiCalendar,
  HiShieldCheck,
  HiChartBar,
  HiGlobeAlt,
  HiArrowRight,
  HiSparkles,
  HiChevronRight,
  HiUserGroup,
  HiBolt,
  HiBars3,
  HiXMark
} from 'react-icons/hi2';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function HomePage() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = ['Features', 'Solutions', 'Pricing', 'Resources'];

  return (
    <div className="min-h-screen bg-surface-bg selection:bg-primary-500/30 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-600/10 rounded-full blur-[120px] animate-blob" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-blue/10 rounded-full blur-[120px] animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-accent-purple/10 rounded-full blur-[100px] animate-blob" style={{ animationDelay: '4s' }} />
        <div className="absolute inset-0 bg-mesh opacity-30" />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[110] transition-all duration-300 border-b border-white/5 backdrop-blur-xl`}
        style={{ backgroundColor: mobileMenuOpen ? '#0b0821' : 'rgba(11, 8, 33, 0.5)' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20 group-hover:scale-110 transition-transform duration-300">
              <HiCalendar className="text-white text-xl" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">Bookify</span>
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((item) => (
              <Link key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide uppercase">
                {item}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-5">
            <div className="hidden sm:flex items-center gap-5">
              {user ? (
                <Link href="/dashboard" className="btn-primary py-2.5 px-6 text-sm font-black tracking-widest uppercase">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-black text-slate-300 hover:text-white uppercase tracking-widest">
                    Login
                  </Link>
                  <Link href="/signup" className="btn-primary py-2.5 px-6 text-sm font-black tracking-widest uppercase">
                    Get Started
                  </Link>
                </>
              )}
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <HiXMark className="w-8 h-8" /> : <HiBars3 className="w-8 h-8" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 z-[120] p-6 animate-in fade-in slide-in-from-right duration-300 flex flex-col overflow-y-auto w-screen h-screen min-h-[100dvh]"
            style={{ backgroundColor: '#0b0821' }}
          >
            {/* Menu Header */}
            <div className="flex items-center justify-between mb-12">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
                  <HiCalendar className="text-white text-xl" />
                </div>
                <span className="text-2xl font-black text-white tracking-tighter">Bookify</span>
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <HiXMark className="w-8 h-8" />
              </button>
            </div>

            <div className="absolute inset-0 bg-mesh opacity-10 -z-10" />

            <div className="flex flex-col gap-4">
              {navLinks.map((item, i) => (
                <Link
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-lg font-black text-white tracking-tighter hover:text-primary-400 transition-all flex items-center justify-between group p-5 bg-surface-card rounded-2xl border border-white/10 shadow-lg"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {item}
                  <HiChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary-400 transition-transform group-hover:translate-x-1" />
                </Link>
              ))}
            </div>

            <div className="mt-12 pb-12 space-y-4">
              <div className="h-px bg-white/5 mb-8" />
              {user ? (
                <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="btn-primary py-5 text-center font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3">
                  Go to Dashboard
                  <HiArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <div className="flex flex-col gap-4">
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="btn-primary py-5 text-center font-black uppercase tracking-widest text-sm">Join Bookify Now</Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary py-5 text-center font-black uppercase tracking-widest text-sm text-slate-300">Login to Account</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 pt-40 pb-32">
        <div className="container-center text-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-primary-400 mb-10 tracking-[3px] uppercase animate-fade-in">
            <HiSparkles className="animate-pulse" />
            Reimagining the Booking Economy
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] mb-8 tracking-tighter animate-float-slow">
            Launch Your <br />
            <span className="text-gradient text-glow">Booking Empire.</span>
          </h1>

          <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            A specialized multi-tenant SaaS framework for modern clinics, elite salons,
            and premium hotels. Scale faster with a unified command center.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
            <Link href="/signup" className="btn-primary text-xl px-12 py-5 flex items-center gap-3 group shadow-2xl shadow-primary-600/40">
              Start Building Free
              <HiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="#solutions" className="btn-secondary text-xl px-12 py-5 hover:bg-white/10 transition-all">
              Live Showcase
            </Link>
          </div>

          {/* Feature Showcase / Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto group">
            <div className="absolute inset-0 bg-primary-600/20 blur-[120px] rounded-full animate-pulse-soft pointer-events-none" />
            <div className="relative glass-morphism rounded-[48px] border-2 border-white/10 p-4 shadow-2xl overflow-hidden aspect-video group-hover:border-primary-500/30 transition-all duration-700">
              <div className="w-full h-full bg-surface-bg/80 rounded-[32px] overflow-hidden flex flex-col">
                {/* Simulated Dashboard UI */}
                <div className="h-12 border-b border-white/5 flex items-center px-6 gap-3">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                  </div>
                  <div className="w-40 h-4 bg-white/5 rounded-full" />
                </div>
                <div className="flex-1 flex p-8 gap-8">
                  <div className="w-1/4 space-y-6">
                    <div className="h-8 bg-primary-600/20 rounded-xl" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map(i => <div key={i} className="h-4 bg-white/5 rounded-lg w-full" />)}
                    </div>
                  </div>
                  <div className="flex-1 space-y-8">
                    <div className="grid grid-cols-3 gap-6">
                      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl border border-white/5" />)}
                    </div>
                    <div className="flex-1 bg-white/5 rounded-3xl border border-white/5 p-6 space-y-4">
                      <div className="h-6 w-1/3 bg-white/10 rounded-lg" />
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-white/[0.02] rounded-xl w-full" />)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Overlay Glass Elements */}
              <div className="absolute top-20 -right-10 w-64 h-40 glass-morphism rounded-3xl border border-white/20 p-6 shadow-2xl animate-float-slow hidden lg:block">
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-2">Real-time Revenue</p>
                <p className="text-3xl font-black text-white">$14,290</p>
                <div className="mt-4 h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-emerald-500" />
                </div>
              </div>
              <div className="absolute bottom-20 -left-10 w-56 h-32 glass-morphism rounded-3xl border border-white/20 p-6 shadow-2xl animate-float hidden lg:block" style={{ animationDelay: '1s' }}>
                <p className="text-[10px] font-black text-primary-400 uppercase tracking-widest mb-2">Active Tenants</p>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-primary-600 border-2 border-surface-bg flex items-center justify-center text-[10px] font-bold">U{i}</div>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Solutions Section */}
      <section id="solutions" className="py-32 relative z-10">
        <div className="container-center">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-3">Built for <span className="text-gradient">Every Scale.</span></h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm font-medium">Industry-specific operational frameworks ready to deploy.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🏥",
                title: "Health Clinics",
                desc: "Specialized for multi-doctor practices and patient records.",
                features: ["Patient Queuing", "Digital Prescriptions", "History Audit"],
                color: "from-emerald-500/20 to-emerald-500/5",
                btn: "border-emerald-500/20 text-emerald-400"
              },
              {
                icon: "💇",
                title: "Modern Salons",
                desc: "High-velocity slot management for stylists and beauty professionals.",
                features: ["Stylist Allocation", "Product Upsells", "SMS Reminders"],
                color: "from-pink-500/20 to-pink-500/5",
                btn: "border-pink-500/20 text-pink-400"
              },
              {
                icon: "🏨",
                title: "Luxury Hotels",
                desc: "Enterprise room reservation system with guest concierge support.",
                features: ["Inventory Control", "Guest Management", "Extended Stay Logic"],
                color: "from-amber-500/20 to-amber-500/5",
                btn: "border-amber-500/20 text-amber-400"
              },
            ].map((sol, i) => (
              <div key={i} className={`group glass-morphism rounded-[40px] p-10 border-2 border-transparent hover:border-white/10 bg-gradient-to-br ${sol.color} transition-all duration-500 flex flex-col items-center text-center md:items-start md:text-left`}>
                <div className="text-6xl mb-8 group-hover:scale-110 transition-transform duration-500">{sol.icon}</div>
                <h3 className="text-xl font-black text-white mb-3 tracking-tight">{sol.title}</h3>
                <p className="text-slate-400 text-xs font-medium mb-6 leading-relaxed">{sol.desc}</p>
                <ul className="space-y-3 mb-10 flex-1 w-full">
                  {sol.features.map(f => (
                    <li key={f} className="flex items-center justify-center md:justify-start gap-3 text-xs font-bold text-slate-300">
                      <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white shrink-0">✓</div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className={`w-full py-4 px-6 rounded-2xl border text-[10px] font-black uppercase tracking-widest text-center hover:bg-white/5 transition-all ${sol.btn}`}>
                  Deploy Solution
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Technology Section */}
      <section className="py-32 border-y border-white/5 bg-white/[0.01] relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary-600/5 blur-[120px]" />
        <div className="container-center grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-[1.1]">
              The DNA of <br />
              <span className="text-gradient">Hyper-Growth.</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium leading-relaxed">
              We&apos;ve distilled years of booking infrastructure experience into a
              single, high-performance platform. No technical debt, just raw performance.
            </p>
            <div className="space-y-6">
              {[
                { icon: <HiBolt />, title: "Instant Deployment", desc: "Get from signup to your first booking in under 3 minutes." },
                { icon: <HiShieldCheck />, title: "Bank-Grade Security", desc: "Data isolation at the architectural level. Your tenants, your rules." },
                { icon: <HiUserGroup />, title: "Unlimited Scalability", desc: "From 1 booking a month to 1 million. We grow as you go." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-2xl text-primary-400 group-hover:bg-primary-600 group-hover:text-white transition-all duration-500">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-accent-blue/10 blur-[100px] animate-pulse-soft" />
            <div className="relative grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <div className="glass-morphism rounded-3xl p-8 border border-white/10 animate-float-slow">
                  <HiChartBar className="text-4xl text-primary-400 mb-6" />
                  <p className="text-4xl font-black text-white mb-2">94%</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Retention</p>
                </div>
                <div className="glass-morphism rounded-3xl p-8 border border-white/10">
                  <HiSparkles className="text-4xl text-amber-400 mb-6" />
                  <p className="text-4xl font-black text-white mb-2">24ms</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Response Latency</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="glass-morphism rounded-3xl p-8 border border-white/10">
                  <HiShieldCheck className="text-4xl text-emerald-400 mb-6" />
                  <p className="text-4xl font-black text-white mb-2">Zero</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">System Overlaps</p>
                </div>
                <div className="glass-morphism rounded-3xl p-8 border border-white/10 animate-float">
                  <HiGlobeAlt className="text-4xl text-sky-400 mb-6" />
                  <p className="text-4xl font-black text-white mb-2">Multi</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Regional Hosting</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-40 relative z-10 px-6">
        <div className="container-center max-w-4xl">
          <div className="glass-morphism rounded-[40px] md:rounded-[60px] p-8 sm:p-16 md:p-24 text-center border-2 border-primary-500/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-accent-blue/10 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter mb-5">Ready to dominate <br /> <span className="text-gradient">your market?</span></h2>
              <p className="text-base text-slate-300 mb-8 max-w-md mx-auto font-medium">Join 5,000+ businesses running their entire booking economy on Bookify.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/signup" className="btn-primary text-xl px-12 py-5 w-full sm:w-auto">Get Started Now</Link>
                <Link href="/login" className="btn-secondary text-xl px-12 py-5 w-full sm:w-auto">Book a Demo</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative z-10 bg-surface-bg">
        <div className="container-center">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 text-center md:text-left">
              <Link href="/" className="flex items-center justify-center md:justify-start gap-2 group">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <HiCalendar className="text-white text-sm" />
                </div>
                <span className="text-xl font-black text-white">Bookify</span>
              </Link>
              <p className="text-slate-500 text-sm font-medium max-w-xs">Building the global standard for multi-tenant booking infrastructure.</p>
            </div>

            <div className="flex flex-wrap justify-center gap-10">
              {['Product', 'Company', 'Legal', 'Social'].map(cat => (
                <div key={cat} className="space-y-4">
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">{cat}</p>
                  <div className="flex flex-col gap-2">
                    {[1, 2, 3].map(i => <Link key={i} href="#" className="text-sm font-bold text-slate-500 hover:text-white transition-colors">Link {i}</Link>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">&copy; {new Date().getFullYear()} Bookify SaaS. Built with Intensity.</p>
            <div className="flex gap-6">
              <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Status: Online</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
