"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  DollarSign,
  TrendingUp,
  CircleAlert,
  Search,
  Eye,
  Clock,
  CircleCheck,
  CircleX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { formatMoney } from "@/lib/currency";
import type { VendorPayoutUiStatus } from "@/lib/mapVendorPayout";
import {
  useVendorPayoutDetail,
  useVendorPayoutsBreakdown,
  useVendorPayoutsList,
  type VendorPayoutListStatusParam,
  type VendorPayoutRow,
} from "@/services/useVendorPayouts";
import { VendorPayoutDetailDrawer } from "@/components/payouts/VendorPayoutDetailDrawer";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CURRENCY = "GBP";
const ITEMS_PER_PAGE = 10;

const STATUS_FILTER_OPTIONS: { value: "" | VendorPayoutListStatusParam; label: string }[] =
  [
    { value: "", label: "All statuses" },
    { value: "pending", label: "Pending" },
    { value: "processing", label: "Processing" },
    { value: "accepted", label: "Accepted" },
    { value: "completed", label: "Completed" },
    { value: "rejected", label: "Rejected" },
    { value: "failed", label: "Failed" },
  ];

function StatusBadge({ status, label }: { status: VendorPayoutUiStatus; label: string }) {
  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
        <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {label}
      </span>
    );
  }
  if (status === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
        <CircleCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {label}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-800">
      <CircleX className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {label}
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
  const [statusFilter, setStatusFilter] = useState<"" | VendorPayoutListStatusParam>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, search]);

  const apiStatus = statusFilter === "" ? undefined : statusFilter;

  const {
    data: breakdown,
    isLoading: breakdownLoading,
    isError: breakdownError,
  } = useVendorPayoutsBreakdown();

  const { data, isLoading, isError, error } = useVendorPayoutsList({
    page: currentPage,
    limit: ITEMS_PER_PAGE,
    status: apiStatus,
  });

  const { data: payoutDetail, isLoading: detailLoading } = useVendorPayoutDetail(
    drawerOpen ? selectedId : null,
  );

  const payouts = data?.payouts ?? [];
  const meta = data?.meta;
  const totalPages = Math.max(1, meta?.totalPages ?? 1);
  const total = meta?.total ?? 0;

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return payouts;
    return payouts.filter((row) => {
      const hay = [
        row.payoutRef,
        row.id,
        row.transactionId,
        row.transactionRef,
        row.rejectionReason,
        row.statusLabel,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [payouts, search]);

  const openDetail = (row: VendorPayoutRow) => {
    setSelectedId(row.id);
    setDrawerOpen(true);
  };

  const closeDetail = () => {
    setDrawerOpen(false);
    setSelectedId(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-unbounded text-2xl font-bold text-secondary-000 md:text-3xl">
          Payout history
        </h1>
        <p className="font-unageo mt-1 text-base text-accent-80">
          Track your withdrawal requests and their status
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={DollarSign}
          iconClass="bg-primary-100/15 text-primary-100"
          title="Total requests"
          value={
            breakdownLoading ? "…" : String(breakdown?.totalPayoutRequests ?? 0)
          }
          sub="All payout requests"
        />
        <SummaryCard
          icon={Clock}
          iconClass="bg-amber-100 text-amber-800"
          title="Pending"
          value={breakdownLoading ? "…" : String(breakdown?.pendingPayouts ?? 0)}
          sub="Awaiting review"
        />
        <SummaryCard
          icon={TrendingUp}
          iconClass="bg-teal-100 text-teal-700"
          title="Accepted"
          value={breakdownLoading ? "…" : String(breakdown?.acceptedPayouts ?? 0)}
          sub="Approved payouts"
        />
        <SummaryCard
          icon={CircleAlert}
          iconClass="bg-red-100 text-red-700"
          title="Rejected"
          value={breakdownLoading ? "…" : String(breakdown?.rejectedPayouts ?? 0)}
          sub="Declined payouts"
        />
      </div>
      {breakdownError ? (
        <p className="font-unageo text-xs text-amber-700">
          Summary totals could not be loaded; the list below still reflects your filters.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-60" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by payout ID or transaction…"
            className="font-unageo w-full rounded-2xl border border-accent-20 bg-white py-3 pl-11 pr-4 text-sm text-secondary-000 outline-none transition-colors placeholder:text-accent-60 focus:border-primary-100"
          />
        </div>
        <Select
          value={statusFilter === "" ? "all" : statusFilter}
          onValueChange={(v) =>
            setStatusFilter(v === "all" ? "" : (v as VendorPayoutListStatusParam))
          }
        >
          <SelectTrigger className="h-12 w-full rounded-2xl border-accent-20 bg-white sm:w-[200px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTER_OPTIONS.map((opt) => (
              <SelectItem key={opt.value || "all"} value={opt.value === "" ? "all" : opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isError ? (
        <p className="font-unageo rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error instanceof Error ? error.message : "Could not load payouts."}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-accent-20 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="font-unageo w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-accent-20 bg-secondary-800/80">
                <th className="px-5 py-4 font-semibold text-secondary-000">Payout</th>
                <th className="px-5 py-4 font-semibold text-secondary-000">Amount</th>
                <th className="px-5 py-4 font-semibold text-secondary-000">Transaction</th>
                <th className="px-5 py-4 font-semibold text-secondary-000">Date requested</th>
                <th className="px-5 py-4 font-semibold text-secondary-000">Status</th>
                <th className="px-5 py-4 text-right font-semibold text-secondary-000">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-accent-80">
                    Loading payouts…
                  </td>
                </tr>
              ) : filteredRows.length === 0 ? (
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
                      <p className="font-semibold text-secondary-000">{row.payoutRef}</p>
                      <p className="mt-0.5 text-xs text-accent-80">ID {row.id}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="font-unbounded font-bold text-secondary-000">
                        {formatMoney(row.amount, CURRENCY)}
                      </span>
                    </td>
                    <td className="px-5 py-4 align-top text-accent-80">
                      {row.transactionId ? `#${row.transactionId}` : "—"}
                    </td>
                    <td className="px-5 py-4 align-top text-accent-80">
                      <p>{row.requestedDate}</p>
                      <p className="text-xs">{row.requestedTime}</p>
                    </td>
                    <td className="px-5 py-4 align-top">
                      <StatusBadge status={row.status} label={row.statusLabel} />
                    </td>
                    <td className="px-5 py-4 text-right align-top">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-xl border-accent-20 font-unageo font-semibold"
                        onClick={() => openDetail(row)}
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

        {total > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-accent-20 px-5 py-4">
            <p className="font-unageo text-sm text-accent-80">
              Page {currentPage} of {totalPages} · {total} total
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || isLoading}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-xl"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages || isLoading}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="rounded-xl"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <VendorPayoutDetailDrawer
        isOpen={drawerOpen}
        onClose={closeDetail}
        payout={payoutDetail ?? null}
        isLoading={detailLoading}
      />
    </div>
  );
}
