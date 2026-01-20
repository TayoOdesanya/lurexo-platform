'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Search, 
  Users,
  UserCheck,
  UserX,
  Shield,
  TrendingUp,
  Calendar,
  DollarSign,
  Mail,
  MoreVertical,
  Ban,
  CheckCircle,
  Filter,
  Activity,
  Download,
  RefreshCw,
} from 'lucide-react';
import { mockAdminUsers } from '../../../lib/mockData/adminStats';

type RoleFilter = 'all' | 'user' | 'organizer' | 'artist' | 'admin';
type StatusFilter = 'all' | 'active' | 'suspended';
type SortBy = 'name' | 'created' | 'lastLogin' | 'spent';

export default function UsersManagementPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortBy, setSortBy] = useState<SortBy>('created');
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filter users
  let filteredUsers = mockAdminUsers.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'active' && !user.isSuspended) ||
      (statusFilter === 'suspended' && user.isSuspended);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Sort users
  filteredUsers = [...filteredUsers].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'lastLogin':
        const aLogin = a.lastLogin ? new Date(a.lastLogin).getTime() : 0;
        const bLogin = b.lastLogin ? new Date(b.lastLogin).getTime() : 0;
        return bLogin - aLogin;
      case 'spent':
        return (b.totalSpent || 0) - (a.totalSpent || 0);
      default:
        return 0;
    }
  });

  // Calculate stats
  const totalUsers = mockAdminUsers.length;
  const activeUsers = mockAdminUsers.filter(u => !u.isSuspended).length;
  const suspendedUsers = mockAdminUsers.filter(u => u.isSuspended).length;
  const organizerCount = mockAdminUsers.filter(u => u.role === 'organizer').length;
  const totalRevenue = mockAdminUsers.reduce((sum, u) => sum + (u.totalSpent || 0), 0);

  // Calculate new users (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const newUsers = mockAdminUsers.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length;

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
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
      admin: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', icon: <Shield className="w-3 h-3" /> },
      organizer: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: <UserCheck className="w-3 h-3" /> },
      artist: { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400', icon: <UserCheck className="w-3 h-3" /> },
      user: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', icon: <Users className="w-3 h-3" /> },
    };
    const config = configs[role as keyof typeof configs] || configs.user;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-xs font-medium ${config.bg} ${config.border} ${config.text}`}>
        {config.icon}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const handleSuspendUser = (userId: string) => {
    // TODO: Call API to suspend user
    console.log('Suspending user:', userId);
    alert('User suspended (this would call the API)');
  };

  const handleUnsuspendUser = (userId: string) => {
    // TODO: Call API to unsuspend user
    console.log('Unsuspending user:', userId);
    alert('User unsuspended (this would call the API)');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Users Management
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Manage all platform users and their access
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/users/activity"
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm font-medium transition-all"
          >
            <Activity className="w-4 h-4" />
            User Activity
          </Link>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Total</p>
          </div>
          <p className="text-2xl font-bold text-white">{totalUsers}</p>
          <p className="text-xs text-slate-400 mt-1">All users</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <p className="text-xs text-emerald-400 font-medium uppercase tracking-wide">Active</p>
          </div>
          <p className="text-2xl font-bold text-white">{activeUsers}</p>
          <p className="text-xs text-slate-400 mt-1">Not suspended</p>
        </div>

        <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-xl p-4 border border-rose-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Ban className="w-4 h-4 text-rose-400" />
            <p className="text-xs text-rose-400 font-medium uppercase tracking-wide">Suspended</p>
          </div>
          <p className="text-2xl font-bold text-white">{suspendedUsers}</p>
          <p className="text-xs text-slate-400 mt-1">Blocked access</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-purple-400" />
            <p className="text-xs text-purple-400 font-medium uppercase tracking-wide">Organizers</p>
          </div>
          <p className="text-2xl font-bold text-white">{organizerCount}</p>
          <p className="text-xs text-slate-400 mt-1">Event creators</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-4 border border-amber-500/20 col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <p className="text-xs text-amber-400 font-medium uppercase tracking-wide">New (30d)</p>
          </div>
          <p className="text-2xl font-bold text-white">{newUsers}</p>
          <p className="text-xs text-slate-400 mt-1">Recent signups</p>
        </div>
      </div>

      {/* Mobile Activity Button */}
      <div className="sm:hidden">
        <Link
          href="/admin/users/activity"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white text-sm font-medium transition-all"
        >
          <Activity className="w-4 h-4" />
          View User Activity
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setRoleFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            roleFilter === 'all'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          All Roles
        </button>
        <button
          onClick={() => setRoleFilter('user')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            roleFilter === 'user'
              ? 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border border-blue-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setRoleFilter('organizer')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            roleFilter === 'organizer'
              ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Organizers
        </button>
        <button
          onClick={() => setRoleFilter('admin')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            roleFilter === 'admin'
              ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Admins
        </button>

        <div className="w-px bg-slate-700/50 mx-1"></div>

        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'all'
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          All Status
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'active'
              ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setStatusFilter('suspended')}
          className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
            statusFilter === 'suspended'
              ? 'bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-400 border border-rose-500/30'
              : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-slate-600'
          }`}
        >
          Suspended
        </button>
      </div>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 transition-all"
        >
          <option value="created">Sort by Created</option>
          <option value="name">Sort by Name</option>
          <option value="lastLogin">Sort by Last Login</option>
          <option value="spent">Sort by Spending</option>
        </select>
      </div>

      {/* Results Count */}
      {(searchQuery || roleFilter !== 'all' || statusFilter !== 'all') && (
        <p className="text-sm text-slate-400">
          Showing {filteredUsers.length} of {totalUsers} users
        </p>
      )}

      {/* Users Table - Desktop */}
      <div className="hidden lg:block bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-800/50 border-b border-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Joined
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Last Login
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Spent
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Tickets
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-slate-400 uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                    className={`hover:bg-slate-800/50 transition-colors cursor-pointer ${
                      user.isSuspended ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="font-semibold text-white">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-4 py-4">
                      {user.isSuspended ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-500/10 border border-rose-500/30 rounded text-xs font-medium text-rose-400">
                          <Ban className="w-3 h-3" />
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-medium text-emerald-400">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-300">{formatDate(user.createdAt)}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-300">{getTimeAgo(user.lastLogin)}</p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm font-semibold text-emerald-400">
                        £{(user.totalSpent || 0).toFixed(2)}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <p className="text-sm text-white">{user.ticketsPurchased || 0}</p>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {!user.isAdmin && (
                          user.isSuspended ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnsuspendUser(user.id);
                              }}
                              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-medium transition-all"
                            >
                              Unsuspend
                            </button>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSuspendUser(user.id);
                              }}
                              className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-medium transition-all"
                            >
                              Suspend
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Users Cards - Mobile */}
      <div className="lg:hidden space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-12 border border-slate-700/50 text-center">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => router.push(`/admin/users/${user.id}`)}
              className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-4 border border-slate-700/50 shadow-lg cursor-pointer hover:border-indigo-500/30 transition-all ${
                user.isSuspended ? 'opacity-60' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-white mb-1">
                    {user.name}
                  </h3>
                  <p className="text-xs text-slate-400 mb-2">{user.email}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    {getRoleBadge(user.role)}
                    {user.isSuspended ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-500/10 border border-rose-500/30 rounded text-xs font-medium text-rose-400">
                        <Ban className="w-3 h-3" />
                        Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-xs font-medium text-emerald-400">
                        <CheckCircle className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-3 pt-3 border-t border-slate-700/50">
                <div>
                  <p className="text-xs text-slate-500">Joined</p>
                  <p className="text-sm font-medium text-white">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Login</p>
                  <p className="text-sm font-medium text-white">{getTimeAgo(user.lastLogin)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Total Spent</p>
                  <p className="text-sm font-medium text-emerald-400">£{(user.totalSpent || 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Tickets</p>
                  <p className="text-sm font-medium text-white">{user.ticketsPurchased || 0}</p>
                </div>
              </div>

              {/* Suspension Reason */}
              {user.isSuspended && user.suspensionReason && (
                <div className="mb-3 p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg">
                  <p className="text-xs text-slate-400 mb-1">Suspension Reason:</p>
                  <p className="text-xs text-rose-400">{user.suspensionReason}</p>
                </div>
              )}

              {/* Actions */}
              {!user.isAdmin && (
                <div className="pt-3 border-t border-slate-700/50">
                  {user.isSuspended ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnsuspendUser(user.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg text-sm font-medium transition-all"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Unsuspend User
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSuspendUser(user.id);
                      }}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-lg text-sm font-medium transition-all"
                    >
                      <Ban className="w-4 h-4" />
                      Suspend User
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}