'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Lurexo fairness facts
const facts = [
  {
    icon: "🛡️",
    title: "Price Cap Protection",
    description: "We cap ticket resales at 110% of face value - because fair pricing isn't optional, it's the law."
  },
  {
    icon: "🤖",
    title: "Bot-Free Zone",
    description: "Advanced verification prevents bots from bulk-buying tickets. Real fans get real access."
  },
  {
    icon: "💰",
    title: "No Hidden Fees",
    description: "What you see is what you pay. No surprise charges at checkout. Ever."
  },
  {
    icon: "🔄",
    title: "Free Transfers",
    description: "Can't make it? Transfer your tickets to friends instantly at no extra cost."
  },
  {
    icon: "📱",
    title: "Digital-First Tickets",
    description: "Secure NFT-based tickets with artistic QR codes. Your ticket is a collectible."
  },
  {
    icon: "🎨",
    title: "Support Artists",
    description: "More revenue goes to creators and organizers, not middlemen charging excessive fees."
  },
  {
    icon: "🔒",
    title: "Secure & Verified",
    description: "Blockchain-backed ticket authentication means no counterfeits, no scams."
  },
  {
    icon: "⚡",
    title: "Lightning Fast",
    description: "Mobile-first checkout designed for speed. Get your tickets in seconds, not minutes."
  },
  {
    icon: "🌍",
    title: "Built for Fans",
    description: "Created by people who love live events, frustrated by unfair ticketing practices."
  },
  {
    icon: "📊",
    title: "Transparent Analytics",
    description: "Organizers get real-time insights into sales, attendance, and audience engagement."
  }
];

