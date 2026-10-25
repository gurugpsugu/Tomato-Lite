import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TomatoLogo from "@/components/TomatoLogo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TOMATO LITE",
  description: "Reviews for Ludhiana Burrito — Sector 32",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* The app identity, visible on every screen: mark, wordmark, status beacon */}
        <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0d11]/85 backdrop-blur">
          <div className="mx-auto flex max-w-[640px] items-center justify-between px-6 py-3">
            <span className="flex items-center gap-3">
              <TomatoLogo className="h-8 w-8" />
              <span className="font-mono text-[13px] font-bold tracking-[0.38em] text-white/90">
                TOMATO LITE
              </span>
            </span>
            <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-white/50">
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="live-dot absolute h-2 w-2 rounded-full bg-[#2ea043]" />
                <span className="relative h-2 w-2 rounded-full bg-[#2ea043]" />
              </span>
              LIVE
            </span>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
