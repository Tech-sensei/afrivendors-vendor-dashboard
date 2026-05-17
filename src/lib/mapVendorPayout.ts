import { formatTransactionTypeLabel } from "@/lib/transactionMappers";
import type {
  VendorPayoutApiItem,
  VendorPayoutDetailApi,
} from "@/types/vendor-payouts";

export type VendorPayoutUiStatus = "pending" | "approved" | "rejected";

export interface VendorPayoutRow {
  id: string;
  payoutRef: string;
  amount: number;
  status: VendorPayoutUiStatus;
  statusLabel: string;
  transactionId: string | null;
  transactionRef: string | null;
  rejectionReason: string | null;
  requestedDate: string;
  requestedTime: string;
  createdAt: string;
}

export interface VendorPayoutDetail extends VendorPayoutRow {
  updatedAt: string;
  ledgerTypeLabel: string | null;
  ledgerDescription: string | null;
  ledgerStatus: string | null;
  ledgerCurrency: string | null;
}

function formatRequested(createdAt: string) {
  const created = new Date(createdAt);
  return {
    requestedDate: created.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
    requestedTime: created.toLocaleTimeString("en-GB", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

export function mapVendorPayoutStatus(
  status: string,
): { ui: VendorPayoutUiStatus; label: string } {
  const s = status.toLowerCase();
  if (
    s === "approved" ||
    s === "accepted" ||
    s === "completed" ||
    s === "success"
  ) {
    return { ui: "approved", label: "Approved" };
  }
  if (s === "rejected" || s === "failed" || s === "cancelled" || s === "canceled") {
    return { ui: "rejected", label: "Rejected" };
  }
  if (s === "processing") {
    return { ui: "pending", label: "Processing" };
  }
  if (s === "pending") {
    return { ui: "pending", label: "Pending" };
  }
  const label = s.charAt(0).toUpperCase() + s.slice(1);
  return { ui: "pending", label };
}

function mapBase(raw: VendorPayoutApiItem): VendorPayoutRow {
  const { ui, label } = mapVendorPayoutStatus(raw.status);
  const { requestedDate, requestedTime } = formatRequested(raw.createdAt);
  return {
    id: String(raw.id),
    payoutRef: `PO-${String(raw.id).padStart(3, "0")}`,
    amount: raw.amount,
    status: ui,
    statusLabel: label,
    transactionId: raw.transactionId,
    transactionRef: raw.transactionRef,
    rejectionReason: raw.rejectionReason,
    requestedDate,
    requestedTime,
    createdAt: raw.createdAt,
  };
}

export function mapVendorPayoutApiToRow(raw: VendorPayoutApiItem): VendorPayoutRow {
  return mapBase(raw);
}

export function mapVendorPayoutDetailToUi(
  raw: VendorPayoutDetailApi,
): VendorPayoutDetail {
  const base = mapBase(raw);
  const ledger = raw.ledgerTransaction;
  return {
    ...base,
    updatedAt: raw.updatedAt,
    ledgerTypeLabel: ledger?.type
      ? formatTransactionTypeLabel(ledger.type)
      : null,
    ledgerDescription: ledger?.description ?? null,
    ledgerStatus: ledger?.status ?? null,
    ledgerCurrency: ledger?.currency ?? null,
  };
}
