"use client";
import useSWR from 'swr';
import axios from 'axios';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function WinnersPage() {
  const { data, mutate } = useSWR('/api/winners', fetcher, { refreshInterval: 30000 });
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
        if (msg.type === 'winner_update') {
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

  const winners = data?.winners || [];
  const totalWinners = winners.length;
  const todayWinners = winners.filter((w: { drawDate: string }) => {
    const today = new Date();
    const winnerDate = new Date(w.drawDate);
    return winnerDate.toDateString() === today.toDateString();
  }).length;

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-[--teal] mb-4">Daily Winners</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[--teal] to-[--gold] rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-[--muted] max-w-2xl mx-auto">
            Congratulations to our daily draw winners! Check back daily to see who&apos;s winning our micro prizes.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--gold] to-[--gold-light] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[--teal-dark]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">{totalWinners}</div>
            <div className="text-sm text-[--muted]">Total Winners</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--teal-light] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">{todayWinners}</div>
            <div className="text-sm text-[--muted]">Today&apos;s Winners</div>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--gold] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-[--teal] mb-2">Daily</div>
            <div className="text-sm text-[--muted]">Draw Schedule</div>
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
              Last update: {lastUpdate.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Winners List */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-[--gold]/30">
            <h2 className="text-2xl font-serif text-[--teal] mb-2">Winner Feed</h2>
            <p className="text-[--muted]">Real-time updates of our daily draw winners</p>
          </div>
          
          {winners.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-[--gold]/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[--muted]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-[--teal] mb-2">No Winners Yet</h3>
              <p className="text-[--muted] mb-6">Be the first to win by purchasing a bundle!</p>
              <Link href="/buy" className="btn-primary">
                Get Started
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[--gold]/20">
              {winners.map((winner: { email: string; prize: string; drawDate: string }, idx: number) => {
                const isRecent = idx < 3;
                const drawDate = new Date(winner.drawDate);
                const isToday = drawDate.toDateString() === new Date().toDateString();
                
                return (
                  <div 
                    key={idx} 
                    className={`p-6 hover:bg-[--gold]/5 transition-colors duration-200 ${
                      isRecent ? 'bg-gradient-to-r from-[--gold]/5 to-transparent' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${
                          isRecent ? 'bg-gradient-to-br from-[--gold] to-[--gold-light] text-[--teal-dark]' : 'bg-gradient-to-br from-[--teal] to-[--teal-light]'
                        }`}>
                          {winner.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-[--teal] text-lg">{winner.email}</div>
                          <div className="flex items-center gap-2 text-sm text-[--muted]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {drawDate.toLocaleDateString()} at {drawDate.toLocaleTimeString()}
                            {isToday && (
                              <span className="px-2 py-1 bg-[--success]/10 text-[--success] text-xs rounded-full">
                                Today
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[--gold] mb-1">{winner.prize}</div>
                        <div className="flex items-center gap-1 text-sm text-[--muted]">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                          </svg>
                          Winner #{idx + 1}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="card p-8 bg-gradient-to-br from-[--teal]/5 to-[--gold]/5">
            <h3 className="text-2xl font-serif text-[--teal] mb-4">Want to Be a Winner?</h3>
            <p className="text-[--muted] mb-6 max-w-2xl mx-auto">
              Purchase a bundle to get your raffle ticket and enter our daily draws. 
              The more tickets you have, the better your chances of winning!
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
    </div>
  );
}
