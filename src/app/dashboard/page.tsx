"use client";

import { useEffect, useState } from "react";
import { Users, Receipt, Wallet, AlertCircle } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    customerCount: 0,
    billCount: 0,
    unpaidCount: 0,
    unpaidTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      const { count: customerCount } = await supabase
        .from("customers")
        .select("*", { count: "exact", head: true });

      const { data: entries } = await supabase
        .from("family_bill_entries")
        .select("status, amount_due");

      const billCount = entries?.length ?? 0;
      const unpaid = entries?.filter((e) => e.status === "unpaid") ?? [];
      const unpaidCount = unpaid.length;
      const unpaidTotal = unpaid.reduce(
        (sum, e) => sum + Number(e.amount_due),
        0,
      );

      setStats({
        customerCount: customerCount ?? 0,
        billCount,
        unpaidCount,
        unpaidTotal,
      });
      setLoading(false);
    };

    load();
  }, []);

  const cards = [
    {
      icon: Users,
      color: "text-neon-cyan",
      bg: "bg-neon-cyan/15",
      label: "Total Customers",
      value: stats.customerCount,
    },
    {
      icon: Receipt,
      color: "text-neon-purple",
      bg: "bg-neon-purple/15",
      label: "Total Bills",
      value: stats.billCount,
    },
    {
      icon: AlertCircle,
      color: "text-status-warning",
      bg: "bg-status-warning/15",
      label: "Unpaid Bills",
      value: stats.unpaidCount,
    },
    {
      icon: Wallet,
      color: "text-status-danger",
      bg: "bg-status-danger/15",
      label: "Outstanding",
      value: `${stats.unpaidTotal.toFixed(2)} AFN`,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Overview</h1>
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((c) => (
            <GlassCard key={c.label}>
              <div
                className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center mb-3`}
              >
                <c.icon className={`w-5 h-5 ${c.color}`} />
              </div>
              <p className="text-xs text-text-secondary">{c.label}</p>
              <p className="text-xl font-bold text-text-primary mt-1">
                {c.value}
              </p>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
