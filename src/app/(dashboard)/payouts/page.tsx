"use client";

import { useMemo, useState, type ComponentType } from "react";
import { toast } from "sonner";
import {
  DollarSign,
  TrendingUp,
  Building2,
  CircleAlert,
  Search,
  Eye,
  Clock,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { formatMoney } from "@/lib/currency";
import {
  MOCK_VENDOR_PAYOUT_REQUESTS,
  MOCK_VENDOR_PAYOUTS_SUMMARY,
  type PayoutRequestStatus,
  type VendorPayoutRequestRow,
} from "@/data/vendorPayoutsManagement";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CURRENCY = "GBP";

function StatusBadge({ status }: { status: PayoutRequestStatus }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Pending
      </span>
    );
  }
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
        <CircleCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Approved
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
      <CircleX className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Rejected
    </span>
  );
}

function SummaryCard({
  icon: Icon,
  iconClass,
  title,
  value,
  sub,
}: {
  icon: ComponentType<{ className?: string }>;
  iconClass: string;
  title: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-accent-20 bg-white p-5 shadow-sm">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-unageo text-sm font-medium text-accent-80">{title}</p>
      <p className="font-unbounded mt-1 text-2xl font-bold text-secondary-000">{value}</p>
      <p className="font-unageo mt-0.5 text-xs text-accent-60">{sub}</p>
    </div>
  );
}

export default function VendorPayoutsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PayoutRequestStatus>("all");

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return MOCK_VENDOR_PAYOUT_REQUESTS.filter((row) => {
      if (statusFilter !== "all" && row.status !== statusFilter) return false;
      if (!q) return true;
      const hay = [
        row.vendorName,
        row.payoutRef,
        row.contactName,
        row.bankName,
        row.accountNumber,
        row.id,
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [search, statusFilter]);

  const handleView = (row: VendorPayoutRequestRow) => {
    toast.info(`Payout ${row.payoutRef} — detail view can be wired when the API is ready.`);
  };

  const s = MOCK_VENDOR_PAYOUTS_SUMMARY;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-unbounded text-2xl font-bold text-secondary-000 md:text-3xl">
          Payouts Management
        </h1>
        <p className="font-unageo mt-1 text-base text-accent-80">
          Manage vendor payout requests and disbursements
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={DollarSign}
          iconClass="bg-primary-100/15 text-primary-100"
          title="Pending payouts"
          value={formatMoney(s.pendingAmount, CURRENCY)}
          sub={`${s.pendingCount} requests`}
        />
        <SummaryCard
          icon={TrendingUp}
          iconClass="bg-teal-100 text-teal-700"
          title="Approved this month"
          value={formatMoney(s.approvedThisMonthAmount, CURRENCY)}
          sub={`${s.approvedThisMonthCount} payouts`}
        />
        <SummaryCard
          icon={Building2}
          iconClass="bg-accent-10 text-secondary-000"
          title="Total vendors"
          value={String(s.activeVendorsCount)}
          sub="Active requests"
        />
        <SummaryCard
          icon={CircleAlert}
          iconClass="bg-red-100 text-red-700"
          title="Rejected requests"
          value={formatMoney(s.rejectedAmount, CURRENCY)}
          sub={`${s.rejectedCount} rejected`}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-60" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by vendor, ID, or bank…"
            className="font-unageo w-full rounded-2xl border border-accent-20 bg-white py-3 pl-11 pr-4 text-sm text-secondary-000 outline-none transition-colors placeholder:text-accent-60 focus:border-primary-100"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | PayoutRequestStatus)}
        >
          <SelectTrigger className="h-12 w-full rounded-2xl border-accent-20 bg-white sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-accent-20 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="font-unageo w-full min-w-[880px] text-left text-sm">
            <thead>
              <tr className="border-b border-accent-20 bg-secondary-800/80">
                <th className="px-5 py-4 font-semibold text-secondary-000">Vendor</th>
                <th className="px-5 py-4 font-semibold text-secondary-000">Amount</th>
                <th className="px-5 py-4 font-semibold text-secondary-000">Bank details</th>
                <th className="px-5 py-4 font-semibold text-secondary-000">Date requested</th>
                <th className="px-5 py-4 font-semibold text-secondary-000">Status</th>
                <th className="px-5 py-4 text-right font-semibold text-secondary-000">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-accent-80">
                    No payouts match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-accent-20 last:border-0 hover:bg-accent-10/40"
                  >
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-secondary-000">{row.vendorName}</p>
                      <p className="mt-0.5 text-xs text-accent-80">
                        {row.payoutRef} · {row.contactName}
                      </p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="font-unbounded font-bold text-secondary-000">
                        {formatMoney(row.amount, CURRENCY)}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <p className="font-semibold text-secondary-000">
                        {row.bankName}
                        {row.bankCountry ? (
                          <span className="font-normal text-accent-80"> · {row.bankCountry}</span>
                        ) : null}
                      </p>
                      <p className="mt-0.5 text-xs text-accent-80">{row.accountNumber}</p>
                    </td>
                    <td className="px-5 py-4 align-top text-accent-80">
                      <p>{row.requestedDate}</p>
                      <p className="text-xs">{row.requestedTime}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-accent-20 font-unageo font-semibold"
                        onClick={() => handleView(row)}
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
