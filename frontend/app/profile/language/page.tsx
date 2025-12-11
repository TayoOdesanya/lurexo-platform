'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft,
  Globe,
  Check,
  ChevronRight,
  DollarSign,
  Clock,
  Calendar,
  MapPin
} from 'lucide-react';

const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' }
];

const CURRENCIES = [
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' }
];

const TIMEZONES = [
  { value: 'Europe/London', label: 'London (GMT+0)', offset: '+0:00' },
  { value: 'Europe/Paris', label: 'Paris (GMT+1)', offset: '+1:00' },
  { value: 'Europe/Berlin', label: 'Berlin (GMT+1)', offset: '+1:00' },
  { value: 'America/New_York', label: 'New York (GMT-5)', offset: '-5:00' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (GMT-8)', offset: '-8:00' },
  { value: 'America/Chicago', label: 'Chicago (GMT-6)', offset: '-6:00' },
  { value: 'Asia/Tokyo', label: 'Tokyo (GMT+9)', offset: '+9:00' },
  { value: 'Asia/Dubai', label: 'Dubai (GMT+4)', offset: '+4:00' },
  { value: 'Australia/Sydney', label: 'Sydney (GMT+11)', offset: '+11:00' }
];

const DATE_FORMATS = [
  { value: 'DD/MM/YYYY', label: '24/10/2025', description: 'Day/Month/Year' },
  { value: 'MM/DD/YYYY', label: '10/24/2025', description: 'Month/Day/Year' },
  { value: 'YYYY-MM-DD', label: '2025-10-24', description: 'Year-Month-Day' },
  { value: 'DD MMM YYYY', label: '24 Oct 2025', description: 'Day Month Year' }
];

const TIME_FORMATS = [
  { value: '12h', label: '12-hour (2:30 PM)' },
  { value: '24h', label: '24-hour (14:30)' }
];

export default function LanguageRegionPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCurrency, setSelectedCurrency] = useState('GBP');
  const [selectedTimezone, setSelectedTimezone] = useState('Europe/London');
  const [selectedDateFormat, setSelectedDateFormat] = useState('DD/MM/YYYY');
  const [selectedTimeFormat, setSelectedTimeFormat] = useState('24h');
  const [region, setRegion] = useState('United Kingdom');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    
    // TODO: Implement actual API call
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }, 1000);
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
              <h1 className="text-white text-xl font-bold">Language & Region</h1>
              <p className="text-gray-400 text-xs">Customize your experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP ONLY: Simple page header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-white text-2xl font-bold">Language & Region</h1>
            <p className="text-gray-400 text-sm">Customize your experience</p>
        </div>
        </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Language Selection */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Language</h2>
                <p className="text-gray-400 text-xs">Choose your preferred language</p>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {LANGUAGES.map((language) => (
              <button
                key={language.code}
                onClick={() => setSelectedLanguage(language.code)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{language.code === 'en' ? '🇬🇧' : language.code === 'es' ? '🇪🇸' : language.code === 'fr' ? '🇫🇷' : language.code === 'de' ? '🇩🇪' : language.code === 'it' ? '🇮🇹' : language.code === 'pt' ? '🇵🇹' : language.code === 'nl' ? '🇳🇱' : language.code === 'pl' ? '🇵🇱' : language.code === 'ru' ? '🇷🇺' : language.code === 'ja' ? '🇯🇵' : language.code === 'ko' ? '🇰🇷' : '🇨🇳'}</span>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{language.name}</p>
                    <p className="text-gray-400 text-xs">{language.nativeName}</p>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <Check className="w-5 h-5 text-purple-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Region */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Region</h2>
              <p className="text-gray-400 text-xs">Your current region</p>
            </div>
          </div>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
          >
            <option>United Kingdom</option>
            <option>United States</option>
            <option>Canada</option>
            <option>Germany</option>
            <option>France</option>
            <option>Spain</option>
            <option>Italy</option>
            <option>Netherlands</option>
            <option>Australia</option>
            <option>Japan</option>
          </select>
        </div>

        {/* Currency */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Currency</h2>
                <p className="text-gray-400 text-xs">Prices will be shown in this currency</p>
              </div>
            </div>
          </div>

          <div>
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => setSelectedCurrency(currency.code)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition-colors border-b border-gray-800 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <span className="text-white text-xl font-bold w-8">{currency.symbol}</span>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">{currency.name}</p>
                    <p className="text-gray-400 text-xs">{currency.code}</p>
                  </div>
                </div>
                {selectedCurrency === currency.code && (
                  <Check className="w-5 h-5 text-green-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Timezone */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Timezone</h2>
              <p className="text-gray-400 text-xs">Event times will be shown in this timezone</p>
            </div>
          </div>

          <select
            value={selectedTimezone}
            onChange={(e) => setSelectedTimezone(e.target.value)}
            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time Format */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Date & Time Format</h2>
                <p className="text-gray-400 text-xs">How dates and times are displayed</p>
              </div>
            </div>
          </div>

          {/* Date Format */}
          <div className="p-6 border-b border-gray-800">
            <p className="text-white text-sm font-medium mb-3">Date Format</p>
            <div className="space-y-2">
              {DATE_FORMATS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedDateFormat(format.value)}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedDateFormat === format.value
                      ? 'bg-purple-500/20 border-2 border-purple-500'
                      : 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-white text-sm">{format.label}</p>
                    <p className="text-gray-400 text-xs">{format.description}</p>
                  </div>
                  {selectedDateFormat === format.value && (
                    <Check className="w-5 h-5 text-purple-500" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Time Format */}
          <div className="p-6">
            <p className="text-white text-sm font-medium mb-3">Time Format</p>
            <div className="space-y-2">
              {TIME_FORMATS.map((format) => (
                <button
                  key={format.value}
                  onClick={() => setSelectedTimeFormat(format.value)}
                  className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors ${
                    selectedTimeFormat === format.value
                      ? 'bg-purple-500/20 border-2 border-purple-500'
                      : 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  <p className="text-white text-sm">{format.label}</p>
                  {selectedTimeFormat === format.value && (
                    <Check className="w-5 h-5 text-purple-500" />
                  )}
                </button>
              ))}
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
              <span>Settings Saved!</span>
            </div>
          ) : saving ? (
            'Saving Settings...'
          ) : (
            'Save Language & Region Settings'
          )}
        </button>
      </div>
    </div>
  );
}