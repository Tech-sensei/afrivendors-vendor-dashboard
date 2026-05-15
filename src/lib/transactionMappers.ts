import type { TransactionApiItem } from "@/types/transactions";
import type { Transaction } from "@/data/wallet";
import { formatMoney } from "@/lib/currency";

function mapApiStatus(status: string): Transaction["status"] {
  const s = status.toLowerCase();
  if (s === "completed" || s === "success") return "success";
  if (s === "pending" || s === "processing") return "pending";
  if (s === "failed" || s === "cancelled" || s === "canceled") return "error";
  if (s === "disputed" || s === "review") return "warning";
  return "pending";
}

function mapApiType(type: string): Transaction["type"] {
  const t = type.toLowerCase();
  if (t === "appointment_payment" || t === "payment") return "payment";
  if (t === "withdrawal") return "withdrawal";
  if (
    t === "commission" ||
    t === "commission_earned" ||
    t === "platform_fee"
  )
    return "commission";
  if (t === "reversal" || t === "refund" || t === "chargeback") return "reversal";
  return "payment";
}

function resolveNetToVendor(raw: TransactionApiItem): number {
  const n = raw.netToVendorAmount;
  if (n != null && Number.isFinite(n)) return n;
  const gross = raw.amount ?? 0;
  const comm = raw.commissionAmount ?? 0;
  return gross - comm;
}

export function mapTransactionApiToUi(raw: TransactionApiItem): Transaction {
  const created = new Date(raw.createdAt);
  const dateStr = created.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = created.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const uiType = mapApiType(raw.type);
  const serviceName =
    raw.appointment?.services?.[0]?.serviceName ?? raw.description;
  const customerName =
    raw.appointment?.customerName ??
    (raw.user
      ? `${raw.user.firstName} ${raw.user.lastName}`.trim()
      : undefined);

  const gross = raw.amount;
  const commission = raw.commissionAmount ?? 0;
  const net = resolveNetToVendor(raw);

  const amountNumericStr = net.toFixed(2);
  const amountDisplay =
    uiType === "payment"
      ? formatMoney(net, raw.currency)
      : formatMoney(gross, raw.currency);

  const commissionPct =
    gross > 0 ? `${((commission / gross) * 100).toFixed(1)}%` : undefined;

  const apiAmounts =
    uiType === "payment"
      ? { gross, commission, net }
      : undefined;

  const description =
    customerName && !raw.description.includes(customerName)
      ? `${raw.description} · ${customerName}`
      : raw.description;

  return {
    id: String(raw.id),
    type: uiType,
    title: serviceName || raw.description || "Transaction",
    description,
    amount: amountNumericStr,
    amountDisplay,
    date: dateStr,
    time: timeStr,
    status: mapApiStatus(raw.status),
    customerName,
    serviceName: raw.appointment?.services?.[0]?.serviceName,
    receiptId: raw.referenceType
      ? `${raw.referenceType}-${raw.referenceId}`
      : undefined,
    commissionRate: commissionPct,
    createdAt: raw.createdAt,
    currency: raw.currency,
    grossAmount: formatMoney(gross, raw.currency),
    netToVendorAmount: formatMoney(net, raw.currency),
    commissionAmount: formatMoney(commission, raw.currency),
    referenceId: raw.referenceId,
    referenceType: raw.referenceType,
    appointmentDate: raw.appointment?.date,
    appointmentTime: raw.appointment?.time,
    paymentMethod: raw.appointment?.paymentMethod,
    apiAmounts,
  };
}
