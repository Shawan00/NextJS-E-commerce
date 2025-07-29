import BreadcrumbCustom from "@/components/customer/breadcrumb";
import { getProductById } from "@/service/product";
import { notFound } from "next/navigation";
import ProductImages from "./productImages";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import AddToCart from "./addToCart";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  if (!product) {
    return notFound();
  }

  const breadcrumb = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Products",
      href: "/product",
    },
    {
      label: product.name
    }
  ]

  return (
    <>
      <div className="container-custom-xl pt-5 pb-10">
        <BreadcrumbCustom breadcrumb={breadcrumb} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-12">
          <ProductImages thumbnail={product.thumbnail} images={product.images.map((image) => image.imageUrl)} />
          <section className="xl:pt-2.5">
            <div className="flex justify-between items-start gap-4 mb-5">
              <h1 className="text-3xl font-normal text-justify">{product.name}</h1>
              {product.discountPercent && (
                <div className="flex flex-col items-center text-accent text-2xl font-bold">
                  <span>{product.discountPercent}%</span>
                  <span className="text-sm px-2 py-0.5 bg-accent text-white rounded-md">OFF</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-5">
              <div className="flex flex-col gap-2">
                <span className="text-3xl font-semibold">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price * (1 - product.discountPercent / 100))}</span>
                {product.discountPercent && (
                  <span className="text-muted-foreground">M.R.P: <del>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</del></span>
                )}
              </div>
              <div>
                {product.stock > 0 ? (
                  <div className="flex flex-col items-end">
                    <span className="text-green-500 text-xl">IN STOCK</span>
                    <div className="text-green-500 font-semibold text-rigth">{product.stock}</div>
                  </div>
                ) : (
                  <span className="text-tertiary text-xl">OUT OF STOCK</span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">SKU#:</span>
                <Badge variant={'outline'} className="text-base">{product.sku}</Badge>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-lg">Category:</span>
                <div className="flex flex-wrap gap-1">
                  {product.categories.map((category, index) => (
                    <span key={category.id}>
                      <Link
                        href={`/category/${category.id}`}
                        className="text-lg hover:underline transition-all duration-500"
                      >
                        {category.name}
                      </Link>
                      {index < product.categories.length - 1 && <span>, </span>}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-base text-muted-foreground ">{product.description}</p>
            </div>
            
            <AddToCart product={product}/>
          </section>
        </div>
      </div>
    </>
  )
}