"use client";
import useSWR from 'swr';
import axios from 'axios';
import Link from 'next/link';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ReferralPage() {
  const { data } = useSWR('/api/me', fetcher);
  const authed = data?.authed;
  const user = data?.user;

  if (!authed) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-[--warning]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[--warning]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-[--teal] mb-4">Access Restricted</h1>
            <p className="text-lg text-[--muted] mb-6">
              The referral & odds tracker is only available to logged-in users who have purchased a bundle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy" className="btn-primary">
                🛒 Buy Bundle
              </Link>
              <Link href="/leaderboard" className="btn-ghost">
                📊 View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user?.tickets <= 0) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="card p-8 text-center">
            <div className="w-20 h-20 bg-[--info]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[--info]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h1 className="text-3xl font-serif text-[--teal] mb-4">Purchase Required</h1>
            <p className="text-lg text-[--muted] mb-6">
              You need at least one raffle ticket to access the referral tracker. Purchase a bundle to unlock this feature!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy" className="btn-primary">
                🛒 Buy Bundle
              </Link>
              <Link href="/leaderboard" className="btn-ghost">
                📊 View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-[--teal] mb-4">Referral & Odds Tracker</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[--teal] to-[--gold] rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-[--muted] max-w-2xl mx-auto">
            Track your referrals and boost your odds in our daily draws. The more you refer, the better your chances!
          </p>
        </div>

        {/* User Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--teal-light] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">{user.tickets}</div>
            <div className="text-sm text-[--muted]">Your Tickets</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--gold] to-[--gold-light] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[--teal-dark]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">{user.referrals}</div>
            <div className="text-sm text-[--muted]">Your Referrals</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--gold] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">{user.tickets + user.referrals}</div>
            <div className="text-sm text-[--muted]">Total Score</div>
          </div>
        </div>

        {/* Referral Tracker Widget */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-[--gold]/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif text-[--teal] mb-2">Advanced Referral Tracker</h2>
                <p className="text-[--muted]">Monitor your referral performance and odds in real-time</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[--success]/10 text-[--success] rounded-full text-sm">
                <div className="w-2 h-2 bg-[--success] rounded-full animate-pulse"></div>
                Live Data
              </div>
            </div>
          </div>
          
          <div className="aspect-video w-full">
            <iframe 
              src="https://cosmic-kulfi-c967d9.netlify.app/#referral" 
              className="w-full h-full border-0" 
              title="Referral & Odds Tracker"
            />
          </div>
        </div>

        {/* How Referrals Work */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div className="card p-6">
            <h3 className="text-xl font-serif text-[--teal] mb-4">How Referrals Work</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[--teal] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <div className="font-semibold text-[--teal]">Share Your Link</div>
                  <div className="text-sm text-[--muted]">Get your unique referral link from the tracker above</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[--teal] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <div className="font-semibold text-[--teal]">Friends Purchase</div>
                  <div className="text-sm text-[--muted]">When someone buys a bundle using your link, you get credit</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[--teal] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <div className="font-semibold text-[--teal]">Boost Your Odds</div>
                  <div className="text-sm text-[--muted]">Each referral increases your chances in daily draws</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-xl font-serif text-[--teal] mb-4">Benefits of Referring</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[--gold] text-[--teal-dark] rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                <div>
                  <div className="font-semibold text-[--teal]">Increased Odds</div>
                  <div className="text-sm text-[--muted]">More referrals = better chances of winning</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[--gold] text-[--teal-dark] rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                <div>
                  <div className="font-semibold text-[--teal]">Leaderboard Ranking</div>
                  <div className="text-sm text-[--muted]">Climb the ranks with more referrals</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-[--gold] text-[--teal-dark] rounded-full flex items-center justify-center text-sm font-bold">✓</div>
                <div>
                  <div className="font-semibold text-[--teal]">Community Growth</div>
                  <div className="text-sm text-[--muted]">Help grow TheTop36 community</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="card p-8 bg-gradient-to-br from-[--teal]/5 to-[--gold]/5">
            <h3 className="text-2xl font-serif text-[--teal] mb-4">Ready to Start Referring?</h3>
            <p className="text-[--muted] mb-6 max-w-2xl mx-auto">
              Use the tracker above to get your referral link and start sharing with friends. 
              The more people you refer, the better your chances of winning our daily prizes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy" className="btn-primary">
                🛒 Buy More Bundles
              </Link>
              <Link href="/leaderboard" className="btn-ghost">
                📊 View Leaderboard
              </Link>
              <Link href="/winners" className="btn-ghost">
                🏆 See Winners
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
