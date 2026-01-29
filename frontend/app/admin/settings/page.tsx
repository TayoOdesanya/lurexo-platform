'use client';

import Link from 'next/link';
import {
  Settings,
  Users,
  Globe,
  Bell,
  Shield,
  DollarSign,
  Activity,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Server,
  Mail,
  Smartphone,
} from 'lucide-react';
import { mockPlatformSettings, mockAdminUsers as mockAdminAccounts } from '../../../lib/mockData/adminStats';

export default function SettingsPage() {
  const settings = mockPlatformSettings;
  const adminAccounts = mockAdminAccounts;
  const activeAdmins = adminAccounts.filter(a => a.isActive).length;

  const formatPercentage = (value: number) => `${value}%`;
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
          Settings
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Manage platform configuration and admin access
        </p>
      </div>

      {/* Quick Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Platform Status */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-xl p-6 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Platform Status</p>
          <p className="text-white font-bold text-2xl">
            {settings.maintenanceMode ? 'Maintenance' : 'Active'}
          </p>
          <p className="text-emerald-400 text-xs mt-2">All systems operational</p>
        </div>

        {/* Active Admins */}
        <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Users className="w-6 h-6 text-indigo-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Active Admins</p>
          <p className="text-white font-bold text-2xl">{activeAdmins}</p>
          <p className="text-indigo-400 text-xs mt-2">of {adminAccounts.length} total</p>
        </div>

        {/* Commission Rate */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl p-6 border border-amber-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-amber-500/20 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Commission Rate</p>
          <p className="text-white font-bold text-2xl">{formatPercentage(settings.commissionRate)}</p>
          <p className="text-amber-400 text-xs mt-2">Platform fee</p>
        </div>

        {/* Auto Approval */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-slate-400 text-sm mb-1">Auto Approval</p>
          <p className="text-white font-bold text-2xl">
            {settings.autoApproveEvents ? 'Enabled' : 'Disabled'}
          </p>
          <p className="text-blue-400 text-xs mt-2">Event moderation</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Admin Management */}
        <Link
          href="/admin/settings/admins"
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6 hover:border-indigo-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/30">
                <Users className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Admin Management</h3>
                <p className="text-slate-400 text-sm">Manage admin users and permissions</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Active Admins</p>
              <p className="text-white font-semibold">{activeAdmins}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Total Admins</p>
              <p className="text-white font-semibold">{adminAccounts.length}</p>
            </div>
          </div>
        </Link>

        {/* System Configuration */}
        <Link
          href="/admin/settings/system"
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6 hover:border-purple-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/30">
                <Server className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">System Configuration</h3>
                <p className="text-slate-400 text-sm">Platform settings and preferences</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Commission</p>
              <p className="text-white font-semibold">{formatPercentage(settings.commissionRate)}</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
              <p className="text-slate-500 text-xs mb-1">Resale Cap</p>
              <p className="text-white font-semibold">{formatPercentage(settings.resaleCap)}</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Current Settings Overview */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <h3 className="text-white font-bold text-lg mb-6">Current Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Settings */}
          <div className="space-y-4">
            <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wide mb-3">Platform Settings</h4>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">Platform Name</span>
              </div>
              <span className="text-white font-medium">{settings.platformName}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">Commission Rate</span>
              </div>
              <span className="text-white font-medium">{formatPercentage(settings.commissionRate)}</span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">Resale Cap</span>
              </div>
              <span className="text-white font-medium">{formatPercentage(settings.resaleCap)}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">Auto-Approve Events</span>
              </div>
              {settings.autoApproveEvents ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-slate-500" />
              )}
            </div>
          </div>

          {/* Notifications & Limits */}
          <div className="space-y-4">
            <h4 className="text-slate-300 font-semibold text-sm uppercase tracking-wide mb-3">Notifications & Limits</h4>
            
            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">Email Notifications</span>
              </div>
              {settings.emailNotifications ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-slate-500" />
              )}
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">SMS Notifications</span>
              </div>
              {settings.smsNotifications ? (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-slate-500" />
              )}
            </div>

            <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">Max Ticket Price</span>
              </div>
              <span className="text-white font-medium">{formatCurrency(settings.maxTicketPrice)}</span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-500" />
                <span className="text-slate-300">Min Ticket Price</span>
              </div>
              <span className="text-white font-medium">{formatCurrency(settings.minTicketPrice)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Keywords */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-white font-bold text-lg">Flagged Keywords</h3>
          <span className="text-slate-500 text-sm">({settings.flaggedKeywords.length})</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {settings.flaggedKeywords.map((keyword, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-sm font-medium"
            >
              {keyword}
            </span>
          ))}
        </div>
        <p className="text-slate-400 text-sm mt-4">
          Events containing these keywords will be automatically flagged for review
        </p>
      </div>
    </div>
  );
}