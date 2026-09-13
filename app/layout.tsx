"use client";

import { useState } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ALING | Portfolio",
  description: "Professional Portfolio Website - ALING",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-full flex flex-col bg-[#FFF8E7] text-black">
        {/* Navbar Neobrutalism */}
        <nav
          className="bg-[#FFD700] border-b-[4px] border-black sticky top-0 z-50"
          style={{ boxShadow: "0 6px 0 0 #000" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link
                href="/"
                className="text-2xl font-extrabold text-black uppercase tracking-tight bg-white border-[3px] border-black px-4 py-1"
                style={{ boxShadow: "4px 4px 0 0 #000" }}
              >
                My<span className="text-[#FF6B9D]">Portfolio</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-3">
                {[
                  { href: "/", label: "Home" },
                  { href: "/projects", label: "Projects" },
                  { href: "/skills", label: "Skills" },
                  { href: "/contact", label: "Contact" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-black font-extrabold uppercase text-sm tracking-wide bg-white border-[3px] border-black px-4 py-2 hover:bg-[#FF6B9D] hover:text-white transition-all hover:-translate-x-[2px] hover:-translate-y-[2px]"
                    style={{ boxShadow: "4px 4px 0 0 #000" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-black font-extrabold text-2xl bg-white border-[3px] border-black w-10 h-10 flex items-center justify-center"
                  style={{ boxShadow: "4px 4px 0 0 #000" }}
                  aria-label="Toggle Menu"
                >
                  {isMobileMenuOpen ? "✕" : "☰"}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t-[4px] border-black bg-[#FFD700]">
              <div className="px-4 py-4 space-y-3">
                {["/", "/projects", "/skills", "/contact"].map((href, index) => {
                  const labels = ["Home", "Projects", "Skills", "Contact"];
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-black font-extrabold uppercase text-base tracking-wide bg-white border-[3px] border-black px-4 py-3 text-center hover:bg-[#FF6B9D] hover:text-white transition-all shadow-[4px_4px_0_0_#000]"
                      style={{ boxShadow: "4px 4px 0 0 #000" }}
                    >
                      {labels[index]}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow">{children}</main>

        {/* Footer Neobrutalism */}
        <footer
          className="bg-[#4A90FF] border-t-[4px] border-black mt-auto"
          style={{ boxShadow: "0 -6px 0 0 #000" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <p className="text-white font-extrabold uppercase tracking-wide">
              &copy; 2026 MyPortfolio. Built with Next.js & NestJS.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}