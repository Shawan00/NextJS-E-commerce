"use client"

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

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
