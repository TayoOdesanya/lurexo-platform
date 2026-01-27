
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  AlertCircle,
  Check,
  CheckCircle,
  Clock,
  Download,
  Mail,
  Phone,
  QrCode,
  Search,
  Send,
  Trash2,
  Upload,
  UserPlus,
  X,
  XCircle,
} from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiBase';

const API_BASE_URL = getApiBaseUrl();

function getAccessTokenClient(): string | null {
  try {
    return localStorage.getItem('authToken') ?? localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

type GuestListStatus = 'INVITED' | 'CHECKED_IN' | 'CANCELLED';

type GuestListEntry = {
  id: string;
  eventId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  status: GuestListStatus;
  createdAt: string;
  updatedAt: string;
};

type GuestFormState = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: GuestListStatus;
  category: string;
};

const categoryOptions = ['VIP', 'INDUSTRY', 'COMP', 'STAFF', 'PRESS', 'SPONSOR'];

const emptyForm: GuestFormState = {
  name: '',
  email: '',
  phone: '',
  notes: '',
  status: 'INVITED',
  category: 'VIP',
};

export default function GuestListManagementPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [entries, setEntries] = useState<GuestListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkImportModal, setShowBulkImportModal] = useState(false);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GuestFormState>(emptyForm);
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const token = getAccessTokenClient();
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!eventId) return;
    const storageKey = `guest-list-categories:${eventId}`;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setCategoryMap(JSON.parse(raw));
    } catch {
      setCategoryMap({});
    }
  }, [eventId]);

  const persistCategoryMap = (next: Record<string, string>) => {
    if (!eventId) return;
    setCategoryMap(next);
    try {
      localStorage.setItem(`guest-list-categories:${eventId}`, JSON.stringify(next));
    } catch {
      // Ignore storage errors (private mode, quota exceeded).
    }
  };

  const loadEntries = async (token: string, id: string) => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/events/${id}/guest-list`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Failed to load guest list');
      }

      const data = (await res.json()) as GuestListEntry[];
      setEntries(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load guest list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!accessToken || !eventId) return;
    void loadEntries(accessToken, eventId);
  }, [accessToken, eventId]);

  useEffect(() => {
    if (!eventId) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}`, { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setEventName((data?.title ?? '').toString());
      } catch {
        if (!cancelled) setEventName('');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const normalizeStatus = (value: string): GuestListStatus => {
    const v = String(value ?? '').trim().toUpperCase();
    if (v === 'CHECKED_IN' || v === 'CHECKED IN') return 'CHECKED_IN';
    if (v === 'DECLINED' || v === 'CANCELLED' || v === 'CANCELED') return 'CANCELLED';
    if (v === 'CONFIRMED') return 'INVITED';
    return 'INVITED';
  };

  const parseCsvLine = (line: string) => {
    const out: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        const next = line[i + 1];
        if (inQuotes && next === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (ch === ',' && !inQuotes) {
        out.push(current);
        current = '';
        continue;
      }
      current += ch;
    }
    out.push(current);
    return out.map((v) => v.trim());
  };

  const parseCsv = (text: string) => {
    const rows = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map(parseCsvLine);

    if (!rows.length) return [];

    const header = rows[0].map((v) => v.toLowerCase());
    const hasHeader = header.includes('name');
    const dataRows = hasHeader ? rows.slice(1) : rows;

    return dataRows.map((cols) => {
      if (hasHeader) {
        const get = (key: string) => cols[header.indexOf(key)] ?? '';
        return {
          name: get('name'),
          email: get('email'),
          phone: get('phone') || get('mobile'),
          notes: get('notes'),
          status: get('status'),
          category: get('category'),
        };
      }
      return {
        name: cols[0] ?? '',
        email: cols[1] ?? '',
        phone: cols[2] ?? '',
        notes: cols[3] ?? '',
        status: cols[4] ?? '',
        category: cols[5] ?? '',
      };
    });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !eventId) return;

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        name: form.name.trim(),
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        notes: form.notes.trim() || undefined,
        status: form.status,
      };

      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId
        ? `${API_BASE_URL}/events/${eventId}/guest-list/${editingId}`
        : `${API_BASE_URL}/events/${eventId}/guest-list`;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Failed to save guest');
      }

      const created = (await res.json().catch(() => null)) as GuestListEntry | null;
      if (created?.id) {
        persistCategoryMap({ ...categoryMap, [created.id]: form.category });
      } else if (editingId) {
        persistCategoryMap({ ...categoryMap, [editingId]: form.category });
      }

      await loadEntries(accessToken, eventId);
      resetForm();
      setShowAddModal(false);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save guest');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: GuestListEntry) => {
    setEditingId(entry.id);
    setForm({
      name: entry.name ?? '',
      email: entry.email ?? '',
      phone: entry.phone ?? '',
      notes: entry.notes ?? '',
      status: entry.status ?? 'INVITED',
      category: categoryMap[entry.id] ?? 'VIP',
    });
    setShowAddModal(true);
  };

  const handleDelete = async (entryId: string) => {
    if (!accessToken || !eventId) return;
    const ok = confirm('Delete this guest?');
    if (!ok) return;

    try {
      setError(null);

      const res = await fetch(`${API_BASE_URL}/events/${eventId}/guest-list/${entryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Failed to delete guest');
      }

      const { [entryId]: _, ...rest } = categoryMap;
      persistCategoryMap(rest);
      await loadEntries(accessToken, eventId);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete guest');
    } finally {
    }
  };

  const handleBulkImport = async () => {
    if (!csvFile || !accessToken || !eventId) {
      setError('Please select a CSV file');
      return;
    }

    try {
      setImporting(true);
      setError(null);

      const text = await csvFile.text();
      const rows = parseCsv(text);
      if (!rows.length) {
        setError('No rows found in CSV.');
        return;
      }

      const nextCategoryMap = { ...categoryMap };
      for (const row of rows) {
        const name = String(row.name ?? '').trim();
        if (!name) continue;
        const payload = {
          name,
          email: String(row.email ?? '').trim() || undefined,
          phone: String(row.phone ?? '').trim() || undefined,
          notes: String(row.notes ?? '').trim() || undefined,
          status: normalizeStatus(String(row.status ?? '')),
        };

        const res = await fetch(`${API_BASE_URL}/events/${eventId}/guest-list`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(txt || `Failed to import guest: ${name}`);
        }

        const created = (await res.json().catch(() => null)) as GuestListEntry | null;
        if (created?.id && row.category) {
          nextCategoryMap[created.id] = String(row.category).trim();
        }
      }

      persistCategoryMap(nextCategoryMap);
      await loadEntries(accessToken, eventId);
      setShowBulkImportModal(false);
      setCsvFile(null);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to import CSV');
    } finally {
      setImporting(false);
    }
  };

  const handleSendInvitation = (entryId: string) => {
    const guest = entries.find((g) => g.id === entryId);
    if (guest?.email) {
      alert(`Invitation sent to ${guest.email}!`);
    } else {
      alert('No email available for this guest.');
    }
  };

  const handleExportCSV = () => {
    const header = ['name', 'email', 'phone', 'category', 'status', 'notes'];
    const lines = [
      header.join(','),
      ...filteredEntries.map((entry) => {
        const category = categoryMap[entry.id] ?? '';
        const row = [
          entry.name ?? '',
          entry.email ?? '',
          entry.phone ?? '',
          category,
          entry.status ?? '',
          entry.notes ?? '',
        ];
        return row
          .map((value) => {
            const v = String(value ?? '');
            if (v.includes(',') || v.includes('"') || v.includes('\n')) {
              return `"${v.replace(/"/g, '""')}"`;
            }
            return v;
          })
          .join(',');
      }),
    ];

    const csv = lines.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-list-${eventId ?? 'event'}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const filteredEntries = entries.filter((guest) => {
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      guest.name.toLowerCase().includes(search) ||
      guest.email?.toLowerCase().includes(search) ||
      guest.phone?.toLowerCase().includes(search);
    const category = categoryMap[guest.id];
    const matchesCategory = categoryFilter === 'all' || category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || guest.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusBadge = (status: GuestListStatus) => {
    switch (status) {
      case 'CHECKED_IN':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
            <Check className="w-3 h-3" />
            Checked In
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Declined
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
            <Clock className="w-3 h-3" />
            Invited
          </span>
        );
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      VIP: 'bg-yellow-500/20 text-yellow-400',
      INDUSTRY: 'bg-blue-500/20 text-blue-400',
      COMP: 'bg-purple-500/20 text-purple-400',
      STAFF: 'bg-green-500/20 text-green-400',
      PRESS: 'bg-pink-500/20 text-pink-400',
      SPONSOR: 'bg-orange-500/20 text-orange-400',
    };
    return colors[category] || 'bg-gray-500/20 text-gray-400';
  };

  const statusOptions = useMemo(
    () => [
      { value: 'INVITED', label: 'Invited' },
      { value: 'CHECKED_IN', label: 'Checked In' },
      { value: 'CANCELLED', label: 'Declined' },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading guest list...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-gray-900 border border-red-500/20 rounded-2xl p-8 max-w-md w-full text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-white font-bold text-xl mb-2">Error Loading Guest List</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4">
          <Link
            href="/organizer/manage-events"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Manage Events
          </Link>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
                {eventName || 'Guest List'}
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                {entries.length} {entries.length === 1 ? 'guest' : 'guests'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowBulkImportModal(true)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors"
              >
                <Upload className="w-5 h-5" />
                Bulk Import
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                Add Guest
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or mobile..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors font-medium text-sm"
                >
                  <option value="all">All Categories</option>
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors font-medium text-sm"
                >
                  <option value="all">All Status</option>
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium text-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800 bg-gray-800/50">
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Guest</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Contact</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Category</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Status</th>
                    <th className="text-left text-gray-400 text-sm font-medium p-4 whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((guest) => {
                    const category = categoryMap[guest.id];
                    return (
                      <tr key={guest.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="text-white font-semibold">{guest.name}</p>
                            {guest.notes && (
                              <p className="text-gray-500 text-xs mt-1 line-clamp-1">{guest.notes}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Mail className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{guest.email ?? '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                              <Phone className="w-3 h-3 flex-shrink-0" />
                              {guest.phone ?? '-'}
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {category ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getCategoryColor(
                                category,
                              )}`}
                            >
                              {category}
                            </span>
                          ) : (
                            <span className="text-gray-500 text-xs">-</span>
                          )}
                        </td>
                        <td className="p-4">{getStatusBadge(guest.status)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleSendInvitation(guest.id)}
                              className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                              title="Send Invitation"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(guest)}
                              className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                              title="Edit Guest"
                            >
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(guest.id)}
                              className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                              title="Delete Guest"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredEntries.length === 0 && (
              <div className="text-center py-12 px-4">
                <CheckCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'No guests found'
                    : 'No guests added yet'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all'
                    ? 'Try adjusting your search or filters'
                    : 'Get started by adding your first guest to the list'}
                </p>
                {!searchQuery && categoryFilter === 'all' && statusFilter === 'all' && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 transition-colors shadow-lg"
                  >
                    <UserPlus className="w-5 h-5" />
                    Add Your First Guest
                  </button>
                )}
              </div>
            )}
          </div>

          {showAddModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-white font-bold text-xl">
                    {editingId ? 'Edit Guest' : 'Add Guest'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., John Doe"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Mobile</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="+44 7123456789"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Category</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      {categoryOptions.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, status: e.target.value as GuestListStatus }))
                      }
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Notes</label>
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any special requirements or notes..."
                      rows={3}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                      disabled={submitting}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!form.name || submitting}
                      className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Saving...' : editingId ? 'Save Changes' : 'Add Guest'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {showBulkImportModal && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-white font-bold text-xl">Bulk Import Guests</h2>
                  <button
                    onClick={() => setShowBulkImportModal(false)}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-4">
                  <label className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl p-8 text-center transition-colors">
                      {csvFile ? (
                        <div>
                          <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
                          <p className="text-white font-medium mb-2">{csvFile.name}</p>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setCsvFile(null);
                            }}
                            className="text-red-400 hover:text-red-300 text-sm transition-colors"
                          >
                            Remove file
                          </button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                          <p className="text-white font-medium mb-2">Click to upload CSV</p>
                          <p className="text-gray-400 text-sm">or drag and drop</p>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-blue-300 font-medium text-sm mb-1">CSV Format</p>
                        <p className="text-blue-200/80 text-xs">
                          Include columns: Name, Email, Mobile/Phone, Category, Status, Notes
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <button
                      onClick={() => setShowBulkImportModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleBulkImport}
                      disabled={!csvFile || importing}
                      className="flex-1 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {importing ? 'Importing...' : 'Import'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
