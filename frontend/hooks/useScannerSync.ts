'use client';

import { useState, useEffect, useCallback } from 'react';
import { getUnsyncedScans, markScansAsSynced } from '@/lib/scanner-db';
import { useNetworkStatus } from './useNetworkStatus';
import toast from 'react-hot-toast';

export function useScannerSync(eventId: string) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);
  const isOnline = useNetworkStatus();

  // Check unsynced count
  const checkUnsyncedCount = useCallback(async () => {
    const unsynced = await getUnsyncedScans();
    const eventScans = unsynced.filter((s) => s.eventId === eventId);
    setUnsyncedCount(eventScans.length);
  }, [eventId]);

  // Sync function
  const syncScans = useCallback(async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);

    try {
      const unsynced = await getUnsyncedScans();
      const eventScans = unsynced.filter((s) => s.eventId === eventId);

      if (eventScans.length === 0) {
        setIsSyncing(false);
        return;
      }

      // Batch sync to backend
      const response = await fetch(`/api/events/${eventId}/check-ins/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkIns: eventScans.map((scan) => ({
            ticketId: scan.ticketId,
            scannedAt: scan.scannedAt,
            scannerId: scan.scannerId,
            valid: scan.valid,
            reason: scan.reason,
          })),
        }),
      });

      if (response.ok) {
        // Mark as synced
        const scanIds = eventScans.map((s) => s.id!).filter(Boolean);
        await markScansAsSynced(scanIds);
        
        await checkUnsyncedCount();
        
        toast.success(`Synced ${eventScans.length} scans`);
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync scans. Will retry automatically.');
    } finally {
      setIsSyncing(false);
    }
  }, [eventId, isOnline, isSyncing, checkUnsyncedCount]);

  // Auto-sync every 30 seconds when online
  useEffect(() => {
    if (!isOnline) return;

    const interval = setInterval(() => {
      syncScans();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isOnline, syncScans]);

  // Check unsynced count on mount and when coming online
  useEffect(() => {
    checkUnsyncedCount();
  }, [checkUnsyncedCount, isOnline]);

  return {
    syncScans,
    isSyncing,
    unsyncedCount,
    isOnline,
  };
}