"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type Customer = { id: string; full_name: string };
type BillEntry = {
  customer_id: string;
  amount_due: number;
  status: string;
  paid_date: string | null;
};

type Summary = {
  customer: Customer;
  totalUnpaid: number;
  unpaidCount: number;
  lastPaymentDate: string | null;
  isFullyPaid: boolean;
};

export default function PaymentsPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: customers }, { data: entries }] = await Promise.all([
      supabase.from("customers").select("id, full_name"),
      supabase
        .from("family_bill_entries")
        .select("customer_id, amount_due, status, paid_date"),
    ]);

    const list: Summary[] = [];
    for (const customer of customers ?? []) {
      const custEntries = (entries ?? []).filter(
        (e: BillEntry) => e.customer_id === customer.id,
      );
      if (custEntries.length === 0) continue;

      const unpaid = custEntries.filter((e) => e.status === "unpaid");
      const totalUnpaid = unpaid.reduce((s, e) => s + Number(e.amount_due), 0);
      const paidDates = custEntries
        .filter((e) => e.paid_date)
        .map((e) => e.paid_date as string)
        .sort();

      list.push({
        customer,
        totalUnpaid,
        unpaidCount: unpaid.length,
        lastPaymentDate: paidDates.length
          ? paidDates[paidDates.length - 1]
          : null,
        isFullyPaid: totalUnpaid <= 0,
      });
    }
    list.sort((a, b) => b.totalUnpaid - a.totalUnpaid);

    setSummaries(list);
    setLoading(false);
  };

  const totalOutstanding = summaries.reduce((s, x) => s + x.totalUnpaid, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Payments</h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
        </div>
      ) : summaries.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-sm font-semibold text-text-primary">
            No bills yet
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Once bills are created, payment status shows up here.
          </p>
        </GlassCard>
      ) : (
        <>
          <GlassCard className="mb-4 flex items-center justify-between">
            <p className="text-sm text-text-secondary">Total Outstanding</p>
            <p
              className={`text-xl font-bold ${
                totalOutstanding > 0
                  ? "text-status-warning"
                  : "text-status-success"
              }`}
            >
              {totalOutstanding.toFixed(2)} AFN
            </p>
          </GlassCard>

          <div className="flex flex-col gap-3">
            {summaries.map((s) => (
              <Link
                key={s.customer.id}
                href={`/dashboard/payments/${s.customer.id}`}
              >
                <GlassCard className="hover-lift flex items-center gap-4">
                  {s.isFullyPaid ? (
                    <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {s.customer.full_name}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {s.isFullyPaid
                        ? `All paid${s.lastPaymentDate ? ` • last ${s.lastPaymentDate}` : ""}`
                        : `${s.unpaidCount} unpaid bill${s.unpaidCount === 1 ? "" : "s"}`}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-bold shrink-0 ${
                      s.isFullyPaid
                        ? "text-status-success"
                        : "text-status-warning"
                    }`}
                  >
                    {s.isFullyPaid ? "PAID" : `${s.totalUnpaid.toFixed(2)} AFN`}
                  </p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
