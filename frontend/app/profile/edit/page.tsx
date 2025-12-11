'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Camera,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Check
} from 'lucide-react';

// Mock user data
const INITIAL_USER_DATA = {
  id: 'user-123',
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+44 7700 900123',
  location: 'London, UK',
  bio: 'Music lover and event enthusiast 🎵',
  avatar: 'https://api.dicebear.com/7.x/big-smile/svg?seed=Alex',
  dateOfBirth: '1995-06-15',
  memberSince: '2024-01-15'
};

// Avatar style options
const AVATAR_STYLES = [
  { id: 'big-smile', name: 'Big Smile', emoji: '😊' },
  { id: 'fun-emoji', name: 'Fun Emoji', emoji: '🎨' },
  { id: 'notionists', name: 'Modern', emoji: '🙂' },
  { id: 'bottts', name: 'Robot', emoji: '🤖' },
  { id: 'lorelei', name: 'Character', emoji: '😄' },
  { id: 'pixel-art', name: 'Pixel Art', emoji: '👾' }
];

export default function EditProfilePage() {
  const [userData, setUserData] = useState(INITIAL_USER_DATA);
  const [selectedAvatarStyle, setSelectedAvatarStyle] = useState('big-smile');
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!userData.name || userData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!userData.email || !userData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }

    if (userData.phone && !userData.phone.match(/^\+?[\d\s-()]+$/)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    // TODO: Implement actual API call
    // await updateUserProfile(userData);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      
      // Reset saved state after 2 seconds
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
  };

  const handleAvatarStyleChange = (styleId) => {
    setSelectedAvatarStyle(styleId);
    const newAvatar = `https://api.dicebear.com/7.x/${styleId}/svg?seed=${userData.name}`;
    setUserData(prev => ({
      ...prev,
      avatar: newAvatar
    }));
  };

  return (
    <div className="min-h-screen bg-black pb-6">
      {/* MOBILE ONLY: Header with back button */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <Link href="/profile">
            <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </Link>
          <h1 className="text-white text-xl font-bold">Edit Profile</h1>
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
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </div>
            ) : saving ? (
              'Saving...'
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                <span>Save</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* DESKTOP ONLY: Simple page header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-white text-2xl font-bold">Edit Profile</h1>
            <p className="text-gray-400 text-sm">Update your personal information</p>
        </div>
        </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Avatar Section */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-semibold mb-4">Profile Picture</h2>
          
          <div className="flex flex-col items-center gap-4">
            {/* Avatar Display */}
            <div className="relative">
              <img 
                src={userData.avatar}
                alt={userData.name}
                className="w-32 h-32 rounded-full bg-white"
              />
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute bottom-0 right-0 w-10 h-10 bg-purple-600 hover:bg-purple-500 rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <Camera className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Avatar Style Picker */}
            {showAvatarPicker && (
              <div className="w-full bg-gray-800 rounded-xl p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white text-sm font-semibold">Choose Avatar Style</h3>
                  <button
                    onClick={() => setShowAvatarPicker(false)}
                    className="p-1 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  {AVATAR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => handleAvatarStyleChange(style.id)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedAvatarStyle === style.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700 hover:border-gray-600 bg-gray-900/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{style.emoji}</div>
                      <div className="text-white text-xs">{style.name}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => alert('Upload custom photo coming soon!')}
                  className="w-full mt-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Upload Custom Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-semibold mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                type="text"
                value={userData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full bg-gray-800 text-white px-4 py-3 rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:border-purple-500 transition-colors`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <input
                type="email"
                value={userData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full bg-gray-800 text-white px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:border-purple-500 transition-colors`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full bg-gray-800 text-white px-4 py-3 rounded-lg border ${
                  errors.phone ? 'border-red-500' : 'border-gray-700'
                } focus:outline-none focus:border-purple-500 transition-colors`}
                placeholder="+44 7700 900123"
              />
              {errors.phone && (
                <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </label>
              <input
                type="text"
                value={userData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="London, UK"
              />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-gray-400 text-sm mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </label>
              <input
                type="date"
                value={userData.dateOfBirth}
                onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Bio
              </label>
              <textarea
                value={userData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                placeholder="Tell us a bit about yourself..."
                rows={3}
                maxLength={150}
              />
              <p className="text-gray-500 text-xs mt-1 text-right">
                {userData.bio?.length || 0}/150
              </p>
            </div>
          </div>
        </div>

        {/* Member Since (Read-only) */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h2 className="text-white font-semibold mb-4">Account Information</h2>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">User ID</span>
              <span className="text-white text-sm font-mono">{userData.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Member Since</span>
              <span className="text-white text-sm">
                {new Date(userData.memberSince).toLocaleDateString('en-GB', {
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Save Button (Mobile) */}
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
              <span>Changes Saved!</span>
            </div>
          ) : saving ? (
            'Saving Changes...'
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
}