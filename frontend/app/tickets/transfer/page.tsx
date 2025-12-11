'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Users,
  DollarSign,
  Shield,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Mail,
  Send,
  Calendar,
  MapPin,
  Ticket,
  Info,
  TrendingUp,
  Clock,
  X,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Share2
} from 'lucide-react';

type TransferMethod = 'email' | 'link';
type ListingType = 'transfer' | 'resale';

export default function TicketTransferPage() {
  const [activeTab, setActiveTab] = useState<'my-tickets' | 'transfer' | 'resale'>('my-tickets');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showResaleModal, setShowResaleModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [transferMethod, setTransferMethod] = useState<TransferMethod>('email');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [resalePrice, setResalePrice] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [resaleSuccess, setResaleSuccess] = useState(false);

  // Mock data - User's tickets
  const myTickets = [
    {
      id: 'TKT001',
      eventName: 'Summer Music Festival 2025',
      eventDate: '2025-06-15T18:00:00',
      venue: 'Hyde Park, London',
      ticketType: 'General Admission',
      quantity: 2,
      price: 85,
      purchaseDate: '2025-05-10',
      status: 'active',
      transferable: true,
      resaleable: true,
      image: null
    },
    {
      id: 'TKT002',
      eventName: 'Jazz Night Live',
      eventDate: '2025-07-22T20:00:00',
      venue: 'Ronnie Scott\'s',
      ticketType: 'VIP',
      quantity: 1,
      price: 120,
      purchaseDate: '2025-06-01',
      status: 'active',
      transferable: true,
      resaleable: true,
      image: null
    },
    {
      id: 'TKT003',
      eventName: 'Comedy Special',
      eventDate: '2025-08-10T19:30:00',
      venue: 'The Comedy Store',
      ticketType: 'General Admission',
      quantity: 4,
      price: 45,
      purchaseDate: '2025-07-15',
      status: 'active',
      transferable: true,
      resaleable: true,
      image: null
    }
  ];

  // Mock data - Active transfers
  const activeTransfers = [
    {
      id: 'TRN001',
      ticketId: 'TKT001',
      eventName: 'Summer Music Festival 2025',
      recipient: 'sarah.m@email.com',
      quantity: 1,
      status: 'pending',
      sentDate: '2025-12-01T10:00:00',
      expiresDate: '2025-12-08T10:00:00'
    }
  ];

  // Mock data - Active listings
  const activeListings = [
    {
      id: 'LST001',
      ticketId: 'TKT002',
      eventName: 'Jazz Night Live',
      ticketType: 'VIP',
      quantity: 1,
      originalPrice: 120,
      listingPrice: 125,
      priceCapPercentage: 110,
      listedDate: '2025-11-28T14:00:00',
      views: 24,
      status: 'active'
    }
  ];

  const maxResalePrice = selectedTicket ? Math.round(selectedTicket.price * 1.10) : 0;

  const handleTransferTicket = () => {
    // Simulate transfer
    setTransferSuccess(true);
    setTimeout(() => {
      setShowTransferModal(false);
      setTransferSuccess(false);
      setRecipientEmail('');
    }, 2000);
  };

  const handleListForResale = () => {
    // Simulate listing
    setResaleSuccess(true);
    setTimeout(() => {
      setShowResaleModal(false);
      setResaleSuccess(false);
      setResalePrice('');
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://lurexo.co.uk/transfer/abc123xyz');
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
                My Tickets
              </h1>
              <p className="text-gray-400 text-sm">
                Transfer, resell, or manage your tickets
              </p>
            </div>
            <Link href="/profile">
              <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-2">
                <ArrowRight className="w-4 h-4" />
                Back to Profile
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold text-lg mb-2">Fair Transfer & Resale</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Free Transfers</p>
                    <p className="text-gray-400 text-xs">Transfer tickets to friends at no cost</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Capped Resale</p>
                    <p className="text-gray-400 text-xs">Resell at max 110% of face value (UK law)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">Secure Platform</p>
                    <p className="text-gray-400 text-xs">All transfers verified and tracked</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold">No Scalping</p>
                    <p className="text-gray-400 text-xs">Price gouging automatically prevented</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 mb-8">
          <div className="border-b border-gray-800 px-6">
            <div className="flex gap-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab('my-tickets')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'my-tickets'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                My Tickets ({myTickets.length})
              </button>
              <button
                onClick={() => setActiveTab('transfer')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'transfer'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Active Transfers ({activeTransfers.length})
              </button>
              <button
                onClick={() => setActiveTab('resale')}
                className={`py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                  activeTab === 'resale'
                    ? 'border-purple-500 text-purple-400'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                Active Listings ({activeListings.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* My Tickets Tab */}
            {activeTab === 'my-tickets' && (
              <div className="space-y-4">
                {myTickets.map((ticket) => (
                  <div key={ticket.id} className="bg-gray-800 rounded-xl p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Event Image Placeholder */}
                      <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Ticket className="w-12 h-12 text-gray-600" />
                      </div>

                      {/* Ticket Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-lg mb-1">{ticket.eventName}</h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(ticket.eventDate).toLocaleDateString('en-GB', {
                                  weekday: 'short',
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {ticket.venue}
                              </span>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Ticket Type</p>
                            <p className="text-white font-semibold text-sm">{ticket.ticketType}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Quantity</p>
                            <p className="text-white font-semibold text-sm">{ticket.quantity} tickets</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Price Each</p>
                            <p className="text-white font-semibold text-sm">£{ticket.price}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs mb-1">Total Value</p>
                            <p className="text-white font-semibold text-sm">£{ticket.price * ticket.quantity}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowTransferModal(true);
                            }}
                            disabled={!ticket.transferable}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Transfer
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowResaleModal(true);
                            }}
                            disabled={!ticket.resaleable}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <DollarSign className="w-4 h-4" />
                            List for Resale
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            View Ticket
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {myTickets.length === 0 && (
                  <div className="text-center py-12">
                    <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">No Tickets Yet</h3>
                    <p className="text-gray-400 text-sm mb-6">
                      Browse events and get your first tickets
                    </p>
                    <Link href="/events">
                      <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors">
                        Browse Events
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Active Transfers Tab */}
            {activeTab === 'transfer' && (
              <div className="space-y-4">
                {activeTransfers.map((transfer) => (
                  <div key={transfer.id} className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">{transfer.eventName}</h3>
                        <p className="text-gray-400 text-sm">To: {transfer.recipient}</p>
                      </div>
                      <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-xs font-semibold">
                        Pending
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Quantity</p>
                        <p className="text-white font-semibold text-sm">{transfer.quantity} ticket(s)</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Sent</p>
                        <p className="text-white font-semibold text-sm">
                          {new Date(transfer.sentDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Expires</p>
                        <p className="text-white font-semibold text-sm">
                          {new Date(transfer.expiresDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Status</p>
                        <p className="text-orange-400 font-semibold text-sm">Awaiting acceptance</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-semibold transition-colors">
                        <Send className="w-4 h-4" />
                        Resend Email
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors">
                        <X className="w-4 h-4" />
                        Cancel Transfer
                      </button>
                    </div>
                  </div>
                ))}

                {activeTransfers.length === 0 && (
                  <div className="text-center py-12">
                    <RefreshCw className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">No Active Transfers</h3>
                    <p className="text-gray-400 text-sm">
                      Your ticket transfers will appear here
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Active Listings Tab */}
            {activeTab === 'resale' && (
              <div className="space-y-4">
                {activeListings.map((listing) => (
                  <div key={listing.id} className="bg-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-lg mb-1">{listing.eventName}</h3>
                        <p className="text-gray-400 text-sm">{listing.ticketType}</p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Original Price</p>
                        <p className="text-white font-semibold text-sm">£{listing.originalPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Listed Price</p>
                        <p className="text-green-400 font-bold text-sm">£{listing.listingPrice}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Your Profit</p>
                        <p className="text-green-400 font-semibold text-sm">
                          +£{listing.listingPrice - listing.originalPrice}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Views</p>
                        <p className="text-white font-semibold text-sm">{listing.views}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-1">Listed</p>
                        <p className="text-white font-semibold text-sm">
                          {new Date(listing.listedDate).toLocaleDateString('en-GB', {
                            day: 'numeric',
                            month: 'short'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-4">
                      <div className="flex items-center gap-2 text-blue-400 text-xs">
                        <Info className="w-4 h-4 flex-shrink-0" />
                        <span>
                          Listed at {Math.round(((listing.listingPrice - listing.originalPrice) / listing.originalPrice) * 100)}% above face value (max {listing.priceCapPercentage}% allowed)
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors">
                        <Edit className="w-4 h-4" />
                        Edit Price
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-semibold transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share Listing
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Remove Listing
                      </button>
                    </div>
                  </div>
                ))}

                {activeListings.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white font-bold text-lg mb-2">No Active Listings</h3>
                    <p className="text-gray-400 text-sm">
                      List your tickets for resale to appear here
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {showTransferModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Transfer Ticket</h3>
              <button
                onClick={() => setShowTransferModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!transferSuccess ? (
              <>
                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-semibold text-sm mb-2">{selectedTicket.eventName}</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Transferring</span>
                    <span className="text-white font-semibold">1 ticket</span>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-white font-medium text-sm mb-3 block">
                    Transfer Method
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setTransferMethod('email')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        transferMethod === 'email'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <Mail className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-white text-sm font-medium">Email</p>
                    </button>
                    <button
                      onClick={() => setTransferMethod('link')}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        transferMethod === 'link'
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <Share2 className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-white text-sm font-medium">Link</p>
                    </button>
                  </div>
                </div>

                {transferMethod === 'email' ? (
                  <div className="mb-6">
                    <label className="text-gray-400 text-sm font-medium mb-2 block">
                      Recipient Email
                    </label>
                    <input
                      type="email"
                      value={recipientEmail}
                      onChange={(e) => setRecipientEmail(e.target.value)}
                      placeholder="friend@email.com"
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="text-gray-400 text-sm font-medium mb-2 block">
                      Transfer Link
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value="https://lurexo.co.uk/transfer/abc123xyz"
                        readOnly
                        className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700"
                      />
                      <button
                        onClick={handleCopyLink}
                        className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-colors"
                      >
                        {linkCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>
                    {linkCopied && (
                      <p className="text-green-400 text-xs mt-2">Link copied to clipboard!</p>
                    )}
                  </div>
                )}

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-blue-400 font-semibold mb-1">Free Transfer</p>
                      <p className="text-gray-400 text-xs">
                        No fees. Recipient has 7 days to accept. You can cancel anytime before acceptance.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowTransferModal(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTransferTicket}
                    disabled={transferMethod === 'email' && !recipientEmail}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {transferMethod === 'email' ? 'Send Transfer' : 'Generate Link'}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Transfer Sent!</h4>
                <p className="text-gray-400 text-sm">
                  {transferMethod === 'email' 
                    ? `Email sent to ${recipientEmail}`
                    : 'Transfer link generated successfully'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Resale Modal */}
      {showResaleModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">List for Resale</h3>
              <button
                onClick={() => setShowResaleModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!resaleSuccess ? (
              <>
                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <h4 className="text-white font-semibold text-sm mb-2">{selectedTicket.eventName}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-400">Original Price</span>
                      <p className="text-white font-semibold">£{selectedTicket.price}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Max Resale Price</span>
                      <p className="text-green-400 font-semibold">£{maxResalePrice}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="text-gray-400 text-sm font-medium mb-2 block">
                    Your Listing Price (Max £{maxResalePrice})
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">£</span>
                    <input
                      type="number"
                      value={resalePrice}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value <= maxResalePrice) {
                          setResalePrice(e.target.value);
                        }
                      }}
                      placeholder={selectedTicket.price.toString()}
                      max={maxResalePrice}
                      className="w-full bg-gray-800 text-white pl-8 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                    />
                  </div>
                  {resalePrice && parseFloat(resalePrice) > selectedTicket.price && (
                    <p className="text-green-400 text-xs mt-2">
                      Your profit: £{(parseFloat(resalePrice) - selectedTicket.price).toFixed(2)}
                    </p>
                  )}
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="text-orange-400 font-semibold mb-1">UK Resale Law</p>
                      <p className="text-gray-400 text-xs">
                        Maximum 110% of face value. Listings above this are automatically rejected to prevent scalping.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowResaleModal(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleListForResale}
                    disabled={!resalePrice || parseFloat(resalePrice) < selectedTicket.price}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    List Ticket
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-white font-bold text-lg mb-2">Listed Successfully!</h4>
                <p className="text-gray-400 text-sm">
                  Your ticket is now available on the marketplace
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}