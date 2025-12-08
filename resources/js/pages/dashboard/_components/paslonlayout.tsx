  import { ReactNode } from "react";
  import * as React from "react"
  import {
    Home,
    Settings2,
    LogOut,
  } from "lucide-react"
  import { Link } from "@inertiajs/react"
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
    const data = {
      user: {
        name: "Aditya Eka",
        email: "aditya@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      navMain: [
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
      ],
    };

    return (
      <Sidebar 
        collapsible="icon" 
        variant="floating"
        className="[&>div[data-slot='sidebar-inner']]:bg-[#eaedff] [&>div[data-slot='sidebar-inner']]:rounded-r-2xl [&>div[data-slot='sidebar-inner']]:rounded-l-none [&>div[data-slot='sidebar-inner']]:border-r-0 [&>div[data-slot='sidebar-inner']]:shadow-none"
        {...props}
      >
        <SidebarHeader className="border-b-0">
          <NavUserProfile user={data.user} />
        </SidebarHeader>
        <SidebarContent className="px-2 group-data-[collapsible=icon]:px-1">
          <NavMain items={data.navMain} />
        </SidebarContent>
        <SidebarFooter className="border-t-0 px-2 pb-4 group-data-[collapsible=icon]:px-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                tooltip="Log-Out"
                className="group-data-[collapsible=icon]:justify-center rounded-2xl"
              >
                <Link href="#" className="flex items-center gap-6 group-data-[collapsible=icon]:justify-center transition-colors duration-200 w-full px-5 py-4 rounded-2xl text-[#53599b] group-hover/menu-item:text-white">
                  <LogOut className="h-7 w-7 flex-shrink-0 text-[#53599b] group-hover/menu-item:text-white transition-colors duration-200" />
                  <span className="group-data-[collapsible=icon]:hidden font-bold text-lg text-[#53599b] group-hover/menu-item:text-white transition-colors duration-200">Log-Out</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    );
  }

  type PaslonLayoutProps = {
    children: ReactNode;
  };

  export default function PaslonLayout({ children }: PaslonLayoutProps) {
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
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }