import { ProductType } from "@/schemaValidation/product.schema";
import { Minus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }: { product: ProductType }) {

  return (
    <Link key={product.id} href={`/product/${product.id}`}>
      <div className="group w-full h-fit bg-background rounded-xs overflow-hidden shadow-sm hover:shadow-lg hover:scale-102 transition-all duration-300">
        <div className="relative w-full aspect-3/4 flex items-center justify-center">
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            sizes="(min-width: 400px) 50vw, (min-width: 768px) 33vw, (min-width: 1024px) 20vw, (min-width: 1280px) 20vw, 50vw"
            className="object-cover"
          />
          {product.discountPercent && (
            <div className="flex items-center gap-0.5 absolute top-2 right-2 bg-red-600 text-secondary px-2 py-1 rounded-full text-sm font-semibold">
              <Minus className="w-2 h-2" strokeWidth={5} /> {product.discountPercent}%
            </div>
          )}
        </div>
        <div className="px-4 py-3 flex flex-col justify-between">
          <h4 className="text-2xl sm:text-md lg:text-xl text-center truncate">{product.name}</h4>
          <div className="flex items-center gap-2 justify-center">
            <b className="text-accent font-medium">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price * (1 - product.discountPercent / 100))}</b>
            {product.discountPercent && (
              <del className="text-secondary-foreground">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</del>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}