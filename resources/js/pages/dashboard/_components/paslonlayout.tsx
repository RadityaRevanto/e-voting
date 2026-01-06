  import { ReactNode, useState, useEffect, useCallback } from "react";
  import * as React from "react"
  import {
    Home,
    Settings2,
  } from "lucide-react"
import { usePage } from "@inertiajs/react"
  import { NavMain } from "@/pages/dashboard/_components/nav-main"
  import { LogoutConfirmation } from "@/pages/dashboard/_components/logout-confirmation"
  import { NavUserProfile } from "@/pages/dashboard/_components/nav-user-profile"
  import { useCurrentUser } from "@/hooks/use-current-user"
  import { apiClient } from "@/lib/api-client"
  import { useProfilePhotoCache } from "@/hooks/use-profile-photo-cache"
  import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
  } from "@/components/ui/sidebar"
  import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
  import { Separator } from "@/components/ui/separator";

  // Buat komponen AppSidebarPaslon langsung di file ini
  function AppSidebarPaslon({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { url: currentUrl } = usePage();
  const { user, loading: userLoading } = useCurrentUser();
  
  // Gunakan cache untuk foto profile agar tidak re-fetch setiap ganti halaman
  const fetchPaslonProfile = useCallback(async () => {
    if (!user) return null;
    try {
      const response = await apiClient.get("/api/paslon/profile");
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data?.foto_paslon) {
          return data.data.foto_paslon;
        }
      }
      return null;
    } catch (error) {
      console.error("Error fetching paslon profile:", error);
      return null;
    }
  }, [user]);

  const { photo: fotoPaslon, loading: loadingPaslon, error: fotoError } = useProfilePhotoCache(
    "paslon",
    fetchPaslonProfile
  );

  const navMain = [
    {
      title: "Dashboard",
      url: "/paslon/dashboard",
      icon: Home,
    },
    {
      title: "Settings",
      url: "/paslon/settings",
      icon: Settings2,
    },
  ].map((item) => ({
    ...item,
    isActive: currentUrl.startsWith(item.url),
  }));

  // Handler untuk mendapatkan URL avatar
  const getAvatarUrl = (): string => {
    if (fotoPaslon && !fotoError) {
      return `/storage/${fotoPaslon}`;
    }
    return "/avatars/shadcn.jpg"; // Default avatar fallback
  };

  // Default user data jika masih loading atau error
  const userData = user ? {
    name: user.name,
    email: user.email,
    avatar: getAvatarUrl(),
  } : {
    name: "User",
    email: "",
    avatar: "/avatars/shadcn.jpg",
  };

  const loading = userLoading || loadingPaslon;

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
            <NavUserProfile user={userData} profileUrl="/paslon/profile" />
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
    );
  }

  import { useRoleSwitch } from "@/hooks/use-role-switch"

  type PaslonLayoutProps = {
    children: ReactNode;
  };

  export default function PaslonLayout({ children }: PaslonLayoutProps) {
    // Auto switch role berdasarkan route
    useRoleSwitch();
    
    return (
      <SidebarProvider>
        <AppSidebarPaslon />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="#">
                      Dashboard Paslon
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator className="hidden md:block" />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Data Calon</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 animate-in fade-in duration-500">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }