import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreateAdminForm } from "@/features/admin/components/create-admin-form"

export default function RegisterAdminPage() {
  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">Register New Administrator</CardTitle>
          <CardDescription>
            Create a new administrator account with system-wide access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateAdminForm />
        </CardContent>
      </Card>
    </div>
  )
}