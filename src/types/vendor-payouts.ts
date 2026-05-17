/** GET /wallet/payouts — query `status` filter (Swagger) */

export type VendorPayoutListStatusParam =
  | "pending"
  | "processing"
  | "accepted"
  | "completed"
  | "rejected"
  | "failed";

export type VendorPayoutApiStatus = string;

export type VendorPayoutLedgerTransaction = {
  id: number;
  amount: number;
  currency: string;
  status: string;
  type: string;
  commissionAmount: number;
  referenceId: string;
  referenceType: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type VendorPayoutApiItem = {
  id: number;
  amount: number;
  status: VendorPayoutApiStatus;
  transactionId: string | null;
  transactionRef: string | null;
  rejectionReason: string | null;
  transactionDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type VendorPayoutDetailApi = VendorPayoutApiItem & {
  ledgerTransaction?: VendorPayoutLedgerTransaction | null;
};

export type VendorPayoutsListMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type VendorPayoutsListResponse = {
  data: VendorPayoutApiItem[];
  meta: VendorPayoutsListMeta;
};

/** GET /wallet/payouts/breakdown */
export type VendorPayoutsBreakdownApi = {
  totalPayoutRequests: number;
  pendingPayouts: number;
  rejectedPayouts: number;
  acceptedPayouts: number;
};

export type VendorPayoutsBreakdown = VendorPayoutsBreakdownApi;
