export default function WidgetsPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-serif text-[--teal]">Widgets</h1>
      <div>
        <h2 className="text-xl font-serif mb-2">Spin the Wheel</h2>
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-[--gold]/40 shadow">
          <iframe src="https://thetop360-iota.vercel.app" className="w-full h-full" />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-serif mb-2">Instant-Win Scratch-Card</h2>
        <div className="aspect-video w-full rounded-xl overflow-hidden border border-[--gold]/40 shadow">
          <iframe src="https://thetop360.vercel.app" className="w-full h-full" />
        </div>
      </div>
    </div>
  );
}
