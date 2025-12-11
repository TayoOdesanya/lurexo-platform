// app/not-found.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Search, ArrowLeft, Compass, Sparkles } from 'lucide-react';

// Mock popular events for suggestions
const POPULAR_EVENTS = [
  {
    id: 'event-1',
    title: 'Summer Music Festival 2025',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    price: 85.00
  },
  {
    id: 'event-2',
    title: 'Comedy Night Live',
    category: 'Comedy',
    imageUrl: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=400',
    price: 45.00
  },
  {
    id: 'event-3',
    title: 'Jazz Evening',
    category: 'Music',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400',
    price: 60.00
  }
];

export default function NotFound() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

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
          
          <Link href="/">
            <button className="flex items-center gap-2 px-4 py-2 text-white hover:text-purple-400 transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Home</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* 404 Animation */}
          <div className="mb-8 relative">
            <div className="text-9xl sm:text-[12rem] font-bold bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 bg-clip-text text-transparent animate-gradient">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Compass className="w-20 h-20 sm:w-24 sm:h-24 text-purple-500/20 animate-spin-slow" />
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Oops! Page not found
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved. Let's get you back on track!
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for events..."
                className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              />
            </div>
          </form>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 max-w-md mx-auto">
            <Link href="/">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                <Home className="w-5 h-5" />
                Go to Homepage
              </button>
            </Link>
            
            <Link href="/search">
              <button className="w-full flex items-center justify-center gap-2 bg-gray-900 border border-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all">
                <Search className="w-5 h-5" />
                Browse Events
              </button>
            </Link>
          </div>

          {/* Popular Events */}
          <div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Popular Right Now</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {POPULAR_EVENTS.map((event) => (
                <Link key={event.id} href={`/events/${event.id}`}>
                  <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all group">
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                        <span className="text-white text-xs font-semibold">£{event.price}</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-white font-medium text-sm line-clamp-1 mb-1">
                        {event.title}
                      </p>
                      <p className="text-purple-400 text-xs">{event.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              Still can't find what you're looking for?{' '}
              <Link href="/contact" className="text-purple-400 hover:text-purple-300">
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Gradient Animation */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}