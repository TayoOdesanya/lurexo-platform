'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  ArrowLeft,
  Search,
  ChevronDown,
  HelpCircle,
  Ticket,
  CreditCard,
  Shield,
  Users,
  RefreshCw,
  Bell,
  Smartphone,
  Mail,
  MessageCircle,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Zap
} from 'lucide-react';
import Link from 'next/link';

export default function FAQPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Questions', icon: HelpCircle, count: 25, color: 'purple' },
    { id: 'tickets', name: 'Tickets & Orders', icon: Ticket, count: 8, color: 'blue' },
    { id: 'payment', name: 'Payment & Refunds', icon: CreditCard, count: 6, color: 'green' },
    { id: 'account', name: 'Account & Security', icon: Shield, count: 7, color: 'orange' },
    { id: 'transfers', name: 'Transfers & Resale', icon: Users, count: 4, color: 'cyan' }
  ];

  const faqs = [
    {
      id: 'faq-1',
      category: 'tickets',
      question: 'How do I download my tickets?',
      answer: 'After purchasing tickets, you can download them from your account by going to "My Tickets". Tickets are available as PDF downloads, or you can add them to Apple Wallet or Google Pay. You\'ll also receive an email with a link to download your tickets immediately after purchase.',
      popular: true
    },
    {
      id: 'faq-2',
      category: 'tickets',
      question: 'Can I get a refund on my tickets?',
      answer: 'Refund policies vary by event and are set by the event organizer. You can view the refund policy on the event page before purchasing. If an event is cancelled by the organizer, you will automatically receive a full refund within 5-10 business days.',
      popular: true
    },
    {
      id: 'faq-3',
      category: 'tickets',
      question: 'What if I lose my tickets?',
      answer: 'Don\'t worry! Your tickets are safely stored in your Lurexo account. Simply log in and go to "My Tickets" to view and download them again. You can also access them through the email confirmation we sent you.',
      popular: false
    },
    {
      id: 'faq-4',
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), as well as Apple Pay and Google Pay. All payments are processed securely through our encrypted payment system.',
      popular: true
    },
    {
      id: 'faq-5',
      category: 'payment',
      question: 'Are there any hidden fees?',
      answer: 'No! Unlike other platforms, we show you the total price upfront with no hidden fees. What you see at checkout is exactly what you pay. Our service fee (typically 3-5%) is clearly displayed before you complete your purchase.',
      popular: true
    },
    {
      id: 'faq-6',
      category: 'payment',
      question: 'How long does a refund take?',
      answer: 'Refunds are typically processed within 5-10 business days. The exact timing depends on your bank or card issuer. You\'ll receive an email confirmation once the refund has been initiated.',
      popular: false
    },
    {
      id: 'faq-7',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'Click "Forgot Password" on the login page. We\'ll send you an email with instructions to reset your password. Make sure to check your spam folder if you don\'t see it within a few minutes.',
      popular: false
    },
    {
      id: 'faq-8',
      category: 'account',
      question: 'Is my personal information secure?',
      answer: 'Yes. We use bank-level encryption (SSL) to protect your personal and payment information. We\'re also fully compliant with GDPR and PCI DSS standards. We never sell your data to third parties.',
      popular: true
    },
    {
      id: 'faq-9',
      category: 'account',
      question: 'Can I change my email address?',
      answer: 'Yes! Go to Profile > Settings > Account Information. Enter your new email address and confirm the change. You\'ll receive a verification email to confirm your new address.',
      popular: false
    },
    {
      id: 'faq-10',
      category: 'transfers',
      question: 'How do I transfer tickets to someone else?',
      answer: 'Go to "My Tickets", select the ticket you want to transfer, and click "Transfer Ticket". Enter the recipient\'s email address and they\'ll receive the ticket instantly. Transfers are 100% free.',
      popular: true
    },
    {
      id: 'faq-11',
      category: 'transfers',
      question: 'Can I resell my tickets?',
      answer: 'Yes! You can list tickets for resale on our marketplace. To protect fans, resale prices are capped at 110% of the face value. When your ticket sells, you\'ll receive payment within 24 hours.',
      popular: false
    },
    {
      id: 'faq-12',
      category: 'transfers',
      question: 'Is there a fee for transferring tickets?',
      answer: 'No! Ticket transfers are completely free. We believe your tickets should be yours to share with friends and family without any charges.',
      popular: true
    },
    {
      id: 'faq-13',
      category: 'tickets',
      question: 'When will I receive my tickets?',
      answer: 'Tickets are delivered instantly via email after your purchase is complete. You can also access them immediately in your account under "My Tickets".',
      popular: false
    },
    {
      id: 'faq-14',
      category: 'tickets',
      question: 'Can I buy tickets as a gift?',
      answer: 'Yes! After purchasing, you can transfer the tickets to the recipient\'s email address. They\'ll receive the tickets directly and can add them to their own account.',
      popular: false
    },
    {
      id: 'faq-15',
      category: 'payment',
      question: 'Why was my payment declined?',
      answer: 'Payment declines can happen for various reasons: insufficient funds, incorrect card details, or your bank flagging the transaction. Try using a different payment method or contact your bank. If the problem persists, contact our support team.',
      popular: false
    },
    {
      id: 'faq-16',
      category: 'account',
      question: 'How do I delete my account?',
      answer: 'Go to Profile > Settings > Account Information > Delete Account. Please note that deleting your account is permanent and you\'ll lose access to any tickets or order history.',
      popular: false
    },
    {
      id: 'faq-17',
      category: 'tickets',
      question: 'What happens if an event is cancelled?',
      answer: 'If an event is cancelled by the organizer, you\'ll automatically receive a full refund within 5-10 business days. We\'ll also send you an email notification with all the details.',
      popular: false
    },
    {
      id: 'faq-18',
      category: 'tickets',
      question: 'Can I change the name on my ticket?',
      answer: 'Most tickets on Lurexo are transferable. Instead of changing the name, you can transfer the ticket to the person who will be attending. This is free and takes just a few seconds.',
      popular: false
    },
    {
      id: 'faq-19',
      category: 'payment',
      question: 'Do you offer payment plans?',
      answer: 'Payment plans are available for select events. You\'ll see the option at checkout if the event organizer has enabled payment plans. Terms and conditions vary by event.',
      popular: false
    },
    {
      id: 'faq-20',
      category: 'account',
      question: 'Can I have multiple accounts?',
      answer: 'We recommend using a single account for all your ticket purchases. This makes it easier to manage your tickets and ensures you don\'t miss any important updates.',
      popular: false
    },
    {
      id: 'faq-21',
      category: 'transfers',
      question: 'Can I cancel a ticket transfer?',
      answer: 'Once a transfer is completed and accepted by the recipient, it cannot be cancelled. However, the recipient can transfer the ticket back to you if needed.',
      popular: false
    },
    {
      id: 'faq-22',
      category: 'tickets',
      question: 'Do I need to print my tickets?',
      answer: 'No! All our tickets are digital. You can show them on your phone at the venue. For extra convenience, add them to Apple Wallet or Google Pay for offline access.',
      popular: false
    },
    {
      id: 'faq-23',
      category: 'payment',
      question: 'Is it safe to enter my card details?',
      answer: 'Yes, absolutely. We use industry-standard SSL encryption and are PCI DSS compliant. Your card details are never stored on our servers – they go directly to our secure payment processor (Stripe).',
      popular: false
    },
    {
      id: 'faq-24',
      category: 'account',
      question: 'How do I enable two-factor authentication?',
      answer: 'Go to Profile > Settings > Security > Enable 2FA. We\'ll guide you through setting up authentication via SMS or an authenticator app for extra account security.',
      popular: false
    },
    {
      id: 'faq-25',
      category: 'transfers',
      question: 'What is the resale price cap?',
      answer: 'To protect fans from price gouging, we cap all resale prices at 110% of the original face value. This means tickets can only be sold for up to 10% more than their original price.',
      popular: false
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const popularFaqs = faqs.filter(faq => faq.popular);

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; border: string }> = {
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
      green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30' },
      cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/30' }
    };
    return colors[color] || colors.purple;
  };

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
                <h1 className="text-white font-bold text-sm sm:text-lg">Frequently Asked Questions</h1>
                <p className="text-gray-400 text-xs">Find answers to common questions</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-white font-bold text-sm">FAQ</h1>
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

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <HelpCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">How Can We Help?</h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
              Search our knowledge base or browse by category
            </p>
            
            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-6 sm:mb-8">
              <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for answers..."
                className="w-full bg-gray-900 text-white pl-12 sm:pl-16 pr-4 sm:pr-6 py-3 sm:py-4 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 text-sm sm:text-base md:text-lg"
              />
            </div>

            {/* Quick Stats */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span className="text-white/90"><strong className="text-green-400">1.8hr</strong> avg response</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                <span className="text-white/90"><strong className="text-yellow-400">98%</strong> resolved</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span className="text-white/90"><strong className="text-blue-400">24/7</strong> available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-8 sm:space-y-12">
        {/* Categories Grid */}
        <section>
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6 text-center">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              const colors = getColorClasses(category.color);

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 sm:p-6 rounded-2xl border-2 transition-all text-center ${
                    isSelected
                      ? `${colors.border} ${colors.bg}`
                      : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 ${colors.bg} rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${colors.text}`} />
                  </div>
                  <p className={`font-semibold text-xs sm:text-sm mb-1 ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                    {category.name}
                  </p>
                  <p className="text-gray-500 text-xs">
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
                className="text-purple-400 font-medium hover:text-purple-300 transition-colors text-xs sm:text-sm"
              >
                ← Show all categories
              </button>
            </div>
          )}
        </section>

        {/* Popular Questions - Only show when viewing all */}
        {selectedCategory === 'all' && searchQuery === '' && (
          <section>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400" />
              <h2 className="text-white font-bold text-xl sm:text-2xl">Most Popular Questions</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {popularFaqs.slice(0, 6).map((faq) => {
                const isExpanded = expandedFaq === faq.id;

                return (
                  <div
                    key={faq.id}
                    className="bg-gray-900 rounded-xl border border-orange-500/30 overflow-hidden hover:border-orange-500/50 transition-colors"
                  >
                    <button
                      onClick={() => setExpandedFaq(isExpanded ? null : faq.id)}
                      className="w-full p-4 sm:p-5 flex items-start justify-between hover:bg-gray-800 transition-colors text-left"
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-white font-medium pr-4 text-sm sm:text-base">
                          {faq.question}
                        </p>
                      </div>
                      <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {isExpanded && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-800">
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
        )}

        {/* All Questions */}
        <section>
          <h2 className="text-white font-bold text-xl sm:text-2xl mb-4 sm:mb-6">
            {searchQuery ? 'Search Results' : selectedCategory !== 'all' ? `${categories.find(c => c.id === selectedCategory)?.name} Questions` : 'All Questions'}
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
                      className="w-full p-4 sm:p-5 flex items-start justify-between hover:bg-gray-800 transition-colors text-left"
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
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-800">
                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4 mb-3 sm:mb-4">
                          {faq.answer}
                        </p>
                        <div className="flex gap-4 text-xs sm:text-sm">
                          <button className="text-purple-400 font-medium hover:text-purple-300 transition-colors">
                            Was this helpful?
                          </button>
                          <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                            Still need help?
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

        {/* Contact Support CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6 sm:mb-8">
              <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white mx-auto mb-3 sm:mb-4" />
              <h3 className="text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3">Can't Find What You're Looking For?</h3>
              <p className="text-white/90 text-sm sm:text-base md:text-lg">
                Our support team is ready to help you with any questions
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-2xl mx-auto">
              <Link href="/contact" className="flex-1">
                <button className="w-full bg-white hover:bg-gray-100 text-purple-600 py-3 sm:py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  Contact Support
                </button>
              </Link>
              <Link href="/help" className="flex-1">
                <button className="w-full bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white py-3 sm:py-4 rounded-xl font-bold transition-colors border-2 border-white/30 text-sm sm:text-base">
                  Browse Help Center
                </button>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/20 max-w-md mx-auto">
              <div className="text-center text-white/90">
                <p className="text-xs sm:text-sm mb-1">Avg Response Time</p>
                <p className="text-xl sm:text-2xl font-bold">1.8 hours</p>
              </div>
              <div className="text-center text-white/90">
                <p className="text-xs sm:text-sm mb-1">Satisfaction Rate</p>
                <p className="text-xl sm:text-2xl font-bold">98%</p>
              </div>
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
            <Link href="/help" className="text-gray-400 hover:text-purple-400 transition-colors">
              Help Center
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