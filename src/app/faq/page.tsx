"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import GlassCard from "@/components/GlassCard";

const faqs = [
  {
    q: "How does the Quick Calculator work?",
    a: "Enter the total Breshna bill amount, then add each family with their previous and current meter reading. BarqPay calculates each family's consumption and splits the bill proportionally — no login or account needed, and nothing is saved.",
  },
  {
    q: "What's the difference between the Quick Calculator and logging in?",
    a: "The Quick Calculator is a one-time, no-account tool — enter numbers, get a split, done. Logging in lets you save every month's bill permanently, manage a full customer directory, track who has paid, and look back at past history anytime.",
  },
  {
    q: "How is each family's share calculated?",
    a: "Each family's consumption (current reading minus previous reading) is compared to the total consumption of everyone sharing the bill. Their share of the total bill is exactly proportional to their share of total usage.",
  },
  {
    q: "Do I need a meter for every family?",
    a: "Yes — BarqPay is built around the real scenario where each family has their own sub-meter, even though Breshna sends one combined bill for the whole building or connection.",
  },
  {
    q: "Is my data private?",
    a: "Yes. When you log in, your data is protected with role-based access — customers can only see their own bills, and only admins/collectors can see and manage the full customer list, all enforced at the database level.",
  },
  {
    q: "Is BarqPay free to use?",
    a: "The Quick Calculator is completely free with no account needed. For questions about the full logged-in version for property management, reach out via the RFQ/contact options.",
  },
  {
    q: "Can I use BarqPay on my phone?",
    a: "Yes — BarqPay has a dedicated mobile app in addition to this website, and both stay in sync with the same account.",
  },
  {
    q: "What currency does BarqPay use?",
    a: "All amounts are calculated and displayed in AFN (Afghani), matching how Breshna bills are issued.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <main className="min-h-[calc(100vh-88px)] px-4 py-12 md:py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="w-14 h-14 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-7 h-7 text-neon-cyan" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            Frequently Asked Questions
          </h1>
          <p className="text-text-secondary text-sm mt-3">
            Everything you need to know about how BarqPay works.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <GlassCard
                key={faq.q}
                className={`animate-fade-in-up delay-${Math.min((i % 5) + 1, 5)} !p-0 overflow-hidden`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-text-primary">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neon-cyan shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4">
                    <p className="text-xs text-text-secondary leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </GlassCard>
            );
          })}
        </div>
      </div>
    </main>
  );
}
