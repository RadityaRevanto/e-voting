import { type LucideIcon } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  // Ambil URL saat ini dari Inertia dan normalkan biar cocok dengan item.url
  const { url: currentUrl } = usePage()
  const normalizedUrl = currentUrl.startsWith("/")
    ? currentUrl
    : `/${currentUrl}`

  const isItemActive = (itemUrl: string, explicit?: boolean) => {
    if (typeof explicit === "boolean") return explicit

    const normalizedItemUrl = itemUrl.startsWith("/")
      ? itemUrl
      : `/${itemUrl}`

    // Aktif jika persis sama atau sub-route (misal /user/vote/123)
    return (
      normalizedUrl === normalizedItemUrl ||
      normalizedUrl.startsWith(`${normalizedItemUrl}/`)
    )
  }

  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-2">
        {items.map((item) => (
          // Derive active state jika belum diset di data
          // Mulai dengan prefix match biar sub-route juga aktif
          // (misal /user/vote/123 tetap dianggap aktif)
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              tooltip={item.title} 
              isActive={isItemActive(item.url, item.isActive)}
              className="group-data-[collapsible=icon]:justify-center rounded-2xl"
            >
              <Link 
                href={item.url} 
                className={`flex items-center gap-5 group-data-[collapsible=icon]:justify-center transition-all duration-200 w-full px-5 py-4 rounded-2xl ${
                  isItemActive(item.url, item.isActive) 
                    ? 'bg-gradient-to-r from-[#6A5ACD] to-[#9370DB] shadow-md text-white' 
                    : 'text-[#53599b] group-hover/menu-item:text-white'
                }`}
              >
                {item.icon && (
                  <item.icon 
                    className={`h-8 w-8 flex-shrink-0 transition-colors duration-200 ${
                      isItemActive(item.url, item.isActive) 
                        ? 'text-white' 
                        : 'text-[#53599b] group-hover/menu-item:text-white'
                    }`} 
                  />
                )}
                <span 
                  className={`group-data-[collapsible=icon]:hidden font-semibold text-xl transition-colors duration-200 ${
                    isItemActive(item.url, item.isActive) 
                      ? 'text-white' 
                      : 'text-[#53599b] group-hover/menu-item:text-white'
                  }`}
                >
                  {item.title}
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
