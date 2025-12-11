'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Edit,
  Globe,
  Eye,
  Calendar,
  MapPin,
  Clock,
  Users,
  Check,
  Info,
  Shield,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Heart,
  DollarSign,
  Ticket,
  AlertCircle,
  Zap,
  ExternalLink
} from 'lucide-react';

// Mock event data - in production this would come from the event being previewed
const MOCK_EVENT = {
  id: 'preview-event',
  name: 'Summer Music Festival 2025',
  category: 'Music',
  shortDescription: 'The biggest music festival of the year featuring world-class artists and unforgettable performances.',
  longDescription: 'Get ready for the biggest music event of the summer! Our Summer Music Festival brings together incredible talent, stunning production, and an atmosphere like no other. Dance under the stars, enjoy gourmet food trucks, and create memories that will last a lifetime.',
  highlights: [
    'Headlining performances by international artists',
    'Multiple stages with diverse genres',
    'Gourmet food & beverage vendors',
    'VIP lounges with premium amenities'
  ],
  eventDate: '2025-08-15T19:00:00Z',
  eventEndDate: '2025-08-15T23:00:00Z',
  doorsOpen: '2025-08-15T18:00:00Z',
  venue: {
    name: 'Hyde Park',
    address: 'Hyde Park, London W2 2UH',
    capacity: 65000
  },
  heroImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200',
  gallery: [
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800'
  ],
  ticketTiers: [
    {
      id: '1',
      name: 'General Admission',
      price: 85.00,
      serviceFee: 8.50,
      quantity: 5000,
      available: 1250,
      description: 'General standing area with access to all stages',
      features: ['General standing area', 'Access to food courts', 'Standard facilities']
    },
    {
      id: '2',
      name: 'VIP Experience',
      price: 185.00,
      serviceFee: 18.50,
      quantity: 500,
      available: 85,
      description: 'Premium experience with exclusive benefits',
      features: ['Premium viewing area', 'VIP lounge access', 'Complimentary drinks', 'Private restrooms']
    }
  ],
  organizer: {
    name: 'Live Nation UK',
    verified: true
  },
  ageRestriction: '18+',
  refundPolicy: 'Full refund if event is cancelled. No refunds for change of mind. Free ticket transfers available anytime.',
  allowResale: true,
  resaleCap: 110,
  allowTransfers: true,
  visibility: 'draft',
  trainStations: ['Hyde Park Corner Station (5 min walk)', 'Marble Arch Station (8 min walk)'],
  parkingInfo: 'Limited street parking available. We recommend using public transport.',
  accessibilityNotes: 'Wheelchair accessible. Dedicated viewing areas available. Accessible toilets on-site.',
  faqs: [
    { question: 'What time should I arrive?', answer: 'Doors open at 6:00 PM. We recommend arriving early to avoid queues.' },
    { question: 'Can I bring food and drinks?', answer: 'No outside food or drinks allowed. Wide variety of vendors available inside.' },
    { question: 'Is there an age restriction?', answer: 'This event is 18+ only. Valid ID required for entry.' }
  ]
};

