import Link from "next/link";
import {
  Zap,
  Calculator,
  LogIn,
  ChevronRight,
  Users,
  ShieldCheck,
  History,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";
import HeroBackground from "@/components/HeroBackground";

export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-88px)] px-4 py-12 md:py-20">
      <HeroBackground />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Hero */}
        {/* Hero */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="animate-fade-in-up w-16 h-16 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-5">
            <Zap
              className="animate-soft-pulse w-8 h-8 text-neon-cyan"
              fill="currentColor"
            />
          </div>
          <h1 className="animate-fade-in-up delay-1 text-4xl md:text-5xl font-bold text-text-primary tracking-tight">
            BarqPay
          </h1>
          <p className="animate-fade-in-up delay-2 text-neon-cyan font-medium mt-3 text-base md:text-lg">
            Fair electricity bills, split honestly.
          </p>
          <p className="animate-fade-in-up delay-3 text-text-secondary text-sm md:text-base mt-4 leading-relaxed">
            Split one shared Breshna bill fairly across every family by their
            real meter usage — or manage customers, readings, and payments for
            your whole property, all in one place.
          </p>
        </div>

        {/* Feature highlights */}
        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <GlassCard className="animate-fade-in-up delay-2 hover-lift text-center">
            <Calculator className="w-6 h-6 text-neon-cyan mx-auto mb-2" />
            <p className="text-sm font-semibold text-text-primary">
              Fair Splitting
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Every family pays exactly their share, calculated from real kWh
              usage.
            </p>
          </GlassCard>
          <GlassCard className="animate-fade-in-up delay-3 hover-lift text-center">
            <Users className="w-6 h-6 text-neon-purple mx-auto mb-2" />
            <p className="text-sm font-semibold text-text-primary">
              Built for Families
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Manage multiple households sharing one meter or one building.
            </p>
          </GlassCard>
          <GlassCard className="animate-fade-in-up delay-4 hover-lift text-center">
            <History className="w-6 h-6 text-neon-pink mx-auto mb-2" />
            <p className="text-sm font-semibold text-text-primary">
              Full History
            </p>
            <p className="text-xs text-text-secondary mt-1">
              Save every month's bill and payment record for later.
            </p>
          </GlassCard>
        </div>

        {/* Mode select */}
        {/* Mode select */}
        <GlassCard className="animate-fade-in-up delay-4 max-w-md mx-auto p-8">
          <div className="text-center mb-6">
            <p className="text-sm text-text-secondary">
              How would you like to continue?
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href="/calculator">
              <div className="glass-card hover-lift rounded-2xl px-4 py-4 flex items-center gap-4 hover:bg-white/[0.14] transition-colors cursor-pointer">
                <Calculator className="w-6 h-6 text-neon-cyan shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-text-primary">
                    Quick Calculator
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Split a shared bill by meter usage — no account needed
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary shrink-0" />
              </div>
            </Link>

            <Link href="/login">
              <div className="glass-card rounded-2xl px-4 py-4 flex items-center gap-4 hover:bg-white/[0.14] transition-colors cursor-pointer">
                <LogIn className="w-6 h-6 text-neon-cyan shrink-0" />
                <div className="flex-1 text-left">
                  <p className="text-sm font-semibold text-text-primary">
                    Login
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Save your calculations and view previous months
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-text-secondary shrink-0" />
              </div>
            </Link>
          </div>
        </GlassCard>

        <p className="text-center text-xs text-text-secondary/70 mt-8 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Your data stays private and
          secure
        </p>
      </div>
    </main>
  );
}
