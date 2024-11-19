"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AuditLogOverview } from "@/features/admin/components/audit-log-overview"
import { useQuery } from "convex/react"
import { Activity, BarChart3, FileText, MapPin, UserCog, Users2 } from "lucide-react"
import { api } from "../../../convex/_generated/api"



const AdminPage = () => {
  const stats = useQuery(api.admin.getDashboardOverview)

  const statsCards = [
    {
      title: "Farmers",
      icon: Users2,
      value: stats ? `${stats.activeFarmers}/${stats.totalFarmers}` : "Loading...",
      description: "Active/Total farmers",
      color: "text-blue-500"
    },
    {
      title: "Stakeholders",
      icon: UserCog,
      value: stats ? `${stats.activeStakeholders}/${stats.totalStakeholders}` : "Loading...",
      description: "Active/Total stakeholders",
      color: "text-purple-500"
    },
    {
      title: "Agricultural Plots",
      icon: MapPin,
      value: stats ? `${stats.activePlots} (${stats.totalAreaHectares}ha)` : "Loading...",
      description: "Active plots and total area",
      color: "text-green-500"
    },
    {
      title: "Recent Activity",
      icon: Activity,
      value: stats?.recentActivityCount ?? "Loading...",
      description: "Recent system activities",
      color: "text-orange-500"
    }
  ]
  return (
    <Card className="p-6">
      <div className="space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage agricultural data and system users
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((card) => (
            <Card
              key={card.title}
              className="transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {card.title}
                </CardTitle>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <AuditLogOverview />

        </div>
      </div>
    </Card>
  )
}

export default AdminPage