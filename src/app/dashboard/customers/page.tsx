"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Zap } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type Customer = {
  id: string;
  customer_code: string;
  full_name: string;
  meter_number: string;
  status: string;
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("customers")
      .select("id, customer_code, full_name, meter_number, status")
      .order("created_at", { ascending: false });
    setCustomers(data ?? []);
    setLoading(false);
  };

  const filtered = customers.filter(
    (c) =>
      c.full_name.toLowerCase().includes(search.toLowerCase()) ||
      c.meter_number.toLowerCase().includes(search.toLowerCase()) ||
      c.customer_code.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Customers</h1>
        <Link
          href="/dashboard/customers/new"
          className="flex items-center gap-2 bg-neon-cyan text-[#0D0B2E] text-sm font-semibold rounded-xl px-4 py-2.5 hover:bg-neon-cyan/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Customer
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, meter number, or code..."
          className="w-full bg-white/10 border border-glass-border rounded-xl pl-10 pr-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/60 outline-none focus:border-neon-cyan transition-colors"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-sm font-semibold text-text-primary">
            No customers found
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {customers.length === 0
              ? "Add your first customer to get started."
              : "Try a different search."}
          </p>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((c) => (
            <Link key={c.id} href={`/dashboard/customers/${c.id}`}>
              <GlassCard className="hover-lift flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-neon-cyan/20 flex items-center justify-center shrink-0 text-neon-cyan font-bold">
                  {c.full_name ? c.full_name[0].toUpperCase() : "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {c.full_name}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Meter: {c.meter_number} • {c.customer_code}
                  </p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-status-success/20 text-status-success shrink-0">
                  {c.status}
                </span>
              </GlassCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
