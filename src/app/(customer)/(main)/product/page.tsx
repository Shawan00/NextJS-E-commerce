import ProductList from "@/components/customer/productList";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { getProducts } from "@/service/product";
import { Fragment } from "react";

interface Breadcrumb {
  label: string;
  href?: string;
}

const breadcrumb: Breadcrumb[] = [
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
        <Breadcrumb className="mb-5">
          <BreadcrumbList>
            {breadcrumb.map((item, index) => (
              <Fragment key={index}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-4xl font-bold pb-5 mb-5 text-center border-b border-secondary-foreground">Modern furniture</h1>
      <div className="container-custom-lg">
        {products && <ProductList initialProducts={products} />}
      </div>

    </div>
  )
}