export default function MaintenancePage() {
  const router = useRouter();
  const TOTAL_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
  // FOR TESTING: Uncomment line below to test in 10 seconds
  // const TOTAL_DURATION = 10 * 1000;
  
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_DURATION);
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  // Initialize particles
  useEffect(() => {
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 15,
      duration: 15 + Math.random() * 10
    }));
    setParticles(newParticles);
  }, []);

  // Progress and timer logic
  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + TOTAL_DURATION;

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = now - startTime;
      const remaining = Math.max(0, endTime - now);
      const currentProgress = Math.min(100, (elapsed / TOTAL_DURATION) * 100);

      setProgress(currentProgress);
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsComplete(true);
        
        // Redirect after 5 seconds
        setTimeout(() => {
          router.push('/');
        }, 5000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [router, TOTAL_DURATION]);

  // Rotate facts every 8 seconds
  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % facts.length);
    }, 8000);

    return () => clearInterval(factInterval);
  }, []);

  // Format time as MM:SS
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentFact = facts[currentFactIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-500/30 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Logo */}
        <div className="text-center mb-12 sm:mb-16 animate-fade-in-down">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
            LUREXO
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm tracking-[0.2em] uppercase">
            Fair Ticketing
          </p>
        </div>

        {/* Ticket Container */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 sm:p-8 md:p-12 shadow-2xl relative overflow-hidden animate-fade-in-up">
          {/* Perforated edges */}
          <div className="absolute top-0 left-0 right-0 h-5 bg-repeat-x opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle, rgb(15 15 35) 40%, transparent 40%)',
              backgroundSize: '20px 20px',
              animation: 'perforate 2s ease-in-out infinite'
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-repeat-x opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle, rgb(15 15 35) 40%, transparent 40%)',
              backgroundSize: '20px 20px',
              animation: 'perforate 2s ease-in-out infinite reverse'
            }}
          />

          {/* Header */}
          <div className="text-center mb-8 sm:mb-10 pt-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              🎫 Printing Your Experience...
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">
              We're upgrading our platform to serve you{' '}
              <span className="bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent font-semibold">
                fairer, faster, better
              </span>
            </p>
          </div>

          {/* Printing animation line */}
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full mb-8 animate-scan" />

          {/* Progress Section */}
          {!isComplete ? (
            <>
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-sm font-medium">
                    Ticket Generation Progress
                  </span>
                  <span className="text-purple-500 font-bold text-base tabular-nums">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-3 bg-gray-900/50 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-linear shadow-lg shadow-purple-500/50 animate-shimmer"
                    style={{ 
                      width: `${progress}%`,
                      backgroundSize: '200% 100%'
                    }}
                  />
                </div>
                
                <div className="text-center mt-3">
                  <span className="text-white text-2xl sm:text-3xl font-bold tabular-nums">
                    {Math.floor(progress)}%
                  </span>
                </div>
              </div>

              {/* Facts Section */}
              <div className="min-h-[120px] sm:min-h-[140px]">
                <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-5 sm:p-6 animate-fade-in">
                  <div className="text-3xl sm:text-4xl mb-3">{currentFact.icon}</div>
                  <h3 className="text-white text-base sm:text-lg font-semibold mb-2">
                    {currentFact.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {currentFact.description}
                  </p>
                </div>
              </div>
            </>
          ) : (
            /* QR Code Section - Shown at completion */
            <div className="text-center animate-fade-in">
              {/* QR Code */}
              <div className="w-32 h-32 sm:w-40 sm:h-40 mx-auto mb-6 bg-white rounded-xl p-4 animate-scan-qr shadow-2xl">
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="0" width="20" height="20" fill="#000"/>
                  <rect x="80" y="0" width="20" height="20" fill="#000"/>
                  <rect x="0" y="80" width="20" height="20" fill="#000"/>
                  <rect x="30" y="10" width="10" height="10" fill="#000"/>
                  <rect x="50" y="10" width="10" height="10" fill="#000"/>
                  <rect x="70" y="10" width="10" height="10" fill="#000"/>
                  <rect x="10" y="30" width="10" height="10" fill="#000"/>
                  <rect x="30" y="30" width="10" height="10" fill="#000"/>
                  <rect x="50" y="30" width="10" height="10" fill="#000"/>
                  <rect x="70" y="30" width="10" height="10" fill="#000"/>
                  <rect x="90" y="30" width="10" height="10" fill="#000"/>
                  <rect x="10" y="50" width="10" height="10" fill="#000"/>
                  <rect x="30" y="50" width="10" height="10" fill="#000"/>
                  <rect x="60" y="50" width="10" height="10" fill="#000"/>
                  <rect x="90" y="50" width="10" height="10" fill="#000"/>
                  <rect x="30" y="70" width="10" height="10" fill="#000"/>
                  <rect x="50" y="70" width="10" height="10" fill="#000"/>
                  <rect x="70" y="70" width="10" height="10" fill="#000"/>
                  <rect x="10" y="90" width="10" height="10" fill="#000"/>
                  <rect x="50" y="90" width="10" height="10" fill="#000"/>
                  <rect x="90" y="90" width="10" height="10" fill="#000"/>
                </svg>
              </div>

              {/* Validation Badge */}
              <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-6 py-3 rounded-full font-semibold text-base sm:text-lg mb-5 animate-check-pulse border border-green-500/30">
                <span>✓</span>
                <span>Ticket Validated</span>
              </div>

              {/* Messages */}
              <p className="text-white text-xl sm:text-2xl font-semibold mb-3">
                Maintenance Complete!
              </p>
              <p className="text-gray-400 text-sm">
                Redirecting you to the show in 5 seconds...
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px); opacity: 0; }
        }
        
        @keyframes perforate {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        
        @keyframes scan {
          0%, 100% { opacity: 0.3; transform: scaleX(0.8); }
          50% { opacity: 1; transform: scaleX(1); }
        }
        
        @keyframes shimmer {
          0%, 100% { background-position: 0% 0%; }
          50% { background-position: 100% 0%; }
        }
        
        @keyframes scan-qr {
          0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
          50% { transform: scale(1.1) rotate(2deg); }
          100% { opacity: 1; transform: scale(1) rotate(0deg); }
        }
        
        @keyframes check-pulse {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-float {
          animation: float 15s infinite;
        }
        
        .animate-scan {
          animation: scan 2s ease-in-out infinite;
        }
        
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        
        .animate-scan-qr {
          animation: scan-qr 1.5s ease-out;
        }
        
        .animate-check-pulse {
          animation: check-pulse 0.6s ease-out;
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        
        .animate-fade-in-down {
          animation: fade-in-down 0.8s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
      `}</style>
    </div>
  );
}