'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  TrendingUp,
  Users,
  BarChart3,
  Zap,
  Shield,
  CreditCard,
  Calendar,
  Settings,
  CheckCircle,
  DollarSign,
  Bell,
  Smartphone,
  Globe,
  LineChart,
  Mail,
  MessageCircle,
  Phone,
  Clock,
  RefreshCw,
  Award,
  Target,
  ChevronDown,
  X,
  Minus,
  Lock,
  ExternalLink,
  Play,
  ChevronRight,
  Ticket
} from 'lucide-react';
import Link from 'next/link';

export default function ForOrganizersPage() {
  const router = useRouter();
  const [ticketPrice, setTicketPrice] = useState(50);
  const [ticketCount, setTicketCount] = useState(1000);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Calculator logic
  const lurexoPlatformFee = ticketPrice * ticketCount * 0.04; // 4% average
  const lurexoFanFee = ticketPrice * ticketCount * 0.03; // 3% average
  const lurexoTotal = lurexoPlatformFee + lurexoFanFee;

  const ticketmasterPlatformFee = ticketPrice * ticketCount * 0.125; // 12.5% average
  const ticketmasterFanFee = ticketPrice * ticketCount * 0.15; // 15% average
  const ticketmasterTotal = ticketmasterPlatformFee + ticketmasterFanFee;

  const savings = ticketmasterTotal - lurexoTotal;
  const savingsPercent = ((savings / ticketmasterTotal) * 100).toFixed(0);

  // Desktop content
  const features = [
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Create and publish events in minutes. No technical knowledge required.',
      color: 'purple'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Track sales, demographics, and performance with detailed reports.',
      color: 'blue'
    },
    {
      icon: Shield,
      title: 'AI Bot Prevention',
      description: 'Built-in AI security prevents bots and protects your real fans.',
      color: 'green'
    },
    {
      icon: CreditCard,
      title: 'Fast Payouts',
      description: 'Automated payouts 3-5 days after events. No waiting.',
      color: 'orange'
    },
    {
      icon: Users,
      title: 'Audience Insights',
      description: 'Build your fan base with detailed attendee data and analytics.',
      color: 'purple'
    },
    {
      icon: RefreshCw,
      title: 'Resale Revenue',
      description: 'Earn 5-7% on every resale. Control prices and rules.',
      color: 'blue'
    }
  ];

  const faqs = [
    {
      id: 'faq-1',
      question: 'How quickly can I get started?',
      answer: 'Most organizers are live within 24-48 hours. Our onboarding team handles setup, integration, and your first event launch. You can start selling tickets almost immediately.'
    },
    {
      id: 'faq-2',
      question: 'What if I\'m locked into a contract with another platform?',
      answer: 'We can run alongside existing platforms. Many organizers pilot Lurexo with smaller events before transitioning fully. This lets you test our platform risk-free while fulfilling existing commitments.'
    },
    {
      id: 'faq-3',
      question: 'Do I need technical expertise?',
      answer: 'No coding required. Our dashboard is designed for non-technical users. For custom integrations, we provide API documentation and dedicated developer support.'
    },
    {
      id: 'faq-4',
      question: 'How do payouts work?',
      answer: 'Automated payouts 3-5 business days after each event. You choose weekly or monthly cycles. No minimum thresholds or complex approval processes.'
    },
    {
      id: 'faq-5',
      question: 'Can I control ticket resales?',
      answer: 'Absolutely. Set maximum resale prices (we recommend 110% cap), enable/disable resales entirely, and earn 5-7% on every resale. You own the secondary market relationship.'
    },
    {
      id: 'faq-6',
      question: 'What about white-label or custom branding?',
      answer: 'We offer white-label solutions and API integration for organizers who need custom branding or want to integrate Lurexo into existing systems. Contact sales for pricing.'
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-sm sm:text-lg">For Organizers</h1>
                <p className="text-gray-400 text-xs">Transparent ticketing that works</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-white font-bold text-sm">For Organizers</h1>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href="mailto:organizers@lurexo.co.uk"
              className="text-gray-400 hover:text-white text-xs sm:text-sm transition-colors hidden md:block"
            >
              organizers@lurexo.co.uk
            </a>
            <Link 
            href="/auth/organizer-login"
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-base inline-block"
            >
            Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section - Full Width */}
      <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 mb-4 sm:mb-6">
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400" />
              <span className="text-purple-300 text-xs sm:text-sm font-medium">Join 5,000+ Events</span>
            </div>
            
            <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4 leading-tight">
              Take Back Control.<br />
              Empower Your Fans.
            </h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed mb-6 sm:mb-8">
              Transparent pricing, AI-powered bot prevention, and artist-controlled resales. 
              Sell more tickets, earn from secondary markets, and build lasting relationships 
              with your true fans—not scalpers.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Link 
                href="/auth/organizer-login" 
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-colors text-sm sm:text-base text-center block"
                >
                Get Started Free
                </Link>
              <Link href="/contact" className="flex-1">
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-colors text-sm sm:text-base">
                  Contact Sales
                </button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-black/30 rounded-xl p-3 sm:p-4">
                <p className="text-purple-400 text-xl sm:text-2xl font-bold mb-1">3-5%</p>
                <p className="text-gray-400 text-xs">Platform Fee</p>
              </div>
              <div className="bg-black/30 rounded-xl p-3 sm:p-4">
                <p className="text-blue-400 text-xl sm:text-2xl font-bold mb-1">5,000+</p>
                <p className="text-gray-400 text-xs">Events Hosted</p>
              </div>
              <div className="bg-black/30 rounded-xl p-3 sm:p-4">
                <p className="text-green-400 text-xl sm:text-2xl font-bold mb-1">98%</p>
                <p className="text-gray-400 text-xs">Satisfaction</p>
              </div>
              <div className="bg-black/30 rounded-xl p-3 sm:p-4">
                <p className="text-orange-400 text-xl sm:text-2xl font-bold mb-1">&lt;2%</p>
                <p className="text-gray-400 text-xs">Scalping Rate</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Layout - Mobile: Stacked, Desktop: Side by Side */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar - Hidden on mobile, sticky on desktop */}
        <aside className="hidden lg:block lg:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Quick Info Card */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-white font-bold mb-4">Why Lurexo?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Lowest Fees</p>
                    <p className="text-gray-400 text-xs">3-5% vs industry 10-15%</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">No Setup Costs</p>
                    <p className="text-gray-400 text-xs">Pay only when you sell</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">24/7 Support</p>
                    <p className="text-gray-400 text-xs">Dedicated organizer team</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white text-sm font-medium">Resale Revenue</p>
                    <p className="text-gray-400 text-xs">Earn 5-7% on every resale</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Card */}
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-2">Ready to Start?</h3>
              <p className="text-white/90 text-sm mb-4">
                Join organizers who've already switched to transparent ticketing
              </p>
              <Link 
                href="/auth/organizer-login"
                className="w-full bg-white hover:bg-gray-100 text-purple-600 py-3 rounded-xl font-bold transition-colors mb-3"
                >
                  Get Started Free
              </Link>
              <Link href="/contact">
                <button className="w-full bg-white/20 hover:bg-white/30 text-white py-3 rounded-xl font-bold transition-colors">
                  Talk to Sales
                </button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-3">
                <a href="mailto:organizers@lurexo.co.uk" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                  <span className="text-sm">organizers@lurexo.co.uk</span>
                </a>
                <a href="tel:+442012345678" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">+44 20 1234 5678</span>
                </a>
                <div className="flex items-center gap-3 text-gray-400">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">24/7 Support</span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-gray-300 text-xs">PCI DSS Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-400" />
                  <span className="text-gray-300 text-xs">GDPR Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-purple-400" />
                  <span className="text-gray-300 text-xs">ISO 27001 Certified</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content - Scrollable */}
        <main className="flex-1 space-y-8 sm:space-y-12">
          {/* Revenue Calculator */}
          <section id="calculator">
            <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">Calculate Your Savings</h2>
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-800">
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
                See exactly how much you'll save by switching to Lurexo. Adjust the values below to match your event.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Ticket Price */}
                <div>
                  <label className="text-white font-medium text-xs sm:text-sm mb-2 sm:mb-3 block">
                    Ticket Price (£)
                  </label>
                  <div className="flex items-stretch gap-2">
                    <input
                      type="number"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(Number(e.target.value))}
                      className="flex-1 min-w-0 bg-gray-800 text-white text-lg sm:text-xl md:text-2xl font-bold px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setTicketPrice(prev => prev + 5)}
                        className="w-9 h-9 md:w-10 md:h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors group"
                      >
                        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTicketPrice(prev => Math.max(0, prev - 5))}
                        className="w-9 h-9 md:w-10 md:h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors group"
                      >
                        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expected Sales */}
                <div>
                  <label className="text-white font-medium text-xs sm:text-sm mb-2 sm:mb-3 block">
                    Expected Ticket Sales
                  </label>
                  <div className="flex items-stretch gap-2">
                    <input
                      type="number"
                      value={ticketCount}
                      onChange={(e) => setTicketCount(Number(e.target.value))}
                      className="flex-1 min-w-0 bg-gray-800 text-white text-lg sm:text-xl md:text-2xl font-bold px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setTicketCount(prev => prev + 100)}
                        className="w-9 h-9 md:w-10 md:h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors group"
                      >
                        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white rotate-180" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setTicketCount(prev => Math.max(0, prev - 100))}
                        className="w-9 h-9 md:w-10 md:h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-colors group"
                      >
                        <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Results - Mobile: Stacked, Desktop: Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <span className="text-white font-semibold text-sm sm:text-base">With Lurexo</span>
                  </div>
                  <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
                    £{lurexoTotal.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">Total platform fees (3-5% avg + 2-4% fan fees)</p>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Platform Fee (4%)</span>
                      <span className="text-white">£{lurexoPlatformFee.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Fan Fee (3%)</span>
                      <span className="text-white">£{lurexoFanFee.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 sm:p-6">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <span className="text-white font-semibold text-sm sm:text-base">With Ticketmaster</span>
                  </div>
                  <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-2">
                    £{ticketmasterTotal.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm">Total platform fees (10-15% + 10-20% hidden fees)</p>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-700">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Platform Fee (12.5%)</span>
                      <span className="text-white">£{ticketmasterPlatformFee.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400">Hidden Fees (15%)</span>
                      <span className="text-white">£{ticketmasterFanFee.toLocaleString('en-GB', { maximumFractionDigits: 0 })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Highlight */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <p className="text-green-400 font-semibold text-sm sm:text-base mb-1">Your Savings with Lurexo</p>
                    <p className="text-gray-400 text-xs sm:text-sm">That's {savingsPercent}% less in fees</p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-green-400 font-bold text-3xl sm:text-4xl md:text-5xl">
                      £{savings.toLocaleString('en-GB', { maximumFractionDigits: 0 })}
                    </p>
                    <p className="text-green-400/80 text-xs sm:text-sm mt-1">saved per event</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Comparison Table - Mobile: Scroll horizontally */}
          <section id="comparison">
            <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">How We Compare</h2>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gray-800">
                    <tr>
                      <th className="text-left text-gray-400 text-xs sm:text-sm font-semibold p-3 sm:p-4 pl-4 sm:pl-6">Feature</th>
                      <th className="text-center text-purple-400 text-xs sm:text-sm font-bold p-3 sm:p-4 bg-purple-500/10">
                        <div className="flex items-center justify-center gap-2">
                          <Award className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="hidden sm:inline">Lurexo</span>
                        </div>
                      </th>
                      <th className="text-center text-gray-400 text-xs sm:text-sm font-semibold p-3 sm:p-4">Ticketmaster</th>
                      <th className="text-center text-gray-400 text-xs sm:text-sm font-semibold p-3 sm:p-4">Dice</th>
                      <th className="text-center text-gray-400 text-xs sm:text-sm font-semibold p-3 sm:p-4">Eventbrite</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      <td className="text-gray-300 text-xs sm:text-sm p-3 sm:p-4 pl-4 sm:pl-6 font-medium">Platform Fee</td>
                      <td className="text-center p-3 sm:p-4 bg-purple-500/5">
                        <span className="text-green-400 font-bold text-base sm:text-lg">3-5%</span>
                      </td>
                      <td className="text-center text-red-400 font-semibold p-3 sm:p-4 text-xs sm:text-sm">10-15%</td>
                      <td className="text-center text-orange-400 font-semibold p-3 sm:p-4 text-xs sm:text-sm">5-8%</td>
                      <td className="text-center text-yellow-400 font-semibold p-3 sm:p-4 text-xs sm:text-sm">3.5-8%</td>
                    </tr>
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      <td className="text-gray-300 text-xs sm:text-sm p-3 sm:p-4 pl-4 sm:pl-6 font-medium">Fan-Facing Fees</td>
                      <td className="text-center p-3 sm:p-4 bg-purple-500/5">
                        <span className="text-green-400 font-bold text-base sm:text-lg">2-4%</span>
                      </td>
                      <td className="text-center text-red-400 font-semibold p-3 sm:p-4 text-xs sm:text-sm">10-20%</td>
                      <td className="text-center text-gray-400 p-3 sm:p-4 text-xs sm:text-sm">Varies</td>
                      <td className="text-center text-gray-400 p-3 sm:p-4 text-xs sm:text-sm">Varies</td>
                    </tr>
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      <td className="text-gray-300 text-xs sm:text-sm p-3 sm:p-4 pl-4 sm:pl-6 font-medium">Artist Resale Revenue</td>
                      <td className="text-center p-3 sm:p-4 bg-purple-500/5">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      <td className="text-gray-300 text-xs sm:text-sm p-3 sm:p-4 pl-4 sm:pl-6 font-medium">Free Ticket Transfers</td>
                      <td className="text-center p-3 sm:p-4 bg-purple-500/5">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      <td className="text-gray-300 text-xs sm:text-sm p-3 sm:p-4 pl-4 sm:pl-6 font-medium">AI Bot Prevention</td>
                      <td className="text-center p-3 sm:p-4 bg-purple-500/5">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      <td className="text-gray-300 text-xs sm:text-sm p-3 sm:p-4 pl-4 sm:pl-6 font-medium">Real-Time Analytics</td>
                      <td className="text-center p-3 sm:p-4 bg-purple-500/5">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      <td className="text-gray-300 text-xs sm:text-sm p-3 sm:p-4 pl-4 sm:pl-6 font-medium">White Label / API</td>
                      <td className="text-center p-3 sm:p-4 bg-purple-500/5">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <X className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-800/50 transition-colors">
                      <td className="text-gray-300 text-xs sm:text-sm p-3 sm:p-4 pl-4 sm:pl-6 font-medium">24/7 Support</td>
                      <td className="text-center p-3 sm:p-4 bg-purple-500/5">
                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto" />
                      </td>
                      <td className="text-center p-3 sm:p-4">
                        <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500 mx-auto" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-gray-800 p-3 sm:p-4 text-center">
                <p className="text-gray-400 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 inline text-green-400 mr-1" /> = Available &nbsp;&nbsp;
                  <X className="w-3 h-3 sm:w-4 sm:h-4 inline text-red-400 mr-1" /> = Not Available &nbsp;&nbsp;
                  <Minus className="w-3 h-3 sm:w-4 sm:h-4 inline text-gray-500 mr-1" /> = Limited
                </p>
              </div>
            </div>
          </section>

          {/* Features Grid - Mobile: 1 col, Desktop: 2 cols */}
          <section id="features">
            <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">Platform Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                const colorClasses = {
                  purple: 'bg-purple-500/20 text-purple-400',
                  blue: 'bg-blue-500/20 text-blue-400',
                  green: 'bg-green-500/20 text-green-400',
                  orange: 'bg-orange-500/20 text-orange-400'
                };
                const colorClass = colorClasses[feature.color as keyof typeof colorClasses];

                return (
                  <div key={index} className="bg-gray-900 rounded-xl p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-colors">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colorClass} rounded-xl flex items-center justify-center mb-3 sm:mb-4`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h3 className="text-white font-semibold text-base sm:text-lg mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Case Studies - Mobile: 1 col, Desktop: 2 cols */}
          <section id="case-studies">
            <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">Success Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Case Study 1 */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-lg">Sarah Mitchell</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Founder, Sunset Music Festival</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="bg-purple-500/10 rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-purple-400 font-bold text-base sm:text-xl">2,847</p>
                      <p className="text-gray-400 text-xs">Tickets Sold</p>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-green-400 font-bold text-base sm:text-xl">£4.2K</p>
                      <p className="text-gray-400 text-xs">Saved in Fees</p>
                    </div>
                    <div className="bg-blue-500/10 rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-blue-400 font-bold text-base sm:text-xl">0.3%</p>
                      <p className="text-gray-400 text-xs">Scalping</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic mb-3 sm:mb-4">
                    "Switching to Lurexo was the best decision we made. The analytics showed us 
                    exactly who our audience is, and earning revenue from resales completely changed 
                    our business model."
                  </p>

                  <button className="text-purple-400 text-xs sm:text-sm font-medium hover:text-purple-300 transition-colors flex items-center gap-1">
                    Read Full Case Study
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>

              {/* Case Study 2 */}
              <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                <div className="p-4 sm:p-6">
                  <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm sm:text-lg">James Chen</p>
                      <p className="text-gray-400 text-xs sm:text-sm">Owner, The Vibe Club</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="bg-blue-500/10 rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-blue-400 font-bold text-base sm:text-xl">+40%</p>
                      <p className="text-gray-400 text-xs">Sales Growth</p>
                    </div>
                    <div className="bg-green-500/10 rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-green-400 font-bold text-base sm:text-xl">156</p>
                      <p className="text-gray-400 text-xs">Events</p>
                    </div>
                    <div className="bg-orange-500/10 rounded-lg p-2 sm:p-3 text-center">
                      <p className="text-orange-400 font-bold text-base sm:text-xl">4.9★</p>
                      <p className="text-gray-400 text-xs">Rating</p>
                    </div>
                  </div>

                  <p className="text-gray-300 text-xs sm:text-sm leading-relaxed italic mb-3 sm:mb-4">
                    "We switched from our previous platform and saw ticket sales increase by 40%. 
                    The mobile check-in app is a game-changer for our weekly shows, and fans love 
                    the transparent pricing."
                  </p>

                  <button className="text-blue-400 text-xs sm:text-sm font-medium hover:text-blue-300 transition-colors flex items-center gap-1">
                    Read Full Case Study
                    <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Urgency/Early Adopter */}
          <section id="early-adopter">
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl sm:text-2xl mb-2 sm:mb-3">Early Adopter Offer</h3>
                  <p className="text-white/90 text-sm sm:text-base md:text-lg mb-4 sm:mb-6 leading-relaxed">
                    First 100 organizers get <strong>0% platform fees on their first event</strong> + 
                    dedicated onboarding with our founder. Lock in transparent pricing before everyone else does.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                      <div>
                        <p className="text-white font-bold text-lg sm:text-xl">47 spots remaining</p>
                        <p className="text-white/70 text-xs sm:text-sm">Don't miss out</p>
                      </div>
                    </div>
                    <Link 
                    href="/auth/organizer-login"
                    className="w-full sm:w-auto bg-white hover:bg-gray-100 text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-colors text-sm sm:text-base"
                      >
                        Claim Your Spot
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">Common Questions</h2>
            <div className="space-y-2 sm:space-y-3">
              {faqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-800 transition-colors text-left"
                    >
                      <h3 className="text-white font-semibold text-sm sm:text-base pr-4">{faq.question}</h3>
                      <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {isExpanded && (
                      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t border-gray-800">
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Final CTA */}
          <section id="final-cta">
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6 sm:p-8 text-center">
              <Target className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400 mx-auto mb-4 sm:mb-6" />
              <h2 className="text-white font-bold text-2xl sm:text-3xl mb-3 sm:mb-4">Ready to Transform Your Ticketing?</h2>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                Join event organizers who've already made the switch to transparent, 
                fan-first ticketing. No setup fees, no long-term contracts—just fair pricing 
                and powerful tools.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                <Link
                href="/auth/organizer-login"
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-colors text-sm sm:text-base"
                  >
                    Get Started Free
                </Link>
                <Link href="/contact">
                  <button className="w-full sm:w-auto bg-gray-800 hover:bg-gray-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold transition-colors text-sm sm:text-base">
                    Schedule a Demo
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-12 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Mobile App Download - Only visible on mobile */}
          <div className="block sm:hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-center">
              <Smartphone className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-bold text-sm mb-1">Download the Lurexo App</h3>
              <p className="text-white/80 text-xs mb-3">Get tickets on the go</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors">
                  App Store
                </button>
                <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors">
                  Google Play
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
              About Us
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/how-it-works" className="text-gray-400 hover:text-purple-400 transition-colors">
              How it Works
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
              Contact Us
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
          </div>
          <p className="text-center text-gray-600 text-xs mt-4 sm:mt-6">
            © 2025 Lurexo Ltd. All rights reserved. Built for artists, powered by fans.
          </p>
        </div>
      </footer>
    </div>
  );
}