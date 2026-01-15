'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Clock,
  Tag,
  AlertTriangle,
  Ticket,
  FileText,
  BadgeCheck,
  ExternalLink,
  DollarSign,
} from 'lucide-react';
import EventStatusBadge from '../../../components/admin/EventStatusBadge';
import ApprovalModal from '../../../components/admin/ApprovalModal';
import RejectionModal from '../../../components/admin/RejectionModal';
import { mockEventDetail } from '../../../../lib/mockData/adminStats';

export default function EventReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const event = mockEventDetail;

  const handleApprove = async () => {
    console.log('Approving event:', event.id);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowApprovalModal(false);
    alert('Event approved successfully!');
    router.push('/admin/events/pending');
  };

  const handleReject = async (reason: string) => {
    console.log('Rejecting event:', event.id, 'Reason:', reason);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setShowRejectionModal(false);
    alert('Event rejected. Organizer has been notified.');
    router.push('/admin/events/pending');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalRevenue = event.ticketTiers.reduce((sum, tier) => sum + (tier.price * tier.quantity), 0);
  const totalTickets = event.ticketTiers.reduce((sum, tier) => sum + tier.quantity, 0);

  return (
    <div className="space-y-4 pb-8">
      {/* Compact Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events/pending"
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700 border border-slate-700/50 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Review Event
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Submitted {event.submittedAt && formatDateTime(event.submittedAt)}
            </p>
          </div>
        </div>
        <EventStatusBadge status={event.approvalStatus} size="sm" />
      </div>

      {/* Flagged Warning Banner */}
      {event.flaggedReasons && event.flaggedReasons.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/30 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-rose-400 mb-1">
                Auto-Flagged for Review
              </p>
              <div className="flex flex-wrap gap-1.5">
                {event.flaggedReasons.map((reason, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 bg-rose-500/20 border border-rose-500/30 rounded text-xs font-medium text-rose-300"
                  >
                    {reason.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPLIT VIEW LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* LEFT COLUMN - Images & Organizer (2/5 width on desktop) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Image Gallery */}
          {event.images && event.images.length > 0 && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
              {/* Main Image */}
              <div className="relative aspect-[4/3] bg-slate-950">
                <img
                  src={event.images[selectedImage]}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Navigation */}
              {event.images.length > 1 && (
                <div className="p-3 grid grid-cols-4 gap-2 bg-slate-950/50">
                  {event.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === index
                          ? 'border-indigo-500 ring-2 ring-indigo-500/30'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Organizer Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
                <User className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-white">Organizer</h3>
              {event.organizerVerified && (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 rounded">
                  <BadgeCheck className="w-3 h-3 text-emerald-400" />
                  <span className="text-xs font-semibold text-emerald-400">Verified</span>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-slate-400 mb-1">Name</p>
                <p className="text-white font-semibold">{event.organizerName}</p>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Email</p>
                <a 
                  href={`mailto:${event.organizerEmail}`}
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 group"
                >
                  {event.organizerEmail}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Phone</p>
                <a 
                  href={`tel:${event.organizerPhone}`}
                  className="text-indigo-400 hover:text-indigo-300 text-sm flex items-center gap-1 group"
                >
                  {event.organizerPhone}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </div>

              <div>
                <p className="text-xs text-slate-400 mb-1">Organizer ID</p>
                <p className="text-slate-300 font-mono text-xs">{event.organizerId}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wide">
              Revenue Potential
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Total Tickets</span>
                <span className="text-white font-bold">{totalTickets.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Ticket Tiers</span>
                <span className="text-white font-bold">{event.ticketTiers.length}</span>
              </div>
              <div className="pt-3 border-t border-slate-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">Max Revenue</span>
                  <span className="text-2xl font-bold text-emerald-400">
                    £{totalRevenue.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">if sold out</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Event Details (3/5 width on desktop) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Event Header */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-5 shadow-xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-xs font-semibold text-indigo-400">
                {event.category}
              </span>
              {event.ageRestriction && (
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-xs font-semibold text-amber-400">
                  {event.ageRestriction}
                </span>
              )}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              {event.title}
            </h2>
            
            <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
              {event.description}
            </p>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Date & Time</p>
                  <p className="text-white font-semibold text-sm">{formatDate(event.date)}</p>
                  <p className="text-slate-300 text-xs">{formatTime(event.date)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-rose-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Venue</p>
                  <p className="text-white font-semibold text-sm">{event.venue}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Refund Policy</p>
                  <p className="text-white font-semibold text-sm">{event.refundPolicy}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-4 shadow-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-slate-400 mb-0.5">Submitted</p>
                  <p className="text-white font-semibold text-sm">
                    {event.submittedAt && formatDateTime(event.submittedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Tiers Table */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-700/50 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-bold text-white">Ticket Tiers</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Tier Name
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-wide">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {event.ticketTiers.map((tier, index) => (
                    <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-white">
                        {tier.name}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-indigo-400 text-right">
                        £{tier.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300 text-right">
                        {tier.quantity.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-emerald-400 text-right">
                        £{(tier.price * tier.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-800/50 border-t border-slate-700/50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-white">
                      Total
                    </td>
                    <td className="px-4 py-3"></td>
                    <td className="px-4 py-3 text-sm font-bold text-white text-right">
                      {totalTickets.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-lg font-bold text-emerald-400 text-right">
                      £{totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="sticky bottom-4 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 p-4 shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowRejectionModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20 border border-rose-500/30 hover:border-rose-500/50 text-rose-400 rounded-lg font-semibold transition-all"
              >
                <XCircle className="w-5 h-5" />
                Reject Event
              </button>
              
              <button
                onClick={() => setShowApprovalModal(true)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"
              >
                <CheckCircle className="w-5 h-5" />
                Approve Event
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApprovalModal && (
        <ApprovalModal
          eventTitle={event.title}
          onConfirm={handleApprove}
          onCancel={() => setShowApprovalModal(false)}
        />
      )}

      {showRejectionModal && (
        <RejectionModal
          eventTitle={event.title}
          onConfirm={handleReject}
          onCancel={() => setShowRejectionModal(false)}
        />
      )}
    </div>
  );
}