export type PayoutRequestStatus = "pending" | "approved" | "rejected";

export interface VendorPayoutRequestRow {
  id: string;
  vendorName: string;
  payoutRef: string;
  contactName: string;
  amount: number;
  bankName: string;
  bankCountry: string;
  accountNumber: string;
  requestedDate: string;
  requestedTime: string;
  status: PayoutRequestStatus;
}

export interface VendorPayoutsSummary {
  pendingAmount: number;
  pendingCount: number;
  approvedThisMonthAmount: number;
  approvedThisMonthCount: number;
  activeVendorsCount: number;
  rejectedAmount: number;
  rejectedCount: number;
}

export const MOCK_VENDOR_PAYOUTS_SUMMARY: VendorPayoutsSummary = {
  pendingAmount: 32110,
  pendingCount: 11,
  approvedThisMonthAmount: 32150,
  approvedThisMonthCount: 7,
  activeVendorsCount: 20,
  rejectedAmount: 5480,
  rejectedCount: 2,
};

export const MOCK_VENDOR_PAYOUT_REQUESTS: VendorPayoutRequestRow[] = [
  {
    id: "1",
    vendorName: "Ubuntu Beauty Lounge",
    payoutRef: "PO-001",
    contactName: "Amara Johnson",
    amount: 2840,
    bankName: "GTBank Nigeria",
    bankCountry: "Nigeria",
    accountNumber: "0123456789",
    requestedDate: "2026-05-02",
    requestedTime: "10:30 AM",
    status: "pending",
  },
  {
    id: "2",
    vendorName: "Spa & Wellness Collective",
    payoutRef: "PO-002",
    contactName: "David Okafor",
    amount: 5120,
    bankName: "Barclays UK",
    bankCountry: "United Kingdom",
    accountNumber: "20-45-67 • ****8891",
    requestedDate: "2026-05-01",
    requestedTime: "2:15 PM",
    status: "approved",
  },
  {
    id: "3",
    vendorName: "Afrivendor Spa & Wellness",
    payoutRef: "PO-003",
    contactName: "Lisa Rice",
    amount: 1890,
    bankName: "STRIPE TEST BANK",
    bankCountry: "United Kingdom",
    accountNumber: "****2345",
    requestedDate: "2026-04-28",
    requestedTime: "9:00 AM",
    status: "pending",
  },
  {
    id: "4",
    vendorName: "Northern Catering Co.",
    payoutRef: "PO-004",
    contactName: "Chioma Adeyemi",
    amount: 960,
    bankName: "Access Bank",
    bankCountry: "Nigeria",
    accountNumber: "0099887766",
    requestedDate: "2026-04-22",
    requestedTime: "4:45 PM",
    status: "rejected",
  },
  {
    id: "5",
    vendorName: "Lagos Hair Studio",
    payoutRef: "PO-005",
    contactName: "Funke Bello",
    amount: 4200,
    bankName: "Monzo",
    bankCountry: "United Kingdom",
    accountNumber: "04-00-04 • ****1122",
    requestedDate: "2026-04-18",
    requestedTime: "11:20 AM",
    status: "approved",
  },
];
