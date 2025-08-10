"use client";

import { Search } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { getProducts } from "@/service/product";
import { useState, useEffect, useRef } from "react";
import { ProductType } from "@/schemaValidation/product.schema";
import Image from "next/image";
import Link from "next/link";

function SearchProduct() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const response = await getProducts({
      name: query,
      page: 1,
      pageSize: 5
    });

    if (response && response.data) {
      setSearchResults(response.data);
    } else {
      setSearchResults([]);
    }

    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setIsLoading(true);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setIsDropdownOpen(value.length > 0);

    if (value.trim()) {
      debounceTimer.current = setTimeout(() => {
        searchProducts(value);
      }, 800);
    } else {
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/product?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsSheetOpen(false);
      setSearchQuery("");
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setIsDropdownOpen(false);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    }
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
      <SheetTrigger>
        <Search />
      </SheetTrigger>
      <SheetContent side="top" className="container-custom-lg pb-5">
        <SheetHeader className="pb-0">
          <SheetTitle>Search Products</SheetTitle>
        </SheetHeader>
        <form className="mt-4" onSubmit={handleSearchSubmit}>
          <div className="flex gap-2 xl:gap-4 relative">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                className="pl-8 pr-4"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleInputChange}
                onFocus={() => searchQuery.length > 0 && setIsDropdownOpen(true)}
              />
            </div>
            <Button type="submit">Search</Button>
          </div>

          {isDropdownOpen && (
            <div className="absolute top-full left-1/10 right-1/10 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-[300px] overflow-y-auto">
              {isLoading ? (
                <div className="px-4 py-2 text-sm font-medium text-gray-900">Searching...</div>
              ) : searchResults.length > 0 ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-100">
                    Search Results
                  </div>
                  {searchResults.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.id}`}
                      onClick={() => {
                        setIsDropdownOpen(false);
                        setIsSheetOpen(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <div className="size-17 overflow-hidden">
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          width={70}
                          height={70}
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{product.name}</p>
                        <div className="flex items-center gap-2">
                          {product.discountPercent > 0 ? (
                            <>
                              <p className="text-xs text-tertiary font-medium">
                                ${(product.price * (1 - product.discountPercent / 100)).toFixed(2)}
                              </p>
                              <p className="text-xs text-gray-400 line-through">
                                ${product.price}
                              </p>
                            </>
                          ) : (
                            <p className="text-xs text-gray-500">${product.price}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </>
              ) : searchQuery.trim() && !isLoading ? (
                <div className="px-4 py-2 text-sm text-gray-500">
                  No products found
                </div>
              ) : null}
            </div>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}

export default SearchProduct;