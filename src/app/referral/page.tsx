"use client";
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

export default function ReferralPage() {
  const { data } = useSWR('/api/me', fetcher);
  const authed = data?.authed;
  const user = data?.user;

  if (!authed) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl border border-[--gold]/40 shadow text-center">
          <h1 className="text-2xl font-serif text-[--teal] mb-2">Restricted</h1>
          <p className="text-gray-600">Referral & odds tracker is visible only to logged-in/paid users.</p>
        </div>
      </div>
    );
  }

  if (user?.tickets <= 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl border border-[--gold]/40 shadow text-center">
          <h1 className="text-2xl font-serif text-[--teal] mb-2">Access Requires a Ticket</h1>
          <p className="text-gray-600">Purchase a bundle to unlock the referral/odds tracker.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-serif text-[--teal] mb-4">Referral & Odds Tracker</h1>
      <div className="aspect-video w-full rounded-xl overflow-hidden border border-[--gold]/40 shadow">
        <iframe src="https://cosmic-kulfi-c967d9.netlify.app/#referral" className="w-full h-full" />
      </div>
    </div>
  );
}
