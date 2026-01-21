"use client";

import { useState } from "react";
import { toast } from "sonner";

// Data & Types
import { 
  Transaction, 
  PayoutAccount, 
  mockTransactions, 
  mockPayoutAccounts 
} from "@/data/wallet";

// Components
import { WalletHeader } from "@/components/wallet/WalletHeader";
import { BalanceCards } from "@/components/wallet/BalanceCards";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";

import { PayoutAccountsDrawer } from "@/components/wallet/drawers/PayoutAccountsDrawer";
import { AddEditPayoutDrawer } from "@/components/wallet/drawers/AddEditPayoutDrawer";
import { TransactionDetailsDrawer } from "@/components/wallet/drawers/TransactionDetailsDrawer";
import { WithdrawFundsDrawer } from "@/components/wallet/drawers/WithdrawFundsDrawer";

export default function WalletPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>(mockPayoutAccounts);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedPayoutAccount, setSelectedPayoutAccount] = useState<PayoutAccount | null>(null);
  
  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isPayoutAccountsOpen, setIsPayoutAccountsOpen] = useState(false);
  const [isAddEditPayoutOpen, setIsAddEditPayoutOpen] = useState(false);

  // Date filter state
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'yesterday' | 'week' | 'month' | 'custom'>('all');
  const [customDateFrom, setCustomDateFrom] = useState('');
  const [customDateTo, setCustomDateTo] = useState('');
  const [showCustomDateInputs, setShowCustomDateInputs] = useState(false);

  // Filter logic
  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    return transactions.filter(transaction => {
      const txDate = new Date(transaction.date);
      
      switch (dateFilter) {
        case 'today':
          return txDate >= today;
        case 'yesterday':
          return txDate >= yesterday && txDate < today;
        case 'week':
          return txDate >= weekAgo;
        case 'month':
          return txDate >= monthAgo;
        case 'custom':
          if (customDateFrom && customDateTo) {
            const fromDate = new Date(customDateFrom);
            const toDate = new Date(customDateTo);
            toDate.setHours(23, 59, 59, 999);
            return txDate >= fromDate && txDate <= toDate;
          }
          return true;
        case 'all':
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Balance calculations
  const calculateTotalEarnings = () => 
    transactions
      .filter(t => t.type === 'payment' && t.status === 'success')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const calculateTotalCommissions = () => 
    transactions
      .filter(t => t.type === 'commission' && t.status === 'success')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const calculateTotalWithdrawals = () => 
    transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'success')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const availableBalance = (calculateTotalEarnings() - calculateTotalCommissions() - calculateTotalWithdrawals()) + 654;
  const lifetimeEarnings = calculateTotalEarnings();

  // Handlers
  const handleViewTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setSelectedTransaction(transaction);
      setIsTransactionDetailsOpen(true);
    }
  };

  const handleWithdraw = (amount: string, accountId: string) => {
    const account = payoutAccounts.find(a => a.id === accountId);
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      type: 'withdrawal',
      title: 'Withdrawal Initialized',
      description: `Funds transferred to ${account?.name} (${account?.details})`,
      amount: amount,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      status: 'pending'
    };
    setTransactions(prev => [newTransaction, ...prev]);
    setIsWithdrawOpen(false);
    toast.success(`Withdrawal of $${amount} initiated!`);
  };

  const handleSavePayoutAccount = (accountData: Partial<PayoutAccount>) => {
    if (selectedPayoutAccount) {
      setPayoutAccounts(prev =>
        prev.map(a => {
          if (a.id === selectedPayoutAccount.id) return { ...a, ...accountData };
          if (accountData.isDefault) return { ...a, isDefault: false };
          return a;
        })
      );
      toast.success("Account updated successfully!");
    } else {
      const newAccount: PayoutAccount = {
        id: `payout-${Date.now()}`,
        ...accountData
      } as PayoutAccount;
      if (newAccount.isDefault) {
        setPayoutAccounts(prev => [newAccount, ...prev.map(a => ({ ...a, isDefault: false }))]);
      } else {
        setPayoutAccounts(prev => [newAccount, ...prev]);
      }
      toast.success("Account added successfully!");
    }
    setIsAddEditPayoutOpen(false);
  };

  return (
    <div className="">
      {/* <WalletHeader /> */}
      
      <BalanceCards 
        availableBalance={availableBalance}
        lifetimeEarnings={lifetimeEarnings}
        totalCommissions={calculateTotalCommissions()}
        totalWithdrawals={calculateTotalWithdrawals()}
        onWithdraw={() => setIsWithdrawOpen(true)}
        onViewPayouts={() => setIsPayoutAccountsOpen(true)}
      />

      <TransactionHistory 
        transactions={filteredTransactions}
        dateFilter={dateFilter}
        onDateFilterChange={(val) => {
          setDateFilter(val);
          if (val !== 'custom') setShowCustomDateInputs(false);
        }}
        showCustomDateInputs={showCustomDateInputs}
        onCustomDateClick={() => {
          setDateFilter('custom');
          setShowCustomDateInputs(true);
        }}
        customDateFrom={customDateFrom}
        setCustomDateFrom={setCustomDateFrom}
        customDateTo={customDateTo}
        setCustomDateTo={setCustomDateTo}
        onApplyCustomRange={() => toast.success("Filter applied!")}
        onClearFilters={() => {
          setDateFilter('all');
          setShowCustomDateInputs(false);
          setCustomDateFrom('');
          setCustomDateTo('');
        }}
        onViewTransaction={handleViewTransaction}
      />

      {/* Drawers */}
      <TransactionDetailsDrawer
        isOpen={isTransactionDetailsOpen}
        onClose={() => setIsTransactionDetailsOpen(false)}
        transaction={selectedTransaction}
      />

      <WithdrawFundsDrawer
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance.toFixed(2)}
        payoutAccounts={payoutAccounts}
        onConfirm={handleWithdraw}
        onAddPayoutAccount={() => {
          setIsWithdrawOpen(false);
          setIsAddEditPayoutOpen(true);
        }}
      />

      <PayoutAccountsDrawer
        isOpen={isPayoutAccountsOpen}
        onClose={() => setIsPayoutAccountsOpen(false)}
        accounts={payoutAccounts}
        onAddAccount={() => {
          setSelectedPayoutAccount(null);
          setIsAddEditPayoutOpen(true);
        }}
      />

      <AddEditPayoutDrawer
        isOpen={isAddEditPayoutOpen}
        onClose={() => setIsAddEditPayoutOpen(false)}
        onSave={handleSavePayoutAccount}
      />
    </div>
  );
}