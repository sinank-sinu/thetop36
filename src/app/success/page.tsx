"use client";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function SuccessPage() {
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState<'pending' | 'ok' | 'unpaid' | 'error'>('pending');
  const [message, setMessage] = useState('Confirming payment…');

  useEffect(() => {
    async function confirm() {
      if (!sessionId) return;
      try {
        const { data } = await axios.post('/api/checkout/confirm', { session_id: sessionId });
        if (data?.ok) {
          setStatus('ok');
          setMessage('Payment confirmed! Your ticket has been added.');
        } else {
          setStatus('unpaid');
          setMessage('Payment not completed. No ticket was added.');
        }
      } catch (e: any) {
        setStatus('error');
        setMessage(e?.response?.data?.error || 'Error confirming payment');
      }
    }
    confirm();
  }, [sessionId]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[--ivory]">
      <div className="max-w-lg w-full p-6 rounded-xl shadow bg-white border border-[--gold]/40 text-center">
        <h1 className="text-3xl font-serif text-[--teal] mb-3">Order Status</h1>
        <p className="mb-4">{message}</p>
        <div className="flex gap-3 justify-center">
          <Link className="underline" href="/buy">Buy Again</Link>
          <Link className="underline" href="/leaderboard">Leaderboard</Link>
          <Link className="underline" href="/winners">Winners</Link>
        </div>
      </div>
    </div>
  );
}
