import type {
  VendorCustomRequest,
  VendorCustomRequestTabId,
  VendorRequestStatus,
} from "@/types/vendorCustomRequests";

const INCOMING: VendorRequestStatus[] = ["incoming"];
const QUOTED: VendorRequestStatus[] = ["quoted"];
const ACTIVE: VendorRequestStatus[] = ["active"];
const COMPLETED: VendorRequestStatus[] = ["completed", "closed"];
const PASSED: VendorRequestStatus[] = ["lost", "passed"];

export const VENDOR_CUSTOM_REQUEST_TABS: {
  id: VendorCustomRequestTabId;
  label: string;
}[] = [
  { id: "all", label: "All" },
  { id: "incoming", label: "New requests" },
  { id: "quoted", label: "Awaiting client" },
  { id: "active", label: "Active jobs" },
  { id: "completed", label: "Completed" },
  { id: "passed", label: "Passed / lost" },
];

export function filterVendorRequestsByTab(
  requests: VendorCustomRequest[],
  tab: VendorCustomRequestTabId
): VendorCustomRequest[] {
  if (tab === "all") return requests;
  const map: Record<
    Exclude<VendorCustomRequestTabId, "all">,
    VendorRequestStatus[]
  > = {
    incoming: INCOMING,
    quoted: QUOTED,
    active: ACTIVE,
    completed: COMPLETED,
    passed: PASSED,
  };
  const statuses = map[tab];
  return requests.filter((r) => statuses.includes(r.status));
}

export function countVendorRequestsByTab(
  requests: VendorCustomRequest[],
  tab: VendorCustomRequestTabId
): number {
  return filterVendorRequestsByTab(requests, tab).length;
}
