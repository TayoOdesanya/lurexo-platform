'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems: NavItem[] = [
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
    <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-800/50 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
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
              <span className="font-medium text-sm">{item.name}</span>
            </div>
            {item.badge && item.badge > 0 && (
              <span className="flex items-center justify-center min-w-[22px] h-5 px-2 text-xs font-bold text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full shadow-lg shadow-rose-500/30">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800/50">
        <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
          <p className="text-xs text-slate-400 mb-1">Platform Version</p>
          <p className="text-sm font-semibold text-white">v1.0.0</p>
        </div>
      </div>
    </aside>
  );
}