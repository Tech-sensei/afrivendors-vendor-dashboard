export interface Transaction {
  id: string;
  type: 'payment' | 'withdrawal' | 'commission' | 'reversal';
  title: string;
  description: string;
  amount: string;
  date: string;
  time: string;
  status: 'success' | 'pending' | 'warning' | 'error';
  customerName?: string;
  serviceName?: string;
  receiptId?: string;
  commissionRate?: string;
}

export interface PayoutAccount {
  id: string;
  type: 'bank' | 'mobile_money';
  name: string;
  details: string;
  isDefault: boolean;
}

export const mockPayoutAccounts: PayoutAccount[] = [
  {
    id: 'payout-001',
    type: 'bank',
    name: 'Primary Business Account',
    details: '****7890 - First National Bank',
    isDefault: true
  },
  {
    id: 'payout-002',
    type: 'mobile_money',
    name: 'M-Pesa Mobile Money',
    details: '+254712345678',
    isDefault: false
  }
];

export const mockTransactions: Transaction[] = [
  // Today
  {
    id: 'txn-001',
    type: 'payment',
    title: 'Deep Tissue Massage',
    description: 'Payment from Amara Okon for 60-minute session',
    amount: '95.00',
    date: 'Nov 27, 2024',
    time: '2:45 PM',
    status: 'success',
    customerName: 'Amara Okon',
    serviceName: 'Deep Tissue Massage',
    receiptId: 'RCP-2024-001'
  },
  {
    id: 'txn-002',
    type: 'commission',
    title: 'Platform Commission',
    description: 'Afrivendor platform fee (12% of $95.00)',
    amount: '11.40',
    date: 'Nov 27, 2024',
    time: '2:45 PM',
    status: 'success',
    commissionRate: '12%',
    receiptId: 'RCP-2024-001'
  },
  {
    id: 'txn-003',
    type: 'payment',
    title: 'Gel Manicure with Nail Art',
    description: 'Payment from Zainab Ibrahim for nail art service',
    amount: '75.00',
    date: 'Nov 27, 2024',
    time: '11:30 AM',
    status: 'success',
    customerName: 'Zainab Ibrahim',
    serviceName: 'Gel Manicure with Nail Art',
    receiptId: 'RCP-2024-002'
  },
  {
    id: 'txn-004',
    type: 'commission',
    title: 'Platform Commission',
    description: 'Afrivendor platform fee (12% of $75.00)',
    amount: '9.00',
    date: 'Nov 27, 2024',
    time: '11:30 AM',
    status: 'success',
    commissionRate: '12%',
    receiptId: 'RCP-2024-002'
  },
  // Yesterday
  {
    id: 'txn-005',
    type: 'withdrawal',
    title: 'Withdrawal to Bank Account',
    description: 'Funds transferred to ****7890 - First National Bank',
    amount: '500.00',
    date: 'Nov 26, 2024',
    time: '4:20 PM',
    status: 'pending'
  },
  {
    id: 'txn-006',
    type: 'payment',
    title: 'Hydrating Facial Treatment',
    description: 'Payment from Thandiwe Mkhize for facial treatment',
    amount: '85.00',
    date: 'Nov 26, 2024',
    time: '3:15 PM',
    status: 'success',
    customerName: 'Thandiwe Mkhize',
    serviceName: 'Hydrating Facial Treatment',
    receiptId: 'RCP-2024-003'
  },
  {
    id: 'txn-007',
    type: 'commission',
    title: 'Platform Commission',
    description: 'Afrivendor platform fee (12% of $85.00)',
    amount: '10.20',
    date: 'Nov 26, 2024',
    time: '3:15 PM',
    status: 'success',
    commissionRate: '12%',
    receiptId: 'RCP-2024-003'
  },
  {
    id: 'txn-008',
    type: 'payment',
    title: 'Loc Maintenance & Styling',
    description: 'Payment from Kofi Mensah for loc grooming service',
    amount: '120.00',
    date: 'Nov 26, 2024',
    time: '10:00 AM',
    status: 'success',
    customerName: 'Kofi Mensah',
    serviceName: 'Loc Maintenance & Styling',
    receiptId: 'RCP-2024-004'
  },
  {
    id: 'txn-009',
    type: 'commission',
    title: 'Platform Commission',
    description: 'Afrivendor platform fee (12% of $120.00)',
    amount: '14.40',
    date: 'Nov 26, 2024',
    time: '10:00 AM',
    status: 'success',
    commissionRate: '12%',
    receiptId: 'RCP-2024-004'
  },
  // Last Week
  {
    id: 'txn-010',
    type: 'reversal',
    title: 'Payment Disputed',
    description: 'Chargeback initiated by customer - Under review',
    amount: '95.00',
    date: 'Nov 23, 2024',
    time: '1:30 PM',
    status: 'warning'
  },
  {
    id: 'txn-011',
    type: 'withdrawal',
    title: 'Withdrawal to Bank Account',
    description: 'Funds transferred to ****7890 - First National Bank',
    amount: '750.00',
    date: 'Nov 22, 2024',
    time: '9:45 AM',
    status: 'success'
  },
  {
    id: 'txn-012',
    type: 'payment',
    title: 'Swedish Relaxation Massage',
    description: 'Payment from Chioma Adeyemi for massage session',
    amount: '85.00',
    date: 'Nov 21, 2024',
    time: '4:30 PM',
    status: 'success',
    customerName: 'Chioma Adeyemi',
    serviceName: 'Swedish Relaxation Massage',
    receiptId: 'RCP-2024-005'
  },
  {
    id: 'txn-013',
    type: 'commission',
    title: 'Platform Commission',
    description: 'Afrivendor platform fee (12% of $85.00)',
    amount: '10.20',
    date: 'Nov 21, 2024',
    time: '4:30 PM',
    status: 'success',
    commissionRate: '12%',
    receiptId: 'RCP-2024-005'
  },
  {
    id: 'txn-014',
    type: 'payment',
    title: 'Hot Stone Massage',
    description: 'Payment from Fatima Hassan for hot stone massage',
    amount: '110.00',
    date: 'Nov 20, 2024',
    time: '2:00 PM',
    status: 'success',
    customerName: 'Fatima Hassan',
    serviceName: 'Hot Stone Massage',
    receiptId: 'RCP-2024-006'
  },
  {
    id: 'txn-015',
    type: 'commission',
    title: 'Platform Commission',
    description: 'Afrivendor platform fee (12% of $110.00)',
    amount: '13.20',
    date: 'Nov 20, 2024',
    time: '2:00 PM',
    status: 'success',
    commissionRate: '12%',
    receiptId: 'RCP-2024-006'
  }
];
