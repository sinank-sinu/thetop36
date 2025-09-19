import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-[--ivory]">
      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif text-[--teal] mb-4">TheTop36</h1>
          <p className="text-lg text-gray-700 mb-6">
            Curated $7 public‑domain vaults. Every purchase earns 1 raffle ticket. Daily micro draws. Referral‑boosted odds.
          </p>
          <div className="flex gap-3">
            <Link href="/buy" className="btn-primary">Buy the $7 Bundle</Link>
            <Link href="/leaderboard" className="border border-[--gold] text-[--teal] px-4 py-2 rounded hover:bg-white">Leaderboard</Link>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-serif text-2xl text-[--teal] mb-3">What you get</h2>
          <ul className="space-y-2 text-gray-700">
            <li>• Instant Stripe Checkout (test 4242…)</li>
            <li>• 1 ticket per purchase (auto via webhook)</li>
            <li>• Daily draw feed and winners</li>
            <li>• Live leaderboard (real‑time)</li>
            <li>• Referral & odds tracker (gated)</li>
          </ul>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-16 grid md:grid-cols-3 gap-6">
        <div className="card p-5">
          <h3 className="font-serif text-xl text-[--teal] mb-2">Buy</h3>
          <p className="text-gray-700 mb-3">Purchase the bundle and earn a raffle ticket.</p>
          <Link className="underline" href="/buy">Go to Checkout →</Link>
        </div>
        <div className="card p-5">
          <h3 className="font-serif text-xl text-[--teal] mb-2">Winners</h3>
          <p className="text-gray-700 mb-3">See the rolling feed of daily winners.</p>
          <Link className="underline" href="/winners">View Winners →</Link>
        </div>
        <div className="card p-5">
          <h3 className="font-serif text-xl text-[--teal] mb-2">Widgets</h3>
          <p className="text-gray-700 mb-3">Try Spin‑the‑Wheel and Scratch‑Card.</p>
          <Link className="underline" href="/widgets">Open Widgets →</Link>
        </div>
      </section>
    </div>
  );
}
