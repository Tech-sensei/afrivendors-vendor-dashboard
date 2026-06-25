import type { CustomRequestApi } from "@/types/customRequestApi";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function extractCustomRequest(value: unknown): CustomRequestApi | null {
  const record = asRecord(value);
  if (!record) return null;
  if (typeof record.id === "number") {
    return record as unknown as CustomRequestApi;
  }
  const nested = record.customRequest;
  if (nested && typeof (nested as CustomRequestApi).id === "number") {
    return nested as CustomRequestApi;
  }
  return null;
}

function unwrapList(payload: unknown): CustomRequestApi[] {
  if (Array.isArray(payload)) return payload as CustomRequestApi[];
  const root = asRecord(payload);
  if (!root) return [];
  const data = root.data;
  if (Array.isArray(data)) return data as CustomRequestApi[];
  const nested = asRecord(data);
  if (nested && Array.isArray(nested.data)) {
    return nested.data as CustomRequestApi[];
  }
  if (Array.isArray(root.requests)) return root.requests as CustomRequestApi[];
  if (Array.isArray(root.customRequests)) {
    return root.customRequests as CustomRequestApi[];
  }
  const single = extractCustomRequest(root);
  if (single) return [single];
  return [];
}

export function unwrapCustomRequest(payload: unknown): CustomRequestApi | null {
  if (!payload || typeof payload !== "object") return null;

  const direct = extractCustomRequest(payload);
  if (direct) return direct;

  const root = payload as Record<string, unknown>;
  const data = root.data;
  if (data && typeof data === "object") {
    const fromData = extractCustomRequest(data);
    if (fromData) return fromData;
  }

  return null;
}

export function unwrapCustomRequestList(payload: unknown): CustomRequestApi[] {
  return unwrapList(payload);
}
