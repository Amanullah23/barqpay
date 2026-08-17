import Link from "next/link";
import { Calculator, LogIn } from "lucide-react";
import BarqPayLogo from "@/components/BarqPayLogo";
import GithubIcon from "@/components/icons/GithubIcon";

const GITHUB_URL = "#"; // TODO: replace with your real repo URL

const productLinks = [
  { href: "/calculator", label: "Quick Calculator" },
  { href: "/login", label: "Login" },
  { href: "/download", label: "Download App" },
];

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/faq", label: "FAQ" },
];

const resourceLinks = [{ href: "/docs", label: "User Guide" }];

export default function Footer() {
  return (
    <footer className="mt-20 px-4 pb-6 md:px-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">
        {/* Main footer */}
        <div className="glass-card rounded-2xl px-6 py-8 md:px-10 md:py-10">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-3">
                <BarqPayLogo size={30} />
                <span className="text-base font-bold text-text-primary">
                  BarqPay
                </span>
              </Link>
              <p className="text-xs text-text-secondary leading-relaxed max-w-xs">
                Fair, transparent electricity bill splitting for families
                sharing one meter — built for Afghanistan.
              </p>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-4 text-xs text-text-secondary hover:text-neon-cyan transition-colors"
              >
                <GithubIcon className="w-3.5 h-3.5" /> View on GitHub
              </a>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">
                Product
              </p>
              <ul className="flex flex-col gap-2">
                {productLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-text-secondary hover:text-neon-cyan transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <p className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">
                Company
              </p>
              <ul className="flex flex-col gap-2">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-text-secondary hover:text-neon-cyan transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <p className="text-xs font-semibold text-text-primary mb-3 uppercase tracking-wide">
                Resources
              </p>
              <ul className="flex flex-col gap-2">
                {resourceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-text-secondary hover:text-neon-cyan transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-glass-border mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs text-text-secondary">
              © {new Date().getFullYear()} BarqPay. All rights reserved.
            </p>
            <p className="text-xs text-text-secondary">
              Made for Afghanistan 🇦🇫
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
