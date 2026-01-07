'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Plus,
  Calendar,
  BarChart3,
  Users,
  CreditCard,
  Settings,
  Bell,
  Menu,
  X,
  Ticket,
  Home,
  HelpCircle,
  LogOut,
  ChevronLeft,
  UserPlus,
  Mail,
} from 'lucide-react';

import { useAuth } from '@/context/AuthContext';

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { user, loading, logout, checkAuth } = useAuth();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Ensure auth state is loaded (safe no-op if already loaded)
  useEffect(() => {
    checkAuth().catch(() => void 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Protect organizer routes
  useEffect(() => {
    if (loading) return;

    if (!user) {
      const redirect = encodeURIComponent(pathname || '/organizer/dashboard');
      router.push(`/organizer/login?redirect=${redirect}`);
      return;
    }

    // Keep this light for now; you said role-based redirect is later.
    // But do block obvious non-organizer users if role exists.
    const role = (user.role || '').toUpperCase();
    if (role && role !== 'ORGANIZER' && role !== 'ADMIN') {
      router.push('/');
    }
  }, [loading, user, router, pathname]);

  const navItems = useMemo(
    () => [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/organizer/dashboard' },
      { icon: Plus, label: 'Create Event', href: '/organizer/create-event' },
      { icon: Calendar, label: 'Manage Events', href: '/organizer/manage-events' },
      { icon: BarChart3, label: 'Analytics', href: '/organizer/analytics' },
      { icon: Users, label: 'Audience', href: '/organizer/audience' },
      { icon: UserPlus, label: 'Collaborators', href: '/organizer/collaborators' },
      { icon: Mail, label: 'Marketing', href: '/organizer/marketing' },
      { icon: CreditCard, label: 'Payouts', href: '/organizer/payouts' },
      { icon: Settings, label: 'Settings', href: '/organizer/settings' },
    ],
    [],
  );

  const organizerName = user?.name || user?.email?.split('@')?.[0] || 'Organizer';
  const organizerId = user?.id || '';
  const initials =
    (organizerName || 'O')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]!.toUpperCase())
      .join('') || 'O';

  const handleSignOut = async () => {
    try {
      await logout();
    } finally {
      router.push('/organizer/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar - Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 h-screen bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          {sidebarOpen ? (
            <>
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-lg">Lurexo</span>
              </Link>

              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto"
              aria-label="Expand sidebar"
            >
              <Ticket className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      isActive ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    } ${!sidebarOpen ? 'justify-center' : ''}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </Link>
              );
            })}
          </div>

          <div className="my-4 border-t border-gray-800"></div>

          <div className="space-y-1">
            <Link href="/">
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ${
                  !sidebarOpen ? 'justify-center' : ''
                }`}
              >
                <Home className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>Back to Site</span>}
              </button>
            </Link>
            <Link href="/help">
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ${
                  !sidebarOpen ? 'justify-center' : ''
                }`}
              >
                <HelpCircle className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>Help & Support</span>}
              </button>
            </Link>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-3 border-t border-gray-800">
          <div
            className={`w-full flex items-center gap-3 px-3 py-2.5 bg-gray-800 rounded-lg ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">{initials}</span>
            </div>

            {sidebarOpen && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-white text-sm font-medium truncate">{organizerName}</p>
                <p className="text-gray-400 text-xs truncate">{organizerId ? `User ID: ${organizerId}` : 'Organizer'}</p>
              </div>
            )}
          </div>

          {sidebarOpen && (
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mt-2 text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Lurexo</span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      isActive ? 'bg-purple-600/20 text-purple-400' : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                </Link>
              );
            })}
          </div>

          <div className="my-4 border-t border-gray-800"></div>

          <div className="space-y-1">
            <Link href="/">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <Home className="w-5 h-5" />
                <span>Back to Site</span>
              </button>
            </Link>
            <Link href="/help">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
                <HelpCircle className="w-5 h-5" />
                <span>Help & Support</span>
              </button>
            </Link>
          </div>
        </nav>

        <div className="p-3 border-t border-gray-800">
          <div className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">{initials}</span>
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-white text-sm font-medium truncate">{organizerName}</p>
              <p className="text-gray-400 text-xs truncate">{organizerId ? `User ID: ${organizerId}` : 'Organizer'}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mt-2 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Header - Mobile */}
        <header className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800 lg:hidden">
          <div className="px-4 sm:px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <Link href="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-white font-bold text-lg">Lurexo</span>
                </Link>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                <div className="flex items-center gap-2 px-3 py-2 bg-gray-800 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">{initials}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop Top Bar */}
        <header className="hidden lg:block sticky top-0 z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <button
                className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
