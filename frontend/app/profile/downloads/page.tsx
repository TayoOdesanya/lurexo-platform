'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Download,
  FileText,
  Mail,
  Smartphone,
  Apple,
  Check,
  Calendar,
  MapPin,
  Ticket,
  Loader,
  CheckCircle,
  Share2,
  Image as ImageIcon
} from 'lucide-react';

// Mock tickets for download
const MOCK_DOWNLOADABLE_TICKETS = [
  {
    id: 'ticket-001',
    orderId: 'LRX-2024-1234',
    event: {
      id: 'event-1',
      title: 'Summer Music Festival 2025',
      date: '2025-08-15T19:00:00Z',
      venue: 'Hyde Park, London',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
    },
    ticketType: 'General Admission',
    ticketNumber: 1,
    totalTickets: 2,
    status: 'active'
  },
  {
    id: 'ticket-002',
    orderId: 'LRX-2024-1234',
    event: {
      id: 'event-1',
      title: 'Summer Music Festival 2025',
      date: '2025-08-15T19:00:00Z',
      venue: 'Hyde Park, London',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800'
    },
    ticketType: 'General Admission',
    ticketNumber: 2,
    totalTickets: 2,
    status: 'active'
  },
  {
    id: 'ticket-004',
    orderId: 'LRX-2024-9999',
    event: {
      id: 'event-4',
      title: 'Jazz Night at Ronnie Scotts',
      date: '2025-11-20T21:00:00Z',
      venue: 'Ronnie Scott\'s Jazz Club, Soho',
      imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'
    },
    ticketType: 'VIP Table',
    ticketNumber: 1,
    totalTickets: 1,
    status: 'active'
  }
];

