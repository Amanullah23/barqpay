"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Gauge,
  Receipt,
  Wallet,
  History,
  LayoutDashboard,
  User,
  LogOut,
} from "lucide-react";
import BarqPayLogo from "@/components/BarqPayLogo";
import { createClient } from "@/lib/supabase";
import type { Profile } from "@/lib/useAuthGuard";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/customers", label: "Customers", icon: Users },
  { href: "/dashboard/readings", label: "Readings", icon: Gauge },
  { href: "/dashboard/bills", label: "Bills", icon: Receipt },
  { href: "/dashboard/payments", label: "Payments", icon: Wallet },
  { href: "/dashboard/properties", label: "Bill History", icon: History },
];

export default function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-64 shrink-0 hidden md:flex flex-col gap-1 glass-card rounded-2xl p-4 h-fit sticky top-24">
      <div className="flex items-center gap-2 px-2 pb-4 mb-2 border-b border-glass-border">
        <BarqPayLogo size={32} />
        <span className="text-base font-bold text-text-primary">BarqPay</span>
      </div>

      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? "bg-neon-cyan/15 text-neon-cyan"
                : "text-text-secondary hover:text-text-primary hover:bg-white/10"
            }`}
          >
            <link.icon className="w-4 h-4" />
            {link.label}
          </Link>
        );
      })}

      <div className="mt-3 pt-3 border-t border-glass-border flex flex-col gap-1">
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
        >
          <User className="w-4 h-4" />
          {profile.full_name || "Profile"}
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-status-danger hover:bg-white/10 transition-colors text-left"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
