import * as z from "zod";

export const carFormSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(1, "Year is required"),
  price: z.string().min(1, "Price is required"),
  mileage: z.string().min(1, "Mileage is required"),
  fuelType: z.string().min(1, "Fuel type is required"),
  bodyType: z.string().min(1, "Body type is required"),
  color: z.string().min(1, "Color is required"),
  features: z.string().min(1, "Features are required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export type CarFormValues = z.infer<typeof carFormSchema>;