'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle, AlertCircle, RefreshCw, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function VerifyEmailPage() {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Optional: allow manual paste of token (useful in dev/local)
  const [manualToken, setManualToken] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const { verifyEmail, resendVerificationEmail } = useAuth();

  useEffect(() => {
    setMounted(true);

    // If token is present in URL, auto-verify
    if (token) {
      void handleVerification(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleVerification = async (verificationToken: string) => {
    const t = verificationToken?.trim();
    if (!t) {
      setError('Missing verification token.');
      return;
    }

    setVerifying(true);
    setError('');

    try {
      const result = await verifyEmail(t);

if (result.success) {
  setVerified(true);

  setTimeout(() => {
    router.replace(
      '/login?redirect=' + encodeURIComponent('/organizer/dashboard')
    );
  }, 2000);
      } else {
        setError(result.message || 'Verification failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    setResending(true);
    setError('');
    setResendSuccess(false);

    try {
      const result = await resendVerificationEmail();

      if (result.success) {
        setResendSuccess(true);
        // Hide success message after 5 seconds
        setTimeout(() => {
          setResendSuccess(false);
        }, 5000);
      } else {
        setError(result.message || 'Failed to resend email');
      }
    } catch (err) {
      setError('Failed to resend verification email');
    } finally {
      setResending(false);
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
        <div className="max-w-7xl mx-auto">
          <Link href="/">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tight">Lurexo</span>
            </div>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {verifying ? (
            /* Verifying State */
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <RefreshCw className="w-10 h-10 text-purple-400 animate-spin" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">Verifying your email...</h2>

              <p className="text-gray-400">Please wait while we verify your account</p>
            </div>
          ) : verified ? (
            /* Success State */
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                <CheckCircle className="w-10 h-10 text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-white mb-3">Email verified!</h2>

              <p className="text-gray-400 mb-8">
                Your account has been successfully verified. Redirecting you to your dashboard...
              </p>

              <Link href="/organizer/dashboard">
                <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </div>
          ) : (
            /* Pending Verification State */
            <>
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-10 h-10 text-purple-400" />
                </div>

                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">Verify your email</h1>

                <p className="text-gray-400">
                  {email ? (
                    <>
                      We&apos;ve sent a verification link to
                      <br />
                      <span className="text-white font-medium">{email}</span>
                    </>
                  ) : (
                    'Please check your email for a verification link'
                  )}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Success Alert */}
              {resendSuccess && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-green-400 text-sm">Verification email sent! Check your inbox.</p>
                </div>
              )}

              {/* Instructions */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <h3 className="text-white font-semibold mb-3">Next steps:</h3>
                <ol className="space-y-3 text-sm text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-semibold">1.</span>
                    <span>Open the email we sent you</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-semibold">2.</span>
                    <span>Click the verification link</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 font-semibold">3.</span>
                    <span>Start browsing events!</span>
                  </li>
                </ol>
              </div>

              {/* ✅ Dev-friendly manual token verify */}
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <KeyRound className="w-4 h-4 text-purple-400" />
                  <h3 className="text-white font-semibold">Verify manually (local/dev)</h3>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  If you’re testing locally and no email is sent, paste the verification token here.
                </p>

                <input
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  placeholder="Paste verification token"
                  className="w-full px-4 py-3 bg-black/40 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />

                <button
                  onClick={() => void handleVerification(manualToken)}
                  disabled={!manualToken.trim() || verifying}
                  className="mt-4 w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Verify with token
                </button>
              </div>

              {/* Resend Email Button */}
              <button
                onClick={handleResendEmail}
                disabled={resending}
                className="w-full py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Resend verification email
                  </>
                )}
              </button>

              {/* Help Section */}
              <div className="mt-8 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                <h4 className="text-yellow-400 font-semibold mb-2 text-sm">Can&apos;t find the email?</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• Check your spam or junk folder</li>
                  <li>• Add noreply@lurexo.co.uk to your contacts</li>
                  <li>• Make sure {email || 'your email'} is correct</li>
                </ul>
              </div>

              {/* Alternative Actions */}
              <div className="text-center space-y-3 mt-8">
                <p className="text-gray-400 text-sm">
                  Wrong email address?{' '}
                  <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-medium">
                    Sign up again
                  </Link>
                </p>
                <p className="text-gray-400 text-sm">
                  Already verified?{' '}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
