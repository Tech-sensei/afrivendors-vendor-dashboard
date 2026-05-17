import { z } from "zod";
import { ticketCategories } from "@/data/help-support";

const ticketCategoryValues = ticketCategories as [
  string,
  ...string[],
];

export const ticketPrioritySchema = z.enum([
  "low",
  "medium",
  "high",
  "urgent",
]);

export const createSupportTicketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Subject is required")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
  priority: ticketPrioritySchema,
  category: z.enum(ticketCategoryValues, {
    error: "Select a valid category",
  }),
});

export type CreateSupportTicketFormValues = z.infer<
  typeof createSupportTicketSchema
>;

export const supportTicketReplySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Reply cannot be empty")
    .max(5000, "Reply is too long"),
});

export const liveChatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Enter a message")
    .max(4000, "Message is too long"),
});
