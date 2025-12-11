'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Receipt,
  Calendar,
  MapPin,
  CreditCard,
  Download,
  ExternalLink,
  ChevronRight,
  Filter,
  Search,
  Check,
  X,
  Clock,
  RefreshCw
} from 'lucide-react';

// Mock order data
const MOCK_ORDERS = [
  {
    id: 'LRX-2024-1234',
    date: '2025-06-01T10:00:00Z',
    status: 'completed',
    total: 170.00,
    items: [
      {
        eventId: 'event-1',
        eventTitle: 'Summer Music Festival 2025',
        eventDate: '2025-08-15T19:00:00Z',
        venue: 'Hyde Park, London',
        imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        ticketType: 'General Admission',
        quantity: 2,
        price: 85.00
      }
    ],
    paymentMethod: 'Visa •••• 4242',
    transactionId: 'txn_1234567890'
  },
  {
    id: 'LRX-2024-5678',
    date: '2025-05-15T10:00:00Z',
    status: 'completed',
    total: 50.00,
    items: [
      {
        eventId: 'event-2',
        eventTitle: 'Comedy Night with Sarah Cooper',
        eventDate: '2024-06-10T20:00:00Z',
        venue: 'The Comedy Store, Leicester Square',
        imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800',
        ticketType: 'VIP',
        quantity: 1,
        price: 50.00
      }
    ],
    paymentMethod: 'Mastercard •••• 8888',
    transactionId: 'txn_0987654321'
  },
  {
    id: 'LRX-2024-9999',
    date: '2025-09-10T15:30:00Z',
    status: 'completed',
    total: 120.00,
    items: [
      {
        eventId: 'event-4',
        eventTitle: 'Jazz Night at Ronnie Scotts',
        eventDate: '2025-11-20T21:00:00Z',
        venue: 'Ronnie Scott\'s Jazz Club, Soho',
        imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800',
        ticketType: 'VIP Table',
        quantity: 1,
        price: 120.00
      }
    ],
    paymentMethod: 'Apple Pay',
    transactionId: 'txn_1122334455'
  },
  {
    id: 'LRX-2024-7777',
    date: '2025-06-15T11:00:00Z',
    status: 'refunded',
    total: 45.00,
    refundAmount: 45.00,
    refundDate: '2025-07-01T10:00:00Z',
    items: [
      {
        eventId: 'event-6',
        eventTitle: 'Outdoor Theatre - Romeo & Juliet',
        eventDate: '2025-07-28T19:30:00Z',
        venue: 'Regent\'s Park Open Air Theatre',
        imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800',
        ticketType: 'Standard',
        quantity: 1,
        price: 45.00
      }
    ],
    paymentMethod: 'Visa •••• 4242',
    transactionId: 'txn_7788990011'
  }
];

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4" />;
      case 'refunded':
        return <RefreshCw className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'refunded':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some(item => item.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const totalSpent = orders
    .filter(o => o.status === 'completed')
    .reduce((sum, order) => sum + order.total, 0);

    return (
    <div className="min-h-screen bg-black pb-6 w-screen max-w-full overflow-x-hidden">
      {/* MOBILE ONLY: Header */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/profile">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </Link>
          <div className="flex-1">
            <h1 className="text-white text-xl font-bold">Order History</h1>
            <p className="text-gray-400 text-xs">{orders.length} total orders</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search orders or events..."
            className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {[
            { value: 'all', label: 'All' },
            { value: 'completed', label: 'Completed' },
            { value: 'refunded', label: 'Refunded' },
            { value: 'pending', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' }
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setSelectedStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedStatus === filter.value
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* DESKTOP ONLY: Page header */}
<div className="hidden lg:block bg-gray-900 border-b border-gray-800">
  <div className="px-6 py-8">
    <h1 className="text-white text-2xl font-bold mb-2">Order History</h1>
    <p className="text-gray-400 text-sm">{orders.length} total orders</p>
    
    {/* Search Bar - Desktop */}
    <div className="relative mt-4 mb-3">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search orders or events..."
        className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
      />
    </div>

    {/* Filter Tabs - Desktop */}
        <div className="flex gap-2">
        {[
            { value: 'all', label: 'All' },
            { value: 'completed', label: 'Completed' },
            { value: 'refunded', label: 'Refunded' },
            { value: 'pending', label: 'Pending' },
            { value: 'cancelled', label: 'Cancelled' }
        ].map((filter) => (
            <button
            key={filter.value}
            onClick={() => setSelectedStatus(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedStatus === filter.value
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-750'
            }`}
            >
            {filter.label}
            </button>
        ))}
        </div>
    </div>
    </div>

      <div className="p-4 lg:p-6 space-y-4 w-full max-w-full box-border">
        {/* Stats Card */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm mb-1">Total Spent</p>
              <p className="text-white text-3xl font-bold">£{totalSpent.toFixed(2)}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <Receipt className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-2">
            <div>
              <p className="text-white/70 text-xs">Completed Orders</p>
              <p className="text-white text-xl font-bold">
                {orders.filter(o => o.status === 'completed').length}
              </p>
            </div>
            <div>
              <p className="text-white/70 text-xs">Tickets Purchased</p>
              <p className="text-white text-xl font-bold">
                {orders.reduce((sum, order) => 
                  sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-gray-900 rounded-2xl p-12 text-center border border-gray-800">
            <Receipt className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold mb-2">No orders found</h3>
            <p className="text-gray-400 text-sm">
              {searchQuery ? 'Try a different search term' : 'No orders match the selected filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-3 w-full">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden w-full max-w-full"
                >
                {/* Order Header */}
                <button
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    className="w-full max-w-full p-4 flex items-start justify-between hover:bg-gray-800 transition-colors"
                    >
                  <div className="flex items-start gap-3 flex-1 min-w-0 overflow-hidden">
                    <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={order.items[0].imageUrl}
                        alt={order.items[0].eventTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-white font-semibold text-sm">Order #{order.id}</p>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                    </div>
                      <p className="text-gray-400 text-xs mb-1">
                        {formatDateTime(order.date)}
                      </p>
                      <p className="text-white text-sm font-medium">
                        £{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform ${
                    expandedOrder === order.id ? 'rotate-90' : ''
                  }`} />
                </button>

                {/* Expanded Order Details */}
                {expandedOrder === order.id && (
                  <div className="border-t border-gray-800">
                    {/* Order Items */}
                    <div className="p-4 space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="bg-gray-800 rounded-lg p-3">
                          <div className="flex gap-3">
                            <img 
                              src={item.imageUrl}
                              alt={item.eventTitle}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">
                                {item.eventTitle}
                              </h4>
                              <div className="flex items-center text-gray-400 text-xs mb-1">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(item.eventDate)}
                              </div>
                              <div className="flex items-center text-gray-400 text-xs mb-2">
                                <MapPin className="w-3 h-3 mr-1" />
                                <span className="truncate">{item.venue}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gray-400 text-xs">
                                  {item.quantity}x {item.ticketType}
                                </span>
                                <span className="text-white text-sm font-semibold">
                                  £{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Payment Info */}
                    <div className="px-4 pb-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Payment Method</span>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <span className="text-white truncate">{order.paymentMethod}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm gap-2">
                        <span className="text-gray-400 flex-shrink-0">Transaction ID</span>
                        <span className="text-white font-mono text-xs truncate">{order.transactionId}</span>
                        </div>
                      
                      {order.status === 'refunded' && (
                        <>
                          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-700">
                            <span className="text-gray-400">Refund Amount</span>
                            <span className="text-green-400 font-semibold">£{order.refundAmount.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-400">Refund Date</span>
                            <span className="text-white text-xs">{formatDate(order.refundDate)}</span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-700">
                        <span className="text-white font-semibold">Total</span>
                        <span className="text-white font-bold">£{order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="p-4 bg-gray-800/50 border-t border-gray-700 flex gap-2">
                      <Link href={`/tickets`} className="flex-1">
                        <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          View Tickets
                        </button>
                      </Link>
                      <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Receipt
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}