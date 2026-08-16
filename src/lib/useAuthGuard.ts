"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  role: "admin" | "collector" | "customer";
};

export function useAuthGuard(allowedRoles?: Array<Profile["role"]>) {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const check = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, full_name, phone, role")
        .eq("id", user.id)
        .maybeSingle();

      if (!profileData) {
        router.replace("/login");
        return;
      }

      if (allowedRoles && !allowedRoles.includes(profileData.role)) {
        router.replace(
          profileData.role === "customer" ? "/my-bills" : "/dashboard",
        );
        return;
      }

      setProfile(profileData as Profile);
      setLoading(false);
    };

    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { profile, loading };
}
