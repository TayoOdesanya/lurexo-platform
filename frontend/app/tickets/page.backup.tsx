'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Ticket, 
  User, 
  Search,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Share2,
  Download,
  RefreshCw,
  Send,
  DollarSign,
  ExternalLink,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

interface EnhancedQRCodeProps {
  value: string;
  size?: number;
  event: {
    title: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
}

const EnhancedQRCode = ({ value, size = 280, event }: EnhancedQRCodeProps) => {
  const qrRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [useCanvas, setUseCanvas] = useState(false);

  useEffect(() => {
    // Try to use qr-code-styling first (if installed)
    const tryStyledQR = async () => {
      try {
        const QRCodeStyling = (await import('qr-code-styling')).default;
        
        if (!qrRef.current) return;

        const primaryColor = event.primaryColor || '#9333ea';
        const secondaryColor = event.secondaryColor || '#3b82f6';

        const qrCode = new QRCodeStyling({
          width: size,
          height: size,
          data: value,
          margin: 15,
          qrOptions: {
            typeNumber: 0,
            mode: 'Byte',
            errorCorrectionLevel: 'H'
          },
          dotsOptions: {
            color: primaryColor,
            type: 'extra-rounded',
            gradient: {
              type: 'radial',
              rotation: 0,
              colorStops: [
                { offset: 0, color: primaryColor },
                { offset: 1, color: secondaryColor }
              ]
            }
          },
          backgroundOptions: {
            color: '#ffffff',
          },
          cornersSquareOptions: {
            color: secondaryColor,
            type: 'extra-rounded',
            gradient: {
              type: 'linear',
              rotation: Math.PI / 4,
              colorStops: [
                { offset: 0, color: primaryColor },
                { offset: 1, color: secondaryColor }
              ]
            }
          },
          cornersDotOptions: {
            color: primaryColor,
            type: 'dot',
          },
        });

        qrRef.current.innerHTML = '';
        qrCode.append(qrRef.current);
      } catch (error) {
        // Fallback to canvas-based QR
        console.log('Using fallback QR code');
        setUseCanvas(true);
      }
    };

    tryStyledQR();
  }, [value, size, event]);

  // Fallback: Use simple canvas QR
  useEffect(() => {
    if (!useCanvas || !canvasRef.current) return;

    import('qrcode').then((QRCode) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      QRCode.toCanvas(canvas, value, {
        width: size - 40,
        margin: 2,
        color: {
          dark: event.primaryColor || '#9333ea',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H'
      });
    }).catch(() => {
      console.error('QR code library not available');
    });
  }, [useCanvas, value, size, event]);

  return (
    <div className="relative flex items-center justify-center py-2">
      {/* Animated gradient glow */}
      <div 
        className="absolute inset-0 blur-3xl opacity-30 rounded-3xl animate-pulse"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${event.primaryColor || '#9333ea'}, ${event.secondaryColor || '#3b82f6'})`
        }}
      />
      
      {!useCanvas ? (
        // Styled QR Code (qr-code-styling)
        <div className="relative">
          <div 
            className="absolute -inset-2 rounded-2xl opacity-50"
            style={{
              background: `linear-gradient(135deg, ${event.primaryColor || '#9333ea'}20, ${event.secondaryColor || '#3b82f6'}20)`,
              filter: 'blur(8px)'
            }}
          />
          <div 
            ref={qrRef} 
            className="relative rounded-2xl overflow-hidden shadow-2xl"
            style={{
              padding: '8px',
              background: 'white'
            }}
          />
        </div>
      ) : (
        // Canvas Fallback QR Code
        <div 
          className="relative p-5 rounded-2xl shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${event.primaryColor || '#9333ea'}15, ${event.secondaryColor || '#3b82f6'}15)`,
            border: `3px solid ${event.primaryColor || '#9333ea'}40`
          }}
        >
          {/* Inner glow */}
          <div 
            className="absolute inset-3 rounded-xl opacity-20"
            style={{
              background: `linear-gradient(45deg, ${event.primaryColor || '#9333ea'}, ${event.secondaryColor || '#3b82f6'})`,
              filter: 'blur(10px)'
            }}
          />
          
          <div className="relative bg-white p-4 rounded-xl">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          {/* Corner accents */}
          <div 
            className="absolute top-3 left-3 w-8 h-8 border-l-3 border-t-3 rounded-tl-xl"
            style={{ borderColor: event.primaryColor || '#9333ea', borderWidth: '3px' }}
          />
          <div 
            className="absolute top-3 right-3 w-8 h-8 border-r-3 border-t-3 rounded-tr-xl"
            style={{ borderColor: event.secondaryColor || '#3b82f6', borderWidth: '3px' }}
          />
          <div 
            className="absolute bottom-3 left-3 w-8 h-8 border-l-3 border-b-3 rounded-bl-xl"
            style={{ borderColor: event.secondaryColor || '#3b82f6', borderWidth: '3px' }}
          />
          <div 
            className="absolute bottom-3 right-3 w-8 h-8 border-r-3 border-b-3 rounded-br-xl"
            style={{ borderColor: event.primaryColor || '#9333ea', borderWidth: '3px' }}
          />
        </div>
      )}

      {/* Scan indicator animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-0 right-0 h-1 animate-scan"
          style={{
            background: `linear-gradient(90deg, transparent, ${event.primaryColor || '#9333ea'}, transparent)`
          }}
        />
      </div>
    </div>
  );
};

// Mock ticket data
const MOCK_TICKETS = [
  // Upcoming tickets
  {
    id: 'ticket-001',
    orderId: 'LRX-2024-1234',
    status: 'valid',
    event: {
      id: 'event-1',
      title: 'Summer Music Festival 2025',
      date: '2025-08-15T19:00:00Z',
      venue: 'Hyde Park, London',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      category: 'Music',
      organizer: 'Live Nation',
      primaryColor: '#9333ea',
      secondaryColor: '#3b82f6'
    },
    ticketType: 'General Admission',
    quantity: 2,
    ticketNumber: 1,
    totalTickets: 2,
    price: 85.00,
    qrCodeValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6IjAwMSIsImV2ZW50SWQiOiJldmVudC0xIiwidXNlcklkIjoidXNlci0xMjMiLCJ0aW1lc3RhbXAiOiIyMDI1LTA4LTE1VDE5OjAwOjAwWiJ9',
    purchaseDate: '2025-06-01T10:00:00Z',
    transferable: true,
    resellable: true
  },
  {
    id: 'ticket-002',
    orderId: 'LRX-2024-1234',
    status: 'valid',
    event: {
      id: 'event-1',
      title: 'Summer Music Festival 2025',
      date: '2025-08-15T19:00:00Z',
      venue: 'Hyde Park, London',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
      category: 'Music',
      organizer: 'Live Nation',
      primaryColor: '#9333ea',
      secondaryColor: '#3b82f6'
    },
    ticketType: 'General Admission',
    quantity: 2,
    ticketNumber: 2,
    totalTickets: 2,
    price: 85.00,
    qrCodeValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6IjAwMiIsImV2ZW50SWQiOiJldmVudC0xIiwidXNlcklkIjoidXNlci0xMjMiLCJ0aW1lc3RhbXAiOiIyMDI1LTA4LTE1VDE5OjAwOjAwWiJ9',
    purchaseDate: '2025-06-01T10:00:00Z',
    transferable: true,
    resellable: true
  },
  {
    id: 'ticket-004',
    orderId: 'LRX-2024-9999',
    status: 'valid',
    event: {
      id: 'event-4',
      title: 'Jazz Night at Ronnie Scotts',
      date: '2025-11-20T21:00:00Z',
      venue: 'Ronnie Scott\'s Jazz Club, Soho',
      imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
      category: 'Music',
      organizer: 'Ronnie Scott\'s',
      primaryColor: '#3b82f6',
      secondaryColor: '#8b5cf6'
    },
    ticketType: 'VIP Table',
    quantity: 1,
    ticketNumber: 1,
    totalTickets: 1,
    price: 120.00,
    qrCodeValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6IjAwNCIsImV2ZW50SWQiOiJldmVudC00IiwidXNlcklkIjoidXNlci0xMjMifQ',
    purchaseDate: '2025-09-10T15:30:00Z',
    transferable: true,
    resellable: true
  },
  // Past tickets
  {
    id: 'ticket-003',
    orderId: 'LRX-2024-5678',
    status: 'used',
    event: {
      id: 'event-2',
      title: 'Comedy Night with Sarah Cooper',
      date: '2024-06-10T20:00:00Z',
      venue: 'The Comedy Store, Leicester Square',
      imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
      category: 'Comedy',
      organizer: 'Comedy Central',
      primaryColor: '#f97316',
      secondaryColor: '#eab308'
    },
    ticketType: 'VIP',
    quantity: 1,
    ticketNumber: 1,
    totalTickets: 1,
    price: 50.00,
    qrCodeValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6IjAwMyIsImV2ZW50SWQiOiJldmVudC0yIiwidXNlcklkIjoidXNlci0xMjMifQ',
    purchaseDate: '2024-05-15T10:00:00Z',
    usedDate: '2024-06-10T19:45:00Z',
    transferable: false,
    resellable: false
  },
  {
    id: 'ticket-005',
    orderId: 'LRX-2024-3333',
    status: 'used',
    event: {
      id: 'event-5',
      title: 'Afrobeats Night - Juls Live',
      date: '2024-05-05T22:00:00Z',
      venue: 'Electric Brixton',
      imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
      category: 'Music',
      organizer: 'Afro Nation',
      primaryColor: '#ec4899',
      secondaryColor: '#f59e0b'
    },
    ticketType: 'General Admission',
    quantity: 1,
    ticketNumber: 1,
    totalTickets: 1,
    price: 30.00,
    qrCodeValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6IjAwNSIsImV2ZW50SWQiOiJldmVudC01IiwidXNlcklkIjoidXNlci0xMjMifQ',
    purchaseDate: '2024-04-10T14:20:00Z',
    usedDate: '2024-05-05T21:50:00Z',
    transferable: false,
    resellable: false
  },
  // Cancelled tickets
  {
    id: 'ticket-006',
    orderId: 'LRX-2024-7777',
    status: 'cancelled',
    event: {
      id: 'event-6',
      title: 'Outdoor Theatre - Romeo & Juliet',
      date: '2025-07-28T19:30:00Z',
      venue: 'Regent\'s Park Open Air Theatre',
      imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
      category: 'Theatre',
      organizer: 'Open Air Theatre',
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6'
    },
    ticketType: 'Standard',
    quantity: 1,
    ticketNumber: 1,
    totalTickets: 1,
    price: 45.00,
    qrCodeValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6IjAwNiIsImV2ZW50SWQiOiJldmVudC02IiwidXNlcklkIjoidXNlci0xMjMifQ',
    purchaseDate: '2025-06-15T11:00:00Z',
    cancelledDate: '2025-07-01T10:00:00Z',
    cancellationReason: 'Event cancelled by organizer',
    refundStatus: 'processed',
    refundAmount: 45.00,
    transferable: false,
    resellable: false
  },
  {
    id: 'ticket-007',
    orderId: 'LRX-2024-8888',
    status: 'refunded',
    event: {
      id: 'event-7',
      title: 'Food & Wine Festival',
      date: '2025-09-10T12:00:00Z',
      venue: 'Southbank Centre',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800',
      category: 'Food & Drink',
      organizer: 'Street Feast',
      primaryColor: '#10b981',
      secondaryColor: '#f59e0b'
    },
    ticketType: 'Early Bird',
    quantity: 2,
    ticketNumber: 1,
    totalTickets: 2,
    price: 25.00,
    qrCodeValue: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0aWNrZXRJZCI6IjAwNyIsImV2ZW50SWQiOiJldmVudC03IiwidXNlcklkIjoidXNlci0xMjMifQ',
    purchaseDate: '2025-07-20T09:30:00Z',
    refundedDate: '2025-08-05T14:00:00Z',
    refundReason: 'Requested by customer',
    refundStatus: 'completed',
    refundAmount: 50.00,
    transferable: false,
    resellable: false
  }
];

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcomingExpanded, setUpcomingExpanded] = useState(true);
  const [pastExpanded, setPastExpanded] = useState(false);
  const [cancelledExpanded, setCancelledExpanded] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTickets(MOCK_TICKETS);
      setLoading(false);
    }, 500);
  }, []);

  const upcomingTickets = tickets.filter(t => 
    t.status === 'valid' && new Date(t.event.date) > new Date()
  );
  const pastTickets = tickets.filter(t => 
    t.status === 'used' || new Date(t.event.date) < new Date()
  );
  const cancelledTickets = tickets.filter(t => 
    t.status === 'cancelled' || t.status === 'refunded'
  );

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

  const handleShare = async (ticket) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: ticket.event.title,
          text: `Check out ${ticket.event.title} on ${formatDate(ticket.event.date)}`,
          url: `https://lurexo.com/events/${ticket.event.id}`
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleAddToWallet = (ticket) => {
    // TODO: Implement Apple Wallet / Google Pay integration
    alert('Add to Wallet feature coming soon!');
  };

  const handleTransfer = (ticket) => {
    // TODO: Implement transfer flow
    alert('Transfer ticket feature coming soon!');
  };

  const handleResell = (ticket) => {
    // TODO: Implement resale flow
    alert('Resell ticket feature coming soon!');
  };

  const handleRefund = (ticket) => {
    // TODO: Implement refund request
    alert('Refund request feature coming soon!');
  };

  // Empty state
  if (!loading && tickets.length === 0) {
    return (
      <div className="min-h-screen bg-black pb-20">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
          <h1 className="text-white text-2xl font-bold">My Tickets</h1>
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center h-[70vh] px-6 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-6">
            <Ticket className="w-12 h-12 text-purple-400" />
          </div>
          <h2 className="text-white text-xl font-bold mb-2">No tickets yet</h2>
          <p className="text-gray-400 mb-8 max-w-sm">
            Browse events and get your first ticket to start your collection
          </p>
          <Link href="/mobile">
            <button className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform">
              Browse Events
            </button>
          </Link>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
          <div className="flex items-center justify-around py-3">
            <Link href="/mobile">
              <button className="flex flex-col items-center gap-1 px-4 py-2">
                <Home className="w-6 h-6 text-gray-400" />
                <span className="text-gray-400 text-xs">Home</span>
              </button>
            </Link>

            <Link href="/tickets">
              <button className="flex flex-col items-center gap-1 px-4 py-2">
                <Ticket className="w-6 h-6 text-purple-500" />
                <span className="text-purple-500 text-xs font-semibold">Tickets</span>
              </button>
            </Link>

            <Link href="/profile">
              <button className="flex flex-col items-center gap-1 px-4 py-2">
                <User className="w-6 h-6 text-gray-400" />
                <span className="text-gray-400 text-xs">Profile</span>
              </button>
            </Link>

            <Link href="/search/mobile">
              <button className="flex flex-col items-center gap-1 px-4 py-2">
                <Search className="w-6 h-6 text-gray-400" />
                <span className="text-gray-400 text-xs">Search</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Ticket Card Component
  const TicketCard = ({ ticket, isPast = false, isCancelled = false }) => {
    const [expanded, setExpanded] = useState(!isPast && !isCancelled);

    return (
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-gray-700 mb-4">
        {/* Event Header */}
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-start gap-3">
            {/* Event Image Thumbnail */}
            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
              <img 
                src={ticket.event.imageUrl} 
                alt={ticket.event.title}
                className={`w-full h-full object-cover ${isCancelled ? 'opacity-50 grayscale' : ''}`}
              />
              {isCancelled && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <XCircle className="w-6 h-6 text-red-400" />
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className={`font-bold text-base line-clamp-2 ${isCancelled ? 'text-gray-400' : 'text-white'}`}>
                  {ticket.event.title}
                </h3>
                {isPast && !isCancelled && (
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                )}
                {isCancelled && (
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                )}
              </div>
              
              <div className={`flex items-center text-sm mb-1 ${isCancelled ? 'text-gray-500' : 'text-gray-400'}`}>
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                <span>{formatDate(ticket.event.date)} • {formatTime(ticket.event.date)}</span>
              </div>
              
              <div className={`flex items-center text-sm ${isCancelled ? 'text-gray-500' : 'text-gray-400'}`}>
                <MapPin className="w-3.5 h-3.5 mr-1.5" />
                <span className="truncate">{ticket.event.venue}</span>
              </div>

              {isCancelled && (
                <div className="mt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/20 rounded-full text-xs text-red-400">
                    {ticket.status === 'refunded' ? 'Refunded' : 'Cancelled'}
                  </span>
                </div>
              )}
            </div>

            {/* Expand Icon */}
            <button className="text-gray-400 p-1">
              {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="px-4 pb-4">
            {/* QR Code - Only show for valid tickets */}
            {!isCancelled && (
              <div className="bg-white rounded-xl p-4 mb-4 flex flex-col items-center">
                {/* TODO PHASE 2: Upgrade to AI-generated artistic QR */}
                {/* Current: Professional styled QR with event colors (FREE) */}
                {/* Future: AI-generated artistic QR from QuickQR.art or Replicate API */}
                {/* Cost: $0 now, ~$0.01 per ticket in Phase 2 */}
                
                <EnhancedQRCode 
                  value={ticket.qrCodeValue}
                  size={280}
                  event={ticket.event}
                />
                
                <div className="mt-3 text-center">
                  <p className="text-gray-900 font-semibold text-sm">
                    Ticket {ticket.ticketNumber} of {ticket.totalTickets}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">
                    Order #{ticket.orderId}
                  </p>
                </div>

                {!isPast && (
                  <p className="text-gray-500 text-xs mt-2 text-center">
                    Present this QR code at the venue
                  </p>
                )}

                {isPast && ticket.usedDate && (
                  <div className="flex items-center gap-1 text-green-600 text-xs mt-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Scanned on {formatDate(ticket.usedDate)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Cancellation/Refund Details */}
            {isCancelled && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2 mb-3">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold text-sm mb-1">
                      {ticket.status === 'refunded' ? 'Ticket Refunded' : 'Event Cancelled'}
                    </p>
                    <p className="text-red-300/80 text-xs">
                      {ticket.cancellationReason || ticket.refundReason || 'No reason provided'}
                    </p>
                  </div>
                </div>
                
                {ticket.refundStatus && (
                  <div className="pt-3 border-t border-red-500/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-red-300/70">Refund Status</span>
                      <span className="text-red-400 font-medium capitalize">{ticket.refundStatus}</span>
                    </div>
                    {ticket.refundAmount && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-red-300/70">Amount</span>
                        <span className="text-red-400 font-medium">£{ticket.refundAmount.toFixed(2)}</span>
                      </div>
                    )}
                    {(ticket.cancelledDate || ticket.refundedDate) && (
                      <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-red-300/70">Date</span>
                        <span className="text-red-400 font-medium">
                          {formatDate(ticket.cancelledDate || ticket.refundedDate)}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ticket Details - Only Ticket Type */}
            <div className="bg-gray-800/50 rounded-lg p-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Ticket Type</span>
                <span className={`font-medium ${isCancelled ? 'text-gray-400' : 'text-white'}`}>
                  {ticket.ticketType}
                </span>
              </div>
            </div>

            {/* Action Buttons - Only for valid upcoming tickets */}
            {!isPast && !isCancelled && (
              <>
                {/* Primary Actions - Always Visible */}
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <button
                    onClick={() => handleAddToWallet(ticket)}
                    className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Wallet
                  </button>

                  <button
                    onClick={() => handleShare(ticket)}
                    className="flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>

                {/* More Actions - Collapsible */}
                <div className="mb-2">
                  <button
                    onClick={() => {
                      const currentExpanded = selectedTicket === ticket.id;
                      setSelectedTicket(currentExpanded ? null : ticket.id);
                    }}
                    className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white py-2 text-sm font-medium transition-colors"
                  >
                    <span>More Actions</span>
                    {selectedTicket === ticket.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>

                  {selectedTicket === ticket.id && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {ticket.transferable && (
                        <button
                          onClick={() => handleTransfer(ticket)}
                          className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          Transfer
                        </button>
                      )}

                      {ticket.resellable && (
                        <button
                          onClick={() => handleResell(ticket)}
                          className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                        >
                          <DollarSign className="w-4 h-4" />
                          Resell
                        </button>
                      )}

                      <button
                        onClick={() => handleRefund(ticket)}
                        className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refund
                      </button>

                      <Link href={`/events/${ticket.event.id}`}>
                        <button className="w-full flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                          <ExternalLink className="w-4 h-4" />
                          Details
                        </button>
                      </Link>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Share & Details - For past/cancelled tickets */}
            {(isPast || isCancelled) && (
              <div className="grid grid-cols-2 gap-2 mb-2">
                <button
                  onClick={() => handleShare(ticket)}
                  className="flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>

                <Link href={`/events/${ticket.event.id}`}>
                  <button className="w-full flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">
                    <ExternalLink className="w-4 h-4" />
                    Details
                  </button>
                </Link>

                {/* TODO: Phase 2 - Add collectible/NFT marketplace actions for past tickets
                <button onClick={() => handleTrade(ticket)}>
                  <RefreshCw className="w-4 h-4" />
                  Trade
                </button>
                <button onClick={() => handleSellCollectible(ticket)}>
                  <DollarSign className="w-4 h-4" />
                  Sell
                </button>
                
                Features:
                - Trade with other collectors
                - Sell on NFT marketplace
                - View ticket as collectible/memorabilia
                - Show rarity/demand
                - Historical event significance
                */}
              </div>
            )}

            {/* NFT Badge (Phase 2) - Only for non-cancelled tickets */}
            {!isCancelled && (
              <div className="mt-3 p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-purple-400 text-xs text-center flex items-center justify-center gap-1">
                  <span className="text-purple-300">✨</span>
                  This ticket is stored as an NFT for authenticity
                  <span className="text-purple-300">✨</span>
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40 backdrop-blur-lg bg-opacity-95">
        <div className="flex items-center justify-between">
          <h1 className="text-white text-2xl font-bold">My Tickets</h1>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Ticket className="w-4 h-4" />
            <span>{tickets.length} {tickets.length === 1 ? 'ticket' : 'tickets'}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Upcoming Tickets Section */}
        {upcomingTickets.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setUpcomingExpanded(!upcomingExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <h2 className="text-white text-lg font-bold flex items-center gap-2">
                Upcoming Events
                <span className="text-sm text-gray-400 font-normal">({upcomingTickets.length})</span>
              </h2>
              {upcomingExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {upcomingExpanded && (
              <div>
                {upcomingTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Past Tickets Section */}
        {pastTickets.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setPastExpanded(!pastExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <h2 className="text-white text-lg font-bold flex items-center gap-2">
                Past Events
                <span className="text-sm text-gray-400 font-normal">({pastTickets.length})</span>
              </h2>
              {pastExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {pastExpanded && (
              <div>
                {pastTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} isPast />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Cancelled/Refunded Section */}
        {cancelledTickets.length > 0 && (
          <div className="mb-6">
            <button
              onClick={() => setCancelledExpanded(!cancelledExpanded)}
              className="w-full flex items-center justify-between mb-3"
            >
              <h2 className="text-white text-lg font-bold flex items-center gap-2">
                Cancelled / Refunded
                <span className="text-sm text-gray-400 font-normal">({cancelledTickets.length})</span>
              </h2>
              {cancelledExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>

            {cancelledExpanded && (
              <div>
                {cancelledTickets.map((ticket) => (
                  <TicketCard key={ticket.id} ticket={ticket} isCancelled />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex items-center justify-around py-3">
          <Link href="/mobile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Home className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-xs">Home</span>
            </button>
          </Link>

          <Link href="/tickets">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Ticket className="w-6 h-6 text-purple-500" />
              <span className="text-purple-500 text-xs font-semibold">Tickets</span>
            </button>
          </Link>

          <Link href="/profile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <User className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-xs">Profile</span>
            </button>
          </Link>

          <Link href="/search/mobile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Search className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-xs">Search</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

