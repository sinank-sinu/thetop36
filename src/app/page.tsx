import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fade-in-up">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-[--teal] font-bold leading-tight">
              TheTop36
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-[--teal] to-[--gold] rounded-full"></div>
          </div>
          <p className="text-xl md:text-2xl text-[--muted] leading-relaxed">
            Curated $7 public‑domain vaults. Every purchase earns 1 raffle ticket. Daily micro draws. Referral‑boosted odds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/buy" className="btn-primary text-lg px-8 py-4 shadow-glow">
              🛒 Buy the $7 Bundle
            </Link>
            <Link href="/leaderboard" className="btn-ghost text-lg px-8 py-4">
              🏆 View Leaderboard
            </Link>
          </div>
          <div className="flex items-center gap-6 text-sm text-[--muted]">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[--success] rounded-full animate-pulse"></div>
              <span>Live Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[--info] rounded-full animate-pulse"></div>
              <span>Real-time Draws</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-[--warning] rounded-full animate-pulse"></div>
              <span>Secure Payments</span>
            </div>
          </div>
        </div>
        
        <div className="card-hover p-8 space-y-6 animate-fade-in-up">
          <div className="text-center">
            <h2 className="font-serif text-3xl text-[--teal] mb-2">What You Get</h2>
            <div className="w-16 h-1 bg-[--gold] rounded-full mx-auto"></div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[--gold]/10 transition-colors duration-200">
              <div className="w-6 h-6 bg-[--teal] text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
              <div>
                <div className="font-semibold text-[--teal]">Instant Stripe Checkout</div>
                <div className="text-sm text-[--muted]">Test with card 4242 4242 4242 4242</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[--gold]/10 transition-colors duration-200">
              <div className="w-6 h-6 bg-[--teal] text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
              <div>
                <div className="font-semibold text-[--teal]">Auto Raffle Ticket</div>
                <div className="text-sm text-[--muted]">1 ticket per purchase via webhook</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[--gold]/10 transition-colors duration-200">
              <div className="w-6 h-6 bg-[--teal] text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              <div>
                <div className="font-semibold text-[--teal]">Daily Draw Feed</div>
                <div className="text-sm text-[--muted]">Live winner announcements</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[--gold]/10 transition-colors duration-200">
              <div className="w-6 h-6 bg-[--teal] text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
              <div>
                <div className="font-semibold text-[--teal]">Real-time Leaderboard</div>
                <div className="text-sm text-[--muted]">Instant updates, no refresh needed</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[--gold]/10 transition-colors duration-200">
              <div className="w-6 h-6 bg-[--teal] text-white rounded-full flex items-center justify-center text-sm font-bold">5</div>
              <div>
                <div className="font-semibold text-[--teal]">Referral Tracker</div>
                <div className="text-sm text-[--muted]">Gated access for paid users</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-[--teal] mb-4">Explore Features</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[--teal] to-[--gold] rounded-full mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card-hover p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--teal-light] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-[--teal] mb-4">Buy Bundle</h3>
            <p className="text-[--muted] mb-6 leading-relaxed">
              Purchase the curated $7 bundle and automatically earn a raffle ticket for our daily draws.
            </p>
            <Link href="/buy" className="btn-primary group-hover:shadow-glow transition-all duration-300">
              Go to Checkout →
            </Link>
          </div>
          
          <div className="card-hover p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-[--gold] to-[--gold-light] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-[--teal-dark]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-[--teal] mb-4">Winners</h3>
            <p className="text-[--muted] mb-6 leading-relaxed">
              See the rolling feed of daily winners with real-time updates and prize announcements.
            </p>
            <Link href="/winners" className="btn-primary group-hover:shadow-glow transition-all duration-300">
              View Winners →
            </Link>
          </div>
          
          <div className="card-hover p-8 text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-[--teal] to-[--gold] rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <h3 className="font-serif text-2xl text-[--teal] mb-4">Widgets</h3>
            <p className="text-[--muted] mb-6 leading-relaxed">
              Try our interactive Spin‑the‑Wheel and Scratch‑Card widgets for extra fun and engagement.
            </p>
            <Link href="/widgets" className="btn-primary group-hover:shadow-glow transition-all duration-300">
              Open Widgets →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
