import type React from "react"
import { AdminShell } from "@/components/admin/admin-shell"
import { AuthGuard } from "@/components/auth-guard"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard requireAuth requireAdmin>
      <div className="flex h-screen bg-gray-100">
        <AdminShell>{children}</AdminShell>
      </div>
    </AuthGuard>
  )
}
