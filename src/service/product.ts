"use server";

import { http } from "@/lib/htpp";
import { ProductBodyType, ProductParamsType, ProductResponseType, ProductType, ProductUpdateDataType } from "@/schemaValidation/product.schema";

export const createProduct = async (productData: Omit<ProductBodyType, 'thumbnail' | 'images'> & { 
  thumbnail: string; 
  images: string[] 
}): Promise<{success: boolean, message?: string}> => {
  const res = await http.post<ProductType>('/products', productData);
  
  if (res.status === 201) {
    return { success: true }
  }
  if ('message' in res.payload) {
    return { success: false, message: res.payload.message }
  }
  return { success: false, message: 'Failed to update product' }
};

export const getProducts = async (params?: ProductParamsType): Promise<ProductResponseType | null> => {
  const res = await http.get<ProductResponseType>('/products', params);

  if (res.status === 200 && 'data' in res.payload) {
    return res.payload;
  }
  return null;
};

export const getProductById = async (id: number): Promise<ProductType | null> => {
  const res = await http.get<ProductType>(`/products/${id}`);

  if (res.status === 200 && 'id' in res.payload) {
    return res.payload;
  }
  return null;
}

export const getBestSellers = async (): Promise<ProductResponseType | null> => {
  const res = await http.get<ProductResponseType>('/products/best-seller', {
    page: 1,
    pageSize: 9
  });
  if (res.status === 200 && 'data' in res.payload) {
    return res.payload;
  }
  return null;
}

export const updateProduct = async (id: number, productData: ProductUpdateDataType): Promise<{ success: boolean, message?: string }> => {
  const res = await http.patch<ProductType>(`/products/${id}`, productData);
  if (res.status === 200) {
    return { success: true }
  }
  if ('message' in res.payload) {
    return { success: false, message: res.payload.message }
  }
  return { success: false, message: 'Failed to update product' }
}

export const deleteProduct = async (id: number): Promise<{ success: boolean, message?: string }> => {
  const res = await http.delete<{message: string }>(`/products`, id);
  console.log(res);
  if (res.status === 200) {
    return { success: true }
  }
  return { success: false, message: res.payload.message || 'Failed to delete product' }
}