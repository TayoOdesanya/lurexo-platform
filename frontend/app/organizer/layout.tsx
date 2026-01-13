'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Mail } from 'lucide-react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Plus,
  Calendar,
  QrCode,
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
  UserPlus,  // For Collaborators icon
} from 'lucide-react';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const organizerName = 'Alex Morgan';

  // Authentication check
  useEffect(() => {
    const isAuthenticated = true; // Replace with actual auth check
    
    if (!isAuthenticated) {
      router.push('/auth/organizer-login');
    }
  }, [router]);

  // Navigation items
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/organizer/dashboard' },
    { icon: Plus, label: 'Create Event', href: '/organizer/create-event' },
    { icon: Calendar, label: 'Manage Events', href: '/organizer/manage-events' },
    { icon: QrCode, label: 'Scanner', href: '/scanner' },
    { icon: BarChart3, label: 'Analytics', href: '/organizer/analytics' },
    { icon: Users, label: 'Audience', href: '/organizer/audience' },
    { icon: UserPlus, label: 'Collaborators', href: '/organizer/collaborators' },
    { icon: Mail, label: 'Marketing', href: '/organizer/marketing' },
    { icon: CreditCard, label: 'Payouts', href: '/organizer/payouts' },
    { icon: Settings, label: 'Settings', href: '/organizer/settings' },
  ];

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
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mx-auto"
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
                      isActive
                        ? 'bg-purple-600/20 text-purple-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    } ${!sidebarOpen && 'justify-center'}`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-gray-800"></div>

          {/* Secondary nav */}
          <div className="space-y-1">
            <Link href="/">
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ${
                  !sidebarOpen && 'justify-center'
                }`}
              >
                <Home className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span>Back to Site</span>}
              </button>
            </Link>
            <Link href="/help">
              <button
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors ${
                  !sidebarOpen && 'justify-center'
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
          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors ${
              !sidebarOpen && 'justify-center'
            }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-bold">AM</span>
            </div>
            {sidebarOpen && (
              <div className="flex-1 text-left min-w-0">
                <p className="text-white text-sm font-medium truncate">{organizerName}</p>
                <p className="text-gray-400 text-xs">Organizer</p>
              </div>
            )}
          </button>
          
          {sidebarOpen && (
            <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mt-2 text-sm">
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-gray-900 border-r border-gray-800 z-50 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
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
          >
            <X className="w-4 h-4" />
          </button>
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
                    onClick={() => setMobileMenuOpen(false)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                      isActive
                        ? 'bg-purple-600/20 text-purple-400'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
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

        {/* User Profile */}
        <div className="p-3 border-t border-gray-800">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-gray-800 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">AM</span>
            </div>
            <div className="flex-1 text-left">
              <p className="text-white text-sm font-medium">{organizerName}</p>
              <p className="text-gray-400 text-xs">Organizer</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors mt-2 text-sm">
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
                <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">AM</span>
                  </div>
                </button>
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
              >
                <Menu className="w-5 h-5" />
              </button>
              <button className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}