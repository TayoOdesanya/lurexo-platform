'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();
  const { resetPassword } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await resetPassword(email);
      
      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message || 'Failed to send reset email');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <header className="p-6 lg:p-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/login" className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-900 transition-colors">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <span className="text-white font-medium">Back to login</span>
          </Link>
          
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tight hidden lg:inline">Lurexo</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {!success ? (
            <>
              {/* Title */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                  Reset your password
                </h1>
                <p className="text-gray-400">
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Reset Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                      placeholder="you@example.com"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    We'll send a password reset link to this email address
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </span>
                  ) : (
                    'Send reset link'
                  )}
                </button>

                {/* Alternative Actions */}
                <div className="text-center space-y-3 pt-4">
                  <p className="text-gray-400 text-sm">
                    Remember your password?{' '}
                    <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                      Sign in
                    </Link>
                  </p>
                  <p className="text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
            </>
          ) : (
            /* Success State */
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-3">
                Check your email
              </h2>
              
              <p className="text-gray-400 mb-8">
                We've sent a password reset link to<br />
                <span className="text-white font-medium">{email}</span>
              </p>

              <div className="space-y-4">
                <Link href="/login">
                  <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                    Return to login
                  </button>
                </Link>

                <button
                  onClick={() => {
                    setSuccess(false);
                    setEmail('');
                  }}
                  className="w-full py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-medium hover:bg-gray-800 transition-colors"
                >
                  Try a different email
                </button>
              </div>

              <div className="mt-8 p-4 bg-gray-900 border border-gray-800 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">
                  Didn't receive the email?
                </p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Check your spam folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}