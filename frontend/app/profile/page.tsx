'use client';

import { useState } from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { 
  Home, 
  Ticket, 
  User, 
  Search,
  ChevronRight,
  Settings,
  Bell,
  CreditCard,
  Receipt,
  Heart,
  Share2,
  LogOut,
  Edit,
  Shield,
  HelpCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  Zap,
  Globe,
  Moon,
  Sun,
  Languages,
  Lock,
  Trash2,
  Download,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

// Mock user data
const MOCK_USER = {
  id: 'user-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+44 7700 900123',
  location: 'London, UK',
  avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Liliana',
  memberSince: '2024-01-15',
  verified: true,
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    categories: ['Music', 'Comedy', 'Sports'],
    theme: 'dark',
    language: 'en'
  },
  stats: {
    ticketsPurchased: 12,
    eventsAttended: 8,
    upcomingEvents: 3,
    favoriteVenues: 5
  },
  wallet: {
    balance: 150.00,
    currency: 'GBP'
  }
};

export default function ProfilePage() {
  const [user, setUser] = useState(MOCK_USER);
  const [activeSection, setActiveSection] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      month: 'long',
      year: 'numeric'
    });
  };

  const handleLogout = () => {
    // TODO: Implement logout
    alert('Logout functionality coming soon!');
  };

  // Menu sections
  const menuSections = [
    {
      id: 'account',
      title: 'Account',
      items: [
        {
          icon: Edit,
          label: 'Edit Profile',
          description: 'Update your personal information',
          href: '/profile/edit'
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          description: 'Manage your privacy settings',
          href: '/profile/security'
        },
        {
          icon: Bell,
          label: 'Notifications',
          description: 'Configure notification preferences',
          href: '/profile/notifications'
        },
        {
          icon: Languages,
          label: 'Language & Region',
          description: 'English (UK)',
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
          description: `${user.stats.ticketsPurchased} orders`,
          href: '/profile/orders'
        },
        {
          icon: CreditCard,
          label: 'Payment Methods',
          description: 'Manage cards and payment options',
          href: '/profile/payment'
        },
        {
          icon: Download,
          label: 'Download Tickets',
          description: 'Export your tickets',
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
          description: 'Your saved events and venues',
          href: '/profile/favorites'
        },
        {
          icon: Globe,
          label: 'Event Preferences',
          description: user.preferences.categories.join(', '),
          href: '/profile/preferences'
        },
        {
          icon: Moon,
          label: 'Appearance',
          description: user.preferences.theme === 'dark' ? 'Dark Mode' : 'Light Mode',
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
          description: 'FAQs and support articles',
          href: '/profile/help'
        },
        {
          icon: Mail,
          label: 'Contact Us',
          description: 'Get in touch with support',
          href: '/profile/contact'
        },
        {
          icon: Share2,
          label: 'Invite Friends',
          description: 'Share Lurexo with friends',
          action: () => {
            if (navigator.share) {
              navigator.share({
                title: 'Join Lurexo',
                text: 'Check out Lurexo - the best way to buy and manage event tickets!',
                url: window.location.origin
              });
            }
          }
        }
      ]
    },
    {
      id: 'danger',
      title: 'Danger Zone',
      items: [
        {
          icon: AlertTriangle,
          label: 'Account Management',
          description: 'Delete or deactivate account',
          href: '/profile/danger-zone',
          danger: true
        }
      ]
    }
  ];

  return (
  <div className="min-h-screen bg-black pb-20 lg:pb-6">
      {/* MOBILE ONLY: Header with gradient and user card */}
    <div className="lg:hidden bg-gradient-to-br from-purple-600 to-blue-600 p-6 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-white text-2xl font-bold">Profile</h1>
          <button 
            onClick={handleLogout}
            className="text-white/90 hover:text-white flex items-center gap-1 text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>

        {/* User Info Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="relative">
              <img 
                src={user.avatar} 
                alt={user.name}
                className="w-20 h-20 rounded-full bg-white"
              />
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            {/* User Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-white text-xl font-bold">{user.name}</h2>
                {user.verified && (
                  <Award className="w-4 h-4 text-yellow-400" />
                )}
              </div>
              <p className="text-white/80 text-sm mb-1">{user.email}</p>
              <p className="text-white/60 text-xs">
                Member since {formatDate(user.memberSince)}
              </p>
            </div>

            {/* Edit Button */}
            <Link href="/profile/edit">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Edit className="w-5 h-5 text-white" />
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-white text-xl font-bold">{user.stats.ticketsPurchased}</p>
              <p className="text-white/70 text-xs">Tickets</p>
            </div>
            <div className="text-center">
              <p className="text-white text-xl font-bold">{user.stats.eventsAttended}</p>
              <p className="text-white/70 text-xs">Attended</p>
            </div>
            <div className="text-center">
              <p className="text-white text-xl font-bold">{user.stats.upcomingEvents}</p>
              <p className="text-white/70 text-xs">Upcoming</p>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE ONLY: Wallet Card */}
        <div className="lg:hidden px-4 -mt-4 mb-4">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-4 shadow-lg">
                <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Lurexo Wallet</span>
            </div>
            <Zap className="w-5 h-5 text-yellow-300" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-white/80 text-xs">Balance</p>
              <p className="text-white text-3xl font-bold">
                £{user.wallet.balance.toFixed(2)}
              </p>
            </div>
            <Link href="/wallet">
              <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Top Up
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* DESKTOP: Page Header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-white text-3xl font-bold mb-2">My Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>
        </div>

      {/* Menu Sections */}
      <div className="px-4 lg:px-6 lg:max-w-7xl lg:mx-auto space-y-6 mt-6">
        {menuSections.map((section) => (
          <div key={section.id}>
            <h3 className="text-white text-sm font-semibold mb-3 px-2">
              {section.title}
            </h3>
            <div className="bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 lg:grid lg:grid-cols-2 lg:gap-px lg:bg-gray-800">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                const isLast = index === section.items.length - 1;

                return (
                        <div 
                            key={item.label} 
                            className={`lg:bg-gray-900 ${
                            isLast && section.items.length % 2 !== 0 ? 'lg:col-span-2' : ''
                            }`}
                        >
                    {item.href ? (
                      <Link href={item.href}>
                        <div className={`flex items-center gap-3 p-4 hover:bg-gray-800 transition-colors cursor-pointer ${
                          item.danger ? 'border-t border-red-500/20' : ''
                        }`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                            item.danger ? 'bg-red-500/20' : 'bg-gray-800'
                          }`}>
                            <Icon className={`w-5 h-5 ${
                              item.danger ? 'text-red-400' : 'text-purple-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium text-sm ${
                              item.danger ? 'text-red-400' : 'text-white'
                            }`}>{item.label}</p>
                            <p className="text-gray-400 text-xs truncate">{item.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-600" />
                        </div>
                      </Link>
                    ) : (
                      <div 
                        onClick={item.action}
                        className="flex items-center gap-3 p-4 hover:bg-gray-800 transition-colors cursor-pointer"
                      >
                        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-medium text-sm">{item.label}</p>
                          <p className="text-gray-400 text-xs truncate">{item.description}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                      </div>
                    )}
                    {!isLast && <div className="lg:hidden border-t border-gray-800 mx-4" />}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Danger Zone */}
        <div>
          <h3 className="text-red-400 text-sm font-semibold mb-3 px-2">
            Danger Zone
          </h3>
          <div className="bg-gray-900 rounded-2xl overflow-hidden border border-red-900/30">
            <button className="w-full flex items-center gap-3 p-4 hover:bg-red-900/10 transition-colors">
              <div className="w-10 h-10 bg-red-900/20 rounded-xl flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-red-400 font-medium text-sm">Delete Account</p>
                <p className="text-gray-400 text-xs">Permanently delete your account</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* App Info */}
        <div className="text-center py-6 space-y-2">
          <p className="text-gray-600 text-xs">Lurexo v1.0.0</p>
          <div className="flex items-center justify-center gap-4 text-gray-600 text-xs">
            <Link href="/privacy" className="hover:text-gray-400">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-gray-400">Terms of Service</Link>
          </div>
          <p className="text-gray-700 text-xs">© 2025 Lurexo. All rights reserved.</p>
        </div>
      </div>

     {/* MOBILE ONLY: Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 z-50">
        <div className="flex items-center justify-around py-3">
          <Link href="/mobile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Home className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-xs">Home</span>
            </button>
          </Link>

          <Link href="/tickets">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Ticket className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-xs">Tickets</span>
            </button>
          </Link>

          <Link href="/profile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <User className="w-6 h-6 text-purple-500" />
              <span className="text-purple-500 text-xs font-semibold">Profile</span>
            </button>
          </Link>

          <Link href="/search/mobile">
            <button className="flex flex-col items-center gap-1 px-4 py-2">
              <Search className="w-6 h-6 text-gray-400" />
              <span className="text-gray-400 text-xs">Search</span>
            </button>
          </Link>
        </div>
      </div>
            <div className="hidden lg:block">
              <Footer />
            </div>
    </div>
  );
}