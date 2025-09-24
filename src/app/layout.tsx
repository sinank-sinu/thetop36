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
      <body className={`${playfair.variable} ${lora.variable} antialiased text-[--body]`}>
        <header className="sticky top-0 z-50 glass border-b border-[--gold]/30 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-3xl font-serif text-[--teal] font-bold hover:text-[--teal-dark] transition-colors duration-200">
              TheTop36
            </Link>
            <div className="hidden md:flex gap-6 text-sm font-medium">
              <Link href="/buy" className="hover:text-[--teal-dark] transition-colors duration-200 relative group">
                Buy Bundle
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[--teal] group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link href="/leaderboard" className="hover:text-[--teal-dark] transition-colors duration-200 relative group">
                Leaderboard
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[--teal] group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link href="/winners" className="hover:text-[--teal-dark] transition-colors duration-200 relative group">
                Winners
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[--teal] group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link href="/referral" className="hover:text-[--teal-dark] transition-colors duration-200 relative group">
                Referral
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[--teal] group-hover:w-full transition-all duration-200"></span>
              </Link>
              <Link href="/widgets" className="hover:text-[--teal-dark] transition-colors duration-200 relative group">
                Widgets
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[--teal] group-hover:w-full transition-all duration-200"></span>
              </Link>
            </div>
            {/* Mobile menu button */}
            <button className="md:hidden p-2 rounded-lg hover:bg-[--gold]/20 transition-colors duration-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </nav>
        </header>
        <main className="min-h-[80vh] animate-fade-in-up">{children}</main>
        <footer className="border-t border-[--gold]/30 py-8 text-center text-sm text-[--muted] bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-[--teal] font-serif font-semibold">TheTop36</div>
              <div className="flex gap-6 text-xs">
                <span>Digital Vault Store</span>
                <span>•</span>
                <span>Curated $7 Bundles</span>
                <span>•</span>
                <span>Daily Draws & Raffles</span>
              </div>
              <div>© {new Date().getFullYear()} TheTop36. All rights reserved.</div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
