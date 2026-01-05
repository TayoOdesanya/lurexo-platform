'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  AlertCircle,
  Check,
  ArrowLeft,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type SignupResult = {
  success: boolean;
  message?: string;
  verificationToken?: string; // ✅ dev-only from backend (if you return it in AuthContext)
};

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const router = useRouter();
  const { signup, user } = useAuth();

  useEffect(() => {
    setMounted(true);
    // If already logged in, redirect
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;

    setPasswordStrength(strength);
  }, [password]);

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return 'bg-gray-600';
      case 1:
        return 'bg-red-500';
      case 2:
        return 'bg-orange-500';
      case 3:
        return 'bg-yellow-500';
      case 4:
        return 'bg-green-500';
      default:
        return 'bg-gray-600';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return '';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const validateForm = () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }

    if (!agreedToTerms) {
      setError('Please agree to the terms and conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // ✅ Expect AuthContext.signup to optionally return verificationToken in dev
      const result = (await signup(email, password, name)) as SignupResult;

      if (result.success) {
        if (marketingOptIn) {
          localStorage.setItem('marketingOptIn', 'true');
        }

        const qs = new URLSearchParams();
        qs.set('email', email);

        // ✅ If present (dev mode), pass token to verify-email page
        if (result.verificationToken) {
          qs.set('token', result.verificationToken);
        }

        router.push('/verify-email?' + qs.toString());
      } else {
        setError(result.message || 'Failed to create account');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Social signup handlers (mock)
  const handleSocialSignup = (provider: string) => {
    console.log(`Signup with ${provider}`);
    // In production, implement OAuth flow
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
          <Link href="/" className="flex items-center space-x-2">
            <button className="p-2 rounded-lg hover:bg-gray-900 transition-colors lg:hidden">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">L</span>
              </div>
              <span className="text-white font-bold text-2xl tracking-tight hidden lg:inline">
                Lurexo
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">Already have an account?</span>
            <Link href="/login">
              <button className="px-4 py-2 text-white hover:text-purple-400 transition-colors font-medium">
                Sign in
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">
              Create your account
            </h1>
            <p className="text-gray-400">Join Lurexo for fair, transparent ticketing</p>
          </div>

          {/* Benefits Banner */}
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">Why join Lurexo?</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>No hidden fees - the price you see is what you pay</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Bot-free purchasing - real tickets for real fans</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Free transfers & capped resale at 110%</span>
              </li>
            </ul>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Full name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-700'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Password strength:{' '}
                    <span
                      className={`font-medium ${
                        passwordStrength >= 3 ? 'text-green-400' : 'text-orange-400'
                      }`}
                    >
                      {getPasswordStrengthText()}
                    </span>
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  placeholder="Re-enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
              )}
            </div>

            {/* Terms and Marketing */}
            <div className="space-y-3">
              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`mt-0.5 w-5 h-5 rounded border-2 ${
                    agreedToTerms
                      ? 'bg-purple-500 border-purple-500'
                      : 'bg-transparent border-gray-600'
                  } transition-colors flex items-center justify-center flex-shrink-0`}
                >
                  {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="ml-2 text-sm text-gray-300">
                  I agree to the{' '}
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                    Terms & Conditions
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketingOptIn}
                  onChange={(e) => setMarketingOptIn(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`mt-0.5 w-5 h-5 rounded border-2 ${
                    marketingOptIn
                      ? 'bg-purple-500 border-purple-500'
                      : 'bg-transparent border-gray-600'
                  } transition-colors flex items-center justify-center flex-shrink-0`}
                >
                  {marketingOptIn && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="ml-2 text-sm text-gray-300">
                  Send me updates about events and special offers
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </span>
              ) : (
                'Create account'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-black text-gray-500">Or sign up with</span>
              </div>
            </div>

            {/* Social Signup Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSocialSignup('google')}
                className="flex items-center justify-center gap-2 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-sm font-medium">Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialSignup('apple')}
                className="flex items-center justify-center gap-2 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.41-1.09-.49-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.42C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74.8 0 2.3-.88 3.89-.77.66.02 2.51.27 3.7 2.03-2.4 1.45-2.01 4.64.78 5.52-.39 1.03-.88 2.03-1.78 3.08-.72.84-1.47 1.68-2.64 1.7-1.03.02-1.3-.66-2.7-.66s-1.74.64-2.83.68c-1.14.05-2.01-.9-2.73-1.73-1.48-1.7-2.64-4.8-1.1-6.89.76-1.03 2.13-1.69 3.61-1.7 1.13-.02 2.2.77 2.88.77.69 0 1.97-.95 3.31-.81.56.03 2.14.23 3.16 1.71-.08.05-1.88 1.1-1.86 3.27.03 2.59 2.28 3.45 2.31 3.46z" />
                  <path d="M13.03 3.3c.53-.64 1.36-1.77 1.17-2.8-1.31.06-2.78.91-3.61 1.89-.73.86-1.35 1.91-1.11 3-.56.04.44-.02 1.44-.02.87-.01 1.61-.53 2.11-1.07z" />
                </svg>
                <span className="text-sm font-medium">Apple</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
