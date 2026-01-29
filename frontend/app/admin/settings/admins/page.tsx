'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  Shield,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  Crown,
  Ban,
  Edit,
  Trash2,
} from 'lucide-react';
import { mockAdminAccounts } from '../../../../lib/mockData/adminStats';

export default function AdminManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'super_admin' | 'admin' | 'moderator' | 'support'>('all');

  const admins = mockAdminAccounts;

  // Filter admins
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = selectedRole === 'all' || admin.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  const activeAdmins = admins.filter(a => a.isActive).length;
  const inactiveAdmins = admins.filter(a => !a.isActive).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return formatDate(dateString);
  };

  const getRoleBadge = (role: string) => {
    const configs = {
      super_admin: {
        icon: <Crown className="w-3 h-3" />,
        label: 'Super Admin',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        text: 'text-rose-400',
      },
      admin: {
        icon: <Shield className="w-3 h-3" />,
        label: 'Admin',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        text: 'text-purple-400',
      },
      moderator: {
        icon: <Shield className="w-3 h-3" />,
        label: 'Moderator',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/30',
        text: 'text-blue-400',
      },
      support: {
        icon: <Users className="w-3 h-3" />,
        label: 'Support',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/30',
        text: 'text-emerald-400',
      },
    };
    const config = configs[role as keyof typeof configs];
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${config.bg} ${config.border} ${config.text}`}>
        {config.icon}
        {config.label}
      </span>
    );
  };

  const handleDeactivateAdmin = (adminId: string) => {
    console.log('Deactivating admin:', adminId);
    alert('Admin deactivated (this would call the API)');
  };

  const handleActivateAdmin = (adminId: string) => {
    console.log('Activating admin:', adminId);
    alert('Admin activated (this would call the API)');
  };

  const handleDeleteAdmin = (adminId: string) => {
    console.log('Deleting admin:', adminId);
    if (confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      alert('Admin deleted (this would call the API)');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/settings')}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Admin Management
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage admin users and their permissions
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm font-medium transition-all">
          <UserPlus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Admin</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total Admins</p>
          </div>
          <p className="text-2xl font-bold text-white">{admins.length}</p>
          <p className="text-xs text-slate-400 mt-1">All admin accounts</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Active</p>
          </div>
          <p className="text-2xl font-bold text-white">{activeAdmins}</p>
          <p className="text-xs text-slate-400 mt-1">Currently active</p>
        </div>

        <div className="bg-gradient-to-br from-slate-500/10 to-slate-600/10 rounded-xl p-6 border border-slate-500/20">
          <div className="flex items-center gap-2 mb-2">
            <XCircle className="w-4 h-4 text-slate-400" />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Inactive</p>
          </div>
          <p className="text-2xl font-bold text-white">{inactiveAdmins}</p>
          <p className="text-xs text-slate-400 mt-1">Deactivated</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl p-6 border border-rose-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="w-4 h-4 text-rose-400" />
            <p className="text-xs text-rose-400 font-medium uppercase tracking-wide">Super Admins</p>
          </div>
          <p className="text-2xl font-bold text-white">
            {admins.filter(a => a.role === 'super_admin').length}
          </p>
          <p className="text-xs text-slate-400 mt-1">Full access</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedRole('all')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            selectedRole === 'all'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          All Roles
        </button>
        <button
          onClick={() => setSelectedRole('super_admin')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            selectedRole === 'super_admin'
              ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Super Admin
        </button>
        <button
          onClick={() => setSelectedRole('admin')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            selectedRole === 'admin'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Admin
        </button>
        <button
          onClick={() => setSelectedRole('moderator')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            selectedRole === 'moderator'
              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Moderator
        </button>
        <button
          onClick={() => setSelectedRole('support')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            selectedRole === 'support'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Support
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
        />
      </div>

      {/* Admins Table - Desktop */}
      <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Last Login
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-white">{admin.name}</p>
                      <p className="text-xs text-slate-400">{admin.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getRoleBadge(admin.role)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.slice(0, 2).map((permission, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-800 border border-slate-700/50 rounded text-xs text-slate-300"
                        >
                          {permission}
                        </span>
                      ))}
                      {admin.permissions.length > 2 && (
                        <span className="px-2 py-0.5 bg-slate-800 border border-slate-700/50 rounded text-xs text-slate-400">
                          +{admin.permissions.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {admin.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-medium text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-500/10 border border-slate-500/30 rounded text-xs font-medium text-slate-400">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-300">{formatDate(admin.createdAt)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-300">{getTimeAgo(admin.lastLogin)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {admin.role !== 'super_admin' && (
                        <>
                          <button
                            onClick={() => alert('Edit admin (feature coming soon)')}
                            className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg transition-all"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {admin.isActive ? (
                            <button
                              onClick={() => handleDeactivateAdmin(admin.id)}
                              className="p-1.5 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 text-slate-400 rounded-lg transition-all"
                            >
                              <Ban className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateAdmin(admin.id)}
                              className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg transition-all"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admins Cards - Mobile */}
      <div className="lg:hidden space-y-3">
        {filteredAdmins.map((admin) => (
          <div
            key={admin.id}
            className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50 shadow-lg"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-white mb-1">
                  {admin.name}
                </h3>
                <p className="text-xs text-slate-400 mb-2">{admin.email}</p>
                <div className="flex flex-wrap items-center gap-2">
                  {getRoleBadge(admin.role)}
                  {admin.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-medium text-emerald-400">
                      <CheckCircle className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-500/10 border border-slate-500/30 rounded text-xs font-medium text-slate-400">
                      <XCircle className="w-3 h-3" />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div className="mb-3">
              <p className="text-xs text-slate-500 mb-2">Permissions</p>
              <div className="flex flex-wrap gap-1">
                {admin.permissions.map((permission, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-slate-800 border border-slate-700/50 rounded text-xs text-slate-300"
                  >
                    {permission}
                  </span>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-slate-700/50">
              <div>
                <p className="text-xs text-slate-500">Created</p>
                <p className="text-sm font-medium text-white">{formatDate(admin.createdAt)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Last Login</p>
                <p className="text-sm font-medium text-white">{getTimeAgo(admin.lastLogin)}</p>
              </div>
            </div>

            {/* Actions */}
            {admin.role !== 'super_admin' && (
              <div className="pt-3 border-t border-slate-700/50">
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => alert('Edit admin (feature coming soon)')}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-lg text-xs font-medium transition-all"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  {admin.isActive ? (
                    <button
                      onClick={() => handleDeactivateAdmin(admin.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-slate-500/10 hover:bg-slate-500/20 border border-slate-500/30 text-slate-400 rounded-lg text-xs font-medium transition-all"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateAdmin(admin.id)}
                      className="flex items-center justify-center gap-1 px-3 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteAdmin(admin.id)}
                    className="flex items-center justify-center gap-1 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-medium transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}