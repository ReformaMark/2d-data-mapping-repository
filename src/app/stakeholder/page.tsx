import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, MessageSquare } from "lucide-react"
import { Suspense } from "react"

const StakeholdersPage = () => {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold tracking-tight">Stakeholder Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your stakeholder account
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Your stakeholder profile information</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading profile...</div>}>
              {/* Profile component will go here */}
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest interactions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading activity...</div>}>
              {/* Activity component will go here */}
            </Suspense>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button className="w-full justify-start" variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                View Reports
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MessageSquare className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default StakeholdersPage