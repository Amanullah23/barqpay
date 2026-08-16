"use client";

import Link from "next/link";
import { useState } from "react";
import { Zap, Menu, X, LogIn } from "lucide-react";
import GithubIcon from "@/components/icons/GithubIcon";
import BarqPayLogo from "@/components/BarqPayLogo";

const GITHUB_URL = "#"; // TODO: replace with your real repo URL

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/docs", label: "Docs" },
  { href: "/faq", label: "FAQ" },
  { href: "/download", label: "Download App" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 pb-3 md:px-8 backdrop-blur-xl bg-[#241B4A]/40">
      <nav className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <div className="transition-transform group-hover:scale-105">
            <BarqPayLogo size={36} />
          </div>
          <span className="text-lg font-bold text-text-primary">BarqPay</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
            aria-label="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <Link
            href="/login"
            className="ml-1 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-neon-cyan text-[#0D0B2E] shadow-[0_0_16px_rgba(76,217,232,0.4)] hover:bg-neon-cyan/90 hover:shadow-[0_0_20px_rgba(76,217,232,0.6)] hover:scale-105 transition-all whitespace-nowrap"
          >
            <LogIn className="w-4 h-4" /> Login
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="glass-card mt-2 rounded-2xl px-4 py-3 flex flex-col gap-1 lg:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <GithubIcon className="w-4 h-4" />
          </a>
          <Link
            href="/login"
            onClick={() => setOpen(false)}
            className="mt-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold bg-neon-cyan text-[#0D0B2E] shadow-[0_0_16px_rgba(76,217,232,0.4)] hover:bg-neon-cyan/90 transition-colors"
          >
            <LogIn className="w-4 h-4" /> Login
          </Link>
        </div>
      )}
    </header>
  );
}