export default function DownloadTicketsPage() {
  const [tickets, setTickets] = useState(MOCK_DOWNLOADABLE_TICKETS);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const [downloadComplete, setDownloadComplete] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTickets(prev =>
      prev.includes(ticketId)
        ? prev.filter(id => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const handleSelectAll = () => {
    if (selectedTickets.length === tickets.length) {
      setSelectedTickets([]);
    } else {
      setSelectedTickets(tickets.map(t => t.id));
    }
  };

  const handleDownload = async (format) => {
    if (selectedTickets.length === 0) {
      alert('Please select at least one ticket');
      return;
    }

    setDownloading(format);

    // TODO: Implement actual download logic
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setDownloading(null);
    setDownloadComplete(format);
    
    // Reset after 3 seconds
    setTimeout(() => {
      setDownloadComplete(null);
      setSelectedTickets([]);
    }, 3000);
  };

  const selectedCount = selectedTickets.length;
  const allSelected = selectedTickets.length === tickets.length;

  return (
  <div className="min-h-screen bg-black pb-6">
    {/* MOBILE ONLY: Header with back button */}
    <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </Link>
          <div>
            <h1 className="text-white text-xl font-bold">Download Tickets</h1>
            <p className="text-gray-400 text-xs">{tickets.length} available tickets</p>
          </div>
        </div>
        <button
          onClick={handleSelectAll}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-750 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {allSelected ? 'Deselect All' : 'Select All'}
        </button>
      </div>

      {/* Selection Count - Mobile */}
      {selectedCount > 0 && (
        <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
            <span className="text-purple-400 font-medium text-sm">
              {selectedCount} ticket{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>
          <button
            onClick={() => setSelectedTickets([])}
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            Clear
          </button>
        </div>
      )}
    </div>

    {/* DESKTOP ONLY: Page header with action button */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 pt-8 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl font-bold">Download Tickets</h1>
            <p className="text-gray-400 text-sm">{tickets.length} available tickets</p>
          </div>
          <button
            onClick={handleSelectAll}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            {allSelected ? 'Deselect All' : 'Select All'}
          </button>
        </div>

        {/* Selection Count - Desktop */}
        {selectedCount > 0 && (
          <div className="bg-purple-500/20 border border-purple-500/30 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              <span className="text-purple-400 font-medium text-sm">
                {selectedCount} ticket{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <button
              onClick={() => setSelectedTickets([])}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium"
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>

      <div className="p-4 space-y-4">
        {/* Tickets List */}
        <div className="space-y-3">
          {tickets.map((ticket) => {
            const isSelected = selectedTickets.includes(ticket.id);

            return (
              <button
                key={ticket.id}
                onClick={() => handleSelectTicket(ticket.id)}
                className={`w-full bg-gray-900 rounded-2xl p-4 border-2 transition-all ${
                  isSelected
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-gray-800 hover:border-gray-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Selection Checkbox */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-600'
                  }`}>
                    {isSelected && <Check className="w-4 h-4 text-white" />}
                  </div>

                  {/* Event Image */}
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src={ticket.event.imageUrl}
                      alt={ticket.event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Ticket Info */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">
                      {ticket.event.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-400 text-xs mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{formatDate(ticket.event.date)} • {formatTime(ticket.event.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-400 text-xs mb-2">
                      <MapPin className="w-3 h-3 mr-1" />
                      <span className="truncate">{ticket.event.venue}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs">
                        {ticket.ticketType}
                      </span>
                      <span className="text-gray-500 text-xs">
                        Ticket {ticket.ticketNumber} of {ticket.totalTickets}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Download Options */}
        {selectedCount > 0 && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-3">
            <h2 className="text-white font-semibold mb-4">Download Options</h2>

            {/* PDF */}
            <button
              onClick={() => handleDownload('pdf')}
              disabled={downloading !== null}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 disabled:bg-gray-800 disabled:opacity-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-red-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">Download as PDF</p>
                  <p className="text-gray-400 text-xs">Printable ticket with QR code</p>
                </div>
              </div>
              {downloading === 'pdf' ? (
                <Loader className="w-5 h-5 text-purple-500 animate-spin" />
              ) : downloadComplete === 'pdf' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Download className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Apple Wallet */}
            <button
              onClick={() => handleDownload('wallet')}
              disabled={downloading !== null}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 disabled:bg-gray-800 disabled:opacity-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
                  <Apple className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">Add to Apple Wallet</p>
                  <p className="text-gray-400 text-xs">Save to Apple Wallet on iPhone</p>
                </div>
              </div>
              {downloading === 'wallet' ? (
                <Loader className="w-5 h-5 text-purple-500 animate-spin" />
              ) : downloadComplete === 'wallet' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Download className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Google Pay */}
            <button
              onClick={() => handleDownload('googlepay')}
              disabled={downloading !== null}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 disabled:bg-gray-800 disabled:opacity-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">Add to Google Pay</p>
                  <p className="text-gray-400 text-xs">Save to Google Pay on Android</p>
                </div>
              </div>
              {downloading === 'googlepay' ? (
                <Loader className="w-5 h-5 text-purple-500 animate-spin" />
              ) : downloadComplete === 'googlepay' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Download className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Email */}
            <button
              onClick={() => handleDownload('email')}
              disabled={downloading !== null}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 disabled:bg-gray-800 disabled:opacity-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">Email Tickets</p>
                  <p className="text-gray-400 text-xs">Send tickets to your email</p>
                </div>
              </div>
              {downloading === 'email' ? (
                <Loader className="w-5 h-5 text-purple-500 animate-spin" />
              ) : downloadComplete === 'email' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Mail className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {/* Image */}
            <button
              onClick={() => handleDownload('image')}
              disabled={downloading !== null}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 disabled:bg-gray-800 disabled:opacity-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">Save as Image</p>
                  <p className="text-gray-400 text-xs">Download QR code as PNG</p>
                </div>
              </div>
              {downloading === 'image' ? (
                <Loader className="w-5 h-5 text-purple-500 animate-spin" />
              ) : downloadComplete === 'image' ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <Download className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex gap-3">
            <Ticket className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold text-sm mb-1">Download Tips</h3>
              <ul className="text-blue-300/80 text-xs space-y-1">
                <li>• PDF tickets can be printed or shown on any device</li>
                <li>• Digital wallet tickets update automatically if event details change</li>
                <li>• Save tickets offline for areas with poor signal</li>
                <li>• Each ticket has a unique QR code for entry</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {downloadComplete && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-green-400 font-semibold text-sm">Download Complete!</p>
                <p className="text-green-300/80 text-xs mt-0.5">
                  Your tickets have been downloaded successfully
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}