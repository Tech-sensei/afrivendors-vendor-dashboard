import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import http from "@/lib/http";
import type { TransactionApiItem } from "@/types/transactions";
import type { Transaction } from "@/data/wallet";
import { mapTransactionApiToUi } from "@/lib/transactionMappers";

export interface WalletInfo {
  id: number;
  balance: number;
  currency: string;
  escrowBalance: number;
  createdAt: string;
  updatedAt: string;
}

export const WALLET_QUERY_KEY = ["vendor", "wallet"] as const;

export function useWallet() {
  return useQuery<WalletInfo>({
    queryKey: WALLET_QUERY_KEY,
    queryFn: async () => {
      const { data } = await http.get("/wallet/me");
      return (data as { data?: WalletInfo })?.data ?? (data as WalletInfo);
    },
  });
}

/** POST `/wallet/payout` — `amount` in major currency units (e.g. 10.2 for £10.20). */
export function useWalletPayout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (amount: number) => {
      const { data } = await http.post<unknown>("/wallet/payout", { amount });
      return data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: WALLET_QUERY_KEY });
      void queryClient.invalidateQueries({ queryKey: VENDOR_TRANSACTIONS_QUERY_KEY });
    },
  });
}

const DEFAULT_LIMIT = 20;

export type TransactionsPage = {
  items: Transaction[];
  total: number;
  page: number;
  limit: number;
};

export const VENDOR_TRANSACTIONS_QUERY_KEY = ["vendor", "transactions"] as const;

export function useTransactionsInfinite(limit = DEFAULT_LIMIT) {
  return useInfiniteQuery({
    queryKey: [...VENDOR_TRANSACTIONS_QUERY_KEY, limit],
    initialPageParam: 1,
    queryFn: async ({ pageParam }): Promise<TransactionsPage> => {
      const { data } = await http.get("/transactions", {
        params: { page: pageParam, limit },
      });
      const payload = (data as { data?: unknown })?.data ?? data;
      const p = payload as Record<string, unknown>;
      const rawItems = Array.isArray(p.items) ? (p.items as TransactionApiItem[]) : [];
      return {
        items: rawItems.map(mapTransactionApiToUi),
        total: Number(p.total ?? 0),
        page: Number(p.page ?? pageParam),
        limit: Number(p.limit ?? limit),
      };
    },
    getNextPageParam: (lastPage) => {
      const loaded = lastPage.page * lastPage.limit;
      return loaded < lastPage.total ? lastPage.page + 1 : undefined;
    },
  });
}

export function useTransactionDetail(id: string | null, enabled: boolean) {
  return useQuery({
    queryKey: [...VENDOR_TRANSACTIONS_QUERY_KEY, "detail", id],
    queryFn: async (): Promise<Transaction> => {
      const { data } = await http.get(`/transactions/${id}`);
      const payload = (data as { data?: unknown })?.data ?? data;
      return mapTransactionApiToUi(payload as TransactionApiItem);
    },
    enabled: Boolean(id) && enabled,
  });
}
