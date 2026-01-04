'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function EventsPage() {
    const router = useRouter();

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        fetch('http://localhost:3001/api/events')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then(data => {
                setEvents(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error:', err);
                setError(err.message);
                setLoading(false);
            });
    }, []);

    const categories = ['all', 'music', 'comedy', 'sports', 'theatre', 'food', 'art', 'conference', 'workshop'];

    const filteredEvents = events.filter((event: any) => {
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        const matchesSearch =
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Prevent hydration mismatch by not rendering theme-dependent content until mounted
    if (!mounted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    // Theme classes
    const bgPrimary = isDarkMode ? 'bg-black' : 'bg-gray-50';
    const bgSecondary = isDarkMode ? 'bg-gray-900' : 'bg-white';
    const bgGradient = isDarkMode
        ? 'bg-gradient-to-br from-purple-900 via-blue-900 to-black'
        : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700';
    const textPrimary = isDarkMode ? 'text-white' : 'text-gray-900';
    const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const textTertiary = isDarkMode ? 'text-gray-500' : 'text-gray-500';
    const borderColor = isDarkMode ? 'border-gray-800' : 'border-gray-200';
    const cardBg = isDarkMode ? 'from-gray-900 to-gray-800' : 'from-white to-gray-50';
    const cardBorder = isDarkMode ? 'border-gray-800 hover:border-purple-500/50' : 'border-gray-200 hover:border-purple-500/50';
    const pillActiveBg = isDarkMode ? 'bg-white text-black' : 'bg-gray-900 text-white';
    const pillInactiveBg = isDarkMode ? 'bg-gray-900 text-gray-300 hover:bg-gray-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200';

    return (
        <div className={`min-h-screen ${bgPrimary}`}>
            {/* Hero Header */}
            <header className={`relative overflow-hidden ${bgGradient}`}>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>

                <nav className="relative z-10 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">L</span>
                        </div>
                        <span className="text-white font-bold text-2xl tracking-tight">Lurexo</span>
                    </div>

                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-gray-200 hover:text-white transition-colors">Events</a>
                        <a href="#" className="text-gray-200 hover:text-white transition-colors">How it works</a>
                        <a href="#" className="text-gray-200 hover:text-white transition-colors">Support</a>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all"
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                </svg>
                            )}
                        </button>

                        <button className="text-white hover:text-gray-300 transition-colors">Sign in</button>
                        <button className="bg-white text-black px-6 py-2.5 rounded-full font-semibold hover:bg-gray-100 transition-all hover:scale-105">
                            Get started
                        </button>
                    </div>
                </nav>

                <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 pb-32">
                    <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
                        The smarter way<br />to experience events
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mb-8">
                        Fair prices. No bots. Transparent fees. Get closer to the events you love.
                    </p>

                    <div className="max-w-2xl">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search events, artists, venues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-4 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                            />
                            <svg className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </header>

            <div className={`${bgSecondary} border-b ${borderColor} sticky top-0 z-20`}>
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center space-x-3 overflow-x-auto scrollbar-hide">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2.5 rounded-full font-medium transition-all whitespace-nowrap ${selectedCategory === category ? pillActiveBg : pillInactiveBg
                                    }`}
                            >
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${isDarkMode ? 'border-purple-500' : 'border-purple-600'}`}></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
                        <p className="text-red-400 font-semibold mb-2">Connection Error</p>
                        <p className={textSecondary}>Make sure the backend is running on http://localhost:3001/api</p>
                    </div>
                ) : filteredEvents.length === 0 ? (
                    <div className="text-center py-20">
                        <p className={`text-2xl ${textSecondary} mb-2`}>No events found</p>
                        <p className={textTertiary}>Try adjusting your filters or search term</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className={`text-3xl font-bold ${textPrimary}`}>
                                {selectedCategory === 'all' ? 'All Events' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Events`}
                            </h2>
                            <p className={textSecondary}>{filteredEvents.length} events</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredEvents.map((event: any) => {
                                const totalPrice = Number(event.ticketPrice) + Number(event.serviceFee || 0);
                                const percentSold = (event.ticketsSold / event.capacity) * 100;
                                const isAlmostSoldOut = percentSold > 80;

                                // ✅ Image fix: use heroImage or first gallery image
                                const imageSrc =
                                    event.heroImage ||
                                    event.imageUrl ||
                                    (event.galleryImages?.length ? event.galleryImages[0] : null);

                                const normalizedImageSrc =
                                    imageSrc && typeof imageSrc === 'string'
                                        ? (imageSrc.startsWith('/') ? imageSrc : `/${imageSrc}`)
                                        : null;

                                const onCardClick = () => router.push(`/events/${event.id}`);
                                const onCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        onCardClick();
                                    }
                                };

                                return (
                                    <div
                                        key={event.id}
                                        role="link"
                                        tabIndex={0}
                                        onClick={onCardClick}
                                        onKeyDown={onCardKeyDown}
                                        className="block h-full"
                                    >
                                        <div className={`h-full group relative bg-gradient-to-br ${cardBg} rounded-2xl overflow-hidden border ${cardBorder} transition-all duration-300 hover:scale-[1.02] cursor-pointer flex flex-col`}>
                                            <div className={`relative h-56 overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-purple-900/20 to-blue-900/20' : 'bg-gradient-to-br from-purple-100 to-blue-100'}`}>
                                                {normalizedImageSrc && (
                                                    <img
                                                        src={normalizedImageSrc}
                                                        alt={event.title}
                                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                                    />
                                                )}
                                                <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent' : 'bg-gradient-to-t from-white via-white/40 to-transparent'}`}></div>

                                                {event.category && (
                                                    <div className="absolute top-4 left-4">
                                                        <span className={`px-3 py-1 ${isDarkMode ? 'bg-black/60' : 'bg-white/90'} backdrop-blur-sm ${isDarkMode ? 'text-white' : 'text-gray-900'} text-xs font-semibold rounded-full border ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                                            {event.category.toUpperCase()}
                                                        </span>
                                                    </div>
                                                )}

                                                {isAlmostSoldOut && (
                                                    <div className="absolute top-4 right-4">
                                                        <span className="px-3 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full animate-pulse">
                                                            🔥 Selling Fast
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className={`text-xl font-bold ${textPrimary} mb-3 group-hover:text-purple-500 transition-colors line-clamp-2`}>
                                                    {event.title}
                                                </h3>

                                                <div className="space-y-2 mb-6">
                                                    {/* Organizer Info - now safe (no nested <a> inside <a>) */}
                                                    {event.organizer && (
                                                        <Link
                                                            href={`/organizers/${event.organizer.username}`}
                                                            onClick={(e) => e.stopPropagation()}
                                                            className="flex items-center gap-2 mb-3 group/organizer"
                                                        >
                                                            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                                                                {event.organizer.avatar ? (
                                                                    <img
                                                                        src={event.organizer.avatar}
                                                                        alt={event.organizer.name}
                                                                        className="w-full h-full object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
                                                                        <span className="text-white text-xs font-bold">
                                                                            {event.organizer.name.charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <span className={`text-xs ${textSecondary} group-hover/organizer:text-purple-400 transition-colors truncate`}>
                                                                by {event.organizer.name}
                                                            </span>
                                                            {event.organizer.verified && (
                                                                <svg className="w-3 h-3 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </Link>
                                                    )}

                                                    <div className={`flex items-center ${textSecondary} text-sm`}>
                                                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="truncate">{event.location}</span>
                                                    </div>

                                                    <div className={`flex items-center ${textSecondary} text-sm`}>
                                                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        <span>
                                                            {new Date(event.eventDate).toLocaleDateString('en-GB', {
                                                                weekday: 'short',
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={`mt-auto pt-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <p className={`text-sm ${textTertiary} mb-1`}>From</p>
                                                            <p className={`text-2xl font-bold ${textPrimary}`}>
                                                                £{totalPrice.toFixed(2)}
                                                            </p>
                                                            <p className={`text-xs ${textTertiary} mt-1`}>inc. fees</p>
                                                        </div>

                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                router.push(`/events/${event.id}`);
                                                            }}
                                                            className={`px-6 py-2.5 ${isDarkMode ? 'bg-white text-black hover:bg-gray-100' : 'bg-gray-900 text-white hover:bg-gray-800'} rounded-full font-semibold transition-all hover:scale-105`}
                                                        >
                                                            Get tickets
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-purple-900/0 to-purple-900/0 group-hover:from-purple-900/10 group-hover:to-blue-900/10' : 'bg-gradient-to-t from-purple-50/0 to-blue-50/0 group-hover:from-purple-50/50 group-hover:to-blue-50/50'} transition-all duration-300 pointer-events-none`}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>

            {/* Footer */}
            <Footer />
        </div>
    );
}
