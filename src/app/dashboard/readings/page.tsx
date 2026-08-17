"use client";

import { useEffect, useState } from "react";
import { Plus, UserMinus, X, Edit3, Save, Loader2 } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

type Customer = {
  id: string;
  full_name: string;
  meter_number: string;
  meter_multiplier: number;
};

type Row = {
  id: string;
  customerId: string | null;
  previousReading: string;
  currentReading: string;
};

type Share = {
  customer: Customer;
  previousReading: number;
  currentReading: number;
  consumption: number;
  sharePercent: number;
  amountDue: number;
};

let rowCounter = 0;
const nextRowId = () => `row${rowCounter++}`;

export default function ReadingsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(true);
  const [monthLabel, setMonthLabel] = useState("");
  const [masterBill, setMasterBill] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Share[] | null>(null);
  const [resultAmount, setResultAmount] = useState<number | null>(null);
  const [resultMonth, setResultMonth] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("customers")
      .select("id, full_name, meter_number, meter_multiplier")
      .order("full_name");
    setCustomers(data ?? []);
    setLoadingCustomers(false);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: nextRowId(),
        customerId: null,
        previousReading: "",
        currentReading: "",
      },
    ]);
  };

  const removeRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const updateRow = async (id: string, field: keyof Row, value: string) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r)),
    );

    if (field === "customerId") {
      const supabase = createClient();
      const { data: last } = await supabase
        .from("family_bill_entries")
        .select("current_reading")
        .eq("customer_id", value)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (last) {
        setRows((prev) =>
          prev.map((r) =>
            r.id === id
              ? { ...r, previousReading: String(last.current_reading) }
              : r,
          ),
        );
      }
    }
  };

  const usedCustomerIds = (excludeRowId: string) =>
    new Set(
      rows
        .filter((r) => r.id !== excludeRowId && r.customerId)
        .map((r) => r.customerId),
    );

  const calculate = () => {
    setError(null);
    if (!monthLabel.trim()) {
      setError("Enter a month label (e.g. Dalw 1404).");
      return;
    }
    const amount = parseFloat(masterBill);
    if (!amount || amount <= 0) {
      setError("Enter a valid master bill amount.");
      return;
    }
    if (rows.length === 0 || rows.some((r) => !r.customerId)) {
      setError("Add at least one family and select a customer for each.");
      return;
    }

    const raw = rows.map((r) => {
      const customer = customers.find((c) => c.id === r.customerId)!;
      const previous = parseFloat(r.previousReading) || 0;
      const current = parseFloat(r.currentReading) || 0;
      const consumption = (current - previous) * customer.meter_multiplier;
      return { customer, previous, current, consumption };
    });

    const total = raw.reduce((s, r) => s + r.consumption, 0);

    const shares: Share[] = raw.map((r) => {
      const share = total > 0 ? r.consumption / total : 1 / raw.length;
      return {
        customer: r.customer,
        previousReading: r.previous,
        currentReading: r.current,
        consumption: r.consumption,
        sharePercent: share * 100,
        amountDue: share * amount,
      };
    });

    setResults(shares);
    setResultAmount(amount);
    setResultMonth(monthLabel.trim());
  };

  const saveBill = async () => {
    if (!results || resultAmount === null || resultMonth === null) return;
    setSaving(true);
    const supabase = createClient();

    const { data: record, error: recordError } = await supabase
      .from("master_bill_records")
      .insert({ month_label: resultMonth, master_bill_amount: resultAmount })
      .select()
      .single();

    if (recordError || !record) {
      setError("Failed to save: " + recordError?.message);
      setSaving(false);
      return;
    }

    const entryRows = results.map((s) => ({
      record_id: record.id,
      customer_id: s.customer.id,
      previous_reading: s.previousReading,
      current_reading: s.currentReading,
      share_percent: s.sharePercent,
      amount_due: s.amountDue,
    }));

    const { error: entriesError } = await supabase
      .from("family_bill_entries")
      .insert(entryRows);

    if (entriesError) {
      setError("Failed to save entries: " + entriesError.message);
      setSaving(false);
      return;
    }

    setMonthLabel("");
    setMasterBill("");
    setRows([]);
    setResults(null);
    setResultAmount(null);
    setResultMonth(null);
    setSaving(false);
    alert("Bill saved and split across all families.");
  };

  const editInputs = () => setResults(null);

  if (loadingCustomers) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-text-primary mb-6">New Bill</h1>

      {!results ? (
        <>
          <GlassCard className="mb-4">
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-xs text-text-secondary mb-1.5">
                  Month (e.g. Dalw 1404)
                </label>
                <input
                  type="text"
                  value={monthLabel}
                  onChange={(e) => setMonthLabel(e.target.value)}
                  className="w-full bg-white/10 border border-glass-border rounded-xl px-4 py-2.5 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-text-secondary mb-1.5">
                  Master Bill Amount (AFN) — from Breshna
                </label>
                <input
                  type="number"
                  value={masterBill}
                  onChange={(e) => setMasterBill(e.target.value)}
                  className="w-full bg-white/10 border border-glass-border rounded-xl px-4 py-2.5 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
            </div>
          </GlassCard>

          <div className="flex gap-3 mb-4">
            <button
              onClick={addRow}
              disabled={customers.length === 0}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-glass-border py-2.5 text-neon-cyan text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4" /> Add Family
            </button>
            {rows.length > 0 && (
              <button
                onClick={() => setRows([])}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-glass-border py-2.5 text-status-danger text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <UserMinus className="w-4 h-4" /> Remove All
              </button>
            )}
          </div>

          {customers.length === 0 ? (
            <GlassCard className="text-center py-10">
              <p className="text-sm font-semibold text-text-primary">
                No customers yet
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Add customers first from the Customers tab.
              </p>
            </GlassCard>
          ) : rows.length === 0 ? (
            <GlassCard className="text-center py-10">
              <p className="text-sm font-semibold text-text-primary">
                No families added
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Tap &quot;Add Family&quot; for each customer sharing this bill.
              </p>
            </GlassCard>
          ) : (
            <div className="flex flex-col gap-3 mb-4">
              {rows.map((row) => {
                const used = usedCustomerIds(row.id);
                const available = customers.filter(
                  (c) => c.id === row.customerId || !used.has(c.id),
                );
                return (
                  <GlassCard key={row.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <select
                        value={row.customerId ?? ""}
                        onChange={(e) =>
                          updateRow(row.id, "customerId", e.target.value)
                        }
                        className="flex-1 bg-white/10 border border-glass-border rounded-xl px-3 py-2 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
                      >
                        <option value="" disabled>
                          Select customer
                        </option>
                        {available.map((c) => (
                          <option
                            key={c.id}
                            value={c.id}
                            className="bg-[#241B4A]"
                          >
                            {c.full_name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => removeRow(row.id)}
                        className="text-status-danger hover:opacity-70 transition-opacity"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Previous (kWh)
                        </label>
                        <input
                          type="number"
                          value={row.previousReading}
                          onChange={(e) =>
                            updateRow(row.id, "previousReading", e.target.value)
                          }
                          className="w-full bg-white/10 border border-glass-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-text-secondary mb-1">
                          Current (kWh)
                        </label>
                        <input
                          type="number"
                          value={row.currentReading}
                          onChange={(e) =>
                            updateRow(row.id, "currentReading", e.target.value)
                          }
                          className="w-full bg-white/10 border border-glass-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
                        />
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}

          {error && <p className="text-status-danger text-sm mb-4">{error}</p>}

          <button
            onClick={calculate}
            className="w-full bg-neon-cyan text-[#0D0B2E] font-bold rounded-xl py-3.5 hover:bg-neon-cyan/90 transition-colors"
          >
            Calculate Split
          </button>
        </>
      ) : (
        <>
          <GlassCard className="mb-4">
            <p className="text-xs text-text-secondary">{resultMonth}</p>
            <p className="text-3xl font-bold text-text-primary mt-1">
              {resultAmount!.toFixed(2)} AFN
            </p>
            <p className="text-xs text-text-secondary mt-2">
              {results.length} families •{" "}
              {results.reduce((s, r) => s + r.consumption, 0).toFixed(1)} kWh
              total
            </p>
          </GlassCard>

          {error && <p className="text-status-danger text-sm mb-4">{error}</p>}

          <div className="flex gap-3 mb-4">
            <button
              onClick={editInputs}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-glass-border py-2.5 text-neon-cyan text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
            >
              <Edit3 className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={saveBill}
              disabled={saving}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-neon-cyan text-[#0D0B2E] font-semibold py-2.5 text-sm hover:bg-neon-cyan/90 transition-colors disabled:opacity-60"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saving ? "Saving..." : "Save Bill"}
            </button>
          </div>

          <h2 className="text-sm font-semibold text-text-primary mb-2">
            Each Family&apos;s Share
          </h2>
          <div className="flex flex-col gap-3">
            {results.map((r) => (
              <GlassCard
                key={r.customer.id}
                className="flex items-center gap-4"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {r.customer.full_name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {r.consumption.toFixed(1)} kWh • {r.sharePercent.toFixed(1)}
                    %
                  </p>
                </div>
                <p className="text-base font-bold text-neon-cyan">
                  {r.amountDue.toFixed(2)} AFN
                </p>
              </GlassCard>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
