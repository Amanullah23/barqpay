"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type BillEntry = {
  previous_reading: number;
  current_reading: number;
  share_percent: number;
  amount_due: number;
  status: string;
  paid_date: string | null;
};

export default function MyBillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<BillEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("family_bill_entries")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      setEntry(data);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!entry) return <p className="text-text-secondary">Bill not found.</p>;

  const consumption = entry.current_reading - entry.previous_reading;
  const isPaid = entry.status === "paid";

  return (
    <div>
      <button
        onClick={() => router.push("/my-bills")}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to My Bills
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Bill Details
      </h1>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-text-secondary">Status</p>
          <span
            className={`text-xs font-bold uppercase px-3 py-1.5 rounded-full ${
              isPaid
                ? "bg-status-success/20 text-status-success"
                : "bg-status-warning/20 text-status-warning"
            }`}
          >
            {entry.status}
          </span>
        </div>

        <div className="border-t border-glass-border pt-4 flex flex-col divide-y divide-glass-border">
          {[
            ["Previous Reading", `${entry.previous_reading} kWh`],
            ["Current Reading", `${entry.current_reading} kWh`],
            ["Consumption", `${consumption.toFixed(1)} kWh`],
            ["Share of Total Bill", `${entry.share_percent.toFixed(1)}%`],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between py-2 text-sm">
              <span className="text-text-secondary">{label}</span>
              <span className="text-text-primary font-medium">{value}</span>
            </div>
          ))}
          <div className="flex justify-between py-2">
            <span className="text-text-secondary text-sm font-semibold">
              Amount Due
            </span>
            <span className="text-neon-cyan font-bold">
              {Number(entry.amount_due).toFixed(2)} AFN
            </span>
          </div>
          {entry.paid_date && (
            <div className="flex justify-between py-2 text-sm">
              <span className="text-text-secondary">Paid On</span>
              <span className="text-text-primary font-medium">
                {entry.paid_date}
              </span>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}
