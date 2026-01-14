'use client';

import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';

interface ScanResultProps {
  result: {
    valid: boolean;
    message: string;
    holderName?: string;
    ticketTier?: string;
    reason?: string;
  } | null;
  onDismiss: () => void;
}

export function ScanResult({ result, onDismiss }: ScanResultProps) {
  // Auto-dismiss after 3 seconds
  useEffect(() => {
    if (result) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [result, onDismiss]);

  if (!result) return null;

  const { valid, message, holderName, ticketTier, reason } = result;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${
        valid ? 'bg-green-500/20' : 'bg-red-500/20'
      } backdrop-blur-sm animate-in fade-in duration-200`}
      onClick={onDismiss}
    >
      <div
        className={`w-full max-w-md rounded-2xl p-8 shadow-2xl ${
          valid
            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
            : reason === 'already_checked_in'
            ? 'bg-gradient-to-br from-amber-500 to-orange-600'
            : 'bg-gradient-to-br from-red-500 to-rose-600'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col items-center text-center text-white">
          {/* Icon */}
          <div className="mb-6">
            {valid ? (
              <CheckCircle className="w-24 h-24" strokeWidth={2} />
            ) : reason === 'already_checked_in' ? (
              <AlertTriangle className="w-24 h-24" strokeWidth={2} />
            ) : (
              <XCircle className="w-24 h-24" strokeWidth={2} />
            )}
          </div>

          {/* Message */}
          <h2 className="text-3xl font-bold mb-2">{message}</h2>

          {/* Details */}
          {holderName && (
            <p className="text-xl font-medium opacity-90 mb-1">{holderName}</p>
          )}
          {ticketTier && (
            <p className="text-lg opacity-75">{ticketTier}</p>
          )}

          {/* Reason for invalid scan */}
          {!valid && reason && (
            <p className="mt-4 text-sm opacity-90 px-4 py-2 bg-white/20 rounded-lg">
              {reason === 'already_checked_in'
                ? 'This ticket was already scanned'
                : reason === 'not_found'
                ? 'Ticket not found in system'
                : reason === 'invalid_qr'
                ? 'Invalid QR code format'
                : 'Please contact support'}
            </p>
          )}

          {/* Dismiss hint */}
          <p className="mt-6 text-sm opacity-75">Tap anywhere to continue</p>
        </div>
      </div>
    </div>
  );
}