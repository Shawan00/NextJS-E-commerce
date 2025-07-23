"use server";

import { http } from "@/lib/htpp"
import { CategoryType } from "@/schemaValidation/category.schema"

interface CategoryResponse {
  total: number,
  page: number,
  pageSize: number,
  data: CategoryType[]
}

export const getCategories = async (): Promise<CategoryType[] | null> => {
  const res = await http.get<CategoryResponse>('/category')

  if (res.status === 200 && 'data' in res.payload && res.payload.data.length > 0) {
    return res.payload.data
  }
  return null
}