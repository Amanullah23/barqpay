"use client";

import { useAuthGuard } from "@/lib/useAuthGuard";
import Sidebar from "@/components/dashboard/Sidebar";
import MobileNav from "@/components/dashboard/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading } = useAuthGuard(["admin", "collector"]);

  if (loading || !profile) {
    return (
      <main className="min-h-[calc(100vh-88px)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-88px)] px-4 py-6 md:px-8">
      <div className="max-w-6xl mx-auto flex gap-6">
        <Sidebar profile={profile} />
        <div className="flex-1 min-w-0">
          <MobileNav />
          {children}
        </div>
      </div>
    </main>
  );
}
