"use client";

import { ProductResponseType, ProductType } from "@/schemaValidation/product.schema";
import { getProducts } from "@/service/product";
import { useEffect, useRef, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Minus, ShoppingCart } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/features/cartSlice";
import { showToast } from "@/helper/toast";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../ui/pagination";

interface ProductListProps {
  initialProducts: ProductResponseType;
  keyword?: string;
}

interface Sort {
  sortField: "name" | "price" | "stock" | "discountPercent" | "createdAt";
  sortOrder: "desc" | "asc";
}

function ProductList({ initialProducts, keyword }: ProductListProps) {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const [products, setProducts] = useState<ProductType[]>(initialProducts.data);
  const [page, setPage] = useState(initialProducts.page);
  const [pageSize, setPageSize] = useState(initialProducts.pageSize);
  const [total, setTotal] = useState(initialProducts.total);
  const [sort, setSort] = useState<Sort>({
    sortField: "createdAt",
    sortOrder: "desc",
  });
  const [isLoading, setIsLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const fetchProducts = async (): Promise<void> => {
      setIsLoading(true);
      const response = await getProducts({
        page,
        pageSize,
        sortField: sort.sortField,
        sortBy: sort.sortOrder,
        name: keyword || undefined
      })

      if (response) {
        setProducts(response.data);
        setPage(response.page);
        setPageSize(response.pageSize);
        setTotal(response.total);
      }
      setIsLoading(false);
    }

    fetchProducts();

  }, [sort, page, pageSize, keyword]);

  // Tính toán thông tin phân trang
  const totalPages = Math.ceil(total / pageSize);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      setPage(newPage);
    }
  };

  // Hàm xử lý thay đổi pageSize
  const handlePageSizeChange = (newPageSize: string) => {
    const size = parseInt(newPageSize);
    if (size !== pageSize) {
      setPageSize(size);
      setPage(1); // Reset về trang đầu khi thay đổi kích thước trang
    }
  };

  // Tạo array các số trang để hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('ellipsis');
        pages.push(totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('ellipsis');
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push('ellipsis');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          <span className="font-medium">
            Showing {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, total)} of {total} results
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm">Items per page:</span>
            <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
              <SelectTrigger className="w-fit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="8">8</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="16">16</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="36">36</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <strong>Sort by</strong>
          <Select
            value={`${sort.sortField}-${sort.sortOrder}`}
            onValueChange={(value) => {
              setSort({
                sortField: value.split("-")[0] as "name" | "price" | "discountPercent" | "createdAt",
                sortOrder: value.split("-")[1] as "asc" | "desc",
              });
            }}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select sort field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">
                Alphabetically, A-Z
              </SelectItem>
              <SelectItem value="name-desc">
                Alphabetically, Z-A
              </SelectItem>
              <SelectItem value="price-asc">
                Price, Low to High
              </SelectItem>
              <SelectItem value="price-desc">
                Price, High to Low
              </SelectItem>
              <SelectItem value="discountPercent-asc">
                Discount, Low to High
              </SelectItem>
              <SelectItem value="discountPercent-desc">
                Discount, High to Low
              </SelectItem>
              <SelectItem value="createdAt-asc">
                Date, old to new
              </SelectItem>
              <SelectItem value="createdAt-desc">
                Date, new to old
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 lg:gap-6 mb-5">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-88" />
            <Skeleton className="w-full h-88" />
            <Skeleton className="w-full h-88" />
            <Skeleton className="w-full h-88" />
            <Skeleton className="w-full h-88" />
            <Skeleton className="w-full h-88" />
            <Skeleton className="w-full h-88" />
            <Skeleton className="w-full h-88" />
          </>
        ) : (
          <>
            {products.map(product => (
              <Link key={product.id} href={`/product/${product.id}`}>
                <div className="group w-full h-fit bg-background rounded-xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-102 transition-all duration-300">
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
                    {isMobile ? (
                      <>
                        <Button
                          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-0
                             !bg-accent !text-secondary rounded-xs border border-accent"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            dispatch(addToCart({ product, quantity: 1 }));
                            showToast('success', 'Product added to cart');
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" strokeWidth={3} />
                          QUICK ADD
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 translate-y-1/2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100
                         !bg-accent !text-secondary rounded-xs border border-accent transition-all duration-300 ease-in-out cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          dispatch(addToCart({ product, quantity: 1 }));
                          showToast('success', 'Product added to cart');
                        }}
                      >
                        <ShoppingCart className="w-4 h-4" strokeWidth={3} />
                        QUICK ADD
                      </Button>
                    )}

                  </div>
                  <div className="px-4 py-3 h-28">
                    <span className="text-xs mb-2 text-muted-foreground">{product.sku}</span>
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <div className="flex items-center gap-2 justify-end">
                      <strong className="text-accent">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price * (1 - product.discountPercent / 100))}</strong>
                      {product.discountPercent && (
                        <del className="text-secondary-foreground">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(product.price)}</del>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((pageNum, index) => (
              <PaginationItem key={index}>
                {pageNum === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handlePageChange(pageNum as number)}
                    isActive={pageNum === page}
                    className="cursor-pointer"
                  >
                    {pageNum}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(page + 1)}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </>
  )

}

export default ProductList;