import { type LucideIcon } from "lucide-react"
import { Link } from "@inertiajs/react"
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
  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-2">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              tooltip={item.title} 
              isActive={item.isActive}
              className="group-data-[collapsible=icon]:justify-center"
            >
              <Link 
                href={item.url} 
                className={`flex items-center gap-5 group-data-[collapsible=icon]:justify-center transition-all duration-200 w-full px-5 py-4 rounded-2xl ${
                  item.isActive 
                    ? 'bg-gradient-to-r from-[#6A5ACD] to-[#9370DB] shadow-md' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {item.icon && (
                  <item.icon 
                    className={`h-8 w-8 flex-shrink-0 transition-colors duration-200 ${
                      item.isActive 
                        ? 'text-white' 
                        : 'text-[#53599b] peer-hover/menu-button:text-white'
                    }`} 
                  />
                )}
                <span 
                  className={`group-data-[collapsible=icon]:hidden font-semibold text-xl transition-colors duration-200 ${
                    item.isActive 
                      ? 'text-white' 
                      : 'text-[#53599b] peer-hover/menu-button:text-white'
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
