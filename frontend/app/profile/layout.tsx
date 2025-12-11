'use client';

import { usePathname } from 'next/navigation';
import DesktopHeader from '@/components/DesktopHeader';
import ProfileSidebar from '@/components/ProfileSidebar';

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  
  // Show sidebar on all profile subpages, but not on main /profile page
  const showSidebar = pathname !== '/profile';

  return (
    <>
      {/* Desktop Header - Only visible on desktop */}
      <DesktopHeader />

      <div className="flex">
        {/* Desktop Sidebar - Only show on profile subpages */}
        {showSidebar && <ProfileSidebar />}

        {/* Main Content Area */}
        <main className={`flex-1 min-h-screen ${
          showSidebar ? 'lg:ml-72 lg:pt-16' : 'lg:pt-16'
        }`}>
          {children}
        </main>
      </div>
    </>
  );
}