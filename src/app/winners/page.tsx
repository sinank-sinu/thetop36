"use client";
import useSWR from 'swr';
import axios from 'axios';
import { useEffect } from 'react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function WinnersPage() {
  const { data, mutate } = useSWR('/api/winners', fetcher, { refreshInterval: 30000 });

  useEffect(() => {
    const ev = new EventSource('/api/realtime/stream');
    ev.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'winner_update') {
          mutate();
        }
      } catch {}
    };
    return () => ev.close();
  }, [mutate]);

  const winners = data?.winners || [];
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-serif text-[--teal] mb-4">Recent Winners</h1>
      <div className="space-y-3">
        {winners.map((w: any, idx: number) => (
          <div key={idx} className="bg-white p-4 rounded-xl border border-[--gold]/40 shadow flex justify-between">
            <div>
              <div className="font-medium">{w.email}</div>
              <div className="text-sm text-gray-600">{new Date(w.drawDate).toLocaleString()}</div>
            </div>
            <div className="text-[--teal] font-semibold">{w.prize}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
