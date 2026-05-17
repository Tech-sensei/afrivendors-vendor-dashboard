import { z } from "zod";

export function createWithdrawFundsSchema(
  availableBalance: number,
  requirePayoutAccount: boolean
) {
  return z
    .object({
      amount: z
        .string()
        .trim()
        .min(1, "Enter an amount to withdraw")
        .refine((val) => {
          const n = Number(val);
          return Number.isFinite(n) && n > 0;
        }, "Enter a valid amount greater than 0")
        .refine((val) => {
          const n = Number(val);
          return n <= availableBalance;
        }, `Amount cannot exceed available balance`),
      payoutAccountId: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (requirePayoutAccount && !data.payoutAccountId?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Select a payout account",
          path: ["payoutAccountId"],
        });
      }
    });
}

export type WithdrawFundsFormValues = z.infer<
  ReturnType<typeof createWithdrawFundsSchema>
>;
