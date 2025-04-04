import { z } from "zod";

const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().positive("Price must be positive"),
  categoryId: z.string().uuid("Invalid category ID"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  features: z.array(z.string()).optional(),
  specifications: z.record(z.string()).optional(),
  images: z.array(z.string()).optional(),
});

const updateProductSchema = createProductSchema.partial();

export { createProductSchema, updateProductSchema };
