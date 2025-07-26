"use server";

import { http } from "@/lib/htpp";
import { ProductBodyType, ProductParamsType, ProductResponseType, ProductSchema, ProductType } from "@/schemaValidation/product.schema";

export const createProduct = async (productData: Omit<ProductBodyType, 'thumbnail' | 'images'> & { 
  thumbnail: string; 
  images: string[] 
}): Promise<ProductType | null> => {
  const res = await http.post<ProductResponseType>('/products', productData);
  
  if (res.status === 201) {
    return ProductSchema.parse(res.payload);
  }
  
  return null;
};

export const getProducts = async (params?: ProductParamsType): Promise<ProductResponseType | null> => {
  const res = await http.get<ProductResponseType>('/products', params);

  if (res.status === 200 && 'data' in res.payload) {
    return res.payload;
  }
  return null;
};
