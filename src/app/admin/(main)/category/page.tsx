import { getCategories } from "@/service/category";
import { Plus } from "lucide-react";
import Link from "next/link";
import CategoryList from "./CategoryList";

export default async function CategoryPage() {
  const categories = await getCategories();

  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">List Category</h1>
        <Link
          href="/admin/category/create"
          className="bg-accent text-secondary font-medium px-5 py-2 rounded-sm hover:shadow-sm
          flex items-center gap-2"
        >
          <Plus />
          Add Category
        </Link>
      </div>

      {categories && categories.length > 0 ? (
        <CategoryList initialCategories={categories} />
      ) : (
        <div className="text-center text-primary py-8">
          No categories found
        </div>
      )}
    </>
  );
}