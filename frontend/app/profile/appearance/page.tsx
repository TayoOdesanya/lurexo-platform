'use client';

import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Palette,
  Type,
  Eye,
  Check,
  Save,
  Sparkles,
  Zap
} from 'lucide-react';

const THEMES = [
  {
    id: 'dark',
    name: 'Dark',
    icon: Moon,
    description: 'Easy on the eyes',
    preview: 'bg-gradient-to-br from-gray-900 to-black'
  },
  {
    id: 'light',
    name: 'Light',
    icon: Sun,
    description: 'Clean and bright',
    preview: 'bg-gradient-to-br from-gray-100 to-white'
  },
  {
    id: 'auto',
    name: 'Auto',
    icon: Monitor,
    description: 'Follows system',
    preview: 'bg-gradient-to-br from-gray-600 to-gray-400'
  }
];

const ACCENT_COLORS = [
  { id: 'purple', name: 'Purple', color: '#9333ea', gradient: 'from-purple-600 to-blue-600' },
  { id: 'blue', name: 'Blue', color: '#3b82f6', gradient: 'from-blue-600 to-cyan-600' },
  { id: 'green', name: 'Green', color: '#10b981', gradient: 'from-green-600 to-emerald-600' },
  { id: 'orange', name: 'Orange', color: '#f97316', gradient: 'from-orange-600 to-red-600' },
  { id: 'pink', name: 'Pink', color: '#ec4899', gradient: 'from-pink-600 to-rose-600' },
  { id: 'red', name: 'Red', color: '#ef4444', gradient: 'from-red-600 to-orange-600' }
];

const FONT_SIZES = [
  { id: 'small', name: 'Small', description: 'Compact view', size: 'text-sm' },
  { id: 'medium', name: 'Medium', description: 'Default size', size: 'text-base' },
  { id: 'large', name: 'Large', description: 'Easy to read', size: 'text-lg' }
];

