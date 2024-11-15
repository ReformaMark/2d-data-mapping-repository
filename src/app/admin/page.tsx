import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, FileText, MapPin, Users2 } from "lucide-react"

const statsCards = [
  {
    title: "Total Farmers",
    icon: Users2,
    value: "Loading...", 
    description: "Active farmers in the system",
    color: "text-blue-500"
  },
  {
    title: "Total Agricultural Plots",
    icon: MapPin,
    value: "Loading...",
    description: "Registered farming areas",
    color: "text-green-500"
  },
  {
    title: "Production Records", 
    icon: BarChart3,
    value: "Loading...",
    description: "Total production entries",
    color: "text-orange-500"
  },
  {
    title: "Reports Generated",
    icon: FileText,
    value: "Loading...",
    description: "System generated reports",
    color: "text-purple-500"
  }
]

const AdminPage = () => {
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
      </div>
    </Card>
  )
}

export default AdminPage