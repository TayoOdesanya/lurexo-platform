'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, User, Settings, LogOut, Ticket, Heart } from 'lucide-react';

// Mock user for header
const HEADER_USER = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Liliana'
};

export default function DesktopHeader() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleLogout = () => {
    // TODO: Implement logout
    alert('Logout functionality coming soon!');
  };

  return (
    <header className="hidden lg:block fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">L</span>
          </div>
          <span className="text-white font-bold text-2xl">Lurexo</span>
        </Link>

          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Browse Events Link */}
            <Link href="/events" className="text-gray-300 hover:text-white font-medium transition-colors">
          Browse Events
        </Link>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center gap-3 hover:bg-gray-800 px-3 py-2 rounded-lg transition-colors"
              >
                <img 
                  src={HEADER_USER.avatar}
                  alt={HEADER_USER.name}
                  className="w-8 h-8 rounded-full bg-white"
                />
                <span className="text-white font-medium">{HEADER_USER.name}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${
                  showProfileDropdown ? 'rotate-180' : ''
                }`} />
              </button>

              {/* Dropdown Menu */}
              {showProfileDropdown && (
                <>
                  {/* Backdrop */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  
                  {/* Dropdown Content */}
                  <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-xl shadow-xl overflow-hidden z-50">
                    {/* User Info */}
                    <div className="p-4 border-b border-gray-800 bg-gray-800/50">
                      <p className="text-white font-semibold">{HEADER_USER.name}</p>
                      <p className="text-gray-400 text-sm">{HEADER_USER.email}</p>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors">
                        <User className="w-5 h-5 text-purple-400" />
                        <span className="text-white text-sm">My Profile</span>
                      </Link>

                      <Link href="/tickets" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors">
                        <Ticket className="w-5 h-5 text-blue-400" />
                        <span className="text-white text-sm">My Tickets</span>
                      </Link>

                      <Link href="/profile/favorites" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors">
                        <Heart className="w-5 h-5 text-pink-400" />
                        <span className="text-white text-sm">Favorites</span>
                      </Link>

                      <Link href="/profile/edit" className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors">
                        <Settings className="w-5 h-5 text-gray-400" />
                        <span className="text-white text-sm">Settings</span>
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-gray-800 py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-800 transition-colors"
                      >
                        <LogOut className="w-5 h-5 text-red-400" />
                        <span className="text-red-400 text-sm">Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}