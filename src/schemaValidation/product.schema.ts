import z from "zod";
import { CategorySchema } from "./category.schema";

const ImageSchema = z.object({
  id: z.number(),
  imageUrl: z.string()
}).strip();

export const ProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  thumbnail: z.string(),
  sku: z.string(),
  price: z.number(),
  stock: z.number(),
  description: z.string(),
  images: z.array(ImageSchema),
  categories: z.array(CategorySchema),
}).strip()
export type ProductType = z.infer<typeof ProductSchema>;

export const ProductBody = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  thumbnail: z.instanceof(File, { message: "Please select a valid image file" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.number().min(1, { message: "Price is required" }),
  stock: z.number().min(1, { message: "Stock is required" }),
  description: z.string().optional(),
  images: z.array(z.instanceof(File, { message: "Please select a valid image file" })),
  categories: z.array(z.number()),
}).strip();
export type ProductBodyType = z.infer<typeof ProductBody>;

export const ProductResponse = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  data: z.array(ProductSchema),
})
export type ProductResponseType = z.infer<typeof ProductResponse>;

export const ProductParams = z.object({
  page: z.number().optional(),
  pageSize: z.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  sortField: z.string().optional(),
  sortBy: z.enum(['asc', 'desc']).optional(),
})
export type ProductParamsType = z.infer<typeof ProductParams>;