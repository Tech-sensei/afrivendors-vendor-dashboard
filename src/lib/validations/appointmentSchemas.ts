import { z } from "zod";

export const rescheduleAppointmentSchema = z.object({
  date: z.string().trim().min(1, "Select a new date"),
  time: z.string().trim().min(1, "Select a new time"),
  notes: z
    .string()
    .trim()
    .max(1000, "Note is too long")
    .optional()
    .or(z.literal("")),
});

export type RescheduleAppointmentFormValues = z.infer<
  typeof rescheduleAppointmentSchema
>;
