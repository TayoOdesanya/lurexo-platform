'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Check, ChevronDown, ChevronUp, Lock, CreditCard, Calendar, MapPin, Shield, AlertCircle } from 'lucide-react';

// Type definitions
interface Event {
  id: string;
  title: string;
  imageUrl: string;
  date: string;
  location: string;
}

interface Ticket {
  tier: string;
  quantity: number;
  price: number;
  serviceFee: number;
}

interface OrderData {
  event: Event;
  tickets: Ticket[];
  subtotal: number;
  totalFees: number;
  total: number;
}

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  cardNumber: string;
  expiry: string;
  cvc: string;
  billingAddress: string;
  city: string;
  postcode: string;
  agreeTerms: boolean;
  agreeRefund: boolean;
  marketingOptIn: boolean;
}

const defaultOrder: OrderData = {
  event: {
    id: '1',
    title: 'Summer Music Festival 2025',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    date: '2025-08-15T19:00:00Z',
    location: 'Hyde Park, London'
  },
  tickets: [
    {
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
  const [orderData, setOrderData] = useState<OrderData>(defaultOrder);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [orderNumber] = useState(`LRX${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  
  const [formData, setFormData] = useState<FormData>({
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const tier = searchParams.get('tier');
    const qty = searchParams.get('qty');
    const price = searchParams.get('price');
    const fee = searchParams.get('fee');

    if (tier && qty && price && fee) {
      const storedData = localStorage.getItem('lurexo_checkout');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setOrderData({
          event: {
            id: parsedData.eventId,
            title: parsedData.eventTitle,
            imageUrl: parsedData.eventImage,
            date: parsedData.eventDate,
            location: parsedData.eventLocation
          },
          tickets: [{
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
        setOrderData({
          event: {
            id: parsedData.eventId,
            title: parsedData.eventTitle,
            imageUrl: parsedData.eventImage,
            date: parsedData.eventDate,
            location: parsedData.eventLocation
          },
          tickets: [{
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

  const steps = [
    { number: 1, title: 'Contact', icon: '📧' },
    { number: 2, title: 'Payment', icon: '💳' },
    { number: 3, title: 'Confirm', icon: '✓' }
  ];

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateContactStep = (): boolean => {
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

  const validatePaymentStep = (): boolean => {
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email' && typeof value === 'string' && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      } else {
        setErrors(prev => ({ ...prev, email: '' }));
      }
    }

    if (field === 'firstName' && typeof value === 'string' && value && value.length < 2) {
      setErrors(prev => ({ ...prev, firstName: 'First name must be at least 2 characters' }));
    } else if (field === 'firstName') {
      setErrors(prev => ({ ...prev, firstName: '' }));
    }

    if (field === 'lastName' && typeof value === 'string' && value && value.length < 2) {
      setErrors(prev => ({ ...prev, lastName: 'Last name must be at least 2 characters' }));
    } else if (field === 'lastName') {
      setErrors(prev => ({ ...prev, lastName: '' }));
    }

    if (field === 'password' && createAccount && typeof value === 'string' && value && value.length < 8) {
      setErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
    } else if (field === 'password') {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setProcessingProgress(0);

    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
            setShowCheckmark(true);
            setTimeout(() => {
              setShowConfetti(true);
            }, 1500);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
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

        {/* Continuation of checkout page would go here - truncated for brevity */}
        {/* The rest of your JSX remains the same */}
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