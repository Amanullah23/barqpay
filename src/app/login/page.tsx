"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import BarqPayLogo from "@/components/BarqPayLogo";
import { createClient } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (authError || !authData.user) {
      setError("Login failed. Check your email and password.");
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authData.user.id)
      .maybeSingle();

    if (profileError || !profile) {
      setError("No profile found for this account. Contact your admin.");
      setLoading(false);
      return;
    }

    if (profile.role === "admin" || profile.role === "collector") {
      router.push("/dashboard");
    } else {
      router.push("/my-bills");
    }
  };

  return (
    <main className="min-h-[calc(100vh-88px)] flex items-center justify-center px-4 py-12">
      <GlassCard className="w-full max-w-md p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <BarqPayLogo size={48} />
          <h1 className="text-2xl font-bold text-text-primary mt-4">
            Welcome to BarqPay
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs text-text-secondary mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white/10 border border-glass-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/60 outline-none focus:border-neon-cyan transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-secondary mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/10 border border-glass-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/60 outline-none focus:border-neon-cyan transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-status-danger text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-neon-cyan text-[#0D0B2E] font-bold rounded-xl py-3.5 hover:bg-neon-cyan/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#0D0B2E]/30 border-t-[#0D0B2E] rounded-full animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </GlassCard>
    </main>
  );
}
