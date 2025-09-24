"use client";
import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function LeaderboardPage() {
  const { data, mutate } = useSWR('/api/leaderboard', fetcher, { refreshInterval: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const ev = new EventSource('/api/realtime/stream');
    
    ev.onopen = () => {
      setIsConnected(true);
    };
    
    ev.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'leaderboard_update') {
          setLastUpdate(new Date());
          mutate();
        }
      } catch {}
    };
    
    ev.onerror = () => {
      setIsConnected(false);
    };
    
    return () => ev.close();
  }, [mutate]);

  const users = data?.users || [];
  const totalUsers = users.length;
  const totalTickets = users.reduce((sum: number, user: any) => sum + user.tickets, 0);
  const totalReferrals = users.reduce((sum: number, user: any) => sum + user.referrals, 0);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-[--teal] mb-4">Leaderboard</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[--teal] to-[--gold] rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-[--muted] max-w-2xl mx-auto">
            Real-time rankings of our community members. See who's leading the pack!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--teal-light] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">{totalUsers}</div>
            <div className="text-sm text-[--muted]">Total Players</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--gold] to-[--gold-light] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[--teal-dark]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">{totalTickets}</div>
            <div className="text-sm text-[--muted]">Total Tickets</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--gold] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">{totalReferrals}</div>
            <div className="text-sm text-[--muted]">Total Referrals</div>
          </div>
        </div>

        {/* Connection Status */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
            isConnected ? 'bg-[--success]/10 text-[--success]' : 'bg-[--error]/10 text-[--error]'
          }`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[--success] animate-pulse' : 'bg-[--error]'}`}></div>
            {isConnected ? 'Live Updates Active' : 'Connecting...'}
          </div>
          {lastUpdate && (
            <div className="text-sm text-[--muted]">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Leaderboard Table */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-[--gold]/30">
            <h2 className="text-2xl font-serif text-[--teal] mb-2">Top Players</h2>
            <p className="text-[--muted]">Ranked by tickets and referrals</p>
          </div>
          
          {users.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[--gold]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[--muted]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[--teal] mb-2">No Players Yet</h3>
              <p className="text-[--muted] mb-6">Be the first to join the leaderboard!</p>
              <Link href="/buy" className="btn-primary">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-[--ivory] to-[--gold]/10">
                  <tr>
                    <th className="text-left p-4 font-semibold text-[--teal]">Rank</th>
                    <th className="text-left p-4 font-semibold text-[--teal]">Player</th>
                    <th className="text-center p-4 font-semibold text-[--teal]">Tickets</th>
                    <th className="text-center p-4 font-semibold text-[--teal]">Referrals</th>
                    <th className="text-center p-4 font-semibold text-[--teal]">Total Score</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any, index: number) => {
                    const rank = index + 1;
                    const totalScore = user.tickets + user.referrals;
                    const isTopThree = rank <= 3;
                    
                    return (
                      <tr 
                        key={user.email} 
                        className={`border-t border-[--gold]/20 hover:bg-[--gold]/5 transition-colors duration-200 ${
                          isTopThree ? 'bg-gradient-to-r from-[--gold]/5 to-transparent' : ''
                        }`}
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {rank === 1 && <span className="text-2xl">🥇</span>}
                            {rank === 2 && <span className="text-2xl">🥈</span>}
                            {rank === 3 && <span className="text-2xl">🥉</span>}
                            {rank > 3 && (
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                isTopThree ? 'bg-[--gold] text-[--teal-dark]' : 'bg-[--teal] text-white'
                              }`}>
                                {rank}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[--teal] to-[--teal-light] rounded-full flex items-center justify-center text-white font-bold">
                              {user.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-[--teal]">{user.email}</div>
                              <div className="text-sm text-[--muted]">Player #{rank}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-[--teal]">{user.tickets}</span>
                            <svg className="w-5 h-5 text-[--teal]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-[--teal]">{user.referrals}</span>
                            <svg className="w-5 h-5 text-[--teal]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-2xl font-bold text-[--gold]">{totalScore}</span>
                            <svg className="w-5 h-5 text-[--gold]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="card p-8 bg-gradient-to-br from-[--teal]/5 to-[--gold]/5">
            <h3 className="text-2xl font-serif text-[--teal] mb-4">Join the Competition!</h3>
            <p className="text-[--muted] mb-6 max-w-2xl mx-auto">
              Purchase a bundle to get your first raffle ticket and start climbing the leaderboard. 
              Refer friends to boost your score even higher!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy" className="btn-primary">
                🛒 Buy Bundle
              </Link>
              <Link href="/referral" className="btn-ghost">
                🔗 Referral Tracker
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
