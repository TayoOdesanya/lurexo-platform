'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, ArrowLeft, Shield, FileText, CreditCard, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TermsOfService() {
    const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>('acceptance');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
            </button>
          <div>
            <h1 className="text-white font-bold text-xl">Terms of Service</h1>
            <p className="text-gray-400 text-sm">Last updated: November 20, 2024</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 mb-8 border border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Welcome to Lurexo</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                These Terms of Service govern your use of Lurexo's ticketing platform. By accessing or using our services, 
                you agree to be bound by these terms. Please read them carefully.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* 1. Acceptance of Terms */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('acceptance')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">1. Acceptance of Terms</h2>
              {expandedSection === 'acceptance' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'acceptance' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  By creating an account, purchasing tickets, or otherwise using Lurexo, you accept and agree to be bound by these Terms of Service 
                  and our Privacy Policy. If you do not agree to these terms, you may not use our services.
                </p>
                <p>
                  We reserve the right to modify these terms at any time. We will notify users of material changes via email or through our platform. 
                  Your continued use of Lurexo after such modifications constitutes acceptance of the updated terms.
                </p>
              </div>
            )}
          </section>

          {/* 2. Account Registration */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('registration')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">2. Account Registration</h2>
              {expandedSection === 'registration' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'registration' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  To purchase tickets, you must create an account and provide accurate, complete information. You are responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Notifying us immediately of any unauthorized access</li>
                  <li>Ensuring your contact information is current and accurate</li>
                </ul>
                <p>
                  You may not share your account, create multiple accounts, or transfer your account to another person without our written consent. 
                  We reserve the right to suspend or terminate accounts that violate these terms.
                </p>
              </div>
            )}
          </section>

          {/* 3. Ticket Purchase & Pricing */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('pricing')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">3. Ticket Purchase & Pricing</h2>
              </div>
              {expandedSection === 'pricing' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'pricing' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">Transparent Pricing</h3>
                <p>
                  At Lurexo, we believe in transparent pricing. The price you see is the price you pay—no hidden fees, no surprises at checkout.
                </p>
                
                <h3 className="text-white font-semibold mt-4">Payment</h3>
                <p>
                  All ticket purchases must be paid in full at the time of order. We accept major credit cards, debit cards, Apple Pay, and Google Pay. 
                  By providing payment information, you represent that you are authorized to use the payment method.
                </p>

                <h3 className="text-white font-semibold mt-4">Price Changes</h3>
                <p>
                  Ticket prices are set by event organizers and may change before you complete your purchase. Once your order is confirmed, 
                  the price is locked in.
                </p>

                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mt-4">
                  <p className="text-purple-300 text-sm">
                    <strong>Fair Pricing Promise:</strong> We cap resale prices at 110% of face value to protect fans from price gouging.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 4. Ticket Delivery */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('delivery')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">4. Ticket Delivery</h2>
              {expandedSection === 'delivery' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'delivery' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  All tickets are delivered digitally to your Lurexo account immediately upon purchase confirmation. You will receive:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email confirmation with order details</li>
                  <li>Digital tickets accessible in your account</li>
                  <li>QR codes for venue entry</li>
                  <li>Ability to add tickets to Apple Wallet or Google Pay</li>
                </ul>
                <p>
                  It is your responsibility to ensure you can access your tickets on the day of the event. We recommend adding them to your 
                  mobile wallet or taking screenshots as backup.
                </p>
              </div>
            )}
          </section>

          {/* 5. Refunds & Cancellations */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('refunds')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">5. Refunds & Cancellations</h2>
              {expandedSection === 'refunds' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'refunds' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">Event Cancellation</h3>
                <p>
                  If an event is cancelled by the organizer, you will receive a full refund to your original payment method within 5-10 business days.
                </p>

                <h3 className="text-white font-semibold mt-4">Event Postponement</h3>
                <p>
                  If an event is postponed, your tickets remain valid for the new date. If you cannot attend the rescheduled event, 
                  you may request a refund within 14 days of the postponement announcement.
                </p>

                <h3 className="text-white font-semibold mt-4">Buyer Cancellation</h3>
                <p>
                  Refund policies for buyer-initiated cancellations are set by event organizers. This information is clearly displayed 
                  on each event page before purchase. Common policies include:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Full refund:</strong> Cancel up to 7 days before the event</li>
                  <li><strong>Partial refund:</strong> Cancel 3-7 days before (typically 50%)</li>
                  <li><strong>No refund:</strong> Within 48 hours of the event</li>
                </ul>
              </div>
            )}
          </section>

          {/* 6. Ticket Transfers */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('transfers')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">6. Ticket Transfers</h2>
              </div>
              {expandedSection === 'transfers' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'transfers' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Lurexo offers free, secure ticket transfers. You can transfer tickets to friends or family at no additional cost, 
                  provided the event organizer allows transfers.
                </p>

                <h3 className="text-white font-semibold mt-4">How Transfers Work</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Initiate transfer through your account</li>
                  <li>Recipient must have or create a Lurexo account</li>
                  <li>Original ticket is invalidated once transfer is accepted</li>
                  <li>Transfer history is tracked for security</li>
                </ul>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4">
                  <p className="text-blue-300 text-sm">
                    <strong>Free Forever:</strong> Unlike other platforms, we never charge transfer fees. Your tickets, your choice.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 7. Resale & Secondary Market */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('resale')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">7. Resale & Secondary Market</h2>
              {expandedSection === 'resale' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'resale' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">Fair Resale Policy</h3>
                <p>
                  We support a fair secondary market that protects fans. If you can no longer attend an event, you may resell your tickets 
                  through our platform, subject to these rules:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Price Cap:</strong> Maximum 110% of the original price (face value + 10%)</li>
                  <li><strong>Organizer Control:</strong> Event organizers can disable resale if desired</li>
                  <li><strong>Platform Fee:</strong> 5% service fee on resale transactions</li>
                  <li><strong>Secure Transfer:</strong> All resales go through our verified system</li>
                </ul>

                <h3 className="text-white font-semibold mt-4">Prohibited Activities</h3>
                <p>
                  The following resale activities are strictly prohibited and may result in ticket cancellation and account termination:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Using bots or automated systems to purchase tickets</li>
                  <li>Purchasing tickets solely for resale at inflated prices</li>
                  <li>Selling tickets on unauthorized third-party platforms</li>
                  <li>Misrepresenting ticket details or pricing</li>
                </ul>
              </div>
            )}
          </section>

          {/* 8. Prohibited Conduct */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('conduct')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">8. Prohibited Conduct</h2>
              </div>
              {expandedSection === 'conduct' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'conduct' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Users are prohibited from engaging in the following activities:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Using automated tools, bots, or scripts to access the platform</li>
                  <li>Attempting to manipulate ticket availability or pricing</li>
                  <li>Creating fake accounts or impersonating others</li>
                  <li>Sharing account credentials with third parties</li>
                  <li>Reverse engineering or attempting to access our systems</li>
                  <li>Uploading malicious code or viruses</li>
                  <li>Harassing other users or event organizers</li>
                  <li>Violating any applicable laws or regulations</li>
                </ul>
                <p className="text-red-400 mt-4">
                  Violation of these rules may result in immediate account suspension, ticket cancellation, and potential legal action.
                </p>
              </div>
            )}
          </section>

          {/* 9. Intellectual Property */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('ip')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">9. Intellectual Property</h2>
              {expandedSection === 'ip' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'ip' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  All content on Lurexo, including but not limited to text, graphics, logos, icons, images, and software, is the property of 
                  Lurexo Ltd or its content suppliers and is protected by UK and international copyright laws.
                </p>
                <p>
                  The Lurexo name, logo, and all related product and service names are trademarks of Lurexo Ltd. You may not use these marks 
                  without our prior written permission.
                </p>
                <p>
                  Event organizers retain all rights to their event names, logos, and content. By listing events on Lurexo, organizers grant us 
                  a limited license to display this content for the purpose of ticket sales and promotion.
                </p>
              </div>
            )}
          </section>

          {/* 10. Liability & Disclaimers */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('liability')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">10. Liability & Disclaimers</h2>
              {expandedSection === 'liability' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'liability' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Lurexo acts as a marketplace connecting buyers and event organizers. We are not responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The quality, safety, or legality of events</li>
                  <li>Event cancellations or changes made by organizers</li>
                  <li>Actions or omissions of event organizers or venues</li>
                  <li>Personal injury or property damage at events</li>
                  <li>Loss or theft of tickets (physical or digital)</li>
                  <li>Technical issues with mobile devices or internet connectivity</li>
                </ul>
                
                <p className="mt-4">
                  Our platform is provided "as is" without warranties of any kind, either express or implied. To the maximum extent permitted by law, 
                  Lurexo disclaims all warranties, including implied warranties of merchantability and fitness for a particular purpose.
                </p>

                <p className="mt-4">
                  In no event shall Lurexo be liable for any indirect, incidental, special, or consequential damages arising out of or in connection 
                  with your use of our services. Our total liability shall not exceed the amount you paid for tickets in the relevant transaction.
                </p>
              </div>
            )}
          </section>

          {/* 11. Force Majeure */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('force')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">11. Force Majeure</h2>
              {expandedSection === 'force' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'force' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Lurexo is not responsible for any failure or delay in performance due to circumstances beyond our reasonable control, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Natural disasters, pandemics, or acts of God</li>
                  <li>War, terrorism, or civil unrest</li>
                  <li>Government actions or regulations</li>
                  <li>Internet or telecommunications failures</li>
                  <li>Cyberattacks or data breaches affecting third-party services</li>
                  <li>Strikes or labor disputes</li>
                </ul>
                <p className="mt-4">
                  In such events, we will make reasonable efforts to minimize the impact on users and resume normal operations as quickly as possible.
                </p>
              </div>
            )}
          </section>

          {/* 12. Governing Law */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('law')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">12. Governing Law & Disputes</h2>
              {expandedSection === 'law' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'law' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  These Terms of Service are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from 
                  these terms or your use of Lurexo shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                </p>

                <h3 className="text-white font-semibold mt-4">Dispute Resolution</h3>
                <p>
                  Before initiating legal proceedings, we encourage users to contact our support team to resolve disputes informally. If a resolution 
                  cannot be reached, you may pursue claims in small claims court or through binding arbitration.
                </p>

                <p className="mt-4">
                  <strong>Class Action Waiver:</strong> You agree to resolve disputes with Lurexo on an individual basis and waive any right to 
                  participate in class action lawsuits or class-wide arbitration.
                </p>
              </div>
            )}
          </section>

          {/* 13. Severability */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('severability')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">13. Severability</h2>
              {expandedSection === 'severability' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'severability' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  If any provision of these Terms of Service is found to be invalid, illegal, or unenforceable by a court of competent jurisdiction, 
                  such provision shall be modified to the minimum extent necessary to make it valid and enforceable. If modification is not possible, 
                  the provision shall be severed from these terms.
                </p>
                <p>
                  The invalidity or unenforceability of any provision shall not affect the validity or enforceability of the remaining provisions, 
                  which shall continue in full force and effect.
                </p>
              </div>
            )}
          </section>

          {/* 14. Contact Us */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">14. Contact Us</h2>
              {expandedSection === 'contact' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'contact' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  If you have any questions, concerns, or feedback regarding these Terms, please contact us:
                </p>
                
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
                  <p className="font-semibold text-white mb-2">Lurexo Ltd</p>
                  <p>Email: legal@lurexo.co.uk</p>
                  <p>Support: support@lurexo.co.uk</p>
                  <p className="mt-2">Registered in England and Wales</p>
                  <p>Company Number: [To be added]</p>
                  <p>Registered Office: [To be added]</p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer Links */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
            <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/cookies" className="text-gray-400 hover:text-purple-400 transition-colors">
              Cookie Policy
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/refund-policy" className="text-gray-400 hover:text-purple-400 transition-colors">
              Refund Policy
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