"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import {
  VENDOR_BILLING_INTERVALS,
  type VendorBillingIntervalId,
} from "@/data/subscriptionPlans";
import {
  buildSubscriptionView,
  createSubscriptionRecord,
  readStoredSubscription,
  writeStoredSubscription,
} from "@/lib/subscription";

export function useVendorSubscription() {
  const profile = useAppSelector((s) => s.auth.profile);
  const createdAt = profile?.vendor?.createdAt;

  const [stored, setStored] = useState<ReturnType<typeof readStoredSubscription>>(
    null
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStored(readStoredSubscription());
    setHydrated(true);
  }, []);

  const view = useMemo(
    () => buildSubscriptionView(createdAt, stored),
    [createdAt, stored]
  );

  const subscribe = useCallback((intervalId: VendorBillingIntervalId) => {
    const record = createSubscriptionRecord(intervalId);
    writeStoredSubscription(record);
    setStored(record);
    return record;
  }, []);

  const cancelAtPeriodEnd = useCallback(() => {
    if (!stored) return;
    const next = { ...stored, cancelAtPeriodEnd: true };
    writeStoredSubscription(next);
    setStored(next);
  }, [stored]);

  const clearSubscription = useCallback(() => {
    writeStoredSubscription(null);
    setStored(null);
  }, []);

  const selectedInterval = VENDOR_BILLING_INTERVALS.find(
    (i) => i.id === view.selectedIntervalId
  );

  return {
    hydrated,
    view,
    selectedInterval,
    subscribe,
    cancelAtPeriodEnd,
    clearSubscription,
    intervals: VENDOR_BILLING_INTERVALS,
  };
}
