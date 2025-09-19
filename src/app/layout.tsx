import type { Metadata } from "next";
import { Playfair_Display, Lora } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const lora = Lora({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TheTop36",
  description: "Digital vault of curated $7 bundles with raffles and daily draws",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lora.variable} antialiased bg-[--ivory] text-[--body]`}>
        <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-[--gold]/30">
          <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif text-[--teal]">TheTop36</Link>
            <div className="flex gap-4 text-sm">
              <Link href="/buy" className="hover:underline">Buy</Link>
              <Link href="/leaderboard" className="hover:underline">Leaderboard</Link>
              <Link href="/winners" className="hover:underline">Winners</Link>
              <Link href="/referral" className="hover:underline">Referral</Link>
              <Link href="/widgets" className="hover:underline">Widgets</Link>
            </div>
          </nav>
        </header>
        <main className="min-h-[80vh]">{children}</main>
        <footer className="border-t border-[--gold]/30 py-6 text-center text-sm text-gray-600 bg-white">© {new Date().getFullYear()} TheTop36</footer>
      </body>
    </html>
  );
}
