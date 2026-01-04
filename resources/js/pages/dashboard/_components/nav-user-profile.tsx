import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Link } from "@inertiajs/react"
import { useSidebar } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { useInitials } from "@/hooks/use-initials"

export function NavUserProfile({
  user,
  profileUrl,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
  profileUrl?: string
}) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const [imageError, setImageError] = useState(false)
  const getInitials = useInitials()
  
  // Gunakan hook useInitials untuk mendapatkan inisial
  const initials = getInitials(user.name) || "AE"

  // Reset error saat avatar URL berubah
  useEffect(() => {
    setImageError(false)
  }, [user.avatar])

  // Handler untuk error saat loading gambar
  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <div className={cn(
      "flex flex-col items-center transition-all",
      isCollapsed ? "px-0 py-4" : "px-4 py-6"
    )}>
      <Avatar className={cn(
        "transition-all",
        isCollapsed ? "h-10 w-10" : "h-20 w-20 mb-3"
      )}>
        {!imageError && user.avatar ? (
          <AvatarImage 
            src={user.avatar} 
            alt={user.name}
            onError={handleImageError}
          />
        ) : null}
        <AvatarFallback className={cn(
          "bg-muted flex size-full items-center justify-center rounded-full",
          isCollapsed ? "text-xs" : "text-lg"
        )}>{initials}</AvatarFallback>
      </Avatar>
      {!isCollapsed && (
        <>
          <h3 className="font-bold text-xl mb-1 mt-3" style={{ color: '#53599b' }}>{user.name}</h3>
          {profileUrl && (
            <Link
              href={profileUrl}
              className="flex items-center gap-2 text-sm transition-colors hover:text-[#53589a]"
            >
              <span className="font-normal text-gray-500 hover:text-[#53589a]">View Profile</span>
              <ChevronRight className="h-4 w-4 text-gray-500" />
            </Link>
          )}
        </>
      )}
    </div>
  )
}

