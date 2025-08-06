"use server";

import { http } from "@/lib/htpp"
import { CategoryResponseType, CategoryType } from "@/schemaValidation/category.schema"

export const getCategories = async (): Promise<CategoryType[] | null> => {
  const response = await http.get<CategoryResponseType>("/category");

  if (response.status === 200 && 'data' in response.payload) {
    return response.payload.data
  }
  return null
}

export const getCategoryById = async (id: number): Promise<CategoryType | null> => {
  const res = await http.get<CategoryType>(`/category/${id}`)

  if (res.status === 200) {
    return res.payload as CategoryType
  }
  return null
}

export const updateCategory = async (id: number, data: CategoryType): Promise<{ success: boolean, message?: string }> => {
  const res = await http.patch<CategoryType>(`/category/${id}`, data);
  if (res.status === 200) {
    return { success: true }
  }
  if ('message' in res.payload) {
    return { success: false, message: res.payload.message }
  }
  return { success: false, message: 'Failed to update category' }
}

export const deleteCategory = async (id: number): Promise<{ success: boolean, message?: string }> => {
  const res = await http.delete<{message: string }>(`/category`, id);

  if (res.status === 200) {
    return { success: true }
  }
  return { success: false, message: res.payload.message || 'Failed to delete category' }
}