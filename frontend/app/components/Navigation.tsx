'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export default function Navigation() {
  const { user, logout } = useAuth();
  const { isDarkMode, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoggedIn = !!user;
  const isOrganizer =
    (user?.role || '').toUpperCase() === 'ORGANIZER' ||
    (user?.role || '').toUpperCase() === 'ADMIN';

  const bgSecondary = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`${bgSecondary} border-b ${border} sticky top-0 z-50 backdrop-blur-lg bg-opacity-95`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">L</span>
            </div>
            <span className={`${text} font-bold text-2xl tracking-tight`}>Lurexo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/events" className={`${textSecondary} hover:${text} transition-colors`}>
              Events
            </Link>
            <Link
              href={isOrganizer ? "/organizer/dashboard" : "/dashboard"}
              className={`${textSecondary} hover:${text} transition-colors`}
            >
              Dashboard
            </Link>
            <Link href="/how-it-works" className={`${textSecondary} hover:${text} transition-colors`}>
              How it Works
            </Link>
            {isLoggedIn && (
              <Link href="/admin/dashboard" className={`${textSecondary} hover:${text} transition-colors`}>
                Admin
              </Link>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
              className={`p-2.5 rounded-full ${isDarkMode ? 'bg-white/10 border border-white/20' : 'bg-gray-100 border border-gray-200'} backdrop-blur-sm hover:scale-105 transition-transform`}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            {!isLoggedIn ? (
              <>
                <Link href="/login" className={`hidden md:block ${textSecondary} hover:${text} transition-colors`}>
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="hidden md:block bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-transform"
                >
                  Get started
                </Link>
              </>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className={`px-6 py-2.5 rounded-full font-semibold border ${isDarkMode ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-100'} transition-colors`}
                >
                  Logout
                </button>
                <span className={`${textSecondary} text-sm`}>
                  {user?.name || user?.email}
                </span>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className={text} /> : <Menu className={text} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link href="/events" className={`block ${text} hover:text-purple-400`} onClick={() => setMobileMenuOpen(false)}>
              Events
            </Link>
            <Link
              href={isOrganizer ? "/organizer/dashboard" : "/dashboard"}
              className={`block ${text} hover:text-purple-400`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link href="/how-it-works" className={`block ${text} hover:text-purple-400`} onClick={() => setMobileMenuOpen(false)}>
              How it Works
            </Link>
            {isLoggedIn && (
              <Link
                href="/admin/dashboard"
                className={`block ${text} hover:text-purple-400`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {!isLoggedIn ? (
              <>
                <Link href="/login" className={`block w-full text-left ${text}`} onClick={() => setMobileMenuOpen(false)}>
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="block w-full text-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get started
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className={`w-full px-6 py-2.5 rounded-full font-semibold border ${isDarkMode ? 'border-white/20 text-white hover:bg-white/10' : 'border-gray-300 text-gray-900 hover:bg-gray-100'} transition-colors`}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
