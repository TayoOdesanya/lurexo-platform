'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

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
} from 'lucide-react';
import { getApiBaseUrl } from "@/lib/apiBase";

const API_BASE_URL = getApiBaseUrl();


function getAccessTokenClient(): string | null {
  try {
    return localStorage.getItem('authToken') || localStorage.getItem('accessToken');
  } catch {
    return null;
  }
}

type TicketTierUi = {
  name: string;
  price: string; // keep as string for input; server parses to pence
  quantity: string; // keep as string for input
  description?: string;
  maxPerOrder?: string; // optional
};

function emptyTier(): TicketTierUi {
  return {
    name: '',
    price: '0',
    quantity: '1',
    description: '',
    maxPerOrder: '10',
  };
}

function toInt(v: unknown, fallback = 0) {
  const n = Number.parseInt(String(v ?? ''), 10);
  return Number.isFinite(n) ? n : fallback;
}

function toFloat(v: unknown, fallback = 0) {
  const n = Number.parseFloat(String(v ?? ''));
  return Number.isFinite(n) ? n : fallback;
}

export default function CreateEventPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventId = searchParams.get('eventId'); // null when creating
  const isEditMode = !!eventId;
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingLongDescription, setIsGeneratingLongDescription] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [accessToken, setAccessToken] = useState<string | null>(null);

  // ✅ required: must be logged in so backend can infer organiserId via /auth/me
useEffect(() => {
  const token = getAccessTokenClient();
  const target = eventId
    ? `/organizer/create-event?eventId=${encodeURIComponent(eventId)}`
    : '/organizer/create-event';

  if (!token) {
    router.push('/login?redirect=' + encodeURIComponent(target));
    return;
  }
  setAccessToken(token);
}, [router, eventId]);

