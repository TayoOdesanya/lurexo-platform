'use client';

import { useState } from 'react';
import { Heart, Check, Loader2 } from 'lucide-react';

interface FollowButtonProps {
  organizerId: string;
  organizerName: string;
  isFollowing: boolean;
  onFollowChange: (following: boolean) => void;
  fullWidth?: boolean;
}

export default function FollowButton({
  organizerId,
  organizerName,
  isFollowing,
  onFollowChange,
  fullWidth = false
}: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleFollow = async () => {
    if (isFollowing) {
      // Unfollow immediately
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update local storage
      const following = JSON.parse(localStorage.getItem('following_organizers') || '[]');
      const updated = following.filter((id: string) => id !== organizerId);
      localStorage.setItem('following_organizers', JSON.stringify(updated));
      
      onFollowChange(false);
      setIsLoading(false);
    } else {
      // Show email prompt first
      setShowEmailPrompt(true);
    }
  };

  const confirmFollow = async () => {
    setIsLoading(true);
    
    // Simulate API call to follow organizer
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update local storage
    const following = JSON.parse(localStorage.getItem('following_organizers') || '[]');
    if (!following.includes(organizerId)) {
      following.push(organizerId);
      localStorage.setItem('following_organizers', JSON.stringify(following));
    }
    
    // Store email notification preference
    localStorage.setItem(`email_notifications_${organizerId}`, emailNotifications.toString());
    
    onFollowChange(true);
    setShowEmailPrompt(false);
    setIsLoading(false);
  };

  return (
    <>
      {/* Follow/Following Button */}
      <button
        onClick={handleFollow}
        disabled={isLoading}
        className={`
          ${fullWidth ? 'w-full' : 'flex-1'}
          flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50
          ${isFollowing 
            ? 'bg-gray-800 hover:bg-gray-700 text-white border-2 border-gray-700' 
            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
          }
        `}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : isFollowing ? (
          <>
            <Check className="w-5 h-5" />
            <span>Following</span>
          </>
        ) : (
          <>
            <Heart className="w-5 h-5" />
            <span>Follow</span>
          </>
        )}
      </button>

      {/* Email Notification Prompt Modal */}
      {showEmailPrompt && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-gray-800 animate-slide-up">
            {/* Header */}
            <div className="mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-bold text-xl text-center mb-2">
                Follow {organizerName}?
              </h3>
              <p className="text-gray-400 text-sm text-center">
                Get notified when they announce new events and exclusive updates
              </p>
            </div>

            {/* Email Notification Toggle */}
            <div className="bg-gray-800 rounded-xl p-4 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-5 h-5 mt-0.5 bg-gray-700 border-gray-600 rounded text-purple-600 focus:ring-purple-500 focus:ring-offset-gray-900"
                />
                <div className="flex-1">
                  <p className="text-white font-medium text-sm mb-1">
                    Email me about new events
                  </p>
                  <p className="text-gray-400 text-xs">
                    We'll send you notifications when {organizerName} creates new events. You can unsubscribe anytime.
                  </p>
                </div>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowEmailPrompt(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmFollow}
                disabled={isLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Following...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4" />
                    <span>Follow</span>
                  </>
                )}
              </button>
            </div>

            {/* Privacy Note */}
            <p className="text-gray-500 text-xs text-center mt-4">
              By following, you agree to receive notifications. See our Privacy Policy for details.
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}