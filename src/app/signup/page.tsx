'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import { HiEye, HiEyeSlash, HiArrowRight, HiCalendar } from 'react-icons/hi2';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      toast.success('Account created! Welcome!');
      router.push('/saas/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-bg bg-mesh flex items-center justify-center px-6 relative overflow-hidden">
      {/* Visual Orbs */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-600/10 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-accent-purple/10 rounded-full blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="w-full max-w-[460px] relative z-10 py-12">
        <div className="text-center mb-10">
          <Link href="/saas/" className="inline-flex items-center gap-3 mb-6 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/30 group-hover:scale-110 transition-transform">
              <HiCalendar className="text-white text-xl" />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">Bookify</span>
          </Link>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2">Join the platform.</h1>
          <p className="text-slate-400 text-sm font-medium">Start managing your business bookings today.</p>
        </div>

        <div className="glass-morphism rounded-[32px] responsive-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Full Name</label>
              <div className="relative">
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pr-4 py-4 input-premium placeholder-slate-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Email address</label>
              <div className="relative">
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pr-4 py-4 input-premium placeholder-slate-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2 ml-1">Password</label>
              <div className="relative">
                <input
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pr-12 py-4 input-premium placeholder-slate-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <HiEyeSlash className="w-5 h-5" /> : <HiEye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                id="signup-submit"
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 text-lg font-bold flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Create Account
                    <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <p className="text-slate-400 font-medium">
              Already have an account?{' '}
              <Link href="/saas/login" className="text-primary-400 hover:text-primary-300 font-bold underline decoration-primary-500/30 underline-offset-4 transition-all">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
