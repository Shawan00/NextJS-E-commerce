import { z } from "zod";

type Category = {
  id: number;
  parentId: number | null;
  name: string;
  thumbnail: string;
  subCategories?: Category[];
  parentCategory?: Category;
};

export const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.number(),
    parentId: z.number().nullable(),
    name: z.string(),
    thumbnail: z.string(),
    parentCategory: CategorySchema.optional(),
    subCategories: z.array(CategorySchema).optional(),
  }).strip()
);
export type CategoryType = z.infer<typeof CategorySchema>;

export const FlattenCategorySchema = z.object({
  id: z.number(),
  name: z.string(),
  thumbnail: z.string(),
  level: z.number(),
}).strip();
export type FlattenCategoryType = z.infer<typeof FlattenCategorySchema>;

export const CategoryBody = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  thumbnail: z.instanceof(File, { message: "Please select a valid image file" }),
  parentId: z.number().optional(),
}).strip();
export type CategoryBodyType = z.infer<typeof CategoryBody>;

export const CategoryEditBody = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  thumbnail: z.instanceof(File, { message: "Please select a valid image file" }).optional(),
  parentId: z.number().optional(),
}).strip();
export type CategoryEditBodyType = z.infer<typeof CategoryEditBody>;

export const CategoryResponse = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  data: z.array(CategorySchema),
}).strip();
export type CategoryResponseType = z.infer<typeof CategoryResponse>;