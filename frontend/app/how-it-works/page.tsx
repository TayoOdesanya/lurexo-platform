'use client';

import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Search,
  CreditCard,
  Ticket,
  Smartphone,
  Shield,
  Users,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Download,
  Star,
  Zap,
  Bell,
  TrendingUp,
  HelpCircle
} from 'lucide-react';
import Link from 'next/link';

export default function HowItWorksPage() {
  const router = useRouter();

  const steps = [
    {
      number: 1,
      title: 'Browse Events',
      description: 'Search for events by artist, venue, date, or location. Filter by category, price range, and more to find exactly what you\'re looking for.',
      icon: Search,
      color: 'purple',
      features: [
        'Smart search with filters',
        'Personalized recommendations',
        'Event notifications & reminders'
      ]
    },
    {
      number: 2,
      title: 'Select Your Tickets',
      description: 'Choose your tickets with transparent pricing—no hidden fees, ever. The price you see is the final price you pay.',
      icon: Ticket,
      color: 'blue',
      features: [
        'Interactive seat maps',
        'Real-time availability',
        'Transparent all-in pricing'
      ]
    },
    {
      number: 3,
      title: 'Secure Checkout',
      description: 'Complete your purchase quickly and securely with your preferred payment method. Bank-level encryption protects every transaction.',
      icon: CreditCard,
      color: 'green',
      features: [
        'Multiple payment options',
        'Encrypted transactions',
        'Instant confirmation'
      ]
    },
    {
      number: 4,
      title: 'Access Your Tickets',
      description: 'Get instant access to your digital tickets. Add them to your mobile wallet or download as PDF for offline access.',
      icon: Smartphone,
      color: 'orange',
      features: [
        'Instant digital delivery',
        'Apple Wallet & Google Pay',
        'Always accessible offline'
      ]
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'No Hidden Fees',
      description: 'The price you see is the price you pay. No surprise charges at checkout.',
      color: 'purple'
    },
    {
      icon: Users,
      title: 'Free Transfers',
      description: 'Transfer tickets to friends at no cost. Your tickets, your choice.',
      color: 'blue'
    },
    {
      icon: RefreshCw,
      title: 'Fair Resale',
      description: 'Resale prices capped at 110% to prevent price gouging.',
      color: 'green'
    },
    {
      icon: TrendingUp,
      title: 'Secure Platform',
      description: 'Bank-level encryption and fraud protection on every transaction.',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      purple: {
        bg: 'bg-purple-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        gradient: 'from-purple-600 to-purple-500'
      },
      blue: {
        bg: 'bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        gradient: 'from-blue-600 to-blue-500'
      },
      green: {
        bg: 'bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30',
        gradient: 'from-green-600 to-green-500'
      },
      orange: {
        bg: 'bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        gradient: 'from-orange-600 to-orange-500'
      }
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
                <h1 className="text-white font-bold text-sm sm:text-lg">How It Works</h1>
                <p className="text-gray-400 text-xs">Your guide to using Lurexo</p>
              </div>
              <div className="sm:hidden">
                <h1 className="text-white font-bold text-sm">How It Works</h1>
              </div>
            </Link>
          </div>
          
          <Link href="/faq">
            <button className="bg-gray-800 hover:bg-gray-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors text-xs sm:text-base">
              View FAQ
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
            <h1 className="text-white font-bold text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">Ticketing Made Simple</h1>
            <p className="text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed mb-6 sm:mb-8">
              Get tickets to your favorite events in 4 easy steps. No complicated processes, 
              no hidden fees—just fair, transparent ticketing that works for you.
            </p>

            {/* Key Benefits - Mobile: 2x2, Desktop: 4 columns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-purple-500/20">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-xs sm:text-sm mb-1">No Hidden Fees</p>
                <p className="text-gray-400 text-xs">Final price upfront</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-blue-500/20">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-xs sm:text-sm mb-1">Instant Access</p>
                <p className="text-gray-400 text-xs">Tickets in seconds</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-green-500/20">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-xs sm:text-sm mb-1">Free Transfers</p>
                <p className="text-gray-400 text-xs">Share with friends</p>
              </div>
              <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-orange-500/20">
                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-xs sm:text-sm mb-1">Fair Resale</p>
                <p className="text-gray-400 text-xs">Max 110% cap</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-16 sm:space-y-20">
        {/* Step-by-Step Guide */}
        <section>
          <h2 className="text-white font-bold text-2xl sm:text-3xl mb-8 sm:mb-12 text-center">Getting Your Tickets</h2>
          <div className="space-y-12 sm:space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const colors = getColorClasses(step.color);
              const isEven = index % 2 === 0;

              // Testimonials for each step
              const testimonials = [
                { text: "Finding events is so much easier than other platforms!", author: "Sarah M." },
                { text: "I love seeing the final price upfront. No surprises!", author: "James K." },
                { text: "Checkout took literally 30 seconds. Super smooth.", author: "Emma L." },
                { text: "Having tickets in my Apple Wallet is a game changer!", author: "Marcus T." }
              ];

              return (
                <div key={step.number} className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${!isEven ? 'direction-reverse' : ''}`}>
                  {/* Content */}
                  <div className={isEven ? 'order-1' : 'lg:order-2'}>
                    <div className="flex items-center gap-3 mb-3 sm:mb-4">
                      <span className={`${colors.text} font-bold text-xs sm:text-sm`}>STEP {step.number}</span>
                      <div className="h-px flex-1 bg-gray-800"></div>
                    </div>
                    <h3 className="text-white font-bold text-2xl sm:text-3xl mb-3 sm:mb-4">{step.title}</h3>
                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                      {step.description}
                    </p>
                    <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 sm:gap-3">
                          <CheckCircle className={`w-4 h-4 sm:w-5 sm:h-5 ${colors.text} flex-shrink-0`} />
                          <span className="text-gray-400 text-sm sm:text-base">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Testimonial */}
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
                      <div className="flex items-start gap-2 sm:gap-3">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-gray-300 text-xs sm:text-sm italic mb-2">"{testimonials[index].text}"</p>
                          <p className="text-gray-500 text-xs">— {testimonials[index].author}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual with Video Placeholder */}
                  <div className={isEven ? 'order-2' : 'lg:order-1'}>
                    <div className={`bg-gray-900 rounded-2xl border border-gray-800 relative overflow-hidden min-h-[300px] sm:min-h-[400px] flex flex-col items-center justify-center`}>
                      {/* Video Placeholder Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${
                        step.color === 'purple' ? 'from-purple-900/20 to-purple-800/10' :
                        step.color === 'blue' ? 'from-blue-900/20 to-blue-800/10' :
                        step.color === 'green' ? 'from-green-900/20 to-green-800/10' :
                        'from-orange-900/20 to-orange-800/10'
                      }`}></div>
                      
                      {/* Subtle pattern overlay */}
                      <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                      }}></div>

                      <div className="relative z-10 text-center px-4">
                        {/* Play Button */}
                        <button className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all hover:scale-110 group mb-4 sm:mb-6 shadow-2xl">
                          <div className="w-0 h-0 border-t-[10px] sm:border-t-[12px] border-t-transparent border-l-[16px] sm:border-l-[20px] border-l-white border-b-[10px] sm:border-b-[12px] border-b-transparent ml-1 sm:ml-2 group-hover:border-l-gray-200"></div>
                        </button>
                        <p className="text-white font-semibold text-base sm:text-lg mb-1">Watch Demo</p>
                        <p className="text-gray-400 text-sm">{step.title}</p>
                        <p className="text-gray-600 text-xs mt-2">(Video coming soon)</p>
                      </div>

                      {/* Duration Badge */}
                      <div className={`absolute top-3 sm:top-4 right-3 sm:right-4 ${colors.bg} backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border ${colors.border}`}>
                        <p className={`${colors.text} text-xs sm:text-sm font-semibold`}>{30 + (index * 15)} sec</p>
                      </div>

                      {/* Step indicator badge */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 bg-black/50 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                        <p className="text-white text-xs sm:text-sm font-medium">Step {step.number} of 4</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why Choose Lurexo - Mobile: 2x2, Desktop: 4 columns */}
        <section>
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-3 sm:mb-4">Why Choose Lurexo?</h2>
            <p className="text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
              We're different from other ticketing platforms. Here's how.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const colors = getColorClasses(benefit.color);

              return (
                <div key={index} className="bg-gray-900 rounded-2xl p-4 sm:p-6 border border-gray-800 hover:border-gray-700 transition-colors text-center">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                    <Icon className={`w-6 h-6 sm:w-8 sm:h-8 ${colors.text}`} />
                  </div>
                  <h3 className="text-white font-bold text-sm sm:text-base mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Comparison Section - Mobile: Stacked, Desktop: Side by Side */}
        <section className="bg-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-800">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3">See The Difference</h2>
            <p className="text-gray-400 text-base sm:text-lg">Real pricing comparison for a £50 ticket</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Lurexo Side */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-6 sm:p-8 relative">
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                LUREXO
              </div>
              
              <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-green-500/20">
                  <span className="text-gray-300 text-sm sm:text-base">Ticket Price</span>
                  <span className="text-white font-bold text-lg sm:text-xl">£50.00</span>
                </div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-green-500/20">
                  <div>
                    <span className="text-gray-300 text-sm sm:text-base">Service Fee</span>
                    <p className="text-gray-500 text-xs mt-0.5">Includes payment processing</p>
                  </div>
                  <span className="text-white font-bold text-lg sm:text-xl">£2.50</span>
                </div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-green-500/20">
                  <span className="text-gray-300 text-sm sm:text-base">Booking Fee</span>
                  <span className="text-green-400 font-bold text-lg sm:text-xl">£0.00</span>
                </div>
                <div className="flex items-center justify-between pt-3 sm:pt-4">
                  <span className="text-white font-bold text-base sm:text-lg">Total</span>
                  <span className="text-green-400 font-bold text-2xl sm:text-3xl">£52.50</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 space-y-2">
                <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Final price shown upfront</span>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Free ticket transfers</span>
                </div>
                <div className="flex items-center gap-2 text-green-400 text-xs sm:text-sm">
                  <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>110% resale price cap</span>
                </div>
              </div>
            </div>

            {/* Competitor Side */}
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-6 sm:p-8 relative opacity-75">
              <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold">
                TYPICAL COMPETITOR
              </div>
              
              <div className="mt-2 sm:mt-4 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-red-500/20">
                  <span className="text-gray-300 text-sm sm:text-base">Ticket Price</span>
                  <span className="text-white font-bold text-lg sm:text-xl">£50.00</span>
                </div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-red-500/20">
                  <div>
                    <span className="text-gray-300 text-sm sm:text-base">Service Fee</span>
                    <p className="text-gray-500 text-xs mt-0.5">Hidden until checkout</p>
                  </div>
                  <span className="text-white font-bold text-lg sm:text-xl">£7.50</span>
                </div>
                <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-red-500/20">
                  <span className="text-gray-300 text-sm sm:text-base">Booking Fee</span>
                  <span className="text-white font-bold text-lg sm:text-xl">£2.50</span>
                </div>
                <div className="flex items-center justify-between pt-3 sm:pt-4">
                  <span className="text-white font-bold text-base sm:text-lg">Total</span>
                  <span className="text-red-400 font-bold text-2xl sm:text-3xl">£60.00</span>
                </div>
              </div>

              <div className="mt-4 sm:mt-6 space-y-2">
                <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Hidden fees at checkout</span>
                </div>
                <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>Transfer fees apply</span>
                </div>
                <div className="flex items-center gap-2 text-red-400 text-xs sm:text-sm">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>No resale price cap</span>
                </div>
              </div>
            </div>
          </div>

          {/* Savings Highlight */}
          <div className="mt-6 sm:mt-8 bg-green-500/10 border border-green-500/30 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              <div className="text-center">
                <p className="text-white font-bold text-xl sm:text-2xl mb-1">Save £7.50 per ticket</p>
                <p className="text-green-400 text-xs sm:text-sm">That's 12.5% less than typical platforms</p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-6 sm:mt-8 text-center">
            <div className="bg-gray-800 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
              <div className="flex justify-center gap-1 mb-2 sm:mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-300 text-sm sm:text-base md:text-lg italic mb-2 sm:mb-3">
                "I bought 4 tickets for my family and saved £30 compared to Ticketmaster. 
                The whole process was transparent and easy!"
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">— Rachel P., London</p>
            </div>
          </div>
        </section>

        {/* Managing Your Tickets - Mobile: 1 col, Desktop: 3 cols */}
        <section className="bg-gray-900 rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-800">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2 sm:mb-3">Managing Your Tickets</h2>
            <p className="text-gray-400 text-base sm:text-lg">Everything you need to handle your tickets with ease</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Transfer */}
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-center">Transfer Tickets</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-center">
                Can't make it? Transfer your tickets to friends or family for free. Just enter their email and they'll get instant access.
              </p>
              
              {/* How it works */}
              <div className="space-y-2 mb-4 sm:mb-6">
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span className="text-gray-400">Select ticket to transfer</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span className="text-gray-400">Enter recipient's email</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span className="text-gray-400">They receive it instantly</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 text-blue-400 text-xs bg-blue-500/10 rounded-lg py-2">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">100% free • Takes 30 seconds</span>
              </div>
            </div>

            {/* Resell */}
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-green-500/50 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-green-400" />
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-center">Resell Tickets</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-center">
                List tickets on our marketplace at a fair price (max 110% of face value). Get paid fast when they sell.
              </p>

              {/* How it works */}
              <div className="space-y-2 mb-4 sm:mb-6">
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-green-400 font-bold">1.</span>
                  <span className="text-gray-400">List at fair price (max 110%)</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-green-400 font-bold">2.</span>
                  <span className="text-gray-400">Ticket appears in marketplace</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <span className="text-green-400 font-bold">3.</span>
                  <span className="text-gray-400">Get paid within 24 hours</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-green-400 text-xs bg-green-500/10 rounded-lg py-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Price protected • Safe & secure</span>
              </div>
            </div>

            {/* Download */}
            <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-700 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Download className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400" />
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 text-center">Download & Store</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 text-center">
                Access tickets anytime. Download as PDF, add to mobile wallet, or save screenshots for offline use.
              </p>

              {/* Options */}
              <div className="space-y-2 mb-4 sm:mb-6">
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <Smartphone className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mt-0.5" />
                  <span className="text-gray-400">Apple Wallet / Google Pay</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mt-0.5" />
                  <span className="text-gray-400">Download as PDF</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-purple-400 mt-0.5" />
                  <span className="text-gray-400">Secure QR codes (no screenshots needed)</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-purple-400 text-xs bg-purple-500/10 rounded-lg py-2">
                <Smartphone className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="font-medium">Always accessible offline</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-8 sm:mt-10 pt-8 sm:pt-10 border-t border-gray-800">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 sm:p-6 max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="text-blue-400 font-semibold text-sm sm:text-base mb-2">Need Help Managing Tickets?</h4>
                  <p className="text-blue-300/80 text-xs sm:text-sm mb-3 sm:mb-4">
                    Our comprehensive help guides cover everything from transfers to troubleshooting. 
                    Plus, our support team is available 24/7 if you get stuck.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <Link href="/help">
                      <button className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium">
                        View Help Guides →
                      </button>
                    </Link>
                    <Link href="/contact">
                      <button className="text-blue-400 hover:text-blue-300 text-xs sm:text-sm font-medium">
                        Contact Support →
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Event Day Tips - Mobile: Stacked, Desktop: Side by Side */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
              <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400 flex-shrink-0" />
              <div>
                <h3 className="text-blue-400 font-bold text-lg sm:text-xl mb-2">Event Day Tips</h3>
                <p className="text-blue-300/80 text-xs sm:text-sm">Make sure you're ready for the big day</p>
              </div>
            </div>
            <ul className="space-y-2 sm:space-y-3 text-blue-300/90 text-xs sm:text-sm">
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Have your ticket ready on your phone before you arrive</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Ensure your phone is charged (bring a portable charger)</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Add tickets to Apple/Google Wallet for offline access</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Arrive early to avoid queues at entry</span>
              </li>
              <li className="flex items-start gap-2 sm:gap-3">
                <span className="text-blue-400 mt-1">•</span>
                <span>Check venue rules and entry requirements beforehand</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl p-6 sm:p-8 border border-purple-500/20">
            <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3">Have Questions?</h3>
            <p className="text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6 leading-relaxed">
              Check out our FAQ for answers to common questions about buying, transferring, and using your tickets.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link href="/faq" className="flex-1">
                <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-colors text-xs sm:text-sm">
                  View FAQ
                </button>
              </Link>
              <Link href="/contact" className="flex-1">
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white py-2.5 sm:py-3 rounded-xl font-semibold transition-colors text-xs sm:text-sm">
                  Contact Support
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 sm:p-12 md:p-16 text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <Star className="w-12 h-12 sm:w-16 sm:h-16 text-white mx-auto mb-4 sm:mb-6" />
            <h3 className="text-white font-bold text-2xl sm:text-3xl md:text-4xl mb-3 sm:mb-4">Ready to Get Started?</h3>
            <p className="text-white/90 text-base sm:text-lg md:text-xl mb-4 sm:mb-6 max-w-2xl mx-auto">
              Join thousands of fans who've switched to fairer ticketing
            </p>

            {/* Social Proof - Mobile: 3 cols, Desktop: 3 cols with dividers */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-10">
              <div className="text-center">
                <p className="text-white font-bold text-2xl sm:text-3xl mb-1">100K+</p>
                <p className="text-white/80 text-xs sm:text-sm">Happy Fans</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <p className="text-white font-bold text-2xl sm:text-3xl mb-1">5,000+</p>
                <p className="text-white/80 text-xs sm:text-sm">Events</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-white/30"></div>
              <div className="text-center">
                <p className="text-white font-bold text-2xl sm:text-3xl mb-1">4.9★</p>
                <p className="text-white/80 text-xs sm:text-sm">Average Rating</p>
              </div>
            </div>

            <Link href="/">
              <button className="bg-white hover:bg-gray-100 text-purple-600 px-10 sm:px-12 md:px-16 py-3 sm:py-4 md:py-5 rounded-xl font-bold text-base sm:text-lg md:text-xl transition-colors shadow-2xl">
                Explore Events Now
              </button>
            </Link>

            <p className="text-white/70 text-xs sm:text-sm mt-4 sm:mt-6">
              No signup required to browse • Free to create account
            </p>
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
            <Link href="/about" className="text-gray-400 hover:text-purple-400 transition-colors">
              About Us
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/for-organizers" className="text-gray-400 hover:text-purple-400 transition-colors">
              For Organizers
            </Link>
            <span className="text-gray-700">•</span>
            <Link href="/help" className="text-gray-400 hover:text-purple-400 transition-colors">
              Help Center
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