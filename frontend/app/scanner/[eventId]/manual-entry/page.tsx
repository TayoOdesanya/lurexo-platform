'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Keyboard,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';
import { getTicketFromDB, recordScan, updateTicketCheckIn, getEventMetadata, updateCheckedInCount } from '@/lib/scanner-db';
import { useScannerSync } from '@/hooks/useScannerSync';
import { OfflineIndicator } from '../../components/OfflineIndicator';
import { SyncStatus } from '../../components/SyncStatus';
import toast from 'react-hot-toast';

export default function ManualEntryPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.eventId as string;

  const [ticketCode, setTicketCode] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [eventData, setEventData] = useState<any>(null);
  const [recentCheckins, setRecentCheckins] = useState<any[]>([]);
  const [scannerId] = useState(() => `scanner_${Date.now()}`);

  const { syncScans, isSyncing, unsyncedCount, isOnline } = useScannerSync(eventId);

  useEffect(() => {
    loadEventData();
  }, [eventId]);

  const loadEventData = async () => {
    const event = await getEventMetadata(eventId);
    if (event) {
      setEventData(event);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketCode.trim()) {
      toast.error('Please enter a ticket code');
      return;
    }

    setIsProcessing(true);

    try {
      // Clean up the ticket code (remove spaces, convert to uppercase)
      const cleanCode = ticketCode.trim().toUpperCase().replace(/\s/g, '');

      // Try to find ticket locally
      const ticket = await getTicketFromDB(cleanCode);

      if (!ticket) {
        // Ticket not found
        toast.error('Ticket not found in system');
        await recordScan({
          ticketId: cleanCode,
          eventId,
          scannerId,
          valid: false,
          reason: 'not_found',
        });
        
        setRecentCheckins((prev) => [
          {
            ticketId: cleanCode,
            status: 'invalid',
            reason: 'Not found',
            timestamp: new Date().toISOString(),
          },
          ...prev.slice(0, 4),
        ]);
        
        setTicketCode('');
        setIsProcessing(false);
        return;
      }

      if (ticket.isCheckedIn) {
        // Already checked in
        toast.error('Ticket already checked in');
        await recordScan({
          ticketId: cleanCode,
          eventId,
          scannerId,
          valid: false,
          reason: 'already_checked_in',
        });
        
        setRecentCheckins((prev) => [
          {
            ticketId: cleanCode,
            holderName: ticket.holderName,
            status: 'duplicate',
            reason: 'Already checked in',
            timestamp: new Date().toISOString(),
          },
          ...prev.slice(0, 4),
        ]);
        
        setTicketCode('');
        setIsProcessing(false);
        return;
      }

      // Valid ticket - check in
      await updateTicketCheckIn(cleanCode, true);
      await recordScan({
        ticketId: cleanCode,
        eventId,
        scannerId,
        valid: true,
      });

      // Update checked-in count
      if (eventData) {
        const newCount = eventData.checkedInCount + 1;
        setEventData({ ...eventData, checkedInCount: newCount });
        await updateCheckedInCount(eventId, newCount);
      }

      toast.success(`✓ ${ticket.holderName} checked in successfully`);
      
      setRecentCheckins((prev) => [
        {
          ticketId: cleanCode,
          holderName: ticket.holderName,
          ticketTier: ticket.ticketTier,
          status: 'valid',
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 4),
      ]);

      setTicketCode('');
    } catch (error) {
      console.error('Manual entry error:', error);
      toast.error('Failed to process ticket');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push(`/scanner/${eventId}`)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Scanner</span>
            </button>

            <div className="flex items-center gap-3">
              <OfflineIndicator isOnline={isOnline} />
              <SyncStatus
                unsyncedCount={unsyncedCount}
                isSyncing={isSyncing}
                isOnline={isOnline}
                onSync={syncScans}
              />
            </div>
          </div>

          {eventData && (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Keyboard className="w-5 h-5 text-purple-400" />
                <h1 className="text-2xl font-bold">Manual Entry</h1>
              </div>
              <p className="text-gray-400 text-sm">{eventData.eventName}</p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Manual Entry Form */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="ticketCode" className="block text-sm font-medium mb-2">
                Ticket Code
              </label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  id="ticketCode"
                  value={ticketCode}
                  onChange={(e) => setTicketCode(e.target.value)}
                  placeholder="Enter ticket code (e.g., TKT-123456)"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-lg font-mono"
                  autoFocus
                  disabled={isProcessing}
                />
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Enter the ticket code exactly as it appears on the ticket
              </p>
            </div>

            <button
              type="submit"
              disabled={!ticketCode.trim() || isProcessing}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Verify & Check In</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Recent Check-ins */}
        {recentCheckins.length > 0 && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Check-ins</h3>
            <div className="space-y-3">
              {recentCheckins.map((checkin, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border ${
                    checkin.status === 'valid'
                      ? 'bg-green-500/10 border-green-500/30'
                      : checkin.status === 'duplicate'
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-red-500/10 border-red-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {checkin.status === 'valid' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : checkin.status === 'duplicate' ? (
                          <AlertCircle className="w-5 h-5 text-amber-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className="font-semibold">
                          {checkin.holderName || 'Unknown'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        <div>Code: {checkin.ticketId}</div>
                        {checkin.ticketTier && <div>Tier: {checkin.ticketTier}</div>}
                        {checkin.reason && (
                          <div className="text-xs mt-1">{checkin.reason}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(checkin.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
          <h3 className="font-semibold mb-3">Manual Entry Tips</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>
                Use manual entry when QR codes are damaged or unreadable
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Enter the code exactly as shown on the ticket</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Spaces and letter case are automatically handled</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">•</span>
              <span>Works offline - entries sync when connection returns</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}