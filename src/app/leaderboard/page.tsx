"use client";
import useSWR from 'swr';
import axios from 'axios';
import { useEffect } from 'react';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function LeaderboardPage() {
  const { data, mutate } = useSWR('/api/leaderboard', fetcher, { refreshInterval: 0 });

  useEffect(() => {
    const ev = new EventSource('/api/realtime/stream');
    ev.onmessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.type === 'leaderboard_update') {
          mutate();
        }
      } catch {}
    };
    return () => ev.close();
  }, [mutate]);

  const users = data?.users || [];
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-serif text-[--teal] mb-4">Leaderboard</h1>
      <div className="bg-white rounded-xl border border-[--gold]/40 shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[--ivory]">
            <tr>
              <th className="text-left p-3">Email</th>
              <th className="text-left p-3">Tickets</th>
              <th className="text-left p-3">Referrals</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.email} className="border-t">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.tickets}</td>
                <td className="p-3">{u.referrals}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
