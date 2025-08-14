import { getCategories } from "@/service/category";
import CreateCategoryForm from "./createCategoryForm";
import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Create Category | Manage FurStore",
};

export default async function CreateCategoryPage() {
  const categories = await getCategories();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">Create Category</h1>
      <CreateCategoryForm initialCategories={categories || []} />
    </>
  )
}