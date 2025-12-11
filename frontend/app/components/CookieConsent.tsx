'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

export default function CookieConsent() {
  const { isDarkMode } = useTheme();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 1000);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      essential: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  const acceptEssential = () => {
    localStorage.setItem('cookie_consent', JSON.stringify({
      essential: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString()
    }));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 ${
      isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
    } border-t backdrop-blur-lg bg-opacity-95 p-4 sm:p-6 shadow-2xl`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className={`flex-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <p className="text-sm sm:text-base">
              We use cookies to improve your experience on Lurexo. By continuing, you accept our use of cookies.{' '}
              <Link 
                href="/cookies" 
                className="text-purple-500 hover:text-purple-400 underline font-semibold"
              >
                Learn more
              </Link>
            </p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              onClick={acceptEssential}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-semibold transition-colors ${
                isDarkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
              }`}
            >
              Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}