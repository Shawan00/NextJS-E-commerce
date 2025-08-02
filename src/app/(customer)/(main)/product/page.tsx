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

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ keyword: string }> }) {
  const { keyword } = await searchParams;
  const products = await getProducts({
    page: 1,
    pageSize: 12,
    sortField: "createdAt",
    sortBy: "desc",
    name: keyword || undefined
  });


  return (
    <div className="bg-secondary-background pt-5 pb-10">
      <div className="container-custom-lg ">
        <BreadcrumbCustom breadcrumb={breadcrumb} />
      </div>
      <h1 className="text-4xl font-bold pb-5 mb-5 text-center border-b border-secondary-foreground">Modern furniture</h1>
      <div className="container-custom-lg">
        {keyword ? products && products.total > 0 ? 
          <h4 className="text-2xl">Search results for &quot;{keyword}&quot;</h4> 
          : <h1 className="text-2xl">No results found for &quot;{keyword}&quot;</h1> 
          : null}
        {products && <ProductList initialProducts={products} keyword={keyword}/>}
      </div>

    </div>
  )
}