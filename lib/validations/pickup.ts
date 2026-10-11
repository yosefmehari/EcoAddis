import { z } from "zod";

export const pickupRequestSchema = z.object({
  subCity: z.string().min(1, "Sub-city is required"),
  woreda: z.string().min(1, "Woreda is required"),
  specificArea: z.string().min(2, "Neighborhood/landmark is required"),
  contactPhone: z.string().min(9, "Valid contact phone is required"),
  scheduledDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Valid pickup date is required",
  }),
  timeSlot: z.enum(["MORNING_8_12", "AFTERNOON_1_5"]),
  serviceType: z
    .enum(["ONE_TIME", "RECURRING_WEEKLY", "RECURRING_BIWEEKLY", "RECURRING_MONTHLY"])
    .default("ONE_TIME"),
  items: z
    .array(
      z.object({
        categorySlug: z.string().min(1, "Category is required"),
        weightKg: z.number().min(0.5, "Minimum 0.5 kg required"),
        notes: z.string().optional(),
      })
    )
    .min(1, "At least one waste category must be selected"),
  customerNotes: z.string().max(500, "Notes cannot exceed 500 characters").optional(),
});

export const updatePickupStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "ASSIGNED",
    "IN_PROGRESS",
    "COMPLETED",
    "CANCELLED",
    "FAILED",
  ]),
  notes: z.string().optional(),
  failureReason: z.string().optional(),
  collectedWeightKg: z.number().optional(),
  collectorId: z.string().optional(),
});

export type PickupRequestInput = z.infer<typeof pickupRequestSchema>;
export type UpdatePickupStatusInput = z.infer<typeof updatePickupStatusSchema>;
