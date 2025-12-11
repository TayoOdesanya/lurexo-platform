'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  CreditCard,
  Building,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  ExternalLink,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Plus,
  Edit,
  Trash2,
  Info,
  Shield,
  Zap
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function PayoutsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Mock data
  const availableBalance = 24780;
  const pendingPayouts = 8940;
  const totalPaidOut = 287450;
  const nextPayoutDate = 'Tomorrow, 9:00 AM';

  // Revenue trend data
  const revenueData = [
    { date: 'Nov 1', amount: 4200 },
    { date: 'Nov 5', amount: 5800 },
    { date: 'Nov 10', amount: 8200 },
    { date: 'Nov 15', amount: 9200 },
    { date: 'Nov 20', amount: 11400 },
    { date: 'Nov 25', amount: 9800 },
    { date: 'Nov 30', amount: 12100 },
  ];

  // Transaction history
  const transactions = [
    {
      id: 'TXN001',
      type: 'payout',
      amount: 12100,
      status: 'completed',
      date: '2025-12-01T10:00:00',
      description: 'Weekly payout',
      reference: 'PAY-2025-001',
      fee: 0,
      event: 'Summer Music Festival'
    },
    {
      id: 'TXN002',
      type: 'payout',
      amount: 9800,
      status: 'completed',
      date: '2025-11-28T10:00:00',
      description: 'Weekly payout',
      reference: 'PAY-2025-002',
      fee: 0,
      event: 'Jazz Night Live'
    },
    {
      id: 'TXN003',
      type: 'payout',
      amount: 11400,
      status: 'processing',
      date: '2025-11-25T10:00:00',
      description: 'Weekly payout',
      reference: 'PAY-2025-003',
      fee: 0,
      event: 'Comedy Special'
    },
    {
      id: 'TXN004',
      type: 'refund',
      amount: -250,
      status: 'completed',
      date: '2025-11-24T14:30:00',
      description: 'Ticket refund',
      reference: 'REF-2025-001',
      fee: 0,
      event: 'Summer Music Festival'
    },
    {
      id: 'TXN005',
      type: 'payout',
      amount: 8200,
      status: 'completed',
      date: '2025-11-21T10:00:00',
      description: 'Weekly payout',
      reference: 'PAY-2025-004',
      fee: 0,
      event: 'All Events'
    },
    {
      id: 'TXN006',
      type: 'payout',
      amount: 9200,
      status: 'completed',
      date: '2025-11-18T10:00:00',
      description: 'Weekly payout',
      reference: 'PAY-2025-005',
      fee: 0,
      event: 'Summer Music Festival'
    },
    {
      id: 'TXN007',
      type: 'fee',
      amount: -168,
      status: 'completed',
      date: '2025-11-15T10:00:00',
      description: 'Platform fee (4%)',
      reference: 'FEE-2025-001',
      fee: 168,
      event: 'Monthly fees'
    },
    {
      id: 'TXN008',
      type: 'payout',
      amount: 5800,
      status: 'completed',
      date: '2025-11-14T10:00:00',
      description: 'Weekly payout',
      reference: 'PAY-2025-006',
      fee: 0,
      event: 'Jazz Night Live'
    }
  ];

  // Payment methods
  const paymentMethods = [
    {
      id: '1',
      type: 'bank',
      bankName: 'Barclays',
      accountNumber: '****5678',
      sortCode: '20-00-00',
      isPrimary: true,
      verified: true
    },
    {
      id: '2',
      type: 'bank',
      bankName: 'HSBC',
      accountNumber: '****9012',
      sortCode: '40-47-84',
      isPrimary: false,
      verified: true
    }
  ];

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsWithdrawing(false);
    // Show success message
    alert(`Successfully withdrew £${availableBalance.toLocaleString()} to your bank account`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'processing':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-orange-500/20 text-orange-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'payout':
        return <ArrowUpRight className="w-4 h-4 text-green-400" />;
      case 'refund':
        return <ArrowDownRight className="w-4 h-4 text-orange-400" />;
      case 'fee':
        return <DollarSign className="w-4 h-4 text-gray-400" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-400" />;
    }
  };

  const filteredTransactions = transactions.filter(txn => {
    if (filterStatus !== 'all' && txn.status !== filterStatus) return false;
    if (searchQuery && !txn.description.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !txn.reference.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
          Payouts
        </h1>
        <p className="text-gray-400 text-sm sm:text-base">
          Manage your earnings and payment methods
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
        {/* Available Balance */}
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-6 h-6 text-green-400" />
            <span className="text-green-400 text-xs font-semibold">AVAILABLE</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Available Balance</p>
          <p className="text-white font-bold text-3xl mb-1">£{availableBalance.toLocaleString()}</p>
          <p className="text-green-400 text-xs">Ready to withdraw</p>
        </div>

        {/* Pending Payouts */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-6 h-6 text-blue-400" />
            <span className="text-blue-400 text-xs font-semibold">PENDING</span>
          </div>
          <p className="text-gray-400 text-sm mb-1">Pending Payouts</p>
          <p className="text-white font-bold text-3xl mb-1">£{pendingPayouts.toLocaleString()}</p>
          <p className="text-blue-400 text-xs">{nextPayoutDate}</p>
        </div>

        {/* Total Paid Out */}
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-6 h-6 text-purple-400" />
            <div className="flex items-center gap-1 text-purple-400 text-xs">
              <TrendingUp className="w-3 h-3" />
              <span>12%</span>
            </div>
          </div>
          <p className="text-gray-400 text-sm mb-1">Total Paid Out</p>
          <p className="text-white font-bold text-3xl mb-1">£{totalPaidOut.toLocaleString()}</p>
          <p className="text-purple-400 text-xs">Lifetime earnings</p>
        </div>

        {/* Payment Methods */}
        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <Building className="w-6 h-6 text-orange-400" />
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-gray-400 text-sm mb-1">Payment Methods</p>
          <p className="text-white font-bold text-3xl mb-1">{paymentMethods.length}</p>
          <p className="text-orange-400 text-xs">Active accounts</p>
        </div>
      </div>

      {/* Quick Withdraw Card */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6 mb-6 sm:mb-8">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-400" />
              <h2 className="text-white font-bold text-xl">Instant Withdrawal</h2>
            </div>
            <p className="text-gray-400 text-sm mb-3">
              £{availableBalance.toLocaleString()} ready to withdraw to {paymentMethods.find(m => m.isPrimary)?.bankName}
            </p>
            <div className="flex items-center gap-2 text-green-400 text-xs">
              <Shield className="w-4 h-4" />
              <span>Secure • No fees • Instant transfer</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing || availableBalance === 0}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <DollarSign className="w-5 h-5" />
                  <span>Withdraw Now</span>
                </>
              )}
            </button>
            <Link href="/organizer/settings">
              <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors">
                <Calendar className="w-5 h-5" />
                <span>Schedule</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Revenue Trend Chart */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white font-bold text-xl mb-1">Revenue Trend</h2>
            <p className="text-gray-400 text-sm">Last 30 days payout history</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedPeriod('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedPeriod === '7days'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setSelectedPeriod('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedPeriod === '30days'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setSelectedPeriod('90days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedPeriod === '90days'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              90D
            </button>
          </div>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickFormatter={(value) => `£${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
                formatter={(value: any) => [`£${value.toLocaleString()}`, 'Amount']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 sm:mb-8">
        {/* Payment Methods (1/3) */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg">Payment Methods</h2>
            <button
              onClick={() => setShowAddBankModal(true)}
              className="p-2 text-purple-400 hover:text-purple-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 rounded-xl border ${
                  method.isPrimary
                    ? 'bg-purple-500/10 border-purple-500/30'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{method.bankName}</p>
                      <p className="text-gray-400 text-xs">
                        {method.sortCode} • {method.accountNumber}
                      </p>
                    </div>
                  </div>
                  {method.verified && (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  )}
                </div>

                {method.isPrimary && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full text-xs font-semibold">
                      Primary
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button className="text-purple-400 hover:text-purple-300 text-xs font-medium">
                    Edit
                  </button>
                  {!method.isPrimary && (
                    <>
                      <span className="text-gray-600">•</span>
                      <button className="text-purple-400 hover:text-purple-300 text-xs font-medium">
                        Set as Primary
                      </button>
                      <span className="text-gray-600">•</span>
                      <button className="text-red-400 hover:text-red-300 text-xs font-medium">
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowAddBankModal(true)}
            className="w-full mt-4 py-3 border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl text-gray-400 hover:text-purple-400 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Bank Account
          </button>
        </div>

        {/* Payout Settings (2/3) */}
        <div className="lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-bold text-lg mb-4">Payout Settings</h2>

          <div className="space-y-6">
            {/* Payout Schedule */}
            <div>
              <label className="text-white font-medium text-sm mb-3 block">
                Payout Schedule
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {['daily', 'weekly', 'monthly'].map((schedule) => (
                  <button
                    key={schedule}
                    className="p-4 rounded-xl border-2 border-gray-700 hover:border-purple-500 bg-gray-800 transition-all capitalize"
                  >
                    <Clock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                    <div className="text-white text-sm font-medium">{schedule}</div>
                  </button>
                ))}
              </div>
              <p className="text-gray-500 text-xs mt-2">
                Current: Weekly payouts every Monday at 9:00 AM
              </p>
            </div>

            {/* Minimum Payout Amount */}
            <div>
              <label className="text-white font-medium text-sm mb-2 block">
                Minimum Payout Amount
              </label>
              <select className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                <option value={50}>£50</option>
                <option value={100}>£100</option>
                <option value={250}>£250</option>
                <option value={500}>£500</option>
                <option value={1000}>£1,000</option>
              </select>
              <p className="text-gray-500 text-xs mt-2">
                Payouts will only process when your balance exceeds this amount
              </p>
            </div>

            {/* Auto-withdraw */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="autoWithdraw"
                className="mt-1 w-5 h-5 rounded border-gray-700 bg-gray-800"
              />
              <div className="flex-1">
                <label htmlFor="autoWithdraw" className="text-white font-medium text-sm block cursor-pointer">
                  Enable Automatic Withdrawals
                </label>
                <p className="text-gray-400 text-xs mt-1">
                  Automatically transfer available balance to your primary bank account on schedule
                </p>
              </div>
            </div>

            {/* Info banner */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-400 font-semibold text-sm mb-1">No Hidden Fees</p>
                <p className="text-gray-400 text-xs">
                  We don't charge any withdrawal fees. Your money is always available instantly with no holds or delays.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-white font-bold text-xl mb-1">Transaction History</h2>
            <p className="text-gray-400 text-sm">All your payouts and transactions</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            {/* Export */}
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium text-sm transition-colors">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Transaction</th>
                <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Event</th>
                <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Date</th>
                <th className="text-left text-gray-400 font-medium text-xs uppercase py-3 px-4">Status</th>
                <th className="text-right text-gray-400 font-medium text-xs uppercase py-3 px-4">Amount</th>
                <th className="text-right text-gray-400 font-medium text-xs uppercase py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        txn.type === 'payout' ? 'bg-green-500/20' :
                        txn.type === 'refund' ? 'bg-orange-500/20' :
                        'bg-gray-700'
                      }`}>
                        {getTransactionIcon(txn.type)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{txn.description}</p>
                        <p className="text-gray-500 text-xs">{txn.reference}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-400 text-sm">{txn.event}</p>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-gray-400 text-sm">
                      {new Date(txn.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {new Date(txn.date).toLocaleTimeString('en-GB', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <p className={`font-bold text-sm ${txn.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {txn.amount >= 0 ? '+' : ''}£{Math.abs(txn.amount).toLocaleString()}
                    </p>
                    {txn.fee > 0 && (
                      <p className="text-gray-500 text-xs">Fee: £{txn.fee}</p>
                    )}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No transactions found</p>
          </div>
        )}

        {/* Pagination */}
        {filteredTransactions.length > 0 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-800">
            <p className="text-gray-400 text-sm">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                Previous
              </button>
              <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Bank Modal */}
      {showAddBankModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Add Bank Account</h3>
              <button
                onClick={() => setShowAddBankModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">
                  Bank Name
                </label>
                <input
                  type="text"
                  placeholder="e.g., Barclays"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">
                  Account Number
                </label>
                <input
                  type="text"
                  placeholder="12345678"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium mb-2 block">
                  Sort Code
                </label>
                <input
                  type="text"
                  placeholder="20-00-00"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="setPrimary"
                  className="w-5 h-5 rounded border-gray-700 bg-gray-800"
                />
                <label htmlFor="setPrimary" className="text-white text-sm cursor-pointer">
                  Set as primary payment method
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddBankModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddBankModal(false)}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}