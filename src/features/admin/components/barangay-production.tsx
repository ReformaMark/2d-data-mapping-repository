"use client"

import { useQuery } from "convex/react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { useState } from "react"
import { api } from "../../../../convex/_generated/api"
import { BarChart3, TrendingUp, Scale } from "lucide-react"

interface BarangayProductionProps {
    barangayName: "Turu" | "Balitucan" | "Mapinya"
}

export function BarangayProduction({ barangayName }: BarangayProductionProps) {
    const currentYear = new Date().getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear.toString())

    const productionData = useQuery(api.admin.getBarangayProduction, {
        name: barangayName,
        year: selectedYear
    })

    if (!productionData) return null

    // Calculate summary statistics
    const totalProduction = productionData.reduce((sum, record) => sum + record.totalProduction, 0)
    const totalArea = productionData.reduce((sum, record) => sum + record.totalArea, 0)
    const averageYield = totalArea > 0 ? totalProduction / totalArea : 0

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Production Data</h3>
                <Select
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => currentYear - i).map(year => (
                            <SelectItem key={year} value={year.toString()}>
                                {year}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Production
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalProduction.toFixed(2)} MT
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total yield for {selectedYear}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Area
                        </CardTitle>
                        <Scale className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalArea.toFixed(2)} ha
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Harvested area in {selectedYear}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Average Yield
                        </CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {averageYield.toFixed(2)} MT/ha
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Average yield per hectare
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Quarter</TableHead>
                        <TableHead>Crop Type</TableHead>
                        <TableHead>Total Production (MT)</TableHead>
                        <TableHead>Area Harvested (ha)</TableHead>
                        <TableHead>Average Yield (MT/ha)</TableHead>
                        <TableHead>Notes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {productionData.map((record) => (
                        <TableRow key={record._id}>
                            <TableCell className="font-medium">{record.quarter}</TableCell>
                            <TableCell>{record.cropType}</TableCell>
                            <TableCell>{record.totalProduction.toFixed(2)}</TableCell>
                            <TableCell>{record.totalArea.toFixed(2)}</TableCell>
                            <TableCell>{record.averageYield.toFixed(2)}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                                {record.notes || "—"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}