"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "convex/react"
import { MapPin, Users, Wheat, BarChart } from "lucide-react"
import { api } from "../../../../convex/_generated/api"

interface BarangayOverviewProps {
    barangayName: "Turu" | "Balitucan" | "Mapinya"
}

export function BarangayOverview({ barangayName }: BarangayOverviewProps) {
    const barangayData = useQuery(api.admin.getBarangayDetails, {
        name: barangayName
    })

    if (!barangayData) return null

    const stats = [
        {
            title: "Total Area",
            value: `${barangayData.totalArea.toFixed(2)} ha`,
            icon: MapPin,
            description: "Total agricultural area",
            color: "text-emerald-500"
        },
        {
            title: "Active Farmers",
            value: barangayData.farmerCount,
            icon: Users,
            description: "Registered farmers",
            color: "text-blue-500"
        },
        {
            title: "Active Plots",
            value: barangayData.activePlots,
            icon: Wheat,
            description: "Currently cultivated plots",
            color: "text-amber-500"
        },
        {
            title: "Production Volume",
            value: `${barangayData.totalProduction.toFixed(2)} MT`,
            icon: BarChart,
            description: "Total production records this quarter",
            color: "text-purple-500"
        }
    ]

    return (
        <div className="p-4 md:p-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card
                        key={stat.title}
                        className="transition-all hover:shadow-lg hover:-translate-y-1"
                    >
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}