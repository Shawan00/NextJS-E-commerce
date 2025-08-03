"use client";

import Link from "next/link";
import { memo, useEffect, useState } from "react";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { CategoryType } from "@/schemaValidation/category.schema";
import { getCategories } from "@/service/category";

function MenuHeader() {
  const [categories, setCategories] = useState<CategoryType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      const data = await getCategories();
      if (data) {
        setCategories(data);
      }
      setIsLoading(false);
    };

    fetchCategories();
  }, []);

  return (
    <>
      <NavigationMenu viewport={false} className="hidden lg:block">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base`}>
              <Link href={"/"} className="font-normal">HOME</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base`}>
              <Link href={"/product"} className="font-normal">PRODUCTS</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-base font-normal">CATEGORIES</NavigationMenuTrigger>
            <NavigationMenuContent className="!w-fit">
              {isLoading ? (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground">Loading...</p>
                </div>
              ) : categories ? (
                <Tabs defaultValue={categories[0]?.name} className="flex-row">
                  <TabsList className="w-32 h-fit p-2 flex-col gap-2">
                    {categories.map((category) => (
                      <TabsTrigger key={category.id} value={category.name}
                        className="w-full justify-start bg-background rounded-sm py-2
                        data-[state=active]:border-accent data-[state=active]:text-accent"
                      >
                        {category.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  <nav className="w-fit">
                    {categories.map((category) => (
                      <TabsContent key={category.id} value={category.name}>
                        <ul className="flex gap-4">
                          {category.subCategories?.map((subCategory) => (
                            <li key={subCategory.id}
                              className="flex-1 flex flex-col gap-2 w-28 text-sm"
                            >
                              <Link href={`/category/${subCategory.id}`}
                                className="py-2 font-medium text-accent border-b mb-2"
                              >
                                {subCategory.name}
                              </Link>
                              {subCategory.subCategories?.map((subSubCategory) => (
                                <Link key={subSubCategory.id} href={`/category/${subSubCategory.id}`}
                                  className="text-sm text-primary hover:text-accent transition-colors"
                                >
                                  {subSubCategory.name}
                                </Link>
                              ))}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    ))}
                  </nav>
                </Tabs>
              ) : (
                <div className="p-4 text-center">
                  <p className="text-sm text-muted-foreground whitespace-nowrap">No categories found</p>
                </div>
              )}
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="text-base font-normal">OTHER PAGES</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="w-[200px] flex flex-col gap-4">
                <li>
                  <NavigationMenuLink asChild>
                    <Link href={"/about"}>About Us</Link>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  )
}

export default memo(MenuHeader);