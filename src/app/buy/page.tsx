"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function BuyPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTestMode, setIsTestMode] = useState(true); // Default to test mode
  const [mounted, setMounted] = useState(false);

  // Fix hydration mismatch by setting the correct mode after mount
  useEffect(() => {
    setMounted(true);
    setIsTestMode(process.env.NEXT_PUBLIC_STRIPE_MODE !== 'live');
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleCheckout = async () => {
    setError(null);
    
    // Enhanced validation
    if (!email.trim()) { 
      setError('Please enter your email address'); 
      return; 
    }
    
    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    
    try {
      // Step 1: Authenticate user
      const authResponse = await axios.post('/api/auth/login', { 
        email: email.trim().toLowerCase() 
      });
      
      if (!authResponse.data.ok) {
        throw new Error('Authentication failed');
      }

      // Step 2: Create checkout session
      const checkoutResponse = await axios.post('/api/checkout/session', { 
        email: email.trim().toLowerCase() 
      });
      
      if (checkoutResponse.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = checkoutResponse.data.url;
      } else {
        throw new Error('Failed to create checkout session');
      }
    } catch (e: any) {
      console.error('Checkout error:', e);
      
      // Enhanced error handling
      if (e.response?.status === 400) {
        setError(e.response.data.error || 'Invalid email format');
      } else if (e.response?.status === 500) {
        setError('Payment service temporarily unavailable. Please try again later.');
      } else if (e.code === 'NETWORK_ERROR' || !e.response) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(e.response?.data?.error || 'Checkout error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-[--muted]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-[--teal] mb-4">Buy the $7 Bundle</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[--teal] to-[--gold] rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-[--muted] max-w-2xl mx-auto">
            Get instant access to our curated public-domain vault and automatically earn a raffle ticket for our daily draws.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Checkout Form */}
          <div className="card p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-serif text-[--teal] mb-2">Secure Checkout</h2>
              <p className="text-[--muted]">Powered by Stripe</p>
            </div>

            {/* Test/Live Mode Toggle */}
            <div className="flex items-center justify-center gap-4 p-4 bg-[--gold]/10 rounded-lg">
              <span className={`text-sm font-medium ${isTestMode ? 'text-[--warning]' : 'text-[--success]'}`}>
                {isTestMode ? '🧪 Test Mode' : '🚀 Live Mode'}
              </span>
              <button
                onClick={() => setIsTestMode(!isTestMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  isTestMode ? 'bg-[--warning]' : 'bg-[--success]'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    isTestMode ? 'translate-x-1' : 'translate-x-6'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[--teal] mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckout()}
                />
              </div>

              {error && (
                <div className="status-error p-4 rounded-lg flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={loading || !email}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner"></div>
                    Redirecting to Stripe...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Checkout $7.00
                  </div>
                )}
              </button>
            </div>

            {/* Test Card Info */}
            {isTestMode && (
              <div className="status-info p-4 rounded-lg">
                <h3 className="font-semibold text-[--info] mb-2">Test Card Information</h3>
                <div className="text-sm space-y-1">
                  <div><strong>Card:</strong> 4242 4242 4242 4242</div>
                  <div><strong>Date:</strong> Any future date (e.g., 12/25)</div>
                  <div><strong>CVC:</strong> Any 3 digits (e.g., 123)</div>
                  <div><strong>ZIP:</strong> Any ZIP code (e.g., 12345)</div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits & Info */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-2xl font-serif text-[--teal] mb-4">What You Get</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[--success] text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <div>
                    <div className="font-semibold text-[--teal]">Curated Public-Domain Content</div>
                    <div className="text-sm text-[--muted]">High-quality digital assets and resources</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[--success] text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <div>
                    <div className="font-semibold text-[--teal]">Automatic Raffle Ticket</div>
                    <div className="text-sm text-[--muted]">1 ticket added instantly after payment</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[--success] text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <div>
                    <div className="font-semibold text-[--teal]">Daily Draw Eligibility</div>
                    <div className="text-sm text-[--muted]">Enter our daily micro prize draws</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[--success] text-white rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                  <div>
                    <div className="font-semibold text-[--teal]">Referral Access</div>
                    <div className="text-sm text-[--muted]">Unlock referral tracking and boosted odds</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-2xl font-serif text-[--teal] mb-4">Quick Links</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/winners" className="btn-ghost text-center py-3">
                  🏆 Winners
                </Link>
                <Link href="/leaderboard" className="btn-ghost text-center py-3">
                  📊 Leaderboard
                </Link>
                <Link href="/widgets" className="btn-ghost text-center py-3">
                  🎮 Widgets
                </Link>
                <Link href="/referral" className="btn-ghost text-center py-3">
                  🔗 Referral
                </Link>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-[--teal]/5 to-[--gold]/5">
              <h3 className="text-xl font-serif text-[--teal] mb-3">Security & Trust</h3>
              <div className="flex items-center gap-4 text-sm text-[--muted]">
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-[--success]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  SSL Secured
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-[--success]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Stripe Powered
                </div>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-[--success]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Instant Access
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
