import { type LucideIcon } from "lucide-react"
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
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild 
              tooltip={item.title} 
              isActive={item.isActive}
              className="group-data-[collapsible=icon]:justify-center"
            >
              <a href={item.url} className="flex items-center gap-6 group-data-[collapsible=icon]:justify-center transition-colors duration-200 w-full">
                {item.icon && (
                  <item.icon 
                    className={`h-7 w-7 flex-shrink-0 transition-colors duration-200 ${
                      item.isActive 
                        ? 'text-white' 
                        : 'text-[#53599b] peer-hover/menu-button:text-white'
                    }`} 
                  />
                )}
                <span 
                  className={`group-data-[collapsible=icon]:hidden font-bold text-lg transition-colors duration-200 ${
                    item.isActive 
                      ? 'text-white' 
                      : 'text-[#53599b] peer-hover/menu-button:text-white'
                  }`}
                >
                  {item.title}
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
