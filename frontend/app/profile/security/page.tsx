'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Key,
  Smartphone,
  Check,
  X,
  Download,
  Trash2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

export default function PrivacySecurityPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState('friends');
  const [activityStatus, setActivityStatus] = useState(true);
  const [saving, setSaving] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }

    setSaving(true);
    
    // TODO: Implement actual password change API
    setTimeout(() => {
      alert('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSaving(false);
    }, 1000);
  };

  const handleEnable2FA = () => {
    // TODO: Implement 2FA setup flow
    alert('Two-factor authentication setup coming soon!');
    setTwoFactorEnabled(true);
  };

  const handleDownloadData = () => {
    // TODO: Implement data export
    alert('Your data export will be emailed to you within 24 hours');
  };

  const handleDeleteAccount = () => {
    // TODO: Implement account deletion flow
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* MOBILE ONLY: Header with back button */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </Link>
          <div>
            <h1 className="text-white text-xl font-bold">Privacy & Security</h1>
            <p className="text-gray-400 text-xs">Manage your account security</p>
          </div>
        </div>
      </div>

      {/* DESKTOP ONLY: Simple page header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-white text-2xl font-bold">Security</h1>
            <p className="text-gray-400 text-sm">Update your password regularly</p>
        </div>
        </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Change Password Section */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Change Password</h2>
              <p className="text-gray-400 text-xs">Update your password regularly</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter current password"
                />
                <button
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Enter new password"
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-gray-500 text-xs mt-1">Must be at least 8 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-gray-800 text-white px-4 py-3 pr-12 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Confirm new password"
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleChangePassword}
              disabled={saving || !currentPassword || !newPassword || !confirmPassword}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
            >
              {saving ? 'Changing Password...' : 'Change Password'}
            </button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Two-Factor Authentication</h2>
                <p className="text-gray-400 text-xs">Add an extra layer of security</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              twoFactorEnabled 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-700 text-gray-400'
            }`}>
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          <p className="text-gray-300 text-sm mb-4">
            Protect your account with an additional verification code when signing in
          </p>

          <button
            onClick={handleEnable2FA}
            className={`w-full py-3 rounded-lg font-medium transition-colors ${
              twoFactorEnabled
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-green-600 hover:bg-green-500 text-white'
            }`}
          >
            {twoFactorEnabled ? 'Manage 2FA Settings' : 'Enable 2FA'}
          </button>
        </div>

        {/* Privacy Settings */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Privacy Settings</h2>
                <p className="text-gray-400 text-xs">Control who can see your information</p>
              </div>
            </div>
          </div>

          {/* Profile Visibility */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-white text-sm font-medium">Profile Visibility</p>
                <p className="text-gray-400 text-xs">Who can see your profile</p>
              </div>
            </div>
            <select
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
              className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
            >
              <option value="public">Everyone</option>
              <option value="friends">Friends Only</option>
              <option value="private">Only Me</option>
            </select>
          </div>

          {/* Activity Status */}
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Show Activity Status</p>
                <p className="text-gray-400 text-xs">Let others see when you're active</p>
              </div>
              <button
                onClick={() => setActivityStatus(!activityStatus)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  activityStatus ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  activityStatus ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Download className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Data Management</h2>
                <p className="text-gray-400 text-xs">Download or delete your data</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-800">
            <button
              onClick={handleDownloadData}
              className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Download Your Data</p>
                  <p className="text-gray-400 text-xs">Get a copy of your account data</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-6">
            <button
              onClick={handleDeleteAccount}
              className="w-full flex items-center justify-between p-4 bg-red-900/20 hover:bg-red-900/30 rounded-lg border border-red-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-400" />
                <div className="text-left">
                  <p className="text-red-400 text-sm font-medium">Delete Account</p>
                  <p className="text-red-400/70 text-xs">Permanently delete your account</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold text-sm mb-2">Security Tips</h3>
              <ul className="text-blue-300/80 text-xs space-y-1">
                <li>• Use a strong, unique password</li>
                <li>• Enable two-factor authentication</li>
                <li>• Never share your password with anyone</li>
                <li>• Review your account activity regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}