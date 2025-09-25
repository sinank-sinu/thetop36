"use client";
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

function SuccessPageContent() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState<'pending' | 'ok' | 'unpaid' | 'error'>('pending');
  const [message, setMessage] = useState('Confirming payment…');
  const [user, setUser] = useState<{ email: string; tickets: number; referrals: number } | null>(null);

  useEffect(() => {
    async function confirm() {
      if (!sessionId) return;
      
      // Add a small delay to allow webhook to process first
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        const { data } = await axios.post('/api/checkout/confirm', { session_id: sessionId });
        if (data?.ok) {
          setStatus('ok');
          if (data.processed) {
            setMessage('Payment confirmed! Your ticket has been added.');
          } else {
            setMessage('Payment confirmed! Your ticket was already added.');
          }
          setUser(data.user);
        } else {
          setStatus('unpaid');
          setMessage('Payment not completed. No ticket was added.');
        }
            } catch (e: unknown) {
        console.error('Payment confirmation error:', e);
        setStatus('error');
        setMessage(e && typeof e === 'object' && 'response' in e ? 
          (e as { response?: { data?: { error?: string } } }).response?.data?.error || 'Error confirming payment' : 
          'Error confirming payment');
      }
    }
    confirm();
  }, [sessionId]);

  const getStatusIcon = () => {
    switch (status) {
      case 'ok':
        return (
          <div className="w-20 h-20 bg-[--success] rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'unpaid':
        return (
          <div className="w-20 h-20 bg-[--warning] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'error':
        return (
          <div className="w-20 h-20 bg-[--error] rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-20 h-20 bg-[--info] rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="spinner w-8 h-8"></div>
          </div>
        );
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'ok': return 'text-[--success]';
      case 'unpaid': return 'text-[--warning]';
      case 'error': return 'text-[--error]';
      default: return 'text-[--info]';
    }
  };

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4">
        <div className="card p-8 text-center space-y-6">
          {getStatusIcon()}
          
          <div className="space-y-4">
            <h1 className={`text-4xl font-serif ${getStatusColor()} mb-2`}>
              {status === 'ok' ? 'Payment Successful!' : 
               status === 'unpaid' ? 'Payment Incomplete' :
               status === 'error' ? 'Payment Error' : 'Processing...'}
            </h1>
            
            <div className="w-24 h-1 bg-gradient-to-r from-[--teal] to-[--gold] rounded-full mx-auto"></div>
            
            <p className="text-lg text-[--muted] leading-relaxed">
              {message}
            </p>
          </div>

          {status === 'ok' && user && (
            <div className="card p-6 bg-gradient-to-br from-[--success]/10 to-[--teal]/10 border border-[--success]/20">
              <h3 className="text-xl font-serif text-[--teal] mb-4">Your Account Status</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-[--teal]">{user.tickets}</div>
                  <div className="text-sm text-[--muted]">Raffle Tickets</div>
                </div>
                <div className="p-4 bg-white/50 rounded-lg">
                  <div className="text-2xl font-bold text-[--teal]">{user.referrals}</div>
                  <div className="text-sm text-[--muted]">Referrals</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xl font-serif text-[--teal]">What&apos;s Next?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <Link href="/leaderboard" className="btn-primary group">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  View Leaderboard
                </div>
              </Link>
              <Link href="/winners" className="btn-ghost group">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  See Winners
                </div>
              </Link>
              <Link href="/referral" className="btn-ghost group">
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Referral Tracker
                </div>
              </Link>
            </div>
          </div>

          {status !== 'ok' && (
            <div className="pt-4">
              <Link href="/buy" className="btn-primary">
                Try Again
              </Link>
            </div>
          )}

          <div className="pt-6 border-t border-[--gold]/30">
            <p className="text-sm text-[--muted]">
              Need help? Contact us at support@thetop36.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-[--muted]">Loading...</p>
        </div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
