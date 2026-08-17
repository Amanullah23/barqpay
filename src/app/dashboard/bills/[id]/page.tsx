"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, RotateCcw } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type BillEntry = {
  id: string;
  customer_id: string;
  previous_reading: number;
  current_reading: number;
  share_percent: number;
  amount_due: number;
  status: string;
  paid_date: string | null;
};

type Customer = { full_name: string; meter_number: string };

export default function BillDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [entry, setEntry] = useState<BillEntry | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: e } = await supabase
      .from("family_bill_entries")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (e) {
      setEntry(e);
      const { data: c } = await supabase
        .from("customers")
        .select("full_name, meter_number")
        .eq("id", e.customer_id)
        .maybeSingle();
      setCustomer(c);
    }
    setLoading(false);
  };

  const togglePaid = async () => {
    if (!entry) return;
    setUpdating(true);
    const supabase = createClient();
    if (entry.status === "paid") {
      await supabase
        .from("family_bill_entries")
        .update({ status: "unpaid", paid_date: null })
        .eq("id", entry.id);
    } else {
      await supabase
        .from("family_bill_entries")
        .update({
          status: "paid",
          paid_date: new Date().toISOString().split("T")[0],
        })
        .eq("id", entry.id);
    }
    await load();
    setUpdating(false);
  };

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
    <div className="max-w-xl">
      <button
        onClick={() => router.push("/dashboard/bills")}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Bills
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Bill Details
      </h1>

      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-bold text-text-primary">
              {customer?.full_name ?? "Unknown"}
            </p>
            {customer && (
              <p className="text-xs text-text-secondary">
                Meter: {customer.meter_number}
              </p>
            )}
          </div>
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

      <button
        onClick={togglePaid}
        disabled={updating}
        className={`mt-4 w-full flex items-center justify-center gap-2 rounded-xl py-3.5 font-bold transition-colors disabled:opacity-60 ${
          isPaid
            ? "border border-glass-border text-text-secondary hover:bg-white/10"
            : "bg-neon-cyan text-[#0D0B2E] hover:bg-neon-cyan/90"
        }`}
      >
        {isPaid ? (
          <RotateCcw className="w-4 h-4" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        {updating ? "Updating..." : isPaid ? "Mark as Unpaid" : "Mark as Paid"}
      </button>
    </div>
  );
}
