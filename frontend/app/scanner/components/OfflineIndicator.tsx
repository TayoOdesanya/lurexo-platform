'use client';

import { WifiOff, Wifi } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export function OfflineIndicator({ isOnline }: OfflineIndicatorProps) {
  return (
    <div
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
        isOnline
          ? 'bg-green-500/10 text-green-500'
          : 'bg-amber-500/10 text-amber-500'
      }`}
    >
      {isOnline ? (
        <>
          <Wifi className="w-4 h-4" />
          <span>Online</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode</span>
        </>
      )}
    </div>
  );
}