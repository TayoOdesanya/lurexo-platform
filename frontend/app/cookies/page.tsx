'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronUp, ArrowLeft, Cookie, Settings, Shield, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function CookiePolicy() {
    const router = useRouter();
    const [expandedSection, setExpandedSection] = useState<string | null>('what');
    const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false
  });

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handlePreferenceChange = (type: keyof typeof cookiePreferences) => {
    if (type === 'essential') return; // Essential cookies can't be disabled
    setCookiePreferences(prev => ({ ...prev, [type]: !prev[type] }));
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
            <h1 className="text-white font-bold text-xl">Cookie Policy</h1>
            <p className="text-gray-400 text-sm">Last updated: November 20, 2024</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 pb-24">
        {/* Introduction */}
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-2xl p-6 mb-8 border border-yellow-500/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Cookie className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg mb-2">Understanding Cookies</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                Cookies are small text files stored on your device when you visit our platform. They help us provide you with 
                a better experience, remember your preferences, and keep your account secure. You're always in control.
              </p>
            </div>
          </div>
        </div>

        {/* Cookie Preferences Panel */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-white font-bold text-lg">Manage Cookie Preferences</h2>
          </div>

          <div className="space-y-4">
            {/* Essential Cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-800 rounded-xl">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Essential Cookies</h3>
                <p className="text-gray-400 text-sm">Required for the platform to function. Cannot be disabled.</p>
              </div>
              <div className="ml-4">
                <div className="w-12 h-6 bg-purple-500 rounded-full flex items-center justify-end px-1">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Functional Cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-800 rounded-xl">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Functional Cookies</h3>
                <p className="text-gray-400 text-sm">Remember your preferences and settings for a personalized experience.</p>
              </div>
              <button
                onClick={() => handlePreferenceChange('functional')}
                className="ml-4"
              >
                <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                  cookiePreferences.functional ? 'bg-purple-500 justify-end' : 'bg-gray-600 justify-start'
                } px-1`}>
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </button>
            </div>

            {/* Analytics Cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-800 rounded-xl">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Analytics Cookies</h3>
                <p className="text-gray-400 text-sm">Help us understand how you use the platform to improve our services.</p>
              </div>
              <button
                onClick={() => handlePreferenceChange('analytics')}
                className="ml-4"
              >
                <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                  cookiePreferences.analytics ? 'bg-purple-500 justify-end' : 'bg-gray-600 justify-start'
                } px-1`}>
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </button>
            </div>

            {/* Marketing Cookies */}
            <div className="flex items-start justify-between p-4 bg-gray-800 rounded-xl">
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Marketing Cookies</h3>
                <p className="text-gray-400 text-sm">Show you relevant event recommendations and personalized content.</p>
              </div>
              <button
                onClick={() => handlePreferenceChange('marketing')}
                className="ml-4"
              >
                <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                  cookiePreferences.marketing ? 'bg-purple-500 justify-end' : 'bg-gray-600 justify-start'
                } px-1`}>
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
              </button>
            </div>
          </div>

          <button className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-colors">
            Save Preferences
          </button>
        </div>

        {/* Collapsible Sections */}
        <div className="space-y-4">
          {/* 1. What Are Cookies */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('what')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">1. What Are Cookies?</h2>
              {expandedSection === 'what' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'what' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Cookies are small text files that are placed on your computer, smartphone, or other device when you visit a website. 
                  They are widely used to make websites work more efficiently and provide information to the website owners.
                </p>
                <p>
                  Cookies can be "persistent" (remain on your device until deleted or they expire) or "session" (deleted when you close your browser). 
                  They can also be "first-party" (set by the website you're visiting) or "third-party" (set by other websites/services).
                </p>
              </div>
            )}
          </section>

          {/* 2. Why We Use Cookies */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('why')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">2. Why We Use Cookies</h2>
              {expandedSection === 'why' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'why' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>We use cookies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keep you signed in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Understand how you use our platform to improve it</li>
                  <li>Protect against fraud and keep your account secure</li>
                  <li>Provide personalized event recommendations</li>
                  <li>Measure the effectiveness of our marketing campaigns</li>
                  <li>Enable features like ticket transfers and wishlist</li>
                </ul>
              </div>
            )}
          </section>

          {/* 3. Types of Cookies We Use */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('types')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">3. Types of Cookies We Use</h2>
              {expandedSection === 'types' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'types' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-6">
                {/* Essential Cookies */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-white font-semibold">Essential Cookies</h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    These cookies are strictly necessary for the platform to function. They enable core features like account login, 
                    checkout, and security.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Examples:</p>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li><strong>session_id:</strong> Keeps you logged in (Session)</li>
                      <li><strong>csrf_token:</strong> Security protection (Session)</li>
                      <li><strong>cookie_consent:</strong> Remembers your cookie preferences (1 year)</li>
                      <li><strong>checkout_token:</strong> Secures payment process (Session)</li>
                    </ul>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Settings className="w-4 h-4 text-blue-400" />
                    </div>
                    <h3 className="text-white font-semibold">Functional Cookies</h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    These cookies enable enhanced functionality and personalization, such as remembering your location, language preference, 
                    and display settings.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Examples:</p>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li><strong>user_location:</strong> Remembers your preferred location (6 months)</li>
                      <li><strong>language_pref:</strong> Stores language choice (1 year)</li>
                      <li><strong>theme_mode:</strong> Dark/light mode preference (1 year)</li>
                      <li><strong>notification_settings:</strong> Notification preferences (1 year)</li>
                    </ul>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <BarChart className="w-4 h-4 text-green-400" />
                    </div>
                    <h3 className="text-white font-semibold">Analytics Cookies</h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    These cookies collect information about how you use our platform, helping us identify issues and improve user experience. 
                    All data is anonymized.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Examples:</p>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li><strong>_ga:</strong> Google Analytics ID (2 years)</li>
                      <li><strong>_gid:</strong> Google Analytics session ID (24 hours)</li>
                      <li><strong>_gat:</strong> Google Analytics throttle (1 minute)</li>
                      <li><strong>analytics_session:</strong> Internal analytics tracking (Session)</li>
                    </ul>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                      <Cookie className="w-4 h-4 text-orange-400" />
                    </div>
                    <h3 className="text-white font-semibold">Marketing Cookies</h3>
                  </div>
                  <p className="text-gray-300 mb-3">
                    These cookies track your browsing activity to show you relevant event recommendations and measure campaign effectiveness. 
                    These are only set with your consent.
                  </p>
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-xs text-gray-400 mb-2">Examples:</p>
                    <ul className="text-xs text-gray-300 space-y-1">
                      <li><strong>_fbp:</strong> Facebook Pixel (3 months)</li>
                      <li><strong>recommendation_profile:</strong> Event recommendations (6 months)</li>
                      <li><strong>campaign_ref:</strong> Marketing campaign tracking (30 days)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 4. Third-Party Cookies */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('third-party')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">4. Third-Party Cookies</h2>
              {expandedSection === 'third-party' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'third-party' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  We work with trusted third-party services that may set their own cookies. These partners help us provide our services:
                </p>

                <div className="space-y-3 mt-4">
                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Stripe</h4>
                    <p>Payment processing and fraud detection</p>
                    <p className="text-xs text-gray-500 mt-1">Privacy Policy: stripe.com/privacy</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Google Analytics</h4>
                    <p>Website analytics and user behavior insights</p>
                    <p className="text-xs text-gray-500 mt-1">Privacy Policy: policies.google.com/privacy</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">Facebook Pixel</h4>
                    <p>Advertising and remarketing (only with consent)</p>
                    <p className="text-xs text-gray-500 mt-1">Privacy Policy: facebook.com/privacy</p>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <h4 className="text-white font-semibold mb-2">SendGrid</h4>
                    <p>Transactional email delivery</p>
                    <p className="text-xs text-gray-500 mt-1">Privacy Policy: sendgrid.com/privacy</p>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* 5. Managing Cookies */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('managing')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">5. Managing Your Cookie Preferences</h2>
              {expandedSection === 'managing' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'managing' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <h3 className="text-white font-semibold">On Lurexo</h3>
                <p>
                  You can manage your cookie preferences using the toggle switches at the top of this page or in your account settings 
                  under "Privacy & Security" → "Cookie Preferences."
                </p>

                <h3 className="text-white font-semibold mt-4">In Your Browser</h3>
                <p>
                  Most browsers allow you to manage cookies through their settings. Here's how to access cookie settings in popular browsers:
                </p>

                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
                  <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
                  <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                  <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
                </ul>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mt-4">
                  <p className="text-yellow-300 text-sm">
                    <strong>Note:</strong> Disabling essential cookies will prevent you from using core features like account login 
                    and checkout. Disabling other cookies may impact your experience but won't prevent platform access.
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* 6. Do Not Track */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('dnt')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">6. Do Not Track Signals</h2>
              {expandedSection === 'dnt' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'dnt' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  Some browsers offer a "Do Not Track" (DNT) signal. Because there is no industry standard for how to respond to DNT signals, 
                  we do not currently respond to them. However, you can always manage your cookie preferences directly through our platform 
                  or your browser settings.
                </p>
              </div>
            )}
          </section>

          {/* 7. Updates to This Policy */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('updates')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">7. Updates to This Policy</h2>
              {expandedSection === 'updates' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'updates' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. 
                  We will notify you of significant changes and, where required by law, seek your consent for new cookie uses.
                </p>
                <p>
                  The "Last updated" date at the top of this policy indicates when it was most recently revised.
                </p>
              </div>
            )}
          </section>

          {/* 8. Contact Us */}
          <section className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800">
            <button
              onClick={() => toggleSection('contact')}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-800 transition-colors"
            >
              <h2 className="text-white font-semibold text-lg">8. Contact Us</h2>
              {expandedSection === 'contact' ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            {expandedSection === 'contact' && (
              <div className="px-6 pb-6 text-gray-300 text-sm space-y-4">
                <p>
                  If you have questions about our use of cookies, please contact:
                </p>
                
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mt-4">
                  <p className="font-semibold text-white mb-2">Lurexo Ltd</p>
                  <p>Email: privacy@lurexo.co.uk</p>
                  <p>Support: support@lurexo.co.uk</p>
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
            <Link href="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors">
              Privacy Policy
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