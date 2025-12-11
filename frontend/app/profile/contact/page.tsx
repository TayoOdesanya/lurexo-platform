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
  Image as ImageIcon,
  Paperclip,
  X
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

  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleFileAttach = () => {
    // TODO: Implement file attachment
    alert('File attachment coming soon!');
  };

  const validateForm = () => {
    const newErrors = {};

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setSubmitting(false);
    setSubmitted(true);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-500/20 text-green-400 border-green-500/30',
      medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      urgent: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[priority] || colors.medium;
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black pb-6">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-800 p-4">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            </Link>
            <h1 className="text-white text-xl font-bold">Contact Us</h1>
          </div>
        </div>

        {/* Success State */}
        <div className="p-4">
          <div className="bg-gray-900 rounded-2xl p-8 text-center border border-gray-800">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-white text-xl font-bold mb-2">Message Sent!</h2>
            <p className="text-gray-400 text-sm mb-6">
              We've received your message and will get back to you soon. A confirmation has been sent to {formData.email}
            </p>

            {/* Ticket Reference */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <p className="text-gray-400 text-xs mb-1">Reference Number</p>
              <p className="text-white font-mono text-lg">#SUP-{Date.now().toString().slice(-6)}</p>
            </div>

            {/* Expected Response Time */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <p className="text-blue-400 font-semibold text-sm">Expected Response</p>
                  <p className="text-blue-300/80 text-xs">
                    {PRIORITY_LEVELS.find(p => p.id === formData.priority)?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href="/profile" className="flex-1">
                <button
                onClick={() => router.back()}
                className="flex-1 w-full bg-gray-800 hover:bg-gray-750 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Go Back
              </button>
              </Link>
              <button
                onClick={() => setSubmitted(false)}
                className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Send Another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* MOBILE ONLY: Header with back button */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </Link>
          <div>
            <h1 className="text-white text-xl font-bold">Contact Us</h1>
            <p className="text-gray-400 text-xs">Get in touch with our support team</p>
          </div>
        </div>
      </div>

      {/* DESKTOP ONLY: Simple page header */}
      <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-white text-2xl font-bold">Contact Us</h1>
          <p className="text-gray-400 text-sm">Get in touch with our support team</p>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Contact Methods */}
        <div className="grid grid-cols-3 gap-3">
          <a 
            href="mailto:support@lurexo.com"
            className="bg-gray-900 hover:bg-gray-800 rounded-xl p-4 border border-gray-800 transition-colors text-center"
          >
            <Mail className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">Email</p>
          </a>
          <a 
            href="tel:+442012345678"
            className="bg-gray-900 hover:bg-gray-800 rounded-xl p-4 border border-gray-800 transition-colors text-center"
          >
            <Phone className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">Phone</p>
          </a>
          <button 
            className="bg-gray-900 hover:bg-gray-800 rounded-xl p-4 border border-gray-800 transition-colors"
            onClick={() => alert('Live chat coming soon!')}
          >
            <MessageCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">Chat</p>
          </button>
        </div>

        {/* Response Time Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold text-sm mb-1">Support Hours</h3>
              <p className="text-blue-300/80 text-xs">
                Our team is available 24/7 to help you. Average response time is under 2 hours for urgent inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Inquiry Type */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold mb-4">What can we help you with?</h3>
            <div className="grid grid-cols-2 gap-3">
              {INQUIRY_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.inquiryType === type.id;

                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('inquiryType', type.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`w-6 h-6 mb-2 ${
                      isSelected ? 'text-purple-400' : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-gray-400'
                    }`}>
                      {type.label}
                    </p>
                  </button>
                );
              })}
            </div>
            {errors.inquiryType && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.inquiryType}
              </p>
            )}
          </div>

          {/* Personal Details */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-white font-semibold">Your Details</h3>

            {/* Name */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                readOnly
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                readOnly
              />
            </div>

            {/* Order Number (Optional) */}
            {formData.inquiryType === 'ticket' && (
              <div>
                <label className="text-gray-400 text-sm mb-2 block">
                  Order Number <span className="text-gray-600">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                  placeholder="e.g., LRX-2024-1234"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {/* Priority Level */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-white font-semibold mb-4">Priority Level</h3>
            <div className="space-y-2">
              {PRIORITY_LEVELS.map((priority) => {
                const isSelected = formData.priority === priority.id;

                return (
                  <button
                    key={priority.id}
                    type="button"
                    onClick={() => handleInputChange('priority', priority.id)}
                    className={`w-full p-3 rounded-lg flex items-center justify-between transition-all border-2 ${
                      isSelected
                        ? getPriorityColor(priority.id)
                        : 'bg-gray-800 border-transparent hover:border-gray-700'
                    }`}
                  >
                    <div className="text-left">
                      <p className={`text-sm font-medium ${
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
                    {isSelected && <CheckCircle className="w-5 h-5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Message Details */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 space-y-4">
            <h3 className="text-white font-semibold">Message</h3>

            {/* Subject */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Subject</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                placeholder="Brief description of your issue"
                className={`w-full bg-gray-800 text-white px-4 py-3 rounded-lg border ${
                  errors.subject ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:border-purple-500`}
              />
              {errors.subject && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Please provide as much detail as possible..."
                rows={6}
                className={`w-full bg-gray-800 text-white px-4 py-3 rounded-lg border ${
                  errors.message ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:border-purple-500 resize-none`}
              />
              <div className="flex items-center justify-between mt-1">
                {errors.message ? (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.message}
                  </p>
                ) : (
                  <p className="text-gray-500 text-xs">
                    {formData.message.length} characters
                  </p>
                )}
              </div>
            </div>

            {/* Attachments */}
            <div>
              <button
                type="button"
                onClick={handleFileAttach}
                className="w-full bg-gray-800 hover:bg-gray-750 text-gray-400 py-3 rounded-lg border-2 border-dashed border-gray-700 hover:border-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <Paperclip className="w-5 h-5" />
                <span className="text-sm font-medium">Attach Files (Optional)</span>
              </button>
              <p className="text-gray-500 text-xs mt-2">
                You can attach screenshots or documents (Max 10MB)
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 text-white py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Send Message</span>
              </>
            )}
          </button>
        </form>

        {/* Additional Help */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-3">Before you contact us</h3>
          <p className="text-gray-400 text-sm mb-4">
            Check if your question is already answered in our Help Center
          </p>
          <Link href="/help">
            <button className="w-full bg-gray-800 hover:bg-gray-750 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5" />
              Visit Help Center
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}