'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  Search,
  Check,
  X,
  Crown,
  AlertCircle,
  Edit,
  Clock,
  DollarSign,
  Eye,
  CheckCircle,
  Copy,
  Calendar,
} from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiBase';

const API_BASE_URL = getApiBaseUrl();

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'event-manager' | 'marketing-lead' | 'promoter' | 'security' | 'staff';
  status: 'active' | 'pending' | 'suspended';
  addedDate: string;
  lastActive?: string;
  has2FA: boolean;
  assignedEvents?: string[];
  paymentSplit?: {
    enabled: boolean;
    percentage: number;
    eventId: string;
  }[];
  permissions: {
    manageEvents: boolean;
    viewAnalytics: boolean;
    manageSales: boolean;
    accessDoor: boolean;
    sendMarketing: boolean;
    manageTeam: boolean;
  };
}

type EventSummary = {
  id: string;
  name: string;
  date: string;
};

type CollaboratorApi = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  addedDate?: string;
  lastActive?: string | null;
  has2FA?: boolean;
  assignedEvents?: string[];
  paymentSplit?: { enabled: boolean; percentage: number; eventId: string }[];
  permissions?: Collaborator['permissions'] | null;
  inviteToken?: string | null;
  inviteExpiresAt?: string | null;
  createdUser?: boolean;
};

function normalizeRole(role: string): Collaborator['role'] {
  const v = (role || '').toUpperCase().replace(/-/g, '_');
  switch (v) {
    case 'OWNER':
      return 'owner';
    case 'ADMIN':
      return 'admin';
    case 'EVENT_MANAGER':
      return 'event-manager';
    case 'MARKETING_LEAD':
      return 'marketing-lead';
    case 'PROMOTER':
      return 'promoter';
    case 'SECURITY':
      return 'security';
    case 'STAFF':
    default:
      return 'staff';
  }
}

function normalizeStatus(status: string): Collaborator['status'] {
  const v = (status || '').toUpperCase();
  switch (v) {
    case 'ACTIVE':
      return 'active';
    case 'SUSPENDED':
      return 'suspended';
    case 'PENDING':
    default:
      return 'pending';
  }
}

function formatShortDate(dateString: string) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return dateString;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatRelativeTime(dateString?: string | null) {
  if (!dateString) return 'Never';
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return 'Unknown';
  const diffMs = Date.now() - d.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return formatShortDate(dateString);
}

