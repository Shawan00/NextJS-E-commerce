"use client";

import Link from "next/link";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle } from "../ui/navigation-menu";
import Logo from "./logo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Search, ShoppingCart, User } from "lucide-react";

interface CategoryType {
  id: number;
  name: string;
  thumbnail: string;
  children?: CategoryType[];
}

export default function Header() {

  const categories: CategoryType[] = [
    {
      id: 1,
      name: "Category 1-1",
      thumbnail: "https://placehold.co/200x200?text=1-1",
      children: [
        {
          id: 2,
          name: "Category 2-1",
          thumbnail: "https://placehold.co/200x200?text=2-1",
          children: [
            {
              id: 3,
              name: "Category 3-1",
              thumbnail: "https://placehold.co/200x200?text=3-1"
            },
            {
              id: 4,
              name: "Category 3-2",
              thumbnail: "https://placehold.co/200x200?text=3-2"
            },
            {
              id: 5,
              name: "Category 3-3",
              thumbnail: "https://placehold.co/200x200?text=3-3"
            },
            {
              id: 6,
              name: "Category 3-4",
              thumbnail: "https://placehold.co/200x200?text=3-4"
            }
          ]
        },
        {
          id: 7,
          name: "Category 2-2",
          thumbnail: "https://placehold.co/200x200?text=2-2",
          children: [
            {
              id: 8,
              name: "Category 3-1",
              thumbnail: "https://placehold.co/200x200?text=3-1"
            },
            {
              id: 9,
              name: "Category 3-2",
              thumbnail: "https://placehold.co/200x200?text=3-2"
            },
            {
              id: 10,
              name: "Category 3-3",
              thumbnail: "https://placehold.co/200x200?text=3-3"
            },
            {
              id: 11,
              name: "Category 3-4",
              thumbnail: "https://placehold.co/200x200?text=3-4"
            }
          ]
        },
        {
          id: 12,
          name: "Category 2-3",
          thumbnail: "https://placehold.co/200x200?text=2-3",
          children: [
            {
              id: 13,
              name: "Category 3-1",
              thumbnail: "https://placehold.co/200x200?text=3-1"
            },
            {
              id: 14,
              name: "Category 3-2",
              thumbnail: "https://placehold.co/200x200?text=3-2"
            },
            {
              id: 15,
              name: "Category 3-3",
              thumbnail: "https://placehold.co/200x200?text=3-3"
            },
            {
              id: 16,
              name: "Category 3-4",
              thumbnail: "https://placehold.co/200x200?text=3-4"
            }
          ]
        },
        {
          id: 17,
          name: "Category 2-4",
          thumbnail: "https://placehold.co/200x200?text=2-4",
          children: [
            {
              id: 18,
              name: "Category 3-1",
              thumbnail: "https://placehold.co/200x200?text=3-1"
            },
            {
              id: 19,
              name: "Category 3-2",
              thumbnail: "https://placehold.co/200x200?text=3-2"
            },
            {
              id: 20,
              name: "Category 3-3",
              thumbnail: "https://placehold.co/200x200?text=3-3"
            },
            {
              id: 21,
              name: "Category 3-4",
              thumbnail: "https://placehold.co/200x200?text=3-4"
            }
          ]
        }
      ]
    },
    {
      id: 22,
      name: "Category 1-2",
      thumbnail: "https://placehold.co/200x200?text=1-2",
      children: [
        {
          id: 23,
          name: "Category 2-1",
          thumbnail: "https://placehold.co/200x200?text=2-1",
          children: [
            {
              id: 24,
              name: "Category 3-1",
              thumbnail: "https://placehold.co/200x200?text=3-1"
            },
            {
              id: 25,
              name: "Category 3-2",
              thumbnail: "https://placehold.co/200x200?text=3-2"
            },
            {
              id: 26,
              name: "Category 3-3",
              thumbnail: "https://placehold.co/200x200?text=3-3"
            },
            {
              id: 27,
              name: "Category 3-4",
              thumbnail: "https://placehold.co/200x200?text=3-4"
            }
          ]
        },
        {
          id: 28,
          name: "Category 2-2",
          thumbnail: "https://placehold.co/200x200?text=2-2",
          children: [
            {
              id: 29,
              name: "Category 3-1",
              thumbnail: "https://placehold.co/200x200?text=3-1"
            },
            {
              id: 30,
              name: "Category 3-2",
              thumbnail: "https://placehold.co/200x200?text=3-2"
            },
            {
              id: 31,
              name: "Category 3-3",
              thumbnail: "https://placehold.co/200x200?text=3-3"
            },
            {
              id: 32,
              name: "Category 3-4",
              thumbnail: "https://placehold.co/200x200?text=3-4"
            }
          ]
        }
      ]
    }
  ];


  return (
    <>
      <header className="bg-background shadow-sm mx-auto px-6 py-4
        flex items-center justify-between relative z-10"
      >
        <Logo />
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base`}>
                <Link href={"/"}>Home</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className={`${navigationMenuTriggerStyle()} text-base`}>
                <Link href={"/products"}>Products</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">Categories</NavigationMenuTrigger>
              <NavigationMenuContent className="!w-fit">
                <Tabs defaultValue={categories[0].name}
                  className="flex-row"
                >
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
                  <div className="w-fit">
                    {categories.map((category) => (
                      <TabsContent key={category.id} value={category.name}>
                        <ul className="flex gap-4">
                          {category.children?.map((subCategory) => (
                            <li key={subCategory.id} 
                              className="flex-1 flex flex-col gap-2 w-22 text-sm"
                            >
                              <Link href={`#`}
                                className="py-2 font-medium text-accent border-b mb-2"
                              >
                                {subCategory.name}
                              </Link>
                              {subCategory.children?.map((subSubCategory) => (
                                <Link key={subSubCategory.id} href={`#`}
                                  className="text-sm text-primary hover:text-accent/80 transition-colors"
                                >
                                  {subSubCategory.name}
                                </Link>
                              ))}
                            </li>
                          ))}
                        </ul>
                      </TabsContent>
                    ))}
                  </div>
                </Tabs>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-base">Other Pages</NavigationMenuTrigger>
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

        <div className="flex items-center gap-4">
          <Link href={"/"} className="text-muted-foreground hover:text-foreground">
            <Search />
          </Link>
          <button className="text-muted-foreground hover:text-foreground">
            <User />
          </button>
          <Link href={"/"} className="text-muted-foreground hover:text-foreground">
            <ShoppingCart />
          </Link>
        </div>
      </header>
    </>
  )
}
