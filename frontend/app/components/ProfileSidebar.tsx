'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Edit,
  Shield,
  Bell,
  Languages,
  Receipt,
  CreditCard,
  Download,
  Heart,
  Globe,
  Moon,
  HelpCircle,
  Mail,
  Share2,
  LogOut,
  Award,
  Zap
} from 'lucide-react';

// Mock user data
const MOCK_USER = {
  id: 'user-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Liliana',
  verified: true,
  stats: {
    ticketsPurchased: 12,
    eventsAttended: 8,
    upcomingEvents: 3
  },
  wallet: {
    balance: 150.00,
    currency: 'GBP'
  }
};

// Menu sections structure
const menuSections = [
  {
    id: 'account',
    title: 'Account',
    items: [
      {
        icon: Edit,
        label: 'Edit Profile',
        href: '/profile/edit'
      },
      {
        icon: Shield,
        label: 'Privacy & Security',
        href: '/profile/security'
      },
      {
        icon: Bell,
        label: 'Notifications',
        href: '/profile/notifications'
      },
      {
        icon: Languages,
        label: 'Language & Region',
        href: '/profile/language'
      }
    ]
  },
  {
    id: 'tickets',
    title: 'Tickets & Orders',
    items: [
      {
        icon: Receipt,
        label: 'Order History',
        href: '/profile/orders'
      },
      {
        icon: CreditCard,
        label: 'Payment Methods',
        href: '/profile/payment'
      },
      {
        icon: Download,
        label: 'Download Tickets',
        href: '/profile/downloads'
      }
    ]
  },
  {
    id: 'preferences',
    title: 'Preferences',
    items: [
      {
        icon: Heart,
        label: 'Favorite Events',
        href: '/profile/favorites'
      },
      {
        icon: Globe,
        label: 'Event Preferences',
        href: '/profile/preferences'
      },
      {
        icon: Moon,
        label: 'Appearance',
        href: '/profile/appearance'
      }
    ]
  },
  {
    id: 'support',
    title: 'Support',
    items: [
      {
        icon: HelpCircle,
        label: 'Help Center',
        href: '/help'
      },
      {
        icon: Mail,
        label: 'Contact Us',
        href: '/profile/contact'
      }
    ]
  }
];

export default function ProfileSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    alert('Logout functionality coming soon!');
  };

  return (
    <aside className="hidden lg:block w-72 fixed left-0 top-16 bottom-0 bg-gray-900 border-r border-gray-800 overflow-y-auto">
      
      {/* Compact Profile Card */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <img 
              src={MOCK_USER.avatar} 
              alt={MOCK_USER.name}
              className="w-14 h-14 rounded-full bg-white"
            />
            {MOCK_USER.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-gray-900">
                <Award className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-sm truncate">
              {MOCK_USER.name}
            </h3>
            <p className="text-gray-400 text-xs truncate">
              {MOCK_USER.email}
            </p>
          </div>
        </div>
        
        {/* Mini Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-white text-lg font-bold">{MOCK_USER.stats.ticketsPurchased}</p>
            <p className="text-gray-500 text-xs">Tickets</p>
          </div>
          <div>
            <p className="text-white text-lg font-bold">{MOCK_USER.stats.eventsAttended}</p>
            <p className="text-gray-500 text-xs">Events</p>
          </div>
          <div>
            <p className="text-white text-lg font-bold">{MOCK_USER.stats.upcomingEvents}</p>
            <p className="text-gray-500 text-xs">Upcoming</p>
          </div>
        </div>
      </div>

      {/* Wallet Mini Card */}
      <div className="p-4 border-b border-gray-800">
        <Link href="/wallet" className="block bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-4 hover:from-purple-600 hover:to-blue-600 transition-all">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-white" />
                </div>
                <span className="text-white text-xs font-semibold">Wallet</span>
              </div>
              <Zap className="w-4 h-4 text-yellow-300" />
            </div>
            <div className="flex items-baseline justify-between">
              <div>
                <p className="text-white/80 text-xs">Balance</p>
                <p className="text-white text-xl font-bold">
                  £{MOCK_USER.wallet.balance.toFixed(2)}
                </p>
              </div>
              <button className="bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-lg text-xs font-medium transition-colors">
                Top Up
              </button>
            </div>
        </Link>
      </div>

      {/* Navigation Sections */}
      <nav className="py-2">
        {menuSections.map((section) => (
          <div key={section.id} className="mb-4">
            <h3 className="px-6 py-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
              {section.title}
            </h3>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
            <Link 
                href={item.href || '#'} 
                key={item.label}
                className={`flex items-center gap-3 px-6 py-3 transition-all ${
                isActive
                    ? 'bg-purple-500/10 border-r-4 border-purple-500'
                    : 'hover:bg-gray-800'
                }`}
            >
                <Icon className={`w-5 h-5 ${
                isActive ? 'text-purple-400' : 'text-gray-500'
                }`} />
                <span className={`text-sm font-medium ${
                isActive ? 'text-white' : 'text-gray-400'
                }`}>
                {item.label}
                </span>
            </Link>
            );
            })}
          </div>
        ))}

        {/* Logout Button */}
        <div className="px-4 pt-4 border-t border-gray-800 mt-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400 text-sm font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
}