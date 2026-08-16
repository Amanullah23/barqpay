import {
  BookOpen,
  Calculator,
  LogIn,
  Users,
  Gauge,
  Receipt,
  Wallet,
  History,
} from "lucide-react";
import GlassCard from "@/components/GlassCard";

const sections = [
  {
    icon: Calculator,
    color: "text-neon-cyan",
    title: "Using the Quick Calculator",
    steps: [
      'Go to Home and choose "Quick Calculator" — no account needed.',
      "Enter the total bill amount received from Breshna, in AFN.",
      'Tap "Add Family" for each family or floor sharing this bill.',
      "For each family, enter their previous and current meter reading.",
      'Tap "Calculate Split" to see each family\'s exact share.',
      'Use "Copy Results" to share the breakdown, or "Edit / Recalculate" to adjust the numbers.',
    ],
  },
  {
    icon: LogIn,
    color: "text-neon-purple",
    title: "Logging In",
    steps: [
      'Go to Home and choose "Login".',
      "Enter the email and password given to you by your BarqPay administrator.",
      "Admins and collectors land on the management dashboard; customers see their own bills.",
    ],
  },
  {
    icon: Users,
    color: "text-neon-blue",
    title: "Managing Customers (Admin)",
    steps: [
      "Open the Customers tab from the dashboard.",
      "Tap the + button to add a new customer — fill in their name, meter number, and contact details.",
      "Tap any customer to view full details, edit their information, or delete them.",
      "Deleting a customer with existing bills will ask you to confirm removing their bills too.",
    ],
  },
  {
    icon: Gauge,
    color: "text-neon-yellow",
    title: "Creating a Bill (Admin)",
    steps: [
      "Open the Readings tab.",
      'Enter the month label (e.g. "Dalw 1404") and the total master bill amount from Breshna.',
      "Add each family sharing the bill by selecting them from your customer list.",
      "Enter each family's previous and current meter reading — previous reading auto-fills from their last saved bill.",
      'Tap "Calculate Split" to review the breakdown, then "Save Bill" to record it permanently.',
    ],
  },
  {
    icon: Receipt,
    color: "text-neon-pink",
    title: "Viewing Bills",
    steps: [
      "Open the Bills tab to see every generated bill, filterable by customer or paid/unpaid status.",
      "Tap any bill to see its full breakdown — consumption, share percentage, and amount due.",
      'Toggle a bill between "Mark as Paid" and "Mark as Unpaid" directly from its detail view.',
    ],
  },
  {
    icon: Wallet,
    color: "text-status-success",
    title: "Tracking Payments",
    steps: [
      "Open the Payments tab to see every customer's outstanding balance, sorted highest first.",
      "Tap a customer to see all their individual bills and mark each one as paid.",
      "Balances update automatically — there's nothing to calculate by hand.",
    ],
  },
  {
    icon: History,
    color: "text-neon-purple",
    title: "Viewing Bill History",
    steps: [
      'Open the Properties tab (labeled "Bill History") to see every saved monthly bill.',
      "Tap any record to see the full family-by-family breakdown for that month.",
      "Use the delete icon to permanently remove an old record, along with all its family bills.",
    ],
  },
];

export default function DocsPage() {
  return (
    <main className="min-h-[calc(100vh-88px)] px-4 py-12 md:py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="w-14 h-14 rounded-full bg-neon-cyan/20 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-7 h-7 text-neon-cyan" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
            User Guide
          </h1>
          <p className="text-text-secondary text-sm mt-3">
            Step-by-step instructions for every part of BarqPay.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {sections.map((section, i) => (
            <GlassCard
              key={section.title}
              className={`animate-fade-in-up delay-${Math.min((i % 5) + 1, 5)}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <section.icon className={`w-4 h-4 ${section.color}`} />
                </div>
                <h2 className="text-base font-semibold text-text-primary">
                  {section.title}
                </h2>
              </div>
              <ol className="flex flex-col gap-2">
                {section.steps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-sm text-text-secondary"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-white/10 text-text-primary text-xs font-semibold flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </GlassCard>
          ))}
        </div>
      </div>
    </main>
  );
}
