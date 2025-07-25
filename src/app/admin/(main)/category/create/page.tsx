import { getCategories } from "@/service/category";
import CreateCategoryForm from "./createCategoryForm";

export default async function CreateCategoryPage() {
  const categories = await getCategories();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">Create Category</h1>
      <CreateCategoryForm initialCategories={categories || []} />
    </>
  )
}