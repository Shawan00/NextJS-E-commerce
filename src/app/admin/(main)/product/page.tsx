import { getProducts } from "@/service/product";
import { Plus } from "lucide-react";
import Link from "next/link";
import ListProduct from "./listProduct";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product | Manage FurStore",
};

export default async function ProductPage() {

  const productResponse = await getProducts({
    sortField: 'createdAt',
    sortBy: 'desc',
    page: 1,
    pageSize: 10,
  });
  
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link href="/admin/product/create" className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-md">
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>
      <ListProduct initialProductResponse={productResponse} />
    </>
  )
}