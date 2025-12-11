'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Heart,
  Users,
  Shield,
  Zap,
  Target,
  Award,
  TrendingUp,
  Globe,
  Sparkles,
  CheckCircle,
  Mail,
  User,
  Star,
  Clock,
  Ticket,
  Smartphone
} from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  const router = useRouter();

  const values = [
    {
      icon: Sparkles,
      title: 'Radical Transparency',
      description: 'No hidden fees. No surprise charges. The price you see is the price you pay. We believe in honest, upfront pricing that respects our users.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: 'Fair for Fans',
      description: 'We cap resale prices at 110% of face value and offer free ticket transfers. Fans shouldn\'t be exploited by scalpers or charged exorbitant fees.',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Continuous Innovation',
      description: 'We\'re constantly improving our platform with new features, better security, and smarter tools to make ticketing easier for everyone.',
      color: 'green'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We listen to our users and build features they actually want. Your feedback shapes our roadmap and helps us create the best experience.',
      color: 'orange'
    }
  ];

  const differences = [
    {
      icon: Award,
      title: 'No Hidden Fees',
      description: 'Unlike other platforms that add fees at checkout, we include everything upfront. What you see is what you pay.'
    },
    {
      icon: Shield,
      title: 'Fair Resale Policy',
      description: 'We cap resale prices at 110% to prevent price gouging and protect fans from exploitation.'
    },
    {
      icon: Users,
      title: 'Free Ticket Transfers',
      description: 'Transfer tickets to friends and family at no cost—because your tickets should be yours to share.'
    },
    {
      icon: TrendingUp,
      title: 'Mobile-First Experience',
      description: 'Built for how people actually use ticketing—on their phones, on the go, with instant access.'
    },
    {
      icon: Globe,
      title: 'Local & Global Events',
      description: 'From intimate local gigs to major international tours, we support events of all sizes.'
    }
  ];

  const getColorClass = (color: string) => {
    const colors = {
      purple: 'bg-purple-500/20 text-purple-400',
      blue: 'bg-blue-500/20 text-blue-400',
      green: 'bg-green-500/20 text-green-400',
      orange: 'bg-orange-500/20 text-orange-400'
    };
    return colors[color as keyof typeof colors] || colors.purple;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            </button>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-white font-bold text-sm sm:text-lg">About Lurexo</h1>
                <p className="text-gray-400 text-xs">Fair ticketing for real fans</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-white font-bold text-sm">About Lurexo</h1>
              </div>
            </Link>
          </div>
          
          <Link href="/for-organizers">
            <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-base">
              For Organizers
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">Built for Fans, Not Scalpers</h1>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
              We believe live events should be accessible to everyone. That's why we created Lurexo—a ticketing platform 
              that puts fans first, with transparent pricing, fair resale caps, and zero hidden fees.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-purple-500/20">
              <p className="text-purple-400 text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">100K+</p>
              <p className="text-gray-400 text-xs sm:text-sm">Happy Fans</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-blue-500/20">
              <p className="text-blue-400 text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">5,000+</p>
              <p className="text-gray-400 text-xs sm:text-sm">Events</p>
            </div>
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-green-500/20">
              <p className="text-green-400 text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">£0</p>
              <p className="text-gray-400 text-xs sm:text-sm">Hidden Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16 space-y-12 sm:space-y-20">
        {/* Founder Story - Enhanced with Video */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="h-px flex-1 bg-purple-500/30"></div>
              <span className="text-purple-400 text-xs sm:text-sm font-semibold">OUR STORY</span>
              <div className="h-px flex-1 bg-purple-500/30"></div>
            </div>
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-4 sm:mb-6">Born From Frustration</h2>
            <div className="space-y-3 sm:space-y-4 text-gray-300 text-sm sm:text-base leading-relaxed">
              <p>
                <strong className="text-white">It was 2:00 AM on a Tuesday.</strong> Our founder had just spent 3 hours 
                trying to get tickets to see their favorite artist—only to lose them to bots within seconds. 
                When the same tickets appeared on resale sites for triple the price, something snapped.
              </p>
              <p>
                We knew there had to be a better way. Not just for us, but for the millions of fans who deserve 
                fair access to live events. So we built Lurexo—a platform where transparency isn't a feature, 
                it's the foundation.
              </p>
              <p>
                Today, we're a small but passionate team fighting to return ticketing to what it should be: 
                <strong className="text-white"> accessible, honest, and fan-first.</strong>
              </p>
            </div>

            {/* Founder Quote */}
            <div className="mt-6 sm:mt-8 bg-purple-500/10 border-l-4 border-purple-500 rounded-r-xl p-4 sm:p-6">
              <p className="text-gray-300 italic text-sm sm:text-base mb-3">
                "Every time a real fan gets a ticket at face value instead of from a scalper, 
                we know we're doing something right. That's what keeps us going."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm sm:text-base">Tayo Odesanya</p>
                  <p className="text-gray-400 text-xs sm:text-sm">Founder & CEO</p>
                </div>
              </div>
            </div>
          </div>

          {/* Video Placeholder */}
          <div>
            <div className="bg-gray-900 rounded-2xl border border-gray-800 relative overflow-hidden aspect-video flex items-center justify-center">
              {/* Video Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20"></div>
              
              {/* Subtle pattern */}
              <div className="absolute inset-0 opacity-5" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '32px 32px'
              }}></div>

              <div className="relative z-10 text-center flex flex-col items-center pl-1">
                {/* Play Button */}
                <button className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 group mb-4 sm:mb-6 shadow-2xl">
                  <div className="w-0 h-0 border-t-[10px] sm:border-t-[12px] md:border-t-[14px] border-t-transparent border-l-[16px] sm:border-l-[20px] md:border-l-[24px] border-l-white border-b-[10px] sm:border-b-[12px] md:border-b-[14px] border-b-transparent ml-1 sm:ml-2 group-hover:border-l-gray-200"></div>
                </button>
                <p className="text-white font-semibold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">Our Story</p>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">Why we built Lurexo</p>
                <p className="text-gray-600 text-xs">(Video coming soon)</p>
              </div>

              {/* Duration Badge */}
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 bg-purple-500/20 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-purple-500/30">
                <p className="text-purple-400 text-xs sm:text-sm font-semibold">2:30</p>
              </div>
            </div>

            {/* Video Caption */}
            <p className="text-gray-400 text-xs sm:text-sm mt-3 sm:mt-4 text-center">
              Hear directly from our founder about the frustrations that led to Lurexo
            </p>
          </div>
        </section>

        {/* Our Values - Four Column Grid */}
        <section>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-3 sm:mb-4">Our Values</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
              These principles guide every decision we make and feature we build
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 hover:border-gray-700 transition-colors">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 ${getColorClass(value.color)} rounded-2xl flex items-center justify-center mb-3 sm:mb-4`}>
                    <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Timeline Section - Hidden on mobile, shown on tablet+ */}
        <section className="hidden md:block">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-3 sm:mb-4">Our Journey</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">From frustration to solution—here's how we got here</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-blue-500 to-green-500"></div>

            {/* Timeline Items */}
            <div className="space-y-8 sm:space-y-12">
              {/* Q1 2024 */}
              <div className="grid grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="text-right">
                  <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 inline-block">
                    <p className="text-purple-400 font-bold text-sm sm:text-base mb-1 sm:mb-2">Q1 2024</p>
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">The Spark</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Founded after watching real fans lose to bots and scalpers one too many times
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500 rounded-full border-4 border-black absolute -left-5 sm:-left-6 top-4 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Q2 2024 */}
              <div className="grid grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 rounded-full border-4 border-black absolute -right-5 sm:-right-6 top-4 flex items-center justify-center">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 inline-block">
                    <p className="text-blue-400 font-bold text-sm sm:text-base mb-1 sm:mb-2">Q2 2024</p>
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">First 1,000 Tickets</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Launched beta and sold first 1,000 tickets with zero scalping incidents
                    </p>
                  </div>
                </div>
              </div>

              {/* Q3 2024 */}
              <div className="grid grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="text-right">
                  <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 inline-block">
                    <p className="text-cyan-400 font-bold text-sm sm:text-base mb-1 sm:mb-2">Q3 2024</p>
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">AI Bot Prevention</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Launched industry-leading AI detection system—99.7% bot prevention rate
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-cyan-500 rounded-full border-4 border-black absolute -left-5 sm:-left-6 top-4 flex items-center justify-center">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>

              {/* Q4 2024 */}
              <div className="grid grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full border-4 border-black absolute -right-5 sm:-right-6 top-4 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
                <div className="text-left">
                  <div className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 inline-block">
                    <p className="text-green-400 font-bold text-sm sm:text-base mb-1 sm:mb-2">Q4 2024</p>
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">100K Milestone</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Served 100,000+ happy fans across 5,000+ events. Saved fans £2.4M in fees.
                    </p>
                  </div>
                </div>
              </div>

              {/* Q1 2025 */}
              <div className="grid grid-cols-2 gap-8 sm:gap-12 items-center">
                <div className="text-right">
                  <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-4 sm:p-6 border-2 border-purple-500/30 inline-block">
                    <p className="text-purple-400 font-bold text-sm sm:text-base mb-1 sm:mb-2">Q1 2025</p>
                    <h3 className="text-white font-bold text-base sm:text-lg md:text-xl mb-1 sm:mb-2">Nationwide Expansion</h3>
                    <p className="text-gray-400 text-xs sm:text-sm">
                      Expanding partnerships across the UK. Adding 50+ new venues per month.
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full border-4 border-black absolute -left-5 sm:-left-6 top-4 flex items-center justify-center animate-pulse">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Metrics Dashboard - New! */}
        <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 sm:p-12 border border-purple-500/20">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3">Our Impact</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">Making a real difference for fans and artists</p>
          </div>

          {/* Main Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-purple-500/20">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">100,247</p>
              <p className="text-purple-400 text-xs sm:text-sm font-medium mb-1">Happy Fans</p>
              <p className="text-gray-500 text-xs">Real people, not bots</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-blue-500/20">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Ticket className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">5,247</p>
              <p className="text-blue-400 text-xs sm:text-sm font-medium mb-1">Events Hosted</p>
              <p className="text-gray-500 text-xs">From clubs to stadiums</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-green-500/20">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
              <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">£2.4M</p>
              <p className="text-green-400 text-xs sm:text-sm font-medium mb-1">Saved for Fans</p>
              <p className="text-gray-500 text-xs">vs typical platforms</p>
            </div>

            <div className="bg-black/30 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-orange-500/20">
              <div className="flex items-center justify-center mb-2 sm:mb-3">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-orange-400" />
              </div>
              <p className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-1 sm:mb-2">99.7%</p>
              <p className="text-orange-400 text-xs sm:text-sm font-medium mb-1">Bot Prevention</p>
              <p className="text-gray-500 text-xs">AI-powered security</p>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Avg. Response Time</p>
                  <p className="text-white font-bold text-lg sm:text-xl">1.8 hours</p>
                </div>
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Satisfaction Rate</p>
                  <p className="text-white font-bold text-lg sm:text-xl">4.9 ★</p>
                </div>
                <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-400" />
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs mb-1">Tickets Transferred</p>
                  <p className="text-white font-bold text-lg sm:text-xl">12,493</p>
                </div>
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
              </div>
            </div>
          </div>

          {/* Live indicator */}
          <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 text-gray-400 text-xs sm:text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Metrics updated in real-time</span>
          </div>
        </section>

        {/* Press & Recognition - Simplified for mobile */}
        <section>
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3">Recognition & Press</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">Featured in leading publications</p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 sm:p-10 border border-gray-800">
            <p className="text-gray-400 text-xs sm:text-sm text-center mb-6 sm:mb-8">AS FEATURED IN:</p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-8 items-center">
              {/* Press Logo Placeholders */}
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 flex items-center justify-center h-20 sm:h-24 border border-gray-700 hover:border-gray-600 transition-colors">
                <p className="text-gray-400 font-bold text-sm sm:text-base md:text-lg">TechCrunch</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 flex items-center justify-center h-20 sm:h-24 border border-gray-700 hover:border-gray-600 transition-colors">
                <p className="text-gray-400 font-bold text-sm sm:text-base md:text-lg">The Guardian</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 flex items-center justify-center h-20 sm:h-24 border border-gray-700 hover:border-gray-600 transition-colors">
                <p className="text-gray-400 font-bold text-sm sm:text-base md:text-lg">Music Week</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 flex items-center justify-center h-20 sm:h-24 border border-gray-700 hover:border-gray-600 transition-colors">
                <p className="text-gray-400 font-bold text-sm sm:text-base md:text-lg">Wired UK</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-4 sm:p-6 flex items-center justify-center h-20 sm:h-24 border border-gray-700 hover:border-gray-600 transition-colors col-span-2 sm:col-span-1">
                <p className="text-gray-400 font-bold text-sm sm:text-base md:text-lg">Evening Standard</p>
              </div>
            </div>

            {/* Featured Quote */}
            <div className="mt-6 sm:mt-10 pt-6 sm:pt-10 border-t border-gray-800">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6 max-w-3xl mx-auto">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-gray-300 italic text-sm sm:text-base mb-2 sm:mb-3">
                      "Lurexo is disrupting the ticketing industry with radical transparency. 
                      Their fan-first approach could reshape how we all buy tickets."
                    </p>
                    <p className="text-blue-400 text-xs sm:text-sm font-medium">— TechCrunch, October 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section - New! */}
        <section>
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3">Meet the Team</h2>
            <p className="text-gray-400 text-sm sm:text-base md:text-lg">Small team, big mission</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Founder */}
            <div className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800 hover:border-purple-500/30 transition-colors text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-purple-500/30">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-1">Tayo Odesanya</h3>
              <p className="text-purple-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Founder & CEO</p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                Filmmaker, storyteller, and tech founder dedicated to creating fairness and access in entertainment. Credits include Netflix, Apple TV+, Gucci, and Moncler
              </p>
              <div className="flex items-center justify-center gap-3">
                <button className="text-gray-400 hover:text-purple-400 transition-colors">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* CTO */}
            <div className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800 hover:border-blue-500/30 transition-colors text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-blue-500/30">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-1">TK Odesanya</h3>
              <p className="text-blue-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Chief Technology Officer</p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                Senior Full Stack Azure architect and developer with 30 years of professional work experience in C#, VB, .Net, SQL, Azure, JavaScript.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button className="text-gray-400 hover:text-blue-400 transition-colors">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Project Manager */}
            <div className="bg-gray-900 rounded-2xl p-5 sm:p-6 border border-gray-800 hover:border-green-500/30 transition-colors text-center">
              <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-green-500/30">
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-1">Femi Odesanya</h3>
              <p className="text-green-400 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Project Manager</p>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4">
                20+ years in Music Business. Live tour Management. Project Credit includes Ignitor US Tour feat Chris Brown, TY$ & Warner Music America.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button className="text-gray-400 hover:text-green-400 transition-colors">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Join Team CTA */}
          <div className="mt-6 sm:mt-10 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-xl p-6 sm:p-8 border border-purple-500/20 text-center">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Want to Join Us?</h3>
            <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-6">
              We're always looking for talented people who share our mission
            </p>
            <Link href="/contact">
              <button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base">
                Get in Touch
              </button>
            </Link>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="bg-gray-900 rounded-2xl p-6 sm:p-12 border border-gray-800">
          <h2 className="text-white font-bold text-2xl sm:text-3xl mb-6 sm:mb-8 text-center">What Makes Us Different</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {differences.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm sm:text-base mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 sm:p-8 border border-purple-500/20">
            <h3 className="text-white font-bold text-xl sm:text-2xl mb-2 sm:mb-3">Join the Movement</h3>
            <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 leading-relaxed">
              We're building the future of ticketing, and we want you to be part of it. Whether you're a fan 
              or an organizer, Lurexo is here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/how-it-works" className="flex-1">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2 sm:py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base">
                  How It Works
                </button>
              </Link>
              <Link href="/for-organizers" className="flex-1">
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2 sm:py-3 rounded-xl font-semibold transition-colors text-sm sm:text-base">
                  For Organizers
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800">
            <h3 className="text-white font-semibold text-lg sm:text-xl mb-2 sm:mb-3">Have Questions?</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
              We'd love to hear from you. Get in touch with our team.
            </p>
            <Link href="/contact">
              <button className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 sm:py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                Contact Us
              </button>
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Mobile App Download - Only visible on mobile */}
          <div className="block sm:hidden mb-6">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-center">
              <Smartphone className="w-8 h-8 text-white mx-auto mb-2" />
              <h3 className="text-white font-bold text-sm mb-1">Download the Lurexo App</h3>
              <p className="text-white/80 text-xs mb-3">Get tickets on the go</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors">
                  App Store
                </button>
                <button className="flex-1 bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg text-xs font-semibold transition-colors">
                  Google Play
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
            <Link href="/how-it-works" className="text-gray-400 hover:text-purple-400 transition-colors">
              How it Works
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/for-organizers" className="text-gray-400 hover:text-purple-400 transition-colors">
              For Organizers
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/contact" className="text-gray-400 hover:text-purple-400 transition-colors">
              Contact Us
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/terms" className="text-gray-400 hover:text-purple-400 transition-colors">
              Terms of Service
            </Link>
          </div>
          <p className="text-center text-gray-600 text-xs mt-4 sm:mt-6">
            © 2025 Lurexo Ltd. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}