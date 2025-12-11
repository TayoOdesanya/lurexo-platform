'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  MapPin,
  Music,
  Users,
  Ticket,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  Upload,
  Image as ImageIcon,
  X,
  Loader2,
  Wand2
} from 'lucide-react';

export default function CreateEventPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingLongDescription, setIsGeneratingLongDescription] = useState(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState(false);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategorySelect = (categoryId: string) => {
    setFormData(prev => ({ ...prev, category: categoryId }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        coverImage: file,
        coverImagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      coverImage: null,
      coverImagePreview: ''
    }));
  };

  // AI Generate Short Description
  const handleGenerateDescription = async () => {
    if (!formData.eventName || !formData.category) {
      alert('Please enter an event name and select a category first');
      return;
    }

    setIsGeneratingDescription(true);
    
    // Simulate AI generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const generatedDescription = `Join us for an unforgettable ${formData.category} experience at ${formData.eventName}. This event promises to deliver exceptional entertainment and create lasting memories for all attendees.`;
    
    setFormData(prev => ({ ...prev, shortDescription: generatedDescription }));
    setIsGeneratingDescription(false);
  };

  // AI Generate Long Description
  const handleGenerateLongDescription = async () => {
    if (!formData.eventName || !formData.category || !formData.shortDescription) {
      alert('Please fill in event name, category, and short description first');
      return;
    }

    setIsGeneratingLongDescription(true);
    
    // Simulate AI generation (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2500));
    
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
    
    setFormData(prev => ({ ...prev, longDescription: generatedLongDescription }));
    setIsGeneratingLongDescription(false);
  };

  // AI Generate Event Poster
  const handleGeneratePoster = async () => {
    if (!formData.eventName || !formData.category) {
      alert('Please enter an event name and select a category first');
      return;
    }

    setIsGeneratingPoster(true);
    
    // Simulate AI poster generation (replace with actual API call to DALL-E, Midjourney, etc.)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // For now, use a placeholder image
    // In production, this would call your AI image generation API
    const placeholderPoster = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&h=630&fit=crop';
    
    setFormData(prev => ({
      ...prev,
      coverImagePreview: placeholderPoster,
      // In production, you'd download the generated image and convert to File
    }));
    
    setIsGeneratingPoster(false);
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    // TODO: Save draft to backend
    alert('Draft saved!');
  };

  const handlePublish = () => {
    // TODO: Publish event
    router.push('/organizer/dashboard?event=published');
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Top Bar - Progress & Actions */}
      <div className="sticky top-0 z-30 bg-gray-900/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-white font-bold text-xl sm:text-2xl">Create New Event</h1>
              <p className="text-gray-400 text-sm">Step {currentStep} of 4</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors text-sm"
              >
                Save Draft
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
                      {isCompleted ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Icon className="w-4 h-4" />
                      )}
                      <span className="font-medium text-sm hidden sm:inline">{step.name}</span>
                      <span className="font-medium text-sm sm:hidden">{step.number}</span>
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-4 sm:w-8 h-0.5 bg-gray-800 mx-1"></div>
                  )}
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
                  <img
                    src={formData.coverImagePreview}
                    alt="Event cover"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-4">
                    <label className="cursor-pointer px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition-colors">
                      Change Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
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
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
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

        {/* Step 3: Tickets (Placeholder) */}
        {currentStep === 3 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">Ticket Tiers</h2>
            <p className="text-gray-400 mb-6">Configure your ticket types and pricing</p>
            {/* Add ticket tier configuration here */}
            <div className="text-center py-12">
              <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-500">Ticket configuration coming soon</p>
            </div>
          </div>
        )}

        {/* Step 4: Review (Placeholder) */}
        {currentStep === 4 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">Review & Publish</h2>
            <p className="text-gray-400 mb-6">Review your event details before publishing</p>
            {/* Add review/preview here */}
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
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </button>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold transition-colors"
            >
              <Check className="w-5 h-5" />
              Publish Event
            </button>
          )}
        </div>
      </div>
    </div>
  );
}