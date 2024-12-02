"use client"

import Loading from "@/components/loading"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useQuery } from "convex/react"
import { MapIcon, TableIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { api } from "../../../../convex/_generated/api"
import { Id } from "../../../../convex/_generated/dataModel"

const Map = dynamic(() => import("@/features/barangays/components/map"), {
    ssr: false,
    loading: () => <div>Loading map...</div>
})

interface BarangayPlotsProps {
    barangayName: "Turu" | "Balitucan" | "Mapinya"
}

interface PlotWithDetails {
    _id: Id<"agriculturalPlots">;
    area: number;
    status: string;
    currentCrop: string | null;
    yields: number;
    farmerName: string;
    landUseType: string[];
}

export const BarangayPlots = ({ barangayName }: BarangayPlotsProps) => {
    const [viewMode, setViewMode] = useState<"table" | "map">("table")
    const plots = useQuery(api.admin.getBarangayPlots, {
        name: barangayName      
    }) as PlotWithDetails[] | undefined

    if (!plots) return <Loading/>

    const statusColors = {
        active: "success",
        fallow: "destructive",
        preparing: "secondary"
    } as const

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h3 className="text-lg font-medium">Agricultural Plots</h3>
                <div className="flex w-full sm:w-auto gap-2">
                    <Button 
                        variant={viewMode === "table" ? "default" : "outline"}
                        onClick={() => setViewMode("table")}
                        className="flex-1 sm:flex-none"
                    >
                        <TableIcon className="h-4 w-4 mr-2" />
                        Table View
                    </Button>
                    <Button 
                        variant={viewMode === "map" ? "default" : "outline"}
                        onClick={() => setViewMode("map")}
                        className="flex-1 sm:flex-none"
                    >
                        <MapIcon className="h-4 w-4 mr-2" />
                        Map View
                    </Button>
                </div>
            </div>

            {viewMode === "table" ? (
                <div className="rounded-md border overflow-hidden">
                    <ScrollArea className="w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="min-w-[150px]">Land Use Type</TableHead>
                                    <TableHead className="min-w-[100px]">Area (ha)</TableHead>
                                    <TableHead className="min-w-[100px]">Status</TableHead>
                                    <TableHead className="min-w-[120px]">Current Crop</TableHead>
                                    <TableHead className="min-w-[150px]">Farmer</TableHead>
                                    {/* <TableHead className="text-right min-w-[80px]">Actions</TableHead> */}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plots.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center text-muted-foreground">
                                            No plots found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    plots.map((plot) => (
                                        <TableRow key={plot._id}>
                                            <TableCell className="font-medium">
                                                {plot.landUseType.map((type: string) => 
                                                    type.charAt(0).toUpperCase() + type.slice(1)
                                                ).join(", ")}
                                            </TableCell>
                                            <TableCell>{plot.area.toFixed(2)}</TableCell>
                                            <TableCell>
                                                <Badge variant={statusColors[plot.status as keyof typeof statusColors]}>
                                                    {plot.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{plot.currentCrop || "None"}</TableCell>
                                            <TableCell>{plot.farmerName}</TableCell>
                                            {/* <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.push(`/admin/plots/${plot._id}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </TableCell> */}
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </ScrollArea>
                </div>
            ) : (
                <Card className="p-2">
                    <div className="h-[400px] sm:h-[500px] md:h-[600px] w-full">
                        <Map />
                    </div>
                </Card>
            )}
        </div>
    )
}