'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building,
  Globe,
  Lock,
  Bell,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Save,
  Trash2,
  Upload,
  Camera,
  Check,
  X,
  AlertCircle,
  Loader2,
  ChevronRight,
  Key,
  Smartphone,
  FileText,
  HelpCircle,
  ExternalLink,
  Calendar,
  Clock,
  DollarSign,
  Zap,
  Settings as SettingsIcon,
  LogOut,
  Download,
  Share2
} from 'lucide-react';

export default function OrganizerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Profile data
  const [profileData, setProfileData] = useState({
    firstName: 'Alex',
    lastName: 'Morgan',
    email: 'alex.morgan@lurexo.co.uk',
    phone: '+44 7700 900123',
    bio: 'Professional event organizer with 10+ years of experience in music festivals and live events.',
    companyName: 'Morgan Events Ltd',
    website: 'https://morganevents.co.uk',
    address: '123 High Street, London, SW1A 1AA',
    vatNumber: 'GB123456789',
    avatar: null
  });

  // Account security
  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  });

  // Notification preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    emailNotifications: {
      ticketSales: true,
      lowInventory: true,
      eventReminders: true,
      customerMessages: true,
      weeklyReports: true,
      marketing: false
    },
    pushNotifications: {
      ticketSales: true,
      lowInventory: true,
      eventReminders: false,
      customerMessages: true
    },
    smsNotifications: {
      criticalAlerts: true,
      eventDay: true
    }
  });

  // Payment settings
  const [paymentData, setPaymentData] = useState({
    bankName: 'Barclays',
    accountNumber: '****5678',
    sortCode: '20-00-00',
    payoutSchedule: 'daily',
    minimumPayout: 100
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handlePasswordChange = async () => {
    if (securityData.newPassword !== securityData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSecurityData({
      ...securityData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account & Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payments', label: 'Payments & Billing', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: SettingsIcon }
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white font-bold text-2xl sm:text-3xl mb-2">
                Settings
              </h1>
              <p className="text-gray-400 text-sm">
                Manage your account and preferences
              </p>
            </div>
            {saveSuccess && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                <Check className="w-5 h-5 text-green-400" />
                <span className="text-green-400 text-sm font-medium">Changes saved!</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium text-sm">{tab.label}</span>
                      <ChevronRight className={`w-4 h-4 ml-auto ${activeTab === tab.id ? 'opacity-100' : 'opacity-0'}`} />
                    </button>
                  );
                })}
              </nav>

              {/* Quick Links */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-gray-500 text-xs font-semibold uppercase mb-3 px-4">
                  Quick Links
                </p>
                <div className="space-y-1">
                  <Link href="/help" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm">
                    <HelpCircle className="w-4 h-4" />
                    <span>Help Centre</span>
                  </Link>
                  <Link href="/privacy" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Privacy Policy</span>
                  </Link>
                  <Link href="/terms" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm">
                    <FileText className="w-4 h-4" />
                    <span>Terms of Service</span>
                  </Link>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                {/* Profile Picture */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-white font-bold text-xl mb-6">Profile Picture</h2>
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">AM</span>
                      </div>
                      <button className="absolute bottom-0 right-0 p-2 bg-purple-600 hover:bg-purple-500 rounded-full transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold mb-2">Update your photo</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        JPG, PNG or GIF. Max 2MB.
                      </p>
                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
                          <Upload className="w-4 h-4" />
                          Upload Photo
                        </button>
                        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm font-medium transition-colors">
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-white font-bold text-xl mb-6">Personal Information</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-gray-400 text-sm font-medium mb-2 block">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm font-medium mb-2 block">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full bg-gray-800 text-white pl-11 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full bg-gray-800 text-white pl-11 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Bio
                      </label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                        rows={4}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                      <p className="text-gray-500 text-xs mt-1">
                        {profileData.bio.length}/500 characters
                      </p>
                    </div>
                  </div>
                </div>

                {/* Company Information */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-white font-bold text-xl mb-6">Company Information</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.companyName}
                          onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                          className="w-full bg-gray-800 text-white pl-11 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="url"
                          value={profileData.website}
                          onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                          className="w-full bg-gray-800 text-white pl-11 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Business Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                        <textarea
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          rows={3}
                          className="w-full bg-gray-800 text-white pl-11 pr-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        VAT Number (Optional)
                      </label>
                      <input
                        type="text"
                        value={profileData.vatNumber}
                        onChange={(e) => setProfileData({ ...profileData, vatNumber: e.target.value })}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        placeholder="GB123456789"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Account & Security Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                {/* Change Password */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-white font-bold text-xl mb-6">Change Password</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={securityData.currentPassword}
                          onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                          className="w-full bg-gray-800 text-white pl-11 pr-12 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                        />
                        <button
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <button
                      onClick={handlePasswordChange}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Updating...</span>
                        </>
                      ) : (
                        <>
                          <Key className="w-5 h-5" />
                          <span>Update Password</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-white font-bold text-xl mb-2">Two-Factor Authentication</h2>
                      <p className="text-gray-400 text-sm">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      securityData.twoFactorEnabled
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-700 text-gray-400'
                    }`}>
                      {securityData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-sm mb-1">Authenticator App</h3>
                      <p className="text-gray-400 text-xs">Use an app like Google Authenticator or Authy</p>
                    </div>
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition-colors">
                      {securityData.twoFactorEnabled ? 'Manage' : 'Enable'}
                    </button>
                  </div>
                </div>

                {/* Login Sessions */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-white font-bold text-xl mb-4">Active Sessions</h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">Current Session</p>
                          <p className="text-gray-400 text-xs">London, UK • Chrome • Active now</p>
                        </div>
                      </div>
                      <span className="text-green-400 text-xs font-semibold">THIS DEVICE</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          <Smartphone className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">iPhone 14 Pro</p>
                          <p className="text-gray-400 text-xs">Manchester, UK • Safari • 2 hours ago</p>
                        </div>
                      </div>
                      <button className="text-red-400 hover:text-red-300 text-xs font-semibold">
                        REVOKE
                      </button>
                    </div>
                  </div>
                  <button className="w-full mt-4 text-center text-red-400 hover:text-red-300 text-sm font-medium py-2">
                    Sign out of all other sessions
                  </button>
                </div>

                {/* Delete Account */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-white font-bold text-lg mb-2">Delete Account</h3>
                      <p className="text-gray-400 text-sm mb-4">
                        Once you delete your account, there is no going back. All your events, data, and earnings history will be permanently deleted.
                      </p>
                      <button
                        onClick={() => setShowDeleteModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                {/* Email Notifications */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Mail className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl">Email Notifications</h2>
                      <p className="text-gray-400 text-sm">Manage what emails you receive</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(notificationPrefs.emailNotifications).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between cursor-pointer group">
                        <div>
                          <p className="text-white font-medium text-sm group-hover:text-purple-400 transition-colors">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {key === 'ticketSales' && 'Get notified when someone purchases tickets'}
                            {key === 'lowInventory' && 'Alert when ticket inventory is running low'}
                            {key === 'eventReminders' && 'Reminders about upcoming events'}
                            {key === 'customerMessages' && 'Messages from ticket buyers'}
                            {key === 'weeklyReports' && 'Weekly performance summaries'}
                            {key === 'marketing' && 'Tips and news from Lurexo'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationPrefs({
                            ...notificationPrefs,
                            emailNotifications: {
                              ...notificationPrefs.emailNotifications,
                              [key]: e.target.checked
                            }
                          })}
                          className="w-12 h-6 bg-gray-700 rounded-full appearance-none cursor-pointer transition-colors relative
                            checked:bg-purple-600
                            before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform
                            checked:before:translate-x-6"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Push Notifications */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl">Push Notifications</h2>
                      <p className="text-gray-400 text-sm">Real-time alerts on your devices</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(notificationPrefs.pushNotifications).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between cursor-pointer group">
                        <div>
                          <p className="text-white font-medium text-sm group-hover:text-blue-400 transition-colors">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationPrefs({
                            ...notificationPrefs,
                            pushNotifications: {
                              ...notificationPrefs.pushNotifications,
                              [key]: e.target.checked
                            }
                          })}
                          className="w-12 h-6 bg-gray-700 rounded-full appearance-none cursor-pointer transition-colors relative
                            checked:bg-blue-600
                            before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform
                            checked:before:translate-x-6"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <h2 className="text-white font-bold text-xl">SMS Notifications</h2>
                      <p className="text-gray-400 text-sm">Important alerts via text message</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {Object.entries(notificationPrefs.smsNotifications).map(([key, value]) => (
                      <label key={key} className="flex items-center justify-between cursor-pointer group">
                        <div>
                          <p className="text-white font-medium text-sm group-hover:text-green-400 transition-colors">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5">
                            {key === 'criticalAlerts' && 'Security and urgent account issues'}
                            {key === 'eventDay' && 'Day-of-event important updates'}
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotificationPrefs({
                            ...notificationPrefs,
                            smsNotifications: {
                              ...notificationPrefs.smsNotifications,
                              [key]: e.target.checked
                            }
                          })}
                          className="w-12 h-6 bg-gray-700 rounded-full appearance-none cursor-pointer transition-colors relative
                            checked:bg-green-600
                            before:content-[''] before:absolute before:w-5 before:h-5 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 before:transition-transform
                            checked:before:translate-x-6"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                {/* Bank Account */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-white font-bold text-xl mb-2">Bank Account</h2>
                      <p className="text-gray-400 text-sm">Where your payouts will be sent</p>
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-semibold">
                      Verified
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-xl">
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{paymentData.bankName}</p>
                        <p className="text-gray-400 text-sm">
                          {paymentData.sortCode} • {paymentData.accountNumber}
                        </p>
                      </div>
                      <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
                        Update
                      </button>
                    </div>
                  </div>
                </div>

                {/* Payout Schedule */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-white font-bold text-xl mb-6">Payout Schedule</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-3 block">
                        How often would you like to receive payouts?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {['daily', 'weekly', 'monthly'].map((schedule) => (
                          <button
                            key={schedule}
                            onClick={() => setPaymentData({ ...paymentData, payoutSchedule: schedule })}
                            className={`p-4 rounded-xl border-2 transition-all capitalize ${
                              paymentData.payoutSchedule === schedule
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                            }`}
                          >
                            <Clock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                            <div className="text-white text-sm font-medium">{schedule}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Minimum Payout Amount (£)
                      </label>
                      <select
                        value={paymentData.minimumPayout}
                        onChange={(e) => setPaymentData({ ...paymentData, minimumPayout: Number(e.target.value) })}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                      >
                        <option value={100}>£100</option>
                        <option value={250}>£250</option>
                        <option value={500}>£500</option>
                        <option value={1000}>£1,000</option>
                      </select>
                      <p className="text-gray-500 text-xs mt-1">
                        Payouts will only process when your balance exceeds this amount
                      </p>
                    </div>
                  </div>
                </div>

                {/* Billing History */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-white font-bold text-xl">Recent Transactions</h2>
                    <button className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium">
                      <Download className="w-4 h-4" />
                      Export All
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      { date: '2025-12-01', amount: 2340, type: 'Payout', status: 'Completed' },
                      { date: '2025-11-28', amount: 1890, type: 'Payout', status: 'Completed' },
                      { date: '2025-11-25', amount: 3120, type: 'Payout', status: 'Completed' },
                      { date: '2025-11-22', amount: 2560, type: 'Payout', status: 'Completed' }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-800 rounded-xl hover:bg-gray-750 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-green-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">{transaction.type}</p>
                            <p className="text-gray-400 text-xs">{new Date(transaction.date).toLocaleDateString('en-GB')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">£{transaction.amount.toLocaleString()}</p>
                          <p className="text-green-400 text-xs">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Settings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Display Preferences */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-white font-bold text-xl mb-6">Display Preferences</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Language
                      </label>
                      <select className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                        <option>English (UK)</option>
                        <option>English (US)</option>
                        <option>Español</option>
                        <option>Français</option>
                        <option>Deutsch</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Timezone
                      </label>
                      <select className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                        <option>London (GMT+0)</option>
                        <option>New York (GMT-5)</option>
                        <option>Los Angeles (GMT-8)</option>
                        <option>Sydney (GMT+11)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-400 text-sm font-medium mb-2 block">
                        Currency
                      </label>
                      <select className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20">
                        <option>GBP (£)</option>
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Data & Privacy */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
                  <h2 className="text-white font-bold text-xl mb-6">Data & Privacy</h2>
                  <div className="space-y-4">
                    <button className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Download className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-white font-medium text-sm">Download Your Data</p>
                          <p className="text-gray-400 text-xs">Get a copy of all your data</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Share2 className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-white font-medium text-sm">Export Event Data</p>
                          <p className="text-gray-400 text-xs">Download event and attendee information</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>

                    <button className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-xl transition-colors text-left">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-white font-medium text-sm">Privacy Settings</p>
                          <p className="text-gray-400 text-xs">Control your data and privacy</p>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md border border-red-500/30">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2 text-center">Delete Account?</h3>
            <p className="text-gray-400 text-sm mb-6 text-center">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {/* Handle delete */}}
                className="flex-1 bg-red-600 hover:bg-red-500 text-white py-3 rounded-xl font-semibold transition-colors"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}