import { getBestSellers } from "@/service/product";
import ProductCard from "./productCard";

export const dynamic = 'force-dynamic';

export default async function BestSellers() {
  const products = await getBestSellers()

  if (!products || products.data.length < 9) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-11 gap-5 lg:gap-8">
      <div className="order-1 md:order-2 md:col-span-3 block my-auto">
        <ProductCard product={products.data[0]} />
      </div>
      <div className="order-2 md:order-1 md:col-span-4 grid grid-cols-2 grid-rows-2 gap-3 xl:gap-8">
        <ProductCard product={products.data[1]} />
        <ProductCard product={products.data[2]} />
        <ProductCard product={products.data[3]} />
        <ProductCard product={products.data[4]} />
      </div>
      <div className="order-3 md:order-3 md:col-span-4 grid grid-cols-2 grid-rows-2 gap-3 xl:gap-8">
        <ProductCard product={products.data[5]} />
        <ProductCard product={products.data[6]} />
        <ProductCard product={products.data[7]} />
        <ProductCard product={products.data[8]} />
      </div>
    </div>
  )
}