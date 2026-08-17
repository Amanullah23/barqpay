import {
  Calculator,
  Users,
  History,
  Receipt,
  Wallet,
  Gauge,
  Building2,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";

const features = [
  {
    icon: Calculator,
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/15",
    title: "Fair Bill Splitting",
    description:
      "Enter a total Breshna bill and each family's previous/current meter reading — BarqPay calculates exactly what each family owes, proportional to their real usage.",
  },
  {
    icon: Users,
    color: "text-neon-purple",
    bg: "bg-neon-purple/15",
    title: "Customer Management",
    description:
      "Keep a full directory of customers or tenants — meter numbers, account numbers, addresses, and contact info, all in one place.",
  },
  {
    icon: Gauge,
    color: "text-neon-yellow",
    bg: "bg-neon-yellow/15",
    title: "Meter Reading Tracking",
    description:
      "Record previous and current readings for every meter, with automatic consumption calculation and meter-multiplier support.",
  },
  {
    icon: Receipt,
    color: "text-neon-pink",
    bg: "bg-neon-pink/15",
    title: "Individual Bills",
    description:
      "Every family gets their own generated bill from the shared split — view kWh used, share percentage, and amount due at a glance.",
  },
  {
    icon: Wallet,
    color: "text-status-success",
    bg: "bg-status-success/15",
    title: "Payments Dashboard",
    description:
      "See who has paid and who hasn't across every customer, mark bills as paid, and watch outstanding balances update instantly.",
  },
  {
    icon: History,
    color: "text-neon-blue",
    bg: "bg-neon-blue/15",
    title: "Full Bill History",
    description:
      "Every month's master bill and family split is saved permanently — look back on any previous month whenever you need to.",
  },
  {
    icon: Building2,
    color: "text-neon-purple",
    bg: "bg-neon-purple/15",
    title: "Built for Shared Buildings",
    description:
      "Designed around the real scenario of multiple families on different floors sharing one Breshna account and meter.",
  },
  {
    icon: ShieldCheck,
    color: "text-neon-cyan",
    bg: "bg-neon-cyan/15",
    title: "Secure & Role-Based",
    description:
      "Admins, collectors, and customers each see only what they should — enforced at the database level, not just the app screen.",
  },
  {
    icon: Smartphone,
    color: "text-neon-pink",
    bg: "bg-neon-pink/15",
    title: "Mobile & Web",
    description:
      "Use the full-featured mobile app on Android, or manage everything from this website — your data stays in sync either way.",
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-[calc(100vh-88px)] px-4 py-12 md:py-16">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Features
          </h1>
          <p className="text-text-secondary text-sm md:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Everything you need to manage shared electricity billing, from a
            one-time split to a full property with dozens of families.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <GlassCard
              key={f.title}
              className={`hover-lift animate-fade-in-up delay-${Math.min((i % 5) + 1, 5)}`}
            >
              <div
                className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-3`}
              >
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1.5">
                {f.title}
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                {f.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
