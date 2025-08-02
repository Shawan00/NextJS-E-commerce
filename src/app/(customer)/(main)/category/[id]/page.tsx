import BreadcrumbCustom from "@/components/customer/breadcrumb";
import ProductList from "@/components/customer/productList";
import { CategoryType } from "@/schemaValidation/category.schema";
import { getCategoryById } from "@/service/category";
import { getProducts } from "@/service/product";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
interface Breadcrumb {
  label: string;
  href?: string;
}

export default async function ProductCategroyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await getCategoryById(Number(id));

  if (!category) {
    return notFound();
  }

  const breadcrumb: Breadcrumb[] = [{
    label: "Home",
    href: "/"
  }];

  const makeBreadcrumb = (category: CategoryType) => {
    if (category.parentCategory !== undefined && category.parentCategory) {
      makeBreadcrumb(category.parentCategory);
    }
    breadcrumb.push({
      label: category.name,
      href: `/category/${category.id}`
    })
  }
  makeBreadcrumb(category);
  breadcrumb[breadcrumb.length - 1].href = undefined;

  const products = await getProducts({
    page: 1,
    pageSize: 12,
    sortField: "createdAt",
    sortBy: "desc",
    category: category.name
  })

  const displaySubCategoies = () => {
    if (category.subCategories === undefined || category.subCategories.length === 0) {
      return null;
    }

    return (
      <>
        <h3 className="text-2xl font-medium mb-4">
          Collections of
          <strong className="font-medium bg-linear-to-r from-accent to-tertiary text-transparent bg-clip-text"> {category.name}</strong>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 mb-5">
          {category.subCategories.map((subCategory) => (
            <div key={subCategory.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Link href={`/category/${subCategory.id}`}
                className="relative w-full aspect-3/1 block"
              >
                <Image
                  src={subCategory.thumbnail}
                  alt={subCategory.name}
                  fill
                  sizes="(min-width: 640px) 40vw, 90vw"
                  className="object-cover"
                  priority
                />
                <strong className="absolute bottom-0 text-white p-2 text-xl shadow-md bg-black/50 w-full">
                  {subCategory.name}
                </strong>
              </Link>
            </div>
          ))}
        </div>
      </>
    )
  }

  return (
    <div className="bg-secondary-background pt-5 pb-10">
      <div className="container-custom-lg ">
        <BreadcrumbCustom breadcrumb={breadcrumb} />
      </div>
      <h1 className="text-4xl font-bold pb-5 mb-5 text-center border-b border-secondary-foreground capitalize">{category.name}</h1>
      <div className="container-custom-lg">
        {displaySubCategoies()}
        <h3 className="text-2xl font-medium">
          Maybe you like these items
        </h3>
        {products && <ProductList initialProducts={products} />}
      </div>

    </div>
  )
}