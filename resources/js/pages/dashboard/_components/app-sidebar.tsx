"use client"

import * as React from "react"
import {
  Home,
  CheckSquare,
  FileText,
  Sparkles,
  Settings2,
  LogOut,
} from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import { isSameUrl } from "@/lib/utils"

import { NavMain } from "@/pages/dashboard/_components/nav-main"
import { NavUserProfile } from "@/pages/dashboard/_components/nav-user-profile"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Vote",
    url: "/admin/vote",
    icon: CheckSquare,
  },
  {
    title: "Vote Guideline",
    url: "/admin/voteguideline",
    icon: FileText,
  },
  {
    title: "Generate",
    url: "/admin/generate",
    icon: Sparkles,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings2,
  },
]

const userData = {
  name: "Aditya Eka",
  email: "aditya@example.com",
  avatar: "/avatars/shadcn.jpg",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const page = usePage()
  const currentUrl = page.url

  const navMain = navItems.map((item) => ({
    ...item,
    isActive: isSameUrl(currentUrl, item.url),
  }))

  return (
    <Sidebar 
      collapsible="icon" 
      variant="floating"
      className="[&>div[data-slot='sidebar-inner']]:bg-[#eaedff] [&>div[data-slot='sidebar-inner']]:rounded-r-2xl [&>div[data-slot='sidebar-inner']]:rounded-l-none [&>div[data-slot='sidebar-inner']]:border-r-0 [&>div[data-slot='sidebar-inner']]:shadow-none"
      {...props}
    >
      <SidebarHeader className="border-b-0">
        <NavUserProfile user={userData} />
      </SidebarHeader>
      <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1">
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t-0 px-2 pb-4 group-data-[collapsible=icon]:px-1">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              asChild 
              tooltip="Log-Out"
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Link href="#" className="flex items-center gap-5 group-data-[collapsible=icon]:justify-center transition-colors duration-200 w-full px-5 py-4 rounded-2xl hover:bg-gray-100">
                <LogOut className="h-8 w-8 flex-shrink-0 text-[#53599b] peer-hover/menu-button:text-white transition-colors duration-200" />
                <span className="group-data-[collapsible=icon]:hidden font-semibold text-xl text-[#53599b] peer-hover/menu-button:text-white transition-colors duration-200">Log-Out</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
