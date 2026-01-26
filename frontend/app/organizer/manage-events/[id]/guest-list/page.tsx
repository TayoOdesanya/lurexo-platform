'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiBase';

const API_BASE_URL = getApiBaseUrl();

function getAccessTokenClient(): string | null {
  try {
    return localStorage.getItem('authToken') ?? localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

type GuestListEntry = {
  id: string;
  eventId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
  status: 'INVITED' | 'CHECKED_IN' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
};

type GuestFormState = {
  name: string;
  email: string;
  phone: string;
  notes: string;
  status: GuestListEntry['status'];
};

const emptyForm: GuestFormState = {
  name: '',
  email: '',
  phone: '',
  notes: '',
  status: 'INVITED',
};

export default function GuestListPage() {
  const params = useParams<{ id: string }>();
  const eventId = params?.id;

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [entries, setEntries] = useState<GuestListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<GuestFormState>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string>('');

  useEffect(() => {
    const token = getAccessTokenClient();
    setAccessToken(token);
  }, []);

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

  const normalizeStatus = (value: string) => {
    const v = String(value ?? '').trim().toUpperCase();
    if (v === 'CHECKED_IN' || v === 'CHECKED IN') return 'CHECKED_IN';
    if (v === 'CANCELLED' || v === 'CANCELED') return 'CANCELLED';
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
          phone: get('phone'),
          notes: get('notes'),
          status: get('status'),
        };
      }
      return {
        name: cols[0] ?? '',
        email: cols[1] ?? '',
        phone: cols[2] ?? '',
        notes: cols[3] ?? '',
        status: cols[4] ?? '',
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !eventId) return;

    try {
      setSaving(true);
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

      await loadEntries(accessToken, eventId);
      resetForm();
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save guest');
    } finally {
      setSaving(false);
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
    });
  };

  const handleDelete = async (entryId: string) => {
    if (!accessToken || !eventId) return;
    const ok = confirm('Delete this guest?');
    if (!ok) return;

    try {
      setSaving(true);
      setError(null);

      const res = await fetch(`${API_BASE_URL}/events/${eventId}/guest-list/${entryId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => '');
        throw new Error(txt || 'Failed to delete guest');
      }

      await loadEntries(accessToken, eventId);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete guest');
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = () => {
    const header = ['name', 'email', 'phone', 'notes', 'status'];
    const lines = [
      header.join(','),
      ...entries.map((entry) => {
        const row = [
          entry.name ?? '',
          entry.email ?? '',
          entry.phone ?? '',
          entry.notes ?? '',
          entry.status ?? '',
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

  const handleImportCsv = async (file: File) => {
    if (!accessToken || !eventId) return;
    try {
      setImporting(true);
      setError(null);

      const text = await file.text();
      const rows = parseCsv(text);
      if (!rows.length) {
        setError('No rows found in CSV.');
        return;
      }

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
      }

      await loadEntries(accessToken, eventId);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to import CSV');
    } finally {
      setImporting(false);
    }
  };

  const statusOptions = useMemo(
    () => [
      { value: 'INVITED', label: 'Invited' },
      { value: 'CHECKED_IN', label: 'Checked In' },
      { value: 'CANCELLED', label: 'Cancelled' },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Link
                href="/organizer/manage-events"
                className="text-gray-400 hover:text-white text-sm flex items-center gap-2 mb-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Manage Events
              </Link>
              <h1 className="text-white font-bold text-2xl sm:text-3xl">Guest List</h1>
              {eventName && (
                <p className="text-gray-400 text-sm">Event: {eventName}</p>
              )}
              <p className="text-gray-400 text-sm">
                {entries.length} {entries.length === 1 ? 'guest' : 'guests'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="guest-list-import"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleImportCsv(file);
                  e.currentTarget.value = '';
                }}
              />
              <label
                htmlFor="guest-list-import"
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {importing ? 'Importing...' : 'Import CSV'}
              </label>
              <button
                onClick={handleExportCsv}
                className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 mb-6">
          <h2 className="text-white font-semibold text-lg mb-4">
            {editingId ? 'Edit Guest' : 'Add Guest'}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Phone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value as GuestFormState['status'] }))}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-400 text-sm mb-2">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none"
                rows={3}
              />
            </div>

            <div className="md:col-span-2 flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-60"
              >
                {editingId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {editingId ? 'Save Changes' : 'Add Guest'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-800">
            <h2 className="text-white font-semibold text-lg">Guests</h2>
          </div>

          {loading ? (
            <div className="p-6 text-gray-400">Loading guest list...</div>
          ) : entries.length === 0 ? (
            <div className="p-6 text-gray-400">No guests yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-xs text-gray-400 border-b border-gray-800">
                  <tr>
                    <th className="px-4 sm:px-6 py-3">Name</th>
                    <th className="px-4 sm:px-6 py-3">Email</th>
                    <th className="px-4 sm:px-6 py-3">Phone</th>
                    <th className="px-4 sm:px-6 py-3">Status</th>
                    <th className="px-4 sm:px-6 py-3">Notes</th>
                    <th className="px-4 sm:px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-300">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-gray-800">
                      <td className="px-4 sm:px-6 py-4">{entry.name}</td>
                      <td className="px-4 sm:px-6 py-4">{entry.email ?? '-'}</td>
                      <td className="px-4 sm:px-6 py-4">{entry.phone ?? '-'}</td>
                      <td className="px-4 sm:px-6 py-4">{entry.status}</td>
                      <td className="px-4 sm:px-6 py-4">{entry.notes ?? '-'}</td>
                      <td className="px-4 sm:px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(entry)}
                            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-md text-xs"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-md text-xs flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
