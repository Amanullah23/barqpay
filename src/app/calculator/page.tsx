"use client";

import { useState } from "react";
import { Plus, UserMinus, X, Edit3, Copy, RotateCcw } from "lucide-react";
import GlassCard from "@/components/GlassCard";

type FamilyEntry = {
  id: string;
  familyName: string;
  previousReading: string;
  currentReading: string;
};

type ShareResult = {
  entry: FamilyEntry;
  consumption: number;
  sharePercent: number;
  amountDue: number;
};

let idCounter = 0;
const nextId = () => `f${idCounter++}`;

function allocate(entries: FamilyEntry[], masterAmount: number): ShareResult[] {
  const consumptions = entries.map(
    (e) =>
      (parseFloat(e.currentReading) || 0) -
      (parseFloat(e.previousReading) || 0),
  );
  const total = consumptions.reduce((a, b) => a + b, 0);

  return entries.map((entry, i) => {
    const consumption = consumptions[i];
    const share = total > 0 ? consumption / total : 1 / entries.length;
    return {
      entry,
      consumption,
      sharePercent: share * 100,
      amountDue: share * masterAmount,
    };
  });
}

export default function CalculatorPage() {
  const [masterBill, setMasterBill] = useState("");
  const [entries, setEntries] = useState<FamilyEntry[]>([]);
  const [results, setResults] = useState<ShareResult[] | null>(null);
  const [resultMasterAmount, setResultMasterAmount] = useState<number | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  const addFamily = () => {
    setEntries([
      ...entries,
      {
        id: nextId(),
        familyName: `Family ${entries.length + 1}`,
        previousReading: "",
        currentReading: "",
      },
    ]);
  };

  const removeFamily = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const removeAll = () => setEntries([]);

  const updateEntry = (id: string, field: keyof FamilyEntry, value: string) => {
    setEntries(
      entries.map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    );
  };

  const calculate = () => {
    const amount = parseFloat(masterBill);
    if (!amount || amount <= 0) {
      setError("Enter a valid master bill amount.");
      return;
    }
    if (entries.length === 0) {
      setError("Add at least one family.");
      return;
    }
    setError(null);
    setResults(allocate(entries, amount));
    setResultMasterAmount(amount);
  };

  const editInputs = () => {
    setResults(null);
  };

  const resetAll = () => {
    if (!confirm("This clears all families and the bill amount. Continue?"))
      return;
    setEntries([]);
    setMasterBill("");
    setResults(null);
    setResultMasterAmount(null);
  };

  const copyResults = () => {
    if (!results || resultMasterAmount === null) return;
    const lines = [
      "BarqPay — Shared Bill Split",
      `Total bill: ${resultMasterAmount.toFixed(2)} AFN`,
      "---",
      ...results.map(
        (r) =>
          `${r.entry.familyName}: ${r.consumption.toFixed(1)} kWh (${r.sharePercent.toFixed(1)}%) → ${r.amountDue.toFixed(2)} AFN`,
      ),
    ];
    navigator.clipboard.writeText(lines.join("\n"));
    alert("Results copied to clipboard.");
  };

  return (
    <main className="min-h-[calc(100vh-88px)] px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-text-primary mb-6">
          Quick Calculator
        </h1>

        {!results ? (
          <>
            <GlassCard className="mb-4">
              <label className="block text-xs text-text-secondary mb-1">
                Total Bill Amount (AFN)
              </label>
              <input
                type="number"
                value={masterBill}
                onChange={(e) => {
                  setMasterBill(e.target.value);
                  setError(null);
                }}
                placeholder="e.g. 1000"
                className="w-full bg-white/10 border border-glass-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary/60 outline-none focus:border-neon-cyan transition-colors"
              />
            </GlassCard>

            <div className="flex gap-3 mb-4">
              <button
                onClick={addFamily}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-glass-border py-3 text-neon-cyan text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Family
              </button>
              {entries.length > 0 && (
                <button
                  onClick={removeAll}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-glass-border py-3 text-status-danger text-sm font-medium hover:bg-white/10 transition-colors"
                >
                  <UserMinus className="w-4 h-4" /> Remove All
                </button>
              )}
            </div>

            {entries.length === 0 ? (
              <GlassCard className="text-center py-10">
                <p className="text-text-primary font-semibold text-sm">
                  No families added
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  Tap &quot;Add Family&quot; for each meter sharing this bill.
                </p>
              </GlassCard>
            ) : (
              <div className="flex flex-col gap-3 mb-4">
                {entries.map((entry) => (
                  <GlassCard key={entry.id}>
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="text"
                        value={entry.familyName}
                        onChange={(e) =>
                          updateEntry(entry.id, "familyName", e.target.value)
                        }
                        placeholder="Family / Floor name"
                        className="flex-1 bg-transparent border-b border-glass-border pb-1 text-text-primary font-semibold text-sm outline-none focus:border-neon-cyan transition-colors"
                      />
                      <button
                        onClick={() => removeFamily(entry.id)}
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
                          value={entry.previousReading}
                          onChange={(e) =>
                            updateEntry(
                              entry.id,
                              "previousReading",
                              e.target.value,
                            )
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
                          value={entry.currentReading}
                          onChange={(e) =>
                            updateEntry(
                              entry.id,
                              "currentReading",
                              e.target.value,
                            )
                          }
                          className="w-full bg-white/10 border border-glass-border rounded-lg px-3 py-2 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
                        />
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            )}

            {error && (
              <p className="text-status-danger text-sm mb-4">{error}</p>
            )}

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
              <p className="text-xs text-text-secondary">Total Bill</p>
              <p className="text-3xl font-bold text-text-primary mt-1">
                {resultMasterAmount!.toFixed(2)} AFN
              </p>
              <p className="text-xs text-text-secondary mt-2">
                {results.length} families •{" "}
                {results.reduce((s, r) => s + r.consumption, 0).toFixed(1)} kWh
                total
              </p>
            </GlassCard>

            <div className="flex gap-3 mb-4">
              <button
                onClick={editInputs}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-glass-border py-3 text-neon-cyan text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit / Recalculate
              </button>
              <button
                onClick={copyResults}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-glass-border py-3 text-neon-cyan text-sm font-medium hover:bg-white/10 transition-colors"
              >
                <Copy className="w-4 h-4" /> Copy Results
              </button>
            </div>

            <h2 className="text-sm font-semibold text-text-primary mb-2">
              Each Family&apos;s Share
            </h2>
            <div className="flex flex-col gap-3 mb-4">
              {results.map((r) => (
                <GlassCard key={r.entry.id} className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-full bg-neon-cyan/15 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-neon-cyan">
                      {r.sharePercent.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                      {r.entry.familyName}
                    </p>
                    <p className="text-xs text-text-secondary">
                      {r.consumption.toFixed(1)} kWh
                    </p>
                  </div>
                  <p className="text-base font-bold text-neon-cyan">
                    {r.amountDue.toFixed(2)} AFN
                  </p>
                </GlassCard>
              ))}
            </div>

            <button
              onClick={resetAll}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-glass-border py-3 text-status-danger text-sm font-medium hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Start Over
            </button>
          </>
        )}
      </div>
    </main>
  );
}
