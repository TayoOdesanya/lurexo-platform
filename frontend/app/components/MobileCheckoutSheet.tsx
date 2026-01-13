'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Minus, Plus, Check, CreditCard, Lock, ChevronRight, Ticket } from 'lucide-react';
import Link from 'next/link';

// Type definitions
interface User {
  email: string;
  name: string;
}

interface Event {
  id: string;
  title: string;
  eventDate: string;
  location: string;
  imageUrl?: string;
}

interface TicketTier {
  id: string;
  name: string;
  price: number;
  serviceFee: number;
  available: number;
}

interface ContactInfo {
  email: string;
  name: string;
  phone: string;
  createAccount: boolean;
  password: string;
}

interface CardInfo {
  number: string;
  expiry: string;
  cvc: string;
}

interface ConfettiPiece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  spread: number;
}

interface MobileCheckoutSheetProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  ticketTiers: TicketTier[];
  initialTier?: TicketTier;
  isDarkMode?: boolean;
}

const MobileCheckoutSheet: React.FC<MobileCheckoutSheetProps> = ({ 
  isOpen, 
  onClose, 
  event, 
  ticketTiers, 
  initialTier, 
  isDarkMode = true 
}) => {
  // Mock user state - replace with real auth later
const mockUser = null as { email: string; name: string } | null;

const [currentStep, setCurrentStep] = useState(1);
  const [selectedTier, setSelectedTier] = useState<TicketTier>(initialTier || ticketTiers[0]);
  const [quantity, setQuantity] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [cardRotation, setCardRotation] = useState(0);
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [showTicketFan, setShowTicketFan] = useState(false);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef(0);

  // Contact form
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: mockUser ? mockUser.email : '',
    name: mockUser ? mockUser.name : '',
    phone: '',
    createAccount: true,
    password: ''
});

  // Payment form
  const [paymentMethod, setPaymentMethod] = useState('apple-pay');
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    number: '',
    expiry: '',
    cvc: ''
  });

  // Legal consent
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeRefund, setAgreeRefund] = useState(false);

  // Theme classes
  const bg = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDarkMode ? 'bg-gray-800' : 'bg-gray-50';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const border = isDarkMode ? 'border-gray-700' : 'border-gray-200';

  const totalPrice = (selectedTier.price + selectedTier.serviceFee) * quantity;

  // Determine total steps based on auth state
  const totalSteps = mockUser ? 3 : 4;
  const stepLabels = mockUser 
    ? ['Tickets', 'Payment', 'Review']
    : ['Tickets', 'Contact', 'Payment', 'Review'];

  // Generate confetti
  useEffect(() => {
    if (showConfetti) {
      const pieces: ConfettiPiece[] = [];
      const colors = ['#8b5cf6', '#3b82f6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
      
      for (let i = 0; i < 150; i++) {
        const spreadAmount = -150 + Math.random() * 300;
        pieces.push({
          id: i,
          left: 45 + Math.random() * 10,
          delay: Math.random() * 0.3,
          duration: 1.2 + Math.random() * 0.8,
          color: colors[Math.floor(Math.random() * colors.length)],
          spread: spreadAmount
        });
      }
      setConfettiPieces(pieces);
      
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [showConfetti]);

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePurchase();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowCheckmark(true);
    }, 100);
    
    setTimeout(() => {
      setShowConfetti(true);
    }, 2400);
    
    setTimeout(() => {
      let spins = 0;
      const spinInterval = setInterval(() => {
        spins++;
        setCardRotation(prev => prev + 360);
        
        if (spins >= 5) {
          clearInterval(spinInterval);
          setIsCardFlipped(true);
          
          if (quantity > 1) {
            setTimeout(() => {
              setShowTicketFan(true);
              setTimeout(() => {
                setShowTicketFan(false);
              }, 1800);
            }, 300);
          }
          
          setTimeout(() => {
            let reverseSpins = 0;
            const reverseSpinInterval = setInterval(() => {
              reverseSpins++;
              setCardRotation(prev => prev + 360);
              
              if (reverseSpins >= 5) {
                clearInterval(reverseSpinInterval);
                setIsCardFlipped(false);
              }
            }, 200);
          }, 5000);
        }
      }, 200);
    }, 5000);
  };

  const resetCheckoutFlow = () => {
    // Reset success states
    setShowSuccess(false);
    setShowCheckmark(false);
    setShowConfetti(false);
    setIsCardFlipped(false);
    setCardRotation(0);
    setShowTicketFan(false);
    setCurrentTicketIndex(0);
    
    // Reset to step 1
    setCurrentStep(1);
    setQuantity(1);
    
    // Reset legal consent
    setAgreeTerms(false);
    setAgreeRefund(false);
    
    // Reset contact info (keep email if user is logged in)
    setContactInfo({
      email: mockUser ? mockUser.email : '',
      name: mockUser ? mockUser.name : '',
      phone: '',
      createAccount: true,
      password: ''
    });
    
    // Reset payment info
    setCardInfo({
      number: '',
      expiry: '',
      cvc: ''
    });
    setPaymentMethod('apple-pay');
  };

  const handleClose = () => {
    resetCheckoutFlow();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 z-40"
        onClick={() => !isProcessing && !showSuccess && handleClose()}
      />

      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 ${bg} rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex justify-center pt-3 pb-2">
          <div className={`w-12 h-1 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded-full`} />
        </div>

        {isProcessing && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white font-semibold">Processing payment...</p>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6">
            <div className="relative w-full max-w-md" style={{ height: '85vh', maxHeight: '700px' }}>
              <div className="relative w-full h-full shadow-2xl">
                <div
                  className="relative w-full h-full transition-transform duration-500"
                  style={{
                    transform: `rotateY(${cardRotation + (isCardFlipped ? 180 : 0)}deg)`,
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-6 flex flex-col overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
                    <button
                      onClick={handleClose}
                      className="absolute top-4 right-4 z-20 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>

                    <div className="relative z-10 flex flex-col items-center justify-center h-full">
                      {showCheckmark && (
                        <div className="relative w-32 h-32 mb-8">
                          <svg className="w-full h-full" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="white"
                              strokeWidth="4"
                              strokeDasharray="283"
                              strokeDashoffset="283"
                              style={{ animation: 'draw-circle 1.5s ease-out forwards' }}
                            />
                            <path
                              d="M25 50 L45 70 L75 35"
                              fill="none"
                              stroke="white"
                              strokeWidth="6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeDasharray="100"
                              strokeDashoffset="100"
                              style={{ animation: 'draw-check 0.8s ease-out 1.5s forwards' }}
                            />
                          </svg>
                        </div>
                      )}

                      <h2 className="text-4xl font-bold text-white mb-3">Success!</h2>
                      <p className="text-white/90 text-center text-lg mb-10 px-4">
                        Your tickets have been confirmed
                      </p>

                      <div className="w-full space-y-3 px-4">
                        <button
                          onClick={() => window.location.href = '/tickets'}
                          className="w-full px-6 py-4 bg-white text-purple-600 rounded-2xl font-bold hover:bg-gray-100 transition text-lg shadow-lg"
                        >
                          View Tickets
                        </button>

                        <div className="grid grid-cols-2 gap-3">
                          <button className="px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Calendar
                          </button>

                          <button className="px-4 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold transition flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            Wallet
                          </button>
                        </div>
                      </div>

                      <div className="text-white/70 text-sm text-center mt-8">
                        <p>Swipe to see your ticket</p>
                        <ChevronRight className="w-5 h-5 mx-auto mt-1" />
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 rounded-3xl overflow-hidden" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                    <div className="relative z-10 bg-white h-full">
                      <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 z-20 w-11 h-11 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition"
                      >
                        <X className="w-6 h-6 text-gray-900" />
                      </button>

                      <div className="absolute top-6 left-6 z-20 px-4 py-2 bg-purple-100 rounded-full">
                        <span className="text-purple-600 font-bold text-sm">
                          {currentTicketIndex + 1} of {quantity}
                        </span>
                      </div>

                      <div className="h-full flex flex-col items-center justify-between p-8 py-16">
                        <div className="flex-1 flex flex-col items-center justify-center">
                          <div className="w-64 h-64 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
                            <div className="w-60 h-60 bg-white rounded-xl" />
                          </div>

                          <p className="text-purple-600 font-semibold text-base text-center mb-6">
                            Tap here to view tickets
                          </p>

                          <div className="text-center space-y-2 mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 px-4">{event.title}</h3>
                            <p className="text-gray-600 text-base">
                              {new Date(event.eventDate).toLocaleDateString('en-GB', { 
                                weekday: 'short',
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                            <p className="text-gray-500 text-sm">{event.location}</p>
                          </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3">
                          <button className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">Calendar</span>
                          </button>

                          <button className="px-4 py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-semibold transition flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                            <span className="text-sm">Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-bold ${text}`}>Checkout</h2>
              <p className={`text-sm ${textSecondary}`}>
                Step {currentStep} of {totalSteps} - {stepLabels[currentStep - 1]}
              </p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-gray-800 rounded-full transition">
              <X className={`w-6 h-6 ${text}`} />
            </button>
          </div>

          <div className="mb-8">
            <div className={`h-2 ${bgSecondary} rounded-full overflow-hidden`}>
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className={`${text} font-semibold mb-3`}>Select Ticket Type</h3>
                <div className="space-y-3">
                  {ticketTiers.map((tier) => (
                    <button
                      key={tier.id}
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition ${
                        selectedTier.id === tier.id ? 'border-purple-500 bg-purple-900/20' : 'border-gray-700'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className={`${text} font-semibold mb-1`}>{tier.name}</div>
                          <div className={`${textSecondary} text-sm`}>{tier.available} available</div>
                        </div>
                        <div className="text-right">
                          <div className={`${text} text-lg font-bold`}>£{tier.price.toFixed(2)}</div>
                          <div className={`${textSecondary} text-xs`}>+£{tier.serviceFee.toFixed(2)} fee</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className={`${text} font-semibold mb-3`}>Quantity</h3>
                <div className="flex items-center justify-center gap-6">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={`w-12 h-12 rounded-full ${bgSecondary} flex items-center justify-center`}>
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className={`text-2xl font-bold ${text}`}>{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(10, quantity + 1))} className={`w-12 h-12 rounded-full ${bgSecondary} flex items-center justify-center`}>
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className={`p-4 ${bgSecondary} rounded-xl`}>
                <div className="flex justify-between mb-2">
                  <span className={textSecondary}>Subtotal</span>
                  <span className={text}>£{(selectedTier.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className={textSecondary}>Service Fee</span>
                  <span className={text}>£{(selectedTier.serviceFee * quantity).toFixed(2)}</span>
                </div>
                <div className={`flex justify-between pt-2 border-t ${border} font-bold`}>
                  <span className={text}>Total</span>
                  <span className={text}>£{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && !mockUser && (
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Email</label>
                <input
                  type="email"
                  value={contactInfo.email}
                  onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                  className={`w-full px-4 py-3 ${bgSecondary} border ${border} rounded-xl ${text} focus:outline-none focus:border-purple-500`}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Full Name</label>
                <input
                  type="text"
                  value={contactInfo.name}
                  onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                  className={`w-full px-4 py-3 ${bgSecondary} border ${border} rounded-xl ${text} focus:outline-none focus:border-purple-500`}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Phone Number</label>
                <input
                  type="tel"
                  value={contactInfo.phone}
                  onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                  className={`w-full px-4 py-3 ${bgSecondary} border ${border} rounded-xl ${text} focus:outline-none focus:border-purple-500`}
                  placeholder="+44 7XXX XXXXXX"
                />
              </div>

              <div className={`p-4 ${bgSecondary} rounded-xl`}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contactInfo.createAccount}
                    onChange={(e) => setContactInfo({...contactInfo, createAccount: e.target.checked})}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 mt-0.5"
                  />
                  <div>
                    <div className={`${text} font-medium`}>Create an account</div>
                    <div className={`${textSecondary} text-sm`}>Save your tickets and manage orders easily</div>
                  </div>
                </label>

                {contactInfo.createAccount && (
                  <div className="mt-4">
                    <label className={`block text-sm font-medium ${text} mb-2`}>Password</label>
                    <input
                      type="password"
                      value={contactInfo.password}
                      onChange={(e) => setContactInfo({...contactInfo, password: e.target.value})}
                      className={`w-full px-4 py-3 ${bgSecondary} border ${border} rounded-xl ${text} focus:outline-none focus:border-purple-500`}
                      placeholder="Create a password"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {(currentStep === 3 || (currentStep === 2 && mockUser)) && (
            <div className="space-y-4">
              <h3 className={`${text} font-semibold mb-4`}>Payment Method</h3>

              <button className="w-full py-4 bg-black text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition">
                <span className="text-2xl">􀍟</span>
                Pay with Apple Pay
              </button>

              <button className="w-full py-4 bg-white text-gray-900 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition">
                <span className="text-xl">G</span>
                Pay with Google Pay
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className={`w-full border-t ${border}`} />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className={`px-2 ${bg} ${textSecondary}`}>Or pay with card</span>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${text} mb-2`}>Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardInfo.number}
                    onChange={(e) => setCardInfo({...cardInfo, number: e.target.value})}
                    className={`w-full px-4 py-3 ${bgSecondary} border ${border} rounded-xl ${text} focus:outline-none focus:border-purple-500`}
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCard className={`absolute right-3 top-3.5 w-5 h-5 ${textSecondary}`} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium ${text} mb-2`}>Expiry</label>
                  <input
                    type="text"
                    value={cardInfo.expiry}
                    onChange={(e) => setCardInfo({...cardInfo, expiry: e.target.value})}
                    className={`w-full px-4 py-3 ${bgSecondary} border ${border} rounded-xl ${text} focus:outline-none focus:border-purple-500`}
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${text} mb-2`}>CVC</label>
                  <input
                    type="text"
                    value={cardInfo.cvc}
                    onChange={(e) => setCardInfo({...cardInfo, cvc: e.target.value})}
                    className={`w-full px-4 py-3 ${bgSecondary} border ${border} rounded-xl ${text} focus:outline-none focus:border-purple-500`}
                    placeholder="123"
                  />
                </div>
              </div>

              <div className={`flex items-center gap-2 p-4 ${bgSecondary} rounded-xl`}>
                <Lock className="w-4 h-4 text-green-500" />
                <span className={`${textSecondary} text-sm`}>Secure checkout powered by Stripe</span>
              </div>
            </div>
          )}

          {currentStep === totalSteps && (
            <div className="space-y-4">
              <h3 className={`${text} font-semibold mb-4`}>Review Your Order</h3>

              <div className={`p-4 ${bgSecondary} rounded-xl space-y-3`}>
                <div>
                  <div className={`${textSecondary} text-sm mb-1`}>Event</div>
                  <div className={`${text} font-semibold`}>{event.title}</div>
                </div>
                <div>
                  <div className={`${textSecondary} text-sm mb-1`}>Tickets</div>
                  <div className={`${text}`}>{quantity}× {selectedTier.name}</div>
                </div>
                <div>
                  <div className={`${textSecondary} text-sm mb-1`}>Contact</div>
                  <div className={`${text}`}>{mockUser ? mockUser.email : contactInfo.email}</div>
                </div>
              </div>

              <div className={`p-4 ${bgSecondary} rounded-xl`}>
                <div className="flex justify-between mb-2">
                  <span className={textSecondary}>Subtotal</span>
                  <span className={text}>£{(selectedTier.price * quantity).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className={textSecondary}>Service Fee</span>
                  <span className={text}>£{(selectedTier.serviceFee * quantity).toFixed(2)}</span>
                </div>
                <div className={`flex justify-between pt-2 border-t ${border} font-bold text-lg`}>
                  <span className={text}>Total</span>
                  <span className={text}>£{totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Legal Consent Checkboxes */}
              <div className="space-y-3">
                <div className={`p-4 ${bgSecondary} rounded-xl`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <span className={`${text} text-sm`}>
                        I agree to the{' '}
                        <a 
                          href="/terms" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Terms of Service
                        </a>
                        {' '}and{' '}
                        <a 
                          href="/privacy" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Privacy Policy
                        </a>
                      </span>
                    </div>
                  </label>
                </div>

                <div className={`p-4 ${bgSecondary} rounded-xl`}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeRefund}
                      onChange={(e) => setAgreeRefund(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                    />
                    <div>
                      <span className={`${text} text-sm`}>
                        I have read and understand the{' '}
                        <a 
                          href="/refund-policy" 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-400 hover:text-purple-300 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Refund Policy
                        </a>
                        {' '}for this event
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div className={`flex items-start gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-xl`}>
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-green-400">
                  No hidden fees. Full refund if event is cancelled.
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-8">
            {currentStep > 1 && (
              <button 
                onClick={handleBack} 
                className={`flex-1 py-4 ${bgSecondary} ${text} rounded-full font-semibold`}
              >
                Back
              </button>
            )}
            <button 
              onClick={handleNext}
              disabled={currentStep === totalSteps && (!agreeTerms || !agreeRefund)}
              className={`flex-1 py-4 rounded-full font-semibold ${currentStep === 1 ? 'w-full' : ''} ${
                currentStep === totalSteps && (!agreeTerms || !agreeRefund)
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              }`}
            >
              {currentStep === totalSteps ? 'Complete Purchase' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes draw-circle {
          from { stroke-dashoffset: 283; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes draw-check {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </>
  );
};

export default MobileCheckoutSheet;