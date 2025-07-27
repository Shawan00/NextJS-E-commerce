import { getCategories, getCategoryById } from "@/service/category";
import EditCategoryForm from "./editCategoryForm";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategoryById(Number(id));
  const categories = await getCategories();

  if (!category) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Edit Category</h1>
      <EditCategoryForm initialCategory={category} initialCategories={categories || []} />
    </>
  );
}