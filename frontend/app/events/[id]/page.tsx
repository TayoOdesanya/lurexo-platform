'use client';

import EventDetailContent from '@/components/EventDetailContent';
import Footer from '@/components/Footer';
import Navigation from '@/components/Navigation';

export default function EventDetailPage() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <EventDetailContent />
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}
