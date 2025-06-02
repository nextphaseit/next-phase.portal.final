"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnnouncementBannerProps {
  announcement: {
    id: string
    title: string
    content: string
  }
  className?: string
}

export function AnnouncementBanner({ announcement, className }: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className={cn("relative bg-brand-blue text-white px-4 py-3", className)}>
      <div className="container flex items-center justify-between">
        <div className="flex-1 text-center sm:text-left">
          <p className="font-medium">{announcement.title}</p>
          <p className="text-sm opacity-90">{announcement.content}</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:bg-white/20 hover:text-white"
          onClick={() => setIsVisible(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </div>
    </div>
  )
}
