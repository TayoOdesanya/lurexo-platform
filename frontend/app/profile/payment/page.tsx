'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  CreditCard,
  Plus,
  Check,
  Trash2,
  Edit,
  Star,
  Shield,
  Apple,
  Smartphone,
  X,
  Save
} from 'lucide-react';

// Mock payment methods
const MOCK_PAYMENT_METHODS = [
  {
    id: 'card-1',
    type: 'visa',
    last4: '4242',
    expiryMonth: '12',
    expiryYear: '2027',
    holderName: 'Alex Johnson',
    isDefault: true,
    nickname: 'Personal Card'
  },
  {
    id: 'card-2',
    type: 'mastercard',
    last4: '8888',
    expiryMonth: '06',
    expiryYear: '2026',
    holderName: 'Alex Johnson',
    isDefault: false,
    nickname: 'Business Card'
  },
  {
    id: 'applepay-1',
    type: 'applepay',
    last4: '1234',
    deviceName: 'iPhone 14 Pro',
    isDefault: false
  }
];

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState(MOCK_PAYMENT_METHODS);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCard, setEditingCard] = useState(null);

  // New card form state
  const [newCard, setNewCard] = useState({
    number: '',
    holderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nickname: ''
  });

  const getCardIcon = (type) => {
    switch (type) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'applepay':
        return <Apple className="w-5 h-5" />;
      case 'googlepay':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <CreditCard className="w-5 h-5" />;
    }
  };

  const getCardColor = (type) => {
    switch (type) {
      case 'visa':
        return 'from-blue-600 to-blue-800';
      case 'mastercard':
        return 'from-orange-600 to-red-600';
      case 'amex':
        return 'from-green-600 to-teal-600';
      case 'applepay':
        return 'from-gray-800 to-black';
      case 'googlepay':
        return 'from-blue-500 to-green-500';
      default:
        return 'from-purple-600 to-blue-600';
    }
  };

  const handleSetDefault = (id) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === id
      }))
    );
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== id));
    }
  };

  const handleAddCard = () => {
    // TODO: Implement actual card validation and API call
    const newMethod = {
      id: `card-${Date.now()}`,
      type: 'visa', // Detect from card number
      last4: newCard.number.slice(-4),
      expiryMonth: newCard.expiryMonth,
      expiryYear: newCard.expiryYear,
      holderName: newCard.holderName,
      isDefault: paymentMethods.length === 0,
      nickname: newCard.nickname
    };

    setPaymentMethods(prev => [...prev, newMethod]);
    setShowAddCard(false);
    setNewCard({
      number: '',
      holderName: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      nickname: ''
    });
  };

  const handleUpdateNickname = (id, nickname) => {
    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === id ? { ...method, nickname } : method
      )
    );
    setEditingCard(null);
  };

  return (
    <div className="min-h-screen bg-black pb-6">
     {/* MOBILE ONLY: Header with back button */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            </Link>
            <div>
              <h1 className="text-white text-xl font-bold">Payment Methods</h1>
              <p className="text-gray-400 text-xs">{paymentMethods.length} saved methods</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddCard(true)}
            className="p-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* DESKTOP ONLY: Simple page header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-white text-2xl font-bold">Payment Methods</h1>
            <p className="text-gray-400 text-sm">Saved Methods</p>
        </div>
        </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Security Notice */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold text-sm mb-1">Secure Payment</h3>
              <p className="text-blue-300/80 text-xs">
                Your payment information is encrypted and securely stored. We never store your CVV.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Methods List */}
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`bg-gradient-to-br ${getCardColor(method.type)} rounded-2xl p-6 relative overflow-hidden`}
          >
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12" />
            </div>

            {/* Card Content */}
            <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{getCardIcon(method.type)}</span>
                  {method.isDefault && (
                    <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                      <span className="text-white text-xs font-medium">Default</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  {editingCard === method.id ? (
                    <button
                      onClick={() => setEditingCard(null)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setEditingCard(method.id)}
                      className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(method.id)}
                    className="p-2 bg-white/20 hover:bg-red-500/50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Nickname (Editable) */}
              {editingCard === method.id ? (
                <input
                  type="text"
                  defaultValue={method.nickname}
                  onBlur={(e) => handleUpdateNickname(method.id, e.target.value)}
                  className="bg-white/20 text-white px-3 py-1 rounded-lg text-sm mb-4 outline-none border-2 border-white/30 focus:border-white/60"
                  placeholder="Card nickname"
                  autoFocus
                />
              ) : (
                method.nickname && (
                  <p className="text-white/80 text-sm mb-4">{method.nickname}</p>
                )
              )}

              {/* Card Number */}
              <div className="mb-6">
                <p className="text-white text-xl font-mono tracking-wider">
                  •••• •••• •••• {method.last4}
                </p>
              </div>

              {/* Card Details */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-xs mb-1">Cardholder</p>
                  <p className="text-white text-sm font-medium">
                    {method.holderName || method.deviceName}
                  </p>
                </div>
                {method.expiryMonth && (
                  <div>
                    <p className="text-white/60 text-xs mb-1">Expires</p>
                    <p className="text-white text-sm font-medium">
                      {method.expiryMonth}/{method.expiryYear}
                    </p>
                  </div>
                )}
              </div>

              {/* Set Default Button */}
              {!method.isDefault && (
                <button
                  onClick={() => handleSetDefault(method.id)}
                  className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Set as Default
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Add New Card Button */}
        {!showAddCard && (
          <button
            onClick={() => setShowAddCard(true)}
            className="w-full bg-gray-900 hover:bg-gray-800 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-2xl p-8 transition-colors"
          >
            <Plus className="w-8 h-8 text-gray-600 mx-auto mb-2" />
            <p className="text-white font-medium">Add New Payment Method</p>
            <p className="text-gray-400 text-sm mt-1">Credit card, debit card, or digital wallet</p>
          </button>
        )}

        {/* Add Card Form */}
        {showAddCard && (
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Add New Card</h2>
              <button
                onClick={() => setShowAddCard(false)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Card Number</label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value.replace(/\s/g, '').slice(0, 16) })}
                  placeholder="1234 5678 9012 3456"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                  maxLength={19}
                />
              </div>

              {/* Cardholder Name */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Cardholder Name</label>
                <input
                  type="text"
                  value={newCard.holderName}
                  onChange={(e) => setNewCard({ ...newCard, holderName: e.target.value })}
                  placeholder="Name on card"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Month</label>
                  <input
                    type="text"
                    value={newCard.expiryMonth}
                    onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value.slice(0, 2) })}
                    placeholder="MM"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-center"
                    maxLength={2}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">Year</label>
                  <input
                    type="text"
                    value={newCard.expiryYear}
                    onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value.slice(0, 4) })}
                    placeholder="YYYY"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-center"
                    maxLength={4}
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-sm mb-2 block">CVV</label>
                  <input
                    type="text"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.slice(0, 4) })}
                    placeholder="123"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 text-center"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Nickname (Optional) */}
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Nickname (Optional)</label>
                <input
                  type="text"
                  value={newCard.nickname}
                  onChange={(e) => setNewCard({ ...newCard, nickname: e.target.value })}
                  placeholder="e.g., Personal Card"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddCard}
                disabled={!newCard.number || !newCard.holderName || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:text-gray-400 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Payment Method
              </button>
            </div>
          </div>
        )}

        {/* Digital Wallets */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-semibold mb-4">Digital Wallets</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => alert('Apple Pay setup coming soon!')}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <Apple className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">Apple Pay</p>
                  <p className="text-gray-400 text-xs">Add Apple Pay</p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => alert('Google Pay setup coming soon!')}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-white font-medium text-sm">Google Pay</p>
                  <p className="text-gray-400 text-xs">Add Google Pay</p>
                </div>
              </div>
              <Plus className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}