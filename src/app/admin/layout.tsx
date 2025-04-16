import type React from "react"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import AdminSidebar from "@/components/admin/sidebar"
import { getServerSession } from "next-auth"

export const metadata = {
  title: "Admin Portal | Travel Planner",
  description: "Manage your travel planner website",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Check if user is authenticated and has admin role
  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  )
}
