'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, RefreshCw, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RefundPolicy() {
  const [expandedSection, setExpandedSection] = useState<string | null>('overview');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-white font-bold text-xl">Refund Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: November 20, 2024</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-2xl p-6 mb-8 border border-green-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <RefreshCw className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Fair & Transparent Refunds</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                At Lurexo, we believe in fair and transparent refund policies. This policy outlines when you can get a refund, 
                how to request one, and what to expect. Refund policies are set by event organizers and clearly displayed before purchase.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Reference Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Event Cancelled</h3>
            <p className="text-gray-400 text-sm">Full automatic refund within 5-10 business days</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center mb-3">
              <Clock className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Event Postponed</h3>
            <p className="text-gray-400 text-sm">Tickets valid for new date, or request refund within 14 days</p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-3">
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold mb-2">Buyer Cancellation</h3>
            <p className="text-gray-400 text-sm">Depends on event organizer policy—check event page</p>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* 1. Overview */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('overview')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">1. Refund Policy Overview</h2>
              {expandedSection === 'overview' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'overview' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Lurexo acts as a marketplace connecting ticket buyers with event organizers. Refund policies are determined by 
                  event organizers and vary by event. We ensure these policies are clearly displayed on each event page before you purchase.
                </p>
                
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mt-4">
                  <p className="text-purple-300 text-sm">
                    <strong>Transparency First:</strong> You'll always see the exact refund policy before completing your purchase. 
                    No surprises, no fine print.
                  </p>
                </div>

                <p className="mt-4">
                  This policy covers three main scenarios:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Event cancellations</strong> by the organizer</li>
                  <li><strong>Event postponements</strong> or date changes</li>
                  <li><strong>Buyer-initiated cancellations</strong> (you can't attend)</li>
                </ul>
              </div>
            )}
          </section>

          {/* 2. Event Cancellation */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('cancellation')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">2. Event Cancelled by Organizer</h2>
              </div>
              {expandedSection === 'cancellation' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'cancellation' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">Full Automatic Refund</h3>
                <p>
                  If an event is cancelled by the organizer, you are automatically entitled to a full refund of the ticket price. 
                  This includes all fees paid to Lurexo.
                </p>

                <h3 className="text-white font-semibold mt-4">What Happens Next</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white font-semibold">Notification</p>
                      <p className="text-gray-400 text-sm">You'll receive an email and app notification about the cancellation</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-semibold">Automatic Processing</p>
                      <p className="text-gray-400 text-sm">Refund is automatically initiated—no action required from you</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white font-semibold">Payment Return</p>
                      <p className="text-gray-400 text-sm">Refund appears in your original payment method within 5-10 business days</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
                  <p className="text-white font-semibold mb-2">Timeline</p>
                  <ul className="text-sm space-y-1">
                    <li><strong>Credit/Debit Card:</strong> 5-10 business days</li>
                    <li><strong>PayPal:</strong> 3-5 business days</li>
                    <li><strong>Apple Pay/Google Pay:</strong> 5-10 business days</li>
                  </ul>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-blue-300 text-sm">
                    <strong>Bank Processing Times:</strong> The timeline depends on your bank's processing speed. 
                    Most refunds appear within 5-7 days, but some banks may take up to 10 business days.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 3. Event Postponement */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('postponement')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">3. Event Postponed or Rescheduled</h2>
              </div>
              {expandedSection === 'postponement' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'postponement' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">Tickets Remain Valid</h3>
                <p>
                  If an event is postponed or rescheduled, your tickets automatically remain valid for the new date. 
                  You don't need to take any action.
                </p>

                <h3 className="text-white font-semibold mt-4">Can't Attend the New Date?</h3>
                <p>
                  If you cannot attend the rescheduled event, you can request a refund within 14 days of the postponement announcement.
                </p>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
                  <p className="text-white font-semibold mb-3">How to Request a Refund</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Go to "My Tickets" in your account</li>
                    <li>Select the affected ticket</li>
                    <li>Click "Request Refund" button</li>
                    <li>Provide a brief reason (optional)</li>
                    <li>Submit your request</li>
                  </ol>
                </div>

                <p className="mt-4">
                  <strong>Important:</strong> You must request the refund within 14 days of the postponement notification. 
                  After this period, tickets remain valid but are no longer eligible for refund.
                </p>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4">
                  <p className="text-yellow-300 text-sm">
                    <strong>Alternative Option:</strong> If you can't attend the new date, you can also transfer your tickets 
                    for free to someone who can attend. See our{' '}
                    <Link href="/terms" className="underline hover:text-yellow-200">
                      Terms of Service
                    </Link>{' '}
                    for details on ticket transfers.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 4. Buyer Cancellation */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('buyer')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">4. Buyer-Initiated Cancellation</h2>
              </div>
              {expandedSection === 'buyer' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'buyer' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  If you can no longer attend an event, refund availability depends on the event organizer's policy. 
                  This policy is always clearly displayed on the event page before purchase.
                </p>

                <h3 className="text-white font-semibold mt-4">Common Refund Policies</h3>
                
                <div className="space-y-3">
                  {/* Flexible */}
                  <div className="bg-gray-800 border border-green-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <h4 className="text-white font-semibold">Flexible Refund Policy</h4>
                    </div>
                    <p className="mb-2">Full refund if cancelled 7+ days before the event</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• 7+ days before: 100% refund</li>
                      <li>• 3-6 days before: 50% refund</li>
                      <li>• Within 48 hours: No refund</li>
                    </ul>
                  </div>

                  {/* Moderate */}
                  <div className="bg-gray-800 border border-yellow-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-white font-semibold">Moderate Refund Policy</h4>
                    </div>
                    <p className="mb-2">Partial refund available up to 14 days before</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• 14+ days before: 80% refund</li>
                      <li>• 7-13 days before: 50% refund</li>
                      <li>• Less than 7 days: No refund</li>
                    </ul>
                  </div>

                  {/* Strict */}
                  <div className="bg-gray-800 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                      <h4 className="text-white font-semibold">No Refund Policy</h4>
                    </div>
                    <p className="mb-2">All sales final—no refunds for buyer cancellations</p>
                    <ul className="text-xs text-gray-400 space-y-1">
                      <li>• Tickets can be transferred for free</li>
                      <li>• Tickets can be resold on our marketplace (up to 110% of face value)</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mt-4">
                  <p className="text-purple-300 text-sm">
                    <strong>Always Check Before Buying:</strong> The refund policy is shown in the "Quick Facts" section 
                    of every event page and must be acknowledged during checkout.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 5. How to Request Refund */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('request')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">5. How to Request a Refund</h2>
              {expandedSection === 'request' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'request' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">Via Your Account</h3>
                <ol className="list-decimal pl-5 space-y-3">
                  <li>
                    <strong>Log in to your Lurexo account</strong>
                    <p className="text-gray-400 text-sm mt-1">Visit lurexo.co.uk and sign in</p>
                  </li>
                  <li>
                    <strong>Navigate to "My Tickets"</strong>
                    <p className="text-gray-400 text-sm mt-1">Find this in the main navigation menu</p>
                  </li>
                  <li>
                    <strong>Select the ticket you want to refund</strong>
                    <p className="text-gray-400 text-sm mt-1">Click on the specific event ticket</p>
                  </li>
                  <li>
                    <strong>Click "Request Refund"</strong>
                    <p className="text-gray-400 text-sm mt-1">Only available if within the refund window</p>
                  </li>
                  <li>
                    <strong>Confirm your request</strong>
                    <p className="text-gray-400 text-sm mt-1">Review refund amount and submit</p>
                  </li>
                </ol>

                <h3 className="text-white font-semibold mt-6">Via Customer Support</h3>
                <p>
                  If you're unable to request a refund through your account, contact our support team:
                </p>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-2">
                  <p><strong>Email:</strong> refunds@lurexo.co.uk</p>
                  <p className="mt-2"><strong>Live Chat:</strong> Available in-app 9am-9pm GMT</p>
                  <p className="mt-2"><strong>Phone:</strong> +44 (0) XXX XXX XXXX (Mon-Fri, 9am-6pm)</p>
                </div>

                <p className="mt-4">
                  <strong>Include in your request:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Order number (format: LRX-YYYY-XXXX)</li>
                  <li>Event name and date</li>
                  <li>Reason for refund request</li>
                  <li>Email address associated with your account</li>
                </ul>
              </div>
            )}
          </section>

          {/* 6. Refund Processing */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('processing')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">6. Refund Processing Times</h2>
              {expandedSection === 'processing' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'processing' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Once your refund is approved, processing times depend on your payment method:
                </p>

                <div className="space-y-3">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Credit/Debit Cards</h4>
                    <p className="text-gray-400 text-sm">5-10 business days</p>
                    <p className="text-xs text-gray-500 mt-1">Most common. Depends on your bank's processing time.</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">PayPal</h4>
                    <p className="text-gray-400 text-sm">3-5 business days</p>
                    <p className="text-xs text-gray-500 mt-1">Usually faster. Funds appear in your PayPal balance.</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Apple Pay / Google Pay</h4>
                    <p className="text-gray-400 text-sm">5-10 business days</p>
                    <p className="text-xs text-gray-500 mt-1">Refunded to the card linked to your digital wallet.</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-blue-300 text-sm">
                    <strong>Tracking Your Refund:</strong> You'll receive email updates at each stage: request received, 
                    approved, and processed. You can also check the status in "Order History" in your account.
                  </p>
                </div>

                <p className="mt-4">
                  <strong>If your refund doesn't appear after 10 business days:</strong>
                </p>
                <ol className="list-decimal pl-5 space-y-1">
                  <li>Check your bank/card statement for pending transactions</li>
                  <li>Verify the refund was approved in your Lurexo account</li>
                  <li>Contact your bank to check if they're holding the refund</li>
                  <li>If still not resolved, contact our support team with your order number</li>
                </ol>
              </div>
            )}
          </section>

          {/* 7. Partial Refunds */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('partial')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">7. Partial Refunds</h2>
              {expandedSection === 'partial' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'partial' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Some events offer partial refunds based on how far in advance you cancel. The exact percentage depends 
                  on the event organizer's policy.
                </p>

                <h3 className="text-white font-semibold mt-4">How Partial Refunds Are Calculated</h3>
                <p>
                  If an event has a partial refund policy, the refund amount is calculated as a percentage of the original 
                  ticket price, including fees:
                </p>

                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
                  <p className="text-white font-semibold mb-3">Example Calculation</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Original Ticket Price:</span>
                      <span className="text-white">£50.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Service Fee (5%):</span>
                      <span className="text-white">£2.50</span>
                    </div>
                    <div className="flex justify-between border-t border-gray-700 pt-2">
                      <span className="text-white font-semibold">Total Paid:</span>
                      <span className="text-white font-semibold">£52.50</span>
                    </div>
                    <div className="flex justify-between text-yellow-400 mt-3">
                      <span>50% Refund:</span>
                      <span className="font-semibold">£26.25</span>
                    </div>
                  </div>
                </div>

                <p className="mt-4">
                  Partial refunds are processed to your original payment method in the same timeframe as full refunds (5-10 business days).
                </p>
              </div>
            )}
          </section>

          {/* 8. Exceptions */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('exceptions')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">8. Exceptions & Special Cases</h2>
              {expandedSection === 'exceptions' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'exceptions' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">Transferring Instead of Refunding</h3>
                <p>
                  If you can't attend but know someone who can, consider using our free ticket transfer feature instead of 
                  requesting a refund. Transfers are instant and don't depend on the event's refund policy.
                </p>

                <h3 className="text-white font-semibold mt-4">Reselling Your Tickets</h3>
                <p>
                  For events with no refund policy, you can list your tickets on our resale marketplace at up to 110% of 
                  face value. This gives you another option if you can't attend.
                </p>

                <h3 className="text-white font-semibold mt-4">Medical Emergencies</h3>
                <p>
                  While we cannot override an organizer's refund policy, in cases of documented medical emergencies, we will 
                  work with event organizers on your behalf to request an exception. Contact our support team with documentation.
                </p>

                <h3 className="text-white font-semibold mt-4">Duplicate Purchases</h3>
                <p>
                  If you accidentally purchased tickets multiple times for the same event, contact us within 24 hours. 
                  We can usually help cancel duplicate orders for a full refund.
                </p>

                <h3 className="text-white font-semibold mt-4">Platform Errors</h3>
                <p>
                  If you believe an error on our platform resulted in an incorrect purchase (wrong date, wrong venue, etc.), 
                  contact us immediately. We'll investigate and issue a refund if we determine the error was on our end.
                </p>
              </div>
            )}
          </section>

          {/* 9. Contact */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">9. Contact Us About Refunds</h2>
              {expandedSection === 'contact' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'contact' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  If you have questions about refunds or need assistance:
                </p>
                
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
                  <p className="font-semibold text-white mb-2">Lurexo Support Team</p>
                  <p>Email: refunds@lurexo.co.uk</p>
                  <p>General Support: support@lurexo.co.uk</p>
                  <p className="mt-2">Live Chat: Available in-app 9am-9pm GMT</p>
                  <p>Phone: +44 (0) XXX XXX XXXX (Mon-Fri, 9am-6pm)</p>
                </div>

                <p className="mt-4">
                  <strong>Response Times:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Live Chat: Immediate to 5 minutes</li>
                  <li>Email: Within 24 hours</li>
                  <li>Phone: Immediate during business hours</li>
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors">
              Cookie Policy
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
              Contact Us
            </Link>
          </div>
          <p className="text-center text-gray-600 text-xs mt-6">
            © 2025 Lurexo Ltd. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
}