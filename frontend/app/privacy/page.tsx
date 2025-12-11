'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, ArrowLeft, Shield, Lock, Eye, Database, Cookie, Globe } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
    const router = useRouter();
    const [expandedSection, setExpandedSection] = useState<string | null>('intro');

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
            <h1 className="text-white font-bold text-xl">Privacy Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: November 20, 2024</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 mb-8 border border-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Your Privacy Matters</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                At Lurexo, we're committed to protecting your privacy. This policy explains how we collect, use, and safeguard 
                your personal information. We believe in transparency and put you in control of your data.
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* 1. Information We Collect */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('intro')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Database className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">1. Information We Collect</h2>
              </div>
              {expandedSection === 'intro' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'intro' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, phone number, date of birth</li>
                  <li><strong>Payment Information:</strong> Credit/debit card details (securely processed by our payment provider)</li>
                  <li><strong>Profile Information:</strong> Profile picture, preferences, saved venues</li>
                  <li><strong>Communication:</strong> Messages you send to support or event organizers</li>
                  <li><strong>Event Preferences:</strong> Favorite artists, genres, locations</li>
                </ul>

                <h3 className="text-white font-semibold mt-4">Information We Collect Automatically</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Device Information:</strong> Device type, operating system, browser type</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                  <li><strong>Location Data:</strong> IP address, approximate location (with your permission)</li>
                  <li><strong>Cookies & Tracking:</strong> See our Cookie Policy for details</li>
                  <li><strong>Transaction History:</strong> Tickets purchased, transfers made, refunds processed</li>
                </ul>

                <h3 className="text-white font-semibold mt-4">Information from Third Parties</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Social Media:</strong> If you sign in with social accounts</li>
                  <li><strong>Payment Processors:</strong> Transaction confirmation data</li>
                  <li><strong>Event Organizers:</strong> Entry verification data</li>
                </ul>
              </div>
            )}
          </section>

          {/* 2. How We Use Your Information */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('usage')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-purple-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">2. How We Use Your Information</h2>
              </div>
              {expandedSection === 'usage' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'usage' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>We use your information to:</p>

                <h3 className="text-white font-semibold">Provide Our Services</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process ticket purchases and transfers</li>
                  <li>Deliver digital tickets and confirmations</li>
                  <li>Manage your account and preferences</li>
                  <li>Provide customer support</li>
                  <li>Facilitate refunds and cancellations</li>
                </ul>

                <h3 className="text-white font-semibold mt-4">Improve Your Experience</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Recommend events based on your interests</li>
                  <li>Personalize your homepage and notifications</li>
                  <li>Remember your preferences and settings</li>
                  <li>Provide location-based event suggestions</li>
                </ul>

                <h3 className="text-white font-semibold mt-4">Security & Fraud Prevention</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Detect and prevent bot activity</li>
                  <li>Verify identity and payment information</li>
                  <li>Monitor suspicious transactions</li>
                  <li>Enforce our Terms of Service</li>
                </ul>

                <h3 className="text-white font-semibold mt-4">Communication</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Send order confirmations and ticket updates</li>
                  <li>Notify you of event changes or cancellations</li>
                  <li>Share promotional offers (with your consent)</li>
                  <li>Respond to your inquiries</li>
                </ul>

                <h3 className="text-white font-semibold mt-4">Legal & Compliance</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Comply with legal obligations</li>
                  <li>Respond to law enforcement requests</li>
                  <li>Enforce our agreements and policies</li>
                  <li>Protect the rights and safety of our users</li>
                </ul>
              </div>
            )}
          </section>

          {/* 3. Legal Basis for Processing */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('legal')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">3. Legal Basis for Processing (GDPR)</h2>
              {expandedSection === 'legal' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'legal' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>Under GDPR, we process your personal data based on the following legal grounds:</p>
                
                <div className="space-y-4 mt-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Contract Performance</h4>
                    <p>Processing necessary to provide our ticketing services (account management, ticket delivery, payment processing)</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Legitimate Interest</h4>
                    <p>Fraud prevention, platform security, analytics to improve services, customer support</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Consent</h4>
                    <p>Marketing communications, optional data collection like precise location, cookies (non-essential)</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Legal Obligation</h4>
                    <p>Tax compliance, responding to legal requests, enforcing legal rights</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 4. Data Sharing */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('sharing')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">4. How We Share Your Information</h2>
              </div>
              {expandedSection === 'sharing' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'sharing' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>We share your information only in these limited circumstances:</p>

                <h3 className="text-white font-semibold">Event Organizers</h3>
                <p>
                  When you purchase tickets, we share necessary information with event organizers including your name, 
                  email, and ticket details for entry verification and event communications.
                </p>

                <h3 className="text-white font-semibold mt-4">Service Providers</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Payment Processors:</strong> Stripe, Apple Pay, Google Pay (for payment processing)</li>
                  <li><strong>Cloud Hosting:</strong> AWS, Google Cloud (for data storage)</li>
                  <li><strong>Email Services:</strong> SendGrid (for transactional emails)</li>
                  <li><strong>Analytics:</strong> Google Analytics (anonymized data)</li>
                  <li><strong>Customer Support:</strong> Zendesk, Intercom</li>
                </ul>

                <h3 className="text-white font-semibold mt-4">Legal Requirements</h3>
                <p>
                  We may disclose information if required by law, court order, or government request, or to protect our rights, 
                  property, or the safety of our users.
                </p>

                <h3 className="text-white font-semibold mt-4">Business Transfers</h3>
                <p>
                  In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner. 
                  You will be notified of any such change.
                </p>

                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mt-4">
                  <p className="text-red-300 text-sm">
                    <strong>We Never Sell Your Data:</strong> We do not and will never sell your personal information to third parties 
                    for marketing purposes.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 5. Data Security */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('security')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <Lock className="w-5 h-5 text-red-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">5. Data Security</h2>
              </div>
              {expandedSection === 'security' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'security' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  We implement industry-standard security measures to protect your data:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Encryption:</strong> All data transmitted is encrypted using TLS/SSL</li>
                  <li><strong>Secure Storage:</strong> Data at rest is encrypted using AES-256</li>
                  <li><strong>Access Controls:</strong> Role-based access and multi-factor authentication for employees</li>
                  <li><strong>Payment Security:</strong> PCI-DSS compliant payment processing</li>
                  <li><strong>Regular Audits:</strong> Third-party security assessments</li>
                  <li><strong>Bot Protection:</strong> Advanced systems to detect and block automated threats</li>
                  <li><strong>Monitoring:</strong> 24/7 security monitoring and incident response</li>
                </ul>

                <p className="mt-4">
                  While we strive to protect your information, no method of transmission over the internet is 100% secure. 
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
            )}
          </section>

          {/* 6. Your Rights */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('rights')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">6. Your Privacy Rights</h2>
              {expandedSection === 'rights' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'rights' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>Under GDPR and UK data protection law, you have the following rights:</p>

                <div className="space-y-4 mt-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Right to Access</h4>
                    <p>Request a copy of all personal data we hold about you</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Right to Rectification</h4>
                    <p>Correct inaccurate or incomplete information</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Right to Erasure ("Right to be Forgotten")</h4>
                    <p>Request deletion of your personal data (subject to legal requirements)</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Right to Restrict Processing</h4>
                    <p>Limit how we use your data in certain circumstances</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Right to Data Portability</h4>
                    <p>Receive your data in a machine-readable format</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Right to Object</h4>
                    <p>Object to processing based on legitimate interests or for marketing</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Right to Withdraw Consent</h4>
                    <p>Withdraw consent for data processing at any time</p>
                  </div>
                </div>

                <p className="mt-4">
                  To exercise any of these rights, contact us at privacy@lurexo.co.uk. We will respond within 30 days.
                </p>
              </div>
            )}
          </section>

          {/* 7. Cookies */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('cookies')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                  <Cookie className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-white font-semibold text-lg">7. Cookies & Tracking</h2>
              </div>
              {expandedSection === 'cookies' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'cookies' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  We use cookies and similar technologies to improve your experience. See our detailed{' '}
                  <Link href="/cookies" className="text-purple-400 hover:underline">
                    Cookie Policy
                  </Link>{' '}
                  for more information.
                </p>

                <h3 className="text-white font-semibold">Types of Cookies We Use</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
                  <li><strong>Performance Cookies:</strong> Analytics and site optimization</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences</li>
                  <li><strong>Marketing Cookies:</strong> Personalized content (with consent)</li>
                </ul>

                <p className="mt-4">
                  You can manage cookie preferences in your account settings or browser. Note that disabling essential cookies 
                  may affect platform functionality.
                </p>
              </div>
            )}
          </section>

          {/* 8. Data Retention */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('retention')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">8. Data Retention</h2>
              {expandedSection === 'retention' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'retention' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>We retain your personal data for as long as necessary to provide our services and comply with legal obligations:</p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Data:</strong> Until you delete your account + 30 days</li>
                  <li><strong>Transaction Records:</strong> 7 years (tax and legal requirements)</li>
                  <li><strong>Support Communications:</strong> 3 years after resolution</li>
                  <li><strong>Marketing Data:</strong> Until you opt out + 30 days</li>
                  <li><strong>Analytics Data:</strong> Anonymized after 26 months</li>
                </ul>

                <p className="mt-4">
                  After the retention period, we securely delete or anonymize your data. Some data may be retained longer if 
                  required for legal proceedings or regulatory obligations.
                </p>
              </div>
            )}
          </section>

          {/* 9. Children's Privacy */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('children')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">9. Children's Privacy</h2>
              {expandedSection === 'children' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'children' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Our services are not intended for children under 13. We do not knowingly collect personal information from 
                  children under 13. If you believe we have collected information from a child under 13, please contact us 
                  immediately at privacy@lurexo.co.uk.
                </p>
                <p>
                  For users aged 13-18, parental consent may be required depending on local laws. Some events may have age 
                  restrictions set by organizers.
                </p>
              </div>
            )}
          </section>

          {/* 10. International Transfers */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('international')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">10. International Data Transfers</h2>
              {expandedSection === 'international' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'international' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Your data may be transferred to and processed in countries outside the UK/EU, including the United States, 
                  where our cloud infrastructure and service providers operate.
                </p>
                <p>
                  We ensure adequate protection through:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Standard Contractual Clauses approved by the EU Commission</li>
                  <li>Data Processing Agreements with all service providers</li>
                  <li>Ensuring service providers comply with GDPR standards</li>
                  <li>Regular audits of data protection practices</li>
                </ul>
              </div>
            )}
          </section>

          {/* 11. Changes to This Policy */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('changes')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">11. Changes to This Policy</h2>
              {expandedSection === 'changes' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'changes' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of material changes via:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Email notification to your registered address</li>
                  <li>Prominent notice on our platform</li>
                  <li>In-app notification</li>
                </ul>
                <p className="mt-4">
                  Your continued use of Lurexo after changes take effect constitutes acceptance of the updated policy. 
                  We encourage you to review this policy periodically.
                </p>
              </div>
            )}
          </section>

          {/* 12. Contact & Complaints */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">12. Contact Us & Complaints</h2>
              {expandedSection === 'contact' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'contact' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  If you have questions, concerns, or complaints about our privacy practices, please contact:
                </p>
                
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
                  <p className="font-semibold text-white mb-2">Data Protection Officer</p>
                  <p>Email: privacy@lurexo.co.uk</p>
                  <p>Support: support@lurexo.co.uk</p>
                  <p className="mt-2">Lurexo Ltd</p>
                  <p>Registered in England and Wales</p>
                  <p>Company Number: [To be added]</p>
                  <p>Registered Office: [To be added]</p>
                </div>

                <h3 className="text-white font-semibold mt-6">Right to Lodge a Complaint</h3>
                <p>
                  You have the right to lodge a complaint with the Information Commissioner's Office (ICO), 
                  the UK's data protection authority:
                </p>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-2">
                  <p className="font-semibold text-white mb-2">Information Commissioner's Office</p>
                  <p>Website: ico.org.uk</p>
                  <p>Helpline: 0303 123 1113</p>
                  <p>Address: Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF</p>
                </div>
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