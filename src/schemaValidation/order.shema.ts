import { z } from "zod";

export const BillingAddressSchema = z.object({
  customerId: z.number(),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  deliveryMethod: z.enum(["free", "standard", "express"]).default("free"),
  paymentMethod: z.enum(["cash", "paypal", "card"]).default("cash"),
});
export type BillingAddressType = z.infer<typeof BillingAddressSchema>;

export const orderBody = z.object({
  customerId: z.number(),
  phone: z.string(),
  address: z.string(),
  shippingCost: z.number(),
  deliveryMethod: z.enum(["free", "standard", "express"]),
  paymentMethod: z.enum(["cash", "paypal", "card"]),
  subTotal: z.number(),
  grandTotal: z.number(),
  products: z.array(z.object({
    productId: z.number(),
    quantity: z.number()
  }))
});
export type OrderBodyType = z.infer<typeof orderBody>;