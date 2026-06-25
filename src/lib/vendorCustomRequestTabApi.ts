import type { VendorCustomRequestTabId } from "@/types/vendorCustomRequests";
import type { CustomRequestApiStatus } from "@/types/customRequestApi";

export function vendorTabUsesPendingPool(tab: VendorCustomRequestTabId): boolean {
  return tab === "incoming" || tab === "all";
}

export function vendorTabToAssignedStatuses(
  tab: VendorCustomRequestTabId
): CustomRequestApiStatus[] | undefined {
  switch (tab) {
    case "incoming":
      return undefined;
    case "quoted":
      return ["pending"];
    case "active":
      return ["accepted"];
    case "completed":
      return ["completed"];
    case "passed":
      return ["rejected", "cancelled"];
    case "all":
      return undefined;
    default:
      return undefined;
  }
}
