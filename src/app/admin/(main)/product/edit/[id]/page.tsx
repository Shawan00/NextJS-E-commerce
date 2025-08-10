import { getCategories } from "@/service/category";
import { getProductById } from "@/service/product";
import EditProductForm from "./editProductForm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product | Manage FurStore",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  const categories = await getCategories();

  if (!product) {
    return notFound();
  }

  return (
    <>
      <h1 className="text-2xl font-bold">Edit Product</h1>
      <EditProductForm initialProduct={product} initialCategories={categories || []} />
    </>
  );
}
