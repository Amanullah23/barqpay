"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  Gauge,
  Receipt,
  Wallet,
  History,
  LayoutDashboard,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/readings", label: "Readings", icon: Gauge },
  { href: "/dashboard/bills", label: "Bills", icon: Receipt },
  { href: "/dashboard/payments", label: "Payments", icon: Wallet },
  { href: "/dashboard/properties", label: "History", icon: History },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden glass-card rounded-2xl p-1.5 mb-4 flex gap-1 overflow-x-auto">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              active
                ? "bg-neon-cyan/15 text-neon-cyan"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <link.icon className="w-3.5 h-3.5" />
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
