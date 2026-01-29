'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Menu, X, LogOut, User, Eye, Sparkles } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Calendar,
  Building2,
  MessageSquare,
  DollarSign,
  BarChart3,
  Settings,
} from 'lucide-react';

export default function AdminHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const adminUser = {
    name: 'Tayo',
    email: 'admin@lurexo.com',
  };

  const navItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
    },
    {
      name: 'Events',
      href: '/admin/events',
      icon: <Calendar className="w-5 h-5" />,
      badge: 8,
    },
    {
      name: 'Organizers',
      href: '/admin/organizers',
      icon: <Building2 className="w-5 h-5" />,
      badge: 3,
    },
    {
      name: 'Support',
      href: '/admin/support',
      icon: <MessageSquare className="w-5 h-5" />,
      badge: 12,
    },
    {
      name: 'Financials',
      href: '/admin/financials',
      icon: <DollarSign className="w-5 h-5" />,
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Mobile Menu Button + Logo & Admin Badge */}
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button - NOW ON LEFT */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/50"
              >
                <Menu className="w-5 h-5 text-white" />
              </button>

              {/* Logo */}
              <Link href="/admin" className="flex items-center gap-2 group">
                <div className="p-1.5 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg shadow-lg shadow-indigo-500/30">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-bold text-xl tracking-tight">Lurexo</span>
              </Link>

              {/* Admin Badge - Desktop Only */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 rounded-full shadow-lg shadow-indigo-500/10">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                  Admin Mode
                </span>
              </div>
            </div>

            {/* Right: Actions Only */}
            <div className="flex items-center gap-3">
              {/* View Main Site - Desktop */}
              <Link
                href="/events"
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"
              >
                <Eye className="w-4 h-4" />
                <span>View Site</span>
              </Link>

              {/* User Menu - Desktop */}
              <div className="hidden sm:flex items-center gap-3 pl-3 border-l border-slate-800/50">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{adminUser.name}</p>
                  <p className="text-xs text-slate-400">{adminUser.email}</p>
                </div>
                <button className="p-2.5 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 hover:from-slate-700 hover:to-slate-800 border border-slate-700/50 transition-all shadow-lg">
                  <User className="w-5 h-5 text-slate-300" />
                </button>
              </div>

              {/* Mobile: Just Profile Icon */}
              <button className="sm:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors border border-slate-700/50">
                <User className="w-5 h-5 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer - Slides from LEFT */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer - Slides from LEFT */}
          <div className="fixed top-16 left-0 bottom-0 w-80 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 z-50 lg:hidden overflow-y-auto shadow-2xl animate-slideInLeft">
            <nav className="p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 shadow-lg shadow-indigo-500/10 border border-indigo-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${isActive(item.href) ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}>
                      {item.icon}
                    </div>
                    <span className="font-medium text-base">{item.name}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="flex items-center justify-center min-w-[24px] h-6 px-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/30">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Footer */}
            <div className="p-4 border-t border-slate-800/50 space-y-3">
              {/* User Info */}
              <div className="px-4 py-3 bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-indigo-500/10 rounded-lg">
                    <User className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{adminUser.name}</p>
                    <p className="text-xs text-slate-400">{adminUser.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-lg">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">
                    Admin Mode
                  </span>
                </div>
              </div>

              {/* Actions */}
              <Link
                href="/events"
                className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl transition-all border border-slate-700/30 hover:border-slate-600/50"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Eye className="w-5 h-5" />
                <span className="font-medium">View Main Site</span>
              </Link>

              <button className="flex items-center gap-3 px-4 py-3 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-800/50 rounded-xl transition-all w-full border border-rose-500/20 hover:border-rose-500/30">
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>

              {/* Version */}
              <div className="pt-3 border-t border-slate-800/50">
                <p className="text-xs text-slate-500 text-center">Platform v1.0.0</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Add animations to your globals.css */}
      <style jsx global>{`
        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}