import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AdminPageHeader } from "@/components/admin/page-header"
import { AdminUsersTable } from "@/components/admin/users-table"

export default function AdminUsers() {
  return (
    <div className="flex flex-col gap-5">
      <AdminPageHeader heading="Users" text="Manage your users">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </AdminPageHeader>

      <AdminUsersTable />
    </div>
  )
}
