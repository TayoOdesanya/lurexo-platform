'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, ChevronDown, ChevronUp, Lock, CreditCard, Calendar, MapPin, Shield, AlertCircle } from 'lucide-react';
import { getApiBaseUrl } from '@/lib/apiBase';

const API_BASE_URL = getApiBaseUrl();

function getAccessTokenClient(): string | null {
  try {
    return localStorage.getItem('authToken') ?? localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

const defaultOrder = {
  event: {
    id: '1',
    title: 'Summer Music Festival 2025',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    date: '2025-08-15T19:00:00Z',
    location: 'Hyde Park, London'
  },
  tickets: [
    {
      tierId: 'standard',
      tier: 'General Admission',
      quantity: 2,
      price: 85.00,
      serviceFee: 8.50
    }
  ],
  subtotal: 170.00,
  totalFees: 17.00,
  total: 187.00
};

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const [createAccount, setCreateAccount] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [slideDirection, setSlideDirection] = useState('up');
  const [orderData, setOrderData] = useState(defaultOrder);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [orderNumber, setOrderNumber] = useState(`LRX${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [createdTickets, setCreatedTickets] = useState<any[]>([]);
  const [orderError, setOrderError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    cardNumber: '',
    expiry: '',
    cvc: '',
    billingAddress: '',
    city: '',
    postcode: '',
    agreeTerms: false,
    agreeRefund: false,
    marketingOptIn: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const tier = searchParams.get('tier');
    const qty = searchParams.get('qty');
    const price = searchParams.get('price');
    const fee = searchParams.get('fee');

    if (tier && qty && price && fee) {
      const storedData = localStorage.getItem('lurexo_checkout');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const tierId = parsedData.tierId || tier;
        setOrderData({
          event: {
            id: parsedData.eventId,
            title: parsedData.eventTitle,
            imageUrl: parsedData.eventImage,
            date: parsedData.eventDate,
            location: parsedData.eventLocation
          },
          tickets: [{
            tierId,
            tier: parsedData.tierName,
            quantity: parseInt(qty),
            price: parseFloat(price),
            serviceFee: parseFloat(fee)
          }],
          subtotal: parsedData.subtotal,
          totalFees: parsedData.totalFees,
          total: parsedData.total
        });
      }
    } else {
      const storedData = localStorage.getItem('lurexo_checkout');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        const tierId = parsedData.tierId || parsedData.tier;
        setOrderData({
          event: {
            id: parsedData.eventId,
            title: parsedData.eventTitle,
            imageUrl: parsedData.eventImage,
            date: parsedData.eventDate,
            location: parsedData.eventLocation
          },
          tickets: [{
            tierId,
            tier: parsedData.tierName,
            quantity: parsedData.quantity,
            price: parsedData.ticketPrice,
            serviceFee: parsedData.serviceFee
          }],
          subtotal: parsedData.subtotal,
          totalFees: parsedData.totalFees,
          total: parsedData.total
        });
      }
    }
  }, [searchParams]);

  const bg = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const bgSecondary = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const primaryTicket = createdTickets[0];
  const displayTicketNumber = primaryTicket?.ticketNumber ?? orderNumber;
  const displayQrCode = primaryTicket?.qrCode ?? null;

  const steps = [
    { number: 1, title: 'Contact', icon: '📧' },
    { number: 2, title: 'Payment', icon: '💳' },
    { number: 3, title: 'Confirm', icon: '✓' }
  ];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateContactStep = () => {
    if (!formData.email || !formData.firstName || !formData.lastName) {
      return false;
    }
    if (!validateEmail(formData.email)) {
      return false;
    }
    if (createAccount && (!formData.password || formData.password.length < 8)) {
      return false;
    }
    return true;
  };

  const validatePaymentStep = () => {
    if (!formData.cardNumber || !formData.expiry || !formData.cvc) {
      return false;
    }
    if (!formData.billingAddress || !formData.city || !formData.postcode) {
      return false;
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateContactStep()) {
      setSlideDirection('up');
      setCurrentStep(2);
    }
  };

  const handleContinueToReview = () => {
    if (validatePaymentStep()) {
      setSlideDirection('up');
      setCurrentStep(3);
    }
  };

  const handleBackToStep = (step: number) => {
    if (step < currentStep) {
      setSlideDirection('down');
      setCurrentStep(step);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const handleInputChange = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, email: null }));
      }
    }

    if (field === 'firstName' && value && value.length < 2) {
      setErrors(prev => ({ ...prev, firstName: 'First name must be at least 2 characters' }));
    } else if (field === 'firstName') {
      setErrors(prev => ({ ...prev, firstName: null }));
    }

    if (field === 'lastName' && value && value.length < 2) {
      setErrors(prev => ({ ...prev, lastName: 'Last name must be at least 2 characters' }));
    } else if (field === 'lastName') {
      setErrors(prev => ({ ...prev, lastName: null }));
    }

    if (field === 'password' && createAccount && value && value.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
    } else if (field === 'password') {
      setErrors(prev => ({ ...prev, password: null }));
    }
  };

  const handlePayment = async () => {
    if (isProcessing) return;
    setOrderError(null);

    const accessToken = getAccessTokenClient();
    if (!accessToken) {
      setOrderError('Please sign in to complete your purchase.');
      return;
    }

    const items = orderData.tickets
      .map((ticket) => ({
        tierId: ticket.tierId,
        quantity: ticket.quantity,
      }))
      .filter((item) => item.tierId && item.quantity);

    if (items.length === 0) {
      setOrderError('Missing ticket tier information. Please restart checkout.');
      return;
    }

    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress((prev) => (prev >= 90 ? 90 : prev + 10));
    }, 200);

    try {
      const orderRes = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          eventId: orderData.event.id,
          items,
          buyerEmail: formData.email,
          buyerFirstName: formData.firstName,
          buyerLastName: formData.lastName,
        }),
      });

      if (!orderRes.ok) {
        const txt = await orderRes.text().catch(() => '');
        throw new Error(txt || 'Failed to create order');
      }

      const orderPayload = await orderRes.json();
      const createdOrder = orderPayload?.order;

      if (!createdOrder?.id) {
        throw new Error('Order creation failed');
      }

      setOrderId(createdOrder.id);
      if (createdOrder.orderNumber) {
        setOrderNumber(createdOrder.orderNumber);
      }

      const completeRes = await fetch(`${API_BASE_URL}/orders/${createdOrder.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          items,
          paymentMethod: 'card',
        }),
      });

      if (!completeRes.ok) {
        const txt = await completeRes.text().catch(() => '');
        throw new Error(txt || 'Failed to finalize payment');
      }

      const completePayload = await completeRes.json();
      setCreatedTickets(completePayload.tickets ?? []);

      setProcessingProgress(100);
      clearInterval(interval);
      setTimeout(() => {
        setIsProcessing(false);
        setShowSuccess(true);
        setShowCheckmark(true);
        setTimeout(() => {
          setShowConfetti(true);
        }, 1500);
      }, 500);
    } catch (error: any) {
      clearInterval(interval);
      setIsProcessing(false);
      setProcessingProgress(0);
      setOrderError(error?.message ?? 'Payment failed. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${bg}`}>
      <nav className={`${bgSecondary} border-b ${border} sticky top-0 z-40 backdrop-blur-lg bg-opacity-95`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button onClick={() => window.history.back()} className={`flex items-center gap-2 ${textSecondary} hover:${text} transition-colors`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-medium hidden sm:inline">Back to Event</span>
            </button>

            <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
              <span className={`${text} font-bold text-xl hidden sm:inline`}>Lurexo</span>
            </div>

            <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-full ${isDarkMode ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-200'} backdrop-blur-sm`}>
              {isDarkMode ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isProcessing && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
          <div className={`${bgSecondary} rounded-2xl p-8 max-w-md w-full mx-4`}>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-purple-500 animate-pulse" />
              </div>
              <h3 className={`text-xl font-bold ${text} mb-2`}>Processing Payment</h3>
              <p className={`${textSecondary} text-sm`}>Please don't close this window</p>
            </div>
            
            <div className={`w-full h-2 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} rounded-full overflow-hidden`}>
              <div className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300" style={{ width: `${processingProgress}%` }} />
            </div>
            <p className={`${textSecondary} text-center text-sm mt-4`}>{processingProgress}%</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {!showSuccess && (
          <div className="mb-8 sticky top-20 z-30 py-4 -mx-4 px-4">
            <div className="flex items-center justify-center">
              {steps.map((step, idx) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <button onClick={() => step.number < currentStep ? handleBackToStep(step.number) : null} disabled={step.number >= currentStep} className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${currentStep >= step.number ? 'bg-purple-600 text-white' : `${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'} ${textSecondary}`} ${step.number < currentStep ? 'cursor-pointer hover:scale-110' : ''}`}>
                      {currentStep > step.number ? <Check className="w-6 h-6" /> : step.number}
                    </button>
                    <span className={`text-sm mt-2 ${currentStep >= step.number ? text : textSecondary}`}>{step.title}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className={`w-24 h-1 mx-4 transition-all ${currentStep > step.number ? 'bg-purple-600' : isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {showSuccess ? (
          <div className="animate-fade-in max-w-6xl mx-auto">
            <div className={`${bgSecondary} rounded-2xl p-8 border ${border} mb-6`}>
              <div className="flex items-start gap-6">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="url(#gradient)" strokeWidth="4" style={{ strokeDasharray: '283', strokeDashoffset: '283', animation: 'draw-circle 1s ease-out forwards' }} />
                    <path d="M25 50 L45 70 L75 35" fill="none" stroke="url(#gradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: '100', strokeDashoffset: '100', animation: 'draw-check 0.6s ease-out 1s forwards' }} />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <div className="flex-1">
                  <h2 className={`text-3xl font-bold ${text} mb-2`}>Payment Successful!</h2>
                  <p className={`${textSecondary} text-lg mb-4`}>
                    Your tickets have been confirmed and sent to <span className={`${text} font-semibold`}>{formData.email}</span>
                  </p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'} border`}>
                    <span className={`${textSecondary} text-sm`}>Order Number:</span>
                    <span className={`${text} font-mono font-bold`}>{orderNumber}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className={`${bgSecondary} rounded-2xl p-6 border ${border}`}>
                  <h3 className={`text-lg font-bold ${text} mb-4`}>Event Details</h3>
                  <div className="flex gap-4 mb-4">
                    <img src={orderData.event.imageUrl} alt={orderData.event.title} className="w-24 h-24 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className={`${text} font-bold mb-2`}>{orderData.event.title}</h4>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${textSecondary}`} />
                          <span className={`${textSecondary} text-sm`}>{formatDate(orderData.event.date)} at {formatTime(orderData.event.date)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${textSecondary}`} />
                          <span className={`${textSecondary} text-sm`}>{orderData.event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${bgSecondary} rounded-2xl p-6 border ${border}`}>
                  <h3 className={`text-lg font-bold ${text} mb-4`}>Order Summary</h3>
                  <div className="space-y-3 mb-4">
                    {orderData.tickets.map((ticket, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`${text} font-semibold`}>{ticket.tier}</span>
                          <span className={`${text} font-semibold`}>£{(ticket.price * ticket.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${textSecondary} text-sm`}>{ticket.quantity} × £{ticket.price.toFixed(2)}</span>
                          <span className={`${textSecondary} text-sm`}>+£{(ticket.serviceFee * ticket.quantity).toFixed(2)} fee</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`pt-3 border-t ${border} space-y-2`}>
                    <div className="flex justify-between text-sm">
                      <span className={textSecondary}>Subtotal</span>
                      <span className={text}>£{orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={textSecondary}>Service fees</span>
                      <span className={text}>£{orderData.totalFees.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between text-lg font-bold pt-2 border-t ${border}`}>
                      <span className={text}>Total Paid</span>
                      <span className="text-green-500">£{orderData.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    View All Tickets
                  </button>
                  <button className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${text}`}>
                    <Calendar className="w-5 h-5" />
                    Add to Calendar
                  </button>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-900/20 border-green-500/30' : 'bg-green-50 border-green-200'} border`}>
                  <p className={`text-sm ${textSecondary}`}>
                    <strong className={text}>✓ PDF & Confirmation Email Sent</strong><br/>
                    Check your inbox at {formData.email} for your tickets and receipt.
                  </p>
                </div>
              </div>

              <div className={`${bgSecondary} rounded-2xl p-6 border ${border} h-fit sticky top-24`}>
                <h3 className={`text-lg font-bold ${text} mb-4`}>Your Ticket</h3>
                
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white mb-4">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-xs opacity-80 mb-1">ADMIT ONE</div>
                      <div className="font-bold text-lg">{orderData.tickets[0].tier}</div>
                    </div>
                    <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                      <span className="text-xl font-bold">L</span>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
                    <div className="w-32 h-32 bg-black rounded-lg flex items-center justify-center">
                      <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm12 2h2v2h-2v-2zm0 4h2v2h-2v-2zm-2-2h2v2h-2v-2zm4-2h2v2h-2v-2zm0-4h2v2h-2v-2zm-2 0h2v2h-2v-2zm2 6h2v2h-2v-2zm2-2h2v2h-2v-2z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="opacity-80">Event</span>
                      <span className="font-semibold text-right">{orderData.event.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Date</span>
                      <span className="font-semibold">{formatDate(orderData.event.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Time</span>
                      <span className="font-semibold">{formatTime(orderData.event.date)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="opacity-80">Ticket #</span>
                      <span className="font-mono font-semibold">{displayTicketNumber}</span>
                    </div>
                    {displayQrCode && (
                      <div className="flex justify-between">
                        <span className="opacity-80">QR Code</span>
                        <span className="font-mono text-xs break-all text-right">{displayQrCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className={textSecondary}>Verified & Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className={textSecondary}>Valid for Entry</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-green-500" />
                    <span className={textSecondary}>Fraud Protected</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${text}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                    Share
                  </button>
                  <button className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${text}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Add to Wallet
                  </button>
                </div>

                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
                  <p className={`text-sm ${textSecondary}`}>
                    <strong className={text}>Show this QR code</strong> at the venue entrance. You can also add it to your mobile wallet for quick access.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => window.location.href = '/'} className={`${textSecondary} hover:${text} transition-colors font-semibold`}>
                ← Browse More Events
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 relative">
              {/* Step 1: Contact Information */}
              <div className={`${bgSecondary} rounded-2xl p-6 border ${border} transition-all duration-500 ${currentStep !== 1 ? 'hidden' : slideDirection === 'up' ? 'animate-slide-up' : 'animate-slide-down'}`}>
                <h2 className={`text-2xl font-bold ${text} mb-6`}>Contact Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold ${text} mb-2`}>
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email}
                      </p>
                    )}
                    <p className={`${textSecondary} text-xs mt-1`}>We'll send your tickets here</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold ${text} mb-2`}>
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="John"
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        autoComplete="given-name"
                      />
                      {errors.firstName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold ${text} mb-2`}>
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Doe"
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        autoComplete="family-name"
                      />
                      {errors.lastName && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${text} mb-2`}>
                      Phone Number <span className={`${textSecondary} text-xs font-normal`}>(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+44 7700 900000"
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      autoComplete="tel"
                    />
                  </div>

                  <div className={`p-4 ${isDarkMode ? 'bg-purple-900/20 border-purple-500/30' : 'bg-purple-50 border-purple-200'} border rounded-xl`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={createAccount}
                        onChange={(e) => setCreateAccount(e.target.checked)}
                        className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <div>
                        <span className={`${text} font-semibold`}>Create an account for faster checkout next time</span>
                        <p className={`${textSecondary} text-sm mt-1`}>Manage your tickets, track orders, and get exclusive offers</p>
                      </div>
                    </label>

                    {createAccount && (
                      <div className="mt-4">
                        <label className={`block text-sm font-semibold ${text} mb-2`}>
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder="Min. 8 characters"
                          className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                          autoComplete="new-password"
                        />
                        {errors.password && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors.password}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleContinueToPayment}
                  disabled={!validateContactStep()}
                  className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                    validateContactStep()
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Continue to Payment →
                </button>
              </div>

              {/* Step 2: Payment Method */}
              <div className={`${bgSecondary} rounded-2xl p-6 border ${border} transition-all duration-500 ${currentStep !== 2 ? 'hidden' : slideDirection === 'up' ? 'animate-slide-up' : 'animate-slide-down'}`}>
                <h2 className={`text-2xl font-bold ${text} mb-6`}>Payment Method</h2>

                <div className="space-y-4 mb-6">
                  <button className={`w-full p-4 rounded-xl border-2 border-purple-500 bg-purple-900/20 flex items-center gap-3 transition-all`}>
                    <CreditCard className="w-6 h-6 text-purple-500" />
                    <span className={`${text} font-semibold`}>Credit / Debit Card</span>
                  </button>

                  <div className="grid grid-cols-3 gap-3">
                    <button className={`p-4 rounded-xl border ${border} ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-all flex items-center justify-center`}>
                      <span className={`${text} font-semibold text-sm`}>PayPal</span>
                    </button>
                    <button className={`p-4 rounded-xl border ${border} ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-all flex items-center justify-center`}>
                      <span className={`${text} font-semibold text-sm`}>Apple Pay</span>
                    </button>
                    <button className={`p-4 rounded-xl border ${border} ${isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition-all flex items-center justify-center`}>
                      <span className={`${text} font-semibold text-sm`}>Google Pay</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold ${text} mb-2`}>
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                      autoComplete="cc-number"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-semibold ${text} mb-2`}>
                        Expiry Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.expiry}
                        onChange={(e) => handleInputChange('expiry', e.target.value)}
                        placeholder="MM / YY"
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        autoComplete="cc-exp"
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold ${text} mb-2`}>
                        CVC <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.cvc}
                        onChange={(e) => handleInputChange('cvc', e.target.value)}
                        placeholder="123"
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        autoComplete="cc-csc"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${text} mb-2`}>
                      Billing Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.billingAddress}
                      onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                      placeholder="123 Main Street"
                      className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all mb-4`}
                      autoComplete="street-address"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        autoComplete="address-level2"
                      />
                      <input
                        type="text"
                        value={formData.postcode}
                        onChange={(e) => handleInputChange('postcode', e.target.value)}
                        placeholder="Postcode"
                        className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                        autoComplete="postal-code"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => handleBackToStep(1)}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${text} transition-all`}
                  >
                    ← Back
                  </button>
                  <button
                    onClick={handleContinueToReview}
                    disabled={!validatePaymentStep()}
                    className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                      validatePaymentStep()
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    Review Order →
                  </button>
                </div>
              </div>

              {/* Step 3: Review & Confirm */}
              <div className={`${bgSecondary} rounded-2xl p-6 border ${border} transition-all duration-500 ${currentStep !== 3 ? 'hidden' : slideDirection === 'up' ? 'animate-slide-up' : 'animate-slide-down'}`}>
                <h2 className={`text-2xl font-bold ${text} mb-6`}>Review & Confirm</h2>

                <div className="space-y-4">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className={`${text} text-sm`}>
                      I agree to the <a href="/terms" className="text-purple-400 hover:text-purple-300">Terms & Conditions</a>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.agreeRefund}
                      onChange={(e) => setFormData(prev => ({ ...prev, agreeRefund: e.target.checked }))}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className={`${text} text-sm`}>
                      I understand the <a href="/refund-policy" className="text-purple-400 hover:text-purple-300">Refund Policy</a>
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.marketingOptIn}
                      onChange={(e) => setFormData(prev => ({ ...prev, marketingOptIn: e.target.checked }))}
                      className="mt-1 w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className={`${textSecondary} text-sm`}>
                      Send me exclusive offers and event recommendations (optional)
                    </span>
                  </label>
                </div>

                {orderError && (
                  <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
                    {orderError}
                  </div>
                )}

                <button
                  onClick={handlePayment}
                  disabled={!formData.agreeTerms || !formData.agreeRefund || !formData.email || !formData.firstName || !formData.lastName}
                  className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                    formData.agreeTerms && formData.agreeRefund && formData.email && formData.firstName && formData.lastName
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:scale-[1.02]'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" />
                    Complete Purchase - £{orderData.total.toFixed(2)}
                  </span>
                </button>

                <button
                  onClick={() => handleBackToStep(2)}
                  className={`w-full mt-4 py-3 rounded-xl font-semibold ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} ${text} transition-all`}
                >
                  ← Back to Payment
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className={`${textSecondary} text-xs`}>Secure 256-bit SSL encryption</span>
                </div>
              </div>
            </div>

            {!showSuccess && (
              <div className="lg:col-span-1">
                <div className={`${bgSecondary} rounded-2xl p-6 border ${border} sticky top-24 space-y-6`}>
                  <h3 className={`text-xl font-bold ${text}`}>Order Summary</h3>

                  <div className="flex gap-4">
                    <img src={orderData.event.imageUrl} alt={orderData.event.title} className="w-24 h-24 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className={`${text} font-bold text-sm mb-2`}>{orderData.event.title}</h4>
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className={`w-3 h-3 ${textSecondary}`} />
                        <span className={`${textSecondary} text-xs`}>{formatDate(orderData.event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3 h-3 ${textSecondary}`} />
                        <span className={`${textSecondary} text-xs`}>{orderData.event.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`pt-4 border-t ${border} space-y-3`}>
                    {orderData.tickets.map((ticket, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between items-start mb-1">
                          <span className={`${text} text-sm font-semibold`}>{ticket.tier}</span>
                          <span className={`${text} text-sm font-semibold`}>£{(ticket.price * ticket.quantity).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className={`${textSecondary} text-xs`}>{ticket.quantity} × £{ticket.price.toFixed(2)}</span>
                          <span className={`${textSecondary} text-xs`}>+£{(ticket.serviceFee * ticket.quantity).toFixed(2)} fee</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <button
                      onClick={() => setShowPromoCode(!showPromoCode)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
                    >
                      <span className={`${text} text-sm font-semibold`}>Have a promo code?</span>
                      {showPromoCode ? <ChevronUp className={`w-4 h-4 ${text}`} /> : <ChevronDown className={`w-4 h-4 ${text}`} />}
                    </button>

                    {showPromoCode && (
                      <div className="mt-3 flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter code"
                          className={`flex-1 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} border ${text} text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                        />
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-all">
                          Apply
                        </button>
                      </div>
                    )}
                  </div>

                  <div className={`pt-4 border-t ${border} space-y-2`}>
                    <div className="flex justify-between text-sm">
                      <span className={textSecondary}>Subtotal</span>
                      <span className={text}>£{orderData.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className={textSecondary}>Service fees</span>
                      <span className={text}>£{orderData.totalFees.toFixed(2)}</span>
                    </div>
                    <div className={`flex justify-between text-lg font-bold pt-2 border-t ${border}`}>
                      <span className={text}>Total</span>
                      <span className={text}>£{orderData.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className={`pt-4 border-t ${border} space-y-3 text-sm`}>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-green-500" />
                      <span className={textSecondary}>Secure checkout</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className={textSecondary}>No hidden fees</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className={textSecondary}>Instant digital tickets</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slide-down { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes draw-circle { from { stroke-dashoffset: 283; } to { stroke-dashoffset: 0; } }
        @keyframes draw-check { from { stroke-dashoffset: 100; } to { stroke-dashoffset: 0; } }
        .animate-slide-up { animation: slide-up 0.5s ease-out; }
        .animate-slide-down { animation: slide-down 0.5s ease-out; }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
      `}</style>
    </div>
  );
}
