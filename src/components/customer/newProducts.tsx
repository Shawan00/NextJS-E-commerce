"use client";

import { getProducts } from "@/service/product";
import { useEffect, useState } from "react";
import ProductCard from "./productCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import { ProductType } from "@/schemaValidation/product.schema";
import { Skeleton } from "../ui/skeleton";

function NewProducts() {
  const [products, setProducts] = useState<ProductType[]>([]);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const products = await getProducts({
        page: 1,
        pageSize: 10,
        sortField: "createdAt",
        sortBy: "desc"
      })
      if (products) setProducts(products.data);
    }
    fetchProducts();
  }, []);

  if (products.length === 0) return (
    <Skeleton className="w-full h-[300px] bg-background rounded-md" />
  );

  return (
    <>
      <Swiper
        loop={true}
        modules={[Autoplay]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        speed={500}
        spaceBetween={15}
        slidesPerView={2}
        breakpoints={{
          640: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          }
        }}
        className="w-full sm:w-1/2 md:w-2/3 xl:w-3/4 h-fit"
      >
        {products.map(product => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}

export default NewProducts;