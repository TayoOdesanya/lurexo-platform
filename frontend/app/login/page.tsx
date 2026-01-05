'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Check,
  ArrowLeft,
  Ticket,
  Zap,
  TrendingUp,
  Users,
  Shield
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function OrganizerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo =
    searchParams.get('redirect') || '/organizer/dashboard';

  const { login, user } = useAuth();

  useEffect(() => {
    setMounted(true);

    // If already logged in, go to redirect target
    if (user) {
      router.replace(redirectTo);
      return;
    }

    // Auto-focus email on desktop only (prevents keyboard popup on mobile)
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setTimeout(() => {
        document.getElementById('email')?.focus();
      }, 100);
    }

    // Check for remembered email
    const remembered = localStorage.getItem('rememberedOrganizerEmail');
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, [user, router, redirectTo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Haptic feedback on mobile
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }

    try {
      const result = await login(email, password);

      if (!result.success) {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
        setError(result.message || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('rememberedOrganizerEmail', email);
      } else {
        localStorage.removeItem('rememberedOrganizerEmail');
      }

      // Success haptic
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([10, 50, 10]);
      }

      // ✅ Optional guard: if user logs in but isn't verified, push to verify-email
      // (Adjust based on whether your backend blocks login until verified)
      const userDataRaw = localStorage.getItem('userData');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : null;

      if (userData && userData.emailVerified === false) {
        router.replace('/verify-email?email=' + encodeURIComponent(email));
        return;
      }

      // ✅ Redirect to requested destination
      router.replace(redirectTo);
    } catch (err) {
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      setError('Login failed. Please try again.');
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
    <div className="min-h-screen bg-black flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-between">
            <Link href="/for-organizers" className="flex items-center space-x-2">
              <button className="p-3 -ml-3 rounded-lg hover:bg-gray-900 transition-colors lg:hidden">
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-white font-bold text-xl tracking-tight block">Lurexo</span>
                  <span className="text-purple-400 text-xs font-medium">Organizer Portal</span>
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-gray-400 text-xs sm:text-sm hidden xs:inline">New organizer?</span>
              <Link href="/contact">
                <button className="px-3 sm:px-4 py-2 text-white hover:text-purple-400 transition-colors font-medium text-sm sm:text-base">
                  Contact Sales
                </button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
          <div className="w-full max-w-md">
            {/* Title */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Sign in to manage your events and grow your business
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="email"
                    inputMode="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="organizer@example.com"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoCapitalize="none"
                    autoCorrect="off"
                    autoComplete="current-password"
                    className="w-full pl-12 pr-14 py-3.5 bg-gray-900 border border-gray-800 rounded-xl text-white text-base placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-gray-300 transition-colors rounded-lg hover:bg-gray-800"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between gap-4">
                <label className="flex items-center cursor-pointer group py-2 -ml-2 pr-2">
                  <div className="relative p-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 ${
                        rememberMe
                          ? 'bg-purple-500 border-purple-500'
                          : 'bg-transparent border-gray-600 group-hover:border-gray-500'
                      } transition-colors flex items-center justify-center`}
                    >
                      {rememberMe && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </div>
                  <span className="ml-1 text-sm text-gray-300 group-hover:text-white transition-colors">
                    Remember me
                  </span>
                </label>

                <Link
                  href="/reset-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors py-2 px-2 -mr-2"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Sign in to Dashboard'
                )}
              </button>
            </form>

            {/* Trust Signals */}
            <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-gray-800">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-gray-500 text-xs">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secure login</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>PCI DSS compliant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Right Side - Features (Desktop Only) */}
      <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-purple-600 to-blue-600 p-12 flex-col justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-4">Organizer Dashboard</h2>
          <p className="text-white/90 text-lg mb-12">
            Everything you need to create, manage, and grow successful events.
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Quick Setup</h3>
                <p className="text-white/80 text-sm">
                  Create and publish events in minutes with our intuitive dashboard
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Real-Time Analytics</h3>
                <p className="text-white/80 text-sm">
                  Track sales, revenue, and audience insights as they happen
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">Grow Your Audience</h3>
                <p className="text-white/80 text-sm">
                  Build lasting relationships with fans through data-driven insights
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg mb-1">AI Bot Prevention</h3>
                <p className="text-white/80 text-sm">
                  Protect your events from scalpers with industry-leading security
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">💬</span>
            </div>
            <div>
              <p className="text-white font-semibold">Need help?</p>
              <p className="text-white/70 text-sm">We're here 24/7</p>
            </div>
          </div>
          <p className="text-white/90 text-sm mb-4">
            "Lurexo made it incredibly easy to set up our first event. The dashboard is intuitive and support is amazing!"
          </p>
          <p className="text-white/70 text-xs">— Sarah M., Event Organizer</p>
        </div>
      </div>

      {/* Add shake animation for errors */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-4px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}
