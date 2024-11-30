"use client"

import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { api } from "../../../../convex/_generated/api"
import { MapIcon, Eye, TableIcon } from "lucide-react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import dynamic from "next/dynamic"
import Loading from "@/components/loading"

const Map = dynamic(() => import("@/features/barangays/components/map"), {
    ssr: false,
    loading: () => <div>Loading map...</div>
})

interface BarangayPlotsProps {
    barangayName: "Turu" | "Balitucan" | "Mapinya"
}

export const BarangayPlots = ({ barangayName }: BarangayPlotsProps) => {
    const router = useRouter()
    const [viewMode, setViewMode] = useState<"table" | "map">("table")
    const plots = useQuery(api.admin.getBarangayPlots, {
        name: barangayName      
    })

    if (!plots) return <Loading/>

    const statusColors = {
        active: "default",
        fallow: "destructive",
        preparing: "outline"
    } as const

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Agricultural Plots</h3>
                <div className="space-x-2">
                    <Button 
                        variant={viewMode === "table" ? "default" : "outline"}
                        onClick={() => setViewMode("table")}
                    >
                        <TableIcon className="h-4 w-4 mr-2" />
                        Table View
                    </Button>
                    <Button 
                        variant={viewMode === "map" ? "default" : "outline"}
                        onClick={() => setViewMode("map")}
                    >
                        <MapIcon className="h-4 w-4 mr-2" />
                        Map View
                    </Button>
                </div>
            </div>

            {viewMode === "table" ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Land Use Type</TableHead>
                            <TableHead>Area (ha)</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Current Crop</TableHead>
                            <TableHead>Farmer</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {plots?.map((plot) => (
                            <TableRow key={plot._id}>
                                <TableCell className="font-medium">{plot.landUseType}</TableCell>
                                <TableCell>{plot.area.toFixed(2)}</TableCell>
                                <TableCell>
                                    <Badge variant={statusColors[plot.status as keyof typeof statusColors]}>
                                        {plot.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{plot.currentCrop || "None"}</TableCell>
                                <TableCell>{plot.farmerName}</TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => router.push(`/admin/plots/${plot._id}`)}
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : (
                <div className="h-[600px] w-full">
                    <Map />
                </div>
            )}
        </div>
    )
}