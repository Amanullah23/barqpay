"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type BillEntry = {
  id: string;
  amount_due: number;
  status: string;
  paid_date: string | null;
  previous_reading: number;
  current_reading: number;
  created_at: string;
};

export default function CustomerPaymentDetailPage() {
  const { customerId } = useParams<{ customerId: string }>();
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [entries, setEntries] = useState<BillEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerId]);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: customer } = await supabase
      .from("customers")
      .select("full_name")
      .eq("id", customerId)
      .maybeSingle();
    if (customer) setCustomerName(customer.full_name);

    const { data } = await supabase
      .from("family_bill_entries")
      .select("*")
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });
    setEntries(data ?? []);
    setLoading(false);
  };

  const togglePaid = async (entry: BillEntry) => {
    setUpdatingId(entry.id);
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
    setUpdatingId(null);
  };

  const totalUnpaid = entries
    .filter((e) => e.status === "unpaid")
    .reduce((s, e) => s + Number(e.amount_due), 0);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <button
        onClick={() => router.push("/dashboard/payments")}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Payments
      </button>

      <h1 className="text-2xl font-bold text-text-primary mb-6">
        {customerName}
      </h1>

      {entries.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-sm text-text-secondary">
            This customer has no bills recorded.
          </p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="mb-4 flex items-center justify-between">
            <p className="text-sm text-text-secondary">Outstanding Balance</p>
            <p
              className={`text-xl font-bold ${
                totalUnpaid > 0 ? "text-status-warning" : "text-status-success"
              }`}
            >
              {totalUnpaid.toFixed(2)} AFN
            </p>
          </GlassCard>

          <div className="flex flex-col gap-3">
            {entries.map((e) => {
              const consumption = e.current_reading - e.previous_reading;
              const isPaid = e.status === "paid";
              return (
                <GlassCard key={e.id} className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-primary">
                      {Number(e.amount_due).toFixed(2)} AFN
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {consumption.toFixed(1)} kWh •{" "}
                      {e.created_at.split("T")[0]}
                    </p>
                    {e.paid_date && (
                      <p className="text-xs text-status-success mt-0.5">
                        Paid {e.paid_date}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => togglePaid(e)}
                    disabled={updatingId === e.id}
                    className={`shrink-0 text-xs font-bold uppercase px-3 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                      isPaid
                        ? "bg-status-success/15 text-status-success"
                        : "bg-status-warning/15 text-status-warning hover:bg-status-warning/25"
                    }`}
                  >
                    {updatingId === e.id
                      ? "..."
                      : isPaid
                        ? "Paid ✓"
                        : "Mark Paid"}
                  </button>
                </GlassCard>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
