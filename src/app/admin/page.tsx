import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader heading="Admin Dashboard" text="Manage your travel planner website" />
      
      <div className="grid gap-4">
        <Link href="/admin/users" className="block">
          <Card className="hover:bg-accent/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  User Management
                </CardTitle>
                <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                  Available
                </span>
              </div>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Access user management dashboard to view, edit, and manage user accounts.</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}