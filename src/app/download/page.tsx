import {
  Smartphone,
  Download,
  Bell,
  Zap,
  Gauge,
  Users,
  Wallet,
  Apple,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";

const mobileFeatures = [
  { icon: Gauge, label: "Enter meter readings on the go" },
  { icon: Users, label: "Manage customers from anywhere" },
  { icon: Wallet, label: "Track payments in real time" },
];

function AndroidMockup() {
  return (
    <div className="relative w-56 h-[440px] rounded-[2.5rem] border-4 border-white/20 bg-white/5 shadow-2xl overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-6 bg-black/20 flex items-center justify-center">
        <div className="w-16 h-3 rounded-full bg-black/30" />
      </div>
      <div className="absolute inset-0 pt-6 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-bg-start via-bg-mid to-bg-end">
        <div className="w-14 h-14 rounded-full bg-neon-cyan/20 flex items-center justify-center">
          <Zap className="w-7 h-7 text-neon-cyan" fill="currentColor" />
        </div>
        <p className="text-lg font-bold text-text-primary">BarqPay</p>
        <div className="w-36 glass-card rounded-xl px-3 py-2 text-center">
          <p className="text-[10px] text-text-secondary">Total Due</p>
          <p className="text-sm font-bold text-neon-cyan">620.00 AFN</p>
        </div>
        <div className="w-36 glass-card rounded-xl px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-success" />
          <p className="text-[10px] text-text-secondary">Paid this month</p>
        </div>
      </div>
    </div>
  );
}

function IosMockup() {
  return (
    <div className="relative w-56 h-[440px] rounded-[3rem] border-4 border-white/20 bg-white/5 shadow-2xl overflow-hidden">
      {/* Dynamic-island style notch */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 rounded-full bg-black/40 z-10" />
      <div className="absolute inset-0 pt-10 flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-bg-start via-bg-mid to-bg-end">
        <div className="w-14 h-14 rounded-full bg-neon-purple/20 flex items-center justify-center">
          <Zap className="w-7 h-7 text-neon-purple" fill="currentColor" />
        </div>
        <p className="text-lg font-bold text-text-primary">BarqPay</p>
        <div className="w-36 glass-card rounded-xl px-3 py-2 text-center">
          <p className="text-[10px] text-text-secondary">My Bills</p>
          <p className="text-sm font-bold text-neon-purple">3 unpaid</p>
        </div>
        <div className="w-36 glass-card rounded-xl px-3 py-2 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-warning" />
          <p className="text-[10px] text-text-secondary">Due in 5 days</p>
        </div>
      </div>
      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 rounded-full bg-white/30" />
    </div>
  );
}

export default function DownloadPage() {
  return (
    <main className="min-h-[calc(100vh-88px)] px-4 py-12 md:py-16">
      <div className="max-w-4xl mx-auto flex flex-col gap-16">
        {/* Android */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="flex justify-center animate-fade-in-up order-2 md:order-1">
            <AndroidMockup />
          </div>

          <div className="animate-fade-in-up delay-1 order-1 md:order-2">
            <div className="w-14 h-14 rounded-full bg-neon-cyan/20 flex items-center justify-center mb-5">
              <Smartphone className="w-7 h-7 text-neon-cyan" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              BarqPay Mobile App
            </h1>
            <p className="text-text-secondary text-sm md:text-base mt-3 leading-relaxed">
              Everything you can do on the website, in your pocket — enter meter
              readings, generate bills, and track payments from anywhere.
            </p>

            <div className="flex flex-col gap-3 mt-6">
              {mobileFeatures.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-neon-purple/15 flex items-center justify-center shrink-0">
                    <f.icon className="w-4 h-4 text-neon-purple" />
                  </div>
                  <p className="text-sm text-text-secondary">{f.label}</p>
                </div>
              ))}
            </div>

            <GlassCard className="mt-8 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-neon-yellow/15 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-neon-yellow" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  Android — Coming Soon
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  The Android APK is currently in final testing. Check back
                  soon, or use the full app right here on the website in the
                  meantime.
                </p>
              </div>
            </GlassCard>

            <button
              disabled
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-glass-border py-3.5 text-text-secondary text-sm font-semibold cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Download APK — Coming Soon
            </button>
          </div>
        </div>

        {/* iOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="animate-fade-in-up">
            <div className="w-14 h-14 rounded-full bg-neon-purple/20 flex items-center justify-center mb-5">
              <Apple className="w-7 h-7 text-neon-purple" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
              BarqPay for iPhone
            </h1>
            <p className="text-text-secondary text-sm md:text-base mt-3 leading-relaxed">
              A native iOS version is on the way — the same BarqPay experience,
              built for iPhone.
            </p>

            <GlassCard className="mt-8 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-neon-purple/15 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-neon-purple" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-primary">
                  iOS — Coming Soon
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  We&apos;re working on bringing BarqPay to the App Store. Use
                  the website or the Android app in the meantime — your data
                  stays in sync either way.
                </p>
              </div>
            </GlassCard>

            <button
              disabled
              className="mt-4 w-full flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-glass-border py-3.5 text-text-secondary text-sm font-semibold cursor-not-allowed"
            >
              <Apple className="w-4 h-4" /> App Store — Coming Soon
            </button>
          </div>

          <div className="flex justify-center animate-fade-in-up delay-1">
            <IosMockup />
          </div>
        </div>
      </div>
    </main>
  );
}
