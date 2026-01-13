'use client';

import { RefreshCw, Check, AlertCircle } from 'lucide-react';

interface SyncStatusProps {
  unsyncedCount: number;
  isSyncing: boolean;
  isOnline: boolean;
  onSync: () => void;
}

export function SyncStatus({
  unsyncedCount,
  isSyncing,
  isOnline,
  onSync,
}: SyncStatusProps) {
  if (unsyncedCount === 0 && !isSyncing) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 text-green-500 text-sm font-medium">
        <Check className="w-4 h-4" />
        <span>All synced</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
          isOnline
            ? 'bg-blue-500/10 text-blue-500'
            : 'bg-amber-500/10 text-amber-500'
        }`}
      >
        <AlertCircle className="w-4 h-4" />
        <span>{unsyncedCount} pending</span>
      </div>

      {isOnline && (
        <button
          onClick={onSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
        >
          <RefreshCw
            className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`}
          />
          <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
        </button>
      )}
    </div>
  );
}