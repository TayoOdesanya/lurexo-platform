'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WifiOff, RefreshCw, Ticket, Clock, CheckCircle } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [cachedTicketsCount, setCachedTicketsCount] = useState(0);

  useEffect(() => {
    // Check if we're back online
    const handleOnline = () => {
      setIsOnline(true);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial status
    setIsOnline(navigator.onLine);

    // Check for cached tickets
    try {
      const cached = localStorage.getItem('lurexo_tickets_cache');
      if (cached) {
        const tickets = JSON.parse(cached);
        setCachedTicketsCount(tickets.length || 0);
      }
    } catch (err) {
      console.error('Error reading cache:', err);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      if (navigator.onLine) {
        window.location.reload();
      } else {
        setIsRetrying(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6 bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">Lurexo</span>
            
            {/* Connection Status */}
            <div className="flex-1 flex justify-end">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                isOnline ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`} />
                <span className={`text-xs font-medium ${
                  isOnline ? 'text-green-400' : 'text-red-400'
                }`}>
                  {isOnline ? 'Back Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-md w-full text-center">
          {/* Icon */}
          <div className="mb-8 relative inline-block">
            <div className="w-32 h-32 bg-gray-900 rounded-full flex items-center justify-center mx-auto border-4 border-gray-800">
              <WifiOff className="w-16 h-16 text-gray-600" />
            </div>
            {isOnline && (
              <div className="absolute top-0 right-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          {/* Message */}
          {isOnline ? (
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                You're back online!
              </h1>
              <p className="text-gray-400">
                Reconnecting to Lurexo...
              </p>
              <div className="mt-4">
                <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  You're offline
                </h1>
                <p className="text-gray-400">
                  Check your internet connection and try again
                </p>
              </div>

              {/* Offline Features */}
              <div className="mb-8 p-4 bg-gray-900 border border-gray-800 rounded-xl text-left">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  Available Offline
                </h3>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {cachedTicketsCount > 0 ? (
                    <>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>View your {cachedTicketsCount} cached ticket{cachedTicketsCount !== 1 ? 's' : ''}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                        <span>Access QR codes for entry</span>
                      </li>
                    </>
                  ) : (
                    <li className="flex items-start gap-2">
                      <WifiOff className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                      <span>No cached tickets available</span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <WifiOff className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                    <span>Browse and purchase new tickets (requires connection)</span>
                  </li>
                </ul>
              </div>

              {/* Action Button */}
              <div className="space-y-3">
                <button
                  onClick={handleRetry}
                  disabled={isRetrying}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin' : ''}`} />
                  {isRetrying ? 'Checking connection...' : 'Try Again'}
                </button>

                {cachedTicketsCount > 0 && (
                  <Link href="/tickets">
                    <button className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all">
                      <Ticket className="w-5 h-5" />
                      View Cached Tickets
                    </button>
                  </Link>
                )}
              </div>
            </>
          )}

          {/* Help Text */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              {!isOnline && (
                <>
                  Connection issues?{' '}
                  <a href="#" className="text-purple-400 hover:text-purple-300">
                    Troubleshoot
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      </main>

      {/* Connection Tips (when offline) */}
      {!isOnline && (
        <div className="p-4 sm:p-6 bg-gray-900 border-t border-gray-800">
          <div className="max-w-md mx-auto">
            <h4 className="text-white text-sm font-semibold mb-3">Quick fixes:</h4>
            <ul className="text-gray-400 text-xs space-y-2">
              <li>• Check if Wi-Fi or mobile data is turned on</li>
              <li>• Try turning Airplane mode on and off</li>
              <li>• Make sure you're not in a low-signal area</li>
              <li>• Restart your device if the issue persists</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}