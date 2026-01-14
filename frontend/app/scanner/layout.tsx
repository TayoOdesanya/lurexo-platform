'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Menu, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Minimal Header - Only on non-scanning pages */}
      <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left Side - Back/Menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Center - Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
            <span className="text-white font-bold text-lg">Scanner</span>
          </div>

          {/* Right Side - Empty for balance */}
          <div className="w-10"></div>
        </div>
      </header>

      {/* Slide-out Menu */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Menu Panel */}
          <div className="fixed left-0 top-0 bottom-0 w-64 bg-gray-900 z-50 border-r border-white/10 animate-in slide-in-from-left duration-300">
            {/* Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-bold">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="p-4 space-y-2">
              <Link href="/scanner">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <span>Select Event</span>
                </button>
              </Link>

              <Link href="/scanner/history">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <span>Scan History</span>
                </button>
              </Link>

              <div className="border-t border-white/10 my-4"></div>

              <Link href="/organizer/dashboard">
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <span>Back to Dashboard</span>
                </button>
              </Link>

              <button
                onClick={() => {
                  // Handle logout
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-left"
              >
                <span>Sign Out</span>
              </button>
            </nav>

            {/* User Info at Bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">AM</span>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">Alex Morgan</p>
                  <p className="text-gray-400 text-xs">Scanner Mode</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content - Full Screen */}
      <main className="h-[calc(100vh-57px)]">
        {children}
      </main>
    </div>
  );
}