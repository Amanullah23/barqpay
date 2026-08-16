import { Zap, Target, Heart, Users } from "lucide-react";
import GlassCard from "@/components/GlassCard";

export default function AboutPage() {
  return (
    <main className="min-h-[calc(100vh-88px)] px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-14 h-14 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
            <Zap className="w-7 h-7 text-neon-cyan" fill="currentColor" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            About BarqPay
          </h1>
          <p className="text-text-secondary text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            BarqPay started from a simple, everyday problem: when several
            families share one electricity meter or one Breshna bill, splitting
            the cost fairly is hard to do by hand — and even harder to keep
            track of, month after month.
          </p>
        </div>

        <GlassCard className="mb-6 animate-fade-in-up delay-1">
          <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-neon-cyan" /> Our Mission
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            To make shared electricity billing transparent and fair for every
            household in Afghanistan — replacing rough estimates and disputes
            with a clear, meter-based calculation everyone can trust.
          </p>
        </GlassCard>

        <GlassCard className="mb-6 animate-fade-in-up delay-2">
          <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Users className="w-5 h-5 text-neon-purple" /> Who It&apos;s For
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Landlords and property managers with multiple tenants on one Breshna
            account, families sharing a building across several floors, and
            anyone who just wants a fast, fair way to split a bill by real usage
            — no spreadsheet required.
          </p>
        </GlassCard>

        <GlassCard className="mb-6 animate-fade-in-up delay-3">
          <h2 className="text-lg font-semibold text-text-primary mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-neon-pink" /> Why We Built It
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            We modeled BarqPay&apos;s calculations directly on a real DABS (Da
            Afghanistan Breshna Sherkat) bill, so the numbers match what people
            actually see on their paper bill every month. Whether you just need
            a one-time split or want to track months of history for a whole
            property, BarqPay is built to stay simple and get out of your way.
          </p>
        </GlassCard>
      </div>
    </main>
  );
}
