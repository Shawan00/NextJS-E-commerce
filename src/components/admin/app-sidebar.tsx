"use client";

import * as React from "react"
import {
  BookOpen,
  Bot,
  Command,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/admin/nav-main"
import { NavProjects } from "@/components/admin/nav-projects"
import { NavSecondary } from "@/components/admin/nav-secondary"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Products",
      url: "/admin/product",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "List",
          url: "/admin/product",
        },
        {
          title: "Create",
          url: "/admin/product/create",
        }
      ],
    },
    {
      title: "Categories",
      url: "/admin/category",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "List",
          url: "/admin/category",
        },
        {
          title: "Create",
          url: "/admin/category/create",
        }
      ],
    },
    {
      title: "Orders",
      url: "orders",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "List",
          url: "/admin/orders",
        },
        {
          title: "Attention",
          url: "/admin/orders/attention",
        }
      ],
    },
    {
      title: "Users",
      url: "/admin/user",
      isActive: true,
      icon: BookOpen,
      items: [
        {
          title: "Admin",
          url: "/admin/admin",
        },
        {
          title: "Customer",
          url: "/admin/customer",
        }
      ],
    }
  ],
  navSecondary: [],
  projects: []
}
interface User{
  name: string,
  email: string,
  avatar: string
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = React.useState<User | null>(null)

  React.useEffect(() => {
    const get = async () => {
      const res = await fetch("/api/get-cookie/admin", {
        method: "GET"
      });
      if(!res.ok) {
        router.push("/admin/login");
        return;
      }
      const response = await res.json();
      const data = JSON.parse(response)
      setCurrentUser({
        name: data.fullName,
        avatar: data.avatar,
        email: data.email
      })
    }
    get()
  }, [])

  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="hide-scrollbar">
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {currentUser && <NavUser user={currentUser} />}
      </SidebarFooter>
    </Sidebar>
  )
}
