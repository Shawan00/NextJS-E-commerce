import { z } from "zod";

type Category = {
  id: number;
  name: string;
  thumbnail: string;
  subCategories?: Category[];
};

export const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.number(),
    name: z.string(),
    thumbnail: z.string(),
    subCategories: z.array(CategorySchema).optional(),
  }).strict()
);
export type CategoryType = z.infer<typeof CategorySchema>;
