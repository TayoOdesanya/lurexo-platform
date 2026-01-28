'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit, Eye, Heart, Share2, Zap } from 'lucide-react';
import EventDetailContent from '@/components/EventDetailContent';
import { getApiBaseUrl } from '@/lib/apiBase';

const API_BASE_URL = getApiBaseUrl();

export default function EventPreviewPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();

  const [busy, setBusy] = useState<'saving' | 'publishing' | 'deleting' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const editHref = useMemo(
    () => (id ? `/organizer/create-event?eventId=${encodeURIComponent(id)}` : '/organizer/create-event'),
    [id],
  );

  async function saveDraft() {
    if (!id) return;
    try {
      setBusy('saving');
      setError(null);

      const res = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'DRAFT' }),
      });
      if (!res.ok) throw new Error('Failed to save draft');
    } catch (e: any) {
      setError(e?.message ?? 'Failed to save');
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    if (!id) return;
    try {
      setBusy('publishing');
      setError(null);

      let res = await fetch(`${API_BASE_URL}/events/${id}/publish`, { method: 'POST' });
      if (!res.ok) {
        res = await fetch(`${API_BASE_URL}/events/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'PUBLISHED' }),
        });
      }

      if (!res.ok) throw new Error('Failed to publish');

      router.push('/organizer/dashboard');
    } catch (e: any) {
      setError(e?.message ?? 'Failed to publish');
    } finally {
      setBusy(null);
    }
  }

  async function remove() {
    if (!id) return;
    const ok = window.confirm('Delete this event? This cannot be undone.');
    if (!ok) return;

    try {
      setBusy('deleting');
      setError(null);

      const res = await fetch(`${API_BASE_URL}/events/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');

      router.push('/organizer/dashboard');
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -my-8">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5" />
              <div>
                <p className="font-bold text-sm">Preview Mode</p>
                <p className="text-xs opacity-90">This is how buyers will see your event</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link href={editHref}>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors">
                  <Edit className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit Event</span>
                </button>
              </Link>

              <button
                onClick={saveDraft}
                disabled={busy === 'saving'}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
              >
                <span>{busy === 'saving' ? 'Saving...' : 'Save'}</span>
              </button>

              <button
                onClick={publish}
                disabled={busy === 'publishing'}
                className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
              >
                <Zap className="w-4 h-4" />
                <span>{busy === 'publishing' ? 'Publishing...' : 'Publish'}</span>
              </button>

              <button
                onClick={remove}
                disabled={busy === 'deleting'}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition-colors disabled:opacity-60"
              >
                <span>{busy === 'deleting' ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-300 text-sm">
              {error}
            </div>
          </div>
        )}

        <nav className="bg-gray-900 border-b border-gray-800 sticky top-[52px] z-40 backdrop-blur-lg bg-opacity-95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href={editHref} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Edit</span>
              </Link>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-white font-bold text-xl hidden sm:inline">Lurexo</span>
              </div>

              <div className="flex items-center gap-2">
                <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </nav>

        <EventDetailContent />
      </div>
    </div>
  );
}
