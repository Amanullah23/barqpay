"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import BarqPayLogo from "@/components/BarqPayLogo";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { createClient } from "@/lib/supabase";

export default function MyBillsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { profile, loading } = useAuthGuard(["customer"]);

  const handleLogout = async () => {
    if (
      !confirm("Log out? You will need to log in again to access your account.")
    )
      return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading || !profile) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="glass-card rounded-2xl px-4 py-3 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarqPayLogo size={32} />
            <span className="text-base font-bold text-text-primary">
              BarqPay
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm text-status-danger hover:bg-white/10 px-3 py-2 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log out
          </button>
        </div>
        {children}
      </div>
    </main>
  );
}
