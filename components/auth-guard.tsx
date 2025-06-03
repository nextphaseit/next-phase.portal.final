"use client"

import type React from "react"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAuth = false, requireAdmin = false }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (requireAuth && !session) {
      router.push("/auth/signin")
      return
    }

    if (requireAdmin && (!session || session.user?.role !== "admin")) {
      router.push("/")
      return
    }
  }, [session, status, requireAuth, requireAdmin, router])

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  if (requireAuth && !session) {
    return null
  }

  if (requireAdmin && (!session || session.user?.role !== "admin")) {
    return null
  }

  return <>{children}</>
}