export default function EventPreviewPage() {
  const [expandedSections, setExpandedSections] = useState({
    description: true,
    venue: true,
    transport: false,
    faq: false,
    refund: false,
    gallery: false
  });

  const [selectedTier, setSelectedTier] = useState(MOCK_EVENT.ticketTiers[0]);
  const [quantity, setQuantity] = useState(1);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const ticketsSold = MOCK_EVENT.ticketTiers.reduce((sum, tier) => sum + (tier.quantity - tier.available), 0);
  const totalCapacity = MOCK_EVENT.ticketTiers.reduce((sum, tier) => sum + tier.quantity, 0);
  const percentSold = (ticketsSold / totalCapacity) * 100;
  const availableTickets = MOCK_EVENT.ticketTiers.reduce((sum, tier) => sum + tier.available, 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const totalPrice = (selectedTier.price + selectedTier.serviceFee) * quantity;

  return (
    <div className="min-h-screen bg-black">
      {/* Preview Mode Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5" />
            <div>
              <p className="font-bold text-sm">Preview Mode</p>
              <p className="text-xs opacity-90">This is how buyers will see your event</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/organizer/create-event">
              <button className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors">
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Event</span>
              </button>
            </Link>
            <Link href="/organizer/dashboard">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 hover:bg-gray-100 rounded-lg text-sm font-semibold transition-colors">
                <Zap className="w-4 h-4" />
                <span>Publish</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-900 border-b border-gray-800 sticky top-[52px] z-40 backdrop-blur-lg bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/organizer/create-event" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Edit</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className="text-white font-bold text-xl hidden sm:inline">Lurexo</span>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Heart className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                <Share2 className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="relative h-[35vh] sm:h-[45vh] md:h-[55vh] overflow-hidden">
        <img 
          src={MOCK_EVENT.heroImage} 
          alt={MOCK_EVENT.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="inline-block px-3 py-1.5 bg-purple-600 text-white rounded-full text-xs font-bold uppercase backdrop-blur-sm">
            {MOCK_EVENT.category}
          </span>
        </div>

        {percentSold >= 80 && (
          <div className="absolute bottom-4 left-4">
            <span className="inline-block px-3 py-1.5 bg-red-500 text-white rounded-full text-xs font-bold backdrop-blur-sm">
              🔥 Selling Fast - Only {availableTickets} left
            </span>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-12">
          {/* Left Column */}
          <div className="lg:col-span-2">
            <div className="max-w-[900px] space-y-6 lg:space-y-8">
              
              {/* Title Section */}
              <div className="space-y-3">
                <h1 className="text-white font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight">
                  {MOCK_EVENT.name}
                </h1>

                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">by</span>
                  <span className="text-white text-sm font-semibold">{MOCK_EVENT.organizer.name}</span>
                  {MOCK_EVENT.organizer.verified && (
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>

              {/* Quick Info Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/15 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs font-medium mb-0.5">Date</div>
                    <div className="text-white font-bold text-base">{formatDate(MOCK_EVENT.eventDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-purple-500/10 hover:from-purple-500/10 hover:to-purple-500/15 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs font-medium mb-0.5">Start Time</div>
                    <div className="text-white font-bold text-base">{formatTime(MOCK_EVENT.eventDate)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/15 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs font-medium mb-0.5">Venue</div>
                    <div className="text-white font-bold text-base truncate">{MOCK_EVENT.venue.name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-500/10 hover:from-blue-500/10 hover:to-blue-500/15 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-gray-400 text-xs font-medium mb-0.5">Age</div>
                    <div className="text-white font-bold text-base">{MOCK_EVENT.ageRestriction}</div>
                  </div>
                </div>
              </div>

              {/* Trust Signals Bar */}
              <div className="hidden lg:flex flex-wrap gap-4 p-4 bg-purple-900/20 border-purple-500/20 rounded-xl border">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">No hidden fees</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">Free transfers</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">Digital tickets in mobile wallet</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">24/7 support</span>
                </div>
              </div>

              {/* Refund Policy */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <button
                  onClick={() => toggleSection('refund')}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition"
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold text-left">Refund Policy</h3>
                  </div>
                  {expandedSections.refund ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.refund && (
                  <div className="px-4 pb-4 border-t border-gray-800">
                    <p className="text-sm text-gray-400 mt-3 leading-relaxed">{MOCK_EVENT.refundPolicy}</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">About This Event</h2>
                <p className="text-gray-400 leading-relaxed mb-3">{MOCK_EVENT.shortDescription}</p>
                {expandedSections.description && (
                  <p className="text-gray-400 leading-relaxed mb-3">{MOCK_EVENT.longDescription}</p>
                )}
                <button
                  onClick={() => toggleSection('description')}
                  className="text-purple-400 hover:text-purple-300 text-sm font-semibold flex items-center gap-2"
                >
                  {expandedSections.description ? 'Show less' : 'Read more'}
                  {expandedSections.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* What to Expect */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-4">What to Expect</h2>
                <ul className="space-y-3">
                  {MOCK_EVENT.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-400">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Venue */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('venue')}
                  className="w-full p-4 bg-gray-900 flex items-center justify-between hover:opacity-80 transition"
                >
                  <h2 className="text-xl font-bold text-white">Venue Information</h2>
                  {expandedSections.venue ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
                {expandedSections.venue && (
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="text-white font-semibold mb-2">{MOCK_EVENT.venue.name}</h3>
                      <p className="text-gray-400 text-sm">{MOCK_EVENT.venue.address}</p>
                    </div>
                    <div className="w-full h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                      <MapPin className="w-12 h-12 text-gray-500" />
                    </div>
                  </div>
                )}
              </div>

              {/* Transport */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('transport')}
                  className="w-full p-4 bg-gray-900 flex items-center justify-between hover:opacity-80 transition"
                >
                  <h2 className="text-xl font-bold text-white">Getting There</h2>
                  {expandedSections.transport ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
                {expandedSections.transport && (
                  <div className="p-4 space-y-4">
                    <div>
                      <h3 className="text-white font-semibold mb-3">Nearest Train Stations</h3>
                      <ul className="space-y-2">
                        {MOCK_EVENT.trainStations.map((station, idx) => (
                          <li key={idx} className="text-gray-400 text-sm">{station}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-3">Parking</h3>
                      <p className="text-gray-400 text-sm">{MOCK_EVENT.parkingInfo}</p>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-3">Accessibility</h3>
                      <p className="text-gray-400 text-sm">{MOCK_EVENT.accessibilityNotes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* FAQ */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('faq')}
                  className="w-full p-4 bg-gray-900 flex items-center justify-between hover:opacity-80 transition"
                >
                  <h2 className="text-xl font-bold text-white">FAQ</h2>
                  {expandedSections.faq ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
                {expandedSections.faq && (
                  <div className="p-4 space-y-4">
                    {MOCK_EVENT.faqs.map((faq, idx) => (
                      <div key={idx}>
                        <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                        <p className="text-gray-400 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery */}
              <div className="border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleSection('gallery')}
                  className="w-full p-4 bg-gray-900 flex items-center justify-between hover:opacity-80 transition"
                >
                  <h2 className="text-xl font-bold text-white">Photo Gallery</h2>
                  {expandedSections.gallery ? <ChevronUp className="w-5 h-5 text-white" /> : <ChevronDown className="w-5 h-5 text-white" />}
                </button>
                {expandedSections.gallery && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {MOCK_EVENT.gallery.map((img, idx) => (
                        <img key={idx} src={img} alt={`Gallery ${idx + 1}`} className="w-full aspect-video object-cover rounded-lg" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-32 space-y-6">
              {/* Urgency */}
              {percentSold >= 75 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="font-semibold text-sm">Only {availableTickets} tickets left!</span>
                  </div>
                </div>
              )}

              {/* Ticket Selection */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Select Tickets</h3>
                <div className="space-y-3">
                  {MOCK_EVENT.ticketTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition ${
                        selectedTier.id === tier.id
                          ? 'border-purple-500 bg-purple-900/20'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="text-white font-semibold">{tier.name}</div>
                          <div className="text-gray-400 text-sm">{tier.available} available</div>
                        </div>
                        <div className="text-right">
                          <div className="text-white text-lg font-bold">£{tier.price.toFixed(2)}</div>
                          <div className="text-gray-400 text-xs">+£{tier.serviceFee.toFixed(2)} fee</div>
                        </div>
                      </div>
                      {tier.description && (
                        <p className="text-gray-500 text-xs">{tier.description}</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block text-center">Quantity</label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                  <span className="text-xl font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(6, quantity + 1))}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700"
                  >
                    <ChevronUp className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="pt-4 border-t border-gray-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Tickets ({quantity}x)</span>
                  <span className="text-white">£{(selectedTier.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Service fee</span>
                  <span className="text-white">£{(selectedTier.serviceFee * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-700">
                  <span className="text-white">Total</span>
                  <span className="text-white">£{totalPrice.toFixed(2)}</span>
                </div>
                <p className="text-gray-500 text-xs text-center">The price you'll pay. No surprises later.</p>
              </div>

              {/* CTA */}
              <button className="w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-100 transition">
                Buy Tickets
              </button>

              {/* Trust Signals */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-gray-400">Secure checkout powered by Stripe</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Notes Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-gray-800">
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-400" />
            Preview Checklist
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Hero Image</p>
                <p className="text-gray-400 text-xs">High quality image uploaded</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Event Details</p>
                <p className="text-gray-400 text-xs">All required fields completed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Ticket Types</p>
                <p className="text-gray-400 text-xs">{MOCK_EVENT.ticketTiers.length} tiers configured</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Policies Set</p>
                <p className="text-gray-400 text-xs">Refund and transfer policies defined</p>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">Ready to publish? Your event looks great!</p>
            <Link href="/organizer/dashboard">
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold transition-colors">
                <Zap className="w-5 h-5" />
                <span>Publish Event</span>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}