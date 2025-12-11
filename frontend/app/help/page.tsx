'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Search,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  Ticket,
  CreditCard,
  Shield,
  Bell,
  MessageCircle,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Smartphone
} from 'lucide-react';

const FAQ_CATEGORIES = [
  {
    id: 'tickets',
    name: 'Tickets & Orders',
    icon: Ticket,
    color: 'purple',
    count: 12
  },
  {
    id: 'payment',
    name: 'Payment & Refunds',
    icon: CreditCard,
    color: 'green',
    count: 8
  },
  {
    id: 'account',
    name: 'Account & Security',
    icon: Shield,
    color: 'blue',
    count: 10
  },
  {
    id: 'events',
    name: 'Events & Venues',
    icon: Bell,
    color: 'orange',
    count: 6
  }
];

const POPULAR_FAQS = [
  {
    id: 'faq-1',
    category: 'tickets',
    question: 'How do I download my tickets?',
    answer: 'You can download your tickets from the "My Tickets" section or via the email confirmation sent after purchase. Tickets are available as PDF, Apple Wallet, or Google Pay formats.'
  },
  {
    id: 'faq-2',
    category: 'payment',
    question: 'What payment methods do you accept?',
    answer: 'We accept Visa, Mastercard, American Express, Apple Pay, and Google Pay. All payments are processed securely through our encrypted payment system.'
  },
  {
    id: 'faq-3',
    category: 'tickets',
    question: 'Can I transfer my ticket to someone else?',
    answer: 'Yes! Most tickets can be transferred through your account. Go to "My Tickets", select the ticket you want to transfer, and click "Transfer Ticket". The recipient will receive an email with their ticket.'
  },
  {
    id: 'faq-4',
    category: 'payment',
    question: 'How do refunds work?',
    answer: 'Refund policies vary by event. If an event is cancelled, you\'ll automatically receive a full refund within 5-10 business days. For other refund requests, check the event\'s refund policy or contact the organizer.'
  },
  {
    id: 'faq-5',
    category: 'account',
    question: 'I forgot my password. What should I do?',
    answer: 'Click "Forgot Password" on the login page. We\'ll send you an email with instructions to reset your password. Make sure to check your spam folder if you don\'t see it.'
  },
  {
    id: 'faq-6',
    category: 'tickets',
    question: 'What happens if I lose my ticket?',
    answer: 'Don\'t worry! You can access your tickets anytime through your account. Simply log in and go to "My Tickets" to view and download them again.'
  },
  {
    id: 'faq-7',
    category: 'events',
    question: 'How do I know if an event is cancelled?',
    answer: 'We\'ll notify you immediately via email, push notification, and SMS if an event is cancelled or rescheduled. You can also check the event page for the latest updates.'
  },
  {
    id: 'faq-8',
    category: 'account',
    question: 'How do I change my email address?',
    answer: 'Go to Profile > Edit Profile > Email Address. Enter your new email and confirm the change. You\'ll receive a verification email to confirm your new address.'
  }
];

