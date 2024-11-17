import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { CreateAdminForm } from "@/features/admin/components/create-admin-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function RegisterAdminPage() {
  return (
    <div className="space-y-6 p-6 max-w-3xl mx-auto">
      <Link href="/admin/user-management">
        <Button variant="default" size="sm" className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </Link>
      
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