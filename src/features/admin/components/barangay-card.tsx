"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useQuery } from "convex/react"

import { MapPin, Users, Wheat } from "lucide-react"
import { useRouter } from "next/navigation"
import { api } from "../../../../convex/_generated/api"

interface BarangayCardProps {
    barangayName: "Turu" | "Balitucan" | "Mapinya"
}

export const BarangayCard = ({ barangayName }: BarangayCardProps) => {
    const router = useRouter()
    const barangayData = useQuery(api.admin.getBarangayDetails, {
        name: barangayName
    })

    if (!barangayData) return null

    return (
        <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                    <span className="text-lg md:text-xl">{barangayName}</span>
                    <MapPin className="h-5 w-5 text-emerald-500" />
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-2 py-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Active Farmers</span>
                    </div>
                    <span className="text-sm font-bold">
                        {barangayData.farmerCount}
                    </span>
                </div>
                <div className="flex items-center justify-between px-2 py-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Wheat className="h-4 w-4 text-amber-500" />
                        <span className="text-sm font-medium">Total Area</span>
                    </div>
                    <span className="text-sm font-bold">
                        {barangayData.totalArea.toFixed(2)} ha
                    </span>
                </div>
            </CardContent>
            <CardFooter>
                <Button
                    variant="default"
                    className="w-full"
                    onClick={() => router.push(`/admin/barangays/${barangayName.toLowerCase()}`)}
                >
                    View Details
                </Button>
            </CardFooter>
        </Card>
    )
}