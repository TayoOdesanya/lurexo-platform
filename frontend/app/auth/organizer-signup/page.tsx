'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Music,
  Building2,
  Users,
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Upload,
  Sparkles,
  AlertCircle,
  Globe,
  Instagram,
  Twitter,
  MapPin,
  X,
} from 'lucide-react';

type AccountType = 'artist' | 'organizer' | 'both' | null;

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState<AccountType>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    // Account credentials
    email: '',
    password: '',
    confirmPassword: '',
    
    // Artist profile (optional customization)
    artistName: '',
    artistUsername: '',
    artistGenre: [] as string[],
    artistBio: '',
    artistProfilePicture: null as File | null,
    artistProfilePicturePreview: '',
    
    // Organizer profile (optional customization)
    organizationName: '',
    organizationUsername: '',
    organizationType: 'venue' as 'venue' | 'promoter' | 'festival' | 'label' | 'other',
    organizationBio: '',
    organizationCity: '',
    organizationCountry: 'GB',
    organizationWebsite: '',
    organizationProfilePicture: null as File | null,
    organizationProfilePicturePreview: '',
    
    // Social links (optional)
    instagram: '',
    twitter: '',
    spotify: '',
    website: '',
    
    // Agreements
    agreeToTerms: false,
    agreeToMarketing: false,
  });

  const genres = [
    'Rock', 'Pop', 'Hip Hop', 'Electronic', 'Jazz', 'Classical',
    'Country', 'R&B', 'Reggae', 'Metal', 'Indie', 'Folk'
  ];

  const countries = [
    { code: 'GB', name: 'United Kingdom' },
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'IE', name: 'Ireland' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'ES', name: 'Spain' },
    { code: 'IT', name: 'Italy' },
    { code: 'NL', name: 'Netherlands' },
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
    
    // Auto-generate username from name
    if (field === 'artistName' && value) {
      const username = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, artistUsername: username }));
    }
    if (field === 'organizationName' && value) {
      const username = value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, organizationUsername: username }));
    }
  };

  const handleImageUpload = (field: 'artistProfilePicture' | 'organizationProfilePicture', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewField = field === 'artistProfilePicture' ? 'artistProfilePicturePreview' : 'organizationProfilePicturePreview';
      setFormData(prev => ({
        ...prev,
        [field]: file,
        [previewField]: URL.createObjectURL(file)
      }));
    }
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      artistGenre: prev.artistGenre.includes(genre)
        ? prev.artistGenre.filter(g => g !== genre)
        : [...prev.artistGenre, genre]
    }));
  };

  const validateStep2Artist = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.artistName.trim()) {
      newErrors.artistName = 'Artist/Band name is required';
    }
    
    if (!formData.artistUsername.trim()) {
      newErrors.artistUsername = 'Username is required';
    } else if (formData.artistUsername.length < 3) {
      newErrors.artistUsername = 'Username must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2Organizer = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required';
    }
    
    if (!formData.organizationUsername.trim()) {
      newErrors.organizationUsername = 'Username is required';
    } else if (formData.organizationUsername.length < 3) {
      newErrors.organizationUsername = 'Username must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && accountType) {
      setStep(2);
    } else if (step === 2) {
      let valid = false;
      if (accountType === 'artist') {
        valid = validateStep2Artist();
      } else if (accountType === 'organizer') {
        valid = validateStep2Organizer();
      } else if (accountType === 'both') {
        valid = validateStep2Artist() && validateStep2Organizer();
      }
      
      if (valid) {
        setStep(3);
      }
    } else if (step === 3) {
      if (validateStep3()) {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: Implement actual API call
      console.log('Submitting signup:', {
        accountType,
        email: formData.email,
        artist: accountType === 'artist' || accountType === 'both' ? {
          name: formData.artistName,
          username: formData.artistUsername,
          genre: formData.artistGenre,
          bio: formData.artistBio,
        } : undefined,
        organizer: accountType === 'organizer' || accountType === 'both' ? {
          name: formData.organizationName,
          username: formData.organizationUsername,
          type: formData.organizationType,
          bio: formData.organizationBio,
          city: formData.organizationCity,
          country: formData.organizationCountry,
        } : undefined,
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - move to step 4
      setStep(4);
      
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl font-bold">L</span>
            </div>
            <span className="text-white font-bold text-2xl">Lurexo</span>
          </Link>
          {step < 4 && (
            <>
              <h1 className="text-white font-bold text-3xl mb-2">Create Your Account</h1>
              <p className="text-gray-400">Join the future of event ticketing</p>
            </>
          )}
        </div>

        {/* Progress Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step === s
                      ? 'bg-purple-600 text-white'
                      : step > s
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {step > s ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 sm:w-24 h-0.5 ${step > s ? 'bg-green-600' : 'bg-gray-800'}`}></div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 1: Account Type Selection */}
        {step === 1 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white font-bold text-2xl mb-2">What brings you to Lurexo?</h2>
            <p className="text-gray-400 mb-6">Choose the option that best describes you</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              {/* Artist Option */}
              <button
                onClick={() => setAccountType('artist')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  accountType === 'artist'
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Music className={`w-10 h-10 mb-4 ${accountType === 'artist' ? 'text-purple-400' : 'text-gray-400'}`} />
                <h3 className="text-white font-bold text-lg mb-2">I'm an Artist</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Build your fanbase</li>
                  <li>• Share tour dates</li>
                  <li>• Connect with fans</li>
                  <li>• Sell merch</li>
                </ul>
              </button>

              {/* Organizer Option */}
              <button
                onClick={() => setAccountType('organizer')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  accountType === 'organizer'
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Building2 className={`w-10 h-10 mb-4 ${accountType === 'organizer' ? 'text-purple-400' : 'text-gray-400'}`} />
                <h3 className="text-white font-bold text-lg mb-2">I Organize Events</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Create & manage events</li>
                  <li>• Sell tickets</li>
                  <li>• Grow your venue</li>
                  <li>• Analytics & insights</li>
                </ul>
              </button>

              {/* Both Option */}
              <button
                onClick={() => setAccountType('both')}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  accountType === 'both'
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                }`}
              >
                <Users className={`w-10 h-10 mb-4 ${accountType === 'both' ? 'text-purple-400' : 'text-gray-400'}`} />
                <h3 className="text-white font-bold text-lg mb-2">I'm Both</h3>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Full artist profile</li>
                  <li>• Full organizer profile</li>
                  <li>• Switch between accounts</li>
                  <li>• Maximum flexibility</li>
                </ul>
              </button>
            </div>

            <button
              onClick={handleNext}
              disabled={!accountType}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-center text-gray-400 text-sm mt-6">
              Already have an account?{' '}
              <Link href="/auth/organizer-login" className="text-purple-400 hover:text-purple-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* Step 2: Profile Setup */}
        {step === 2 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white font-bold text-2xl mb-2">Set Up Your Profile</h2>
            <p className="text-gray-400 mb-6">
              {accountType === 'artist' && "Tell us about your artist identity"}
              {accountType === 'organizer' && "Tell us about your organization"}
              {accountType === 'both' && "Set up both your artist and organizer profiles"}
            </p>

            <div className="space-y-6">
              {/* Artist Profile Section */}
              {(accountType === 'artist' || accountType === 'both') && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Music className="w-5 h-5 text-purple-400" />
                    <h3 className="text-white font-semibold text-lg">Artist Profile</h3>
                  </div>

                  {/* Profile Picture */}
                  <div className="mb-4">
                    <label className="text-white font-medium mb-2 block text-sm">Profile Picture (Optional)</label>
                    <div className="flex items-center gap-4">
                      {formData.artistProfilePicturePreview ? (
                        <div className="relative">
                          <img
                            src={formData.artistProfilePicturePreview}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, artistProfilePicture: null, artistProfilePicturePreview: '' }))}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Upload Image</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('artistProfilePicture', e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Artist Name */}
                  <div className="mb-4">
                    <label className="text-white font-medium mb-2 block text-sm">Artist/Band Name *</label>
                    <input
                      type="text"
                      value={formData.artistName}
                      onChange={(e) => handleInputChange('artistName', e.target.value)}
                      placeholder="e.g., The Midnight Riders"
                      className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg border ${
                        errors.artistName ? 'border-red-500' : 'border-gray-600'
                      } focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                    {errors.artistName && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.artistName}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="mb-4">
                    <label className="text-white font-medium mb-2 block text-sm">Username *</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">lurexo.com/</span>
                      <input
                        type="text"
                        value={formData.artistUsername}
                        onChange={(e) => handleInputChange('artistUsername', e.target.value)}
                        placeholder="the-midnight-riders"
                        className={`flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg border ${
                          errors.artistUsername ? 'border-red-500' : 'border-gray-600'
                        } focus:outline-none focus:border-purple-500 transition-colors`}
                      />
                    </div>
                    {errors.artistUsername && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.artistUsername}
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-1">Your unique profile URL</p>
                  </div>

                  {/* Genre Selection */}
                  <div className="mb-4">
                    <label className="text-white font-medium mb-2 block text-sm">Genre (Optional)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {genres.map(genre => (
                        <button
                          key={genre}
                          type="button"
                          onClick={() => handleGenreToggle(genre)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            formData.artistGenre.includes(genre)
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          }`}
                        >
                          {genre}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Bio (Optional)</label>
                    <textarea
                      value={formData.artistBio}
                      onChange={(e) => handleInputChange('artistBio', e.target.value)}
                      placeholder="Tell your story..."
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                    <p className="text-gray-400 text-xs mt-1">You can add or edit this later</p>
                  </div>
                </div>
              )}

              {/* Organizer Profile Section */}
              {(accountType === 'organizer' || accountType === 'both') && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <h3 className="text-white font-semibold text-lg">Organizer Profile</h3>
                  </div>

                  {/* Profile Picture */}
                  <div className="mb-4">
                    <label className="text-white font-medium mb-2 block text-sm">Organization Logo (Optional)</label>
                    <div className="flex items-center gap-4">
                      {formData.organizationProfilePicturePreview ? (
                        <div className="relative">
                          <img
                            src={formData.organizationProfilePicturePreview}
                            alt="Preview"
                            className="w-20 h-20 rounded-full object-cover"
                          />
                          <button
                            onClick={() => setFormData(prev => ({ ...prev, organizationProfilePicture: null, organizationProfilePicturePreview: '' }))}
                            className="absolute -top-2 -right-2 p-1 bg-red-600 rounded-full hover:bg-red-500 transition-colors"
                          >
                            <X className="w-3 h-3 text-white" />
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-gray-500" />
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="text-sm">Upload Logo</span>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageUpload('organizationProfilePicture', e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Organization Name */}
                  <div className="mb-4">
                    <label className="text-white font-medium mb-2 block text-sm">Organization Name *</label>
                    <input
                      type="text"
                      value={formData.organizationName}
                      onChange={(e) => handleInputChange('organizationName', e.target.value)}
                      placeholder="e.g., Printworks London"
                      className={`w-full bg-gray-700 text-white px-4 py-3 rounded-lg border ${
                        errors.organizationName ? 'border-red-500' : 'border-gray-600'
                      } focus:outline-none focus:border-purple-500 transition-colors`}
                    />
                    {errors.organizationName && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.organizationName}
                      </p>
                    )}
                  </div>

                  {/* Username */}
                  <div className="mb-4">
                    <label className="text-white font-medium mb-2 block text-sm">Username *</label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 text-sm">lurexo.com/</span>
                      <input
                        type="text"
                        value={formData.organizationUsername}
                        onChange={(e) => handleInputChange('organizationUsername', e.target.value)}
                        placeholder="printworks-london"
                        className={`flex-1 bg-gray-700 text-white px-4 py-3 rounded-lg border ${
                          errors.organizationUsername ? 'border-red-500' : 'border-gray-600'
                        } focus:outline-none focus:border-purple-500 transition-colors`}
                      />
                    </div>
                    {errors.organizationUsername && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.organizationUsername}
                      </p>
                    )}
                  </div>

                  {/* Organization Type */}
                  <div className="mb-4">
                    <label className="text-white font-medium mb-2 block text-sm">Organization Type *</label>
                    <select
                      value={formData.organizationType}
                      onChange={(e) => handleInputChange('organizationType', e.target.value)}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="venue">Venue</option>
                      <option value="promoter">Promoter</option>
                      <option value="festival">Festival</option>
                      <option value="label">Record Label</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Location */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="text-white font-medium mb-2 block text-sm">City (Optional)</label>
                      <input
                        type="text"
                        value={formData.organizationCity}
                        onChange={(e) => handleInputChange('organizationCity', e.target.value)}
                        placeholder="London"
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-white font-medium mb-2 block text-sm">Country</label>
                      <select
                        value={formData.organizationCountry}
                        onChange={(e) => handleInputChange('organizationCountry', e.target.value)}
                        className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                      >
                        {countries.map(country => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="text-white font-medium mb-2 block text-sm">Bio (Optional)</label>
                    <textarea
                      value={formData.organizationBio}
                      onChange={(e) => handleInputChange('organizationBio', e.target.value)}
                      placeholder="Tell us about your organization..."
                      rows={3}
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Account Credentials */}
        {step === 3 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8">
            <h2 className="text-white font-bold text-2xl mb-2">Account Security</h2>
            <p className="text-gray-400 mb-6">Create your login credentials</p>

            <div className="space-y-4">
              {/* Email */}
              <div>
                <label className="text-white font-medium mb-2 block">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-xl border ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    } focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-white font-medium mb-2 block">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Minimum 8 characters"
                    className={`w-full bg-gray-800 text-white pl-12 pr-12 py-3 rounded-xl border ${
                      errors.password ? 'border-red-500' : 'border-gray-700'
                    } focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-white font-medium mb-2 block">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter your password"
                    className={`w-full bg-gray-800 text-white pl-12 pr-12 py-3 rounded-xl border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-700'
                    } focus:outline-none focus:border-purple-500 transition-colors`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="space-y-3 pt-4">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 mt-0.5"
                  />
                  <span className="text-gray-300 text-sm">
                    I agree to the{' '}
                    <Link href="/terms" className="text-purple-400 hover:text-purple-300">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-400 text-sm flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.agreeToTerms}
                  </p>
                )}

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeToMarketing}
                    onChange={(e) => handleInputChange('agreeToMarketing', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500 mt-0.5"
                  />
                  <span className="text-gray-300 text-sm">
                    Send me updates about new features and events (optional)
                  </span>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errors.submit}
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={handleBack}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 text-center">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-400" />
            </div>

            <h2 className="text-white font-bold text-3xl mb-2">Account Created!</h2>
            <p className="text-gray-400 mb-8">
              {accountType === 'artist' && `Welcome to Lurexo, ${formData.artistName}! 🎤`}
              {accountType === 'organizer' && `Welcome to Lurexo, ${formData.organizationName}! 🏢`}
              {accountType === 'both' && `Welcome to Lurexo! You're all set with both profiles! 👥`}
            </p>

            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-8 text-left">
              <h3 className="text-white font-semibold mb-4">What's Next?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Verify your email</p>
                    <p className="text-gray-400 text-sm">Check {formData.email} for verification link</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Complete your profile</p>
                    <p className="text-gray-400 text-sm">Add photos, bio, and social links</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">
                      {accountType === 'artist' ? 'Share your music' : accountType === 'organizer' ? 'Create your first event' : 'Start creating'}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {accountType === 'artist' ? 'Connect with fans and grow your audience' : accountType === 'organizer' ? 'Set up tickets and start selling' : 'Create events or build your fanbase'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push('/organizer/dashboard')}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}