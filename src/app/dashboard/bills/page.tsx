"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type Customer = { id: string; full_name: string };
type BillEntry = {
  id: string;
  customer_id: string;
  previous_reading: number;
  current_reading: number;
  share_percent: number;
  amount_due: number;
  status: string;
  created_at: string;
};

const statusColor = (status: string) =>
  status === "paid" ? "text-status-success" : "text-status-warning";
const statusBg = (status: string) =>
  status === "paid" ? "bg-status-success" : "bg-status-warning";

export default function BillsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [entries, setEntries] = useState<BillEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"all" | "unpaid" | "paid">(
    "all",
  );
  const [customerFilter, setCustomerFilter] = useState<string>("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const [{ data: c }, { data: e }] = await Promise.all([
      supabase.from("customers").select("id, full_name").order("full_name"),
      supabase
        .from("family_bill_entries")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);
    setCustomers(c ?? []);
    setEntries(e ?? []);
    setLoading(false);
  };

  const customerName = (id: string) =>
    customers.find((c) => c.id === id)?.full_name ?? "Unknown";

  const filtered = entries.filter((e) => {
    if (customerFilter && e.customer_id !== customerFilter) return false;
    if (statusFilter !== "all" && e.status !== statusFilter) return false;
    return true;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">Bills</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <select
          value={customerFilter}
          onChange={(e) => setCustomerFilter(e.target.value)}
          className="flex-1 bg-white/10 border border-glass-border rounded-xl px-4 py-2.5 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
        >
          <option value="" className="bg-[#241B4A]">
            All customers
          </option>
          {customers.map((c) => (
            <option key={c.id} value={c.id} className="bg-[#241B4A]">
              {c.full_name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {(["all", "unpaid", "paid"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors capitalize ${
                statusFilter === s
                  ? "bg-neon-cyan/20 border-neon-cyan text-neon-cyan"
                  : "border-glass-border text-text-secondary hover:bg-white/10"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-sm font-semibold text-text-primary">
            No bills yet
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Create a bill from the Readings tab.
          </p>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((e) => {
            const consumption = e.current_reading - e.previous_reading;
            return (
              <Link key={e.id} href={`/dashboard/bills/${e.id}`}>
                <GlassCard className="hover-lift flex items-center gap-4">
                  <div
                    className={`w-1 self-stretch rounded-full ${statusBg(e.status)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-primary truncate">
                      {customerName(e.customer_id)}
                    </p>
                    <p className="text-xs text-text-secondary mt-0.5">
                      {consumption.toFixed(1)} kWh
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-text-primary">
                      {Number(e.amount_due).toFixed(2)} AFN
                    </p>
                    <p
                      className={`text-xs font-semibold uppercase ${statusColor(e.status)}`}
                    >
                      {e.status}
                    </p>
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
