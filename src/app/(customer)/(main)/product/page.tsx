import BreadcrumbCustom from "@/components/customer/breadcrumb";
import ProductList from "@/components/customer/productList";
import { getProducts } from "@/service/product";

const breadcrumb = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Products",
  },
]
export default async function ProductsPage() {
  const products = await getProducts({
    page: 1,
    pageSize: 12,
    sortField: "createdAt",
    sortBy: "desc",
  });


  return (
    <div className="bg-secondary-background pt-5 pb-10">
      <div className="container-custom-lg ">
        <BreadcrumbCustom breadcrumb={breadcrumb} />
      </div>
      <h1 className="text-4xl font-bold pb-5 mb-5 text-center border-b border-secondary-foreground">Modern furniture</h1>
      <div className="container-custom-lg">
        {products && <ProductList initialProducts={products} />}
      </div>

    </div>
  )
}