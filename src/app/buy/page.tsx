"use client";
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function BuyPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setError(null);
    if (!email) { setError('Enter your email'); return; }
    setLoading(true);
    try {
      await axios.post('/api/auth/login', { email });
      const { data } = await axios.post('/api/checkout/session', { email });
      if (data?.url) {
        window.location.href = data.url as string;
      } else {
        setError('Failed to start checkout');
      }
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Checkout error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[--ivory]">
      <div className="max-w-md w-full p-6 rounded-xl shadow bg-white border border-[--gold]/40">
        <h1 className="text-3xl font-serif text-[--teal] mb-2">Buy the $7 Bundle</h1>
        <p className="text-gray-600 mb-4">Each purchase grants 1 raffle ticket. Test with card 4242 4242 4242 4242.</p>
        <input
          type="email"
          className="w-full border rounded px-3 py-2 mb-3"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-[--teal] text-white py-2 rounded hover:opacity-90 disabled:opacity-60"
        >{loading ? 'Redirecting…' : 'Checkout $7'}</button>
        <div className="text-sm text-gray-600 mt-3 flex justify-between">
          <Link href="/winners" className="underline">Winners</Link>
          <Link href="/leaderboard" className="underline">Leaderboard</Link>
          <Link href="/widgets" className="underline">Widgets</Link>
        </div>
      </div>
    </div>
  );
}
