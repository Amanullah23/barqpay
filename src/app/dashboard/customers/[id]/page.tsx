"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit3, Trash2, Save, X } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import { createClient } from "@/lib/supabase";

const fields = [
  { key: "customer_code", label: "Customer Code" },
  { key: "full_name", label: "Full Name" },
  { key: "father_name", label: "Father's Name" },
  { key: "address", label: "Address" },
  { key: "phone", label: "Phone" },
  { key: "meter_number", label: "Meter Number" },
  { key: "meter_multiplier", label: "Meter Multiplier", type: "number" },
  { key: "account_number", label: "Account Number" },
  { key: "subscription_number", label: "Subscription Number" },
];

type CustomerData = Record<string, string | number | null>;

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [billCount, setBillCount] = useState(0);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const load = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (data) {
      setCustomer(data);
      setValues(
        Object.fromEntries(
          fields.map((f) => [f.key, String(data[f.key] ?? "")]),
        ),
      );
    }
    const { count } = await supabase
      .from("family_bill_entries")
      .select("*", { count: "exact", head: true })
      .eq("customer_id", id);
    setBillCount(count ?? 0);
    setLoading(false);
  };

  const handleChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("customers")
      .update({
        customer_code: values.customer_code.trim(),
        full_name: values.full_name.trim(),
        father_name: values.father_name.trim() || null,
        address: values.address.trim() || null,
        phone: values.phone.trim() || null,
        meter_number: values.meter_number.trim(),
        meter_multiplier: parseFloat(values.meter_multiplier) || 1,
        account_number: values.account_number.trim() || null,
        subscription_number: values.subscription_number.trim() || null,
      })
      .eq("id", id);
    setSaving(false);
    setEditing(false);
    load();
  };

  const handleDelete = async () => {
    const message =
      billCount > 0
        ? `This customer has ${billCount} bill${billCount === 1 ? "" : "s"} on record. Deleting will also permanently remove all of their bills. Continue?`
        : "This removes the customer permanently. Continue?";
    if (!confirm(message)) return;

    const supabase = createClient();
    await supabase.from("customers").delete().eq("id", id);
    router.push("/dashboard/customers");
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-white/20 border-t-neon-cyan rounded-full animate-spin" />
      </div>
    );
  }

  if (!customer) {
    return <p className="text-text-secondary">Customer not found.</p>;
  }

  return (
    <div className="max-w-xl">
      <button
        onClick={() => router.push("/dashboard/customers")}
        className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Customers
      </button>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">
          {editing ? "Edit Customer" : String(customer.full_name)}
        </h1>
        <div className="flex gap-2">
          {editing ? (
            <>
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 text-sm font-semibold bg-neon-cyan text-[#0D0B2E] px-4 py-2 rounded-xl hover:bg-neon-cyan/90 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Edit3 className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 text-sm text-status-danger px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </>
          )}
        </div>
      </div>

      <GlassCard>
        {editing ? (
          <div className="flex flex-col gap-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="block text-xs text-text-secondary mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type ?? "text"}
                  value={values[f.key]}
                  onChange={(e) => handleChange(f.key, e.target.value)}
                  className="w-full bg-white/10 border border-glass-border rounded-xl px-4 py-2.5 text-text-primary text-sm outline-none focus:border-neon-cyan transition-colors"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-glass-border">
            {fields.map((f) => {
              const val = customer[f.key];
              if (!val) return null;
              return (
                <div key={f.key} className="py-3 first:pt-0 last:pb-0">
                  <p className="text-xs text-text-secondary">{f.label}</p>
                  <p className="text-sm text-text-primary mt-0.5">{val}</p>
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
