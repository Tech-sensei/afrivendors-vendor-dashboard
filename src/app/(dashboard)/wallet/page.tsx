"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import { Transaction } from "@/data/wallet";
import { formatMoney } from "@/lib/currency";
import {
  useTransactionsInfinite,
  useTransactionDetail,
  useWallet,
  useWalletPayout,
} from "@/services/useTransactions";
import {
  useStripeConnectAccountLink,
  useVendorPayoutAccounts,
} from "@/services/useVendorPayoutAccounts";

import { WalletHeader } from "@/components/wallet/WalletHeader";
import { BalanceCards } from "@/components/wallet/BalanceCards";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";

import { TransactionDetailsDrawer } from "@/components/wallet/drawers/TransactionDetailsDrawer";
import { WithdrawFundsDrawer } from "@/components/wallet/drawers/WithdrawFundsDrawer";

function isApiNumericTransactionId(id: string): boolean {
  return /^\d+$/.test(id);
}

export default function WalletPage() {
  const { data: walletData, isLoading: isWalletLoading } = useWallet();
  const { data: payoutAccounts = [] } = useVendorPayoutAccounts({
    enabled: false,
  });

  const stripeConnectMutation = useStripeConnectAccountLink();

  const payoutMutation = useWalletPayout();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useTransactionsInfinite();

  const apiTransactions = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  const transactions = useMemo(
    () => apiTransactions,
    [apiTransactions]
  );

  const walletCurrency =
    apiTransactions.find((t) => t.currency)?.currency ?? "GBP";

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);

  const [isTransactionDetailsOpen, setIsTransactionDetailsOpen] =
    useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const [dateFilter, setDateFilter] = useState<
    "all" | "today" | "yesterday" | "week" | "month" | "custom"
  >("all");
  const [customDateFrom, setCustomDateFrom] = useState("");
  const [customDateTo, setCustomDateTo] = useState("");
  const [showCustomDateInputs, setShowCustomDateInputs] = useState(false);

  const detailQueryId =
    isTransactionDetailsOpen &&
    selectedTransaction?.id &&
    isApiNumericTransactionId(selectedTransaction.id)
      ? selectedTransaction.id
      : null;

  const { data: detailTransaction } = useTransactionDetail(
    detailQueryId,
    Boolean(detailQueryId)
  );

  useEffect(() => {
    if (
      !detailTransaction ||
      !isTransactionDetailsOpen ||
      !detailQueryId ||
      detailTransaction.id !== detailQueryId
    ) {
      return;
    }
    setSelectedTransaction(detailTransaction);
  }, [
    detailTransaction,
    detailQueryId,
    isTransactionDetailsOpen,
  ]);

  const getFilteredTransactions = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    return transactions.filter((transaction) => {
      const txDate = transaction.createdAt
        ? new Date(transaction.createdAt)
        : new Date(transaction.date);

      switch (dateFilter) {
        case "today":
          return txDate >= today;
        case "yesterday":
          return txDate >= yesterday && txDate < today;
        case "week":
          return txDate >= weekAgo;
        case "month":
          return txDate >= monthAgo;
        case "custom":
          if (customDateFrom && customDateTo) {
            const fromDate = new Date(customDateFrom);
            const toDate = new Date(customDateTo);
            toDate.setHours(23, 59, 59, 999);
            return txDate >= fromDate && txDate <= toDate;
          }
          return true;
        case "all":
        default:
          return true;
      }
    });
  };

  const filteredTransactions = getFilteredTransactions();

  const availableBalance = walletData?.balance ?? 0;
  const lifetimeEarnings = walletData?.escrowBalance ?? 0;

  const handleViewTransaction = (id: string) => {
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      setSelectedTransaction(transaction);
      setIsTransactionDetailsOpen(true);
    }
  };

  const handleWithdraw = (_amount: string, _accountId: string) => {
    const parsed = parseFloat(_amount);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      toast.error("Invalid amount");
      return;
    }
    payoutMutation.mutate(parsed, {
      onSuccess: () => {
        setIsWithdrawOpen(false);
        toast.success(
          `Withdrawal of ${formatMoney(parsed, walletCurrency)} submitted.`
        );
      },
      onError: (err: unknown) => {
        let msg = "Withdrawal could not be completed. Please try again.";
        if (axios.isAxiosError(err)) {
          const d = err.response?.data as
            | { message?: string | string[]; responseMessage?: string }
            | undefined;
          const m = d?.message ?? d?.responseMessage;
          if (m) msg = Array.isArray(m) ? m.join(", ") : String(m);
          else if (err.message) msg = err.message;
        } else if (err instanceof Error) msg = err.message;
        toast.error(msg);
      },
    });
  };

  const handleStripeConnectPayout = () => {
    stripeConnectMutation.mutate(undefined, {
      onSuccess: (url) => {
        setIsWithdrawOpen(false);
        window.location.href = url;
      },
      onError: (err: unknown) => {
        let msg = "Could not open Stripe. Please try again.";
        if (axios.isAxiosError(err)) {
          const d = err.response?.data as
            | { message?: string; responseMessage?: string }
            | undefined;
          const m = d?.message ?? d?.responseMessage;
          if (m) msg = Array.isArray(m) ? m.join(", ") : String(m);
          else if (err.message) msg = err.message;
        } else if (err instanceof Error) msg = err.message;
        toast.error(msg);
      },
    });
  };

  return (
    <div className="">
      <WalletHeader />

      {isError && (
        <div className="mb-5 p-4 rounded-2xl bg-red-50 border border-red-100 font-unageo text-sm text-red-700">
          Could not load transactions. Check your connection or try again
          later.
          {error instanceof Error ? ` (${error.message})` : ""}
        </div>
      )}

      <BalanceCards
        availableBalance={availableBalance}
        lifetimeEarnings={lifetimeEarnings}
        currencyCode={walletData?.currency ?? walletCurrency}
        isLoading={isWalletLoading}
        onWithdraw={() => setIsWithdrawOpen(true)}
      />

      <TransactionHistory
        transactions={filteredTransactions}
        dateFilter={dateFilter}
        onDateFilterChange={(val) => {
          setDateFilter(val);
          if (val !== "custom") setShowCustomDateInputs(false);
        }}
        showCustomDateInputs={showCustomDateInputs}
        onCustomDateClick={() => {
          setDateFilter("custom");
          setShowCustomDateInputs(true);
        }}
        customDateFrom={customDateFrom}
        setCustomDateFrom={setCustomDateFrom}
        customDateTo={customDateTo}
        setCustomDateTo={setCustomDateTo}
        onApplyCustomRange={() => toast.success("Filter applied!")}
        onClearFilters={() => {
          setDateFilter("all");
          setShowCustomDateInputs(false);
          setCustomDateFrom("");
          setCustomDateTo("");
        }}
        onViewTransaction={handleViewTransaction}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        onLoadMore={() => fetchNextPage()}
      />

      <TransactionDetailsDrawer
        isOpen={isTransactionDetailsOpen}
        onClose={() => {
          setIsTransactionDetailsOpen(false);
          setSelectedTransaction(null);
        }}
        transaction={selectedTransaction}
      />

      <WithdrawFundsDrawer
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance.toFixed(2)}
        currencyCode={walletCurrency}
        payoutAccounts={payoutAccounts}
        onConfirm={handleWithdraw}
        isSubmitting={payoutMutation.isPending}
        isConnectingPayout={stripeConnectMutation.isPending}
        onAddPayoutAccount={handleStripeConnectPayout}
      />
    </div>
  );
}
