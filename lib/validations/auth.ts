import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(9, "Please enter a valid phone number (e.g. 0911234567 or +251911234567)")
    .max(15, "Phone number is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Za-z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  role: z.enum(["CUSTOMER", "COLLECTOR", "PARTNER", "ADMIN"]).default("CUSTOMER"),
  accountType: z.enum(["HOUSEHOLD", "BUSINESS"]).default("HOUSEHOLD"),
  fullName: z.string().min(2, "Full name must be at least 2 characters").optional(),
  companyName: z.string().min(2, "Company name must be at least 2 characters").optional(),
  tinNumber: z.string().optional(),
  subCity: z.string().min(1, "Please select an Addis Ababa sub-city"),
  woreda: z.string().min(1, "Please specify a woreda"),
  specificArea: z.string().min(2, "Please specify your neighborhood or landmark"),
});

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
