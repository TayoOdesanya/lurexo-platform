'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  MessageCircle,
  Mail,
  Phone,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Ticket,
  CreditCard,
  Shield,
  User,
  Paperclip,
  MapPin,
  Globe,
  Users,
  ChevronRight,
  Smartphone
} from 'lucide-react';

const INQUIRY_TYPES = [
  { id: 'ticket', label: 'Ticket Issue', icon: Ticket },
  { id: 'payment', label: 'Payment Problem', icon: CreditCard },
  { id: 'account', label: 'Account Help', icon: User },
  { id: 'security', label: 'Security Concern', icon: Shield },
  { id: 'other', label: 'Other', icon: HelpCircle }
];

const PRIORITY_LEVELS = [
  { id: 'low', label: 'Low Priority', description: 'Response within 48 hours', color: 'green' },
  { id: 'medium', label: 'Medium Priority', description: 'Response within 24 hours', color: 'yellow' },
  { id: 'high', label: 'High Priority', description: 'Response within 4 hours', color: 'orange' },
  { id: 'urgent', label: 'Urgent', description: 'Immediate response', color: 'red' }
];

export default function ContactUsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    inquiryType: '',
    priority: 'medium',
    subject: '',
    message: '',
    orderNumber: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.inquiryType) {
      newErrors.inquiryType = 'Please select an inquiry type';
    }
    if (!formData.subject || formData.subject.trim().length < 5) {
      newErrors.subject = 'Subject must be at least 5 characters';
    }
    if (!formData.message || formData.message.trim().length < 20) {
      newErrors.message = 'Message must be at least 20 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      urgent: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[priority] || colors.medium;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black">
        <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-4">
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
              <h1 className="text-white font-bold text-sm sm:text-lg">Contact Us</h1>
            </Link>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
          <div className="bg-gray-900 rounded-2xl p-6 sm:p-12 text-center border border-gray-800">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-green-400" />
            </div>
            <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2 sm:mb-3">Message Sent Successfully!</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-6 sm:mb-8 max-w-lg mx-auto">
              We've received your message and our support team will review it shortly. 
              A confirmation email has been sent to <strong className="text-white">{formData.email}</strong>
            </p>

            {/* Reference Number */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 max-w-md mx-auto">
              <p className="text-gray-400 text-xs sm:text-sm mb-2">Support Ticket Reference</p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-white font-mono text-xl sm:text-2xl">#SUP-{Date.now().toString().slice(-6)}</p>
                <button 
                  onClick={() => navigator.clipboard.writeText(`SUP-${Date.now().toString().slice(-6)}`)}
                  className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-2">Save this for your records</p>
            </div>

            {/* Expected Response */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                <div className="text-center">
                  <p className="text-blue-400 font-semibold text-sm sm:text-base">Expected Response Time</p>
                  <p className="text-blue-300/80 text-xs sm:text-sm">
                    {PRIORITY_LEVELS.find(p => p.id === formData.priority)?.description}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-blue-500/20">
                <p className="text-blue-300/70 text-xs">
                  You'll receive an email notification when we respond
                </p>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-lg mx-auto text-left">
              <h3 className="text-white font-semibold text-base sm:text-lg mb-4 text-center">What Happens Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-purple-400 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white text-xs sm:text-sm font-medium">We'll review your message</p>
                    <p className="text-gray-400 text-xs">Our team will assess your issue and priority level</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-400 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white text-xs sm:text-sm font-medium">You'll receive a response</p>
                    <p className="text-gray-400 text-xs">Via email with your reference number</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-green-400 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white text-xs sm:text-sm font-medium">We'll resolve your issue</p>
                    <p className="text-gray-400 text-xs">With step-by-step guidance or direct assistance</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <button
                onClick={() => router.back()}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
              >
                Go Back
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base"
              >
                Send Another Message
              </button>
            </div>

            {/* Help Links */}
            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-xs sm:text-sm mb-4">While you wait, you might find these helpful:</p>
              <div className="flex justify-center gap-4">
                <Link href="/help" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium">
                  Help Center
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/faq" className="text-purple-400 hover:text-purple-300 text-xs sm:text-sm font-medium">
                  FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                <h1 className="text-white font-bold text-sm sm:text-lg">Contact Us</h1>
                <p className="text-gray-400 text-xs">Get in touch with our support team</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-white font-bold text-sm">Contact Us</h1>
              </div>
            </Link>
          </div>
          
          <Link href="/help">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-base">
              Help Center
            </button>
          </Link>
        </div>
      </header>

      {/* Mini-Hero Section */}
      <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">We're Here to Help</h1>
            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-4 sm:mb-6">
              Our support team is available 24/7. We typically respond within 2 hours for urgent inquiries.
            </p>
            
            {/* Quick Stats - Mobile: Stacked, Desktop: Side by Side */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                <span>Avg. response: <strong className="text-green-400">2 hours</strong></span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                <span><strong className="text-blue-400">98%</strong> satisfaction rate</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
                <span><strong className="text-purple-400">24/7</strong> availability</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Layout - Mobile: Stacked, Desktop: Side by Side */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar - Hidden on mobile, sticky on desktop */}
        <aside className="hidden lg:block lg:w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Contact Methods */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-white font-bold mb-4">Get in Touch</h3>
              <div className="space-y-4">
                <a href="mailto:support@lurexo.co.uk" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Email</p>
                    <p className="text-xs">support@lurexo.co.uk</p>
                  </div>
                </a>
                <a href="tel:+442012345678" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">Phone</p>
                    <p className="text-xs">+44 20 1234 5678</p>
                  </div>
                </a>
                <button 
                  onClick={() => alert('Live chat coming soon!')}
                  className="w-full flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-green-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">Live Chat</p>
                    <p className="text-xs">Coming soon</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Response Times by Priority */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-4">Expected Response Times</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                    <span className="text-red-400 text-sm font-medium">Urgent</span>
                  </div>
                  <span className="text-white text-sm font-bold">&lt;30 min</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span className="text-orange-400 text-sm font-medium">High</span>
                  </div>
                  <span className="text-white text-sm font-bold">4 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-yellow-400 text-sm font-medium">Medium</span>
                  </div>
                  <span className="text-white text-sm font-bold">24 hours</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-green-400 text-sm font-medium">Low</span>
                  </div>
                  <span className="text-white text-sm font-bold">48 hours</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Clock className="w-4 h-4" />
                  <span>Times are estimates during business hours</span>
                </div>
              </div>
            </div>

            {/* Office Info */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h3 className="text-white font-semibold mb-4">Lurexo Ltd</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2 text-gray-400">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Registered in England and Wales</span>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                  <Globe className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Company Number: [To be added]</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Form */}
        <main className="flex-1">
          {/* FAQ Quick Links */}
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-start gap-3 mb-4">
              <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-blue-400 font-bold text-sm sm:text-base mb-1">Before You Contact Us</h3>
                <p className="text-blue-300/80 text-xs sm:text-sm">
                  Your question might already be answered. Check these common topics:
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link href="/faq#tickets">
                <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-left transition-colors group">
                  <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-2" />
                  <p className="text-white text-xs sm:text-sm font-medium group-hover:text-blue-400 transition-colors">
                    Ticket Issues
                  </p>
                  <p className="text-blue-300/70 text-xs">Download, transfer, lost tickets</p>
                </button>
              </Link>
              
              <Link href="/faq#payment">
                <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-left transition-colors group">
                  <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-2" />
                  <p className="text-white text-xs sm:text-sm font-medium group-hover:text-blue-400 transition-colors">
                    Refunds
                  </p>
                  <p className="text-blue-300/70 text-xs">Cancellations, refund policy</p>
                </button>
              </Link>
              
              <Link href="/faq#account">
                <button className="w-full bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-left transition-colors group">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 mb-2" />
                  <p className="text-white text-xs sm:text-sm font-medium group-hover:text-blue-400 transition-colors">
                    Account Help
                  </p>
                  <p className="text-blue-300/70 text-xs">Password, email, security</p>
                </button>
              </Link>
            </div>

            <div className="mt-4 pt-4 border-t border-blue-500/20">
              <Link href="/help" className="flex items-center justify-center gap-2 text-blue-400 hover:text-blue-300 transition-colors text-xs sm:text-sm font-medium">
                <span>Visit Full Help Center</span>
                <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </Link>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Inquiry Type */}
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-8 border border-gray-800">
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2">What can we help you with?</h3>
              <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">Select the category that best describes your issue for faster routing</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {INQUIRY_TYPES.map((type) => {
                  const Icon = type.icon;
                  const isSelected = formData.inquiryType === type.id;

                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => handleInputChange('inquiryType', type.id)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                      }`}
                    >
                      <Icon className={`w-6 h-6 sm:w-7 sm:h-7 mb-2 mx-auto ${
                        isSelected ? 'text-purple-400' : 'text-gray-400'
                      }`} />
                      <p className={`text-xs sm:text-sm font-medium ${
                        isSelected ? 'text-white' : 'text-gray-400'
                      }`}>
                        {type.label}
                      </p>
                    </button>
                  );
                })}
              </div>
              {errors.inquiryType && (
                <p className="text-red-400 text-xs sm:text-sm mt-3 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {errors.inquiryType}
                </p>
              )}
            </div>

            {/* Personal Details & Priority - Mobile: Stacked, Desktop: Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Personal Details */}
              <div className="bg-gray-900 rounded-2xl p-4 sm:p-8 border border-gray-800 space-y-4">
                <h3 className="text-white font-bold text-lg sm:text-xl">Your Details</h3>
                
                <div>
                  <label className="text-gray-400 text-xs sm:text-sm mb-2 block">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-xs sm:text-sm mb-2 block">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                    readOnly
                  />
                </div>

                {formData.inquiryType === 'ticket' && (
                  <div>
                    <label className="text-gray-400 text-xs sm:text-sm mb-2 block">
                      Order Number <span className="text-gray-600">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                      placeholder="e.g., LRX-2024-1234"
                      className="w-full bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
                    />
                  </div>
                )}
              </div>

              {/* Priority */}
              <div className="bg-gray-900 rounded-2xl p-4 sm:p-8 border border-gray-800">
                <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Priority Level</h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-4">Choose based on urgency. This helps us respond faster to critical issues.</p>
                <div className="space-y-3">
                  {PRIORITY_LEVELS.map((priority) => {
                    const isSelected = formData.priority === priority.id;

                    return (
                      <button
                        key={priority.id}
                        type="button"
                        onClick={() => handleInputChange('priority', priority.id)}
                        className={`w-full p-3 sm:p-4 rounded-lg flex items-center justify-between transition-all border-2 ${
                          isSelected
                            ? getPriorityColor(priority.id)
                            : 'bg-gray-800 border-transparent hover:border-gray-700'
                        }`}
                      >
                        <div className="text-left">
                          <p className={`text-xs sm:text-sm font-semibold ${
                            isSelected ? '' : 'text-gray-400'
                          }`}>
                            {priority.label}
                          </p>
                          <p className={`text-xs ${
                            isSelected ? 'opacity-80' : 'text-gray-500'
                          }`}>
                            {priority.description}
                          </p>
                        </div>
                        {isSelected && <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="bg-gray-900 rounded-2xl p-4 sm:p-8 border border-gray-800 space-y-4">
              <h3 className="text-white font-bold text-lg sm:text-xl">Your Message</h3>

              <div>
                <label className="text-gray-400 text-xs sm:text-sm mb-2 block">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Brief description of your issue"
                  className={`w-full bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${
                    errors.subject ? 'border-red-500' : 'border-gray-700'
                  } focus:outline-none focus:border-purple-500 text-sm sm:text-base`}
                />
                {errors.subject && (
                  <p className="text-red-400 text-xs sm:text-sm mt-2 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <label className="text-gray-400 text-xs sm:text-sm mb-2 block">Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  placeholder="Please provide as much detail as possible. Include:
• What you were trying to do
• What happened instead
• Any error messages you saw
• Steps to reproduce (if applicable)"
                  rows={8}
                  className={`w-full bg-gray-800 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg border ${
                    errors.message ? 'border-red-500' : 'border-gray-700'
                  } focus:outline-none focus:border-purple-500 resize-none text-sm sm:text-base`}
                />
                <div className="flex items-center justify-between mt-2">
                  {errors.message ? (
                    <p className="text-red-400 text-xs sm:text-sm flex items-center gap-2">
                      <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      {errors.message}
                    </p>
                  ) : (
                    <p className={`text-xs sm:text-sm ${
                      formData.message.length < 20 
                        ? 'text-gray-500' 
                        : formData.message.length < 50 
                        ? 'text-yellow-400' 
                        : 'text-green-400'
                    }`}>
                      {formData.message.length} characters {formData.message.length < 20 ? '(minimum 20)' : ''}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => alert('File attachment coming soon!')}
                  className="w-full bg-gray-800 hover:bg-gray-700 text-gray-400 py-3 sm:py-4 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <Paperclip className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">Attach Files (Optional)</span>
                </button>
                <p className="text-gray-500 text-xs mt-2">
                  You can attach screenshots or documents (Max 10MB)
                </p>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-3 sm:py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </main>
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
            <Link href="/help" className="text-gray-400 hover:text-purple-400 transition-colors">
              Help Center
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