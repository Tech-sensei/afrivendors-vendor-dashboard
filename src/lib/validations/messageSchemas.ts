import { z } from "zod";

export const chatMessageSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Enter a message")
    .max(4000, "Message is too long"),
});

export const reminderFormSchema = z.object({
  date: z.string().trim().min(1, "Select a date"),
  time: z.string().trim().min(1, "Select a time"),
  note: z
    .string()
    .trim()
    .max(500, "Note is too long")
    .optional()
    .or(z.literal("")),
});

export const calendarSyncFormSchema = z.object({
  date: z.string().trim().min(1, "Select a date"),
  time: z.string().trim().min(1, "Select a time"),
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title is too long"),
  note: z
    .string()
    .trim()
    .max(500, "Note is too long")
    .optional()
    .or(z.literal("")),
});
