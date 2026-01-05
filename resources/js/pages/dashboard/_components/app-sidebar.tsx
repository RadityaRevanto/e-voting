"use client"

import * as React from "react"
import {
  Home,
  CheckSquare,
  FileText,
  Sparkles,
  Settings2,
  UserPlus,
} from "lucide-react"
import { usePage } from "@inertiajs/react"
import { isSameUrl } from "@/lib/utils"
import { useCurrentUser } from "@/hooks/use-current-user"
import { apiClient } from "@/lib/api-client"

import { NavMain } from "@/pages/dashboard/_components/nav-main"
import { NavUserProfile } from "@/pages/dashboard/_components/nav-user-profile"
import { LogoutConfirmation } from "@/pages/dashboard/_components/logout-confirmation"
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
    title: "Register NIK",
    url: "/admin/register-nik",
    icon: UserPlus,
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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const page = usePage()
  const currentUrl = page.url
  const { user, loading: userLoading } = useCurrentUser()
  const [fotoAdmin, setFotoAdmin] = React.useState<string | null>(null)
  const [fotoError, setFotoError] = React.useState(false)
  const [loadingFoto, setLoadingFoto] = React.useState(true)

  // Fetch data admin untuk mendapatkan foto profil
  React.useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoadingFoto(true)
        setFotoError(false)
        const response = await apiClient.get("/api/admin/profile")

        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data?.foto_admin) {
            setFotoAdmin(data.data.foto_admin)
          }
        }
      } catch (error) {
        console.error("Error fetching admin profile:", error)
        setFotoError(true)
      } finally {
        setLoadingFoto(false)
      }
    }

    if (!userLoading && user) {
      fetchAdminProfile()
    }
  }, [user, userLoading])

  const navMain = navItems.map((item) => ({
    ...item,
    isActive: isSameUrl(currentUrl, item.url),
  }))

  // Handler untuk mendapatkan URL avatar
  const getAvatarUrl = (): string => {
    if (fotoAdmin && !fotoError) {
      return `/storage/${fotoAdmin}`
    }
    return "" // Kosongkan agar fallback ke inisial
  }

  // Default user data jika masih loading atau error
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: getAvatarUrl(),
  } : {
    name: "User",
    email: "",
    avatar: "",
  }

  const loading = userLoading || loadingFoto

  return (
    <Sidebar 
      collapsible="icon" 
      variant="floating"
      className="[&>div[data-slot='sidebar-inner']]:bg-[#eaedff] [&>div[data-slot='sidebar-inner']]:rounded-r-2xl [&>div[data-slot='sidebar-inner']]:rounded-l-none [&>div[data-slot='sidebar-inner']]:border-r-0 [&>div[data-slot='sidebar-inner']]:shadow-none"
      {...props}
    >
      <SidebarHeader className="border-b-0">
        {loading ? (
          <div className="flex flex-col items-center px-4 py-6">
            <div className="h-20 w-20 rounded-full bg-gray-200 animate-pulse mb-3" />
            <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-1 mt-3" />
          </div>
        ) : (
          <NavUserProfile user={userData} profileUrl="/admin/profile" />
        )}
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
              className="group-data-[collapsible=icon]:justify-center rounded-2xl"
            >
              <LogoutConfirmation />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
