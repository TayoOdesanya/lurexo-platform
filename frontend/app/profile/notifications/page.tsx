'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Check,
  Save,
  Calendar,
  Ticket,
  TrendingUp,
  Heart,
  Users,
  DollarSign
} from 'lucide-react';

const INITIAL_SETTINGS = {
  email: {
    enabled: true,
    marketing: true,
    eventReminders: true,
    ticketUpdates: true,
    newEvents: false,
    recommendations: true,
    newsletter: false
  },
  push: {
    enabled: true,
    eventReminders: true,
    ticketUpdates: true,
    friendActivity: false,
    eventStarting: true,
    newEvents: false,
    messages: true
  },
  sms: {
    enabled: false,
    eventReminders: false,
    ticketUpdates: false,
    securityAlerts: true
  }
};

export default function NotificationsPage() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleToggleAll = (category, enabled) => {
    const newSettings = { ...settings[category] };
    Object.keys(newSettings).forEach(key => {
      newSettings[key] = enabled;
    });
    setSettings(prev => ({
      ...prev,
      [category]: newSettings
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    
    // TODO: Implement actual API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const ToggleSwitch = ({ enabled, onToggle }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        enabled ? 'bg-purple-600' : 'bg-gray-700'
      }`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-0'
      }`} />
    </button>
  );

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* MOBILE ONLY: Header with back button */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-white" />
              </button>
            </Link>
            <div>
              <h1 className="text-white text-xl font-bold">Notifications</h1>
              <p className="text-gray-400 text-xs">Manage your notification preferences</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving || saved}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              saved 
                ? 'bg-green-600 text-white' 
                : saving 
                ? 'bg-gray-700 text-gray-400' 
                : 'bg-purple-600 hover:bg-purple-500 text-white'
            }`}
          >
            {saved ? (
              <Check className="w-5 h-5" />
            ) : (
              <Save className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* DESKTOP ONLY: Simple page header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-white text-2xl font-bold">Notifications</h1>
            <p className="text-gray-400 text-sm">Manage your notification preferences</p>
        </div>
        </div>
      

      <div className="p-4 lg:p-6 space-y-6">
        {/* Email Notifications */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">Email Notifications</h2>
                  <p className="text-gray-400 text-xs">Receive updates via email</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.email.enabled} 
                onToggle={() => handleToggleAll('email', !settings.email.enabled)}
              />
            </div>
          </div>

          {settings.email.enabled && (
            <div className="divide-y divide-gray-800">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Event Reminders</p>
                    <p className="text-gray-400 text-xs">Get notified before events start</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.email.eventReminders}
                  onToggle={() => handleToggle('email', 'eventReminders')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Ticket Updates</p>
                    <p className="text-gray-400 text-xs">Changes to your tickets</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.email.ticketUpdates}
                  onToggle={() => handleToggle('email', 'ticketUpdates')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Recommendations</p>
                    <p className="text-gray-400 text-xs">Events you might like</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.email.recommendations}
                  onToggle={() => handleToggle('email', 'recommendations')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">New Events</p>
                    <p className="text-gray-400 text-xs">Newly added events in your area</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.email.newEvents}
                  onToggle={() => handleToggle('email', 'newEvents')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Marketing & Offers</p>
                    <p className="text-gray-400 text-xs">Special deals and promotions</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.email.marketing}
                  onToggle={() => handleToggle('email', 'marketing')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Newsletter</p>
                    <p className="text-gray-400 text-xs">Monthly newsletter and updates</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.email.newsletter}
                  onToggle={() => handleToggle('email', 'newsletter')}
                />
              </div>
            </div>
          )}
        </div>

        {/* Push Notifications */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">Push Notifications</h2>
                  <p className="text-gray-400 text-xs">Mobile app notifications</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.push.enabled}
                onToggle={() => handleToggleAll('push', !settings.push.enabled)}
              />
            </div>
          </div>

          {settings.push.enabled && (
            <div className="divide-y divide-gray-800">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Event Starting Soon</p>
                    <p className="text-gray-400 text-xs">1 hour before event starts</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.push.eventStarting}
                  onToggle={() => handleToggle('push', 'eventStarting')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Event Reminders</p>
                    <p className="text-gray-400 text-xs">24 hours before events</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.push.eventReminders}
                  onToggle={() => handleToggle('push', 'eventReminders')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Ticket Updates</p>
                    <p className="text-gray-400 text-xs">Important ticket changes</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.push.ticketUpdates}
                  onToggle={() => handleToggle('push', 'ticketUpdates')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Messages</p>
                    <p className="text-gray-400 text-xs">Direct messages from organizers</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.push.messages}
                  onToggle={() => handleToggle('push', 'messages')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Friend Activity</p>
                    <p className="text-gray-400 text-xs">When friends buy tickets</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.push.friendActivity}
                  onToggle={() => handleToggle('push', 'friendActivity')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">New Events</p>
                    <p className="text-gray-400 text-xs">From your favorite venues</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.push.newEvents}
                  onToggle={() => handleToggle('push', 'newEvents')}
                />
              </div>
            </div>
          )}
        </div>

        {/* SMS Notifications */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">SMS Notifications</h2>
                  <p className="text-gray-400 text-xs">Text message alerts</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.sms.enabled}
                onToggle={() => handleToggleAll('sms', !settings.sms.enabled)}
              />
            </div>
          </div>

          {settings.sms.enabled && (
            <div className="divide-y divide-gray-800">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Event Reminders</p>
                    <p className="text-gray-400 text-xs">SMS before events</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.sms.eventReminders}
                  onToggle={() => handleToggle('sms', 'eventReminders')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Ticket className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Ticket Updates</p>
                    <p className="text-gray-400 text-xs">Critical ticket changes</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.sms.ticketUpdates}
                  onToggle={() => handleToggle('sms', 'ticketUpdates')}
                />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-white text-sm font-medium">Security Alerts</p>
                    <p className="text-gray-400 text-xs">Account security notifications</p>
                  </div>
                </div>
                <ToggleSwitch 
                  enabled={settings.sms.securityAlerts}
                  onToggle={() => handleToggle('sms', 'securityAlerts')}
                />
              </div>
            </div>
          )}

          <div className="p-4 bg-gray-800/50">
            <p className="text-gray-400 text-xs">
              Standard SMS rates may apply from your carrier
            </p>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className={`w-full py-4 rounded-xl font-semibold transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : saving
              ? 'bg-gray-700 text-gray-400'
              : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
          }`}
        >
          {saved ? (
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              <span>Settings Saved!</span>
            </div>
          ) : saving ? (
            'Saving Settings...'
          ) : (
            'Save Notification Settings'
          )}
        </button>
      </div>
    </div>
  );
}