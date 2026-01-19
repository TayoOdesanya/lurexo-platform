'use client';

import { useState } from 'react';
import { X, XCircle, Loader } from 'lucide-react';

interface RejectVerificationModalProps {
  organizerName: string;
  onConfirm: (reason: string) => void | Promise<void>;
  onCancel: () => void;
}

export default function RejectVerificationModal({ 
  organizerName, 
  onConfirm, 
  onCancel 
}: RejectVerificationModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedReason, setSelectedReason] = useState('');

  const commonReasons = [
    'Incomplete documentation',
    'Invalid business registration',
    'Tax ID verification failed',
    'Suspicious business activity',
    'Insufficient proof of legitimacy',
    'Previous terms violation',
    'Other (specify below)',
  ];

  const handleConfirm = async () => {
    const finalReason = selectedReason === 'Other (specify below)' ? reason : selectedReason;
    
    if (!finalReason.trim()) {
      alert('Please provide a rejection reason');
      return;
    }

    setIsLoading(true);
    try {
      await onConfirm(finalReason);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-rose-500/10 to-pink-500/10 rounded-2xl border border-rose-500/20">
            <XCircle className="w-12 h-12 text-rose-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Reject Verification?
          </h3>
          <p className="text-slate-400 mb-4">
            You're about to reject:
          </p>
          <p className="text-lg font-semibold text-rose-400 px-4 py-2 bg-rose-500/10 rounded-lg border border-rose-500/20">
            {organizerName}
          </p>
        </div>

        {/* Reason Selection */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-white mb-3">
            Select rejection reason:
          </label>
          <div className="space-y-2">
            {commonReasons.map((reasonOption) => (
              <label
                key={reasonOption}
                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedReason === reasonOption
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
                }`}
              >
                <input
                  type="radio"
                  name="reason"
                  value={reasonOption}
                  checked={selectedReason === reasonOption}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-rose-500"
                />
                <span className="text-sm font-medium">{reasonOption}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Additional Details */}
        {selectedReason && (
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Additional details {selectedReason === 'Other (specify below)' && '(required)'}:
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide more context about why verification is being rejected..."
              rows={4}
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-2">
              This message will be sent to the organizer
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading || !selectedReason}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-rose-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5" />
                Reject Verification
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}