"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit3, LogOut, Save, X, Phone, Badge } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: "admin" | "collector" | "customer";
};

const roleLabel = (role: string) => {
  switch (role) {
    case "admin":
      return "Administrator";
    case "collector":
      return "Collector";
    default:
      return "Customer";
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.replace("/login");
      return;
    }
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, phone, role")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      setProfile(data as Profile);
      setName(data.full_name ?? "");
      setPhone(data.phone ?? "");
    }
    setLoading(false);
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: name.trim(), phone: phone.trim() || null })
      .eq("id", profile.id);

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setEditing(false);
    load();
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
    setEditing(false);
    setError(null);
  };

  const handleLogout = async () => {
    if (
      !confirm("Log out? You will need to log in again to access your account.")
    )
      return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile)
    return <p className="text-text-secondary">Profile not found.</p>;

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Profile</h1>

      <GlassCard className="p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan text-2xl font-bold">
            {profile.full_name ? profile.full_name[0].toUpperCase() : "?"}
          </div>
          <p className="text-xl font-bold text-text-primary mt-4">
            {profile.full_name}
          </p>
          <span className="mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-neon-cyan/15 text-neon-cyan">
            {roleLabel(profile.role)}
          </span>
        </div>

        {editing ? (
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/10 border border-glass-border rounded-xl px-4 py-2.5 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-text-secondary mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/10 border border-glass-border rounded-xl px-4 py-2.5 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
              />
            </div>
            {error && <p className="text-status-danger text-xs">{error}</p>}
            <div className="flex gap-3 mt-2">
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-glass-border py-2.5 text-sm text-text-secondary hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-neon-cyan text-[#0D0B2E] font-semibold py-2.5 text-sm hover:bg-neon-cyan/90 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col divide-y divide-glass-border">
              <div className="flex items-center gap-3 py-3">
                <Phone className="w-4 h-4 text-text-secondary shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Phone</p>
                  <p className="text-sm text-text-primary mt-0.5">
                    {profile.phone || "Not set"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 py-3">
                <Badge className="w-4 h-4 text-text-secondary shrink-0" />
                <div>
                  <p className="text-xs text-text-secondary">Role</p>
                  <p className="text-sm text-text-primary mt-0.5">
                    {roleLabel(profile.role)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditing(true)}
              className="mt-6 w-full flex items-center justify-center gap-1.5 rounded-xl border border-glass-border py-3 text-sm text-neon-cyan hover:bg-white/10 transition-colors"
            >
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
          </>
        )}

        <button
          onClick={handleLogout}
          className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-xl border border-glass-border py-3 text-sm text-status-danger hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Log out
        </button>
      </GlassCard>
    </div>
  );
}
