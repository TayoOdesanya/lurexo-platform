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
  User,
  Users,
  MessageCircle,
  BookOpen,
  ExternalLink,
  Phone,
  Mail,
  Clock,
  LucideIcon
} from 'lucide-react';

// Type definitions
type ColorType = 'purple' | 'green' | 'blue' | 'orange';

interface FAQCategory {
  id: string;
  name: string;
  icon: LucideIcon;
  color: ColorType;
  count: number;
}

interface FAQ {
  id: string;
  category: string;
  question: string;
  answer: string;
}

interface QuickLink {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: ColorType;
  external?: boolean;
}

// FAQ Categories
const FAQ_CATEGORIES: FAQCategory[] = [
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

// Popular FAQs
const POPULAR_FAQS: FAQ[] = [
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

// Quick Links
const QUICK_LINKS: QuickLink[] = [
  {
    title: 'Contact Support',
    description: 'Get help from our team',
    icon: MessageCircle,
    href: '/profile/contact',
    color: 'purple'
  },
  {
    title: 'Community Forum',
    description: 'Ask the community',
    icon: Users,
    href: '#',
    color: 'blue',
    external: true
  },
  {
    title: 'Video Tutorials',
    description: 'Watch how-to guides',
    icon: BookOpen,
    href: '#',
    color: 'green',
    external: true
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

  const getColorClass = (color: ColorType, type: 'bg' | 'text' = 'bg'): string => {
    const colors: Record<ColorType, Record<'bg' | 'text', string>> = {
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
      green: { bg: 'bg-green-500/20', text: 'text-green-400' },
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-400' }
    };
    return colors[color][type];
  };

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* MOBILE ONLY: Header */}
      <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/profile">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">Help Center</h1>
            <p className="text-gray-400 text-xs">Find answers and get support</p>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
          />
        </div>
      </div>

      {/* DESKTOP ONLY: Page header */}
      <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="px-6 pt-8 pb-6">
          <h1 className="text-white text-2xl font-bold mb-2">Help Center</h1>
          <p className="text-gray-400 text-sm mb-6">Find answers and get support</p>
          
          {/* Search Bar - Desktop */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search help articles..."
              className="w-full bg-gray-800 text-white pl-12 pr-4 py-4 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-base"
            />
          </div>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg">How can we help?</h2>
              <p className="text-white/80 text-sm">We're here to assist you 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Clock className="w-4 h-4" />
              <span>Available 24/7</span>
            </div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <MessageCircle className="w-4 h-4" />
              <span>Live Chat</span>
            </div>
          </div>
        </div>

        {/* FAQ Categories */}
        <div>
          <h3 className="text-white font-semibold mb-3">Browse by Category</h3>
          <div className="grid grid-cols-2 gap-3">
            {FAQ_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : category.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 ${getColorClass(category.color, 'bg')} rounded-lg flex items-center justify-center mb-2`}>
                    <Icon className={`w-5 h-5 ${getColorClass(category.color, 'text')}`} />
                  </div>
                  <p className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {category.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {category.count} articles
                  </p>
                </button>
              );
            })}
          </div>
          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="w-full mt-3 py-2 text-purple-400 text-sm font-medium hover:text-purple-300 transition-colors"
            >
              Show all categories
            </button>
          )}
        </div>

        {/* Popular FAQs */}
        <div>
          <h3 className="text-white font-semibold mb-3">
            {searchQuery ? 'Search Results' : selectedCategory !== 'all' ? 'FAQs in this category' : 'Popular Questions'}
          </h3>

          {filteredFaqs.length === 0 ? (
            <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No results found</h3>
              <p className="text-gray-400 text-sm">
                Try different keywords or browse by category
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFaqs.map((faq) => {
                const isExpanded = expandedFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-4 flex items-start justify-between hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex items-start gap-3 flex-1 text-left">
                        <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                        <p className="text-white text-sm font-medium pr-4">
                          {faq.question}
                        </p>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-gray-800">
                        <p className="text-gray-300 text-sm leading-relaxed mt-3">
                          {faq.answer}
                        </p>
                        <div className="flex gap-2 mt-4">
                          <button className="text-purple-400 text-xs font-medium hover:text-purple-300 transition-colors">
                            Was this helpful?
                          </button>
                          <span className="text-gray-600">•</span>
                          <button className="text-gray-400 text-xs hover:text-white transition-colors">
                            Contact support
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-3">More Ways to Get Help</h3>
          <div className="space-y-3">
            {QUICK_LINKS.map((link) => {
              const Icon = link.icon;

              return (
                <Link 
                  key={link.title}
                  href={link.href}
                  className="block"
                >
                  <button className="w-full bg-gray-900 hover:bg-gray-800 rounded-xl p-4 border border-gray-800 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 ${getColorClass(link.color, 'bg')} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${getColorClass(link.color, 'text')}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-white font-medium text-sm">{link.title}</p>
                        <p className="text-gray-400 text-xs">{link.description}</p>
                      </div>
                      {link.external ? (
                        <ExternalLink className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  </button>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6">
          <h3 className="text-white font-bold text-lg mb-2">Still need help?</h3>
          <p className="text-white/80 text-sm mb-4">
            Our support team is ready to assist you with any questions
          </p>
          <div className="flex gap-3">
            <Link href="/contact" className="flex-1">
              <button className="w-full bg-white hover:bg-gray-100 text-purple-600 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Contact Support
              </button>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/20">
            <a href="tel:+442012345678" className="flex items-center gap-2 text-white/90 text-sm">
              <Phone className="w-4 h-4" />
              <span>Call Us</span>
            </a>
            <a href="mailto:support@lurexo.com" className="flex items-center gap-2 text-white/90 text-sm">
              <Mail className="w-4 h-4" />
              <span>Email Us</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}