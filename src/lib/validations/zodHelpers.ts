import { z } from "zod";

export function firstZodIssueMessage(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Validation failed";
}

/** Map Zod field errors to a flat `field -> message` record for form UI. */
export function zodFieldErrors<T extends string>(
  error: z.ZodError
): Partial<Record<T, string>> {
  const flat = z.flattenError(error).fieldErrors as Record<
    string,
    string[] | undefined
  >;
  const out: Partial<Record<T, string>> = {};
  for (const [key, messages] of Object.entries(flat)) {
    const msg = messages?.[0];
    if (msg) out[key as T] = msg;
  }
  return out;
}
