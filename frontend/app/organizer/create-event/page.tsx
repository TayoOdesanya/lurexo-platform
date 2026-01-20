'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Users,
  Ticket,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Upload,
  X,
  Loader2,
  Wand2,
  UserPlus,
  Plus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MapPin,
  Clock,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

// 🚀 DEV MODE TOGGLE - Set to true to bypass auth for testing
const DEV_MODE = true;

function getAccessTokenClient(): string | null {
  try {
    return localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingLongDescription, setIsGeneratingLongDescription] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newCustomType, setNewCustomType] = useState('');

  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ✅ Auth check (skipped in DEV_MODE)
  useEffect(() => {
    if (DEV_MODE) {
      console.log('🚀 DEV MODE: Authentication bypassed for frontend testing');
      setAccessToken('dev-mode-token');
      return;
    }

    const token = getAccessTokenClient();
    if (!token) {
      router.push('/organizer/login');
      return;
    }
    setAccessToken(token);
  }, [router]);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Event Details
    eventName: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    coverImage: null as File | null,
    coverImagePreview: '',

    // Step 2: Date & Location
    eventDate: '',
    eventTime: '',
    venue: '',
    address: '',
    city: '',
    postcode: '',

    // Step 3: Tickets
    ticketTiers: [
      { name: 'General Admission', price: '', quantity: '', description: '' }
    ],
    
    // Step 3: Guest List
    enableGuestList: false,
    maxGuestTickets: '',
    guestTicketPool: 'regular' as 'regular' | 'separate',
    separatePoolQuantity: '',
    guestTypes: ['Industry', 'VIP', 'Comp', 'Staff'] as string[],
    customGuestTypes: [] as string[],
    
    // Step 4: Publishing Options
    publishOption: 'now' as 'now' | 'scheduled',
    publishDate: '',
    publishTime: '',
    publishTimezone: 'Europe/London',

    // Settings
    status: 'DRAFT',
  });

  const steps = [
    { number: 1, name: 'Event Details', icon: Ticket },
    { number: 2, name: 'Date & Location', icon: Calendar },
    { number: 3, name: 'Tickets & Guests', icon: Users },
    { number: 4, name: 'Review & Publish', icon: Check },
  ];

  const categories = [
    { id: 'music', name: 'Music', emoji: '🎵' },
    { id: 'sports', name: 'Sports', emoji: '⚽' },
    { id: 'comedy', name: 'Comedy', emoji: '😂' },
    { id: 'theatre', name: 'Theatre', emoji: '🎭' },
    { id: 'business', name: 'Business', emoji: '💼' },
    { id: 'food', name: 'Food & Drink', emoji: '🍔' },
    { id: 'arts', name: 'Arts', emoji: '🎨' },
    { id: 'other', name: 'Other', emoji: '📅' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData((prev) => ({ ...prev, category: categoryId }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      coverImage: null,
      coverImagePreview: '',
    }));
  };

  const handleGuestTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      guestTypes: prev.guestTypes.includes(type)
        ? prev.guestTypes.filter(t => t !== type)
        : [...prev.guestTypes, type]
    }));
  };

  const handleAddCustomGuestType = () => {
    if (newCustomType.trim() && !formData.customGuestTypes.includes(newCustomType.trim())) {
      setFormData(prev => ({
        ...prev,
        customGuestTypes: [...prev.customGuestTypes, newCustomType.trim()]
      }));
      setNewCustomType('');
    }
  };

  const handleRemoveCustomGuestType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      customGuestTypes: prev.customGuestTypes.filter(t => t !== type)
    }));
  };

  // AI Generate Short Description
  const handleGenerateDescription = async () => {
    if (!formData.eventName || !formData.category) {
      alert('Please enter an event name and select a category first');
      return;
    }

    setIsGeneratingDescription(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedDescription = `Join us for an unforgettable ${formData.category} experience at ${formData.eventName}. This event promises to deliver exceptional entertainment and create lasting memories for all attendees.`;

    setFormData((prev) => ({ ...prev, shortDescription: generatedDescription }));
    setIsGeneratingDescription(false);
  };

  // AI Generate Long Description
  const handleGenerateLongDescription = async () => {
    if (!formData.eventName || !formData.category || !formData.shortDescription) {
      alert('Please fill in event name, category, and short description first');
      return;
    }

    setIsGeneratingLongDescription(true);
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const generatedLongDescription = `${formData.shortDescription}

About This Event:
${formData.eventName} is set to be one of the most anticipated ${formData.category} events of the year. We've carefully curated an experience that combines world-class performances with an intimate atmosphere.

What to Expect:
- Premium ${formData.category} entertainment
- State-of-the-art venue facilities
- Full bar and refreshments available
- Comfortable seating and excellent acoustics
- Easy access and parking

Whether you're a long-time fan or discovering something new, this event offers something special for everyone. Don't miss this opportunity to be part of an unforgettable experience.

Accessibility:
The venue is fully accessible with wheelchair access, accessible toilets, and assistance available upon request.`;

    setFormData((prev) => ({ ...prev, longDescription: generatedLongDescription }));
    setIsGeneratingLongDescription(false);
  };

  // AI Generate Event Poster
  const handleGeneratePoster = async () => {
    if (!formData.eventName || !formData.category) {
      alert('Please enter an event name and select a category first');
      return;
    }

    setIsGeneratingPoster(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const placeholderPoster = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=630&fit=crop';
    
    setFormData(prev => ({
      ...prev,
      coverImagePreview: placeholderPoster,
    }));

    setIsGeneratingPoster(false);
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  function validateBasics(): string | null {
    if (!formData.eventName.trim()) return 'Event name is required';
    if (!formData.category) return 'Category is required';
    if (!formData.shortDescription.trim()) return 'Short description is required';
    if (!formData.eventDate) return 'Event date is required';
    if (!formData.eventTime) return 'Event time is required';
    if (!formData.venue.trim()) return 'Venue is required';
    if (!formData.address.trim()) return 'Address is required';
    if (!formData.city.trim()) return 'City is required';
    if (!formData.postcode.trim()) return 'Postcode is required';
    
    const hasValidTier = formData.ticketTiers.some(t => t.name && t.price && t.quantity);
    if (!hasValidTier) return 'At least one complete ticket tier is required';
    
    return null;
  }

  const submitEvent = async (status: 'DRAFT' | 'PUBLISHED') => {
    // DEV MODE: Just simulate the API call
    if (DEV_MODE) {
      console.log('🚀 DEV MODE: Simulating event submission', { status, formData });
      await new Promise(resolve => setTimeout(resolve, 1500));
      return { success: true, eventId: 'dev-event-123' };
    }

    // PRODUCTION: Real API call
    if (!accessToken) throw new Error('Not signed in');

    const fd = new FormData();
    fd.append('eventName', formData.eventName);
    fd.append('category', formData.category);
    fd.append('shortDescription', formData.shortDescription);
    fd.append('longDescription', formData.longDescription);

    fd.append('eventDate', formData.eventDate);
    fd.append('eventTime', formData.eventTime);
    fd.append('venue', formData.venue);
    fd.append('address', formData.address);
    fd.append('city', formData.city);
    fd.append('postcode', formData.postcode);

    fd.append('status', status);

    if (formData.coverImage) {
      fd.append('coverImage', formData.coverImage);
    }

    const res = await fetch('/api/events/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: fd,
    });

    if (!res.ok) {
      const msg = (await res.json().catch(() => null))?.error ?? 'Failed to save event';
      throw new Error(msg);
    }

    return res.json();
  };

  const handleSaveDraft = async () => {
    try {
      setIsSaving(true);
      await submitEvent('DRAFT');
      alert('✅ Draft saved successfully!');
    } catch (e: any) {
      alert(e?.message ?? 'Failed to save draft');
      if (!DEV_MODE && String(e?.message ?? '').toLowerCase().includes('unauth')) {
        router.push('/organizer/login');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    const err = validateBasics();
    if (err) {
      alert(err);
      return;
    }

    try {
      setIsSaving(true);
      await submitEvent('PUBLISHED');
      
      if (DEV_MODE) {
        alert('✅ Event published successfully! (DEV MODE)');
        // Reset form in dev mode
        window.location.reload();
      } else {
        router.push('/organizer/dashboard?event=published');
      }
    } catch (e: any) {
      alert(e?.message ?? 'Failed to publish');
      if (!DEV_MODE && String(e?.message ?? '').toLowerCase().includes('unauth')) {
        router.push('/organizer/login');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Show loading while checking auth in production
  if (!DEV_MODE && !accessToken) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* DEV MODE BANNER */}
      {DEV_MODE && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-center text-sm font-semibold">
          🚀 DEV MODE ACTIVE - Authentication bypassed for frontend testing
        </div>
      )}

      {/* Top Bar - Progress & Actions */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-bold text-xl sm:text-2xl">Create New Event</h1>
              <p className="text-gray-400 text-sm">Step {currentStep} of 4</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
              >
                {isSaving ? 'Saving…' : 'Save Draft'}
              </button>
              <button 
                onClick={() => DEV_MODE ? window.location.reload() : router.push('/organizer/dashboard')} 
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Progress Bar */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStep(step.number)}
                    className="flex items-center gap-2 flex-1"
                  >
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors flex-1 ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : isCompleted
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      <span className="font-medium text-sm hidden sm:inline">{step.name}</span>
                      <span className="font-medium text-sm sm:hidden">{step.number}</span>
                    </div>
                  </button>
                  {index < steps.length - 1 && <div className="w-4 sm:w-8 h-0.5 bg-gray-800 mx-1"></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Step 1: Event Details */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Event Image Upload */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-white font-bold text-lg">Event Cover Image</h2>
                  <p className="text-gray-400 text-sm">Recommended: 1920x1080px (16:9 ratio)</p>
                </div>
                <button
                  onClick={handleGeneratePoster}
                  disabled={isGeneratingPoster}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                >
                  {isGeneratingPoster ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      AI Generate Poster
                    </>
                  )}
                </button>
              </div>

              {formData.coverImagePreview ? (
                <div className="relative group">
                  <img src={formData.coverImagePreview} alt="Event cover" className="w-full h-64 object-cover rounded-xl" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                    <label className="cursor-pointer px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <button onClick={handleRemoveImage} className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition-colors">
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-xl p-12 text-center transition-colors">
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
                    <p className="text-gray-400 text-sm">PNG, JPG up to 10MB</p>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}

              {isGeneratingPoster && (
                <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0 animate-pulse" />
                    <div>
                      <p className="text-purple-300 font-medium text-sm mb-1">AI Poster Generation</p>
                      <p className="text-purple-200/80 text-xs">Creating a unique artistic poster based on your event details. This may take a few moments...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Name */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <label className="block">
                <span className="text-white font-medium mb-2 block">Event Name *</span>
                <input
                  type="text"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Music Festival 2025"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </label>
            </div>

            {/* Category */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-medium mb-4">Category *</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === cat.id
                        ? 'bg-purple-600 border-purple-500 text-white'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-3xl mb-2">{cat.emoji}</div>
                    <div className="font-medium text-sm">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Short Description */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-white font-medium">Short Description *</label>
                  <p className="text-gray-400 text-sm">2-3 sentences that capture your event</p>
                </div>
                <button
                  onClick={handleGenerateDescription}
                  disabled={isGeneratingDescription}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                >
                  {isGeneratingDescription ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      AI Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="A brief overview of your event..."
                rows={3}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            {/* Long Description */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <label className="text-white font-medium">Long Description (Optional)</label>
                  <p className="text-gray-400 text-sm">Detailed information about your event</p>
                </div>
                <button
                  onClick={handleGenerateLongDescription}
                  disabled={isGeneratingLongDescription}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-medium transition-colors text-sm disabled:opacity-50"
                >
                  {isGeneratingLongDescription ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      AI Generate
                    </>
                  )}
                </button>
              </div>
              <textarea
                name="longDescription"
                value={formData.longDescription}
                onChange={handleInputChange}
                placeholder="Provide more detailed information about your event..."
                rows={8}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Date & Location */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-6">When & Where</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-white font-medium mb-2 block">Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Event Time *</label>
                  <input
                    type="time"
                    name="eventTime"
                    value={formData.eventTime}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="text-white font-medium mb-2 block">Venue Name *</label>
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  placeholder="e.g., The O2 Arena"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="mt-6">
                <label className="text-white font-medium mb-2 block">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Street address"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="text-white font-medium mb-2 block">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="e.g., London"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Postcode *</label>
                  <input
                    type="text"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="e.g., SW1A 1AA"
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Tickets & Guest List */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Ticket Tiers Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-lg">Ticket Tiers</h2>
                  <p className="text-gray-400 text-sm mt-1">Configure your ticket types and pricing</p>
                </div>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      ticketTiers: [
                        ...prev.ticketTiers,
                        { name: '', price: '', quantity: '', description: '' }
                      ]
                    }));
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Tier
                </button>
              </div>

              <div className="space-y-4">
                {formData.ticketTiers.map((tier, index) => (
                  <div
                    key={index}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-6 hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-white font-semibold">Tier {index + 1}</h3>
                      {formData.ticketTiers.length > 1 && (
                        <button
                          onClick={() => {
                            setFormData(prev => ({
                              ...prev,
                              ticketTiers: prev.ticketTiers.filter((_, i) => i !== index)
                            }));
                          }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="text-white font-medium mb-2 block text-sm">
                          Tier Name *
                        </label>
                        <input
                          type="text"
                          value={tier.name}
                          onChange={(e) => {
                            const newTiers = [...formData.ticketTiers];
                            newTiers[index].name = e.target.value;
                            setFormData(prev => ({ ...prev, ticketTiers: newTiers }));
                          }}
                          placeholder="e.g., General Admission"
                          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-white font-medium mb-2 block text-sm">
                          Price (£) *
                        </label>
                        <input
                          type="number"
                          value={tier.price}
                          onChange={(e) => {
                            const newTiers = [...formData.ticketTiers];
                            newTiers[index].price = e.target.value;
                            setFormData(prev => ({ ...prev, ticketTiers: newTiers }));
                          }}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                      </div>

                      <div>
                        <label className="text-white font-medium mb-2 block text-sm">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          value={tier.quantity}
                          onChange={(e) => {
                            const newTiers = [...formData.ticketTiers];
                            newTiers[index].quantity = e.target.value;
                            setFormData(prev => ({ ...prev, ticketTiers: newTiers }));
                          }}
                          placeholder="0"
                          min="0"
                          className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 block text-sm">
                        Description (Optional)
                      </label>
                      <textarea
                        value={tier.description}
                        onChange={(e) => {
                          const newTiers = [...formData.ticketTiers];
                          newTiers[index].description = e.target.value;
                          setFormData(prev => ({ ...prev, ticketTiers: newTiers }));
                        }}
                        placeholder="Brief description of what's included in this tier..."
                        rows={2}
                        className="w-full bg-gray-900 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* SIMPLIFIED TICKET SUMMARY */}
              <div className="mt-6 bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-300 text-sm">Total Capacity</p>
                    <p className="text-white font-bold text-xl mt-1">
                      {formData.ticketTiers.reduce((sum, tier) => sum + (parseInt(tier.quantity) || 0), 0).toLocaleString()} tickets
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-300 text-sm">Potential Revenue</p>
                    <p className="text-white font-bold text-xl mt-1">
                      £{formData.ticketTiers.reduce((sum, tier) => {
                        const price = parseFloat(tier.price) || 0;
                        const quantity = parseInt(tier.quantity) || 0;
                        return sum + (price * quantity);
                      }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <p className="text-purple-200/60 text-xs mt-3 text-center">
                  💰 See full revenue breakdown in Review & Publish step
                </p>
              </div>
            </div>

            {/* Guest List Section */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Guest List
                  </h2>
                  <p className="text-gray-400 text-sm mt-1">Manage complimentary tickets and guest access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enableGuestList}
                    onChange={(e) => setFormData(prev => ({ ...prev, enableGuestList: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {formData.enableGuestList && (
                <div className="space-y-6 pt-4 border-t border-gray-800">
                  {/* Guest Allocation */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-white font-medium mb-2 block text-sm">
                        Max Guest Tickets
                      </label>
                      <input
                        type="number"
                        name="maxGuestTickets"
                        value={formData.maxGuestTickets}
                        onChange={handleInputChange}
                        placeholder="e.g., 50"
                        min="0"
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                      <p className="text-gray-500 text-xs mt-1">Total number of guest tickets available</p>
                    </div>

                    <div>
                      <label className="text-white font-medium mb-2 block text-sm">
                        Ticket Pool
                      </label>
                      <select
                        value={formData.guestTicketPool}
                        onChange={(e) => setFormData(prev => ({ ...prev, guestTicketPool: e.target.value as any }))}
                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        <option value="regular">From Regular Inventory</option>
                        <option value="separate">Separate Guest Pool</option>
                      </select>
                      <p className="text-gray-500 text-xs mt-1">
                        {formData.guestTicketPool === 'regular' 
                          ? 'Guest tickets reduce available public tickets'
                          : 'Guest tickets from dedicated pool'}
                      </p>
                    </div>
                  </div>

                  {/* Guest Types */}
                  <div>
                    <label className="text-white font-medium mb-3 block text-sm">
                      Guest Categories
                    </label>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Industry', 'VIP', 'Comp', 'Staff'].map((type) => (
                          <button
                            key={type}
                            onClick={() => handleGuestTypeToggle(type)}
                            className={`px-4 py-3 rounded-xl font-medium text-sm transition-all ${
                              formData.guestTypes.includes(type)
                                ? 'bg-purple-600 text-white border-2 border-purple-500'
                                : 'bg-gray-800 text-gray-300 border-2 border-gray-700 hover:border-gray-600'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      {/* Custom Types */}
                      {formData.customGuestTypes.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.customGuestTypes.map((type) => (
                            <div
                              key={type}
                              className="flex items-center gap-2 px-3 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg text-sm"
                            >
                              <span>{type}</span>
                              <button
                                onClick={() => handleRemoveCustomGuestType(type)}
                                className="text-blue-400 hover:text-blue-300 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Custom */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newCustomType}
                          onChange={(e) => setNewCustomType(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddCustomGuestType()}
                          placeholder="Add custom category (e.g., Press, Sponsor)"
                          className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                        <button
                          onClick={handleAddCustomGuestType}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors text-sm flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review & Publish */}
        {currentStep === 4 && (
          <div className="space-y-6">
            {/* Validation Checklist */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-500/20 rounded-xl">
                  <Check className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">Pre-Publishing Checklist</h2>
                  <p className="text-purple-300 text-sm">Ensure all required information is complete</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Event Details */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${
                  formData.eventName && formData.category && formData.shortDescription
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  {formData.eventName && formData.category && formData.shortDescription ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">Event Details</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.eventName ? '✓' : '✗'} Event name • {formData.category ? '✓' : '✗'} Category • {formData.shortDescription ? '✓' : '✗'} Description
                    </p>
                  </div>
                </div>

                {/* Cover Image */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${
                  formData.coverImagePreview
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}>
                  {formData.coverImagePreview ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">Cover Image</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.coverImagePreview ? 'Image uploaded' : 'Recommended but optional'}
                    </p>
                  </div>
                </div>

                {/* Date & Venue */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${
                  formData.eventDate && formData.eventTime && formData.venue
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  {formData.eventDate && formData.eventTime && formData.venue ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">Date & Venue</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.eventDate ? '✓' : '✗'} Date • {formData.eventTime ? '✓' : '✗'} Time • {formData.venue ? '✓' : '✗'} Venue
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${
                  formData.address && formData.city && formData.postcode
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  {formData.address && formData.city && formData.postcode ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">Location</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.address ? '✓' : '✗'} Address • {formData.city ? '✓' : '✗'} City • {formData.postcode ? '✓' : '✗'} Postcode
                    </p>
                  </div>
                </div>

                {/* Ticket Tiers */}
                <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${
                  formData.ticketTiers.some(t => t.name && t.price && t.quantity)
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}>
                  {formData.ticketTiers.some(t => t.name && t.price && t.quantity) ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-white font-semibold text-sm">Ticket Tiers</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.ticketTiers.filter(t => t.name && t.price && t.quantity).length} tier(s) configured
                    </p>
                  </div>
                </div>

                {/* Guest List */}
                <div className="flex items-start gap-3 p-4 rounded-xl border-2 bg-blue-500/10 border-blue-500/30">
                  <Users className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-white font-semibold text-sm">Guest List</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {formData.enableGuestList ? `Enabled (${formData.maxGuestTickets || 0} tickets)` : 'Not enabled'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Overall Status */}
              {validateBasics() === null ? (
                <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="text-emerald-400 font-semibold">All Required Fields Complete!</p>
                      <p className="text-emerald-300/80 text-sm mt-1">Your event is ready to publish</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-6 h-6 text-rose-400" />
                    <div>
                      <p className="text-rose-400 font-semibold">Missing Required Information</p>
                      <p className="text-rose-300/80 text-sm mt-1">{validateBasics()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Event Preview */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-xl">Event Preview</h2>
                <span className="text-sm text-gray-400">How attendees will see your event</span>
              </div>

              <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
                {/* Preview Image */}
                {formData.coverImagePreview && (
                  <div className="relative h-64 bg-gray-900">
                    <img 
                      src={formData.coverImagePreview} 
                      alt="Event preview" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold">
                        {categories.find(c => c.id === formData.category)?.name || formData.category}
                      </span>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Event Name */}
                  <h3 className="text-white font-bold text-2xl mb-4">
                    {formData.eventName || 'Event Name'}
                  </h3>

                  {/* Short Description */}
                  {formData.shortDescription && (
                    <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                      {formData.shortDescription}
                    </p>
                  )}

                  {/* Date & Location Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-700">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs">Date & Time</p>
                        <p className="text-white font-medium">
                          {formData.eventDate ? new Date(formData.eventDate).toLocaleDateString('en-GB', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          }) : 'Not set'}
                        </p>
                        {formData.eventTime && (
                          <p className="text-gray-400 text-sm">{formData.eventTime}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-gray-500 text-xs">Venue</p>
                        <p className="text-white font-medium">{formData.venue || 'Not set'}</p>
                        {formData.city && (
                          <p className="text-gray-400 text-sm">
                            {formData.city}{formData.postcode && `, ${formData.postcode}`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Ticket Tiers Preview */}
                  {formData.ticketTiers.some(t => t.name && t.price) && (
                    <div>
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-purple-400" />
                        Tickets
                      </h4>
                      <div className="space-y-2">
                        {formData.ticketTiers
                          .filter(t => t.name && t.price)
                          .map((tier, index) => (
                            <div 
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-900 border border-gray-700 rounded-lg"
                            >
                              <div>
                                <p className="text-white font-medium">{tier.name}</p>
                                {tier.description && (
                                  <p className="text-gray-400 text-sm">{tier.description}</p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-purple-400 font-bold text-lg">
                                  £{parseFloat(tier.price).toFixed(2)}
                                </p>
                                {tier.quantity && (
                                  <p className="text-gray-500 text-xs">
                                    {tier.quantity} available
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* REVENUE BREAKDOWN - NEW SECTION */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <DollarSign className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-xl">Revenue Breakdown</h2>
                  <p className="text-gray-400 text-sm">Financial summary if all tickets sell</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Ticket Capacity & Gross Revenue */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Ticket className="w-5 h-5 text-purple-400" />
                      <p className="text-purple-300 text-sm font-medium">Total Ticket Capacity</p>
                    </div>
                    <p className="text-white font-bold text-3xl">
                      {formData.ticketTiers.reduce((sum, tier) => sum + (parseInt(tier.quantity) || 0), 0).toLocaleString()}
                    </p>
                    <p className="text-purple-200/60 text-xs mt-1">tickets available</p>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                      <p className="text-blue-300 text-sm font-medium">Gross Revenue</p>
                    </div>
                    <p className="text-white font-bold text-3xl">
                      £{formData.ticketTiers.reduce((sum, tier) => {
                        const price = parseFloat(tier.price) || 0;
                        const quantity = parseInt(tier.quantity) || 0;
                        return sum + (price * quantity);
                      }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-blue-200/60 text-xs mt-1">if all tickets sell</p>
                  </div>
                </div>

                {/* Platform Fee (You Pay) */}
                <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">💳</span>
                      <div>
                        <p className="text-orange-300 font-semibold">Platform Fee (8% - you pay)</p>
                        <p className="text-orange-200/60 text-xs mt-0.5">Deducted from your earnings</p>
                      </div>
                    </div>
                    <p className="text-orange-400 font-bold text-2xl">
                      -£{(formData.ticketTiers.reduce((sum, tier) => {
                        const price = parseFloat(tier.price) || 0;
                        const quantity = parseInt(tier.quantity) || 0;
                        return sum + (price * quantity);
                      }, 0) * 0.08).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                {/* Early Adopter Discount */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <p className="text-green-300 font-semibold text-sm mb-1">
                        Early Adopter Discount Available!
                      </p>
                      <p className="text-green-200/80 text-xs">
                        Launch special: Pay only 6% platform fee for your first 6 months (save 25%)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Your Net Earnings */}
                <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border-2 border-emerald-500/30 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                        <p className="text-emerald-300 font-bold text-lg">Your Net Earnings</p>
                      </div>
                      <p className="text-emerald-200/80 text-sm">After 8% platform fee</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-400 font-bold text-4xl">
                        £{(formData.ticketTiers.reduce((sum, tier) => {
                          const price = parseFloat(tier.price) || 0;
                          const quantity = parseInt(tier.quantity) || 0;
                          return sum + (price * quantity);
                        }, 0) * 0.92).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                      <p className="text-emerald-300/60 text-xs mt-1">you keep 92%</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-gray-900 px-3 text-xs text-gray-500">Additional Information</span>
                  </div>
                </div>

                {/* Transaction Fee (Fans Pay) */}
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">ℹ️</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-blue-300 font-semibold text-sm">
                          Transaction Fee (3% - fans pay)
                        </p>
                        <p className="text-blue-400 font-bold text-lg">
                          +£{(formData.ticketTiers.reduce((sum, tier) => {
                            const price = parseFloat(tier.price) || 0;
                            const quantity = parseInt(tier.quantity) || 0;
                            return sum + (price * quantity);
                          }, 0) * 0.03).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <p className="text-blue-200/80 text-xs">
                        Added to ticket price at checkout - does not affect your earnings
                      </p>
                    </div>
                  </div>
                </div>

                {/* Guest List Impact */}
                {formData.enableGuestList && formData.maxGuestTickets && parseInt(formData.maxGuestTickets) > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-amber-300 font-semibold text-sm mb-2">
                          Guest List Impact
                        </p>
                        <div className="space-y-1 text-xs text-amber-200">
                          <p>• {parseInt(formData.maxGuestTickets).toLocaleString()} complimentary tickets allocated</p>
                          {formData.guestTicketPool === 'regular' ? (
                            <>
                              <p className="text-amber-300 font-medium mt-2">
                                These tickets reduce your paid inventory
                              </p>
                              <div className="mt-3 pt-3 border-t border-amber-500/20">
                                <div className="flex items-center justify-between">
                                  <span className="text-amber-300 font-medium">Adjusted Net Earnings:</span>
                                  <span className="text-amber-400 font-bold text-lg">
                                    £{(() => {
                                      const totalTickets = formData.ticketTiers.reduce((sum, tier) => sum + (parseInt(tier.quantity) || 0), 0);
                                      const guestTickets = parseInt(formData.maxGuestTickets) || 0;
                                      const paidTickets = totalTickets - guestTickets;
                                      const totalRevenue = formData.ticketTiers.reduce((sum, tier) => {
                                        const price = parseFloat(tier.price) || 0;
                                        const quantity = parseInt(tier.quantity) || 0;
                                        return sum + (price * quantity);
                                      }, 0);
                                      const avgPrice = totalTickets > 0 ? totalRevenue / totalTickets : 0;
                                      return ((paidTickets * avgPrice) * 0.92).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                    })()}
                                  </span>
                                </div>
                                <p className="text-amber-200/60 text-xs mt-1">
                                  Based on {formData.ticketTiers.reduce((sum, tier) => sum + (parseInt(tier.quantity) || 0), 0) - (parseInt(formData.maxGuestTickets) || 0)} paid tickets
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className="text-amber-200/80 mt-2">
                              ✓ Using separate pool - does not affect paid ticket revenue
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Note */}
                <p className="text-gray-400 text-xs text-center pt-2">
                  Fee structure subject to change. Future updates will allow organizers to choose who pays fees.
                </p>
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h2 className="text-white font-bold text-xl mb-6">Publishing Options</h2>

              <div className="space-y-4">
                {/* Go Live Now */}
                <label className="block cursor-pointer">
                  <div className={`p-5 rounded-xl border-2 transition-all ${
                    formData.publishOption === 'now'
                      ? 'bg-purple-500/10 border-purple-500'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}>
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="publishOption"
                        value="now"
                        checked={formData.publishOption === 'now'}
                        onChange={(e) => setFormData(prev => ({ ...prev, publishOption: e.target.value as any }))}
                        className="mt-1 w-5 h-5 text-purple-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-purple-400" />
                          <h3 className="text-white font-bold">Go Live Now</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">
                          Your event will be published immediately after automated content screening
                        </p>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                          <p className="text-blue-300 text-xs font-medium mb-1">🔍 Automated Screening Process</p>
                          <p className="text-blue-200/80 text-xs">
                            Content will be automatically screened for inappropriate language and images. Clean events go live instantly; flagged events are reviewed by our team within 24 hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </label>

                {/* Schedule for Later */}
                <label className="block cursor-pointer">
                  <div className={`p-5 rounded-xl border-2 transition-all ${
                    formData.publishOption === 'scheduled'
                      ? 'bg-purple-500/10 border-purple-500'
                      : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}>
                    <div className="flex items-start gap-4">
                      <input
                        type="radio"
                        name="publishOption"
                        value="scheduled"
                        checked={formData.publishOption === 'scheduled'}
                        onChange={(e) => setFormData(prev => ({ ...prev, publishOption: e.target.value as any }))}
                        className="mt-1 w-5 h-5 text-purple-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-purple-400" />
                          <h3 className="text-white font-bold">Schedule for Later</h3>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">
                          Set a specific date and time for your event to go live
                        </p>

                        {formData.publishOption === 'scheduled' && (
                          <div className="space-y-4 pl-9">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="text-white font-medium mb-2 block text-sm">
                                  Publish Date
                                </label>
                                <input
                                  type="date"
                                  name="publishDate"
                                  value={formData.publishDate || ''}
                                  onChange={handleInputChange}
                                  min={new Date().toISOString().split('T')[0]}
                                  className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                              </div>

                              <div>
                                <label className="text-white font-medium mb-2 block text-sm">
                                  Publish Time
                                </label>
                                <input
                                  type="time"
                                  name="publishTime"
                                  value={formData.publishTime || ''}
                                  onChange={handleInputChange}
                                  className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="text-white font-medium mb-2 block text-sm">
                                Timezone
                              </label>
                              <select
                                name="publishTimezone"
                                value={formData.publishTimezone || 'Europe/London'}
                                onChange={handleInputChange}
                                className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                              >
                                <option value="Europe/London">London (GMT/BST)</option>
                                <option value="Europe/Paris">Paris (CET/CEST)</option>
                                <option value="America/New_York">New York (EST/EDT)</option>
                                <option value="America/Los_Angeles">Los Angeles (PST/PDT)</option>
                                <option value="Asia/Dubai">Dubai (GST)</option>
                                <option value="Asia/Tokyo">Tokyo (JST)</option>
                              </select>
                            </div>

                            {formData.publishDate && formData.publishTime && (
                              <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3">
                                <p className="text-purple-300 text-sm font-medium">
                                  📅 Event will go live: {new Date(`${formData.publishDate}T${formData.publishTime}`).toLocaleString('en-GB', {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Final Publish Button */}
            <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-2">Ready to Publish?</h3>
                  <p className="text-purple-200/80 text-sm mb-4">
                    {formData.publishOption === 'scheduled' 
                      ? 'Your event will be screened and scheduled to go live at the specified time. You can edit it anytime before publication.'
                      : 'Your event will undergo automated content screening. Clean events go live instantly, while flagged events are reviewed within 24 hours.'
                    }
                  </p>
                  
                  {validateBasics() !== null ? (
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-lg p-4">
                      <p className="text-rose-400 text-sm font-medium">
                        ⚠️ Please complete all required fields before publishing
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={handlePublish}
                      disabled={isSaving || validateBasics() !== null}
                      className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-bold text-lg transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          Publishing Event...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6" />
                          {formData.publishOption === 'scheduled' ? 'Schedule Event' : 'Publish Event Now'}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handleBack}
            disabled={currentStep === 1 || isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}