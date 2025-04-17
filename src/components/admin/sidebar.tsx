"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Users, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: <Users className="mr-2 h-4 w-4" />,
  },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-muted/40 md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <span className="text-primary text-xl">Travel Planner Admin</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 py-4">
          <nav className="grid gap-1 px-2">
            {sidebarNavItems.map((item) => (
              <Button
                key={item.href}
                variant={pathname === item.href ? "secondary" : "ghost"}
                className={cn("justify-start", pathname === item.href ? "bg-secondary" : "")}
                asChild
              >
                <Link href={item.href}>
                  {item.icon}
                  {item.title}
                </Link>
              </Button>
            ))}
            <Button
              variant="ghost"
              className="justify-start text-red-500 hover:text-red-500 hover:bg-red-500/10 mt-4"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Button>
          </nav>
        </ScrollArea>
      </div>
    </div>
  )
}
