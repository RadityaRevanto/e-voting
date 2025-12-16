import { ChevronRight } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Link } from "@inertiajs/react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function NavUserProfile({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className={cn(
      "flex flex-col items-center transition-all",
      isCollapsed ? "px-0 py-4" : "px-4 py-6"
    )}>
      <Avatar className={cn(
        "transition-all",
        isCollapsed ? "h-10 w-10" : "h-20 w-20 mb-3"
      )}>
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback className={cn(
          isCollapsed ? "text-xs" : "text-lg"
        )}>{initials}</AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <>
          <h3 className="font-bold text-xl mb-1 mt-3" style={{ color: '#53599b' }}>{user.name}</h3>
          <Link
            href="#"
            className="flex items-center gap-2 text-sm transition-colors"
          >
            <span className="font-normal text-gray-500">View Profile</span>
            <ChevronRight className="h-4 w-4 text-gray-500" />
          </Link>
        </>
      )}
    </div>
  )
}

