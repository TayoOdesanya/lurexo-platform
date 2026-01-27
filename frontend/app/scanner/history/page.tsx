'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  History as HistoryIcon,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Calendar,
  Clock,
} from 'lucide-react';
import { getScanHistory, getEventMetadata } from '@/lib/scanner-db';

interface Scan {
  id?: number;
  ticketId: string;
  eventId: string;
  scannedAt: string;
  scannerId: string;
  synced: boolean;
  valid: boolean;
  reason?: string;
}

export default function ScanHistoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId');

  const [scans, setScans] = useState<Scan[]>([]);
  const [eventData, setEventData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid' | 'unsynced'>('all');

  useEffect(() => {
    loadHistory();
  }, [eventId]);

  const loadHistory = async () => {
    try {
      if (eventId) {
        const history = await getScanHistory(eventId, 100);
        setScans(history);

        const event = await getEventMetadata(eventId);
        if (event) {
          setEventData(event);
        }
      }
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter scans
  const filteredScans = scans.filter((scan) => {
    if (filter === 'all') return true;
    if (filter === 'valid') return scan.valid;
    if (filter === 'invalid') return !scan.valid;
    if (filter === 'unsynced') return !scan.synced;
    return true;
  });

  // Group scans by date
  const groupedScans = filteredScans.reduce((groups, scan) => {
    const date = new Date(scan.scannedAt).toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(scan);
    return groups;
  }, {} as Record<string, Scan[]>);

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Ticket ID', 'Status', 'Scanned At', 'Synced', 'Reason'];
    const rows = filteredScans.map((scan) => [
      scan.ticketId,
      scan.valid ? 'Valid' : 'Invalid',
      new Date(scan.scannedAt).toLocaleString(),
      scan.synced ? 'Yes' : 'No',
      scan.reason || '',
    ]);

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scan-history-${eventId}-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading scan history...</p>
        </div>
      </div>
    );
  }

  const stats = {
    total: scans.length,
    valid: scans.filter((s) => s.valid).length,
    invalid: scans.filter((s) => s.valid === false).length,
    unsynced: scans.filter((s) => !s.synced).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() =>
                eventId
                  ? router.push(`/scanner/${eventId}`)
                  : router.push('/scanner')
              }
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {eventData && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HistoryIcon className="w-5 h-5 text-purple-400" />
                <h1 className="text-2xl font-bold">Scan History</h1>
              </div>
              <p className="text-gray-400 text-sm">{eventData.eventName}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="text-2xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm text-gray-400">Total Scans</div>
          </div>

          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {stats.valid}
            </div>
            <div className="text-sm text-gray-400">Valid</div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-red-400 mb-1">
              {stats.invalid}
            </div>
            <div className="text-sm text-gray-400">Invalid</div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
            <div className="text-2xl font-bold text-amber-400 mb-1">
              {stats.unsynced}
            </div>
            <div className="text-sm text-gray-400">Unsynced</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('valid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'valid'
                ? 'bg-green-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Valid ({stats.valid})
          </button>
          <button
            onClick={() => setFilter('invalid')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'invalid'
                ? 'bg-red-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Invalid ({stats.invalid})
          </button>
          <button
            onClick={() => setFilter('unsynced')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'unsynced'
                ? 'bg-amber-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Unsynced ({stats.unsynced})
          </button>
        </div>

        {/* Scan History List */}
        {filteredScans.length === 0 ? (
          <div className="text-center py-16">
            <HistoryIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Scans Yet</h3>
            <p className="text-gray-400">
              {filter === 'all'
                ? 'Start scanning tickets to see history here'
                : `No ${filter} scans found`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedScans).map(([date, dateScans]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-gray-300">{date}</h3>
                  <div className="flex-1 h-px bg-white/10" />
                  <span className="text-xs text-gray-400">{dateScans.length} scans</span>
                </div>

                {/* Scans for this date */}
                <div className="space-y-2">
                  {dateScans.map((scan, index) => (
                    <div
                      key={scan.id || index}
                      className={`p-4 rounded-xl border transition-colors ${
                        scan.valid
                          ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10'
                          : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          {/* Status Icon */}
                          {scan.valid ? (
                            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          ) : scan.reason === 'already_checked_in' ? (
                            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          )}

                          {/* Scan Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-mono text-sm font-semibold">
                                {scan.ticketId}
                              </span>
                              {!scan.synced && (
                                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">
                                  Pending Sync
                                </span>
                              )}
                            </div>
                            <div className="text-sm text-gray-400">
                              {scan.valid ? (
                                <span>Valid scan</span>
                              ) : (
                                <span>
                                  {scan.reason === 'already_checked_in'
                                    ? 'Already checked in'
                                    : scan.reason === 'not_found'
                                    ? 'Ticket not found'
                                    : 'Invalid scan'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Time */}
                        <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          <span>
                            {new Date(scan.scannedAt).toLocaleTimeString('en-GB', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}