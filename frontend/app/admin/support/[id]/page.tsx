'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Send,
  User,
  Mail,
  Clock,
  Tag,
  CheckCircle,
  Lock,
  MessageSquare,
} from 'lucide-react';
import TicketStatusBadge from '../../../components/admin/TicketStatusBadge';
import PriorityBadge from '../../../components/admin/PriorityBadge';
import MessageBubble from '../../../components/admin/MessageBubble';
import ResolveTicketModal from '../../../components/admin/ResolveTicketModal';
import { mockTicketDetail } from '../../../../lib/mockData/adminStats';

type TicketStatus = 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

export default function TicketDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [replyMessage, setReplyMessage] = useState('');
  const [isInternalNote, setIsInternalNote] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<TicketStatus>(mockTicketDetail.status);
  const [ticketPriority, setTicketPriority] = useState<Priority>(mockTicketDetail.priority);

  // In production, fetch ticket by params.id
  const ticket = mockTicketDetail;

  const handleSendReply = async () => {
    if (!replyMessage.trim()) return;

    setIsSending(true);
    
    // TODO: Call API to send reply
    console.log('Sending reply:', {
      ticketId: ticket.id,
      message: replyMessage,
      isInternalNote,
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Clear form
    setReplyMessage('');
    setIsInternalNote(false);
    setIsSending(false);

    // Update status to in_progress if it was open
    if (ticketStatus === 'open') {
      setTicketStatus('in_progress');
    }

    alert(isInternalNote ? 'Internal note added!' : 'Reply sent to user!');
  };

  const handleResolveTicket = async () => {
    // TODO: Call API to resolve ticket
    console.log('Resolving ticket:', ticket.id);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setTicketStatus('resolved');
    setShowResolveModal(false);
    alert('Ticket marked as resolved!');
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    // TODO: Call API to update status
    console.log('Updating status:', newStatus);
    setTicketStatus(newStatus);
  };

  const handlePriorityChange = (newPriority: Priority) => {
    // TODO: Call API to update priority
    console.log('Updating priority:', newPriority);
    setTicketPriority(newPriority);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'technical':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      case 'billing':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'event':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'account':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/support"
          className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-300" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-white">
            Ticket Details
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            {ticket.ticketNumber}
          </p>
        </div>
      </div>

      {/* SPLIT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LEFT COLUMN - Ticket Info (1/3 width) */}
        <div className="lg:col-span-1 space-y-4">
          
          {/* Status & Priority Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">
              Status & Priority
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-2">Status</label>
                <select
                  value={ticketStatus}
                  onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_response">Waiting for User</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">Priority</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => handlePriorityChange(e.target.value as Priority)}
                  className="w-full px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-700/50">
                <PriorityBadge priority={ticketPriority} size="md" />
              </div>
            </div>
          </div>

          {/* User Info Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                <User className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">
                User Information
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Name</p>
                <p className="text-white font-semibold">{ticket.userName}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Email</p>
                <a 
                  href={`mailto:${ticket.userEmail}`}
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 group"
                >
                  {ticket.userEmail}
                  <Mail className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">User ID</p>
                <p className="text-slate-300 font-mono text-xs">{ticket.userId}</p>
              </div>
            </div>
          </div>

          {/* Ticket Details Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-wide">
              Ticket Details
            </h3>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Category</p>
                <span className={`inline-flex px-3 py-1 rounded-lg border text-sm font-medium ${getCategoryColor(ticket.category)}`}>
                  {getCategoryLabel(ticket.category)}
                </span>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Created</p>
                <p className="text-white text-sm">{formatDate(ticket.createdAt)}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Last Updated</p>
                <p className="text-white text-sm">{formatDate(ticket.updatedAt)}</p>
              </div>

              {ticket.resolvedAt && (
                <div>
                  <p className="text-xs text-slate-400 mb-1">Resolved</p>
                  <p className="text-emerald-400 text-sm">{formatDate(ticket.resolvedAt)}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-slate-400 mb-1">Messages</p>
                <p className="text-white text-sm">{ticket.messagesCount} message{ticket.messagesCount !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Quick Action - Resolve Button */}
          {ticketStatus !== 'resolved' && ticketStatus !== 'closed' && (
            <button
              onClick={() => setShowResolveModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-emerald-500/30"
            >
              <CheckCircle className="w-5 h-5" />
              Mark as Resolved
            </button>
          )}
        </div>

        {/* RIGHT COLUMN - Conversation (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Subject Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Subject</h2>
            </div>
            <p className="text-slate-300 leading-relaxed">
              {ticket.subject}
            </p>
          </div>

          {/* Conversation Thread */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-400" />
              Conversation
            </h3>

            {/* Messages */}
            <div className="space-y-4 mb-6">
              {ticket.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  senderName={message.senderName}
                  senderRole={message.senderRole}
                  message={message.message}
                  timestamp={message.createdAt}
                  isInternalNote={message.isInternalNote}
                />
              ))}
            </div>

            {/* Reply Form */}
            {ticketStatus !== 'closed' && (
              <div className="pt-4 border-t border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-white">Reply</h4>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isInternalNote}
                      onChange={(e) => setIsInternalNote(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-600 bg-slate-700 text-amber-500 focus:ring-2 focus:ring-amber-500/20"
                    />
                    <span className="text-sm text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Internal Note
                    </span>
                  </label>
                </div>

                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder={isInternalNote ? "Add an internal note (only visible to admins)..." : "Type your reply to the user..."}
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none mb-3"
                />

                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    {isInternalNote 
                      ? '🔒 This note will only be visible to admins'
                      : '📧 User will receive an email notification'
                    }
                  </p>
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim() || isSending}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {isInternalNote ? 'Add Note' : 'Send Reply'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {ticketStatus === 'closed' && (
              <div className="pt-4 border-t border-slate-700/50">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700/50 text-center">
                  <p className="text-slate-400 text-sm">
                    This ticket is closed. Reopen it to continue the conversation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Resolve Modal */}
      {showResolveModal && (
        <ResolveTicketModal
          ticketNumber={ticket.ticketNumber}
          onConfirm={handleResolveTicket}
          onCancel={() => setShowResolveModal(false)}
        />
      )}
    </div>
  );
}