import * as z from "zod";

export const tradeInFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Must be a valid year"),
  mileage: z.string().min(1, "Mileage is required"),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  estimatedValue: z.string().min(1, "Estimated value is required"),
  location: z.string().min(1, "Location is required"),
  registeredOwner: z.string().min(1, "Registered owner name is required"),
  contactNumber: z.string().min(1, "Contact number is required"),
  preferredVisitTime: z.string().min(1, "Preferred visit time is required"),
  description: z.string().optional(),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export type TradeInFormValues = z.infer<typeof tradeInFormSchema>;