const CollaboratorsPage: React.FC = () => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Invite form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'staff' as Collaborator['role'],
    assignedEvents: [] as string[],
    tempAccess: false,
    accessStartDate: '',
    accessEndDate: '',
    paymentSplitEnabled: false,
    paymentSplitPercentage: 0,
    paymentSplitEvent: '',
  });

  const roles = [
    { 
      id: 'admin', 
      name: 'Admin', 
      description: 'Full access except ownership transfer',
      permissions: { manageEvents: true, viewAnalytics: true, manageSales: true, accessDoor: true, sendMarketing: true, manageTeam: true }
    },
    { 
      id: 'event-manager', 
      name: 'Event Manager', 
      description: 'Create/edit events, view analytics, door access',
      permissions: { manageEvents: true, viewAnalytics: true, manageSales: false, accessDoor: true, sendMarketing: false, manageTeam: false }
    },
    { 
      id: 'marketing-lead', 
      name: 'Marketing Lead', 
      description: 'Create campaigns, view analytics, segment audiences',
      permissions: { manageEvents: false, viewAnalytics: true, manageSales: false, accessDoor: false, sendMarketing: true, manageTeam: false }
    },
    { 
      id: 'promoter', 
      name: 'Promoter', 
      description: 'Marketing and analytics access, optional payment splits',
      permissions: { manageEvents: false, viewAnalytics: true, manageSales: false, accessDoor: false, sendMarketing: true, manageTeam: false }
    },
    { 
      id: 'security', 
      name: 'Security', 
      description: 'Door access and check-in only, temporary access available',
      permissions: { manageEvents: false, viewAnalytics: false, manageSales: false, accessDoor: true, sendMarketing: false, manageTeam: false }
    },
    { 
      id: 'staff', 
      name: 'Staff', 
      description: 'Limited access to assigned events only',
      permissions: { manageEvents: false, viewAnalytics: false, manageSales: false, accessDoor: true, sendMarketing: false, manageTeam: false }
    },
  ];

  const eventsById = useMemo(() => {
    return events.reduce<Record<string, EventSummary>>((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {});
  }, [events]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const [collabRes, eventsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/collaborators`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          }),
          fetch(`${API_BASE_URL}/events/my-events`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          }),
        ]);

        if (!collabRes.ok) {
          const txt = await collabRes.text().catch(() => '');
          throw new Error(txt || `Failed to load collaborators (${collabRes.status})`);
        }

        if (!eventsRes.ok) {
          const txt = await eventsRes.text().catch(() => '');
          throw new Error(txt || `Failed to load events (${eventsRes.status})`);
        }

        const collabJson = (await collabRes.json()) as CollaboratorApi[];
        const eventsJson = (await eventsRes.json()) as any[];

        if (cancelled) return;

        const normalizedCollaborators = collabJson.map((collab) => ({
          id: collab.id,
          name: collab.name,
          email: collab.email,
          role: normalizeRole(collab.role),
          status: normalizeStatus(collab.status),
          addedDate: collab.addedDate ? formatShortDate(collab.addedDate) : '',
          lastActive: formatRelativeTime(collab.lastActive),
          has2FA: !!collab.has2FA,
          assignedEvents: collab.assignedEvents || [],
          paymentSplit: collab.paymentSplit || [],
          permissions: collab.permissions || {
            manageEvents: false,
            viewAnalytics: false,
            manageSales: false,
            accessDoor: false,
            sendMarketing: false,
            manageTeam: false,
          },
        }));

        const normalizedEvents = eventsJson.map((event) => ({
          id: event.id,
          name: event.title,
          date: formatShortDate(event.eventDate),
        }));

        setCollaborators(normalizedCollaborators);
        setEvents(normalizedEvents);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? 'Failed to load collaborators');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      owner: 'bg-gradient-to-r from-yellow-500 to-orange-500',
      admin: 'bg-purple-600',
      'event-manager': 'bg-blue-600',
      'marketing-lead': 'bg-pink-600',
      promoter: 'bg-green-600',
      security: 'bg-red-600',
      staff: 'bg-gray-600',
    };
    return colors[role] || 'bg-gray-600';
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: any }> = {
      active: { bg: 'bg-green-500/20', text: 'text-green-400', icon: CheckCircle },
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
      suspended: { bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle },
    };
    return styles[status] || styles.active;
  };

  const filteredCollaborators = collaborators.filter((collab) => {
    const matchesSearch =
      collab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (collab.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || collab.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleInvite = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('You are not logged in.');
        return;
      }

      const payload = {
        email: inviteForm.email.trim(),
        name: inviteForm.name.trim(),
        role: inviteForm.role,
        assignedEvents: inviteForm.assignedEvents,
        tempAccess: inviteForm.tempAccess,
        accessStartDate: inviteForm.accessStartDate || null,
        accessEndDate: inviteForm.accessEndDate || null,
        paymentSplitEnabled: inviteForm.paymentSplitEnabled,
        paymentSplitPercentage: inviteForm.paymentSplitPercentage,
        paymentSplitEvent: inviteForm.paymentSplitEvent || null,
      };

      const res = await fetch(`${API_BASE_URL}/collaborators`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || `Failed to send invite (${res.status})`);
      }

      const created = (await res.json()) as CollaboratorApi;
      const normalized: Collaborator = {
        id: created.id,
        name: created.name,
        email: created.email,
        role: normalizeRole(created.role),
        status: normalizeStatus(created.status),
        addedDate: created.addedDate ? formatShortDate(created.addedDate) : formatShortDate(new Date().toISOString()),
        lastActive: formatRelativeTime(created.lastActive),
        has2FA: !!created.has2FA,
        assignedEvents: created.assignedEvents || [],
        paymentSplit: created.paymentSplit || [],
        permissions: created.permissions || {
          manageEvents: false,
          viewAnalytics: false,
          manageSales: false,
          accessDoor: false,
          sendMarketing: false,
          manageTeam: false,
        },
      };

      setCollaborators((prev) => [normalized, ...prev]);
      setShowInviteModal(false);
      setShowEmailPreview(false);
      setError(null);
      setInviteForm({
        email: '',
        name: '',
        role: 'staff',
        assignedEvents: [],
        tempAccess: false,
        accessStartDate: '',
        accessEndDate: '',
        paymentSplitEnabled: false,
        paymentSplitPercentage: 0,
        paymentSplitEvent: '',
      });
    } catch (e: any) {
      setError(e?.message ?? 'Failed to invite collaborator');
    }
  };

  const selectedRole = roles.find(r => r.id === inviteForm.role);

  return (
    <div className="space-y-6">
      {loading && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-gray-300 text-sm">
          Loading collaborators…
        </div>
      )}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm">
          {error}
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Team & Collaborators</h1>
          <p className="text-gray-400 mt-1">Manage access and permissions for your team</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors"
        >
          <UserPlus className="w-5 h-5" />
          Invite Team Member
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <Users className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Members</p>
              <p className="text-white font-bold text-2xl">{collaborators.filter(c => c.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-500/20 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pending Invites</p>
              <p className="text-white font-bold text-2xl">{collaborators.filter(c => c.status === 'pending').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">2FA Enabled</p>
              <p className="text-white font-bold text-2xl">{collaborators.filter(c => c.has2FA).length}/{collaborators.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Payment Splits</p>
              <p className="text-white font-bold text-2xl">{collaborators.filter(c => c.paymentSplit?.some(p => p.enabled)).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-gray-900 border border-gray-800 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 transition-colors"
        >
          <option value="all">All Roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Team Members List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Member</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Role</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Status</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Assigned Events</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Security</th>
                <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Last Active</th>
                <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredCollaborators.map((collab) => {
                const StatusIcon = getStatusBadge(collab.status).icon;
                return (
                  <tr key={collab.id} className="hover:bg-gray-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                          {collab.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-white font-medium flex items-center gap-2">
                            {collab.name}
                            {collab.role === 'owner' && <Crown className="w-4 h-4 text-yellow-500" />}
                          </p>
                          <p className="text-gray-400 text-sm">{collab.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-white text-sm font-medium ${getRoleBadgeColor(collab.role)}`}>
                        {roles.find(r => r.id === collab.role)?.name || collab.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(collab.status).bg} ${getStatusBadge(collab.status).text}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {collab.status.charAt(0).toUpperCase() + collab.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {collab.assignedEvents && collab.assignedEvents.length > 0 ? (
                        <div className="text-sm">
                          <p className="text-white">
                            {eventsById[collab.assignedEvents[0]]?.name || collab.assignedEvents[0]}
                          </p>
                          {collab.assignedEvents.length > 1 && (
                            <p className="text-gray-400">+{collab.assignedEvents.length - 1} more</p>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">All events</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {collab.has2FA ? (
                          <span className="flex items-center gap-1.5 text-green-400 text-sm">
                            <Shield className="w-4 h-4" />
                            2FA
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-gray-500 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            No 2FA
                          </span>
                        )}
                        {collab.paymentSplit?.some(p => p.enabled) && (
                          <span className="flex items-center gap-1 text-blue-400 text-sm">
                            <DollarSign className="w-3.5 h-3.5" />
                            {collab.paymentSplit.find(p => p.enabled)?.percentage}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm">{collab.lastActive || 'Never'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        {collab.role !== 'owner' && (
                          <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <div>
                <h2 className="text-white font-bold text-xl">Invite Team Member</h2>
                <p className="text-gray-400 text-sm">Add a new collaborator to your team</p>
              </div>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Full Name *</label>
                  <input
                    type="text"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    placeholder="e.g., Sarah Johnson"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Email Address *</label>
                  <input
                    type="email"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="text-white font-medium mb-3 block">Role *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setInviteForm({ ...inviteForm, role: role.id as any })}
                      className={`p-4 rounded-xl border-2 transition-all text-left ${
                        inviteForm.role === role.id
                          ? 'bg-purple-600/20 border-purple-500 text-white'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      <p className="font-semibold mb-1">{role.name}</p>
                      <p className="text-xs text-gray-400">{role.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Permissions Preview */}
              {selectedRole && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                  <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Permissions for {selectedRole.name}
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedRole.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2 text-sm">
                        {value ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <X className="w-4 h-4 text-gray-600" />
                        )}
                        <span className={value ? 'text-gray-300' : 'text-gray-600'}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Assignment */}
              <div>
                <label className="text-white font-medium mb-2 block">Assign to Events (Optional)</label>
                <p className="text-gray-400 text-sm mb-3">Leave empty for access to all events</p>
                <div className="space-y-2">
                  {events.length === 0 ? (
                    <div className="text-gray-500 text-sm bg-gray-800/60 border border-gray-700 rounded-lg p-3">
                      No events found. Create an event first to assign collaborators.
                    </div>
                  ) : (
                    events.map((event) => (
                      <label key={event.id} className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={inviteForm.assignedEvents.includes(event.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setInviteForm({ ...inviteForm, assignedEvents: [...inviteForm.assignedEvents, event.id] });
                            } else {
                              setInviteForm({ ...inviteForm, assignedEvents: inviteForm.assignedEvents.filter(id => id !== event.id) });
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                        />
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{event.name}</p>
                          <p className="text-gray-400 text-xs">{event.date}</p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              {/* Temporary Access (for Security/Staff) */}
              {(inviteForm.role === 'security' || inviteForm.role === 'staff') && (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={inviteForm.tempAccess}
                      onChange={(e) => setInviteForm({ ...inviteForm, tempAccess: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white font-medium">Temporary Access (Event Day Only)</span>
                  </label>

                  {inviteForm.tempAccess && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Start Date</label>
                        <input
                          type="date"
                          value={inviteForm.accessStartDate}
                          onChange={(e) => setInviteForm({ ...inviteForm, accessStartDate: e.target.value })}
                          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">End Date</label>
                        <input
                          type="date"
                          value={inviteForm.accessEndDate}
                          onChange={(e) => setInviteForm({ ...inviteForm, accessEndDate: e.target.value })}
                          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Payment Split (for Promoters) */}
              {inviteForm.role === 'promoter' && (
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-3">
                    <input
                      type="checkbox"
                      checked={inviteForm.paymentSplitEnabled}
                      onChange={(e) => setInviteForm({ ...inviteForm, paymentSplitEnabled: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white font-medium">Enable Payment Split</span>
                  </label>

                  {inviteForm.paymentSplitEnabled && (
                    <div className="pl-6 space-y-4">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Event</label>
                        <select
                          value={inviteForm.paymentSplitEvent}
                          onChange={(e) => setInviteForm({ ...inviteForm, paymentSplitEvent: e.target.value })}
                          className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                        >
                          <option value="">Select event...</option>
                          {inviteForm.assignedEvents.length > 0 
                            ? events.filter(e => inviteForm.assignedEvents.includes(e.id)).map(event => (
                                <option key={event.id} value={event.id}>{event.name}</option>
                              ))
                            : events.map(event => (
                                <option key={event.id} value={event.id}>{event.name}</option>
                              ))
                          }
                        </select>
                      </div>

                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">
                          Commission Percentage: {inviteForm.paymentSplitPercentage}%
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={inviteForm.paymentSplitPercentage}
                          onChange={(e) => setInviteForm({ ...inviteForm, paymentSplitPercentage: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>0%</span>
                          <span>25%</span>
                          <span>50%</span>
                        </div>
                      </div>

                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                        <p className="text-blue-300 text-sm">
                          <strong>{inviteForm.name || 'This promoter'}</strong> will receive{' '}
                          <strong>{inviteForm.paymentSplitPercentage}%</strong> of ticket sales from the selected event.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2FA Requirement */}
              {(inviteForm.role === 'owner' || inviteForm.role === 'admin') && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-purple-300 font-medium mb-1">2FA Required</p>
                      <p className="text-purple-200/80 text-sm">
                        {inviteForm.role === 'owner' ? 'Owner' : 'Admin'} accounts must enable two-factor authentication upon first login for security.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={() => setShowEmailPreview(true)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Preview Email
                </button>
                <button
                  onClick={handleInvite}
                  disabled={!inviteForm.email || !inviteForm.name}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Mail className="w-4 h-4" />
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {showEmailPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Email Preview */}
            <div className="bg-gray-900 p-4 flex items-center justify-between">
              <h3 className="text-white font-semibold">Email Preview</h3>
              <button
                onClick={() => setShowEmailPreview(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {/* Email Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">L</span>
                </div>
                <h1 className="text-gray-900 font-bold text-2xl">You've been invited to join Lurexo!</h1>
              </div>

              {/* Email Body */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <p className="text-gray-900 mb-4">Hi {inviteForm.name || '[Name]'},</p>
                <p className="text-gray-700 mb-4">
                  <strong>Alex Morgan</strong> has invited you to join their team on Lurexo as a{' '}
                  <strong>{roles.find(r => r.id === inviteForm.role)?.name}</strong>.
                </p>

                {inviteForm.assignedEvents.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-700 mb-2">You'll have access to:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {inviteForm.assignedEvents.map(eventId => {
                        const event = eventsById[eventId];
                        return event ? <li key={eventId}>{event.name}</li> : <li key={eventId}>{eventId}</li>;
                      })}
                    </ul>
                  </div>
                )}

                {inviteForm.paymentSplitEnabled && inviteForm.paymentSplitPercentage > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="text-green-800 font-medium">💰 Payment Split Enabled</p>
                    <p className="text-green-700 text-sm">
                      You'll receive {inviteForm.paymentSplitPercentage}% commission on ticket sales.
                    </p>
                  </div>
                )}

                {(inviteForm.role === 'owner' || inviteForm.role === 'admin') && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-purple-800 font-medium flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Security Notice
                    </p>
                    <p className="text-purple-700 text-sm">
                      You'll be required to set up two-factor authentication (2FA) upon first login.
                    </p>
                  </div>
                )}

                <div className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-xl text-center cursor-not-allowed">
                  Accept Invitation
                </div>
              </div>

              <div className="text-center text-gray-500 text-sm">
                <p>This invitation will expire in 7 days.</p>
                <p className="mt-2">
                  If you didn't expect this invitation, you can safely ignore this email.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center gap-3">
              <button
                onClick={() => setShowEmailPreview(false)}
                className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-xl font-semibold transition-colors"
              >
                Back to Edit
              </button>
              <button
                onClick={handleInvite}
                disabled={!inviteForm.email || !inviteForm.name}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send Invite
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollaboratorsPage;
