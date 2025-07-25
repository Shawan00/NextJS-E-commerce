"use server";

import { http } from "@/lib/htpp"
import { CategoryResponseType, CategoryType } from "@/schemaValidation/category.schema"

export const getCategories = async (): Promise<CategoryType[] | null> => {
  const res = await http.get<CategoryResponseType>('/category')

  if (res.status === 200 && 'data' in res.payload && res.payload.data.length > 0) {
    return res.payload.data
  }
  return null
}