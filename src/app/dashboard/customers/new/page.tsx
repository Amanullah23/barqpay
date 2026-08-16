"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

const fields = [
  { key: "customer_code", label: "Customer Code", required: true },
  { key: "full_name", label: "Full Name", required: true },
  { key: "father_name", label: "Father's Name" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "meter_number", label: "Meter Number", required: true },
  {
    key: "meter_multiplier",
    label: "Meter Multiplier",
    type: "number",
    defaultValue: "1",
  },
  { key: "account_number", label: "Account Number" },
  { key: "subscription_number", label: "Subscription Number" },
];

export default function NewCustomerPage() {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ""])),
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const supabase = createClient();
    const { error: insertError } = await supabase.from("customers").insert({
      customer_code: values.customer_code.trim(),
      full_name: values.full_name.trim(),
      father_name: values.father_name.trim() || null,
      address: values.address.trim() || null,
      phone: values.phone.trim() || null,
      meter_number: values.meter_number.trim(),
      meter_multiplier: parseFloat(values.meter_multiplier) || 1,
      account_number: values.account_number.trim() || null,
      subscription_number: values.subscription_number.trim() || null,
    });

    if (insertError) {
      setError(insertError.message);
      setSaving(false);
      return;
    }

    router.push("/dashboard/customers");
  };

  return (
    <div className="max-w-xl">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h1 className="text-2xl font-bold text-text-primary mb-6">
        Add Customer
      </h1>

      <GlassCard>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="block text-xs text-text-secondary mb-1.5">
                {f.label}
              </label>
              <input
                type={f.type ?? "text"}
                required={f.required}
                value={values[f.key]}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className="w-full bg-white/10 border border-glass-border rounded-xl px-4 py-2.5 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
              />
            </div>
          ))}

          {error && <p className="text-status-danger text-xs">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="mt-2 bg-neon-cyan text-[#0D0B2E] font-bold rounded-xl py-3 hover:bg-neon-cyan/90 transition-colors disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Customer"}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
