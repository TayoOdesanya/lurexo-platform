'use client';

import { User, Shield } from 'lucide-react';

interface MessageBubbleProps {
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  timestamp: string;
  isInternalNote?: boolean;
}

export default function MessageBubble({
  senderName,
  senderRole,
  message,
  timestamp,
  isInternalNote = false,
}: MessageBubbleProps) {
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isAdmin = senderRole === 'admin';

  return (
    <div className={`flex gap-3 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
        isAdmin
          ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
          : 'bg-gradient-to-br from-slate-700 to-slate-600'
      }`}>
        {isAdmin ? (
          <Shield className="w-5 h-5 text-white" />
        ) : (
          <User className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Header */}
        <div className={`flex items-center gap-2 mb-1 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
          <p className="text-sm font-semibold text-white">
            {senderName}
          </p>
          {isAdmin && (
            <span className="px-2 py-0.5 bg-indigo-500/20 border border-indigo-500/30 rounded text-xs font-medium text-indigo-400">
              Admin
            </span>
          )}
          {isInternalNote && (
            <span className="px-2 py-0.5 bg-amber-500/20 border border-amber-500/30 rounded text-xs font-medium text-amber-400">
              Internal Note
            </span>
          )}
        </div>

        {/* Message Bubble */}
        <div className={`px-4 py-3 rounded-2xl ${
          isInternalNote
            ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30'
            : isAdmin
            ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30'
            : 'bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50'
        }`}>
          <p className="text-sm text-slate-100 leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        {/* Timestamp */}
        <p className={`text-xs text-slate-500 mt-1 ${isAdmin ? 'text-right' : 'text-left'}`}>
          {formatTime(timestamp)}
        </p>
      </div>
    </div>
  );
}