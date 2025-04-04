import { z } from "zod";

const createOrderSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid("Invalid product ID"),
        quantity: z.number().int().positive("Quantity must be positive"),
      })
    )
    .min(1, "Order must contain at least one item"),
  shippingAddress: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    zipCode: z.string().min(3, "ZIP code must be at least 3 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
    phone: z.string().min(5, "Phone must be at least 5 characters"),
  }),
  billingAddress: z
    .object({
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      lastName: z.string().min(2, "Last name must be at least 2 characters"),
      address: z.string().min(5, "Address must be at least 5 characters"),
      city: z.string().min(2, "City must be at least 2 characters"),
      state: z.string().min(2, "State must be at least 2 characters"),
      zipCode: z.string().min(3, "ZIP code must be at least 3 characters"),
      country: z.string().min(2, "Country must be at least 2 characters"),
      phone: z.string().min(5, "Phone must be at least 5 characters"),
    })
    .optional(),
  paymentMethod: z.enum(["PAYSTACK", "CARD"]),
});

const updateOrderStatusSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
});

export { createOrderSchema, updateOrderStatusSchema };
