'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { 
  HiUsers, 
  HiTrash, 
  HiMagnifyingGlass, 
  HiEnvelope,
  HiCalendarDays,
  HiShieldCheck
} from 'react-icons/hi2';

interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      toast.error('Security handshake failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('CRITICAL ACTION: This will purge all user data, businesses, and bookings. Proceed?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      toast.success('Data purged successfully.');
      fetchUsers();
    } catch (err) {
      toast.error('Purge failed.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
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
        <h1 className="text-2xl font-black text-white tracking-tight mb-2">Platform <span className="text-indigo-400">Admins</span></h1>
        <p className="text-xs text-slate-400 font-medium">Manage and audit all registered SaaS operators.</p>
      </div>

      {/* Control Bar */}
      <div className="glass-morphism rounded-[24px] p-4 flex flex-col lg:flex-row gap-4 border border-white/5 bg-white/[0.02]">
        <div className="relative flex-1 group">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Search by name or email identity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-morphism rounded-[32px] overflow-hidden border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full table-premium">
            <thead>
              <tr>
                <th>Operator Profile</th>
                <th>Identity</th>
                <th>Registration Date</th>
                <th>Privilege Level</th>
                <th className="text-right">Security Ops</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user._id} className="group hover:bg-indigo-600/[0.02] transition-colors">
                  <td>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{user.name}</div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                      <HiEnvelope className="w-4 h-4 opacity-50" />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-widest">
                      <HiCalendarDays className="w-4 h-4 opacity-50" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Admin
                    </span>
                  </td>
                  <td className="text-right">
                    <button 
                      onClick={() => handleDelete(user._id)}
                      className="p-3 text-red-400/50 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
