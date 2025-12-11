// app/error.tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle, Mail, MessageCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tight hidden sm:inline">Lurexo</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-lg w-full text-center">
          {/* Error Icon */}
          <div className="mb-8 relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-full flex items-center justify-center mx-auto animate-pulse-slow">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 border-4 border-red-500/20 rounded-full animate-ping-slow"></div>
            </div>
          </div>

          {/* Error Code */}
          <div className="mb-6">
            <h1 className="text-6xl sm:text-7xl font-bold text-white mb-2">500</h1>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Something went wrong
            </h2>
            <p className="text-gray-400 text-base sm:text-lg">
              We're experiencing technical difficulties. Our team has been notified and is working on it.
            </p>
          </div>

          {/* What Happened */}
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
            <h3 className="text-red-400 font-semibold text-sm mb-2">What happened?</h3>
            <ul className="text-gray-400 text-sm space-y-1">
              <li>• Our servers encountered an unexpected error</li>
              <li>• Your data is safe and secure</li>
              <li>• We're working to fix this as quickly as possible</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>

            <Link href="/">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all">
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>
            </Link>
          </div>

          {/* Support Options */}
          <div className="pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4">Need immediate help?</p>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/contact">
                <button className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all">
                  <Mail className="w-4 h-4" />
                  Email Support
                </button>
              </Link>
              
              <Link href="/help">
                <button className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 text-white py-3 rounded-lg text-sm font-medium hover:bg-gray-800 transition-all">
                  <MessageCircle className="w-4 h-4" />
                  Help Center
                </button>
              </Link>
            </div>
          </div>

          {/* Error ID */}
          {error.digest && (
            <div className="mt-8">
              <p className="text-gray-600 text-xs">
                Error ID: {error.digest}
              </p>
              <p className="text-gray-700 text-xs mt-1">
                Reference this ID when contacting support
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Animations */}
      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping-slow {
          animation: ping-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}