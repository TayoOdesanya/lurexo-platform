'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Calendar,
  Target,
  Mail,
  Send,
  Save,
  Eye,
  Clock,
  Sparkles,
  Image as ImageIcon,
  Link as LinkIcon,
  Bold,
  Italic,
  List,
  X,
  CheckCircle,
  AlertCircle,
  Users,
  Zap,
  ShoppingCart,
  Star,
  Heart,
  Info,
  Music,
  Video,
  Camera,
  MessageCircle,
  Gift,
  Upload,
  Facebook,
  Twitter,
  Instagram,
  BarChart3,
  Share2,
  ChevronDown,
  Plus,
} from 'lucide-react';

interface MarketingAccount {
  id: string;
  type: 'ARTIST' | 'ORGANIZER';
  name: string;
  fanCount: number;
}

interface Template {
  id: string;
  name: string;
  type: string;
  description: string;
  subject: string;
  preview: string;
  content: string;
  icon: string;
  category: 'shared' | 'artist-only';
}

interface Segment {
  id: string;
  name: string;
  count: number;
  description: string;
}

export default function CampaignBuilderPage() {
  const searchParams = useSearchParams();
  
  // Mock accounts - In production, fetch from API
  const mockAccounts: MarketingAccount[] = [
    { id: 'artist_1', type: 'ARTIST', name: 'Arctic Monkeys', fanCount: 12500 },
    { id: 'organizer_1', type: 'ORGANIZER', name: 'Printworks London', fanCount: 8200 },
  ];

  // Get active account from URL or default to first
  const accountIdFromUrl = searchParams.get('accountId');
  const [activeAccount, setActiveAccount] = useState<MarketingAccount>(
    mockAccounts.find(a => a.id === accountIdFromUrl) || mockAccounts[0]
  );
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  // Update active account when URL changes
  useEffect(() => {
    if (accountIdFromUrl) {
      const account = mockAccounts.find(a => a.id === accountIdFromUrl);
      if (account) {
        setActiveAccount(account);
      }
    }
  }, [accountIdFromUrl]);

  const accountType = activeAccount.type;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [requiresApproval, setRequiresApproval] = useState(false);

  // Form state
  const [campaignName, setCampaignName] = useState('');
  const [subject, setSubject] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [scheduleType, setScheduleType] = useState<'now' | 'later' | 'draft'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Artist-exclusive features
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [spotifyUrl, setSpotifyUrl] = useState('');
  const [crossPostSocial, setCrossPostSocial] = useState(false);
  const [hasPoll, setHasPoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [hasBirthdayCode, setHasBirthdayCode] = useState(false);
  const [birthdayDiscount, setBirthdayDiscount] = useState('10');

  // Rich text formatting state
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  const templates: Template[] = [
    // Shared templates (both Artist & Organizer can use)
    {
      id: 'new_show',
      name: 'New Show Announcement',
      type: 'NEW_SHOW',
      description: 'Perfect for announcing tour dates and new events',
      subject: "We're coming to {city}! 🎸",
      preview: 'Get your tickets before they sell out...',
      content: `Hey {first_name},

Exciting news! We're thrilled to announce a brand new show coming to {city}.

📅 Date: {event_date}
📍 Venue: {venue_name}
🎫 Tickets: On sale now

This is going to be an incredible night. Don't miss out!

Get your tickets here: {ticket_link}

See you there!`,
      icon: 'calendar',
      category: 'shared',
    },
    {
      id: 'vip_access',
      name: 'VIP Pre-Sale',
      type: 'EXCLUSIVE_ACCESS',
      description: 'Exclusive early access for your top fans',
      subject: 'Exclusive pre-sale just for you ⭐',
      preview: 'Get your tickets before anyone else...',
      content: `Hi {first_name},

As one of our most valued fans, you're getting exclusive early access to tickets.

⭐ VIP Pre-Sale Access
🎟️ Limited tickets available
⏰ 24 hours before public sale

This is your chance to secure the best seats before anyone else.

Access pre-sale: {presale_link}

Thank you for your continued support!`,
      icon: 'star',
      category: 'shared',
    },
    {
      id: 'merch_drop',
      name: 'Merch Drop',
      type: 'MERCH_DROP',
      description: 'Launch new merchandise to your fans',
      subject: 'New merch just dropped! 🔥',
      preview: 'Limited edition items available now...',
      content: `Hey {first_name},

Our brand new merch collection is here!

🎨 Limited edition designs
👕 Premium quality
📦 Ships worldwide

These won't last long, so grab yours now.

Shop now: {shop_link}

Thanks for the support!`,
      icon: 'shopping',
      category: 'shared',
    },
    {
      id: 'thank_you',
      name: 'Thank You',
      type: 'THANK_YOU',
      description: 'Show appreciation after an event',
      subject: 'Thank you for an unforgettable night! 🎉',
      preview: 'What an incredible show...',
      content: `Hi {first_name},

Thank you so much for being part of last night's show in {city}.

Your energy made it truly special. We couldn't do this without fans like you.

💜 Can't wait to see you again soon

Stay tuned for more announcements!`,
      icon: 'heart',
      category: 'shared',
    },
    {
      id: 'custom',
      name: 'Custom Email',
      type: 'CUSTOM',
      description: 'Start from scratch with a blank template',
      subject: '',
      preview: '',
      content: '',
      icon: 'zap',
      category: 'shared',
    },
    // Artist-only templates
    {
      id: 'new_music',
      name: 'New Music Release',
      type: 'NEW_MUSIC_RELEASE',
      description: 'Announce singles, albums, or EPs to your fans',
      subject: 'New music out now! 🎵',
      preview: 'Our latest track is finally here...',
      content: `Hey {first_name},

We're so excited to share our brand new single with you!

🎵 "{song_name}" is out now on all platforms

This one's special to us, and we hope you love it as much as we do.

Listen now: {music_link}

Let us know what you think!`,
      icon: 'music',
      category: 'artist-only',
    },
    {
      id: 'personal_update',
      name: 'Personal Update',
      type: 'PERSONAL_UPDATE',
      description: 'Share personal news, studio updates, or tour life',
      subject: 'A message from the band 💬',
      preview: 'Wanted to share something with you...',
      content: `Hi {first_name},

Hope you're doing well! We wanted to give you a quick update on what we've been up to.

We're currently in the studio working on new material, and it's sounding amazing. Can't wait for you to hear it.

More news coming soon!

Love,
The Band`,
      icon: 'heart',
      category: 'artist-only',
    },
    {
      id: 'behind_scenes',
      name: 'Behind the Scenes',
      type: 'BEHIND_THE_SCENES',
      description: 'Share rehearsals, recording sessions, or tour moments',
      subject: 'Behind the scenes with us 🎥',
      preview: 'Ever wondered what goes on backstage?',
      content: `Hey {first_name},

We thought you'd like a peek behind the curtain!

We've been rehearsing for the upcoming tour and wanted to share some exclusive moments with you.

Check out the photos and videos below.

See you on the road!`,
      icon: 'camera',
      category: 'artist-only',
    },
    {
      id: 'fan_engagement',
      name: 'Fan Engagement',
      type: 'FAN_ENGAGEMENT',
      description: 'Polls, Q&As, or exclusive song reveals',
      subject: 'We need your help! 🎯',
      preview: 'Your voice matters to us...',
      content: `Hi {first_name},

We're planning our setlist for the upcoming tour and want YOUR input!

Vote for which songs you want to hear live, and we'll do our best to make it happen.

Your feedback means everything to us!`,
      icon: 'users',
      category: 'artist-only',
    },
    {
      id: 'exclusive_content',
      name: 'Exclusive Content',
      type: 'EXCLUSIVE_CONTENT',
      description: 'Early access to unreleased material or special content',
      subject: 'Something special for you ⭐',
      preview: 'Exclusive content just for our fans...',
      content: `Hey {first_name},

As a thank you for your incredible support, we're giving you early access to something special.

This unreleased track is just for you - don't share it publicly yet!

Enjoy this exclusive preview!`,
      icon: 'star',
      category: 'artist-only',
    },
  ];

  const segments: Segment[] = [
    { id: '1', name: 'All Fans', count: 12500, description: 'Everyone subscribed to your updates' },
    { id: '2', name: 'VIP Fans (Top 10%)', count: 1250, description: 'Your most engaged fans' },
    { id: '3', name: 'London Fans', count: 5200, description: 'Fans based in London' },
    { id: '4', name: 'Past Attendees', count: 7500, description: 'Fans who attended previous events' },
    { id: '5', name: 'New Fans (30 days)', count: 890, description: 'Recently subscribed fans' },
  ];

  // Filter templates based on account type
  const availableTemplates = templates.filter(template => {
    if (accountType === 'ARTIST') return true; // Artists see all templates
    return template.category !== 'artist-only'; // Organizers only see shared templates
  });

  const getTemplateIcon = (icon: string) => {
    switch (icon) {
      case 'calendar': return Calendar;
      case 'star': return Star;
      case 'shopping': return ShoppingCart;
      case 'heart': return Heart;
      case 'zap': return Zap;
      case 'music': return Music;
      case 'camera': return Camera;
      case 'users': return Users;
      default: return Mail;
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setCampaignName(template.name);
    setSubject(template.subject);
    setPreviewText(template.preview);
    setEmailContent(template.content);
  };

  const handleSegmentToggle = (segmentId: string) => {
    setSelectedSegments(prev => 
      prev.includes(segmentId) 
        ? prev.filter(id => id !== segmentId)
        : [...prev, segmentId]
    );
  };

  const calculateTotalRecipients = () => {
    const selected = segments.filter(s => selectedSegments.includes(s.id));
    const total = selected.reduce((sum, s) => sum + s.count, 0);
    const deduped = selectedSegments.length > 1 ? Math.floor(total * 0.85) : total;
    return deduped;
  };

  const insertMergeTag = (tag: string) => {
    setEmailContent(prev => prev + `{${tag}}`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMediaFiles(Array.from(e.target.files));
    }
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = () => {
    const needsApproval = Math.random() > 0.5;
    setRequiresApproval(needsApproval);
    setShowSuccessModal(true);
  };

  const steps = [
    { number: 1, title: 'Template', icon: Sparkles },
    { number: 2, title: 'Content', icon: Mail },
    { number: 3, title: 'Audience', icon: Users },
    { number: 4, title: 'Schedule', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            href="/organizer/marketing"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-2 transition-colors"
          >
            ← Back to Marketing
          </Link>
          <h1 className="text-white font-bold text-2xl sm:text-3xl">Create Campaign</h1>
          <p className="text-gray-400 mt-1">Reach your fans with targeted messaging</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors min-w-[120px]"
          >
            <Eye className="w-4 h-4" />
            <span>Preview</span>
          </button>

          {/* Account Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 border border-gray-800 hover:bg-gray-800 rounded-lg transition-colors min-w-[200px]"
            >
              <span className="text-lg">
                {activeAccount.type === 'ARTIST' ? '🎤' : '🏢'}
              </span>
              <div className="text-left flex-1">
                <p className="text-white font-semibold text-sm">{activeAccount.name}</p>
                <p className="text-gray-400 text-xs">{activeAccount.fanCount.toLocaleString()} fans</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAccountDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showAccountDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-50">
                <div className="p-2">
                  {mockAccounts.map((account) => (
                    <Link
                      key={account.id}
                      href={`/organizer/marketing/campaigns/new?accountId=${account.id}`}
                      onClick={() => {
                        setActiveAccount(account);
                        setShowAccountDropdown(false);
                      }}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                        activeAccount.id === account.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xl">
                        {account.type === 'ARTIST' ? '🎤' : '🏢'}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{account.name}</p>
                        <p className={`text-xs ${activeAccount.id === account.id ? 'text-purple-200' : 'text-gray-400'}`}>
                          {account.fanCount.toLocaleString()} fans
                        </p>
                      </div>
                      {activeAccount.id === account.id && (
                        <Check className="w-4 h-4" />
                      )}
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-700 p-2">
                  <Link
                    href="/organizer/settings/profiles"
                    className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors text-sm"
                    onClick={() => setShowAccountDropdown(false)}
                  >
                    <Plus className="w-4 h-4" />
                    Create New Profile
                  </Link>
                </div>
              </div>
            )}
          </div>
          
          {currentStep === 4 && (
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-colors min-w-[160px]"
            >
              <Send className="w-4 h-4" />
              {scheduleType === 'draft' ? 'Save Draft' : scheduleType === 'later' ? 'Schedule' : 'Send'}
            </button>
          )}
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;

            return (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isCompleted
                        ? 'bg-green-600'
                        : isActive
                        ? 'bg-purple-600'
                        : 'bg-gray-800'
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-px w-16 sm:w-24 mx-2 sm:mx-4 mb-8 transition-colors ${
                      isCompleted ? 'bg-green-600' : 'bg-gray-700'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        {/* Step 1: Choose Template */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-xl mb-2">Choose Your Template</h2>
              <p className="text-gray-400 text-sm">
                Select a template to get started
                {accountType === 'ARTIST' && (
                  <span className="text-purple-400"> - Artist-exclusive templates available</span>
                )}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTemplates.map((template) => {
                const Icon = getTemplateIcon(template.icon);
                const isSelected = selectedTemplate?.id === template.id;
                const isArtistOnly = template.category === 'artist-only';

                return (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`text-left p-6 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-purple-600/20 border-2 border-purple-500 ring-2 ring-purple-500/50'
                        : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-3 rounded-lg ${
                            isSelected ? 'bg-purple-500' : 'bg-gray-700'
                          }`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {isArtistOnly && (
                          <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
                            Artist
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-purple-400" />
                      )}
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">{template.name}</h3>
                    <p className="text-gray-400 text-sm">{template.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={!selectedTemplate}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
              >
                Next: Write Content
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Write Content */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-xl mb-2">Write Your Content</h2>
              <p className="text-gray-400 text-sm">Customize the email content and subject line</p>
            </div>

            <div className="space-y-4">
              {/* Campaign Name */}
              <div>
                <label className="text-white font-medium mb-2 block text-sm">
                  Campaign Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="e.g., Summer Tour Announcement"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <p className="text-gray-500 text-xs mt-1">Internal name (not visible to recipients)</p>
              </div>

              {/* Subject Line */}
              <div>
                <label className="text-white font-medium mb-2 block text-sm">
                  Subject Line <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Make it catchy!"
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <div className="flex items-center justify-between mt-1">
                  <p className="text-gray-500 text-xs">
                    {subject.length} characters {subject.length >= 40 && subject.length <= 50 && '✓ Optimal length'}
                  </p>
                  <p className={`text-xs ${subject.length >= 40 && subject.length <= 50 ? 'text-green-400' : 'text-gray-500'}`}>
                    Optimal: 40-50 characters
                  </p>
                </div>
              </div>

              {/* Preview Text */}
              <div>
                <label className="text-white font-medium mb-2 block text-sm">
                  Preview Text
                </label>
                <input
                  type="text"
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Shows in inbox after subject line..."
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <p className="text-gray-500 text-xs mt-1">Appears in email inbox preview</p>
              </div>

              {/* Merge Tags */}
              <div>
                <label className="text-white font-medium mb-2 block text-sm">
                  Personalization Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {['first_name', 'city', 'event_date', 'venue_name', 'ticket_link'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => insertMergeTag(tag)}
                      className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-purple-400 rounded-lg text-sm font-mono transition-colors border border-gray-700"
                    >
                      {`{${tag}}`}
                    </button>
                  ))}
                </div>
                <p className="text-gray-500 text-xs mt-2">Click to insert dynamic content into your email</p>
              </div>

              {/* Email Content */}
              <div>
                <label className="text-white font-medium mb-2 block text-sm">
                  Email Content <span className="text-red-400">*</span>
                </label>

                {/* Rich Text Toolbar */}
                <div className="flex items-center gap-2 p-2 bg-gray-800 border border-gray-700 rounded-t-xl">
                  <button
                    onClick={() => setIsBold(!isBold)}
                    className={`p-2 rounded transition-colors ${isBold ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setIsItalic(!isItalic)}
                    className={`p-2 rounded transition-colors ${isItalic ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-gray-700" />
                  <button className="p-2 text-gray-400 hover:bg-gray-700 rounded transition-colors" title="Add Link">
                    <LinkIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-700 rounded transition-colors" title="Add Image">
                    <ImageIcon className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:bg-gray-700 rounded transition-colors" title="Add List">
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <textarea
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  rows={12}
                  placeholder="Write your email content here..."
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-b-xl border border-t-0 border-gray-700 focus:outline-none focus:border-purple-500 transition-colors resize-none font-mono text-sm"
                  style={{
                    fontWeight: isBold ? 'bold' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                  }}
                />
              </div>

              {/* Artist-Exclusive Features */}
              {accountType === 'ARTIST' && (
                <div className="border-t border-gray-800 pt-6 mt-6 space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <h3 className="text-white font-bold text-lg">Artist Features</h3>
                    <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full font-medium">
                      Exclusive
                    </span>
                  </div>

                  {/* Media Uploads */}
                  <div className="bg-gray-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      Attach Media
                    </h4>

                    {/* File Upload */}
                    <div>
                      <label className="text-gray-400 text-sm mb-2 block">
                        Photos, Videos, or Audio (30 sec max for audio)
                      </label>
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-xl cursor-pointer hover:border-purple-500 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 text-gray-500 mb-2" />
                          <p className="text-sm text-gray-400">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, MP4, MP3 (max 50MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          accept="image/*,video/*,audio/*"
                          onChange={handleFileUpload}
                        />
                      </label>
                      {mediaFiles.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {mediaFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* YouTube/Spotify Embeds */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">YouTube Link</label>
                        <input
                          type="url"
                          value={youtubeUrl}
                          onChange={(e) => setYoutubeUrl(e.target.value)}
                          placeholder="https://youtube.com/watch?v=..."
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Spotify Link</label>
                        <input
                          type="url"
                          value={spotifyUrl}
                          onChange={(e) => setSpotifyUrl(e.target.value)}
                          placeholder="https://open.spotify.com/track/..."
                          className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Social Integration */}
                  <div className="bg-gray-800 rounded-xl p-5">
                    <h4 className="text-white font-semibold flex items-center gap-2 mb-4">
                      <Share2 className="w-4 h-4" />
                      Social Integration
                    </h4>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={crossPostSocial}
                        onChange={(e) => setCrossPostSocial(e.target.checked)}
                        className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">Cross-post to social media</span>
                        <div className="flex gap-1">
                          <Instagram className="w-4 h-4 text-pink-400" />
                          <Twitter className="w-4 h-4 text-blue-400" />
                          <Facebook className="w-4 h-4 text-blue-500" />
                        </div>
                      </div>
                    </label>
                    <p className="text-gray-500 text-xs mt-2 ml-8">
                      Share this campaign on your connected social accounts
                    </p>
                  </div>

                  {/* Fan Engagement Tools */}
                  <div className="bg-gray-800 rounded-xl p-5 space-y-4">
                    <h4 className="text-white font-semibold flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Fan Engagement
                    </h4>

                    {/* Add Poll */}
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer mb-3">
                        <input
                          type="checkbox"
                          checked={hasPoll}
                          onChange={(e) => setHasPoll(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-white text-sm">Include a poll</span>
                      </label>

                      {hasPoll && (
                        <div className="ml-8 space-y-3">
                          <input
                            type="text"
                            value={pollQuestion}
                            onChange={(e) => setPollQuestion(e.target.value)}
                            placeholder="e.g., Which song should we play tonight?"
                            className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                          />
                          <div className="space-y-2">
                            {pollOptions.map((option, index) => (
                              <div key={index} className="flex gap-2">
                                <input
                                  type="text"
                                  value={option}
                                  onChange={(e) => updatePollOption(index, e.target.value)}
                                  placeholder={`Option ${index + 1}`}
                                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                                />
                                {pollOptions.length > 2 && (
                                  <button
                                    onClick={() => removePollOption(index)}
                                    className="p-2 text-red-400 hover:bg-gray-700 rounded transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                          {pollOptions.length < 4 && (
                            <button
                              onClick={addPollOption}
                              className="text-purple-400 text-sm hover:text-purple-300 transition-colors"
                            >
                              + Add option
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Birthday Discount */}
                    <div>
                      <label className="flex items-center gap-3 cursor-pointer mb-3">
                        <input
                          type="checkbox"
                          checked={hasBirthdayCode}
                          onChange={(e) => setHasBirthdayCode(e.target.checked)}
                          className="w-5 h-5 rounded border-gray-600 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-white text-sm flex items-center gap-2">
                          Birthday month discount code
                          <Gift className="w-4 h-4 text-pink-400" />
                        </span>
                      </label>

                      {hasBirthdayCode && (
                        <div className="ml-8">
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              value={birthdayDiscount}
                              onChange={(e) => setBirthdayDiscount(e.target.value)}
                              placeholder="10"
                              min="5"
                              max="50"
                              className="w-20 bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors text-sm"
                            />
                            <span className="text-gray-400 text-sm">% off for fans celebrating birthdays this month</span>
                          </div>
                          <p className="text-gray-500 text-xs mt-2">
                            Code: BIRTHDAY{birthdayDiscount} (auto-generated)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                disabled={!campaignName || !subject || !emailContent}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
              >
                Next: Select Audience
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Audience - Unchanged from previous version */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-xl mb-2">Select Your Audience</h2>
              <p className="text-gray-400 text-sm">Choose one or more segments to send this campaign to</p>
            </div>

            {selectedSegments.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-medium">
                      {selectedSegments.length} segment{selectedSegments.length > 1 ? 's' : ''} selected
                    </p>
                    <p className="text-blue-200/80 text-sm">
                      Total unique recipients: <strong>{calculateTotalRecipients().toLocaleString()}</strong> fans
                      {selectedSegments.length > 1 && ' (duplicates removed)'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {segments.map((segment) => {
                const isSelected = selectedSegments.includes(segment.id);

                return (
                  <button
                    key={segment.id}
                    onClick={() => handleSegmentToggle(segment.id)}
                    className={`w-full text-left p-5 rounded-xl transition-all ${
                      isSelected
                        ? 'bg-purple-600/20 border-2 border-purple-500'
                        : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center mt-1 ${
                            isSelected
                              ? 'bg-purple-600 border-purple-600'
                              : 'border-gray-600'
                          }`}
                        >
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-white font-bold">{segment.name}</h3>
                            <span className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs font-medium">
                              {segment.count.toLocaleString()} fans
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">{segment.description}</p>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(2)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={() => setCurrentStep(4)}
                disabled={selectedSegments.length === 0}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
              >
                Next: Schedule
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Schedule & Send */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-white font-bold text-xl mb-2">Schedule Your Campaign</h2>
              <p className="text-gray-400 text-sm">Choose when to send this campaign</p>
            </div>

            <div className="space-y-3">
              {/* Send Now */}
              <button
                onClick={() => setScheduleType('now')}
                className={`w-full text-left p-5 rounded-xl transition-all ${
                  scheduleType === 'now'
                    ? 'bg-purple-600/20 border-2 border-purple-500'
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      scheduleType === 'now'
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-600'
                    }`}
                  >
                    {scheduleType === 'now' && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <Send className={`w-6 h-6 ${scheduleType === 'now' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <div>
                    <h3 className="text-white font-bold">Send Now</h3>
                    <p className="text-gray-400 text-sm">Campaign will be sent immediately</p>
                  </div>
                </div>
              </button>

              {/* Schedule for Later */}
              <div
                className={`rounded-xl transition-all ${
                  scheduleType === 'later'
                    ? 'bg-purple-600/20 border-2 border-purple-500'
                    : 'bg-gray-800 border-2 border-gray-700'
                }`}
              >
                <button
                  onClick={() => setScheduleType('later')}
                  className="w-full text-left p-5"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        scheduleType === 'later'
                          ? 'bg-purple-600 border-purple-600'
                          : 'border-gray-600'
                      }`}
                    >
                      {scheduleType === 'later' && <div className="w-3 h-3 bg-white rounded-full" />}
                    </div>
                    <Clock className={`w-6 h-6 ${scheduleType === 'later' ? 'text-purple-400' : 'text-gray-400'}`} />
                    <div>
                      <h3 className="text-white font-bold">Schedule for Later</h3>
                      <p className="text-gray-400 text-sm">Choose a specific date and time</p>
                    </div>
                  </div>
                </button>

                {scheduleType === 'later' && (
                  <div className="px-5 pb-5 pt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Date</label>
                        <input
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-gray-400 text-sm mb-2 block">Time</label>
                        <input
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Save as Draft */}
              <button
                onClick={() => setScheduleType('draft')}
                className={`w-full text-left p-5 rounded-xl transition-all ${
                  scheduleType === 'draft'
                    ? 'bg-purple-600/20 border-2 border-purple-500'
                    : 'bg-gray-800 border-2 border-gray-700 hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      scheduleType === 'draft'
                        ? 'bg-purple-600 border-purple-600'
                        : 'border-gray-600'
                    }`}
                  >
                    {scheduleType === 'draft' && <div className="w-3 h-3 bg-white rounded-full" />}
                  </div>
                  <Save className={`w-6 h-6 ${scheduleType === 'draft' ? 'text-purple-400' : 'text-gray-400'}`} />
                  <div>
                    <h3 className="text-white font-bold">Save as Draft</h3>
                    <p className="text-gray-400 text-sm">Come back and finish later</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Campaign Summary */}
            <div className="bg-gray-800 rounded-xl p-5 space-y-3">
              <h3 className="text-white font-bold">Campaign Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Campaign Name</span>
                  <span className="text-white font-medium text-sm">{campaignName}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Subject Line</span>
                  <span className="text-white font-medium truncate max-w-xs text-sm">{subject}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-700">
                  <span className="text-gray-400 text-sm">Recipients</span>
                  <span className="text-white font-medium text-sm">{calculateTotalRecipients().toLocaleString()} fans</span>
                </div>
                {accountType === 'ARTIST' && (mediaFiles.length > 0 || youtubeUrl || spotifyUrl) && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm">Media Attachments</span>
                    <span className="text-white font-medium text-sm">
                      {mediaFiles.length > 0 && `${mediaFiles.length} file${mediaFiles.length > 1 ? 's' : ''}`}
                      {(youtubeUrl || spotifyUrl) && ' + Links'}
                    </span>
                  </div>
                )}
                {accountType === 'ARTIST' && hasPoll && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-700">
                    <span className="text-gray-400 text-sm">Engagement</span>
                    <span className="text-white font-medium text-sm">Poll included</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-400 text-sm">Delivery</span>
                  <span className="text-white font-medium text-sm">
                    {scheduleType === 'now' ? 'Immediate' : 
                     scheduleType === 'later' ? `${scheduledDate} at ${scheduledTime}` : 
                     'Draft'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <button
                onClick={() => setCurrentStep(3)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors"
              >
                {scheduleType === 'draft' ? (
                  <>
                    <Save className="w-5 h-5" />
                    Save Draft
                  </>
                ) : scheduleType === 'later' ? (
                  <>
                    <Clock className="w-5 h-5" />
                    Schedule Campaign
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Campaign
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-white font-bold text-xl">Email Preview</h2>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {/* Email Header */}
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">From:</span>
                  <span className="text-white text-sm">Arctic Monkeys &lt;noreply@lurexo.com&gt;</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Subject:</span>
                  <span className="text-white text-sm font-medium">{subject}</span>
                </div>
                {previewText && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Preview:</span>
                    <span className="text-gray-300 text-sm">{previewText}</span>
                  </div>
                )}
              </div>

              {/* Email Body */}
              <div className="bg-white rounded-lg p-8">
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Arctic Monkeys</h1>
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {emailContent}
                  </div>

                  {/* Media Attachments Preview */}
                  {accountType === 'ARTIST' && (mediaFiles.length > 0 || youtubeUrl || spotifyUrl) && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <p className="text-gray-600 text-sm mb-3">Attachments:</p>
                      {mediaFiles.length > 0 && (
                        <div className="space-y-2">
                          {mediaFiles.map((file, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <Music className="w-4 h-4" />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                      {youtubeUrl && (
                        <div className="text-sm text-gray-700 flex items-center gap-2 mt-2">
                          <Video className="w-4 h-4" />
                          YouTube: {youtubeUrl}
                        </div>
                      )}
                      {spotifyUrl && (
                        <div className="text-sm text-gray-700 flex items-center gap-2 mt-2">
                          <Music className="w-4 h-4" />
                          Spotify: {spotifyUrl}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Poll Preview */}
                  {accountType === 'ARTIST' && hasPoll && pollQuestion && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-gray-900 font-semibold mb-3">{pollQuestion}</p>
                      <div className="space-y-2">
                        {pollOptions.filter(o => o).map((option, index) => (
                          <button
                            key={index}
                            className="w-full text-left px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:border-purple-500 transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Birthday Discount Preview */}
                  {accountType === 'ARTIST' && hasBirthdayCode && (
                    <div className="mt-6 p-4 bg-pink-50 rounded-lg border border-pink-200 text-center">
                      <Gift className="w-8 h-8 text-pink-600 mx-auto mb-2" />
                      <p className="text-pink-900 font-semibold">🎂 Happy Birthday Month!</p>
                      <p className="text-pink-700 text-sm mt-1">Use code BIRTHDAY{birthdayDiscount} for {birthdayDiscount}% off</p>
                    </div>
                  )}

                  <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
                    <p>You're receiving this because you subscribed to Arctic Monkeys updates.</p>
                    <p className="mt-2">
                      <a href="#" className="text-blue-600 hover:underline">Unsubscribe</a>
                      {' • '}
                      <a href="#" className="text-blue-600 hover:underline">Update preferences</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-md w-full p-6">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                requiresApproval ? 'bg-blue-500/20' : 'bg-green-500/20'
              }`}>
                {requiresApproval ? (
                  <Clock className="w-8 h-8 text-blue-400" />
                ) : (
                  <CheckCircle className="w-8 h-8 text-green-400" />
                )}
              </div>

              <h3 className="text-white font-bold text-xl mb-2">
                {scheduleType === 'draft' ? 'Draft Saved' : 
                 requiresApproval ? 'Awaiting Approval' : 
                 scheduleType === 'later' ? 'Campaign Scheduled' : 
                 'Campaign Sent'}
              </h3>

              <p className="text-gray-400 mb-6">
                {scheduleType === 'draft' ? 'Your campaign has been saved as a draft.' : 
                 requiresApproval ? 'Your campaign is waiting for organizer approval before sending.' : 
                 scheduleType === 'later' ? `Your campaign will be sent on ${scheduledDate} at ${scheduledTime}.` : 
                 `Your campaign is being sent to ${calculateTotalRecipients().toLocaleString()} fans.`}
              </p>

              <Link
                href="/organizer/marketing"
                className="block w-full px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-colors text-center"
              >
                Back to Marketing
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}