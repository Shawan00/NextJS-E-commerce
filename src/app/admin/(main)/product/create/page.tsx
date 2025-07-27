import { getCategories } from "@/service/category";
import CreateProductForm from "./createProductForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Product | Manage FurStore",
};

export default async function CreateProductPage() {
  const categories = await getCategories();

  return (
    <>
      <h1 className="text-2xl font-semibold mb-5">Create Product</h1>
      <CreateProductForm initialCategories={categories || []} />
    </>
  )
}