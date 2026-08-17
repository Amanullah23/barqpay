"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, User } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type BillEntry = {
  id: string;
  previous_reading: number;
  current_reading: number;
  amount_due: number;
  status: string;
  created_at: string;
};

export default function MyBillsPage() {
  const [entries, setEntries] = useState<BillEntry[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: customer } = await supabase
      .from("customers")
      .select("id, full_name")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (!customer) {
      setLoading(false);
      return;
    }
    setCustomerName(customer.full_name);

    const { data: bills } = await supabase
      .from("family_bill_entries")
      .select("*")
      .eq("customer_id", customer.id)
      .order("created_at", { ascending: false });

    setEntries(bills ?? []);
    setLoading(false);
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">My Bills</h1>
        <Link
          href="/my-bills/profile"
          className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan hover:bg-neon-cyan/30 transition-colors"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>

      {!customerName ? (
        <GlassCard className="text-center py-12">
          <p className="text-sm font-semibold text-text-primary">
            Your account is not linked to a customer record yet
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Contact your admin for help.
          </p>
        </GlassCard>
      ) : entries.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-sm font-semibold text-text-primary">
            No bills yet
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Your bills will show up here once created by the admin.
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
                <Link key={e.id} href={`/my-bills/${e.id}`}>
                  <GlassCard className="hover-lift flex items-center gap-4">
                    {isPaid ? (
                      <CheckCircle2 className="w-5 h-5 text-status-success shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-status-warning shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-text-primary">
                        {Number(e.amount_due).toFixed(2)} AFN
                      </p>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {consumption.toFixed(1)} kWh •{" "}
                        {e.created_at.split("T")[0]}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase shrink-0 ${
                        isPaid ? "text-status-success" : "text-status-warning"
                      }`}
                    >
                      {e.status}
                    </span>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
