'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Music,
  Laugh,
  Palette,
  Trophy,
  Drama,
  Utensils,
  GraduationCap,
  Heart,
  MapPin,
  DollarSign,
  Check,
  Save,
  Bell,
  TrendingUp
} from 'lucide-react';

const EVENT_CATEGORIES = [
  { id: 'music', name: 'Music', icon: Music, color: 'purple' },
  { id: 'comedy', name: 'Comedy', icon: Laugh, color: 'orange' },
  { id: 'arts', name: 'Arts & Theatre', icon: Drama, color: 'pink' },
  { id: 'sports', name: 'Sports', icon: Trophy, color: 'blue' },
  { id: 'food', name: 'Food & Drink', icon: Utensils, color: 'green' },
  { id: 'education', name: 'Education', icon: GraduationCap, color: 'indigo' },
  { id: 'nightlife', name: 'Nightlife', icon: Music, color: 'red' },
  { id: 'family', name: 'Family', icon: Heart, color: 'yellow' }
];

const LOCATIONS = [
  'London, UK',
  'Manchester, UK',
  'Birmingham, UK',
  'Leeds, UK',
  'Liverpool, UK',
  'Bristol, UK',
  'Edinburgh, Scotland',
  'Glasgow, Scotland',
  'Cardiff, Wales',
  'Belfast, Northern Ireland'
];

const PRICE_RANGES = [
  { id: 'free', label: 'Free', min: 0, max: 0 },
  { id: 'budget', label: 'Budget (Under £20)', min: 0, max: 20 },
  { id: 'affordable', label: 'Affordable (£20-£50)', min: 20, max: 50 },
  { id: 'moderate', label: 'Moderate (£50-£100)', min: 50, max: 100 },
  { id: 'premium', label: 'Premium (£100+)', min: 100, max: 999999 }
];

export default function EventPreferencesPage() {
  const [selectedCategories, setSelectedCategories] = useState(['music', 'comedy', 'sports']);
  const [selectedLocations, setSelectedLocations] = useState(['London, UK']);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState(['affordable', 'moderate']);
  const [notifyNewEvents, setNotifyNewEvents] = useState(true);
  const [showTrending, setShowTrending] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggleCategory = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleToggleLocation = (location) => {
    setSelectedLocations(prev =>
      prev.includes(location)
        ? prev.filter(loc => loc !== location)
        : [...prev, location]
    );
  };

  const handleTogglePriceRange = (rangeId) => {
    setSelectedPriceRanges(prev =>
      prev.includes(rangeId)
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    
    // TODO: Implement actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getColorClass = (color, type = 'bg') => {
    const colors = {
      purple: type === 'bg' ? 'bg-purple-500/20 border-purple-500/30' : 'text-purple-400',
      orange: type === 'bg' ? 'bg-orange-500/20 border-orange-500/30' : 'text-orange-400',
      pink: type === 'bg' ? 'bg-pink-500/20 border-pink-500/30' : 'text-pink-400',
      blue: type === 'bg' ? 'bg-blue-500/20 border-blue-500/30' : 'text-blue-400',
      green: type === 'bg' ? 'bg-green-500/20 border-green-500/30' : 'text-green-400',
      indigo: type === 'bg' ? 'bg-indigo-500/20 border-indigo-500/30' : 'text-indigo-400',
      red: type === 'bg' ? 'bg-red-500/20 border-red-500/30' : 'text-red-400',
      yellow: type === 'bg' ? 'bg-yellow-500/20 border-yellow-500/30' : 'text-yellow-400'
    };
    return colors[color] || colors.purple;
  };

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
              <h1 className="text-white text-xl font-bold">Event Preferences</h1>
              <p className="text-gray-400 text-xs">Customize your event recommendations</p>
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
            <h1 className="text-white text-2xl font-bold">Event Preferences</h1>
            <p className="text-gray-400 text-sm">Customize your event recommendations</p>
        </div>
        </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Favorite Categories */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Favorite Categories</h2>
              <p className="text-gray-400 text-xs">Select the types of events you enjoy</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {EVENT_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategories.includes(category.id);

              return (
                <button
                  key={category.id}
                  onClick={() => handleToggleCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? `${getColorClass(category.color, 'bg')} border-${category.color}-500`
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-2 ${
                    isSelected ? getColorClass(category.color, 'text') : 'text-gray-400'
                  }`} />
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-gray-400'
                  }`}>
                    {category.name}
                  </p>
                  {isSelected && (
                    <Check className={`w-4 h-4 mt-1 ${getColorClass(category.color, 'text')}`} />
                  )}
                </button>
              );
            })}
          </div>

          <p className="text-gray-500 text-xs mt-4">
            {selectedCategories.length} {selectedCategories.length === 1 ? 'category' : 'categories'} selected
          </p>
        </div>

        {/* Preferred Locations */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Preferred Locations</h2>
              <p className="text-gray-400 text-xs">Where do you want to see events?</p>
            </div>
          </div>

          <div className="space-y-2">
            {LOCATIONS.map((location) => {
              const isSelected = selectedLocations.includes(location);

              return (
                <button
                  key={location}
                  onClick={() => handleToggleLocation(location)}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-500/20 border-2 border-blue-500/30'
                      : 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-blue-400' : 'text-gray-400'
                  }`}>
                    {location}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-blue-400" />}
                </button>
              );
            })}
          </div>

          <p className="text-gray-500 text-xs mt-4">
            Showing events in {selectedLocations.length} {selectedLocations.length === 1 ? 'location' : 'locations'}
          </p>
        </div>

        {/* Price Range */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Price Range</h2>
              <p className="text-gray-400 text-xs">What's your budget for tickets?</p>
            </div>
          </div>

          <div className="space-y-2">
            {PRICE_RANGES.map((range) => {
              const isSelected = selectedPriceRanges.includes(range.id);

              return (
                <button
                  key={range.id}
                  onClick={() => handleTogglePriceRange(range.id)}
                  className={`w-full p-4 rounded-lg flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-green-500/20 border-2 border-green-500/30'
                      : 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-green-400' : 'text-gray-400'
                  }`}>
                    {range.label}
                  </span>
                  {isSelected && <Check className="w-5 h-5 text-green-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Notifications</h2>
                <p className="text-gray-400 text-xs">Stay updated on relevant events</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Notify New Events */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">New Events</p>
                <p className="text-gray-400 text-xs">Get notified about new events in your categories</p>
              </div>
              <button
                onClick={() => setNotifyNewEvents(!notifyNewEvents)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  notifyNewEvents ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  notifyNewEvents ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Show Trending */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-sm font-medium">Trending Events</p>
                <p className="text-gray-400 text-xs">See popular events in your feed</p>
              </div>
              <button
                onClick={() => setShowTrending(!showTrending)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  showTrending ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  showTrending ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>
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
              <span>Preferences Saved!</span>
            </div>
          ) : saving ? (
            'Saving Preferences...'
          ) : (
            'Save Preferences'
          )}
        </button>

        {/* Info Box */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex gap-3">
            <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold text-sm mb-1">Personalized Recommendations</h3>
              <p className="text-blue-300/80 text-xs">
                Your preferences help us recommend events you'll love. Update them anytime to see better matches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}