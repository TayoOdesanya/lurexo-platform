'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QrCode, Calendar, MapPin, Users, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ScannerSelectionPage() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch organizer's events
    const fetchEvents = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        const response = await fetch('/api/organizer/events', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter to only show events happening today or in the future
          const upcomingEvents = data.events.filter((event: any) => {
            const eventDate = new Date(event.date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return eventDate >= today;
          });
          setEvents(upcomingEvents);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <QrCode className="w-8 h-8 text-purple-400" />
            <h1 className="text-3xl font-bold">QR Scanner</h1>
          </div>
          <p className="text-gray-400">Select an event to start scanning tickets</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <QrCode className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Upcoming Events</h3>
            <p className="text-gray-400 mb-6">
              You don't have any upcoming events to scan tickets for.
            </p>
            <Link
              href="/organizer/events/create"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
            >
              Create Event
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <button
                key={event.id}
                onClick={() => router.push(`/scanner/${event.id}`)}
                className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-6 transition-all hover:scale-[1.02] text-left group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-purple-400 transition-colors">
                      {event.name}
                    </h3>

                    <div className="space-y-2 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(event.date).toLocaleDateString('en-GB', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.venue}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>
                          {event.totalTickets} tickets • {event.soldTickets || 0} sold
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-400">
                        {event.checkedInCount || 0}
                      </div>
                      <div className="text-xs text-gray-400">Checked In</div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-blue-400" />
            How It Works
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">1.</span>
              <span>Select the event you're scanning for</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">2.</span>
              <span>Scanner will download ticket data for offline use</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">3.</span>
              <span>Scan QR codes or use manual entry</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-400 mt-0.5">4.</span>
              <span>Works offline - syncs automatically when connection returns</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}