export default function AppearancePage() {
  const router = useRouter();
  const { theme, setTheme: setGlobalTheme, isDarkMode } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedAccent, setSelectedAccent] = useState('purple');
  const [selectedFontSize, setSelectedFontSize] = useState('medium');
  const [showAnimations, setShowAnimations] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [compactMode, setCompactMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Theme classes
  const bg = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const bgCard = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const bgSecondary = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
  const text = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSecondary = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const border = isDarkMode ? 'border-gray-800' : 'border-gray-200';


  const handleSave = async () => {
  setSaving(true);
  
  // Apply the selected theme globally
  setGlobalTheme(selectedTheme);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  setSaving(false);
  setSaved(true);
  setTimeout(() => setSaved(false), 2000);
};

  return (
    <div className={`${bgCard} rounded-2xl p-6 border ${border}`}>
      {/* MOBILE ONLY: Header with back button */}
        <div className="lg:hidden bg-gray-900 border-b border-gray-800 p-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/profile">
              <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            </Link>
            <div>
              <h1 className="text-white text-xl font-bold">Appearance</h1>
              <p className="text-gray-400 text-xs">Customize how Lurexo looks</p>
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

        {/* DESKTOP ONLY: Simple page header */}{/* DESKTOP ONLY: Simple page header */}
        <div className="hidden lg:block bg-gray-900 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-8">
            <h1 className="text-white text-2xl font-bold">Appearance</h1>
            <p className="text-gray-400 text-sm">Customize how Lurexo looks</p>
        </div>
        </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Theme Selection */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Moon className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Theme</h2>
              <p className="text-gray-400 text-xs">Choose your preferred theme</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((theme) => {
              const Icon = theme.icon;
              const isSelected = selectedTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id as 'auto' | 'light' | 'dark')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                  }`}
                >
                  <div className={`w-full h-20 ${theme.preview} rounded-lg mb-3 border border-gray-700`} />
                  <Icon className={`w-5 h-5 mb-1 mx-auto ${
                    isSelected ? 'text-purple-400' : 'text-gray-400'
                  }`} />
                  <p className={`text-xs font-medium ${
                    isSelected ? 'text-white' : 'text-gray-400'
                  }`}>
                    {theme.name}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    {theme.description}
                  </p>
                  {isSelected && (
                    <Check className="w-4 h-4 text-purple-400 mx-auto mt-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <Palette className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Accent Color</h2>
              <p className="text-gray-400 text-xs">Customize your brand color</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {ACCENT_COLORS.map((color) => {
              const isSelected = selectedAccent === color.id;

              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedAccent(color.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-white'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div 
                    className={`w-full h-16 bg-gradient-to-br ${color.gradient} rounded-lg mb-2`}
                  />
                  <p className={`text-xs font-medium ${
                    isSelected ? 'text-white' : 'text-gray-400'
                  }`}>
                    {color.name}
                  </p>
                  {isSelected && (
                    <Check className="w-4 h-4 text-white mx-auto mt-1" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-400 text-xs mb-2">Preview:</p>
            <button className={`w-full bg-gradient-to-r ${ACCENT_COLORS.find(c => c.id === selectedAccent)?.gradient} text-white py-3 rounded-lg font-semibold`}>
              Buy Tickets
            </button>
          </div>
        </div>

        {/* Font Size */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Type className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-white font-semibold">Font Size</h2>
              <p className="text-gray-400 text-xs">Adjust text size for readability</p>
            </div>
          </div>

          <div className="space-y-2">
            {FONT_SIZES.map((fontSize) => {
              const isSelected = selectedFontSize === fontSize.id;

              return (
                <button
                  key={fontSize.id}
                  onClick={() => setSelectedFontSize(fontSize.id)}
                  className={`w-full p-4 rounded-lg flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-500/20 border-2 border-blue-500/30'
                      : 'bg-gray-800 border-2 border-transparent hover:border-gray-700'
                  }`}
                >
                  <div>
                    <p className={`font-medium ${fontSize.size} ${
                      isSelected ? 'text-blue-400' : 'text-gray-400'
                    }`}>
                      {fontSize.name}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {fontSize.description}
                    </p>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-blue-400" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Display Options */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Eye className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-white font-semibold">Display Options</h2>
                <p className="text-gray-400 text-xs">Fine-tune your experience</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Animations */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white text-sm font-medium">Animations</p>
                  <p className="text-gray-400 text-xs">Smooth transitions and effects</p>
                </div>
              </div>
              <button
                onClick={() => setShowAnimations(!showAnimations)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  showAnimations ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  showAnimations ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white text-sm font-medium">High Contrast</p>
                  <p className="text-gray-400 text-xs">Increase text and UI contrast</p>
                </div>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  highContrast ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  highContrast ? 'translate-x-7' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-white text-sm font-medium">Compact Mode</p>
                  <p className="text-gray-400 text-xs">Show more content at once</p>
                </div>
              </div>
              <button
                onClick={() => setCompactMode(!compactMode)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  compactMode ? 'bg-purple-600' : 'bg-gray-700'
                }`}
              >
                <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform ${
                  compactMode ? 'translate-x-7' : 'translate-x-0'
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
              <span>Appearance Saved!</span>
            </div>
          ) : saving ? (
            'Applying Changes...'
          ) : (
            'Apply Changes'
          )}
        </button>

        {/* Preview Section */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <h3 className="text-white font-semibold mb-4">Preview</h3>
          
          {/* Sample Event Card */}
          <div className="bg-gray-800 rounded-xl overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-purple-600 to-blue-600" />
            <div className="p-4">
              <h4 className={`text-white font-bold mb-1 ${FONT_SIZES.find(f => f.id === selectedFontSize)?.size}`}>
                Sample Event Title
              </h4>
              <p className="text-gray-400 text-xs mb-2">Sat 15 Aug • 7:00 PM</p>
              <button className={`w-full bg-gradient-to-r ${ACCENT_COLORS.find(c => c.id === selectedAccent)?.gradient} text-white py-2 rounded-lg text-sm font-medium`}>
                Buy Tickets
              </button>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <div className="flex gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-blue-400 font-semibold text-sm mb-1">Appearance Tips</h3>
              <p className="text-blue-300/80 text-xs">
                Changes apply instantly. Dark theme can help reduce eye strain in low light. Try different accent colors to match your style!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}