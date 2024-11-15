"use client"

import { useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const BarangayStats = () => {
    const stats = useQuery(api.admin.getDashboardStats)

    if (!stats) return null

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Agricultural Area
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.totalPlots}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                        Active Farmers
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.totalFarmers}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Production
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.totalProductionRecords}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