export default function HelpCenterPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredFaqs = POPULAR_FAQS.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getColorClass = (color: string, type = 'bg') => {
    const colors: Record<string, Record<string, string>> = {
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
      green: { bg: 'bg-green-500/20', text: 'text-green-400' },
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-400' }
    };
    return colors[color]?.[type] || colors.purple[type];
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
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
                <h1 className="text-white font-bold text-sm sm:text-lg">Help Center</h1>
                <p className="text-gray-400 text-xs">Find answers and get support</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-white font-bold text-sm">Help Center</h1>
              </div>
            </Link>
          </div>
          
          <Link href="/contact">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-base">
              Contact Support
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <HelpCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">How can we help?</h1>
            <p className="text-white/80 text-base sm:text-lg mb-6 sm:mb-8">We're here to assist you 24/7</p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6 sm:mb-0">
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search help articles..."
                className="w-full bg-gray-900 text-white pl-12 sm:pl-16 pr-4 sm:pr-6 py-4 sm:py-5 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm sm:text-base md:text-lg"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-white/90 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Live Chat</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-8 sm:space-y-12">
        {/* Categories */}
        <section>
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {FAQ_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : category.id)}
                  className={`p-4 sm:p-6 rounded-2xl border-2 transition-all text-center ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${getColorClass(category.color, 'bg')} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${getColorClass(category.color, 'text')}`} />
                  </div>
                  <p className={`font-semibold text-sm sm:text-base mb-1 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {category.name}
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm">
                    {category.count} articles
                  </p>
                </button>
              );
            })}
          </div>
          {selectedCategory !== 'all' && (
            <div className="text-center mt-4 sm:mt-6">
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-purple-400 font-medium hover:text-purple-300 transition-colors text-sm sm:text-base"
              >
                Show all categories
              </button>
            </div>
          )}
        </section>

        {/* Quick Actions - New! */}
        <section className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 sm:p-8 border border-blue-500/20">
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <Link href="/profile/tickets">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6 hover:border-blue-500/30 transition-colors text-center group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-500/30 transition-colors">
                  <Ticket className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                </div>
                <p className="text-white font-semibold text-sm sm:text-base mb-1">View My Tickets</p>
                <p className="text-gray-400 text-xs sm:text-sm">Access all your tickets</p>
              </div>
            </Link>
            <Link href="/contact">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6 hover:border-green-500/30 transition-colors text-center group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-500/30 transition-colors">
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
                <p className="text-white font-semibold text-sm sm:text-base mb-1">Contact Support</p>
                <p className="text-gray-400 text-xs sm:text-sm">Get help from our team</p>
              </div>
            </Link>
            <Link href="/profile/account">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 sm:p-6 hover:border-purple-500/30 transition-colors text-center group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-500/30 transition-colors">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <p className="text-white font-semibold text-sm sm:text-base mb-1">Account Settings</p>
                <p className="text-gray-400 text-xs sm:text-sm">Manage your account</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Popular Questions */}
        <section>
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">
            {searchQuery ? 'Search Results' : selectedCategory !== 'all' ? 'FAQs in this category' : 'Popular Questions'}
          </h2>

          {filteredFaqs.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-8 sm:p-16 text-center border border-gray-800">
              <Search className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-4 sm:mb-6" />
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">No results found</h3>
              <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
                Try different keywords or browse by category
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-purple-400 font-medium hover:text-purple-300 text-sm sm:text-base"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-5 sm:p-6 flex items-start justify-between hover:bg-gray-800 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 flex-shrink-0 mt-1" />
                        <p className="text-white font-medium pr-4 text-sm sm:text-base">
                          {faq.question}
                        </p>
                      </div>
                      <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {isExpanded && (
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-gray-800">
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4 mb-3 sm:mb-4">
                          {faq.answer}
                        </p>
                        <div className="flex gap-4 text-xs sm:text-sm">
                          <button className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                            Was this helpful?
                          </button>
                          <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                            Contact support
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Video Tutorials - New! */}
        <section>
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">Video Tutorials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Tutorial 1 */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-purple-500/30 transition-colors group">
              <div className="relative bg-gradient-to-br from-purple-900/20 to-blue-900/20 aspect-video flex items-center justify-center">
                {/* Subtle pattern */}
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
                
                <button className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                  <div className="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-l-[12px] sm:border-l-[16px] border-l-white border-b-[8px] sm:border-b-[10px] border-b-transparent ml-1"></div>
                </button>
                
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                  2:15
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-white font-semibold text-sm sm:text-base mb-2">How to Buy Tickets</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Learn the basics of purchasing tickets on Lurexo</p>
              </div>
            </div>

            {/* Tutorial 2 */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-blue-500/30 transition-colors group">
              <div className="relative bg-gradient-to-br from-blue-900/20 to-cyan-900/20 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
                
                <button className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                  <div className="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-l-[12px] sm:border-l-[16px] border-l-white border-b-[8px] sm:border-b-[10px] border-b-transparent ml-1"></div>
                </button>
                
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                  1:45
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-white font-semibold text-sm sm:text-base mb-2">Transferring Tickets</h3>
                <p className="text-gray-400 text-xs sm:text-sm">Step-by-step guide to transferring tickets to friends</p>
              </div>
            </div>

            {/* Tutorial 3 */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden hover:border-green-500/30 transition-colors group">
              <div className="relative bg-gradient-to-br from-green-900/20 to-emerald-900/20 aspect-video flex items-center justify-center">
                <div className="absolute inset-0 opacity-5" style={{
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}></div>
                
                <button className="relative z-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all group-hover:scale-110">
                  <div className="w-0 h-0 border-t-[8px] sm:border-t-[10px] border-t-transparent border-l-[12px] sm:border-l-[16px] border-l-white border-b-[8px] sm:border-b-[10px] border-b-transparent ml-1"></div>
                </button>
                
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-medium">
                  3:00
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <h3 className="text-white font-semibold text-sm sm:text-base mb-2">Reselling Safely</h3>
                <p className="text-gray-400 text-xs sm:text-sm">How to list tickets for resale at fair prices</p>
              </div>
            </div>
          </div>
          <div className="text-center mt-4 sm:mt-6">
            <Link href="/tutorials" className="text-purple-400 font-medium hover:text-purple-300 transition-colors inline-flex items-center gap-2 text-sm sm:text-base">
              View all tutorials
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        </section>

        {/* Community Resources - New! */}
        <section className="bg-gray-900 rounded-2xl p-6 sm:p-10 border border-gray-800">
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-center">Community Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-gray-800 rounded-xl p-5 sm:p-6 border border-gray-700 hover:border-purple-500/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">Community Forum</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                Connect with other fans, share tips, and get advice from the community
              </p>
              <Link href="/community" className="text-blue-400 font-medium hover:text-blue-300 transition-colors inline-flex items-center gap-2 text-xs sm:text-sm">
                Visit Forum
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>

            <div className="bg-gray-800 rounded-xl p-5 sm:p-6 border border-gray-700 hover:border-green-500/30 transition-colors">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center mb-3 sm:mb-4">
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-base sm:text-lg mb-2">Status Updates</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
                Check system status and subscribe to get notified of any issues
              </p>
              <Link href="/status" className="text-green-400 font-medium hover:text-green-300 transition-colors inline-flex items-center gap-2 text-xs sm:text-sm">
                View Status
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Support CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-12">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3 text-center">Still need help?</h3>
            <p className="text-white/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 text-center">
              Our support team is ready to assist you with any questions
            </p>
            <div className="flex justify-center max-w-xs mx-auto">
              <Link href="/contact" className="w-full">
                <button className="w-full bg-white hover:bg-gray-100 text-purple-600 py-3 sm:py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                  <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Support
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20 max-w-md mx-auto">
              <a href="tel:+442012345678" className="flex items-center justify-center gap-3 text-white/90 hover:text-white transition-colors text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Call Us</span>
              </a>
              <a href="mailto:support@lurexo.com" className="flex items-center justify-center gap-3 text-white/90 hover:text-white transition-colors text-sm sm:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Email Us</span>
              </a>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8 sm:mt-12">
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
            <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
              Contact Us
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/faq" className="text-gray-400 hover:text-purple-400 transition-colors">
              FAQ
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-center text-gray-600 text-xs mt-4 sm:mt-6">
            © 2025 Lurexo Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}