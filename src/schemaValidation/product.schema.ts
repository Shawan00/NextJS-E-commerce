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
  discountPercent: z.number(),
  images: z.array(ImageSchema),
  categories: z.array(CategorySchema),
  createdAt: z.string(),
}).strip()
export type ProductType = z.infer<typeof ProductSchema>;

export const ProductBody = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  thumbnail: z.instanceof(File, { message: "Please select a valid image file" }),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.number().min(1, { message: "Price is required" }),
  stock: z.number().min(1, { message: "Stock is required" }),
  description: z.string().optional(),
  discountPercent: z.number().min(0, { message: "Discount percent must be at least 0" }).max(100, { message: "Discount percent cannot exceed 100" }),
  images: z.array(z.instanceof(File, { message: "Please select a valid image file" })),
  categories: z.array(z.number()),
  createdAt: z.string().optional(),
}).strip();
export type ProductBodyType = z.infer<typeof ProductBody>;

export const ProductEditBody = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  thumbnail: z.instanceof(File, { message: "Please select a valid image file" }).optional(),
  sku: z.string().min(1, { message: "SKU is required" }),
  price: z.number().min(1, { message: "Price is required" }),
  stock: z.number().min(1, { message: "Stock is required" }),
  description: z.string().optional(),
  discountPercent: z.number().min(0, { message: "Discount percent must be at least 0" }).max(100, { message: "Discount percent cannot exceed 100" }),
  images: z.array(z.instanceof(File, { message: "Please select a valid image file" })).optional(),
  categories: z.array(z.number()),
  createdAt: z.string().optional(),
}).strip();
export type ProductEditBodyType = z.infer<typeof ProductEditBody>;

export type ProductUpdateDataType = {
  name: string;
  thumbnail: string;
  sku: string;
  price: number;
  stock: number;
  description: string;
  discountPercent: number;
  images: string[];
  categories: number[];
};

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
  name: z.string().optional(),
  category: z.string().optional(),
  sortField: z.enum(['createdAt', 'name', 'price', 'stock', 'discountPercent']).optional(),
  sortBy: z.enum(['asc', 'desc']).optional(),
  fromAmount: z.string().optional(),
  toAmount: z.string().optional(),
})
export type ProductParamsType = z.infer<typeof ProductParams>;