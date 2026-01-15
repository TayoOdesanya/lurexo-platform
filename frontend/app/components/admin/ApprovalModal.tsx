'use client';

import { useState } from 'react';
import { X, CheckCircle, Loader } from 'lucide-react';

interface ApprovalModalProps {
  eventTitle: string;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export default function ApprovalModal({ eventTitle, onConfirm, onCancel }: ApprovalModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
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
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700/50 shadow-2xl max-w-md w-full p-6">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-2xl border border-emerald-500/20">
            <CheckCircle className="w-12 h-12 text-emerald-400" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2">
            Approve Event?
          </h3>
          <p className="text-slate-400 mb-4">
            You're about to approve:
          </p>
          <p className="text-lg font-semibold text-indigo-400 px-4 py-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            "{eventTitle}"
          </p>
          <p className="text-sm text-slate-400 mt-4">
            Once approved, the event will be published and visible to users. The organizer will be notified via email.
          </p>
        </div>

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
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Approve Event
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}