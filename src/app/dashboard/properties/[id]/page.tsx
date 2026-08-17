"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type MasterRecord = {
  month_label: string;
  master_bill_amount: number;
  created_at: string;
};

type Entry = {
  id: string;
  customer_id: string;
  previous_reading: number;
  current_reading: number;
  share_percent: number;
  amount_due: number;
  status: string;
};

type Customer = { id: string; full_name: string };

export default function PropertyRecordDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [record, setRecord] = useState<MasterRecord | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: rec } = await supabase
      .from("master_bill_records")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    const { data: ents } = await supabase
      .from("family_bill_entries")
      .select("*")
      .eq("record_id", id);
    const { data: custs } = await supabase
      .from("customers")
      .select("id, full_name");

    setRecord(rec);
    setEntries(ents ?? []);
    setCustomers(custs ?? []);
    setLoading(false);
  };

  const customerName = (customerId: string) =>
    customers.find((c) => c.id === customerId)?.full_name ?? "Unknown";

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!record) return <p className="text-text-secondary">Record not found.</p>;

  const totalConsumption = entries.reduce(
    (s, e) => s + (e.current_reading - e.previous_reading),
    0,
  );

  return (
    <div className="max-w-xl">
      <button
        onClick={() => router.push("/dashboard/properties")}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Bill History
      </button>

      <GlassCard className="mb-4">
        <p className="text-xs text-text-secondary">{record.month_label}</p>
        <p className="text-3xl font-bold text-text-primary mt-1">
          {Number(record.master_bill_amount).toFixed(2)} AFN
        </p>
        <p className="text-xs text-text-secondary mt-2">
          {entries.length} families • {totalConsumption.toFixed(1)} kWh total
        </p>
        <p className="text-xs text-text-secondary mt-0.5">
          Saved {record.created_at.split("T")[0]}
        </p>
      </GlassCard>

      <h2 className="text-sm font-semibold text-text-primary mb-2">
        Each Family&apos;s Share
      </h2>
      <div className="flex flex-col gap-3">
        {entries.map((e) => {
          const consumption = e.current_reading - e.previous_reading;
          const isPaid = e.status === "paid";
          return (
            <GlassCard key={e.id} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">
                  {customerName(e.customer_id)}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">
                  {consumption.toFixed(1)} kWh • {e.share_percent.toFixed(1)}%
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-neon-cyan">
                  {Number(e.amount_due).toFixed(2)} AFN
                </p>
                <p
                  className={`text-xs font-semibold uppercase ${
                    isPaid ? "text-status-success" : "text-status-warning"
                  }`}
                >
                  {e.status}
                </p>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
}
