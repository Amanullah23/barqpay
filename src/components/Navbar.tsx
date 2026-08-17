"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  LogIn,
  Info,
  Sparkles,
  BookOpen,
  HelpCircle,
  Download,
  Home,
} from "lucide-react";
import BarqPayLogo from "@/components/BarqPayLogo";
import GithubIcon from "@/components/icons/GithubIcon";

const GITHUB_URL = "https://github.com/Amanullah23/barqpay"; // TODO: replace with your real repo URL

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/features", label: "Features", icon: Sparkles },
  { href: "/docs", label: "Docs", icon: BookOpen },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/download", label: "Download App", icon: Download },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 pb-3 md:px-8">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        {/* Logo island */}
        <Link href="/" className="group shrink-0">
          <div
            className={`glass-card rounded-2xl px-3 py-2 flex items-center gap-2 transition-shadow duration-300 ${
              scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.25)]" : ""
            }`}
          >
            <div className="transition-transform group-hover:scale-105">
              <BarqPayLogo size={30} />
            </div>
            <span className="hidden sm:inline text-base font-bold text-text-primary">
              BarqPay
            </span>
          </div>
        </Link>

        {/* Nav links island — desktop only */}
        <nav
          className={`hidden lg:flex glass-card rounded-2xl px-1.5 py-1.5 items-center gap-0.5 transition-shadow duration-300 ${
            scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.25)]" : ""
          }`}
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                  active
                    ? "text-neon-cyan bg-neon-cyan/10"
                    : "text-text-secondary hover:text-text-primary hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions island — desktop only */}
        <div
          className={`hidden lg:flex glass-card rounded-2xl px-1.5 py-1.5 items-center gap-1 shrink-0 transition-shadow duration-300 ${
            scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.25)]" : ""
          }`}
        >
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-neon-cyan text-[#0D0B2E] shadow-[0_0_16px_rgba(76,217,232,0.4)] hover:bg-neon-cyan/90 hover:shadow-[0_0_20px_rgba(76,217,232,0.6)] hover:scale-105 transition-all whitespace-nowrap"
          >
            <LogIn className="w-4 h-4" /> Login
          </Link>
        </div>

        {/* Mobile toggle island */}
        <button
          onClick={() => setOpen(!open)}
          className={`lg:hidden glass-card rounded-2xl w-11 h-11 flex items-center justify-center shrink-0 transition-shadow duration-300 ${
            scrolled ? "shadow-[0_8px_24px_rgba(0,0,0,0.25)]" : ""
          }`}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu — full panel below */}
      {open && (
        <div className="animate-fade-in-up max-w-6xl mx-auto mt-2 lg:hidden">
          <div className="glass-card rounded-2xl px-3 py-3 flex flex-col gap-1 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? "text-neon-cyan bg-neon-cyan/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/10"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
            >
              <GithubIcon className="w-4 h-4" /> GitHub
            </a>
            <Link
              href="/login"
              className="mt-1 flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold bg-neon-cyan text-[#0D0B2E] shadow-[0_0_16px_rgba(76,217,232,0.4)] hover:bg-neon-cyan/90 transition-colors"
            >
              <LogIn className="w-4 h-4" /> Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
