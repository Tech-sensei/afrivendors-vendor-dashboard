import { CalendarClock, CreditCard, Eye } from "lucide-react";
import { VENDOR_TRIAL_MONTHS } from "@/data/subscriptionPlans";

const perks = [
  {
    icon: Eye,
    label: "Visible from day one",
  },
  {
    icon: CalendarClock,
    label: `${VENDOR_TRIAL_MONTHS}-month free trial`,
  },
  {
    icon: CreditCard,
    label: "No card required now",
  },
] as const;

export function TrialPerksRow() {
  return (
    <ul className="mt-8 grid gap-3 text-left sm:grid-cols-3">
      {perks.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex items-center gap-2.5 rounded-xl border border-[#EFE6E1] bg-[#FAF7F5] px-3 py-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-100/10">
            <Icon className="h-4 w-4 text-primary-100" aria-hidden />
          </span>
          <span className="text-xs font-semibold leading-snug text-secondary-000">
            {label}
          </span>
        </li>
      ))}
    </ul>
  );
}