useEffect(() => {
  if (!accessToken) return;
  if (!eventId) return;

  let cancelled = false;

  (async () => {
    try {
      const base =  API_BASE_URL;
      const res = await fetch(`${base}/events/${eventId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      });

      if (!res.ok) throw new Error('Failed to load event for editing');
      const e = await res.json();

      if (cancelled) return;

      // eventDate / time split
      const dt = e.eventDate ? new Date(e.eventDate) : null;
      const eventDate = dt ? dt.toISOString().slice(0, 10) : '';
      const eventTime = dt ? dt.toTimeString().slice(0, 5) : '';

      // map tiers (backend may return ticketTiers, or fallback)
      const tiersFromApi =
        Array.isArray(e.ticketTiers) && e.ticketTiers.length
          ? e.ticketTiers.map((t: any) => ({
              name: String(t?.name ?? ''),
              // assume pounds if already decimal; if pence then divide by 100
              price: String(Number(t?.price ?? 0) / 100),
              quantity: String(t?.quantity ?? 1),
              description: String(t?.description ?? ''),
              maxPerOrder: String(t?.maxPerOrder ?? '10'),
            }))
          : [
              {
                name: 'General Admission',
                price: String(e.ticketPrice ?? '0'),
                quantity: String(e.totalCapacity ?? e.capacity ?? '100'),
                description: '',
                maxPerOrder: '10',
              },
            ];

      const hero = e.heroImage ?? e.imageUrl ?? '';

      setFormData((prev) => ({
        ...prev,
        eventName: e.title ?? prev.eventName,
        category: e.category ?? prev.category,
        shortDescription: e.description ?? prev.shortDescription,
        longDescription: e.longDescription ?? prev.longDescription,

        // IMPORTANT: we can only set preview URL here, not the actual File
        coverImage: null,
        coverImagePreview: hero || prev.coverImagePreview,

        // date/location
        eventDate,
        eventTime,
        venue: e.venue ?? prev.venue,
        address: e.address ?? prev.address,
        city: e.city ?? prev.city,
        postcode: e.postalCode ?? e.postcode ?? prev.postcode,

        // tickets
        ticketTiers: tiersFromApi,
        totalCapacity: String(e.totalCapacity ?? e.capacity ?? prev.totalCapacity),

        status: (e.status ?? prev.status) as any,
      }));
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to load event');
    }
  })();

  return () => {
    cancelled = true;
  };
}, [accessToken, eventId]);


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
      { name: 'General Admission', price: '0', quantity: '100', description: '', maxPerOrder: '10' } as TicketTierUi,
    ],
    totalCapacity: '100',

    // Step 4: Settings
    status: 'DRAFT',
  });

  const steps = [
    { number: 1, name: 'Event Details', icon: Ticket },
    { number: 2, name: 'Date & Location', icon: Calendar },
    { number: 3, name: 'Tickets', icon: Users },
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
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

  // AI Generate Short Description
  const handleGenerateDescription = async () => {
    if (!formData.eventName || !formData.category) {
      alert('Please enter an event name and select a category first');
      return;
    }

    setIsGeneratingDescription(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

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
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const generatedLongDescription = `${formData.shortDescription}

About This Event:
${formData.eventName} is set to be one of the most anticipated ${formData.category} events of the year. We've carefully curated an experience that combines world-class performances with an intimate atmosphere.

What to Expect:
• Premium ${formData.category} entertainment
• State-of-the-art venue facilities
• Full bar and refreshments available
• Comfortable seating and excellent acoustics
• Easy access and parking

Whether you're a long-time fan or discovering something new, this event offers something special for everyone. Don't miss this opportunity to be part of an unforgettable experience.

Accessibility:
The venue is fully accessible with wheelchair access, accessible toilets, and assistance available upon request.`;

    setFormData((prev) => ({ ...prev, longDescription: generatedLongDescription }));
    setIsGeneratingLongDescription(false);
  };

  // AI Generate Event Poster (preview only)
  const handleGeneratePoster = async () => {
    if (!formData.eventName || !formData.category) {
      alert('Please enter an event name and select a category first');
      return;
    }

    setIsGeneratingPoster(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const placeholderPoster =
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=630&fit=crop';

    setFormData((prev) => ({
      ...prev,
      coverImagePreview: placeholderPoster,
      // NOTE: this does not set coverImage; only uploaded files will be saved to /public/events/<userId>/...
    }));

    setIsGeneratingPoster(false);
  };

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  // ✅ Stronger validation (capacity + tiers)
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

    const totalCapacity = toInt(formData.totalCapacity, 0);
    if (!Number.isFinite(totalCapacity) || totalCapacity < 1) return 'Total capacity must be at least 1';

    const tiers = Array.isArray(formData.ticketTiers) ? formData.ticketTiers : [];
    if (tiers.length === 0) return 'Add at least one ticket tier';

    let tiersTotal = 0;

    for (let i = 0; i < tiers.length; i++) {
      const t = tiers[i];
      const label = `Tier ${i + 1}`;

      const name = String(t?.name ?? '').trim();
      const qty = toInt(t?.quantity, NaN as any);
      const price = toFloat(t?.price, NaN as any);

      if (!name) return `${label}: name is required`;
      if (!Number.isFinite(qty) || qty < 1) return `${label}: quantity must be at least 1`;
      if (!Number.isFinite(price) || price < 0) return `${label}: price must be 0 or more`;

      tiersTotal += qty;
    }

    if (tiersTotal > totalCapacity) {
      return `Total tier quantity (${tiersTotal}) exceeds capacity (${totalCapacity})`;
    }

    return null;
  }

  /**
   * ✅ Required change:
   * Save draft/publish via Next.js route `/api/events/create`
   * Server route infers organiserId from Bearer token via NestJS `/auth/me`
   * Server route saves image to: /public/events/<userId>/...
   */
  const submitEvent = async (status: 'DRAFT' | 'PUBLISHED') => {
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
    fd.append('totalCapacity', formData.totalCapacity);
    fd.append('ticketTiers', JSON.stringify(formData.ticketTiers ?? []));

    if (formData.coverImage) {
      // The backend will upload this to Azure Blob Storage
      fd.append('coverImage', formData.coverImage, formData.coverImage.name);
    }

const url = eventId ? `/api/events/${eventId}` : '/api/events/create';
const method = eventId ? 'PUT' : 'POST';

const res = await fetch(url, {
  method,
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  body: fd,
});


    if (!res.ok) {
      const msg =
        (await res.json().catch(() => null))?.error ??
        (await res.text().catch(() => '')) ??
        'Failed to save event';
      throw new Error(msg);
    }

    return res.json();
  };

  const handleSaveDraft = async () => {
    const err = validateBasics();
    if (err) {
      alert(err);
      return;
    }

    try {
      setIsSaving(true);
      await submitEvent('DRAFT');
      alert('Draft saved!');
    } catch (e: any) {
      alert(e?.message ?? 'Failed to save draft');
      if (String(e?.message ?? '').toLowerCase().includes('unauth')) {
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
      router.push('/organizer/dashboard?event=published');
    } catch (e: any) {
      alert(e?.message ?? 'Failed to publish');
      if (String(e?.message ?? '').toLowerCase().includes('unauth')) {
        router.push('/organizer/login');
      }
    } finally {
      setIsSaving(false);
    }
  };

  // ----- Step 3 tier editor helpers -----
  const tiers = useMemo(
    () => (Array.isArray(formData.ticketTiers) ? formData.ticketTiers : []),
    [formData.ticketTiers],
  );

  const capacity = useMemo(() => toInt(formData.totalCapacity, 0), [formData.totalCapacity]);
  const tiersTotal = useMemo(
    () => tiers.reduce((sum, t) => sum + Math.max(0, toInt(t.quantity, 0)), 0),
    [tiers],
  );
  const overCapacity = capacity > 0 && tiersTotal > capacity;

  const updateTier = (index: number, patch: Partial<TicketTierUi>) => {
    setFormData((prev) => {
      const next = [...(Array.isArray(prev.ticketTiers) ? prev.ticketTiers : [])];
      const current = next[index] ?? emptyTier();
      next[index] = { ...current, ...patch };
      return { ...prev, ticketTiers: next };
    });
  };

  const addTier = () => {
    setFormData((prev) => ({
      ...prev,
      ticketTiers: [...(Array.isArray(prev.ticketTiers) ? prev.ticketTiers : []), emptyTier()],
    }));
  };

  const removeTier = (index: number) => {
    setFormData((prev) => {
      const next = [...(Array.isArray(prev.ticketTiers) ? prev.ticketTiers : [])];
      next.splice(index, 1);
      return { ...prev, ticketTiers: next };
    });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar - Progress & Actions */}
      <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
<h1 className="text-white font-bold text-xl sm:text-2xl">
  {isEditMode ? 'Edit Event' : 'Create New Event'}
</h1>
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
                onClick={() => router.push('/organizer/dashboard')}
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
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors flex-1 ${
                        isActive
                          ? 'bg-purple-600 text-white'
                          : isCompleted
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-800 text-gray-400'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                      <span className="font-medium text-sm hidden sm:inline">{step.name}</span>
                      <span className="font-medium text-sm sm:hidden">{step.number}</span>
                    </div>
                  </div>
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.coverImagePreview}
                    alt="Event cover"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                    <label className="cursor-pointer px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Change Image
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    <button
                      onClick={handleRemoveImage}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-500 transition-colors"
                    >
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
                      <p className="text-purple-200/80 text-xs">
                        Creating a unique artistic poster based on your event details. This may take a few moments...
                      </p>
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

        {/* Step 3: Tickets (Tier Editor) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            {/* Capacity */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <div>
                <h2 className="text-white font-bold text-lg mb-1">Capacity</h2>
                <p className="text-gray-400 text-sm">Required. Total number of tickets available for the event.</p>
              </div>

              <label className="block">
                <span className="text-white font-medium mb-2 block">Total Capacity *</span>
                <input
                  type="number"
                  name="totalCapacity"
                  min={1}
                  value={formData.totalCapacity}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="e.g., 250"
                  required
                />
              </label>

              <div className="text-sm">
                <span className="text-gray-400">Tiers total:</span>{' '}
                <span className={overCapacity ? 'text-red-400 font-semibold' : 'text-white font-semibold'}>
                  {tiersTotal} / {capacity || 0}
                </span>
              </div>

              {overCapacity && (
                <div className="p-3 rounded-xl border border-red-500/30 bg-red-500/10 text-sm text-red-200">
                  Total tier quantity ({tiersTotal}) exceeds capacity ({capacity}). Reduce quantities or increase
                  capacity.
                </div>
              )}
            </div>

            {/* Tier Editor */}
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg">Ticket Tiers</h2>
                  <p className="text-gray-400 text-sm">Create one or more tiers (e.g. Early Bird, General Admission).</p>
                </div>

                <button
                  type="button"
                  onClick={addTier}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  + Add tier
                </button>
              </div>

              {tiers.length === 0 ? (
                <div className="p-4 rounded-xl border border-gray-800 bg-gray-950/30 text-gray-400 text-sm">
                  No tiers yet. Add at least one tier to sell tickets.
                </div>
              ) : (
                <div className="space-y-3">
                  {tiers.map((tier, idx) => {
                    const nameOk = String(tier.name ?? '').trim().length > 0;
                    const qty = toInt(tier.quantity, 0);
                    const qtyOk = qty >= 1;
                    const price = toFloat(tier.price, -1);
                    const priceOk = price >= 0;

                    return (
                      <div key={idx} className="p-4 rounded-2xl border border-gray-800 bg-gray-950/20 space-y-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-white font-semibold">Tier {idx + 1}</div>
                            <div className="text-xs text-gray-400">Configure pricing and quantity</div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeTier(idx)}
                            className="px-3 py-2 rounded-lg border border-red-500/40 text-red-300 hover:bg-red-500/10 transition-colors text-sm"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-white">Name *</label>
                            <input
                              value={tier.name}
                              onChange={(e) => updateTier(idx, { name: e.target.value })}
                              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="e.g., General Admission"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-white">Price (£) *</label>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={tier.price}
                              onChange={(e) => updateTier(idx, { price: e.target.value })}
                              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-white">Quantity *</label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={tier.quantity}
                              onChange={(e) => updateTier(idx, { quantity: e.target.value })}
                              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-sm font-medium text-white">Description (optional)</label>
                            <input
                              value={tier.description ?? ''}
                              onChange={(e) => updateTier(idx, { description: e.target.value })}
                              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="e.g., Standing entry, doors 7pm"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-sm font-medium text-white">Max per order (optional)</label>
                            <input
                              type="number"
                              min="1"
                              step="1"
                              value={tier.maxPerOrder ?? ''}
                              onChange={(e) => updateTier(idx, { maxPerOrder: e.target.value })}
                              className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                              placeholder="10"
                            />
                          </div>
                        </div>

                        <div className="text-sm space-y-1">
                          {!nameOk && <div className="text-red-300">Name is required.</div>}
                          {!qtyOk && <div className="text-red-300">Quantity must be at least 1.</div>}
                          {!priceOk && <div className="text-red-300">Price must be 0 or more.</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Review (Placeholder) */}
        {currentStep === 4 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">Review & Publish</h2>
            <p className="text-gray-400 mb-6">Review your event details before publishing</p>
            <div className="text-center py-12">
              <Check className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">Review page coming soon</p>
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
          ) : (
            <button
              onClick={handlePublish}
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Publish Event
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
