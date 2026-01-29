'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Settings,
  DollarSign,
  Shield,
  Bell,
  Mail,
  Smartphone,
  Globe,
  AlertCircle,
  Save,
  RefreshCw,
  CheckCircle,
  XCircle,
  Plus,
  X,
} from 'lucide-react';
import { mockPlatformSettings } from '../../../../lib/mockData/adminStats';

export default function SystemConfigurationPage() {
  const router = useRouter();
  const [settings, setSettings] = useState(mockPlatformSettings);
  const [isSaving, setSaving] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const handleSaveSettings = async () => {
    setSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    alert('Settings saved successfully!');
  };

  const handleAddKeyword = () => {
    if (newKeyword.trim() && !settings.flaggedKeywords.includes(newKeyword.trim())) {
      setSettings({
        ...settings,
        flaggedKeywords: [...settings.flaggedKeywords, newKeyword.trim()],
      });
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setSettings({
      ...settings,
      flaggedKeywords: settings.flaggedKeywords.filter(k => k !== keyword),
    });
  };

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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push('/admin/settings')}
          className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-lg text-slate-300 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            System Configuration
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Configure platform settings and preferences
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Platform Settings */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-indigo-400" />
          <h3 className="text-white font-bold text-lg">Platform Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Name */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Platform Name
            </label>
            <input
              type="text"
              value={settings.platformName}
              onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          {/* Support Email */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Support Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Maintenance Mode */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
              </div>
              <div className="flex-1">
                <span className="text-slate-300 font-medium">Maintenance Mode</span>
                <p className="text-slate-500 text-sm">Enable to put the platform in maintenance mode</p>
              </div>
              {settings.maintenanceMode && (
                <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-lg text-xs font-medium">
                  Active
                </span>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Financial Settings */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <DollarSign className="w-5 h-5 text-emerald-400" />
          <h3 className="text-white font-bold text-lg">Financial Settings</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Commission Rate */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Commission Rate (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
            </div>
            <p className="text-slate-500 text-xs mt-1">Platform fee percentage</p>
          </div>

          {/* Resale Cap */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Resale Cap (%)
            </label>
            <div className="relative">
              <input
                type="number"
                min="100"
                max="200"
                step="1"
                value={settings.resaleCap}
                onChange={(e) => setSettings({ ...settings, resaleCap: parseFloat(e.target.value) })}
                className="w-full px-4 py-2.5 bg-slate-800 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">%</span>
            </div>
            <p className="text-slate-500 text-xs mt-1">Maximum resale price vs face value</p>
          </div>

          {/* Min Ticket Price */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Minimum Ticket Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">£</span>
              <input
                type="number"
                min="0"
                step="1"
                value={settings.minTicketPrice}
                onChange={(e) => setSettings({ ...settings, minTicketPrice: parseFloat(e.target.value) })}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-800 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>

          {/* Max Ticket Price */}
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">
              Maximum Ticket Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">£</span>
              <input
                type="number"
                min="0"
                step="100"
                value={settings.maxTicketPrice}
                onChange={(e) => setSettings({ ...settings, maxTicketPrice: parseFloat(e.target.value) })}
                className="w-full pl-8 pr-4 py-2.5 bg-slate-800 border border-slate-700/50 rounded-lg text-white focus:outline-none focus:border-indigo-500/50 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Event Moderation */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-purple-400" />
          <h3 className="text-white font-bold text-lg">Event Moderation</h3>
        </div>

        <div className="space-y-4">
          {/* Auto Approve Events */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.autoApproveEvents}
                onChange={(e) => setSettings({ ...settings, autoApproveEvents: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
            <div className="flex-1">
              <span className="text-slate-300 font-medium">Auto-Approve Events</span>
              <p className="text-slate-500 text-sm">Automatically approve new events without manual review</p>
            </div>
            {settings.autoApproveEvents ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-slate-600" />
            )}
          </label>

          {/* Flagged Keywords */}
          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <h4 className="text-white font-semibold">Flagged Keywords</h4>
              <span className="text-slate-500 text-sm">({settings.flaggedKeywords.length})</span>
            </div>

            {/* Add Keyword */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                placeholder="Add keyword..."
                className="flex-1 px-4 py-2.5 bg-slate-800 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
              />
              <button
                onClick={handleAddKeyword}
                className="px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-white transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>

            {/* Keywords List */}
            <div className="flex flex-wrap gap-2">
              {settings.flaggedKeywords.map((keyword, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 px-3 py-1.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-sm font-medium hover:bg-rose-500/20 transition-all"
                >
                  <span>{keyword}</span>
                  <button
                    onClick={() => handleRemoveKeyword(keyword)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <p className="text-slate-500 text-xs mt-3">
              Events containing these keywords will be automatically flagged for manual review
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-blue-400" />
          <h3 className="text-white font-bold text-lg">Notifications</h3>
        </div>

        <div className="space-y-4">
          {/* Email Notifications */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
            <Mail className="w-5 h-5 text-slate-500" />
            <div className="flex-1">
              <span className="text-slate-300 font-medium">Email Notifications</span>
              <p className="text-slate-500 text-sm">Send email notifications to users</p>
            </div>
            {settings.emailNotifications && (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
          </label>

          {/* SMS Notifications */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={settings.smsNotifications}
                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 rounded-full peer-checked:bg-emerald-500 transition-all"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
            <Smartphone className="w-5 h-5 text-slate-500" />
            <div className="flex-1">
              <span className="text-slate-300 font-medium">SMS Notifications</span>
              <p className="text-slate-500 text-sm">Send SMS notifications to users</p>
            </div>
            {settings.smsNotifications && (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
          </label>
        </div>
      </div>

      {/* Save Button (Mobile) */}
      <div className="sm:hidden">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-lg text-white font-medium transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save All Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}