"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Trash2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type BillRecord = {
  id: string;
  month_label: string;
  master_bill_amount: number;
  created_at: string;
};

export default function PropertiesPage() {
  const [records, setRecords] = useState<BillRecord[]>([]);
  const [familyCounts, setFamilyCounts] = useState<Record<string, number>>(
    {} as Record<string, number>,
  );
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data: recs } = await supabase
      .from("master_bill_records")
      .select("*")
      .order("created_at", { ascending: false });

    const counts: Record<string, number> = {};
    for (const r of recs ?? []) {
      const { count } = await supabase
        .from("family_bill_entries")
        .select("*", { count: "exact", head: true })
        .eq("record_id", r.id);
      counts[r.id] = count ?? 0;
    }

    setRecords(recs ?? []);
    setFamilyCounts(counts);
    setLoading(false);
  };

  const handleDelete = async (record: BillRecord) => {
    const confirmed = confirm(
      `${record.month_label} (${Number(record.master_bill_amount).toFixed(2)} AFN) and all its family bills will be permanently removed. Continue?`,
    );
    if (!confirmed) return;

    setDeletingId(record.id);
    const supabase = createClient();
    await supabase.from("master_bill_records").delete().eq("id", record.id);
    await load();
    setDeletingId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Bill History
      </h1>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
        </div>
      ) : records.length === 0 ? (
        <GlassCard className="text-center py-12">
          <p className="text-sm font-semibold text-text-primary">
            No records yet
          </p>
          <p className="text-xs text-text-secondary mt-1">
            Saved bills from the Readings tab will show up here.
          </p>
        </GlassCard>
      ) : (
        <div className="flex flex-col gap-3">
          {records.map((r) => (
            <GlassCard key={r.id} className="flex items-center gap-4">
              <Link
                href={`/dashboard/properties/${r.id}`}
                className="flex items-center gap-4 flex-1 min-w-0"
              >
                <div className="w-11 h-11 rounded-full bg-neon-purple/15 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-neon-purple" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {r.month_label}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5">
                    {familyCounts[r.id] ?? 0} families
                  </p>
                </div>
              </Link>
              <p className="text-sm font-bold text-neon-cyan shrink-0">
                {Number(r.master_bill_amount).toFixed(2)} AFN
              </p>
              <button
                onClick={() => handleDelete(r)}
                disabled={deletingId === r.id}
                className="text-status-danger hover:opacity-70 transition-opacity shrink-0 disabled:opacity-40"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
