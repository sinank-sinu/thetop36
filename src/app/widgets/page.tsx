"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function WidgetsPage() {
  const [activeWidget, setActiveWidget] = useState<'wheel' | 'scratch'>('wheel');

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-[--teal] mb-4">Interactive Widgets</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[--teal] to-[--gold] rounded-full mx-auto mb-6"></div>
          <p className="text-xl text-[--muted] max-w-2xl mx-auto">
            Try our fun interactive widgets! Spin the wheel for prizes or scratch cards for instant wins.
          </p>
        </div>

        {/* Widget Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-[--gold]/30">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveWidget('wheel')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeWidget === 'wheel'
                    ? 'bg-gradient-to-r from-[--teal] to-[--teal-light] text-white shadow-lg'
                    : 'text-[--teal] hover:bg-[--gold]/10'
                }`}
              >
                🎡 Spin the Wheel
              </button>
              <button
                onClick={() => setActiveWidget('scratch')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeWidget === 'scratch'
                    ? 'bg-gradient-to-r from-[--teal] to-[--teal-light] text-white shadow-lg'
                    : 'text-[--teal] hover:bg-[--gold]/10'
                }`}
              >
                🎫 Scratch Card
              </button>
            </div>
          </div>
        </div>

        {/* Widget Container */}
        <div className="card overflow-hidden">
          <div className="p-6 border-b border-[--gold]/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-serif text-[--teal] mb-2">
                  {activeWidget === 'wheel' ? '🎡 Spin the Wheel' : '🎫 Instant-Win Scratch-Card'}
                </h2>
                <p className="text-[--muted]">
                  {activeWidget === 'wheel' 
                    ? 'Spin the wheel for a chance to win exciting prizes!' 
                    : 'Scratch the card to reveal your instant win prize!'
                  }
                </p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-[--success]/10 text-[--success] rounded-full text-sm">
                <div className="w-2 h-2 bg-[--success] rounded-full animate-pulse"></div>
                Live Widget
              </div>
            </div>
          </div>
          
          <div className="aspect-video w-full">
            <iframe 
              src={activeWidget === 'wheel' ? 'https://thetop360-iota.vercel.app' : 'https://thetop360.vercel.app'} 
              className="w-full h-full border-0" 
              title={activeWidget === 'wheel' ? 'Spin the Wheel Widget' : 'Scratch Card Widget'}
            />
          </div>
        </div>

        {/* Widget Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[--teal] to-[--teal-light] rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎡</span>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[--teal]">Spin the Wheel</h3>
                <p className="text-sm text-[--muted]">Interactive Prize Wheel</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-[--muted]">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[--teal] rounded-full"></div>
                Multiple prize categories
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[--teal] rounded-full"></div>
                Smooth animations and effects
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[--teal] rounded-full"></div>
                Fair random selection
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[--teal] rounded-full"></div>
                Instant results display
              </li>
            </ul>
          </div>

          <div className="card p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[--gold] to-[--gold-light] rounded-xl flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
              <div>
                <h3 className="text-xl font-serif text-[--teal]">Scratch Card</h3>
                <p className="text-sm text-[--muted]">Instant Win Game</p>
              </div>
            </div>
            <ul className="space-y-2 text-sm text-[--muted]">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[--gold] rounded-full"></div>
                Realistic scratch mechanics
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[--gold] rounded-full"></div>
                Multiple win combinations
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[--gold] rounded-full"></div>
                Satisfying sound effects
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-[--gold] rounded-full"></div>
                Instant prize reveal
              </li>
            </ul>
          </div>
        </div>

        {/* How It Works */}
        <div className="card p-8 mt-8 bg-gradient-to-br from-[--teal]/5 to-[--gold]/5">
          <h3 className="text-2xl font-serif text-[--teal] mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--teal-light] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">1</span>
              </div>
              <h4 className="font-semibold text-[--teal] mb-2">Choose Your Widget</h4>
              <p className="text-sm text-[--muted]">Select between the spin wheel or scratch card widget</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[--gold] to-[--gold-light] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-[--teal-dark]">2</span>
              </div>
              <h4 className="font-semibold text-[--teal] mb-2">Play & Interact</h4>
              <p className="text-sm text-[--muted]">Use your mouse or touch to interact with the widget</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--gold] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-white">3</span>
              </div>
              <h4 className="font-semibold text-[--teal] mb-2">Win Prizes</h4>
              <p className="text-sm text-[--muted]">Discover your prize and enjoy the experience!</p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="card p-8">
            <h3 className="text-2xl font-serif text-[--teal] mb-4">Ready for More Fun?</h3>
            <p className="text-[--muted] mb-6 max-w-2xl mx-auto">
              These widgets are just a taste of what TheTop36 has to offer. 
              Purchase a bundle to get your raffle ticket and enter our real daily draws!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/buy" className="btn-primary">
                🛒 Buy Bundle
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
