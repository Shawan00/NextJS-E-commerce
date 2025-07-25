"use client";

import { CategoryType } from "@/schemaValidation/category.schema";

function CategoryList({ initialCategories }: { initialCategories: CategoryType[] }) {
  return (
    <div>
      <h1>{initialCategories.map((category) => category.name)}</h1>
    </div>
  )
}

export default CategoryList;